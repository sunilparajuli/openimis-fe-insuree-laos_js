import React, { Component, Fragment } from "react";
import { withTheme, withStyles } from "@material-ui/core/styles";
import {
    IconButton,
    Grid,
    Paper,
    Select,
    FormControl,
    InputLabel,
    TextField,
    FormControlLabel,
    Checkbox
} from "@material-ui/core";
import { TextInput, formatMessage, PublishedComponent } from "@openimis/fe-core";

const styles = theme => ({
    item: theme.paper.item,
});

class FamilyMasterPanel extends Component {
    render() {
        const { intl, classes, edited } = this.props;
        return (
            <Grid container spacing={3} className={classes.item}>
                <Grid item xs={3}>
                    <TextInput
                        module="insuree"
                        label="Family.chfId"
                        required={true}
                        readOnly={true}
                        value={"" + edited.headInsuree.chfId}
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextInput
                        module="insuree"
                        label="Family.lastName"
                        required={true}
                        readOnly={true}
                        value={"" + edited.headInsuree.lastName}
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextInput
                        module="insuree"
                        label="Family.otherNames"
                        required={true}
                        readOnly={true}
                        value={"" + edited.headInsuree.otherNames}
                    />
                </Grid>
                <Grid item xs={3}>
                <PublishedComponent
                        pubRef="insuree.FamilyTypePicker"
                        readOnly={true}
                        withNull={true}    
                        nullLabel={formatMessage(intl, "insuree", "Family.FamilyType.null")}                    
                        value={edited.familyType}
                    />
                </Grid>                
                <Grid item xs={3}>
                    <PublishedComponent
                        pubRef="insuree.ConfirmationTypePicker"
                        readOnly={true}
                        withNull={true}    
                        nullLabel={formatMessage(intl, "insuree", "Family.ConfirmationType.null")}                    
                        value={edited.confirmationType}
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextInput
                        module="insuree"
                        label="Family.confirmationNo"
                        readOnly={true}
                        value={"" + edited.confirmationNo}
                    />
                </Grid>
                <Grid item xs={3}>
                    <TextInput
                        module="insuree"
                        label="Family.address"
                        multiline
                        rows={2}
                        readOnly={true}
                        value={"" + edited.address }
                    />
                </Grid>
                <Grid item xs={3}>
                    <FormControlLabel
                        control={<Checkbox color="primary" checked={!!edited.poverty} disabled={true} />}
                        label={formatMessage(intl, "insuree", "Family.poverty")}
                    />
                </Grid>                
            </Grid>
        );
    }
}

export default withTheme(
    withStyles(styles)(FamilyMasterPanel)
);