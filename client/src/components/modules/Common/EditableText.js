import React, { Component } from "react";
import EditIcon from "@material-ui/icons/Edit";
import "./EditableText.css";

/**
 * Common component for editable text input objects. Can pass in
 * styling and current text through props.
 *
 * Proptypes
 * @param {string} text current text
 * @param {string} propertyName name of the editable text
 * @param {string} customClass custom CSS styling class to be used
 * @param {string} iconSize "large" "medium" "small"
 * @param {(event) => ()} onTextChanged callback function for text changing
 */
class EditableText extends Component {
  constructor(props) {
    super(props);
  }

  handleChange = (event) => {
    this.props.onTextChanged(event);
  };

  handleFocus = (event) => {
    event.target.select();
  };

  render() {
    let iconClass = "EditableText-iconLarge";
    let iconFontSize = 28;
    if (this.props.iconSize == "medium") {
      iconClass = "EditableText-iconMedium";
      iconFontSize = 16;
    } else if (this.props.iconSize == "small") {
      iconClass = "EditableText-iconSmall";
      iconFontSize = 8;
    }

    return (
      <>
        <div className="EditableText-container">
          <input
            className={this.props.customClass}
            type="text"
            value={this.props.text}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            spellCheck={false}
          />
          <EditIcon
            className={"EditableText-editIcon " + iconClass}
            style={{ fontSize: iconFontSize + "px" }}
          />
        </div>
        <div className="EditableText-property">{this.props.propertyName}</div>
      </>
    );
  }
}

export default EditableText;
