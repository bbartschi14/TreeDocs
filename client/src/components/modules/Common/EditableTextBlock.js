import React, { Component } from "react";
import EditIcon from "@material-ui/icons/Edit";
import "./EditableTextBlock.css";

/**
 * Common component for editable text block input objects.
 *
 * Proptypes
 * @param {string} text current text
 * @param {string} customClass custom CSS styling class to be used
 * @param {(event) => ()} onTextChanged callback function for text changing
 */
class EditableTextBlock extends Component {
  constructor(props) {
    super(props);
  }

  handleChange = (event) => {
    console.log("Text inside div", event.currentTarget.textContent);
    this.props.onTextChanged(event);
  };

  render() {
    return (
      <div
        className="EditableTextBlock-container"
        contentEditable={true}
        suppressContentEditableWarning={true}
        onBlur={this.handleChange}
      >
        {this.props.text}
      </div>
    );
  }
}

export default EditableTextBlock;
