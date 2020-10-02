import React, { Component } from "react";
import { connect } from "react-redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Grid } from "@material-ui/core";
import { withModulesManager, FormattedMessage, PublishedComponent } from "@openimis/fe-core";

const styles = theme => ({
    centered: {
        textAlign: "center",
        position: "relative",
        top: "50%"
    },
    aligned: {
        position: "relative",
        top: "100%"
    },
})

class InsureeFirstServicePointDisplay extends Component {
    render() {
        const { classes, insuree } = this.props;
        if (!insuree || !insuree.healthFacility) return (
            <div className={classes.centered}>
                <FormattedMessage module="insuree" id="insuree.noFSP" />
            </div>
        );
        return (
            <Grid container>
                <Grid item xs={12}>
                    <FormattedMessage module="insuree" id="FSP.title" />
                </Grid>
                <Grid item xs={12} className={classes.aligned}>
                    <PublishedComponent
                        pubRef="location.HealthFacilityFullPath"
                        hfid={insuree.healthFacility.id}
                    />
                </Grid>
            </Grid>
        );
    }
}


const mapStateToProps = state => ({
    insuree: state.insuree.insuree,
});

export default withModulesManager(withTheme(withStyles(styles)(connect(mapStateToProps)(InsureeFirstServicePointDisplay))));