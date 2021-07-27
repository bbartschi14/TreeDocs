import React, { Component } from "react";
import HeirarchyItem from "./HeirarchyItem";
import "./HeirarchyGraphItem.css";

/**
 * Graph component for the heirarchy list.
 *
 * Proptypes
 * @param {GraphObject} graphObject var represented by this item
 * @param {bool} isSelected used for styling
 * @param {int} indentLevel
 */
class HeirarchyGraphItem extends Component {
  constructor(props) {
    super(props);
  }

  handleSelectGraph = () => {
    this.props.selectGraph(this.props.graphObject);
  };
  render() {
    return (
      <HeirarchyItem
        name={this.props.graphObject.name}
        isSelected={this.props.isSelected}
        indentLevel={0}
        onItemClicked={this.handleSelectGraph}
        iconName="Graph"
        // iconColor={VARIABLE_TYPES[this.props.variableObject.parameterObject.type].color}
        // iconTooltip={this.props.variableObject.parameterObject.typeName}
        isClickable={true}
      />
    );
  }
}

export default HeirarchyGraphItem;
