import React, { Component, Fragment } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Paper, Grid, Typography, Divider, Checkbox, FormControlLabel } from "@material-ui/core";
import {
    formatMessage,
    FormattedMessage, PublishedComponent, FormPanel,
    TextInput
} from "@openimis/fe-core";
import { insureeLabel } from "../utils/utils";

const styles = theme => ({
    paper: theme.paper.paper,
    tableTitle: theme.table.title,
    item: theme.paper.item,
    fullHeight: {
        height: "100%"
    },
});

class InsureeMasterPanel extends FormPanel {
    render() {
        const {
            intl, classes, edited,
            title = "Insuree.title", titleParams = { label: "" },
            readOnly = true
        } = this.props;
        return (
            <Grid container>
                <Grid item xs={12}>
                    <Paper className={classes.paper}>
                        <Grid container className={classes.tableTitle}>
                            <Grid item xs={3} className={classes.tableTitle}>
                                <Typography>
                                    <FormattedMessage module="insuree" id={title} values={titleParams} />
                                </Typography>
                            </Grid>
                            {!!edited && !!edited.family && !!edited.family.headInsuree && edited.family.headInsuree.id !== edited.id && (
                                <Grid item xs={3} >
                                    <PublishedComponent
                                        pubRef="insuree.RelationPicker"
                                        readOnly={readOnly}
                                        value={!!edited && !!edited.relationship ? edited.relationship.id : ""}
                                        onChange={v => this.updateAttribute('relationship', { id: v })}
                                    />
                                </Grid>
                            )}
                        </Grid>
                        <Divider />
                        <Grid container className={classes.item}>
                            <Grid item xs={4} className={classes.item}>
                                <TextInput
                                    module="insuree"
                                    label="Insuree.chfId"
                                    required={true}
                                    readOnly={readOnly}
                                    value={!!edited && !!edited.chfId ? edited.chfId : ""}
                                    onChange={v => this.updateAttribute('chfId', v)}
                                />
                            </Grid>
                            <Grid item xs={4} className={classes.item}>
                                <TextInput
                                    module="insuree"
                                    label="Insuree.lastName"
                                    required={true}
                                    readOnly={readOnly}
                                    value={!!edited && !!edited.lastName ? edited.lastName : ""}
                                    onChange={v => this.updateAttribute('lastName', v)}
                                />
                            </Grid>
                            <Grid item xs={4} className={classes.item}>
                                <TextInput
                                    module="insuree"
                                    label="Insuree.otherNames"
                                    required={true}
                                    readOnly={readOnly}
                                    value={!!edited && !!edited.otherNames ? edited.otherNames : ""}
                                    onChange={v => this.updateAttribute('otherNames', v)}
                                />
                            </Grid>
                            <Grid item xs={8}>
                                <Grid container>
                                    <Grid item xs={3} className={classes.item}>
                                        <PublishedComponent pubRef="core.DatePicker"
                                            value={!!edited ? edited.dob : null}
                                            module="insuree"
                                            label="Insuree.dob"
                                            readOnly={readOnly}
                                            required={true}
                                            onChange={v => this.updateAttribute('dob', v)}
                                        />
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <PublishedComponent pubRef="insuree.InsureeGenderPicker"
                                            value={!!edited && !!edited.gender ? edited.gender.code : ""}
                                            module="insuree"
                                            readOnly={readOnly}
                                            withNull={true}
                                            nullLabel={formatMessage(intl, "insuree", "InsureeGender.none")}
                                            onChange={v => this.updateAttribute('gender', { code: v })}
                                        />
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <PublishedComponent pubRef="insuree.InsureeMaritalStatusPicker"
                                            value={!!edited && !!edited.marital ? edited.marital : ""}
                                            module="insuree"
                                            readOnly={readOnly}
                                            withNull={true}
                                            nullLabel="InsureeMaritalStatus.N"
                                            onChange={v => this.updateAttribute('marital', v)}
                                        />
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <FormControlLabel
                                            control={<Checkbox
                                                color="primary"
                                                checked={!!edited && !!edited.card_issued}
                                                disabled={readOnly}
                                                onChange={v => this.updateAttribute('card_issued', !edited || !edited.card_issued)}
                                            />}
                                            label={formatMessage(intl, "insuree", "Insuree.cardIssued")}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <PublishedComponent pubRef="insuree.InsureeAddress"
                                            value={edited}
                                            module="insuree"
                                            readOnly={readOnly}
                                            onChangeLocation={v => this.updateAttribute('currentVillage', v)}
                                            onChangeAddress={v => this.updateAttribute('currentAddress', v)}
                                        />
                                    </Grid>
                                    <Grid item xs={6} className={classes.item}>
                                        <TextInput
                                            module="insuree"
                                            label="Insuree.phone"
                                            readOnly={readOnly}
                                            value={!!edited && !!edited.phone ? edited.phone : ""}
                                            onChange={v => this.updateAttribute('phone', v)}
                                        />
                                    </Grid>
                                    <Grid item xs={6} className={classes.item}>
                                        <TextInput
                                            module="insuree"
                                            label="Insuree.email"
                                            readOnly={readOnly}
                                            value={!!edited && !!edited.email ? edited.email : ""}
                                            onChange={v => this.updateAttribute('email', v)}
                                        />
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <PublishedComponent pubRef="insuree.ProfessionPicker"
                                            module="insuree"
                                            value={!!edited && !!edited.profession ? edited.profession.id : null}
                                            readOnly={readOnly}
                                            withNull={true}
                                            nullLabel={formatMessage(intl, "insuree", "Profession.none")}
                                            onChange={v => this.updateAttribute('profession', { id: v })}
                                        />
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <PublishedComponent pubRef="insuree.EducationPicker"
                                            module="insuree"
                                            value={!!edited && !!edited.education ? edited.education.id : ""}
                                            readOnly={readOnly}
                                            withNull={true}
                                            nullLabel={formatMessage(intl, "insuree", "insuree.Education.none")}
                                            onChange={v => this.updateAttribute('education', { id: v })}
                                        />
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <PublishedComponent pubRef="insuree.IdentificationTypePicker"
                                            module="insuree"
                                            value={!!edited && !!edited.typeOfId ? edited.typeOfId.code : null}
                                            readOnly={readOnly}
                                            withNull={true}
                                            nullLabel={formatMessage(intl, "insuree", "IdentificationType.none")}
                                            onChange={v => this.updateAttribute('typeOfId', { code: v })}
                                        />
                                    </Grid>
                                    <Grid item xs={3} className={classes.item}>
                                        <TextInput
                                            module="insuree"
                                            label="Insuree.passport"
                                            readOnly={readOnly}
                                            value={!!edited && !!edited.passport ? edited.passport : ""}
                                            onChange={v => this.updateAttribute('passport', !!v ? v : null)}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={4} className={classes.item}>
                                <PublishedComponent pubRef="insuree.Avatar"
                                    photo={!!edited ? edited.photo : null}
                                    readOnly={readOnly}
                                    withMeta={true}
                                    onChange={v => this.updateAttribute('photo', !!v ? v : null)}
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
    withStyles(styles)(InsureeMasterPanel)
);