import React, { Component, Fragment } from "react";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import ReplayIcon from "@material-ui/icons/Replay"
import {
    formatMessageWithValues, withModulesManager, withHistory, historyPush,
    Form, ProgressOrError, journalize, coreConfirm
} from "@openimis/fe-core";
import { RIGHT_FAMILY, RIGHT_FAMILY_EDIT } from "../constants";
import FamilyMasterPanel from "./FamilyMasterPanel";

import { fetchFamily, newFamily, createFamily } from "../actions";
import FamilyInsureesOverview from "./FamilyInsureesOverview";
import HeadInsureeMasterPanel from "./HeadInsureeMasterPanel";

import { insureeLabel } from "../utils/utils";

const styles = theme => ({
    lockedPage: theme.page.locked
});

const INSUREE_FAMILY_PANELS_CONTRIBUTION_KEY = "insuree.Family.panels"
const INSUREE_FAMILY_OVERVIEW_PANELS_CONTRIBUTION_KEY = "insuree.FamilyOverview.panels"

class FamilyForm extends Component {

    state = {
        lockNew: false,
        reset: 0,
        family: this._newFamily(),
        newFamily: true,
        consirmedAction: null,
    }

    _newFamily() {
        let family = {};
        family.jsonExt = {};
        return family;
    }

    componentDidMount() {
        document.title = formatMessageWithValues(this.props.intl, "insuree", !!this.props.overview ? "FamilyOverview.title" : "Family.title", { label: "" })
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
        if ((prevState.family && prevState.family.headInsuree && prevState.family.headInsuree.chfId)
            !== (this.state.family && this.state.family.headInsuree && this.state.family.headInsuree.chfId)) {
            document.title = formatMessageWithValues(this.props.intl, "insuree", !!this.props.overview ? "FamilyOverview.title" : "Family.title", { label: insureeLabel(this.state.family.headInsuree) })
        }
        if (prevProps.fetchedFamily !== this.props.fetchedFamily && !!this.props.fetchedFamily) {
            var family = this.props.family;
            family.ext = !!family.jsonExt ? JSON.parse(family.jsonExt) : {};
            this.setState(
                { family, family_uuid: family.uuid, lockNew: false, newFamily: false });
        } else if (prevProps.family_uuid && !this.props.family_uuid) {
            document.title = formatMessageWithValues(this.props.intl, "insuree", !!this.props.overview ? "FamilyOverview.title" : "Family.title", { label: insureeLabel(this.state.family.headInsuree) })
            this.setState({ family: this._newFamily(), newFamily: true, lockNew: false, family_uuid: null });
        } else if (prevProps.submittingMutation && !this.props.submittingMutation) {
            this.props.journalize(this.props.mutation);
            this.setState({ reset: this.state.reset + 1 });
        } else if (prevProps.confirmed !== this.props.confirmed && !!this.props.confirmed && !!this.state.confirmedAction) {
            this.state.confirmedAction();
        }
    }

    _add = () => {
        this.setState((state) => ({
            family: this._newFamily(),
            newFamily: true,
            lockNew: false,
            reset: state.reset + 1,
        }),
            e => {
                this.props.add();
                this.forceUpdate();
            }
        )
    }

    reload = () => {
        this.props.fetchFamily(
            this.props.modulesManager,
            this.state.family_uuid,
            !!this.state.family.headInsuree ? this.state.family.headInsuree.chfId : null
        );
    }

    canSave = () => {
        if (!this.state.family.location) return false;
        if (!this.state.family.headInsuree) return false;
        if (!this.state.family.headInsuree.chfId) return false;
        if (!this.state.family.headInsuree.lastName) return false;
        if (!this.state.family.headInsuree.otherNames) return false;
        if (!this.state.family.headInsuree.dob) return false;
        if (!!this.state.family.headInsuree.photo && (!this.state.family.headInsuree.photo.date || !this.state.family.headInsuree.photo.officerId)) return false;
        return true;
    }

    _save = (family) => {
        this.setState(
            { lockNew: !family.uuid }, // avoid duplicates
            e => this.props.save(family))
    }

    onEditedChanged = family => {
        this.setState({ family, newFamily: false })
    }

    onActionToConfirm = (title, message, confirmedAction) => {
        this.setState(
            { confirmedAction },
            this.props.coreConfirm(
                title,
                message
            )
        )
    }

    render() {
        const { classes, rights,
            family_uuid, fetchingFamily, fetchedFamily, errorFamily, insuree,
            overview = false, openFamilyButton, readOnly = false,
            add, save, back, mutation } = this.props;
        const { family } = this.state;
        if (!rights.includes(RIGHT_FAMILY)) return null;
        let runningMutation = (!!mutation && !!mutation.familyUuid && mutation.familyUuid === family_uuid && (!mutation.status || mutation.status === 0)) ||
            (!!family && !!family.clientMutationId)
        let actions = [{
            doIt: this.reload,
            icon: <ReplayIcon />,
            onlyIfDirty: !readOnly && !runningMutation
        }];
        return (
            <div className={!!runningMutation ? classes.lockedPage : null}>
                <ProgressOrError progress={fetchingFamily} error={errorFamily} />
                {((!!fetchedFamily && !!family && family.uuid === family_uuid) || !family_uuid) && (
                    <Form
                        module="insuree"
                        title="FamilyOverview.title"
                        titleParams={{ label: insureeLabel(this.state.family.headInsuree) }}
                        edited_id={family_uuid}
                        edited={family}
                        reset={this.state.reset}
                        back={back}
                        add={!!add && !this.state.newFamily ? this._add : null}
                        readOnly={readOnly || runningMutation}
                        actions={actions}
                        openFamilyButton={openFamilyButton}
                        overview={overview}
                        HeadPanel={FamilyMasterPanel}
                        Panels={overview ? [FamilyInsureesOverview] : [HeadInsureeMasterPanel]}
                        contributedPanelsKey={overview ? INSUREE_FAMILY_OVERVIEW_PANELS_CONTRIBUTION_KEY : INSUREE_FAMILY_PANELS_CONTRIBUTION_KEY}
                        family={family}
                        insuree={insuree}
                        onEditedChanged={this.onEditedChanged}
                        canSave={this.canSave}
                        save={!!save ? this._save : null}
                        onActionToConfirm={this.onActionToConfirm}
                    />
                )}
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
    fetchingFamily: state.insuree.fetchingFamily,
    errorFamily: state.insuree.errorFamily,
    fetchedFamily: state.insuree.fetchedFamily,
    family: state.insuree.family,
    submittingMutation: state.insuree.submittingMutation,
    mutation: state.insuree.mutation,
    insuree: state.insuree.insuree,
    confirmed: state.core.confirmed,
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchFamily, newFamily, createFamily, journalize, coreConfirm }, dispatch);
};

export default withHistory(withModulesManager(connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(withTheme(withStyles(styles)(FamilyForm))
    ))));