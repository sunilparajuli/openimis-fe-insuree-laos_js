import React, { Component, Fragment } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Paper, Grid, Typography, Divider, Checkbox, FormControlLabel } from "@material-ui/core";
import {
    formatMessage,
    FormattedMessage, PublishedComponent,
    TextInput
} from "@openimis/fe-core";

const styles = theme => ({
    paper: theme.paper,
    tableTitle: theme.table.title,
    item: theme.paper.item,
});

class InsureeDetailPanel extends Component {
    render() {
        const { intl, classes, edited } = this.props;
        return (
            <Grid container>
                <Grid item xs={12} className={classes.item}>
                    <Paper className={classes.paper}>
                        <Typography className={classes.tableTitle}>
                            <FormattedMessage module="insuree" id="insuree.InsureeDetailPanel.title" />
                        </Typography>
                        <Divider />
                        <Grid container>
                            <Grid item xs={4} className={classes.item}>
                                <TextInput
                                    module="insuree"
                                    label="Insuree.chfId"
                                    required={true}
                                    readOnly={true}
                                    value={!!edited.chfId ? edited.chfId : ""}
                                />
                            </Grid>
                            <Grid item xs={4} className={classes.item}>
                                <TextInput
                                    module="insuree"
                                    label="Insuree.lastName"
                                    required={true}
                                    readOnly={true}
                                    value={!!edited.lastName ? edited.lastName : ""}
                                />
                            </Grid>
                            <Grid item xs={4} className={classes.item}>
                                <TextInput
                                    module="insuree"
                                    label="Insuree.otherNames"
                                    readOnly={true}
                                    value={!!edited.otherNames ? edited.otherNames : ""}
                                />
                            </Grid>
                            <Grid item xs={8}>
                                <Grid container>
                                    <Grid item xs={3} className={classes.item}>
                                        <PublishedComponent pubRef="core.DatePicker"
                                            value={edited.dob}
                                            module="insuree"
                                            label="Insuree.dob"
                                            readOnly={true}
                                        />
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <PublishedComponent pubRef="insuree.InsureeGenderPicker"
                                            value={!!edited.gender ? edited.gender.code : ""}
                                            module="insuree"
                                            readOnly={true}
                                        />
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <PublishedComponent pubRef="insuree.InsureeMaritalStatusPicker"
                                            value={!!edited.marital ? edited.gender.marital : ""}
                                            module="insuree"
                                            readOnly={true}
                                            nullLabel={formatMessage(intl, "insuree", "insureeMaritalStatus.N")}
                                        />
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <FormControlLabel
                                            control={<Checkbox color="primary" checked={!!edited.card_issued} disabled={true} />}
                                            label={formatMessage(intl, "insuree", "Insuree.cardIssued")}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <PublishedComponent pubRef="insuree.InsureeAddress"
                                            value={edited}
                                            module="insuree"
                                            readOnly={true}
                                        />
                                    </Grid>
                                    <Grid item xs={6} className={classes.item}>
                                        <TextInput
                                            module="insuree"
                                            label="Insuree.phone"
                                            readOnly={true}
                                            value={!!edited.phone ? edited.phone : ""}
                                        />
                                    </Grid>
                                    <Grid item xs={6} className={classes.item}>
                                        <TextInput
                                            module="insuree"
                                            label="Insuree.email"
                                            readOnly={true}
                                            value={!!edited.email ? edited.email : ""}
                                        />
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <PublishedComponent pubRef="insuree.ProfessionPicker"
                                            value={!!edited.profession ? edited.profession.id : ""}
                                            readOnly={true}
                                            module="insuree"
                                            nullLabel={formatMessage(intl, "insuree", "Profession.none")}
                                        />
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <PublishedComponent pubRef="insuree.EducationPicker"
                                            value={!!edited.education ? edited.education.id : ""}
                                            readOnly={true}
                                            nullLabel={formatMessage(intl, "insuree", "insuree.Education.none")}
                                        />
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <PublishedComponent pubRef="insuree.IdentificationTypePicker"
                                            value={!!edited.typeOfId ? edited.typeOfId.code : ""}
                                            readOnly={true}
                                            nullLabel={formatMessage(intl, "insuree", "IdentificationType.none")}
                                        />
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <TextInput
                                            module="insuree"
                                            label="Insuree.passport"
                                            readOnly={true}
                                            value={!!edited.passport ? edited.passport : ""}
                                        />
                                    </Grid>

                                </Grid>
                            </Grid>
                            <Grid item xs={4} className={classes.item}>
                                <PublishedComponent pubRef="insuree.Avatar"
                                    insuree={edited}
                                    readOnly={true}
                                />
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

export default withTheme(
    withStyles(styles)(InsureeDetailPanel)
);