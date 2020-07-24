import React, { Component } from "react";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import {
    formatMessageWithValues, withModulesManager, withHistory, historyPush,
    Form, ProgressOrError
} from "@openimis/fe-core";
import { RIGHT_FAMILY, RIGHT_FAMILY_EDIT } from "../constants";
import FamilyMasterPanel from "../components/FamilyMasterPanel";

import { fetchFamily, newFamily } from "../actions";
import FamilyInsureesOverview from "../components/FamilyInsureesOverview";

const styles = theme => ({
    page: theme.page,
});

const INSUREE_FAMILY_OVERVIEW_PANELS_CONTRIBUTION_KEY = "insuree.FamilyOverview.panels"

class FamilyOverviewPage extends Component {

    state = {
        reset: 0,
        family: {},
    }

    componentDidMount() {
        document.title = formatMessageWithValues(this.props.intl, "insuree", "FamilyOverview.title", { label: "" })
        if (this.props.family_uuid) {
            this.setState(
                (state, props) => ({ family_uuid: props.family_uuid, family: {} }),
                e => this.props.fetchFamily(
                    this.props.modulesManager,
                    this.props.family_uuid
                )
            )
        } else if (!!this.props.family && !!this.props.family.uuid) {
            this.setState(
                (state, props) => ({ family_uuid: null, family: null }),
                e => this.props.newFamily())
        }
    }

    label = () => !!this.state.family && !!this.state.family.headInsuree ? `${this.state.family.headInsuree.lastName} ${this.state.family.headInsuree.otherNames} (${this.state.family.headInsuree.chfId})` : ""

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((prevState.family && prevState.family.headInsuree && prevState.family.headInsuree.chfId)
            !== (this.state.family && this.state.family.headInsuree && this.state.family.headInsuree.chfId)) {
            document.title = formatMessageWithValues(this.props.intl, "insuree", "FamilyOverview.title", { label: this.label() })
        }
        if ((prevProps.family_uuid !== this.props.family_uuid) && !!this.props.family_uuid) {
            this.setState(
                (state, props) => ({ family_uuid: props.family_uuid, family: null }),
                e => this.props.fetchFamily(
                    this.props.modulesManager,
                    this.props.family_uuid
                )
            )
        } else if (prevProps.fetchedFamily !== this.props.fetchedFamily && !!this.props.fetchedFamily) {
            var family = { ...this.props.family };
            family.ext = !!family.jsonExt ? JSON.parse(family.jsonExt) : {};
            this.setState({ family, newFamily: false, family_uuid: family.uuid, reset: this.state.reset + 1 });
        }
    }

    add = () => {
        historyPush(this.props.modulesManager, this.props.history, "insuree.route.familyEdit")
    }

    render() {
        const { intl, classes, modulesManager, history, rights, family_uuid, fetchingFamily, fetchedFamily, errorFamily, insuree } = this.props;
        const { family } = this.state;
        if (!rights.includes(RIGHT_FAMILY)) return null;
        return (
            <div className={classes.page}>
                <ProgressOrError progress={fetchingFamily} error={errorFamily} />
                {(!!fetchedFamily || !family_uuid) && (
                    <Form
                        module="insuree"
                        title="FamilyOverview.title"
                        titleParams={{ label: this.label()}}
                        edited_id={family_uuid}
                        edited={family}
                        reset={this.state.reset}
                        HeadPanel={FamilyMasterPanel}
                        Panels={[FamilyInsureesOverview]}
                        contributedPanelsKey={INSUREE_FAMILY_OVERVIEW_PANELS_CONTRIBUTION_KEY}
                        family={family}
                        insuree={insuree}
                        back={!this.props.family_uuid ? null : e => historyPush(modulesManager, history, "insuree.route.findFamily")}
                    />
                )}
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
    family_uuid: props.match.params.family_uuid,
    fetchingFamily: state.insuree.fetchingFamily,
    errorFamily: state.insuree.errorFamily,
    fetchedFamily: state.insuree.fetchedFamily,
    family: state.insuree.family,
    insuree: state.insuree.insuree,
})

export default withHistory(withModulesManager(connect(mapStateToProps, { fetchFamily, newFamily })(
    injectIntl(withTheme(withStyles(styles)(FamilyOverviewPage))
    ))));