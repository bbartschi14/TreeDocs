import React, { Component } from "react";
import HeirarchyItem from "./HeirarchyItem";
import HeirarchyFunctionItem from "./HeirarchyFunctionItem";
import HeirarchyVariableItem from "./HeirarchyVariableItem";

/**
 * Class Item component for the heirarchy list.
 *
 * Proptypes
 * @param {ClassObject} classObject class represented by this item
 * @param {(ClassObject) => ()} onClassClicked callback for being clicked
 * @param {bool} isSelected used for styling
 * @param {int} indentLevel
 */
class HeirarchyClassItem extends Component {
  constructor(props) {
    super(props);
  }

  handleClassSelected = (event) => {
    this.props.onClassClicked(this.props.classObject);
  };

  handleEmptyReply = (event) => {};

  render() {
    return (
      <HeirarchyItem
        name={this.props.classObject.name}
        isSelected={this.props.isSelected}
        indentLevel={this.props.indentLevel}
        onItemClicked={this.handleClassSelected}
        isClickable={true}
        iconName="Class"
      >
        {this.props.classObject.functions.length > 0
          ? [
              <HeirarchyItem
                key="Functions"
                name="Functions"
                indentLevel={1}
                onItemClicked={this.handleEmptyReply}
                isClickable={false}
                iconName="List"
              >
                {this.props.classObject.functions.map((funcObj) => (
                  <HeirarchyFunctionItem
                    key={`FunctionItem_${funcObj._id}`}
                    functionObject={funcObj}
                    isSelected={false}
                    indentLevel={2}
                  />
                ))}
              </HeirarchyItem>,
            ]
          : null}
        {this.props.classObject.variables.length > 0
          ? [
              <HeirarchyItem
                key="Functions"
                name="Variables"
                indentLevel={1}
                onItemClicked={this.handleEmptyReply}
                iconName="List"
                isClickable={false}
              >
                {this.props.classObject.variables.map((varObj) => (
                  <HeirarchyVariableItem
                    key={`VariableItem_${varObj._id}`}
                    variableObject={varObj}
                    isSelected={false}
                    indentLevel={2}
                  />
                ))}
              </HeirarchyItem>,
            ]
          : null}
      </HeirarchyItem>
    );
  }
}

export default HeirarchyClassItem;
