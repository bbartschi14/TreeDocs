import React, { Component } from "react";
import "./VariableItem.css";

/**
 * Variable Item component for the properties panel
 *
 * Proptypes
 * @param {VariableObject} variableObject variable represented by this item
 */
class VariableItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="VariableItem-container u-noselect">{this.props.variableObject.name}</div>
    );
  }
}

export default VariableItem;
