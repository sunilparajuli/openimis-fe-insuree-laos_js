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

import { fetchFamily } from "../actions";
import FamilyInsureesOverview from "../components/FamilyInsureesOverview";

const styles = theme => ({
    page: theme.page,
});

const INSUREE_FAMILY_OVERVIEW_PANELS_CONTRIBUTION_KEY = "insuree.FamilyOverview.panels"

class FamiliyOverview extends Component {

    state = {
        reset: 0,
        family: {
            headInsuree: {
                chfId: null,
            }
        }
    }

    componentDidMount() {
        document.title = formatMessageWithValues(this.props.intl, "insuree", "FamilyOverview.title", { chfId: "" })
        if (this.props.family_uuid) {
            this.setState(
                (state, props) => ({ family_uuid: props.family_uuid }),
                e => this.props.fetchFamily(
                    this.props.modulesManager,
                    this.props.family_uuid
                )
            )
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.family.headInsuree.chfId !== this.state.family.headInsuree.chfId) {
            document.title = formatMessageWithValues(this.props.intl, "insuree", "FamilyOverview.title", { chfId: this.state.family.headInsuree.chfId })
        }
        if (prevProps.fetchedFamily !== this.props.fetchedFamily && !!this.props.fetchedFamily) {
            var family = { ...this.props.family };
            family.ext = !!family.jsonExt ? JSON.parse(family.jsonExt) : {};
            this.setState({ family, family_uuid: family.uuid, reset: this.state.reset + 1 });
        }
    }

    add = () => {
        historyPush(this.props.modulesManager, this.props.history, "insuree.route.familyEdit")
    }

    render() {
        const { intl, classes, modulesManager, history, rights, family_uuid, family, fetchingFamily, errorFamily } = this.props;
        if (!rights.includes(RIGHT_FAMILY)) return null;


        return (
            <div className={classes.page}>
                <ProgressOrError progress={fetchingFamily} error={errorFamily} />
                {!!family && (
                    <Form
                        module="insuree"
                        title="FamilyOverview.title"
                        titleParams={{ chfId: !!family.headInsuree && family.headInsuree.chfId }}
                        edited_id={family_uuid}
                        edited={this.state.family}
                        reset={this.state.reset}
                        HeadPanel={FamilyMasterPanel}
                        Panels={[FamilyInsureesOverview]}
                        contributedPanelsKey={INSUREE_FAMILY_OVERVIEW_PANELS_CONTRIBUTION_KEY}
                        family={this.state.family}
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
})

export default withHistory(withModulesManager(connect(mapStateToProps, { fetchFamily })(
    injectIntl(withTheme(withStyles(styles)(FamiliyOverview))
    ))));