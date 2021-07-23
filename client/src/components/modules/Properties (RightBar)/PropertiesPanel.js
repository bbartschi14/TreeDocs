import React, { Component } from "react";
import EditableText from "../Common/EditableText.js";
import EditableTextBlock from "../Common/EditableTextBlock.js";
import CollapsablePanel from "../Common/CollapsablePanel.js";
import "./PropertiesPanel.css";

/**
 * Panel component for the right-side properties. Will display
 * object name and sub-information, as well as the editing of descriptions.
 *
 * Will display differently for each type of object (Class, Function, Variable).
 *  - Class: should allow creation of function and variables
 *  - Function: should allow definition of return type and arguments
 *
 * Proptypes
 * @param TODO {ProjectObject} current working project
 * @param TODO {GraphObject} current working graph in working project
 * @param {NodeObject} selectedNode current selectedNode
 * @param {(NodeObject) => ()} updateSelectedNode callback function passing in the new updated selected node
 */
class PropertiesPanel extends Component {
  constructor(props) {
    super(props);
  }

  handleNamePropertyChanged = (event) => {
    let updatedObject = Object.assign({}, this.props.selectedNode); // creating copy of selected node prop
    updatedObject.classObject.name = event.target.value; // update the name property, assign a new value
    this.props.updateSelectedNode(updatedObject);
  };

  handleParentPropertyChanged = (event) => {
    let updatedObject = Object.assign({}, this.props.selectedNode); // creating copy of selected node prop
    updatedObject.classObject.parent = event.target.value; // update the parent property, assign a new value
    this.props.updateSelectedNode(updatedObject);
  };

  handleDescriptionPropertyChanged = (event) => {
    let updatedObject = Object.assign({}, this.props.selectedNode); // creating copy of selected node prop
    updatedObject.classObject.description = event.currentTarget.textContent; // update the parent property, assign a new value
    this.props.updateSelectedNode(updatedObject);
  };

  render() {
    let content = null;
    if (this.props.selectedNode == null) {
      // Empty content
      content = <div className="PropertiesPanel-container u-default-shadow">No Selection</div>;
    } else {
      // Display Properties
      content = (
        <div className="PropertiesPanel-container u-default-shadow">
          <div className="PropertiesPanel-upperContainer">
            <EditableText
              customClass="PropertiesPanel-selectionName"
              text={this.props.selectedNode.classObject.name}
              onTextChanged={this.handleNamePropertyChanged}
              iconSize="large"
              propertyName="Class"
            />
            {/* <div className="PropertiesPanel-divider"></div> */}

            <EditableText
              customClass="PropertiesPanel-selectionParentName"
              text={this.props.selectedNode.classObject.parent}
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
                text={this.props.selectedNode.classObject.description}
                onTextChanged={this.handleDescriptionPropertyChanged}
              />
              <div style={{ height: "8px" }}></div>
            </CollapsablePanel>

            <CollapsablePanel title="Functions">
              <div style={{ height: "8px" }}></div>

              <div style={{ height: "8px" }}></div>
            </CollapsablePanel>

            <CollapsablePanel title="Variables">
              <div style={{ height: "8px" }}></div>

              <div style={{ height: "8px" }}></div>
            </CollapsablePanel>
          </div>
        </div>
      );
    }
    return <>{content}</>;
  }
}

export default PropertiesPanel;
