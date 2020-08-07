import React, { Component, Fragment } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { injectIntl } from 'react-intl';
import _ from "lodash";
import { Checkbox, Paper, IconButton, Grid, Divider, Typography, Tooltip } from "@material-ui/core";
import { 
    Search as SearchIcon,
    Add as AddIcon,
    PersonAdd as AddExistingIcon,
    PersonPin as SetHeadIcon,
    Delete as DeleteIcon,
    Clear as RemoveIcon,
} from '@material-ui/icons';
import {
    formatMessage, formatMessageWithValues,
    withModulesManager, formatDateFromISO, historyPush,
    FormattedMessage,
    formatSorter, sort,
    Table, PagedDataHandler
} from "@openimis/fe-core";
import EnquiryDialog from "./EnquiryDialog";
import { fetchFamilyMembers, selectFamilyMember, deleteInsurees, removeInsurees, setFamilyHead } from "../actions";
import { RIGHT_INSUREE_DELETE } from "../constants";
import { insureeLabel, familyLabel } from "../utils/utils";

const styles = theme => ({
    paper: theme.paper.paper,
    paperHeader: theme.paper.header,
    paperHeaderAction: theme.paper.action,
    tableTitle: theme.table.title,
});

class FamilyInsureesOverview extends PagedDataHandler {

    state = {
        open: false,
        chfid: null,
    }

    constructor(props) {
        super(props);
        this.rowsPerPageOptions = props.modulesManager.getConf("fe-insuree", "familyInsureesOverview.rowsPerPageOptions", [5, 10, 20]);
        this.defaultPageSize = props.modulesManager.getConf("fe-insuree", "familyInsureesOverview.defaultPageSize", 5);
    }

    componentDidMount() {
        this.setState({ orderBy: null }, e => this.onChangeRowsPerPage(this.defaultPageSize))
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
        let prms = [];
        if (!!this.state.orderBy) {
            prms.push(`orderBy: "${this.state.orderBy}"`)
        }
        if (!!this.props.family && !!this.props.family.uuid) {
            prms.push(`familyUuid:"${this.props.family.uuid}"`);
            return prms;
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
        "",
        "",
        "",
    ];

    sorter = (attr, asc = true) => [
        () => this.setState((state, props) => ({ orderBy: sort(state.orderBy, attr, asc) }), e => this.query()),
        () => formatSorter(this.state.orderBy, attr, asc)
    ]

    headerActions = [
        this.sorter("chfId"),
        this.sorter("lastName"),
        this.sorter("otherNames"),
        this.sorter("gender"),
        this.sorter("dob"),
        this.sorter("cardIssued"),
    ];

    adornedChfId = (chfid) => (
        <Fragment>
            <IconButton size="small" onClick={e => this.setState({ open: true, chfid })}><SearchIcon /></IconButton>
            {chfid}
        </Fragment>
    )

    handleClose = () => { this.setState({ open: false, chfid: null }) }

    setHeadInsureeAction = (i) => (
        <Tooltip title={formatMessage(this.props.intl, "insuree", "familySetHeadInsuree.tooltip")}>
            <IconButton onClick={e => this.props.setFamilyHead(
                this.props.modulesManager,
                this.props.family.uuid,
                i.uuid,
                formatMessageWithValues(this.props.intl, "insuree", "SetFamilyHead.mutationLabel", { label: insureeLabel(i) }))
            }><SetHeadIcon /></IconButton>
        </Tooltip>
    )

    removeInsureeAction = (i) => (
        <Tooltip title={formatMessage(this.props.intl, "insuree", "familyRemoveInsuree.tooltip")}>
            <IconButton onClick={e => this.props.removeInsurees(
                this.props.modulesManager,
                this.props.family.uuid,
                [i.uuid],
                formatMessageWithValues(this.props.intl, "insuree", "RemoveInsurees.mutationLabel", { label: `[${i.chfId}]`, family: familyLabel(this.props.family) }))
            }><RemoveIcon /></IconButton>
        </Tooltip>
    )

    deleteInsureeAction = (i) => (
        <Tooltip title={formatMessage(this.props.intl, "insuree", "familyDeleteInsuree.tooltip")}>
            <IconButton onClick={e => this.props.deleteInsurees(
                this.props.modulesManager,
                this.props.family.uuid,
                [i.uuid],
                formatMessageWithValues(this.props.intl, "insuree", "DeleteInsurees.mutationLabel", { label: `[${i.chfId}]` }))
            }><DeleteIcon /></IconButton>
        </Tooltip>
    )

    isHead = (f, i) => i.chfId === (!!f.headInsuree && f.headInsuree.chfId)

    formatters = [
        i => this.adornedChfId(i.chfId),
        i => i.lastName || "",
        i => i.otherNames || "",
        i => (i.gender && i.gender.code) ? formatMessage(this.props.intl, "insuree", `InsureeGender.${i.gender.code}`) : "",
        i => formatDateFromISO(this.props.modulesManager, this.props.intl, i.dob),
        i => <Checkbox color="primary" readOnly={true} disabled={true} checked={i.cardIssued} />,
        i => !!this.props.readOnly || !this.props.rights.includes(RIGHT_INSUREE_DELETE) || this.isHead(this.props.family, i) ? null : this.setHeadInsureeAction(i),
        i => !!this.props.readOnly || !this.props.rights.includes(RIGHT_INSUREE_DELETE) || this.isHead(this.props.family, i) ? null : this.removeInsureeAction(i),
        i => !!this.props.readOnly || !this.props.rights.includes(RIGHT_INSUREE_DELETE) || this.isHead(this.props.family, i) ? null : this.deleteInsureeAction(i),
    ];


    addNewInsuree = () => { console.log("TODO...")}
    addExistingInsuree = () => { console.log("TODO...")}

    render() {
        const { intl, classes, pageInfo, family, familyMembers, fetchingFamilyMembers, errorFamilyMembers, rights, readOnly } = this.props;
        let actions = !!readOnly ? [] : [
            {
                doIt: this.addExistingInsuree,
                icon: <AddExistingIcon />,
                tooltip: formatMessage(intl, "insuree", "familyAddExsistingInsuree.tooltip")
            },
            {
                doIt: this.addNewInsuree,
                icon: <AddIcon />,
                tooltip: formatMessage(intl, "insuree", "familyAddNewInsuree.tooltip")
            },
        ];
        return (
            <Paper className={classes.paper}>
                <EnquiryDialog open={this.state.open} chfid={this.state.chfid} onClose={this.handleClose} />
                <Grid container alignItems="center" direction="row" className={classes.paperHeader}>
                    <Grid item xs={8}>
                        <Typography className={classes.tableTitle}><FormattedMessage module="insuree" id="Family.insurees" values={{ count: pageInfo.totalCount }} /></Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Grid container justify="flex-end">
                            {actions.map((a, idx) => {
                                return (
                                    <Grid item key={`form-action-${idx}`} className={classes.paperHeaderAction}>
                                        <Tooltip title={a.tooltip}>
                                            <IconButton onClick={a.doIt}>
                                                {a.icon}
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                )
                            })}
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Divider />
                    </Grid>
                </Grid>
                <Table
                    module="insuree"
                    headers={this.headers}
                    headerActions={this.headerActions}
                    itemFormatters={this.formatters}
                    items={(!!family && familyMembers) || []}
                    fetching={fetchingFamilyMembers}
                    error={errorFamilyMembers}
                    onDoubleClick={this.onDoubleClick}
                    withSelection={"single"}
                    onChangeSelection={this.onChangeSelection}
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
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
    family: state.insuree.family,
    fetchingFamilyMembers: state.insuree.fetchingFamilyMembers,
    fetchedFamilyMembers: state.insuree.fetchedFamilyMembers,
    familyMembers: state.insuree.familyMembers,
    pageInfo: state.insuree.familyMembersPageInfo,
    errorFamilyMembers: state.insuree.errorFamilyMembers,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetch: fetchFamilyMembers, selectFamilyMember, deleteInsurees, removeInsurees, setFamilyHead }, dispatch);
};


export default withModulesManager(injectIntl(withTheme(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(FamilyInsureesOverview)))));