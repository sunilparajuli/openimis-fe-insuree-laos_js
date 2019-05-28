import React, { Component } from "react";
import { AssignmentInd, ListAlt, MonetizationOn, GroupAdd, People, PersonPin } from "@material-ui/icons";
import { MainMenuContribution } from "@openimis/fe-core";

class InsureeMainMenu extends Component {
  render() {
    return (
      <MainMenuContribution
        {...this.props}
        header="Insurees and Policies"
        icon={<AssignmentInd />}
        entries={[
          {
            text: "Add Family/Group",
            icon: <GroupAdd />,
            route: "/insuree/create",
            withDivider: true
          },
          { text: "Families/Groups", icon: <People />, route: "/insuree/families" },
          { text: "Insurees", icon: <PersonPin />, route: "/insuree/insurees" },
          { text: "Policies", icon: <ListAlt />, route: "/insuree/policies" },
          { text: "Contributiuons", icon: <MonetizationOn />, route: "/insuree/contributions" }
        ]}
      />
    );
  }
}
export { InsureeMainMenu };
