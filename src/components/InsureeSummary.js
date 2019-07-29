import React, { Component, Fragment } from "react";
import { injectIntl, FormattedDate } from 'react-intl';
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Grid, Typography } from "@material-ui/core";
import { formatMessage, Contributions, FieldLabel } from "@openimis/fe-core";

const INSUREE_SUMMARY_AVATAR_CONTRIBUTION_KEY = "insuree.InsureeSummaryAvatar";
const INSUREE_SUMMARY_CORE_CONTRIBUTION_KEY = "insuree.InsureeSummaryCore";
const INSUREE_SUMMARY_CONTRIBUTION_KEY = "insuree.InsureeSummary";

const styles = theme => ({
    rawValue: {
        textAlign: "center",
    },
    label: {
        textAlign: "right",
    },
    fspContainer: {
        marginTop: 10,
    }
});

class InsureeSummary extends Component {
    render() {
        const { classes, insuree } = this.props;
        return (
            <Grid container>
                <Grid item xs={2}>
                    <Contributions contributionKey={INSUREE_SUMMARY_AVATAR_CONTRIBUTION_KEY} />
                </Grid>
                <Grid item xs={10}>
                    <Grid item xs={12}>
                        <Typography className={classes.rawValue} variant="h4">{insuree && insuree.chfId}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs={6}>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Typography className={classes.rawValue} variant="h6">
                                            {insuree && `${insuree.otherNames} ${insuree.lastName}`}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography className={classes.rawValue} variant="h6">
                                            {insuree && (
                                                <Fragment>
                                                    <FormattedDate value={insuree.dob} />
                                                    {` (${insuree.age} ${formatMessage(this.props.intl, "insuree", "ageUnit")})`}
                                                </Fragment>
                                            )}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography className={classes.rawValue} variant="h6">
                                            {insuree && insuree.gender && insuree.gender.gender}
                                        </Typography>
                                    </Grid>
                                    <Contributions contributionKey={INSUREE_SUMMARY_CORE_CONTRIBUTION_KEY} />
                                </Grid>
                            </Grid>
                            <Grid item xs={6}>
                                <Grid container className={classes.fspContainer}>
                                    <Grid item xs={6} className={classes.label}>
                                        <FieldLabel module="insuree" id="label.regionFSP" />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="caption">TODO</Typography>
                                    </Grid>
                                    <Grid item xs={6} className={classes.label}>
                                        <FieldLabel module="insuree" id="label.districtFSP" />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="caption">TODO</Typography>
                                    </Grid>
                                    <Grid item xs={6} className={classes.label}>
                                        <FieldLabel module="insuree" id="label.levelFSP" />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="caption">TODO</Typography>
                                    </Grid>
                                    <Grid item xs={6} className={classes.label}>
                                        <FieldLabel module="insuree" id="label.firstServicePoint" />
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Typography variant="caption">TODO</Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Contributions contributionKey={INSUREE_SUMMARY_CONTRIBUTION_KEY} />
                </Grid>
            </Grid>
        );
    }
}

export default injectIntl(withTheme(
    withStyles(styles)(InsureeSummary)
));
