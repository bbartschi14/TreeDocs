import React, { Component } from "react";
import "./PropertiesCommentPanel.css";
import "./PropertiesPanel.css";
import CollapsablePanel from "../Common/CollapsablePanel";
import EditableTextBlock from "../Common/EditableTextBlock";
import EditableText from "../Common/EditableText";
import ColorSelector from "../Common/ColorSelector";

const COLOR_PALETTE = [
  "#fffd8699",
  "#e6394699",
  "#90e0ef99",
  "#ffc6ff99",
  "#d4a37399",
  "#ff977099",
  "#c1fba499",
  "#eae4e999",
];

/**
 * PropertiesCommentPanel
 *
 * Proptypes
 * @param {CommentObject} commentObject
 * @param {(CommentObject) => ()} updateSelectedComment
 */
class PropertiesCommentPanel extends Component {
  constructor(props) {
    super(props);
  }

  handleTitlePropertyChanged = (event) => {
    let updatedObject = Object.assign({}, this.props.commentObject); // creating copy of selected node prop
    updatedObject.title = event.target.value; // update the parent property, assign a new value
    this.props.updateSelectedComment(updatedObject);
  };

  handleTextPropertyChanged = (event) => {
    let updatedObject = Object.assign({}, this.props.commentObject); // creating copy of selected node prop
    updatedObject.text = event.target.value; // update the parent property, assign a new value
    this.props.updateSelectedComment(updatedObject);
  };

  handleColorPropertyChanged = (color) => {
    let updatedObject = Object.assign({}, this.props.commentObject); // creating copy of selected node prop
    updatedObject.color = color; // update the parent property, assign a new value
    this.props.updateSelectedComment(updatedObject);
  };

  render() {
    return (
      <>
        <div className="PropertiesCommentPanel-container">
          <div className="PropertiesPanel-upperContainer">
            <EditableText
              customClass="PropertiesPanel-selectionName"
              text={this.props.commentObject.title}
              onTextChanged={this.handleTitlePropertyChanged}
              iconSize="large"
              propertyName="Title"
            />
            <div style={{ height: "8px" }}></div>
          </div>

          <div className="PropertiesPanel-innerVerticalBox u-flexColumn">
            <CollapsablePanel title="Comment Text">
              <div style={{ height: "8px" }}></div>
              <EditableTextBlock
                text={this.props.commentObject.text}
                onTextChanged={this.handleTextPropertyChanged}
              >
                <ul>
                  <li>{this.props.commentObject.text}</li>
                </ul>
              </EditableTextBlock>
              <div style={{ height: "8px" }}></div>
            </CollapsablePanel>

            <CollapsablePanel title="Style">
              <div style={{ height: "8px" }}></div>
              <ColorSelector
                colors={COLOR_PALETTE}
                selectedColor={this.props.commentObject.color}
                updateColor={this.handleColorPropertyChanged}
              />
              <div style={{ height: "8px" }}></div>
            </CollapsablePanel>
          </div>
        </div>
      </>
    );
  }
}

export default PropertiesCommentPanel;
