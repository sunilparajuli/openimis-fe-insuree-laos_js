import React, { Component } from "react";
import { injectIntl } from 'react-intl';
import { AssignmentInd, ListAlt, MonetizationOn, GroupAdd, People, PersonPin } from "@material-ui/icons";
import { formatMessage, MainMenuContribution } from "@openimis/fe-core";

class InsureeMainMenu extends Component {
  render() {
    return (
      <MainMenuContribution
        {...this.props}
        header={formatMessage(this.props.intl, "insuree", "mainMenu")}
        icon={<AssignmentInd />}
        entries={[
          {
            text: formatMessage(this.props.intl, "insuree", "menu.addFamilyOrGroup"),
            icon: <GroupAdd />,
            route: "/insuree/create",
            withDivider: true
          },
          {
            text: formatMessage(this.props.intl, "insuree", "menu.familiesOrGroups"),
            icon: <People />,
            route: "/insuree/families"
          },
          {
            text: formatMessage(this.props.intl, "insuree", "menu.insurees"),
            icon: <PersonPin />,
            route: "/insuree/insurees"
          },
          {
            text: formatMessage(this.props.intl, "insuree", "menu.policies"),
            icon: <ListAlt />,
            route: "/insuree/policies"
          },
          {
            text: formatMessage(this.props.intl, "insuree", "menu.contributions"),
            icon: <MonetizationOn />,
            route: "/insuree/contributions"
          }
        ]}
      />
    );
  }
}
export default injectIntl(InsureeMainMenu);
