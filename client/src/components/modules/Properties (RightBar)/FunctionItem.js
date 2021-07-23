import React, { Component } from "react";
import "./FunctionItem.css";

/**
 * Function Item component for the properties panel
 *
 * Proptypes
 * @param {FunctionObject} functionObject function represented by this item
 */
class FunctionItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="FunctionItem-container u-noselect">{this.props.functionObject.name}</div>
    );
  }
}

export default FunctionItem;
