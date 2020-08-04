import React, { Component, Fragment } from "react";
import InsureeMasterPanel from "./InsureeMasterPanel";
import { Contributions } from "@openimis/fe-core";

const INSUREE_HEAD_INSUREE_PANELS_CONTRIBUTION_KEY = "insuree.HeadInsuree.panels"

class HeadInsureeMasterPanel extends Component {
    updateAttribute = (a, v) => {
        let edited = { ...this.props.edited }
        let head = edited["headInsuree"] || {};
        head[a] = v;
        edited["headInsuree"] = head;
        this.props.onEditedChanged(edited);
    }

    render() {
        const { edited } = this.props;
        return (
            <Fragment>
                <InsureeMasterPanel
                    {...this.props}
                    edited={!!edited ? edited.headInsuree : null}
                    updateAttribute={this.updateAttribute}
                    title="insuree.HeadInsureeMasterPanel.title"
                />
                <Contributions {...this.props}  updateAttribute={this.updateAttribute} contributionKey={INSUREE_HEAD_INSUREE_PANELS_CONTRIBUTION_KEY} />
            </Fragment>
        )
    }
}

export default HeadInsureeMasterPanel;