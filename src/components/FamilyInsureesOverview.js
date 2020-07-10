import React, { Component, Fragment } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { injectIntl } from 'react-intl';
import _ from "lodash";
import { Checkbox, Paper } from "@material-ui/core";
import {
    formatMessage, withModulesManager, formatDateFromISO,
    Table
} from "@openimis/fe-core";

import { fetchFamilyMembers } from "../actions";


const styles = theme => ({
    paper: theme.paper.paper,
});

class FamilyInsureesOverview extends Component {

    componentDidUpdate(prevProps, prevState, snapshot) {
        if ((!!prevProps.edited && prevProps.edited.uuid) !== (!!this.props.edited && this.props.edited.uuid)) {
            this.props.fetchFamilyMembers(this.props.modulesManager, this.props.edited.uuid);
        }
    }


    headers = [
        "Insuree.chfId",
        "Insuree.lastName",
        "Insuree.otherNames",
        "Insuree.gender",
        "Insuree.dob",
        "Insuree.cardIssued",
    ];

    formatters = [
        i => i.chfId || "",
        i => i.lastName || "",
        i => i.otherNames || "",
        i => (i.gender && i.gender.code) ? formatMessage(this.props.intl, "insuree", `InsureeGender.${i.gender.code}`) : "",
        i => formatDateFromISO(this.props.modulesManager, this.props.intl, i.dob),
        i => <Checkbox color="primary" readOnly={true} disabled={true} checked={i.cardIssued} />,
    ];

    render() {
        const { intl, classes, familyMembers, fetchingFamilyMembers, errorFamilyMembers } = this.props;

        return (
            <Paper className={classes.paper}>
                <Table
                    module="insuree"
                    header={formatMessage(intl, "insuree", "Family.insurees")}
                    headers={this.headers}
                    itemFormatters={this.formatters}
                    items={familyMembers || []}
                    fetching={fetchingFamilyMembers}
                    error={errorFamilyMembers}
                    onDelete={idx => console.log("TODO: delete " + idx)}
                />
            </Paper>
        )
    }
}

const mapStateToProps = state => ({
    fetchingFamilyMembers: state.insuree.fetchingFamilyMembers,
    fetchedFamilyMembers: state.insuree.fetchedFamilyMembers,
    familyMembers: state.insuree.familyMembers,
    errorFamilyMembers: state.insuree.errorFamilyMembers,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchFamilyMembers }, dispatch);
};


export default withModulesManager(injectIntl(withTheme(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(FamilyInsureesOverview)))));