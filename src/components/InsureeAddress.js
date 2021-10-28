import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Grid, FormControlLabel, Checkbox } from "@material-ui/core";
import { formatMessage, PublishedComponent, TextInput } from "@openimis/fe-core";

const styles = (theme) => ({
  item: theme.paper.item,
});

class InsureeAddress extends Component {
  state = {
    editedLocation: false,
    editedAddress: false,
  };

  renderLocation = () => {
    const { value, classes, readOnly, onChangeLocation } = this.props;
    if (
      !this.state.editedLocation &&
      (!value || !value.currentVillage || value.family?.location?.id === value.currentVillage.uuid)
    ) {
      return (
        <FormControlLabel
          className={classes.item}
          control={
            <Checkbox
              color="primary"
              checked={!this.state.editedLocation}
              disabled={readOnly}
              onChange={(e) => this.setState((state) => ({ editedLocation: !state.editedLocation }))}
            />
          }
          label={formatMessage(this.props.intl, "insuree", "Insuree.currentVillage.sameAsFamily")}
        />
      );
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
    );
  };

  renderAddress = () => {
    const { value, readOnly, onChangeAddress } = this.props;
    if (
      !this.state.editedAddress &&
      (!value || !value.currentAddress || value.family?.address === value.currentAddress)
    ) {
      return (
        <FormControlLabel
          control={
            <Checkbox
              color="primary"
              checked={!this.state.editedAddress}
              disabled={readOnly}
              onChange={(e) => this.setState((state) => ({ editedAddress: !state.editedAddress }))}
            />
          }
          label={formatMessage(this.props.intl, "insuree", "Insuree.currentAddress.sameAsFamily")}
        />
      );
    }
    return (
      <TextInput
        module="insuree"
        label="Insuree.currentAddress"
        multiline
        rows={5}
        readOnly={readOnly}
        value={value?.currentAddress ?? ""}
        onChange={onChangeAddress}
      />
    );
  };

  render() {
    const { classes } = this.props;
    return (
      <Grid container>
        <Grid item xs={6}>
          {this.renderLocation()}
        </Grid>
        <Grid item xs={6} className={classes.item}>
          {this.renderAddress()}
        </Grid>
      </Grid>
    );
  }
}

export default injectIntl(withTheme(withStyles(styles)(InsureeAddress)));
