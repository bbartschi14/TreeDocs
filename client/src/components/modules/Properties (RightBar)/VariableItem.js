import React, { Component } from "react";
import "./VariableItem.css";
import "./FunctionItem.css";
import IconFromName from "../Common/IconFromName";
import CloseIcon from "@material-ui/icons/Close";
import { VARIABLE_TYPES } from "../Constants.js";
import FunctionItemParameter from "./FunctionItemParameter";

/**
 * Variable Item component for the properties panel
 *
 * Proptypes
 * @param {VariableObject} variableObject variable represented by this item
 * @param {(VariableObject) => ()} updateVariableInNodeObject
 */
class VariableItem extends Component {
  constructor(props) {
    super(props);
    this.state = { isEditing: false, editedVariableObject: null, isFirstTime: true };
  }

  handleStartEditingClick = (event) => {
    this.setState({ isEditing: true, editedVariableObject: this.props.variableObject });
    document.addEventListener("keydown", this.handleKeyPress);
  };

  handleKeyPress = (event) => {
    if (event.key == "Enter" && this.state.isEditing) {
      this.handleSaveAndClose(event);
    }
  };

  updateSelectedVariable = (newParam, i) => {
    let updatedObject = Object.assign({}, this.state.editedVariableObject);
    updatedObject.parameterObject = newParam;
    this.setState({ editedVariableObject: updatedObject });
  };

  handleSaveAndClose = (event) => {
    this.props.updateVariableInNodeObject(this.state.editedVariableObject);
    this.handleCancel(event);
    event.preventDefault();
  };

  handleCancel = (event) => {
    document.removeEventListener("keydown", this.handleKeyPress);
    this.setState({ isEditing: false });
    event.preventDefault();
  };

  handleSubmit = (event) => {
    event.preventDefault();
  };

  componentDidMount() {
    // if (this.state.isFirstTime) {
    //   this.handleStartEditingClick(null);
    // }
  }

  render() {
    return this.state.isEditing ? (
      <form className="FunctionItem-editingContainer" onSubmit={this.handleSubmit}>
        <FunctionItemParameter
          parameterIndex={0}
          selectedParam={this.state.editedVariableObject.parameterObject}
          updateSelectedParam={this.updateSelectedVariable}
          disableStyle={true}
          pullFocus={true}
        />
        <div className="FunctionItem-subContainer">
          <div className="u-flex">
            <button
              className="FunctionItem-editingSaveButton u-noselect"
              onClick={this.handleSaveAndClose}
            >
              Save
            </button>
            <button className="FunctionItem-editingCancelButton" onClick={this.handleCancel}>
              <CloseIcon />
            </button>
          </div>
        </div>
      </form>
    ) : (
      <div className="FunctionItem-container u-noselect" onClick={this.handleStartEditingClick}>
        <IconFromName
          iconName="Variable"
          iconColor={VARIABLE_TYPES[this.props.variableObject.parameterObject.type].color}
          tooltipText={this.props.variableObject.parameterObject.typeName}
        />
        <div className="FunctionItem-text">{this.props.variableObject.parameterObject.name}</div>
      </div>
    );
  }
}

export default VariableItem;
