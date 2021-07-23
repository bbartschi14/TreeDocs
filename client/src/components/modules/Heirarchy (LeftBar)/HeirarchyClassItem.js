import React, { Component } from "react";
import HeirarchyItem from "./HeirarchyItem";

/**
 * Class Item component for the heirarchy list.
 *
 * Proptypes
 * @param {ClassObject} classObject class represented by this item
 * @param {(ClassObject) => ()} onClassClicked callback for being clicked
 * @param {bool} isSelected used for styling
 * @param {int} indentLevel
 */
class HeirarchyClassItem extends Component {
  constructor(props) {
    super(props);
  }

  handleClassSelected = (event) => {
    this.props.onClassClicked(this.props.classObject);
  };

  render() {
    return (
      <HeirarchyItem
        name={this.props.classObject.name}
        isSelected={this.props.isSelected}
        indentLevel={this.props.indentLevel}
        onItemClicked={this.handleClassSelected}
      />
    );
  }
}

export default HeirarchyClassItem;
