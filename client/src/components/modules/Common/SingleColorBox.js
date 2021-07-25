import React, { Component } from "react";
import "./SingleColorBox.css";

/**
 * Component representing a color
 *
 * Proptypes
 * @param {(string) => ()} updateColor
 * @param {bool} isSelected
 * @param {string} color
 */
class FunctionItem extends Component {
  constructor(props) {
    super(props);
  }

  handleOnClick = (event) => {
    this.props.updateColor(this.props.color);
  };

  render() {
    return (
      <div
        onClick={this.handleOnClick}
        className={
          "SingleColorBox-container " +
          (this.props.isSelected ? "SingleColorBox-selected" : "SingleColorBox-unselected")
        }
        style={{ backgroundColor: this.props.color }}
      ></div>
    );
  }
}

export default FunctionItem;
