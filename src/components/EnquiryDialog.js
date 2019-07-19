import React, { Component } from "react";
import { injectIntl } from 'react-intl';
import { Dialog, Grid, Avatar, Typography, CircularProgress, Button, DialogActions, DialogContent } from "@material-ui/core";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { enquiry } from "../actions/enquiry";
import { formatMessage } from "@openimis/fe-core";
import { Error } from "@openimis/fe-core";

const styles = theme => ({
    container: {
        display: "flex",
        flexWrap: "wrap"
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200
    },
    dense: {
        marginTop: 19
    },
    menu: {
        width: 200
    },
    bigAvatar: {
        margin: 10,
        width: 100,
        height: 100
    },
    label: {
        color: "grey"
    },
    paper: {
        marginTop: theme.spacing(2)
    },
    paperHeader: {
        margin: theme.spacing(2),
        paddingTop: theme.spacing(2),
        color: "grey"
    },
    progress: {
        margin: theme.spacing(2),
    }
});

class EnquiryDialog extends Component {
    constructor(props) {
        super(props);
        this.state = ({ loading: false })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.chfid !== this.props.chfid) {
            this.props.enquiry(this.props.chfid);
        }
    }

    handleKeyPress = event => {
        if (event.charCode === 13) {
            this.props.onClose();
        }
    }

    render() {
        const { intl, classes,
            enquiry, fetching, onClose,
            insuree, error, errorMessage, errorDetail,
            ...other
        } = this.props;
        return (
            <Dialog onKeyPress={e => this.handleKeyPress(e)} {...other}>
                <DialogContent>
                    {fetching && <CircularProgress className={classes.progress} />}
                    {!fetching && error && <Error
                        code={error}
                        message={errorMessage}
                        detail={errorDetail}
                    />}
                    {!fetching && insuree &&
                        <form className={classes.container} noValidate autoComplete="off">
                            <Grid container>
                                <Grid item xs={12}>
                                    <Typography variant="h6">
                                        {insuree && insuree.chfId}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography className={classes.label} variant="caption">
                                        {insuree && insuree.lastName}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </form>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="primary">
                        {formatMessage(intl, 'insuree', 'close')}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

const mapStateToProps = state => ({
    fetching: state.insuree.fetching,
    insuree: state.insuree.insuree,
    error: state.insuree.error,
    errorMessage: state.insuree.errorMessage,
    errorDetail: state.insuree.errorDetail
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ enquiry }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(withTheme(
        withStyles(styles)(EnquiryDialog)
    ))
);