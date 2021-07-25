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
 * @param {(CommentObject) => {}} updateSelectedComment
 * @param {(CommentObject) => {}} selectComment
 */
class CanvasCommentsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.containerRef = React.createRef();
  }

  render() {
    return (
      <div className="CanvasCommentsContainer-container" ref={this.containerRef}>
        {this.props.selectedGraph.comments.map((comment) => (
          <CanvasComment
            key={comment._id}
            isSelected={
              this.props.selectedObjectType == "Comment" &&
              comment._id == this.props.selectedObject?._id
            }
            commentObject={comment}
            updateSelectedComment={this.props.updateSelectedComment}
            selectComment={this.props.selectComment}
          />
        ))}
      </div>
    );
  }
}

export default CanvasCommentsContainer;
