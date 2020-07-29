import React, { Component, Fragment } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from 'react-intl';
import {
    Grid,
    FormControlLabel,
    Checkbox,
    Typography,
    Divider,
    Tooltip,
    IconButton
} from "@material-ui/core";
import { People as PeopleIcon } from '@material-ui/icons';
import {
    historyPush, withHistory, withModulesManager,
    TextInput, formatMessage, PublishedComponent, FormattedMessage
} from "@openimis/fe-core";


const styles = theme => ({
    tableTitle: theme.table.title,
    item: theme.paper.item,
    fullHeight: {
        height: "100%"
    },
});

class FamilyMasterPanel extends Component {
    render() {
        const { intl, classes, edited, openFamilyButton = false } = this.props;
        return (
            <Fragment>
                <Grid container className={classes.tableTitle}>
                    <Grid item>
                        <Grid container align="center" justify="center" direction="column" className={classes.fullHeight}>
                            <Grid item>
                                <Typography >
                                    <FormattedMessage module="insuree" id="insuree.FamilyDetailPanel.title" />
                                </Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                    {!!openFamilyButton && (
                        <Grid item>
                            <Tooltip title={formatMessage(this.props.intl, "insuree", "insureeSummaries.openFamilyButton.tooltip")}>
                                <IconButton onClick={e => historyPush(this.props.modulesManager, this.props.history, "insuree.route.familyOverview", [edited.uuid])}><PeopleIcon /></IconButton >
                            </Tooltip>
                        </Grid>
                    )}
                </Grid>
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
                            label="Family.headInsuree.chfId"
                            required={true}
                            readOnly={true}
                            value={!edited || !edited.headInsuree ? "" : edited.headInsuree.chfId}
                        />
                    </Grid>
                    <Grid item xs={3} className={classes.item}>
                        <TextInput
                            module="insuree"
                            label="Family.headInsuree.lastName"
                            required={true}
                            readOnly={true}
                            value={!edited || !edited.headInsuree ? "" : edited.headInsuree.lastName}
                        />
                    </Grid>
                    <Grid item xs={3} className={classes.item}>
                        <TextInput
                            module="insuree"
                            label="Family.headInsuree.otherNames"
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

export default withModulesManager(withHistory(injectIntl(withTheme(
    withStyles(styles)(FamilyMasterPanel)
))));