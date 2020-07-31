import React, { Component, Fragment } from "react";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import ReplayIcon from "@material-ui/icons/Replay"
import {
    formatMessageWithValues, withModulesManager, withHistory, historyPush,
    Form, ProgressOrError, journalize
} from "@openimis/fe-core";
import { RIGHT_FAMILY, RIGHT_FAMILY_EDIT } from "../constants";
import FamilyMasterPanel from "./FamilyMasterPanel";

import { fetchFamily, newFamily, createFamily } from "../actions";
import FamilyInsureesOverview from "./FamilyInsureesOverview";
import HeadInsureeForm from "./HeadInsureeForm";


const styles = theme => ({
});

const INSUREE_FAMILY_PANELS_CONTRIBUTION_KEY = "insuree.Family.panels"
const INSUREE_FAMILY_OVERVIEW_PANELS_CONTRIBUTION_KEY = "insuree.FamilyOverview.panels"

class FamilyForm extends Component {

    state = {
        lockNew: false,
        reset: 0,
        family: this._newFamily(),
        newFamily: true,
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

    label = () => !!this.state.family && !!this.state.family.headInsuree ? `${this.state.family.headInsuree.lastName} ${this.state.family.headInsuree.otherNames} (${this.state.family.headInsuree.chfId})` : ""

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((prevState.family && prevState.family.headInsuree && prevState.family.headInsuree.chfId)
            !== (this.state.family && this.state.family.headInsuree && this.state.family.headInsuree.chfId)) {
            document.title = formatMessageWithValues(this.props.intl, "insuree", !!this.props.overview ? "FamilyOverview.title" : "Family.title", { label: this.label() })
        }
        if (prevProps.fetchedFamily !== this.props.fetchedFamily && !!this.props.fetchedFamily) {
            var family = this.props.family;
            family.ext = !!family.jsonExt ? JSON.parse(family.jsonExt) : {};
            this.setState(
                { family, family_uuid: family.uuid, lockNew: false, newFamily: false });
        } else if (prevProps.family_uuid && !this.props.family_uuid) {
            document.title = formatMessageWithValues(this.props.intl, "insuree", !!this.props.overview ? "FamilyOverview.title" : "Family.title", { label: this.label() })            
            this.setState({ family: this._newFamily(), newFamily: true, lockNew: false, family_uuid: null });
        // } else if ((prevProps.family_uuid !== this.props.family_uuid) && !!this.props.family_uuid) {
        //     this.setState(
        //         (state, props) => ({ family_uuid: props.family_uuid, family: null }),
        //         e => this.props.fetchFamily(
        //             this.props.modulesManager,
        //             this.props.family_uuid
        //         )
        //     )
        } else if (prevProps.submittingMutation && !this.props.submittingMutation) {
            this.props.journalize(this.props.mutation);
            this.setState({ reset: this.state.reset + 1 });
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
            !!this.state.family.headInsuree ? this.state.family.headInsuree.chfId: null
        );
    }

    canSave = () => {
        if (!this.state.family.headInsuree) return false;
        if (!this.state.family.headInsuree.chfId) return false;
        if (!this.state.family.headInsuree.lastName) return false;
        if (!this.state.family.headInsuree.otherNames) return false;
        if (!this.state.family.headInsuree.dob) return false;
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

    render() {
        const { modulesManager, history, rights, 
            family_uuid, fetchingFamily, fetchedFamily, errorFamily, insuree,
            overview = false, openFamilyButton, readOnly = false,
            add, save, back } = this.props;
        const { family } = this.state;
        if (!rights.includes(RIGHT_FAMILY)) return null;
        let actions = [{
            doIt: this.reload,
            icon: <ReplayIcon />,
            onlyIfDirty: !readOnly
        }];
        return (
            <Fragment>
                <ProgressOrError progress={fetchingFamily} error={errorFamily} />
                {((!!fetchedFamily && !!family && family.uuid === family_uuid) || !family_uuid) && (
                    <Form
                        module="insuree"
                        edited_id={family_uuid}
                        edited={family}
                        reset={this.state.reset}
                        title="FamilyOverview.title"
                        titleParams={{ label: this.label() }}
                        back={back}
                        add={!!add && !this.state.newFamily ? this._add : null}
                        readOnly={readOnly}
                        actions={actions}
                        openFamilyButton={openFamilyButton}
                        overview={overview}
                        HeadPanel={overview ? FamilyMasterPanel : FamilyMasterPanel}
                        Panels={overview ? [FamilyInsureesOverview] : [HeadInsureeForm]}
                        contributedPanelsKey={overview ? INSUREE_FAMILY_OVERVIEW_PANELS_CONTRIBUTION_KEY : INSUREE_FAMILY_PANELS_CONTRIBUTION_KEY}
                        family={family}
                        insuree={insuree}
                        onEditedChanged={this.onEditedChanged}
                        canSave={this.canSave}
                        save={!overview && !!save ? this._save : null}
                    />
                )}
            </Fragment>
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
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchFamily, newFamily, createFamily, journalize }, dispatch);
};

export default withHistory(withModulesManager(connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(withTheme(withStyles(styles)(FamilyForm))
    ))));