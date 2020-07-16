import React, { Component } from "react";
import FamilyMasterPanel from "./FamilyMasterPanel";

class FamilyDisplayPanel extends Component {
    render() {
        return (
            <FamilyMasterPanel {...this.props} readOnly={true} edited={this.props.edited.family || {}}/>
        );
    }
}

export default FamilyDisplayPanel;