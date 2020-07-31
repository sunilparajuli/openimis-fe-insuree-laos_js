import React, { Component } from "react";
import InsureeForm from "./InsureeForm";


class HeadInsureeForm extends Component {
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
            <InsureeForm
                {...this.props}
                edited={!!edited ? edited.headInsuree : null}
                updateAttribute={this.updateAttribute}
                title="insuree.HeadInsureeForm.title"
            />
        )
    }
}

export default HeadInsureeForm;