import React, { Component, Fragment } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { injectIntl } from 'react-intl';
import _ from "lodash";
import { Checkbox, Paper } from "@material-ui/core";
import {
    formatMessage, formatMessageWithValues,
    withModulesManager, formatDateFromISO, historyPush,
    Table, PagedDataHandler
} from "@openimis/fe-core";

import { fetchFamilyMembers, selectFamilyMember } from "../actions";


const styles = theme => ({
    paper: theme.paper.paper,
});

class FamilyInsureesOverview extends PagedDataHandler {

    constructor(props) {
        super(props);
        this.rowsPerPageOptions = props.modulesManager.getConf("fe-insuree", "familyInsureesOverview.rowsPerPageOptions", [5, 10, 20]);
        this.defaultPageSize = props.modulesManager.getConf("fe-insuree", "familyInsureesOverview.defaultPageSize", 5);
    }

    componentDidMount() {
        this.onChangeRowsPerPage(this.defaultPageSize);
    }

    familyChanged = (prevProps) => (!prevProps.family && !!this.props.family) ||
        (
            !!prevProps.family &&
            !!this.props.family &&
            (prevProps.family.uuid == null || prevProps.family.uuid !== this.props.family.uuid)
        )

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.familyChanged(prevProps)) {
            this.query();
        }
    }

    queryPrms = () => {
        if (!!this.props.family && !!this.props.family.uuid) {
            return [`familyUuid:"${this.props.family.uuid}"`];
        }
        return null;
    }

    onDoubleClick = (i, newTab = false) => {
        historyPush(this.props.modulesManager, this.props.history, "insuree.route.insuree", [i.uuid, this.props.family.uuid], newTab)
    }

    onChangeSelection = (i) => {
        this.props.selectFamilyMember(i[0] || null)
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
        const { intl, classes, pageInfo, family, familyMembers, fetchingFamilyMembers, errorFamilyMembers } = this.props;
        return (
            <Paper className={classes.paper}>
                <Table
                    module="insuree"
                    header={formatMessageWithValues(intl, "insuree", "Family.insurees", { count: pageInfo.totalCount })}
                    headers={this.headers}
                    itemFormatters={this.formatters}
                    items={(!!family && familyMembers) || []}
                    fetching={fetchingFamilyMembers}
                    error={errorFamilyMembers}
                    onDoubleClick={this.onDoubleClick}
                    withSelection={"single"}
                    onChangeSelection={this.onChangeSelection}
                    onDelete={idx => alert("Not implemented yet...")}
                    withPagination={true}
                    rowsPerPageOptions={this.rowsPerPageOptions}
                    defaultPageSize={this.defaultPageSize}
                    page={this.currentPage()}
                    pageSize={this.currentPageSize()}
                    count={pageInfo.totalCount}
                    onChangePage={this.onChangePage}
                    onChangeRowsPerPage={this.onChangeRowsPerPage}
                />
            </Paper>
        )
    }
}

const mapStateToProps = state => ({
    family: state.insuree.family,
    fetchingFamilyMembers: state.insuree.fetchingFamilyMembers,
    fetchedFamilyMembers: state.insuree.fetchedFamilyMembers,
    familyMembers: state.insuree.familyMembers,
    pageInfo: state.insuree.familyMembersPageInfo,
    errorFamilyMembers: state.insuree.errorFamilyMembers,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetch: fetchFamilyMembers, selectFamilyMember }, dispatch);
};


export default withModulesManager(injectIntl(withTheme(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(FamilyInsureesOverview)))));