import React, { Component } from "react";
import HeirarchyClassItem from "./HeirarchyClassItem.js";
import HeirarchyItem from "./HeirarchyItem.js";
import HorizontalResizer from "../Common/HorizontalResizer.js";
import "./HeirarchyPanel.css";
import HeirarchyGraphItem from "./HeirarchyGraphItem.js";
import AddPropertyButton from "../Properties (RightBar)/AddPropertyButton.js";

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
    this.state = { selectedIndex: 0 };
  }

  handleClassSelected = (classObject) => {
    this.props.selectClass(classObject);
  };

  handleFunctionSelected = (functionObject) => {
    this.props.selectFunction(functionObject);
  };

  handleClickHeirarchy = (event) => {
    this.setState({ selectedIndex: 0 });
  };

  handleClickGraphs = (event) => {
    this.setState({ selectedIndex: 1 });
  };

  render() {
    let classList = null;
    classList = this.props.selectedProject.classes.map((classObj) => {
      let existingNodes = this.props.selectedGraph.classNodeIds.filter((id) => id == classObj._id);
      return (
        <HeirarchyClassItem
          key={`Item_${classObj._id}`}
          classObject={classObj}
          selectedObject={this.props.selectedObject}
          selectedObjectType={this.props.selectedObjectType}
          indentLevel={0}
          onClassClicked={this.handleClassSelected}
          onFunctionClicked={this.handleFunctionSelected}
          isPlaced={existingNodes.length > 0}
          handleCreateNode={this.props.handleCreateNode}
          handleCreateNodeFunction={this.props.handleCreateNodeFunction}
          deleteClass={this.props.deleteClass}
          placedNodeIds={this.props.selectedGraph.classNodeIds}
        />
      );
    });

    let graphsList = [];
    graphsList = this.props.selectedProject.graphs.map((graph, i) => {
      return (
        <HeirarchyGraphItem
          key={`Graph_${graph._id}`}
          graphObject={graph}
          isSelected={this.props.selectedGraph._id == graph._id}
          selectGraph={this.props.selectGraph}
        />
      );
    });
    graphsList.push(<div key={"Spacer"} style={{ marginTop: "10px" }}></div>);
    graphsList.push(
      <AddPropertyButton
        key={"AddButton"}
        buttonText={"Create New Graph"}
        onAddClicked={this.props.addNewGraphToProject}
      />
    );
    return (
      <div
        className="HeirarchyPanel-outerContainer"
        style={{ width: this.props.panelWidth + "px" }}
      >
        <div className="HeirarchyPanel-headings u-noselect">
          <div
            onClick={this.handleClickHeirarchy}
            className={
              !this.state.selectedIndex == 0
                ? "HeirarchyPanel-headingUnselected"
                : "HeirarchyPanel-selected"
            }
          >
            Heirarchy
          </div>
          <div
            onClick={this.handleClickGraphs}
            className={
              !this.state.selectedIndex == 1
                ? "HeirarchyPanel-headingUnselected"
                : "HeirarchyPanel-selected"
            }
          >
            Graphs
          </div>
        </div>
        <div className="HeirarchyPanel-container u-default-shadow">
          {this.state.selectedIndex == 0 ? classList : graphsList}
        </div>
        <HorizontalResizer
          customClass="HeirarchyPanel-resizeHandle"
          onResize={this.props.handleResize}
        />
      </div>
    );
  }
}

export default HeirarchyPanel;
