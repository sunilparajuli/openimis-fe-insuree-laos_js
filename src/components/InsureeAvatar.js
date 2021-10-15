import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from "react-intl";
import { Avatar, Grid, IconButton } from "@material-ui/core";
import { formatMessage, toISODate, PublishedComponent, TextInput } from "@openimis/fe-core";
import _ from "lodash";
import moment from "moment";

const styles = (theme) => ({
  bigAvatar: theme.bigAvatar,
});

class InsureeAvatar extends Component {
  state = {
    open: false,
  };

  componentDidMount() {
    this.setState({ photo: this.props.photo || {} });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (!_.isEqual(prevProps.photo, this.props.photo)) {
      this.setState({ photo: this.props.photo });
    }
  }

  withPhoto = () => !!this.state.photo && (!!this.state.photo.photo || !!this.state.photo.filename);

  url = () => {
    if (!!this.state.photo && !!this.state.photo.photo) {
      return `data:image/png;base64,${this.state.photo.photo}`;
    }
    if (!!this.state.photo && !!this.state.photo.filename) {
      return `/photos/${this.state.photo.folder}/${this.state.photo.filename}`;
    }
    return null;
  };

  fileSelected = (f) => {
    if (!!f.target.files) {
      const file = f.target.files[0];
      var reader = new FileReader();
      reader.onloadend = (loaded) => {
        this.updateAttributes({
          folder: null,
          filename: null,
          photo: btoa(loaded.target.result),
          date: toISODate(moment().toDate()),
        });
      };
      reader.readAsBinaryString(file);
    }
  };

  updateAttributes = (attrs) => {
    let photo = { ...this.props.photo, ...attrs };
    this.props.onChange(photo);
  };

  updateAttribute = (attr, v) => this.updateAttributes({ [attr]: v });

  render() {
    const { intl, classes, withMeta = false, readOnly } = this.props;
    const { photo } = this.state;
    return (
      <Grid container direction="column" alignItems="center" justify="center">
        <Grid container>
          {!!withMeta && (
            <Fragment>
              <Grid item xs={4} className={classes.item}>
                <PublishedComponent
                  pubRef="core.DatePicker"
                  value={!!photo ? photo.date : null}
                  module="insuree"
                  label="Insuree.photoDate"
                  readOnly={readOnly}
                  required={this.withPhoto()}
                  onChange={(v) => this.updateAttribute("date", v)}
                />
              </Grid>
              <Grid item xs={8} className={classes.item}>
                <PublishedComponent
                  pubRef="insuree.InsureeOfficerPicker"
                  value={!!photo ? photo.officerId : null}
                  module="insuree"
                  label={formatMessage(intl, "insuree", "Insuree.photoOfficer")}
                  readOnly={readOnly}
                  required={this.withPhoto()}
                  onChange={(v) => this.updateAttribute("officerId", v ? v.id : v)}
                />
              </Grid>
            </Fragment>
          )}
          <Grid item xs={12} className={classes.item}>
            <Grid container direction="column" alignItems="center" justify="center">
              <Grid item>
                {readOnly ? (
                  <Avatar src={this.url()} className={classes.bigAvatar} />
                ) : (
                  <IconButton variant="contained" component="label">
                    <Avatar src={this.url()} className={classes.bigAvatar} />
                    <input type="file" style={{ display: "none" }} onChange={(f) => this.fileSelected(f)} />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

const mapStateToProps = (state) => ({
  insuree: state.insuree.insuree,
});

export default withTheme(injectIntl(withStyles(styles)(connect(mapStateToProps)(InsureeAvatar))));
