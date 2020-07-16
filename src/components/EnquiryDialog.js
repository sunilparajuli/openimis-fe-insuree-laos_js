import React, { Component, Fragment } from "react";
import { injectIntl } from 'react-intl';
import { Dialog, Button, DialogActions, DialogContent } from "@material-ui/core";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Router } from "react-router-dom";
import { fetchInsuree } from "../actions";
import {
    formatMessage, formatMessageWithValues, Contributions, Error, ProgressOrError,
    withModulesManager, withHistory
} from "@openimis/fe-core";
import InsureeSummary from "./InsureeSummary";

const INSUREE_ENQUIRY_DIALOG_CONTRIBUTION_KEY = "insuree.EnquiryDialog";

const styles = theme => ({
});

class EnquiryDialog extends Component {

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.chfid !== this.props.chfid) {
            this.props.fetchInsuree(this.props.modulesManager, this.props.chfid);
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
        const { intl, history, fetching, fetched, insuree, error, onClose } = this.props;
        return (
            <Dialog maxWidth="lg" fullWidth={true} open={this.props.open}>
                <DialogContent>
                    <ProgressOrError progress={fetching} error={error} />
                    {!!fetched && !insuree && (
                        <Error error={
                            {
                                code: formatMessage(intl, 'insuree', 'notFound'),
                                detail: formatMessageWithValues(intl, 'insuree', 'chfidNotFound', { chfid: this.props.chfid })
                            }
                        } />
                    )}
                    {!fetching && !!insuree && (
                        <Fragment>
                            <InsureeSummary modulesManager={this.props.modulesManager} insuree={insuree} />
                            <Router history={history}>
                                <Contributions contributionKey={INSUREE_ENQUIRY_DIALOG_CONTRIBUTION_KEY} insuree={insuree}/>
                            </Router>
                        </Fragment>
                    )}
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
    fetching: state.insuree.fetchingInsuree,
    fetched: state.insuree.fetchedInsuree,
    insuree: state.insuree.insuree,
    error: state.insuree.errorInsuree
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchInsuree }, dispatch);
};

export default withModulesManager(withHistory(connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(withTheme(
        withStyles(styles)(EnquiryDialog)
    ))))
);