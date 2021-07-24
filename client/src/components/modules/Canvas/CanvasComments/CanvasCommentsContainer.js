import React, { Component } from "react";
import CanvasComment from "./CanvasComment";
import "./CanvasCommentsContainer.css";

/**
 *  container component for all the comments
 *
 * Proptypes
 * @param {GraphObject} selectedGraph
 * @param {SelectableObject} selectedObject
 * @param {string} selectedObjectType
 * @param {(IntPoint) => ()} createCommentObject
 * @param {(IntPoint) => {}} handleCommentPositionChanged callback to update position
 * @param {(CommentObject) => {}} selectComment
 */
class CanvasCommentsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.containerRef = React.createRef();
  }

  handleControlClick = (event) => {
    if (event.ctrlKey) {
      let bounds = this.containerRef.current.getBoundingClientRect();
      let currentPosition = { x: event.pageX - bounds.left, y: event.pageY - bounds.top };
      this.props.createCommentObject(currentPosition);
    }
  };

  render() {
    return (
      <div
        onClick={this.handleControlClick}
        className="CanvasCommentsContainer-container"
        ref={this.containerRef}
      >
        {this.props.selectedGraph.comments.map((comment) => (
          <CanvasComment
            key={comment._id}
            isSelected={
              this.props.selectedObjectType == "Comment" &&
              comment._id == this.props.selectedObject?._id
            }
            commentObject={comment}
            handleCommentPositionChanged={this.props.handleCommentPositionChanged}
            handleCommentSizeChanged={this.props.handleCommentSizeChanged}
            selectComment={this.props.selectComment}
          />
        ))}
      </div>
    );
  }
}

export default CanvasCommentsContainer;
