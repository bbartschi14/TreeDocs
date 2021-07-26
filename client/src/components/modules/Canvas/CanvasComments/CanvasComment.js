import React, { Component } from "react";
import EditableTextBlock from "../../Common/EditableTextBlock";
import "./CanvasComment.css";
import CommentResizer from "./CommentResizer";

/**
 *  Comment component for the graph
 *
 * Proptypes
 * @param {CommentNodeObject} commentNodeObject
 * @param {CommentObject} commentObject represented by this node
 * @param {bool} isSelected
 * @param {(IntPoint) => {}} handleCommentPositionChanged callback to update position
 * @param {(IntPoint) => {}} handleCommentSizeChanged
 * @param {(CommentObject) => {}} updateSelectedComment
 * @param {(CommentObject) => {}} selectComment
 * @param {(CommentNodeObject) => {}} updateSelectedCommentNode

 */
class CanvasComment extends Component {
  constructor(props) {
    super(props);
    this.state = { isDragging: false, mousePosition: { x: 0, y: 0 } };
  }

  onMouseDownBeforeResize = () => {
    this.props.selectComment(this.props.commentObject);
  };

  handleOnMouseDown = (event) => {
    if (event.button !== 0) return;

    document.addEventListener("mousemove", this.handleOnMouseMove);
    document.addEventListener("mouseup", this.handleOnMouseUp);

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
      x: this.props.commentNodeObject.savedPosition.x + delta.x,
      y: this.props.commentNodeObject.savedPosition.y + delta.y,
    });
    this.setState({ mousePosition: newPos });
  };

  handleOnMouseUp = (event) => {
    document.removeEventListener("mousemove", this.handleOnMouseMove);
    document.removeEventListener("mouseup", this.handleOnMouseUp);

    this.setState({
      isDragging: false,
    });
  };

  resizeComment = (deltas) => {
    this.handleCommentSizeChanged({
      x: this.props.commentNodeObject.savedSize.x + deltas.x,
      y: this.props.commentNodeObject.savedSize.y + deltas.y,
    });
  };

  handleTextPropertyChanged = (event) => {
    let updatedObject = Object.assign({}, this.props.commentObject);
    updatedObject.text = event.target.value;
    this.props.updateSelectedComment(updatedObject);
  };

  handleCommentPositionChanged = (newPosition) => {
    let updatedObject = Object.assign({}, this.props.commentNodeObject);
    updatedObject.savedPosition = newPosition;
    this.props.updateSelectedCommentNode(updatedObject);
  };

  handleCommentSizeChanged = (newSize) => {
    let updatedObject = Object.assign({}, this.props.commentNodeObject);
    updatedObject.savedSize = newSize;
    this.props.updateSelectedCommentNode(updatedObject);
  };

  componentDidMount() {
    if (this.props.isBeingPlaced) {
      this.setState(
        {
          isDragging: true,
          mousePosition: this.props.placingMousePos,
        },
        () => {
          document.addEventListener("mousemove", this.handleOnMouseMove);
          document.addEventListener("mouseup", this.handleOnMouseUp);
        }
      );
    }
  }

  render() {
    let shadow = this.state.isDragging ? "u-hovering " : "u-default-shadow ";
    return (
      <div
        onMouseDown={this.handleOnMouseDown}
        className={
          "u-noselect " +
          shadow +
          (this.props.isSelected ? "CanvasComment-containerSelected" : "CanvasComment-container")
        }
        style={{
          left: this.props.commentNodeObject.savedPosition.x,
          top: this.props.commentNodeObject.savedPosition.y,
          width: this.props.commentNodeObject.savedSize.x,
          height: this.props.commentNodeObject.savedSize.y,
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
