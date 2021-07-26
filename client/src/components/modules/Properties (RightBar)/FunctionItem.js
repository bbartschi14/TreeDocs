import React, { Component } from "react";
import "./FunctionItem.css";
import "./PropertiesPanel.css";
import EditableText from "../Common/EditableText";
import CloseIcon from "@material-ui/icons/Close";
import VariableTypeSelector from "../Common/VariableTypeSelector";
import FunctionItemParameter from "./FunctionItemParameter";
import AddPropertyButton from "./AddPropertyButton";
import { VARIABLE_TYPES } from "../Constants.js";
import IconFromName from "../Common/IconFromName";
/**
 * Function Item component for the properties panel
 *
 * Proptypes
 * @param {FunctionObject} functionObject function represented by this item
 * @param {(FunctionObject) => ()} updateFunctionInNodeObject
 */
class FunctionItem extends Component {
  constructor(props) {
    super(props);
    this.state = { isEditing: false, editedFunctionObject: null, isFirstTime: true };
  }

  handleKeyPress = (event) => {
    if (event.key == "Enter" && this.state.isEditing) {
      this.handleSaveAndClose(event);
    }
  };

  handleFunctionNameChanged = (event) => {
    let updatedObject = Object.assign({}, this.state.editedFunctionObject);
    updatedObject.name = event.target.value;
    this.setState({ editedFunctionObject: updatedObject });
  };

  handleFunctionReturnValueChanged = (newParamObj) => {
    let updatedObject = Object.assign({}, this.state.editedFunctionObject);
    updatedObject.returnValue = newParamObj;
    this.setState({ editedFunctionObject: updatedObject });
  };

  handleAddParameterButtonClicked = () => {
    let newParam = { name: "NewParam", type: 1, typeName: "Int" };
    let updatedObject = Object.assign({}, this.state.editedFunctionObject);
    updatedObject.parameters = this.state.editedFunctionObject.parameters.concat([newParam]);
    this.setState({ editedFunctionObject: updatedObject });
  };

  updateSelectedParam = (updatedParam, i) => {
    let updatedObject = Object.assign({}, this.state.editedFunctionObject);
    updatedObject.parameters[i] = updatedParam;
    this.setState({ editedFunctionObject: updatedObject });
  };

  handleStartEditingClick = (event) => {
    document.addEventListener("keydown", this.handleKeyPress);
    this.setState({ isEditing: true, editedFunctionObject: this.props.functionObject });
  };

  handleSaveAndClose = (event) => {
    this.props.updateFunctionInNodeObject(this.state.editedFunctionObject);
    this.handleCancel(event);
  };

  handleCancel = (event) => {
    document.removeEventListener("keydown", this.handleKeyPress);
    this.setState({ isEditing: false, isFirstTime: false });
  };

  componentDidMount() {
    // if (this.state.isFirstTime) {
    //   this.handleStartEditingClick(null);
    // }
  }
  render() {
    return this.state.isEditing && //|| this.state.isFirstTime) &&
      this.state.editedFunctionObject != null ? (
      <form className="FunctionItem-editingContainer">
        <div className="FunctionItem-editingContainerHeader">Name</div>
        <div className="FunctionItem-subContainer">
          <EditableText
            customClass="PropertiesPanel-selectionParentName"
            text={this.state.editedFunctionObject.name}
            onTextChanged={this.handleFunctionNameChanged}
            iconSize="medium"
            propertyName="Function Name"
            pullFocus={true}
          />
          {/* <div style={{ height: "8px" }}></div> */}
        </div>

        <div className="FunctionItem-editingContainerHeader">Return Value</div>
        <div className="FunctionItem-subContainer">
          <VariableTypeSelector
            selectedParam={this.state.editedFunctionObject.returnValue}
            updateSelectedParam={this.handleFunctionReturnValueChanged}
          />
        </div>

        <div className="FunctionItem-editingContainerHeader">
          <div>Parameters</div>
          <AddPropertyButton
            buttonText={"Add Parameter"}
            onAddClicked={this.handleAddParameterButtonClicked}
            useSecondaryColors={true}
          />
        </div>
        <div className="FunctionItem-subContainer">
          {this.state.editedFunctionObject.parameters.map((param, i) => (
            <FunctionItemParameter
              key={"Item_" + i}
              parameterIndex={i}
              selectedParam={param}
              updateSelectedParam={this.updateSelectedParam}
            />
          ))}
        </div>

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
          iconName="Function"
          iconColor={VARIABLE_TYPES[this.props.functionObject.returnValue.type].color}
          tooltipText={this.props.functionObject.returnValue.typeName}
        />
        <div className="FunctionItem-text">{this.props.functionObject.name}</div>
        <div className="FunctionItem-parentheses" style={{ marginLeft: "8px" }}>
          (
        </div>
        {this.props.functionObject.parameters.map((param, i) => (
          <>
            <IconFromName
              key={"Item_" + i}
              iconName="Variable"
              iconColor={VARIABLE_TYPES[param.type].color}
              tooltipText={param.typeName + ": " + param.name}
            />
            {i == this.props.functionObject.parameters.length - 1 ? null : (
              <div key={"Item2_" + i}>,</div>
            )}
          </>
        ))}
        <div className="FunctionItem-parentheses">)</div>
      </div>
    );
  }
}

export default FunctionItem;
