import React, { Component } from "react";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import {
    formatMessageWithValues, withModulesManager, withHistory, historyPush,
    Form, ProgressOrError
} from "@openimis/fe-core";
import { RIGHT_INSUREE, ROUTE_INSUREE_FAMILY_OVERVIEW } from "../constants";
import FamilyDisplayPanel from "../components/FamilyDisplayPanel";


import { fetchInsureeFull } from "../actions";

const styles = theme => ({
    page: theme.page,
});

const INSUREE_INSUREE_PANELS_CONTRIBUTION_KEY = "insuree.InsureePage.panels"

class InsureePage extends Component {

    state = {
        reset: 0,
        insuree: {}
    }

    componentDidMount() {
        document.title = formatMessageWithValues(this.props.intl, "insuree", "Insuree.title", { chfId: "" })
        if (this.props.insuree_uuid) {
            this.setState(
                (state, props) => ({ insuree_uuid: props.insuree_uuid }),
                e => this.props.fetchInsureeFull(
                    this.props.modulesManager,
                    this.props.insuree_uuid
                )
            )
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevState.insuree.chfId !== this.state.insuree.chfId) {
            document.title = formatMessageWithValues(this.props.intl, "insuree", "Insuree.title", { chfId: this.state.insuree.chfId })
        }
        if (prevProps.fetchedInsuree !== this.props.fetchedInsuree && !!this.props.fetchedInsuree) {
            var insuree = { ...this.props.insuree };
            insuree.ext = !!insuree.jsonExt ? JSON.parse(insuree.jsonExt) : {};
            this.setState({ insuree, insuree_uuid: insuree.uuid, reset: this.state.reset + 1 });
        }
    }

    render() {
        const { intl, classes, modulesManager, history, rights, insuree_uuid, insuree, fetchingInsuree, errorInsuree } = this.props;
        if (!rights.includes(RIGHT_INSUREE)) return null;


        return (
            <div className={classes.page}>
                <ProgressOrError progress={fetchingInsuree} error={errorInsuree} />
                {!!insuree && (
                    <Form
                        module="insuree"
                        title="Insuree.title"
                        titleParams={{ chfId: insuree.chfId }}
                        edited_id={insuree_uuid}
                        edited={this.state.insuree}
                        reset={this.state.reset}
                        HeadPanel={FamilyDisplayPanel}
                        contributedPanelsKey={INSUREE_INSUREE_PANELS_CONTRIBUTION_KEY}
                        insuree={this.state.insuree}
                        back={e => historyPush(modulesManager, history, "insuree.route.familyOverview", [insuree.family.uuid])}
                    />
                )}
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
    insuree_uuid: props.match.params.insuree_uuid,
    fetchingInsuree: state.insuree.fetchingInsuree,
    errorInsuree: state.insuree.errorInsuree,
    fetchedInsuree: state.insuree.fetchedInsuree,
    insuree: state.insuree.insuree,
})

export default withHistory(withModulesManager(connect(mapStateToProps, { fetchInsureeFull })(
    injectIntl(withTheme(withStyles(styles)(InsureePage))
    ))));