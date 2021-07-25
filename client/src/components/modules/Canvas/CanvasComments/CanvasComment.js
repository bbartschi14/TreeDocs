import React, { Component } from "react";
import EditableTextBlock from "../../Common/EditableTextBlock";
import "./CanvasComment.css";
import CommentResizer from "./CommentResizer";

/**
 *  Comment component for the graph
 *
 * Proptypes
 * @param {CommentObject} commentObject represented by this node
 * @param {bool} isSelected
 * @param {(IntPoint) => {}} handleCommentPositionChanged callback to update position
 * @param {(IntPoint) => {}} handleCommentSizeChanged
 * @param {(CommentObject) => {}} updateSelectedComment
 * @param {(CommentObject) => {}} selectComment
 */
class CanvasComment extends Component {
  constructor(props) {
    super(props);
    this.state = { isDragging: false, mousePosition: { x: 0, y: 0 } };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.isDragging && !prevState.isDragging) {
      document.addEventListener("mousemove", this.handleOnMouseMove);
      document.addEventListener("mouseup", this.handleOnMouseUp);
    } else if (!this.state.isDragging && prevState.isDragging) {
      document.removeEventListener("mousemove", this.handleOnMouseMove);
      document.removeEventListener("mouseup", this.handleOnMouseUp);
    }
  }

  onMouseDownBeforeResize = () => {
    this.props.selectComment(this.props.commentObject);
  };

  handleOnMouseDown = (event) => {
    if (event.button !== 0) return;

    this.setState({
      isDragging: true,
      mousePosition: { x: event.pageX, y: event.pageY },
    });

    this.props.selectComment(this.props.commentObject);

    //event.stopPropagation();
    //event.preventDefault();
  };

  handleOnMouseMove = (event) => {
    let newPos = { x: event.pageX, y: event.pageY };
    let delta = {
      x: newPos.x - this.state.mousePosition.x,
      y: newPos.y - this.state.mousePosition.y,
    };
    this.handleCommentPositionChanged({
      x: this.props.commentObject.savedPosition.x + delta.x,
      y: this.props.commentObject.savedPosition.y + delta.y,
    });
    this.setState({ mousePosition: newPos });
  };

  handleOnMouseUp = (event) => {
    this.setState({
      isDragging: false,
    });
  };

  resizeComment = (deltas) => {
    this.handleCommentSizeChanged({
      x: this.props.commentObject.savedSize.x + deltas.x,
      y: this.props.commentObject.savedSize.y + deltas.y,
    });
  };

  handleTextPropertyChanged = (event) => {
    //if (!this.state.isSelected) return;

    let updatedObject = Object.assign({}, this.props.commentObject); // creating copy of selected node prop
    updatedObject.text = event.target.value; // update the parent property, assign a new value
    this.props.updateSelectedComment(updatedObject);
  };

  handleCommentPositionChanged = (newPosition) => {
    //if (!this.state.isSelected) return;

    let updatedObject = Object.assign({}, this.props.commentObject); // creating copy of selected node prop
    updatedObject.savedPosition = newPosition; // update the parent property, assign a new value
    this.props.updateSelectedComment(updatedObject);
  };

  handleCommentSizeChanged = (newSize) => {
    //if (!this.state.isSelected) return;

    let updatedObject = Object.assign({}, this.props.commentObject); // creating copy of selected node prop
    updatedObject.savedSize = newSize; // update the parent property, assign a new value
    this.props.updateSelectedComment(updatedObject);
  };

  render() {
    return (
      <div
        onMouseDown={this.handleOnMouseDown}
        className={
          this.props.isSelected
            ? "CanvasComment-containerSelected u-default-shadow"
            : "CanvasComment-container u-default-shadow"
        }
        style={{
          left: this.props.commentObject.savedPosition.x,
          top: this.props.commentObject.savedPosition.y,
          width: this.props.commentObject.savedSize.x,
          height: this.props.commentObject.savedSize.y,
          backgroundColor: this.props.commentObject.color,
        }}
      >
        <EditableTextBlock
          text={this.props.commentObject.text}
          onTextChanged={this.handleTextPropertyChanged}
        >
          {this.props.commentObject.text}
        </EditableTextBlock>
        <CommentResizer
          customClass="CanvasComment-resizer"
          onResize={this.resizeComment}
          onMouseDownBeforeResize={this.onMouseDownBeforeResize}
        />
        <div className="CanvasComment-title u-noselect">{this.props.commentObject.title}</div>
      </div>
    );
  }
}

export default CanvasComment;
