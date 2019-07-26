import React, { Component } from "react";
import { injectIntl } from 'react-intl';
import { AssignmentInd, GroupAdd, People, PersonPin } from "@material-ui/icons";
import { formatMessage, MainMenuContribution } from "@openimis/fe-core";

const INSUREE_MAIN_MENU_CONTRIBUTION_KEY = "insuree.MainMenu";

class InsureeMainMenu extends Component {
  render() {
    let entries = [
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
      ...this.props.modulesManager.getContributions(INSUREE_MAIN_MENU_CONTRIBUTION_KEY)
    ]
    return (
      <MainMenuContribution
        {...this.props}
        header={formatMessage(this.props.intl, "insuree", "mainMenu")}
        icon={<AssignmentInd />}
        entries={entries}
      />
    );
  }
}
export default injectIntl(InsureeMainMenu);
