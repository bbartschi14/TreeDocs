import React, { Component } from "react";
import CanvasComment from "./CanvasComment";
import "./CanvasCommentsContainer.css";

/**
 *  container component for all the comments
 *
 * Proptypes
 * @param {GraphObject} selectedGraph
 * @param {CommentNodeObject[]} commentNodes
 * @param {SelectableObject} selectedObject
 * @param {string} selectedObjectType
 * @param {(CommentObject) => {}} updateSelectedComment
 * @param {(CommentObject) => {}} selectComment
 * @param {(CommentNodeObject) => {}} updateSelectedCommentNode
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
        {this.props.commentNodes.map((comment, i) => {
          let associatedCommentsList = this.props.selectedGraph.comments.filter(
            (c) => c._id == comment._id
          );
          return associatedCommentsList.length > 0 ? (
            <CanvasComment
              key={comment._id}
              isSelected={
                this.props.selectedObjectType == "Comment" &&
                comment._id == this.props.selectedObject?._id
              }
              commentObject={
                this.props.selectedGraph.comments.filter((c) => c._id == comment._id)[0]
              }
              commentNodeObject={comment}
              updateSelectedComment={this.props.updateSelectedComment}
              selectComment={this.props.selectComment}
              updateSelectedCommentNode={this.props.updateSelectedCommentNode}
              isBeingPlaced={
                i == this.props.commentNodes.length - 1 && this.props.isPlacingCommentNode
              }
              placingMousePos={
                i == this.props.commentNodes.length - 1 && this.props.isPlacingCommentNode
                  ? this.props.mousePos
                  : { x: 0, y: 0 }
              }
            />
          ) : null;
        })}
      </div>
    );
  }
}

export default CanvasCommentsContainer;
