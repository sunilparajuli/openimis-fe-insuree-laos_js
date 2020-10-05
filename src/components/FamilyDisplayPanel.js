import React, { Component } from "react";
import FamilyMasterPanel from "./FamilyMasterPanel";

class FamilyDisplayPanel extends Component {
    render() {
        return (
            <FamilyMasterPanel {...this.props} readOnly={true} edited={this.props.edited.family || {}} overview={true} openFamilyButton={true}/>
        );
    }
}

export default FamilyDisplayPanel;