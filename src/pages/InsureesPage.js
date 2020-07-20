import React, { Component } from "react";
import { historyPush, withModulesManager, withHistory } from "@openimis/fe-core";
import InsureeSearcher from "../components/InsureeSearcher";


class InsureesPage extends Component {

    onDoubleClick = (i, newTab = false) => {
        historyPush(this.props.modulesManager, this.props.history, "insuree.route.insuree",[i.uuid], newTab)
    }

    render() {
        return (
            <InsureeSearcher
                cacheFiltersKey="insureeInsureesPageFiltersCache"
                onDoubleClick={this.onDoubleClick}
            />
        )
    }
}


export default withModulesManager(withHistory(InsureesPage));