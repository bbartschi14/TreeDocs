import React, { Component } from "react";
import HeirarchyItem from "./HeirarchyItem";
import { VARIABLE_TYPES } from "../Constants.js";

/**
 * Function Item component for the heirarchy list.
 *
 * Proptypes
 * @param {FunctionObject} functionObject function represented by this item
 * @param {bool} isSelected used for styling
 * @param {bool} isPlaced
 * @param {int} indentLevel
 */
class HeirarchyFunctionItem extends Component {
  constructor(props) {
    super(props);
  }

  handleFunctionSelected = (event) => {
    this.props.onFunctionClicked(this.props.functionObject);
  };

  handleCreateNodeFunction = (event) => {
    if (!this.props.isPlaced) {
      this.handleFunctionSelected();
      this.props.handleCreateNodeFunction(event, this.props.functionObject);
    }
  };

  render() {
    return (
      <HeirarchyItem
        name={this.props.functionObject.name}
        isSelected={this.props.isSelected}
        indentLevel={this.props.indentLevel}
        onItemClicked={this.handleFunctionSelected}
        iconName="Function"
        iconColor={VARIABLE_TYPES[this.props.functionObject.returnValue.type].color}
        iconTooltip={this.props.functionObject.returnValue.typeName}
        isClickable={true}
        isPlaced={this.props.isPlaced}
        isPlaceable={true}
        handleCreateNode={this.handleCreateNodeFunction}
      />
    );
  }
}

export default HeirarchyFunctionItem;
