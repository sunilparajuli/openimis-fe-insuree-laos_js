import React, { Component } from "react";
import { injectIntl } from 'react-intl';
import { Dialog, CircularProgress, Button, DialogActions, DialogContent } from "@material-ui/core";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { enquiry } from "../actions/insuree";
import { formatMessage } from "@openimis/fe-core";
import { Contributions, Error } from "@openimis/fe-core";
import InsureeSummary from "./InsureeSummary";

const INSUREE_ENQUIRY_DIALOG_CONTRIBUTION_KEY = "insuree.EnquiryDialog";

const styles = theme => ({
    container: {
        display: "flex",
        flexWrap: "wrap",
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        width: 200
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
    escFunction = event => {
        if (event.keyCode === 27) {
            this.props.onClose();
        }
    }
    componentDidMount() {
        document.addEventListener("keydown", this.escFunction, false);
    }
    componentWillUnmount() {
        document.removeEventListener("keydown", this.escFunction, false);
    }

    render() {
        const { intl, classes,
            fetching, insuree, error,
            onClose
        } = this.props;
        return (
            <Dialog maxWidth="md" fullWidth={true} open={this.props.open}>
                <DialogContent>
                    {!!fetching && (<CircularProgress className={classes.progress} />)}
                    {!fetching && !!error && (<Error error={error} />)}
                    {!fetching && !!insuree && (
                        <form className={classes.container} noValidate autoComplete="off">
                            <InsureeSummary modulesManager={this.props.modulesManager} insuree={insuree} />
                        </form>
                    )}
                    <Contributions contributionKey={INSUREE_ENQUIRY_DIALOG_CONTRIBUTION_KEY}/>
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
    error: state.insuree.error
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ enquiry }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(withTheme(
        withStyles(styles)(EnquiryDialog)
    ))
);