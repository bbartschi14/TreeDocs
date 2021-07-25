import React, { Component } from "react";
import "./VariableTypeSelector.css";
import EditableText from "./EditableText";
import IconFromName from "./IconFromName";
import { VARIABLE_TYPES } from "../Constants.js";
/**
 * Component to select variable type
 *
 * Proptypes
 * @property {ParameterObject} selectedParam
 * @property {(ParameterObject) => ()} updateSelectedParam
 */
class VariableTypeSelector extends Component {
  constructor(props) {
    super(props);
  }

  handleChange = (event) => {
    let updatedObject = Object.assign({}, this.props.selectedParam);
    updatedObject.type = event.target.value;
    updatedObject.typeName = VARIABLE_TYPES[event.target.value].typeName;
    this.props.updateSelectedParam(updatedObject);
  };

  handleCustomTextEvent = (event) => {
    let updatedObject = Object.assign({}, this.props.selectedParam);
    updatedObject.typeName = event.target.value;
    this.props.updateSelectedParam(updatedObject);
  };

  render() {
    return (
      <>
        <div className="VariableTypeSelector-container ">
          <IconFromName
            iconName="Variable"
            iconColor={VARIABLE_TYPES[this.props.selectedParam.type].color}
          />
          <select
            className="VariableTypeSelector-dropDown "
            onChange={this.handleChange}
            value={this.props.selectedParam.type}
          >
            {VARIABLE_TYPES.map((variable, i) => (
              <option key={i} value={i}>
                {variable.type}
              </option>
            ))}
          </select>
          {this.props.selectedParam.type == 0 ? (
            <div style={{ paddingLeft: "8px", marginBottom: "16px" }}>
              <EditableText
                iconSize="medium"
                text={this.props.selectedParam.typeName}
                onTextChanged={this.handleCustomTextEvent}
              />
            </div>
          ) : null}
        </div>
        <div className="EditableText-property u-noselect">{"Variable Type"}</div>
      </>
    );
  }
}

export default VariableTypeSelector;
