import React, { Component } from "react";
import { injectIntl } from 'react-intl';
import { Dialog, Button, DialogActions, DialogContent } from "@material-ui/core";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { fetchInsuree } from "../actions";
import { formatMessage, Contributions, Error, ProgressOrError } from "@openimis/fe-core";
import InsureeSummary from "./InsureeSummary";

const INSUREE_ENQUIRY_DIALOG_CONTRIBUTION_KEY = "insuree.EnquiryDialog";

const styles = theme => ({
});

class EnquiryDialog extends Component {
    constructor(props) {
        super(props);
        this.state = ({ loading: false })
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.chfid !== this.props.chfid) {
            this.props.fetchInsuree(this.props.chfid);
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
        const { intl, fetching, fetched, insuree, error, onClose } = this.props;
        return (
            <Dialog maxWidth="md" fullWidth={true} open={this.props.open}>
                <DialogContent>
                    <ProgressOrError progress={fetching} error={error} />
                    {!!fetched && !insuree && (
                        <Error error={
                            {
                                code: formatMessage(intl, 'insuree', 'notFound'),
                                detail: formatMessage(intl, 'insuree', 'chfidNotFound', {chfid: this.props.chfid})
                            }
                        }/>
                    )}
                    {!fetching && !!insuree && (
                        <InsureeSummary modulesManager={this.props.modulesManager} insuree={insuree} />
                    )}
                    <Contributions contributionKey={INSUREE_ENQUIRY_DIALOG_CONTRIBUTION_KEY} />
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
    fetched: state.insuree.fetched,
    insuree: state.insuree.insuree,
    error: state.insuree.error
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchInsuree }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(withTheme(
        withStyles(styles)(EnquiryDialog)
    ))
);