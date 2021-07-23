import React, { Component } from "react";
import "./AddPropertyButton.css";

/**
 * Add property item button. Used for functions and variables
 *
 * Proptypes
 * @param {string} buttonText
 * @param {()=>())} onAddClicked function to call on click
 */
class AddPropertyButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="AddPropertyButton-container u-noselect" onClick={this.props.onAddClicked}>
        {this.props.buttonText}
      </div>
    );
  }
}

export default AddPropertyButton;
