import React, { Component } from "react";
import "./FunctionItemParameter.css";
import EditableText from "../Common/EditableText";
import VariableTypeSelector from "../Common/VariableTypeSelector";

/**
 * Component to select variable type
 *
 * Proptypes
 * @property {int} parameterIndex
 * @property {ParameterObject} selectedParam
 * @property {(ParameterObject, int) => ()} updateSelectedParam
 */
class FunctionItemParameter extends Component {
  constructor(props) {
    super(props);
  }

  handleParamNameChanged = (event) => {
    let updatedObject = Object.assign({}, this.props.selectedParam);
    updatedObject.name = event.target.value;
    this.props.updateSelectedParam(updatedObject, this.props.parameterIndex);
  };

  handleParamTypeChanged = (newParamObj) => {
    this.props.updateSelectedParam(newParamObj, this.props.parameterIndex);
  };

  render() {
    return (
      <>
        <div className="FunctionItemParameter-container ">
          <EditableText
            iconSize="medium"
            propertyName="Parameter Name"
            text={this.props.selectedParam.name}
            onTextChanged={this.handleParamNameChanged}
          />
          <div style={{ height: "8px" }}></div>
          <VariableTypeSelector
            selectedParam={this.props.selectedParam}
            updateSelectedParam={this.handleParamTypeChanged}
          />
        </div>
      </>
    );
  }
}

export default FunctionItemParameter;
