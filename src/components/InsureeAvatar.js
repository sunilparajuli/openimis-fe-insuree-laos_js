import React, { Component } from "react";
import { connect } from "react-redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Avatar, Grid } from "@material-ui/core";

const styles = theme => ({
    bigAvatar: theme.bigAvatar
});

class InsureeAvatar extends Component {
    render() {
        const { classes, insuree } = this.props;
        return (
            <Grid container direction="column" alignItems="center" justify="center">
                <Grid item xs={1}>
                    <Avatar
                        src={insuree && insuree.photo && `/photos/${insuree.photo.folder}/${insuree.photo.filename}`}
                        className={classes.bigAvatar}
                    />
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = state => ({
    insuree: state.insuree.insuree,
});

export default withTheme(
    withStyles(styles)(connect(mapStateToProps)(InsureeAvatar))
);