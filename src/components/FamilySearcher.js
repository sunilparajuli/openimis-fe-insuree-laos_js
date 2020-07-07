import React, { Component, Fragment } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { Checkbox } from "@material-ui/core";
import {
    Searcher, withModulesManager, formatMessageWithValues, formatDateFromISO
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
            .filter(f => !!state.filters[f]['filter'])
            .map(f => state.filters[f]['filter']);
        prms.push(`first: ${state.pageSize}`);
        if (!!state.afterCursor) {
            prms.push(`after: "${state.afterCursor}"`)
        }
        if (!!state.beforeCursor) {
            prms.push(`before: "${state.beforeCursor}"`)
        }
        return prms;
    }

    headers = () => {
        var h = [
            "familySummaries.insuranceNo",
            "familySummaries.lastName",
            "familySummaries.otherNames",
        ]
        for (var i = 0; i < this.locationLevels; i++) {
            h.push(`familySummaries.locationLevel.${i}`)
        }
        h.push(
            "familySummaries.poverty",
            "familySummaries.validFrom",
            "familySummaries.validTo",
        );
        return h;
    }

    sorts = () => {
        return [];
    }

    aligns = () => {
        return []
    }

    parentLocation = (location, level) => {
        let loc = location
        for (var i = 1; i < this.locationLevels - level; i++) {
            if (!loc.parent) return ""
            loc = loc.parent
        }
        return !!loc ? loc.name : "";
    }

    itemFormatters = () => {
        var result = [
            f => !!f.headInsuree ? f.headInsuree.chfId : "",
            f => !!f.headInsuree ? f.headInsuree.lastName : "",
            f => !!f.headInsuree ? f.headInsuree.otherNames : "",
        ]
        for (var i = 0; i < this.locationLevels; i++) {
            // need a fixed variable to refer to as parentLocation argument
            let j = i + 0;
            result.push(f => this.parentLocation(f.location, j))
        }
        result.push(
            f => <Checkbox
                color="primary"
                checked={f.poverty}
                readOnly
            />,
            f => formatDateFromISO(this.props.modulesManager, this.props.intl, f.validityFrom),
            f => formatDateFromISO(this.props.modulesManager, this.props.intl, f.validityTo),
        )
        return result;
    }

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
                aligns={this.aligns}
                sorts={this.sorts}
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