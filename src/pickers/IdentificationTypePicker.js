import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { injectIntl } from 'react-intl';
import { formatMessage, AutoSuggestion, withModulesManager } from "@openimis/fe-core";
import { fetchIdentificationTypes } from "../actions";
import _debounce from "lodash/debounce";
import _ from "lodash";

class IdentificationTypePicker extends Component {

    constructor(props) {
        super(props);
        this.selectThreshold = props.modulesManager.getConf("fe-insuree", "IdentificationTypePicker.selectThreshold", 10);
    }

    componentDidMount() {
        if (!this.props.IdentificationTypes) {
            // prevent loading multiple times the cache when component is
            // several times on a page
            setTimeout(
                () => {
                    !this.props.fetching && !this.props.fetched && this.props.fetchIdentificationTypes(this.props.modulesManager)
                },
                Math.floor(Math.random() * 300)
            );
        }
    }

    nullDisplay = this.props.nullLabel || formatMessage(this.props.intl, "insuree", `IdentificationType.null`)

    formatSuggestion = i => !!i ? `${formatMessage(this.props.intl, "insuree", `IdentificationType.${i}`)}` : this.nullDisplay

    onSuggestionSelected = v => this.props.onChange(v, this.formatSuggestion(v));

    render() {
        const { intl, identificationTypes, withLabel = true, label, withPlaceholder = false, placeholder, value, reset,
            readOnly = false, required = false,
            withNull = false, nullLabel = null
        } = this.props;
        return <AutoSuggestion
            module="insuree"
            items={identificationTypes}
            label={!!withLabel && (label || formatMessage(intl, "insuree", "IdentificationTypePicker.label"))}
            placeholder={!!withPlaceholder ? (placeholder || formatMessage(intl, "insuree", "IdentificationTypePicker.placehoder")) : null}
            getSuggestionValue={this.formatSuggestion}
            onSuggestionSelected={this.onSuggestionSelected}
            value={value}
            reset={reset}
            readOnly={readOnly}
            required={required}
            selectThreshold={this.selectThreshold}
            withNull={withNull}
            nullLabel={this.nullDisplay}
        />
    }
}

const mapStateToProps = state => ({
    identificationTypes: state.insuree.identificationTypes,
    fetching: state.insuree.fetchingIdentificationTypes,
    fetched: state.medical.fetchedIdentificationTypes,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators({ fetchIdentificationTypes }, dispatch);
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(
    withModulesManager(IdentificationTypePicker)));
