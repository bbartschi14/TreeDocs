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
import PropertiesConnectionPanel from "./PropertiesConnectionPanel.js";
import PropertiesCommentPanel from "./PropertiesCommentPanel.js";

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
    console.log(event.target.value);
    let updatedObject = Object.assign({}, this.props.selectedObject); // creating copy of selected node prop
    updatedObject.classObject.description = event.target.value; // update the parent property, assign a new value

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
      returnValue: { name: "DefaultParam", type: 1, typeName: "Int" },
      parameters: [],
    };
    this.handleAddFunctionToClass(newFunction);
  };

  handleAddVariableButtonClicked = () => {
    let id = nextId();
    let newVariable = {
      parent: this.props.selectedObject.classObject,
      _id: id,
      parameterObject: { name: "NewVariable_" + id, type: 1, typeName: "Int" },
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

  updateVariableInNodeObject = (updatedVariableObject) => {
    let updatedNodeObject = Object.assign({}, this.props.selectedObject);
    updatedNodeObject.classObject.variables = this.props.selectedObject.classObject.variables.map(
      (variable) => (variable._id == updatedVariableObject._id ? updatedVariableObject : variable)
    );
    this.props.updateSelectedNode(updatedNodeObject);
  };

  render() {
    let content = null;
    if (this.props.selectedObject == null) {
      // Empty content
      content = (
        <div className="PropertiesPanel-container ">
          <div className="PropertiesPanel-upperContainer">
            <div className="PropertiesPanel-noSelection">No Selection</div>
          </div>
        </div>
      );
    } else if (this.props.selectedObjectType == "Node") {
      // Display Properties
      content = (
        <div className="PropertiesPanel-container">
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
            <CollapsablePanel title="Description" iconName="Description" iconSize="small">
              <div style={{ height: "8px" }}></div>
              <EditableTextBlock
                text={this.props.selectedObject.classObject.description}
                onTextChanged={this.handleDescriptionPropertyChanged}
              >
                <ul>
                  <li>{this.props.selectedObject.classObject.description}</li>
                </ul>
              </EditableTextBlock>
              <div style={{ height: "8px" }}></div>
            </CollapsablePanel>

            <CollapsablePanel
              title="Functions"
              iconName="List"
              iconSize="small"
              includeButton={true}
              buttonText="Add Function"
              buttonCallback={this.handleAddFunctionButtonClicked}
            >
              <div style={{ height: "8px" }}></div>
              {this.props.selectedObject.classObject.functions.map((func) => (
                <FunctionItem
                  functionObject={func}
                  key={func._id}
                  updateFunctionInNodeObject={this.updateFunctionInNodeObject}
                />
              ))}

              <div style={{ height: "8px" }}></div>
            </CollapsablePanel>

            <CollapsablePanel
              title="Variables"
              iconName="List"
              iconSize="small"
              includeButton={true}
              buttonText="Add Variable"
              buttonCallback={this.handleAddVariableButtonClicked}
            >
              <div style={{ height: "8px" }}></div>
              {this.props.selectedObject.classObject.variables.map((variable) => (
                <VariableItem
                  variableObject={variable}
                  key={variable._id}
                  updateVariableInNodeObject={this.updateVariableInNodeObject}
                />
              ))}

              <div style={{ height: "8px" }}></div>
            </CollapsablePanel>
          </div>
        </div>
      );
    } else if (this.props.selectedObjectType == "Connection") {
      content = (
        <div className="PropertiesPanel-container">
          <div className="PropertiesPanel-upperContainer">
            <PropertiesConnectionPanel connectionObject={this.props.selectedObject} />
          </div>
        </div>
      );
    } else if (this.props.selectedObjectType == "Comment") {
      content = (
        <div className="PropertiesPanel-container">
          <PropertiesCommentPanel
            commentObject={this.props.selectedObject}
            updateSelectedComment={this.props.updateSelectedComment}
          />
        </div>
      );
    }

    return (
      <div
        className="PropertiesPanel-outerContainer u-default-shadow"
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
