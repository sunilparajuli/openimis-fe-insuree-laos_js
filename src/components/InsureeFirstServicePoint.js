import React, {Component} from "react";
import {connect} from "react-redux";
import {withStyles, withTheme} from "@material-ui/core/styles";
import {Grid} from "@material-ui/core";
import {decodeId, FormattedMessage, PublishedComponent, withModulesManager} from "@openimis/fe-core";

const styles = theme => ({
    msg: {
        textAlign: "center",
        position: "relative",
        top: "50%"
    },
    title: theme.table.title,
    details: {
        padding: theme.spacing(1)
    }
})

class InsureeFirstServicePoint extends Component {
    render() {
        const { classes, insuree } = this.props;
        if (!insuree || !insuree.healthFacility) {
          return (
            <div className={classes.msg}>
                <FormattedMessage module="insuree" id="insuree.noFSP" />
            </div>
          )
        }
        let healthFacilityId = insuree.healthFacility.id;
        let decodeCount = 0;
        if (!/^\d+$/.test(healthFacilityId)) {
          decodeCount = 1;
          healthFacilityId = decodeId(healthFacilityId);
          if (!/^\d+$/.test(healthFacilityId)) {
            decodeCount = 2;
            healthFacilityId = decodeId(healthFacilityId);
          }
        }
        console.log(`hf_id: ${insuree.healthFacility.id} decoded to ${healthFacilityId}, dc: ${decodeCount}`);
        return (
            <Grid container>
                <Grid item xs={12} className={classes.title}>
                    <FormattedMessage module="insuree" id="FSP.title" />
                </Grid>
                <Grid item xs={12} className={classes.details}>
                    <PublishedComponent
                        id="location.HealthFacilityFullPath"
                        hfid={healthFacilityId}
                    />
                </Grid>
            </Grid>
        );
    }
}


const mapStateToProps = state => ({
    insuree: state.insuree.insuree,
});

export default withModulesManager(withTheme(withStyles(styles)(connect(mapStateToProps)(InsureeFirstServicePoint))));
