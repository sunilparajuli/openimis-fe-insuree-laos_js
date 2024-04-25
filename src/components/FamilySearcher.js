import React, { Component, Fragment } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl } from "react-intl";
import { Checkbox, IconButton, Tooltip } from "@material-ui/core";
import TabIcon from "@material-ui/icons/Tab";
import PrintIcon from '@material-ui/icons/Print';
import {
  withModulesManager,
  formatMessageWithValues,
  formatDateFromISO,
  formatMessage,
  Searcher,
  journalize,
  coreConfirm
} from "@openimis/fe-core";

import { fetchFamilySummaries, deleteFamily, printMembership } from "../actions";
import { Delete as DeleteIcon } from "@material-ui/icons";
import FamilyFilter from "./FamilyFilter";
import { DEFAULT, RIGHT_FAMILY_DELETE } from "../constants";
import { familyLabel } from "../utils/utils";
import DeleteFamilyDialog from "./DeleteFamilyDialog";

const FAMILY_SEARCHER_CONTRIBUTION_KEY = "insuree.FamilySearcher";

class FamilySearcher extends Component {
  state = {
    deleteFamily: null,
    reset: 0,
    confirmedAction: null,
  };


  constructor(props) {
    super(props);
    this.rowsPerPageOptions = props.modulesManager.getConf(
      "fe-insuree",
      "familyFilter.rowsPerPageOptions",
      [10, 20, 50, 100],
    );
    this.defaultPageSize = props.modulesManager.getConf("fe-insuree", "familyFilter.defaultPageSize", 10);
    this.locationLevels = this.props.modulesManager.getConf("fe-location", "location.Location.MaxLevels", 4);
    this.renderLastNameFirst = props.modulesManager.getConf(
      "fe-insuree",
      "renderLastNameFirst",
      DEFAULT.RENDER_LAST_NAME_FIRST,
    );
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.submittingMutation && !this.props.submittingMutation) {
      this.props.journalize(this.props.mutation);
      this.setState({ reset: this.state.reset + 1 });
    }
    if (!prevProps.confirmed && this.props.confirmed && !!this.state.confirmedAction) {
      this.state.confirmedAction();
    }
  }

  fetch = (prms) => {
    this.props.fetchFamilySummaries(this.props.modulesManager, prms);
  };

  rowIdentifier = (r) => r.uuid;

  filtersToQueryParams = (state) => {
    let prms = Object.keys(state.filters)
      .filter((family) => !!state.filters[family]["filter"])
      .map((family) => state.filters[family]["filter"]);
    if (!state.beforeCursor && !state.afterCursor) {
      prms.push(`first: ${state.pageSize}`);
    }
    if (!!state.afterCursor) {
      prms.push(`after: "${state.afterCursor}"`);
      prms.push(`first: ${state.pageSize}`);
    }
    if (!!state.beforeCursor) {
      prms.push(`before: "${state.beforeCursor}"`);
      prms.push(`last: ${state.pageSize}`);
    }
    if (!!state.orderBy) {
      prms.push(`orderBy: ["${state.orderBy}"]`);
    }
    return prms;
  };

  headers = (filters) => {
    var h = [
      "insuree.familySummaries.insuranceNo",
      this.renderLastNameFirst ? "insuree.familySummaries.lastName" : "insuree.familySummaries.otherNames",
      !this.renderLastNameFirst ? "insuree.familySummaries.lastName" : "insuree.familySummaries.otherNames",
      "insuree.familySummaries.email",
      "insuree.familySummaries.phone",
      "insuree.familySummaries.dob",
    ];
    for (var i = 0; i < this.locationLevels; i++) {
      h.push(`location.locationType.${i}`);
    }
    h.push(
      "insuree.familySummaries.poverty",
      "insuree.familySummaries.confirmationNo",
      filters?.showHistory?.value ? "insuree.familySummaries.validityFrom" : null,
      filters?.showHistory?.value ? "insuree.familySummaries.validityTo" : null,
      "insuree.familySummaries.openNewTab",
    );
    if (!!this.props.rights.includes(RIGHT_FAMILY_DELETE)) {
      h.push("insuree.familySummaries.delete");
    }
    return h;
  };

  sorts = (filters) => {
    var results = [
      ["headInsuree__chfId", true],
      this.renderLastNameFirst ? ["headInsuree__lastName", true] : ["headInsuree__otherNames", true],
      !this.renderLastNameFirst ? ["headInsuree__lastName", true] : ["headInsuree__otherNames", true],
      ["headInsuree__email", true],
      ["headInsuree__phone", true],
      ["headInsuree__dob", true],
    ];
    _.times(this.locationLevels, () => results.push(null));
    results.push(null, ["confirmationNo", true], ["validityFrom", false], ["validityTo", false]);
    return results;
  };

  parentLocation = (location, level) => {
    if (!location) return "";
    let loc = location;
    for (var i = 1; i < this.locationLevels - level; i++) {
      if (!loc.parent) return "";
      loc = loc.parent;
    }
    return !!loc ? loc.name : "";
  };


  confirmPrintCard = (i) => {
    let confirmedAction = () =>
    this.props.printMembership(i.uuid, 1);
    let confirm = (e) =>
      this.props.coreConfirm(
        formatMessageWithValues(this.props.intl, "insuree", "printMembership.title", {label : `${i?.chfId}`}),
        formatMessageWithValues(this.props.intl, "insuree", "printMembership.message", 
          {label : `${i?.headInsuree?.otherNames} ${i?.headInsuree?.lastName}`}
        ),
      );
    this.setState({ confirmedAction }, confirm);
  };




  printMemershipDetails = (family) => {
    this.props.printMembership(family.uuid)
  }
  deleteFamilyAction = (i) =>
    !!i.validityTo ? null : (
      <Tooltip title={formatMessage(this.props.intl, "insuree", "familySummaries.deleteFamily.tooltip")}>
        <IconButton onClick={(e) => !i.clientMutationId && this.setState({ deleteFamily: i })}>
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    );

  deleteFamily = (deleteMembers) => {
    let family = this.state.deleteFamily;
    this.setState({ deleteFamily: null }, (e) => {
      this.props.deleteFamily(
        this.props.modulesManager,
        family,
        deleteMembers,
        formatMessageWithValues(this.props.intl, "insuree", "deleteFamily.mutationLabel", {
          label: familyLabel(family),
        }),
      );
    });
  };

  itemFormatters = (filters) => {
    var formatters = [
      (family) => (!!family.headInsuree ? family.headInsuree.chfId : ""),
      (family) =>
        (family.headInsuree && this.renderLastNameFirst
          ? family.headInsuree.lastName
          : family.headInsuree.otherNames) || "",
      (family) =>
        (family.headInsuree && !this.renderLastNameFirst
          ? family.headInsuree.lastName
          : family.headInsuree.otherNames) || "",
      (family) => (!!family.headInsuree ? family.headInsuree.email : ""),
      (family) => (!!family.headInsuree ? family.headInsuree.phone : ""),
      (family) =>
        !!family.headInsuree
          ? formatDateFromISO(this.props.modulesManager, this.props.intl, family.headInsuree.dob)
          : "",
    ];
    for (var i = 0; i < this.locationLevels; i++) {
      // need a fixed variable to refer to as parentLocation argument
      let j = i + 0;
      formatters.push((family) => this.parentLocation(family.location, j));
    }
    formatters.push(
      (family) => <Checkbox color="primary" checked={family.poverty} readOnly />,
      (family) => family.confirmationNo,
      filters?.showHistory?.value
        ? (family) => formatDateFromISO(this.props.modulesManager, this.props.intl, family.validityFrom)
        : null,
      filters?.showHistory?.value
        ? (family) => formatDateFromISO(this.props.modulesManager, this.props.intl, family.validityTo)
        : null,
      
      (family) => (
        <Tooltip title={formatMessage(this.props.intl, "insuree", "familySummaries.openNewTabButton.tooltip")}>
          <IconButton onClick={(e) => !family.clientMutationId && this.props.onDoubleClick(family, true)}>
            {" "}
            <TabIcon />
          </IconButton>
        </Tooltip>
      ),
      (family) => (
        <Tooltip title={formatMessage(this.props.intl, "insuree", "familySummaries.printMembership.tooltip")}>
          {/* <IconButton onClick={(e) => !family.clientMutationId && this.props.onDoubleClick(family, true)}>
            {" "}
            <TabIcon />
          </IconButton> */}
          <PrintIcon  onClick={()=> this.confirmPrintCard(family)}/>
        </Tooltip>
      ),
    );
    if (!!this.props.rights.includes(RIGHT_FAMILY_DELETE)) {
      formatters.push(this.deleteFamilyAction);
    }
    return formatters;
  };

  rowDisabled = (selection, i) => !!i.validityTo;
  rowLocked = (selection, i) => !!i.clientMutationId;

  render() {
    const {
      intl,
      families,
      familiesPageInfo,
      fetchingFamilies,
      fetchedFamilies,
      errorFamilies,
      filterPaneContributionsKey,
      cacheFiltersKey,
      onDoubleClick,
      actionsContributionKey,
    } = this.props;
    let count = familiesPageInfo.totalCount;
    return (
      <Fragment>
        <DeleteFamilyDialog
          family={this.state.deleteFamily}
          onConfirm={this.deleteFamily}
          onCancel={(e) => this.setState({ deleteFamily: null })}
        />
        <Searcher
          module="insuree"
          cacheFiltersKey={cacheFiltersKey}
          FilterPane={FamilyFilter}
          filterPaneContributionsKey={filterPaneContributionsKey}
          items={families}
          itemsPageInfo={familiesPageInfo}
          fetchingItems={fetchingFamilies}
          fetchedItems={fetchedFamilies}
          errorItems={errorFamilies}
          contributionKey={FAMILY_SEARCHER_CONTRIBUTION_KEY}
          tableTitle={formatMessageWithValues(intl, "insuree", "familySummaries", { count })}
          rowsPerPageOptions={this.rowsPerPageOptions}
          defaultPageSize={this.defaultPageSize}
          fetch={this.fetch}
          rowIdentifier={this.rowIdentifier}
          filtersToQueryParams={this.filtersToQueryParams}
          defaultOrderBy="-validityFrom"
          headers={this.headers}
          itemFormatters={this.itemFormatters}
          sorts={this.sorts}
          rowDisabled={this.rowDisabled}
          rowLocked={this.rowLocked}
          onDoubleClick={(f) => !f.clientMutationId && onDoubleClick(f)}
          reset={this.state.reset}
          actions={[]}
          actionsContributionKey={actionsContributionKey}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
  families: state.insuree.families,
  familiesPageInfo: state.insuree.familiesPageInfo,
  fetchingFamilies: state.insuree.fetchingFamilies,
  fetchedFamilies: state.insuree.fetchedFamilies,
  errorFamilies: state.insuree.errorFamilies,
  submittingMutation: state.insuree.submittingMutation,
  mutation: state.insuree.mutation,
  confirmed: state.core.confirmed,
});

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ fetchFamilySummaries, deleteFamily, printMembership, coreConfirm, journalize }, dispatch);
};

export default withModulesManager(connect(mapStateToProps, mapDispatchToProps)(injectIntl(FamilySearcher)));
