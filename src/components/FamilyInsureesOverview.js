import React, { Component, Fragment } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { injectIntl } from 'react-intl';
import _ from "lodash";
import { Paper } from "@material-ui/core";
import {
    formatMessage, Table
} from "@openimis/fe-core";

import { fetchFamilyMembers } from "../actions";


const styles = theme => ({
    paper: theme.paper.paper,
});

class FamilyInsureesOverview extends Component {

    // componentDidMount() {
    //     if (!!this.props.edited && this.props.edited.headInsuree && this.props.edited.headInsuree.chfId) {
    //         this.props.fetchInsureeFamily(this.props.modulesManager, this.props.edited.headInsuree.chfId);
    //     }
    // }

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
        i => (i.gender && i.gender.code) || "",
        i => i.dob || "",
        i => i.cardIssued || "",
    ];

    render() {
        const { intl, classes, familyMembers } = this.props;
        return (
            <Paper className={classes.paper}>

                <Table
                    module="insuree"
                    header={formatMessage(intl, "insuree", "Family.insurees")}
                    headers={this.headers}
                    itemFormatters={this.formatters}
                    items={familyMembers || []}
                    onDelete={idx => console.log("delete " + idx)}
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


export default injectIntl(withTheme(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(FamilyInsureesOverview))));