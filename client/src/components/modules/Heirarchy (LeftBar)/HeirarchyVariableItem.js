import React, { Component } from "react";
import HeirarchyItem from "./HeirarchyItem";
import { VARIABLE_TYPES } from "../Constants.js";

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
        name={this.props.variableObject.parameterObject.name}
        isSelected={this.props.isSelected}
        indentLevel={this.props.indentLevel}
        onItemClicked={this.handleFunctionSelected}
        iconName="Variable"
        iconColor={VARIABLE_TYPES[this.props.variableObject.parameterObject.type].color}
        iconTooltip={this.props.variableObject.parameterObject.typeName}
        isClickable={false}
      />
    );
  }
}

export default HeirarchyVariableItem;
