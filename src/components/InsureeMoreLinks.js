import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { injectIntl } from 'react-intl';
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Grid, Link } from "@material-ui/core";
import { FormattedMessage } from "@openimis/fe-core";

const styles = theme => ({
    cont: {
        margin: theme.spacing(1),
    },
    lnk: {
        textAlign: "center"
    }
});

class InsureeMoreLinks extends Component {
    render() {
        const { classes, insuree } = this.props;
        return (
            <Grid container className={classes.cont} >
                <Grid item xs={6} className={classes.lnk}>
                    <Link href={`/insuree/cappedItemService?nshid=${insuree.chfId}`}>
                        <FormattedMessage module="insuree" id="moreLinks.capped" />
                    </Link>
                </Grid>
                <Grid item xs={6} className={classes.lnk}>
                    <Link href={`/insuree/profile?nshid=${insuree.chfId}`}>
                        <FormattedMessage module="insuree" id="moreLinks.profile" />
                    </Link>
                </Grid>
            </Grid>
        )
    }
}

const mapStateToProps = state => ({
    insuree: state.insuree.insuree,
});

export default injectIntl(withTheme(
    withStyles(styles)(connect(mapStateToProps)(InsureeMoreLinks))
));

