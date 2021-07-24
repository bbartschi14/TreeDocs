import React, { Component } from "react";
import HeirarchyClassItem from "./HeirarchyClassItem.js";
import HeirarchyItem from "./HeirarchyItem.js";
import HorizontalResizer from "../Common/HorizontalResizer.js";
import "./HeirarchyPanel.css";

/**
 * Panel component for the left-side heirarchy. Contains
 * displays for the directory of components in the current graph,
 * as well as a separate tab for display of all graphs in the project.
 *
 * Proptypes
 * @param TODO {ProjectObject} current working project
 * @param {GraphObject} selectedGraph working graph in working project
 * @param {SelectableObject} selectedObject
 * @param {string} selectedObjectType
 * @param {(ClassObject) => ()} selectClass callback to select class
 */
class HeirarchyPanel extends Component {
  constructor(props) {
    super(props);
  }

  handleClassSelected = (classObject) => {
    this.props.selectClass(classObject);
  };

  render() {
    let classList = null;
    classList = this.props.selectedGraph.nodes.map((nodeObj) => (
      <HeirarchyClassItem
        key={`Item_${nodeObj.classObject._id}`}
        classObject={nodeObj.classObject}
        isSelected={
          this.props.selectedObjectType == "Node" &&
          nodeObj.classObject._id == this.props.selectedObject?.classObject._id
        }
        indentLevel={0}
        onClassClicked={this.handleClassSelected}
      />
    ));
    return (
      <div
        className="HeirarchyPanel-outerContainer"
        style={{ width: this.props.panelWidth + "px" }}
      >
        <div className="HeirarchyPanel-container u-default-shadow">{classList}</div>
        <HorizontalResizer
          customClass="HeirarchyPanel-resizeHandle"
          onResize={this.props.handleResize}
        />
      </div>
    );
  }
}

export default HeirarchyPanel;
