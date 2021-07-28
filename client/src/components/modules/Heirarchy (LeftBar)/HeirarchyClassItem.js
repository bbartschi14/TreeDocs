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
 * @param {(ClassObject) => ()} deleteClass
 * @param {bool} isSelected used for styling
 * @param {bool} isPlaced
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

  handleCreateNode = (event) => {
    if (!this.props.isPlaced) {
      this.handleClassSelected();
      this.props.handleCreateNode(event, this.props.classObject);
    }
  };

  handleDeleteClass = (event) => {
    this.props.deleteClass(this.props.classObject);
  };

  render() {
    return (
      <HeirarchyItem
        name={this.props.classObject.name}
        isSelected={
          this.props.selectedObjectType == "Class" &&
          this.props.classObject._id == this.props.selectedObject?._id
        }
        indentLevel={this.props.indentLevel}
        onItemClicked={this.handleClassSelected}
        isClickable={true}
        iconName="Class"
        isPlaced={this.props.isPlaced}
        isPlaceable={true}
        handleCreateNode={this.handleCreateNode}
        isDeletable={true}
        handleDelete={this.handleDeleteClass}
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
                {this.props.classObject.functions.map((funcObj) => {
                  let existingNodes = this.props.placedNodeIds.filter((id) => id == funcObj._id);
                  return (
                    <HeirarchyFunctionItem
                      key={`FunctionItem_${funcObj._id}`}
                      isSelected={
                        this.props.selectedObjectType == "Function" &&
                        funcObj._id == this.props.selectedObject._id
                      }
                      isPlaced={existingNodes.length > 0}
                      functionObject={funcObj}
                      indentLevel={2}
                      handleCreateNodeFunction={this.props.handleCreateNodeFunction}
                      onFunctionClicked={this.props.onFunctionClicked}
                    />
                  );
                })}
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
