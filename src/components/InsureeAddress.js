import React, { Component } from "react";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from "@material-ui/core/styles";
import {
    Grid, FormControlLabel, Checkbox
} from "@material-ui/core";
import { formatMessage, PublishedComponent, TextInput } from "@openimis/fe-core";


const styles = theme => ({
    item: theme.paper.item,
});


class InsureeAddress extends Component {

    state = {
        editedLocation: false,
        editedAddress: false,
    }


    renderLocation = () => {
        const { intl, classes, value, readOnly, onChangeLocation } = this.props;
        if (!this.state.editedLocation && (
            !value || !value.currentVillage ||
            (!!value.currentVillage && !!value.family && !!value.family.location && value.currentVillage.uuid === value.family.location.id)
        )) {
            return (
                <FormControlLabel
                    control={<Checkbox
                        color="primary"
                        checked={!this.state.editedLocation}
                        disabled={readOnly}
                        onChange={e => this.setState((state) => ({ editedLocation: !state.editedLocation }))}
                    />}
                    label={formatMessage(this.props.intl, "insuree", "Insuree.currentVillage.sameAsFamily")}
                />
            )
        }
        return (
            <PublishedComponent
                pubRef="location.DetailedLocation"
                withNull={true}
                value={!!value ? value.currentVillage : null}
                split={true}
                readOnly={readOnly}
                onChange={onChangeLocation}
                filterLabels={false}
            />
        )
    }

    renderAddress = () => {
        const { intl, classes, value, readOnly, onChangeAddress } = this.props;
        if (!this.state.editedAddress && (
            !value || !value.currentAddress ||
            (!!value.currerntAddress && !!value.family && !!value.family.address && value.currentAddress === value.family.address)
        )) {
            return (
                <FormControlLabel
                    control={<Checkbox 
                        color="primary"
                        checked={!this.state.editedAddress}
                        disabled={readOnly}
                        onChange={e => this.setState((state) => ({ editedAddress: !state.editedAddress }))}
                    />}
                    label={formatMessage(this.props.intl, "insuree", "Insuree.currentAddress.sameAsFamily")}
                />
            )
        }
        return (
            <TextInput
                module="insuree"
                label="Insuree.currentAddress"
                multiline
                rows={5}
                readOnly={readOnly}
                value={!!value && !!value.currentAddress ? value.currentAddress : ""}
                onChange={onChangeAddress}
            />
        )
    }

    render() {
        const { classes, value } = this.props;
        return (
            <Grid container>
                <Grid item xs={6} className={classes.item}>
                    {this.renderLocation()}
                </Grid>
                <Grid item xs={6} className={classes.item}>
                    {this.renderAddress()}
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = state => ({
    insuree: state.insuree.insuree,
});

export default injectIntl(withTheme(
    withStyles(styles)(connect(mapStateToProps)(InsureeAddress))
));