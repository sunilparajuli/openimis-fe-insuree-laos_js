import React, { Component } from "react";
import { injectIntl } from 'react-intl';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import {
    formatMessageWithValues, withModulesManager, withHistory, historyPush,
} from "@openimis/fe-core";
import FamilyForm from "../components/FamilyForm";
import { createFamily, updateFamily } from "../actions";
import { RIGHT_FAMILY_ADD, RIGHT_FAMILY_EDIT } from "../constants";

const styles = theme => ({
    page: theme.page,
});

class FamilyPage extends Component {

    add = () => {
        historyPush(this.props.modulesManager, this.props.history, "insuree.route.familyEdit")
    }

    save = (family) => {
        if (!family.uuid) {
            this.props.createFamily(
                this.props.modulesManager,
                family,
                formatMessageWithValues(
                    this.props.intl,
                    "insuree",
                    "CreateFamily.mutationLabel",
                    { label: !!family.headInsuree && !!family.headInsuree.chfId ? family.headInsuree.chfId : "" }
                )
            );
        } else {
            this.props.updateFamily(
                this.props.modulesManager,
                family,
                formatMessageWithValues(
                    this.props.intl,
                    "insuree",
                    "UpdateFamily.mutationLabel",
                    { label: !!family.headInsuree && !!family.headInsuree.chfId ? family.headInsuree.chfId : "" }
                )
            );

        }
    }

    render() {
        const { classes, modulesManager, history, rights, family_uuid, overview } = this.props;
        if (!rights.includes(RIGHT_FAMILY_EDIT)) return null;

        return (
            <div className={classes.page}>
                <FamilyForm
                    overview={overview}
                    family_uuid={family_uuid}
                    back={e => historyPush(modulesManager, history, "insuree.route.families")}
                    add={rights.includes(RIGHT_FAMILY_ADD) ? this.add : null}
                    save={rights.includes(RIGHT_FAMILY_EDIT) ? this.save : null}
                />
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
    family_uuid: props.match.params.family_uuid,
})

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ createFamily, updateFamily }, dispatch);
};

export default withHistory(withModulesManager(connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(withTheme(withStyles(styles)(FamilyPage))
    ))));