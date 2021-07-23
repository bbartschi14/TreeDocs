import React, { Component } from "react";
import HeirarchyItem from "./HeirarchyItem";

/**
 * Variable Item component for the heirarchy list.
 *
 * Proptypes
 * @param {VariableObject} variableObject var represented by this item
 * @param {bool} isSelected used for styling
 * @param {int} indentLevel
 */
class HeirarchyVariableItem extends Component {
  constructor(props) {
    super(props);
  }

  handleFunctionSelected = (event) => {};

  render() {
    return (
      <HeirarchyItem
        name={this.props.variableObject.name}
        isSelected={this.props.isSelected}
        indentLevel={this.props.indentLevel}
        onItemClicked={this.handleFunctionSelected}
      />
    );
  }
}

export default HeirarchyVariableItem;
