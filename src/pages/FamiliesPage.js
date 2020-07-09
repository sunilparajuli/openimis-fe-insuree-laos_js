import React, { Component } from "react";
import { historyPush, withModulesManager, withHistory } from "@openimis/fe-core";
import FamilySearcher from "../components/FamilySearcher";


class FamiliesPage extends Component {

    onDoubleClick = (f, newTab = false) => {
        historyPush(this.props.modulesManager, this.props.history, "insuree.route.familyOverview", [f.uuid], newTab)
    }

    render() {
        return (
            <FamilySearcher
                cacheFiltersKey="insureeFamiliesPageFiltersCache"
                onDoubleClick={this.onDoubleClick}
            />
        )
    }
}


export default withModulesManager(withHistory(FamiliesPage));