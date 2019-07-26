import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { bindActionCreators } from "redux";
import { insureeFamily } from "../actions/insuree";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { formatMessage, Contributions, Error, SmallTable } from "@openimis/fe-core";
import { CircularProgress, Paper } from "@material-ui/core";

const INSUREE_FAMILY_SUMMARY_CONTRIBUTION_KEY = "insuree.InsureeFamilySummary";

const styles = theme => ({});

class InsureeFamilySummary extends Component {

    constructor(props) {
        super(props);
        if (!!props.insuree) {
            props.insureeFamily(props.insuree.chfId);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (!prevProps.insuree && !!this.props.insuree
            || !!prevProps.insuree && this.props.insuree && (
                prevProps.insuree.chfId == null
                || prevProps.insuree.chfId !== this.props.insuree.chfId
            )
        ) {
            this.props.insureeFamily(this.props.insuree.chfId);
        }
    }

    render() {
        const { classes, insuree, fetchingFamily, insureeFamilyMembers, errorFamily } = this.props;
        return (
            <Fragment>
                {!!fetchingFamily && (<CircularProgress className={classes.progress} />)}
                {!fetchingFamily && !!errorFamily && (<Error error={errorFamily} />)}
                {!fetchingFamily && !!insuree && !!insureeFamilyMembers && (
                    <Paper className={classes.paper}>
                        <SmallTable
                            module="insuree"
                            header="familySummary"
                            headers={[
                                "familySummary.chfId",
                                "familySummary.name",
                                "familySummary.phone",
                            ]}
                            itemFormatters={[
                                i => i.chfId,
                                i => `${i.otherNames} ${i.lastName} ${i.head ? formatMessage(this.props.intl, "insuree", "insuree.familySummary.head"):  null}`,
                                i => i.phone,
                            ]}
                            items={insureeFamilyMembers}
                        />
                    </Paper>
                )}
                <Contributions contributionKey={INSUREE_FAMILY_SUMMARY_CONTRIBUTION_KEY} />
            </Fragment>
        )
    }
}

const mapStateToProps = state => ({
    insuree: state.insuree.insuree,
    fetchingFamily: state.insuree.fetchingFamily,
    insureeFamilyMembers: state.insuree.insureeFamilyMembers,
    errorFamily: state.insuree.errorFamily,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ insureeFamily }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(withTheme(
        withStyles(styles)(InsureeFamilySummary)
    ))
);
