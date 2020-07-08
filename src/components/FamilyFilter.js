import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import _debounce from "lodash/debounce";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { injectIntl } from 'react-intl';
import { Checkbox, FormControlLabel, Grid, Slider } from "@material-ui/core";
import {
    withModulesManager, formatMessage,
    FormattedMessage, PublishedComponent, ControlledField, TextInput
} from "@openimis/fe-core";

const styles = theme => ({
    dialogTitle: theme.dialog.title,
    dialogContent: theme.dialog.content,
    form: {
        padding: 0
    },
    item: {
        padding: theme.spacing(1)
    },
    paperDivider: theme.paper.divider,
    tristate: {
        width: "200px",
    },
});

class FamilyFilter extends Component {

    state = {
        showHistory: false,
    }

    constructor(props) {
        super(props);
        this.tristateMarks = [-1, 0, 1].map(value => {
            return {
                value,
                label: formatMessage(props.intl, "insuree", `FamilyFilter.poverty.Tristate.${value}`)
            }
        })
    }

    debouncedOnChangeFilter = _debounce(
        this.props.onChangeFilters,
        this.props.modulesManager.getConf("fe-insuree", "debounceTime", 800)
    )

    _filterValue = k => {
        const { filters } = this.props;
        return !!filters && !!filters[k] ? filters[k].value : null
    }

    _onChangeShowHistory = () => {
        let filters = [
            {
                id: 'showHistory',
                value: !this.state.showHistory,
                filter: `showHistory: ${!this.state.showHistory}`
            }
        ];
        this.props.onChangeFilters(filters);
        this.setState((state) => ({
            showHistory: !state.showHistory
        }));
    }

    render() {
        const { intl, classes, filters, onChangeFilters } = this.props;
        return (
            <Grid container className={classes.form}>
                <ControlledField module="insuree" id="FamilyFilter.location" field={
                    <Grid item xs={12} className={classes.item}>
                        <PublishedComponent
                            pubRef="location.DetailedLocationFilter"
                            withNull={true}
                            filters={filters}
                            onChangeFilters={onChangeFilters}
                            anchor="parentLocation"
                        />
                    </Grid>
                } />
                <ControlledField module="insuree" id="FamilyFilter.chfId" field={
                    <Grid item xs={3} className={classes.item}>
                        <TextInput
                            module="insuree" label="FamilyFilter.chfId"
                            name="chfId"
                            value={this._filterValue('chfId')}
                            onChange={v => this.debouncedOnChangeFilter([
                                {
                                    id: 'chfId',
                                    value: v,
                                    filter: `headInsuree_ChfId_Istartswith: "${v}"`
                                }
                            ])}
                        />
                    </Grid>
                } />
                <ControlledField module="insuree" id="FamilyFilter.lastName" field={
                    <Grid item xs={3} className={classes.item}>
                        <TextInput
                            module="insuree" label="FamilyFilter.lastName"
                            name="lastName"
                            value={this._filterValue('lastName')}
                            onChange={v => this.debouncedOnChangeFilter([
                                {
                                    id: 'lastName',
                                    value: v,
                                    filter: `headInsuree_LastName_Icontains: "${v}"`
                                }
                            ])}
                        />
                    </Grid>
                } />
                <ControlledField module="insuree" id="FamilyFilter.givenName" field={
                    <Grid item xs={3} className={classes.item}>
                        <TextInput
                            module="insuree" label="FamilyFilter.givenName"
                            name="givenName"
                            value={this._filterValue('givenName')}
                            onChange={v => this.debouncedOnChangeFilter([
                                {
                                    id: 'givenName',
                                    value: v,
                                    filter: `headInsuree_OtherNames_Icontains: "${v}"`
                                }
                            ])}
                        />
                    </Grid>
                } />
                <ControlledField module="insuree" id="FamilyFilter.email" field={
                    <Grid item xs={3} className={classes.item}>
                        <TextInput
                            module="insuree" label="FamilyFilter.email"
                            name="email"
                            value={this._filterValue('email')}
                            onChange={v => this.debouncedOnChangeFilter([
                                {
                                    id: 'email',
                                    value: v,
                                    filter: `headInsuree_Email_Icontains: "${v}"`
                                }
                            ])}
                        />
                    </Grid>
                } />
                <ControlledField module="insuree" id="FamilyFilter.dob" field={
                    <Grid item xs={3}>
                        <Grid container>
                            <Grid item xs={6} className={classes.item}>
                                <PublishedComponent pubRef="core.DatePicker"
                                    value={this._filterValue('dobFrom')}
                                    module="insuree"
                                    label="FamilyFilter.dobFrom"
                                    onChange={d => onChangeFilters([
                                        {
                                            id: 'dobFrom',
                                            value: d,
                                            filter: `headInsuree_Dob_Gte: "${d}"`
                                        }
                                    ])}
                                />
                            </Grid>
                            <Grid item xs={6} className={classes.item}>
                                <PublishedComponent pubRef="core.DatePicker"
                                    value={this._filterValue('dobTo')}
                                    module="insuree"
                                    label="FamilyFilter.dobTo"
                                    onChange={d => onChangeFilters([
                                        {
                                            id: 'dobTo',
                                            value: d,
                                            filter: `headInsuree_Dob_Lte: "${d}"`
                                        }
                                    ])}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                } />
                <ControlledField module="insuree" id="FamilyFilter.poverty" field={
                    <Grid item xs={3}>
                        <Grid container alignItems="center" justify="center" direction="column">
                            <Grid item>
                                <FormattedMessage module="insuree" id="FamilyFilter.poverty" />
                            </Grid>
                            <Grid item>
                                <Slider className={classes.tristate}
                                    min={-1}
                                    max={1}
                                    step={1}
                                    value={this._filterValue('poverty') === null ? -1 : this._filterValue('poverty')}
                                    defaultValue={-1}
                                    valueLabelDisplay="off"
                                    marks={this.tristateMarks}
                                    onChange={(e, v) => onChangeFilters([
                                        {
                                            id: 'poverty',
                                            value: v,
                                            filter: v === -1 ? null : `nullAsFalsePoverty: ${!v}`
                                        }
                                    ])}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                } />
                <ControlledField module="insuree" id="FamilyFilter.confirmationNo" field={
                    <Grid item xs={3} className={classes.item}>
                        <TextInput
                            module="insuree" label="FamilyFilter.confirmationNo"
                            name="confirmationNo"
                            value={this._filterValue('confirmationNo')}
                            onChange={v => this.debouncedOnChangeFilter([
                                {
                                    id: 'confirmationNo',
                                    value: v,
                                    filter: `confirmationNo_Istartswith: "${v}"`
                                }
                            ])}
                        />
                    </Grid>
                } />
                <ControlledField module="insuree" id="FamilyFilter.showHistory" field={
                    <Grid item xs={2} className={classes.item}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    color="primary"
                                    checked={this.state.showHistory}
                                    onChange={e => this._onChangeShowHistory()}
                                />
                            }
                            label={formatMessage(intl, "insuree", "FamilyFilter.showHistory")}
                        />
                    </Grid>
                } />
            </Grid >
        )
    }
}

export default withModulesManager(injectIntl((withTheme(withStyles(styles)(FamilyFilter)))));