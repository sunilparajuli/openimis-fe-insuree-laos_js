import React, { Component } from "react";
import { connect } from "react-redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { historyPush, withModulesManager, withHistory } from "@openimis/fe-core";
import FamilySearcher from "../components/FamilySearcher";

import { RIGHT_FAMILY_ADD } from "../constants";

const styles = theme => ({
    page: theme.page,
    fab: theme.fab
});


class FamiliesPage extends Component {

    onDoubleClick = (f, newTab = false) => {
        historyPush(this.props.modulesManager, this.props.history, "insuree.route.familyOverview", [f.uuid], newTab)
    }

    onAdd = () => {
        historyPush(this.props.modulesManager, this.props.history, "insuree.route.family");
    }

    render() {
        const { intl, classes, rights } = this.props;
        return (
            <div className={classes.page}>
                <FamilySearcher
                    cacheFiltersKey="insureeFamiliesPageFiltersCache"
                    onDoubleClick={this.onDoubleClick}
                />
                {rights.includes(RIGHT_FAMILY_ADD) &&
                    <div className={classes.fab}>
                        <Fab color="primary" onClick={this.onAdd}>
                            <AddIcon />
                        </Fab>
                    </div>
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
})


export default withModulesManager(withHistory(connect(mapStateToProps)(withTheme(withStyles(styles)(FamiliesPage)))));