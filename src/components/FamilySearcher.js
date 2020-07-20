import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { Checkbox, IconButton } from "@material-ui/core";
import TabIcon from "@material-ui/icons/Tab";
import {
    decodeId, withModulesManager, formatMessageWithValues, formatDateFromISO,
    Searcher
} from "@openimis/fe-core";

import { fetchFamilySummaries } from "../actions";

import FamilyFilter from "./FamilyFilter";

const FAMILY_SEARCHER_CONTRIBUTION_KEY = "insuree.FamilySearcher";

class FamilySearcher extends Component {

    constructor(props) {
        super(props);
        this.rowsPerPageOptions = props.modulesManager.getConf("fe-insuree", "familyFilter.rowsPerPageOptions", [10, 20, 50, 100]);
        this.defaultPageSize = props.modulesManager.getConf("fe-insuree", "familyFilter.defaultPageSize", 10);
        this.locationLevels = this.props.modulesManager.getConf("fe-location", "location.Location.MaxLevels", 4);
    }

    fetch = (prms) => {
        this.props.fetchFamilySummaries(
            this.props.modulesManager,
            prms
        )
    }

    rowIdentifier = (r) => r.uuid

    filtersToQueryParams = (state) => {
        let prms = Object.keys(state.filters)
            .filter(family => !!state.filters[f]['filter'])
            .map(family => state.filters[f]['filter']);
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
            "insuree.familySummaries.insuranceNo",
            "insuree.familySummaries.lastName",
            "insuree.familySummaries.otherNames",
            "insuree.familySummaries.email",
            "insuree.familySummaries.phone",
            "insuree.familySummaries.dob",
        ]
        for (var i = 0; i < this.locationLevels; i++) {
            h.push(`location.locationType.${i}`)
        }
        h.push(
            "insuree.familySummaries.poverty",
            "insuree.familySummaries.confirmationNo",
        );
        if (filters.showHistory && !!filters.showHistory.value) {
            h.push(
                "insuree.familySummaries.id",
                "insuree.familySummaries.validityFrom",
                "insuree.familySummaries.validityTo",
            )
        }
        h.push("insuree.familySummaries.openNewTab")
        return h;
    }

    sorts = (filters) => {
        var results = [
            ['headInsuree__chfId', true],
            ['headInsuree__lastName', true],
            ['headInsuree__otherNames', true],
            ['headInsuree__email', true],
            ['headInsuree__phone', true],
            ['headInsuree__dob', true]
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
            family => !!family.headInsuree ? family.headInsuree.chfId : "",
            family => !!family.headInsuree ? family.headInsuree.lastName : "",
            family => !!family.headInsuree ? family.headInsuree.otherNames : "",
            family => !!family.headInsuree ? family.headInsuree.email : "",
            family => !!family.headInsuree ? family.headInsuree.phone : "",
            family => !!family.headInsuree ? formatDateFromISO(this.props.modulesManager, this.props.intl, family.headInsuree.dob) : "",
        ]
        for (var i = 0; i < this.locationLevels; i++) {
            // need a fixed variable to refer to as parentLocation argument
            let j = i + 0;
            formatters.push(family => this.parentLocation(family.location, j))
        }
        formatters.push(
            family => <Checkbox
                color="primary"
                checked={family.poverty}
                readOnly
            />,
            family => family.confirmationNo,
        )
        if (filters.showHistory && !!filters.showHistory.value) {
            formatters.push(
                family => decodeId(family.id),
                family => formatDateFromISO(
                    this.props.modulesManager,
                    this.props.intl,
                    family.validityFrom),
                family => formatDateFromISO(
                    this.props.modulesManager,
                    this.props.intl,
                    family.validityTo),
            )
        }
        formatters.push(family => <IconButton onClick={e => this.props.onDoubleClick(f, true)} > <TabIcon /></IconButton >)
        return formatters;
    }

    rowDisabled = (selection, i) => !!i.validityTo

    render() {
        const { intl,
            families, familiesPageInfo, fetchingFamilies, fetchedFamilies, errorFamilies,
            defaultFilters, filterPaneContributionsKey, cacheFiltersKey, onDoubleClick
        } = this.props;

        let count = familiesPageInfo.totalCount;

        return (
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
    families: state.insuree.families,
    familiesPageInfo: state.insuree.familiesPageInfo,
    fetchingFamilies: state.insuree.fetchingFamilies,
    fetchedFamilies: state.insuree.fetchedFamilies,
    errorFamilies: state.insuree.errorFamilies,
});


const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        { fetchFamilySummaries },
        dispatch);
};

export default withModulesManager(connect(mapStateToProps, mapDispatchToProps)(injectIntl(FamilySearcher)));