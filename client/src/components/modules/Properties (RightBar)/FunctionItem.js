import React, { Component } from "react";
import "./FunctionItem.css";
import EditableText from "../Common/EditableText";
/**
 * Function Item component for the properties panel
 *
 * Proptypes
 * @param {FunctionObject} functionObject function represented by this item
 * @param {(FunctionObject) => ()} updateFunctionInNodeObject
 */
class FunctionItem extends Component {
  constructor(props) {
    super(props);
  }

  handleFunctionNameChanged = (event) => {
    let updatedObject = Object.assign({}, this.props.functionObject); // creating copy of function
    updatedObject.name = event.target.value; // update the name property, assign a new value
    this.props.updateFunctionInNodeObject(updatedObject);
  };

  render() {
    return (
      <div className="FunctionItem-container u-noselect">
        <EditableText
          text={this.props.functionObject.name}
          hideIcon={true}
          hideUnderline={true}
          customClass="FunctionItem-text"
          onTextChanged={this.handleFunctionNameChanged}
        />
      </div>
    );
  }
}

export default FunctionItem;
