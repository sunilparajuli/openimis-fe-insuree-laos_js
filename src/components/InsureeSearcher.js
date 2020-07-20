import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { Checkbox, IconButton } from "@material-ui/core";
import TabIcon from "@material-ui/icons/Tab";
import {
    decodeId, withModulesManager, formatMessageWithValues, formatDateFromISO, formatMessage,
    Searcher,
    PublishedComponent
} from "@openimis/fe-core";

import { fetchInsureeSummaries } from "../actions";

import InsureeFilter from "./InsureeFilter";

const INSUREE_SEARCHER_CONTRIBUTION_KEY = "insuree.InsureeSearcher";

class InsureeSearcher extends Component {

    constructor(props) {
        super(props);
        this.rowsPerPageOptions = props.modulesManager.getConf("fe-insuree", "insureeFilter.rowsPerPageOptions", [10, 20, 50, 100]);
        this.defaultPageSize = props.modulesManager.getConf("fe-insuree", "insureeFilter.defaultPageSize", 10);
        this.locationLevels = this.props.modulesManager.getConf("fe-location", "location.Location.MaxLevels", 4);
    }

    fetch = (prms) => {
        this.props.fetchInsureeSummaries(
            this.props.modulesManager,
            prms
        )
    }

    rowIdentifier = (r) => r.uuid

    filtersToQueryParams = (state) => {
        let prms = Object.keys(state.filters)
            .filter(f => !!state.filters[f]['filter'])
            .map(f => state.filters[f]['filter']);
        prms.push(`first: ${state.pageSize}`);
        if (!!state.afterCursor) {
            prms.push(`after: "${state.afterCursor}"`)
        }
        if (!!state.beforeCursor) {
            prms.push(`before: "${state.beforeCursor}"`)
        }
        if (!!state.orderBy) {
            prms.push(`orderBy: ["${state.orderBy}"]`);
        }
        return prms;
    }

    headers = (filters) => {
        var h = [
            "insuree.insureeSummaries.insuranceNo",
            "insuree.insureeSummaries.lastName",
            "insuree.insureeSummaries.otherNames",
            "insuree.insureeSummaries.maritalStatus",
            "insuree.insureeSummaries.gender",
            "insuree.insureeSummaries.phone",
            "insuree.insureeSummaries.email",
            "insuree.insureeSummaries.dob",
        ]
        for (var i = 0; i < this.locationLevels; i++) {
            h.push(`location.locationType.${i}`)
        }
        if (filters.showHistory && !!filters.showHistory.value) {
            h.push(
                "insuree.insureeSummaries.id",
                "insuree.insureeSummaries.validityFrom",
                "insuree.insureeSummaries.validityTo",
            )
        }
        h.push("insuree.insureeSummaries.openNewTab")
        return h;
    }

    sorts = (filters) => {
        var results = [
            ['chfId', true],
            ['lastName', true],
            ['otherNames', true],
            ['marital', true],
            ['gender__code', true],
            ['email', true],
            ['phone', true],
            ['dob', true]
        ];
        _.times(this.locationLevels, () => results.push(null));
        results.push(
            null,
            ['confirmationNo', true]
        )
        if (filters.showHistory && !!filters.showHistory.value) {
            results.push(
                null,
                ['validityFrom', false],
                ['validityTo', false]
            );
        }
        return results;
    }

    parentLocation = (location, level) => {
        if (!location) return "";
        let loc = location
        for (var i = 1; i < this.locationLevels - level; i++) {
            if (!loc.parent) return ""
            loc = loc.parent
        }
        return !!loc ? loc.name : "";
    }

    itemFormatters = (filters) => {
        var formatters = [
            insuree => insuree.chfId,
            insuree => insuree.lastName,
            insuree => insuree.otherNames,
            insuree => <PublishedComponent
                pubRef="insuree.InsureeMaritalStatusPicker"
                withLabel={false}
                withNull={true}
                nullLabel="InsureeMaritalStatus.none"
                readOnly={true}
                value={insuree.marital}
            />,
            insuree => <PublishedComponent
                pubRef="insuree.InsureeGenderPicker"
                withLabel={false}
                withNull={true}
                nullLabel="InsureeGender.none"
                readOnly={true}
                value={!!insuree.gender ? insuree.gender.code : null}
            />,
            insuree => insuree.email,
            insuree => insuree.phone,
            insuree => formatDateFromISO(this.props.modulesManager, this.props.intl, insuree.dob),
        ]
        for (var i = 0; i < this.locationLevels; i++) {
            // need a fixed variable to refer to as parentLocation argument
            let j = i + 0;
            formatters.push(insuree => this.parentLocation(insuree.currentVillage, j))
        }
        if (filters.showHistory && !!filters.showHistory.value) {
            formatters.push(
                insuree => decodeId(insuree.id),
                insuree => formatDateFromISO(
                    this.props.modulesManager,
                    this.props.intl,
                    insuree.validityFrom),
                insuree => formatDateFromISO(
                    this.props.modulesManager,
                    this.props.intl,
                    insuree.validityTo),
            )
        }
        formatters.push(insuree => <IconButton onClick={e => this.props.onDoubleClick(insuree, true)} > <TabIcon /></IconButton >)
        return formatters;
    }

    rowDisabled = (selection, i) => !!i.validityTo

    render() {
        const { intl,
            insurees, insureesPageInfo, fetchingInsurees, fetchedInsurees, errorInsurees,
            defaultFilters, filterPaneContributionsKey, cacheFiltersKey, onDoubleClick
        } = this.props;

        let count = insureesPageInfo.totalCount;

        return (
            <Searcher
                module="insuree"
                cacheFiltersKey={cacheFiltersKey}
                FilterPane={InsureeFilter}
                filterPaneContributionsKey={filterPaneContributionsKey}
                items={insurees}
                itemsPageInfo={insureesPageInfo}
                fetchingItems={fetchingInsurees}
                fetchedItems={fetchedInsurees}
                errorItems={errorInsurees}
                contributionKey={INSUREE_SEARCHER_CONTRIBUTION_KEY}
                tableTitle={formatMessageWithValues(intl, "insuree", "insureeSummaries", { count })}
                rowsPerPageOptions={this.rowsPerPageOptions}
                defaultPageSize={this.defaultPageSize}
                fetch={this.fetch}
                rowIdentifier={this.rowIdentifier}
                filtersToQueryParams={this.filtersToQueryParams}
                headers={this.headers}
                itemFormatters={this.itemFormatters}
                sorts={this.sorts}
                rowDisabled={this.rowDisabled}
                onDoubleClick={onDoubleClick}
            />
        )
    }
}

const mapStateToProps = state => ({
    insurees: state.insuree.insurees,
    insureesPageInfo: state.insuree.insureesPageInfo,
    fetchingInsurees: state.insuree.fetchingInsurees,
    fetchedInsurees: state.insuree.fetchedInsurees,
    errorInsurees: state.insuree.errorInsurees,
});


const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        { fetchInsureeSummaries },
        dispatch);
};

export default withModulesManager(connect(mapStateToProps, mapDispatchToProps)(injectIntl(InsureeSearcher)));