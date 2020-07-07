import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from 'react-intl';
import { Grid, Divider } from "@material-ui/core";
import {
    withModulesManager, PublishedComponent, ControlledField
} from "@openimis/fe-core";

const styles = theme => ({
    dialogTitle: theme.dialog.title,
    dialogContent: theme.dialog.content,
    form: {
        padding: 0
    },
    item: {
        padding: theme.spacing(1)
    },
    paperDivider: theme.paper.divider,
});

class FamilyFilter extends Component {

    render() {
        const { classes } = this.props;
        return (
            <Grid container className={classes.form}>
                <ControlledField module="insuree" id="FamilyFilter.location" field={
                    <Grid item xs={8} className={classes.item}>
                        <PublishedComponent
                            pubRef="location.DetailedLocationFilter"
                            withNull={true}
                            {... this.props}
                            anchor="parentLocation"
                        />
                    </Grid>
                } />
            </Grid>
        )
    }
}

export default withModulesManager(injectIntl((withTheme(withStyles(styles)(FamilyFilter)))));