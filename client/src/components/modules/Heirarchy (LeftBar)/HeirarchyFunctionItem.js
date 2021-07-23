import React, { Component } from "react";
import HeirarchyItem from "./HeirarchyItem";

/**
 * Function Item component for the heirarchy list.
 *
 * Proptypes
 * @param {FunctionObject} functionObject function represented by this item
 * @param {bool} isSelected used for styling
 * @param {int} indentLevel
 */
class HeirarchyFunctionItem extends Component {
  constructor(props) {
    super(props);
  }

  handleFunctionSelected = (event) => {};

  render() {
    return (
      <HeirarchyItem
        name={this.props.functionObject.name}
        isSelected={this.props.isSelected}
        indentLevel={this.props.indentLevel}
        onItemClicked={this.handleFunctionSelected}
      />
    );
  }
}

export default HeirarchyFunctionItem;
