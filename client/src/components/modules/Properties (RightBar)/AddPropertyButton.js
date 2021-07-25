import React, { Component } from "react";
import "./AddPropertyButton.css";

/**
 * Add property item button. Used for functions and variables
 *
 * Proptypes
 * @param {string} buttonText
 * @param {()=>())} onAddClicked function to call on click
 * @param {bool} useSecondaryColors
 */
class AddPropertyButton extends Component {
  constructor(props) {
    super(props);
  }

  handleClick = (event) => {
    this.props.onAddClicked();
    event.stopPropagation();
  };

  render() {
    return (
      <div className={"AddPropertyButton-container u-noselect"} onClick={this.handleClick}>
        <div
          className={
            "AddPropertyButton-innerContainer " +
            (this.props.useSecondaryColors ? "AddPropertyButton-secondary " : "")
          }
        >
          {this.props.buttonText}
        </div>
      </div>
    );
  }
}

export default AddPropertyButton;
