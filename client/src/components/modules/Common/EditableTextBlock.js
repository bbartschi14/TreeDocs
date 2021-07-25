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
    this.state = { isEditing: false, areaHeight: 40 };
    this.textAreaRef = React.createRef();
  }

  componentDidUpdate(prevState) {
    if (this.state.isEditing && !prevState.isEditing) {
      this.textAreaRef.current.focus();
      //this.textAreaRef.current.select();
    }
  }

  handleChange = (event) => {
    this.props.onTextChanged(event);
    this.setState({ areaHeight: this.textAreaRef.current.scrollHeight });
  };

  handleOnClick = (event) => {
    this.setState({ isEditing: true });
  };

  handleDoneEditing = (event) => {
    this.setState({ isEditing: false });
  };

  handleEditTextMouseDown = (event) => {
    event.stopPropagation();
  };

  handleFocus = (event) => {
    this.setState({ areaHeight: this.textAreaRef.current.scrollHeight });
    this.textAreaRef.current.select();
  };

  render() {
    return (
      <div className="EditableTextBlock-container">
        {this.state.isEditing ? (
          <textarea
            style={{ height: this.state.areaHeight }}
            ref={this.textAreaRef}
            type="text"
            value={this.props.text}
            onChange={this.handleChange}
            onFocus={this.handleFocus}
            spellCheck={false}
            onBlur={this.handleDoneEditing}
            onMouseDown={this.handleEditTextMouseDown}
          />
        ) : (
          <div className="EditableTextBlock-plainText u-noselect" onClick={this.handleOnClick}>
            {this.props.children}
          </div>
        )}
      </div>
    );
  }
}

export default EditableTextBlock;
