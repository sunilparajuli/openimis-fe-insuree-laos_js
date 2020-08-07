import React, { Component } from "react";
import { connect } from "react-redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Avatar, Grid, IconButton } from "@material-ui/core";
import InsureePhotoDialog from "./InsureePhotoDialog";

const styles = theme => ({
    bigAvatar: theme.bigAvatar
});

class InsureeAvatar extends Component {

    state = {
        open: false
    }
    render() {
        const { classes, insuree } = this.props;
        return (
            <Grid container direction="column" alignItems="center" justify="center">
                <InsureePhotoDialog insuree={insuree} open={this.state.open} close={e => this.setState({ open: false })} />
                <Grid item>
                    <IconButton onClick={e => this.setState({ open: true })}>
                        <Avatar
                            src={insuree && insuree.photo && `/photos/${insuree.photo.folder}/${insuree.photo.filename}`}
                            className={classes.bigAvatar}
                        />
                    </IconButton>
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