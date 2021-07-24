import React, { Component } from "react";
import EditableText from "../Common/EditableText.js";
import EditableTextBlock from "../Common/EditableTextBlock.js";
import CollapsablePanel from "../Common/CollapsablePanel.js";
import FunctionItem from "./FunctionItem.js";
import VariableItem from "./VariableItem.js";
import "./PropertiesPanel.css";
import AddPropertyButton from "./AddPropertyButton.js";
import nextId from "react-id-generator";
import HorizontalResizer from "../Common/HorizontalResizer.js";

/**
 * Panel component for the right-side properties. Will display
 * object name and sub-information, as well as the editing of descriptions.
 *
 * Will display differently for each type of object (Class, Function, Variable).
 *  - Class: should allow creation of function and variables
 *  - Function: should allow definition of return type and arguments
 *
 * Proptypes
 * @param {SelectableObject} selectedObject current selectedObject
 * @param {string} selectedObjectType
 * @param {(NodeObject) => ()} updateSelectedNode callback function passing in the new updated selected node
 */
class PropertiesPanel extends Component {
  constructor(props) {
    super(props);
  }

  handleNamePropertyChanged = (event) => {
    let updatedObject = Object.assign({}, this.props.selectedObject); // creating copy of selected node prop
    updatedObject.classObject.name = event.target.value; // update the name property, assign a new value
    this.props.updateSelectedNode(updatedObject);
  };

  handleParentPropertyChanged = (event) => {
    let updatedObject = Object.assign({}, this.props.selectedObject); // creating copy of selected node prop
    updatedObject.classObject.parent = event.target.value; // update the parent property, assign a new value
    this.props.updateSelectedNode(updatedObject);
  };

  handleDescriptionPropertyChanged = (event) => {
    let updatedObject = Object.assign({}, this.props.selectedObject); // creating copy of selected node prop
    updatedObject.classObject.description = event.currentTarget.textContent; // update the parent property, assign a new value
    this.props.updateSelectedNode(updatedObject);
  };

  handleAddFunctionToClass = (newFunction) => {
    let updatedNode = Object.assign({}, this.props.selectedObject);
    updatedNode.classObject.functions = this.props.selectedObject.classObject.functions.concat([
      newFunction,
    ]);
    this.props.updateSelectedNode(updatedNode);
  };

  handleAddVariableToClass = (newVariable) => {
    let updatedNode = Object.assign({}, this.props.selectedObject);
    updatedNode.classObject.variables = this.props.selectedObject.classObject.variables.concat([
      newVariable,
    ]);
    this.props.updateSelectedNode(updatedNode);
  };

  handleAddFunctionButtonClicked = () => {
    let id = nextId();
    let newFunction = {
      parent: this.props.selectedObject.classObject,
      name: "NewFunction_" + id,
      _id: id,
    };
    this.handleAddFunctionToClass(newFunction);
  };

  handleAddVariableButtonClicked = () => {
    let id = nextId();
    let newVariable = {
      parent: this.props.selectedObject.classObject,
      name: "NewVariable_" + id,
      _id: id,
    };
    this.handleAddVariableToClass(newVariable);
  };

  updateFunctionInNodeObject = (updatedFuncObject) => {
    let updatedNodeObject = Object.assign({}, this.props.selectedObject);
    updatedNodeObject.classObject.functions = this.props.selectedObject.classObject.functions.map(
      (func) => (func._id == updatedFuncObject._id ? updatedFuncObject : func)
    );
    this.props.updateSelectedNode(updatedNodeObject);
  };

  render() {
    let content = null;
    if (this.props.selectedObject == null) {
      // Empty content
      content = <div className="PropertiesPanel-container u-default-shadow">No Selection</div>;
    } else if (this.props.selectedObjectType == "Node") {
      // Display Properties
      content = (
        <div className="PropertiesPanel-container u-default-shadow">
          <div className="PropertiesPanel-upperContainer">
            <EditableText
              customClass="PropertiesPanel-selectionName"
              text={this.props.selectedObject.classObject.name}
              onTextChanged={this.handleNamePropertyChanged}
              iconSize="large"
              propertyName="Class"
            />
            {/* <div className="PropertiesPanel-divider"></div> */}

            <EditableText
              customClass="PropertiesPanel-selectionParentName"
              text={this.props.selectedObject.classObject.parent}
              onTextChanged={this.handleParentPropertyChanged}
              iconSize="medium"
              propertyName="Parent"
            />
            <div style={{ height: "8px" }}></div>
          </div>
          <div className="PropertiesPanel-innerVerticalBox u-flexColumn">
            <CollapsablePanel title="Description">
              <div style={{ height: "8px" }}></div>
              <EditableTextBlock
                text={this.props.selectedObject.classObject.description}
                onTextChanged={this.handleDescriptionPropertyChanged}
              />
              <div style={{ height: "8px" }}></div>
            </CollapsablePanel>

            <CollapsablePanel title="Functions">
              <div style={{ height: "8px" }}></div>
              {this.props.selectedObject.classObject.functions.map((func) => (
                <FunctionItem
                  functionObject={func}
                  key={func._id}
                  updateFunctionInNodeObject={this.updateFunctionInNodeObject}
                />
              ))}
              <AddPropertyButton
                buttonText={"Add Function"}
                onAddClicked={this.handleAddFunctionButtonClicked}
              />
              <div style={{ height: "8px" }}></div>
            </CollapsablePanel>

            <CollapsablePanel title="Variables">
              <div style={{ height: "8px" }}></div>
              {this.props.selectedObject.classObject.variables.map((variable) => (
                <VariableItem variableObject={variable} key={variable._id} />
              ))}
              <AddPropertyButton
                buttonText={"Add Variable"}
                onAddClicked={this.handleAddVariableButtonClicked}
              />
              <div style={{ height: "8px" }}></div>
            </CollapsablePanel>
          </div>
        </div>
      );
    }
    return (
      <div
        className="PropertiesPanel-outerContainer"
        style={{ width: this.props.panelWidth + "px" }}
      >
        {content}
        <HorizontalResizer
          customClass="PropertiesPanel-resizeHandle"
          onResize={this.props.handleResize}
        />
      </div>
    );
  }
}

export default PropertiesPanel;
