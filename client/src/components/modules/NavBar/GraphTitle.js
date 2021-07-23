import React, { Component } from "react";
import EditableText from "../Common/EditableText.js";
import "./GraphTitle.css";

/**
 * The title of the graph displayed at the top of the page
 *
 * Proptypes
 * @param {GraphObject} currentGraph
 * @param {(GraphObject) => ()} updateSelectedGraph callback to update the selected graph
 */
class GraphTitle extends Component {
  constructor(props) {
    super(props);
  }

  handleGraphNameChanged = (event) => {
    let updatedObject = Object.assign({}, this.props.currentGraph); // creating copy of selected node prop
    updatedObject.name = event.target.value; // update the parent property, assign a new value
    this.props.updateSelectedGraph(updatedObject);
  };

  render() {
    //console.log(JSON.stringify(this.props.currentGraph));
    return (
      <div className="GraphTitle-container">
        <div className="GraphTitle-titleWrapper">
          <EditableText
            customClass="GraphTitle-title"
            iconSize="large"
            text={this.props.currentGraph.name}
            propertyName="Graph"
            onTextChanged={this.handleGraphNameChanged}
          />
        </div>

        <div className="GraphTitle-subtitle"></div>
      </div>
    );
  }
}

export default GraphTitle;
