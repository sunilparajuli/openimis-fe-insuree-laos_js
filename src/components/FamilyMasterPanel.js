import React, { Component, Fragment } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import {
    Grid,
    FormControlLabel,
    Checkbox,
    Typography,
    Divider,
} from "@material-ui/core";
import { TextInput, formatMessage, PublishedComponent, FormattedMessage } from "@openimis/fe-core";


const styles = theme => ({
    tableTitle: theme.table.title,
    item: theme.paper.item,
});

class FamilyMasterPanel extends Component {
    render() {
        const { intl, classes, edited } = this.props;
        return (
            <Fragment>
                <Typography className={classes.tableTitle}>
                    <FormattedMessage module="insuree" id="insuree.FamilyDetailPanel.title" />
                </Typography>
                <Divider />
                <Grid container className={classes.item}>
                    <Grid item xs={12}>
                        <PublishedComponent
                            pubRef="location.DetailedLocation"
                            withNull={true}
                            value={!edited ? "" : edited.location}
                        />
                    </Grid>
                    <Grid item xs={3} className={classes.item}>
                        <TextInput
                            module="insuree"
                            label="Family.chfId"
                            required={true}
                            readOnly={true}
                            value={!edited || !edited.headInsuree ? "" : edited.headInsuree.chfId}
                        />
                    </Grid>
                    <Grid item xs={3} className={classes.item}>
                        <TextInput
                            module="insuree"
                            label="Family.lastName"
                            required={true}
                            readOnly={true}
                            value={!edited || !edited.headInsuree ? "" : edited.headInsuree.lastName}
                        />
                    </Grid>
                    <Grid item xs={3} className={classes.item}>
                        <TextInput
                            module="insuree"
                            label="Family.otherNames"
                            required={true}
                            readOnly={true}
                            value={!edited || !edited.headInsuree ? "" : edited.headInsuree.otherNames}
                        />
                    </Grid>
                    <Grid item xs={3} className={classes.item}>
                        <PublishedComponent
                            pubRef="insuree.FamilyTypePicker"
                            readOnly={true}
                            withNull={true}
                            nullLabel={formatMessage(intl, "insuree", "Family.FamilyType.null")}
                            value={!edited ? "" : edited.familyType}
                        />
                    </Grid>
                    <Grid item xs={3} className={classes.item}>
                        <PublishedComponent
                            pubRef="insuree.ConfirmationTypePicker"
                            readOnly={true}
                            withNull={true}
                            nullLabel={formatMessage(intl, "insuree", "Family.ConfirmationType.null")}
                            value={!edited ? "" : edited.confirmationType}
                        />
                    </Grid>
                    <Grid item xs={3} className={classes.item}>
                        <TextInput
                            module="insuree"
                            label="Family.confirmationNo"
                            readOnly={true}
                            value={!edited ? "" : edited.confirmationNo}
                        />
                    </Grid>
                    <Grid item xs={3} className={classes.item}>
                        <TextInput
                            module="insuree"
                            label="Family.address"
                            multiline
                            rows={2}
                            readOnly={true}
                            value={!edited ? "" : edited.address}
                        />
                    </Grid>
                    <Grid item xs={3} className={classes.item}>
                        <FormControlLabel
                            control={<Checkbox color="primary" checked={!!edited && !!edited.poverty} disabled={true} />}
                            label={formatMessage(intl, "insuree", "Family.poverty")}
                        />
                    </Grid>
                </Grid>
            </Fragment>
        );
    }
}

export default withTheme(
    withStyles(styles)(FamilyMasterPanel)
);