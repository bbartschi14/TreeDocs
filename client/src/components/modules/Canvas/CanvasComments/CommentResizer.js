import React, { Component } from "react";

/**
 * Resizer component.
 * Should receive a function callback for onResize
 *
 * Proptypes
 * @param {(Vector2D) => ()} onResize passes the delta of pixels to resize
 * @param {() => ()} onMouseDownBeforeResize
 * @param {style} customClass
 */
class CommentResizer extends Component {
  constructor(props) {
    super(props);
    this.state = { mousePos: { x: 0, y: 0 }, isDragging: false };
  }

  startResizing = (event) => {
    this.props.onMouseDownBeforeResize();
    document.addEventListener("mousemove", this.handleOnMouseMove);
    document.addEventListener("mouseup", this.handleOnMouseUp);

    this.setState({ mousePos: { x: event.pageX, y: event.pageY }, isDragging: true });

    event.stopPropagation();
    //event.preventDefault();
  };

  handleOnMouseMove = (event) => {
    this.props.onResize({
      x: event.pageX - this.state.mousePos.x,
      y: event.pageY - this.state.mousePos.y,
    });
    this.setState({ mousePos: { x: event.pageX, y: event.pageY } });
  };

  handleOnMouseUp = (event) => {
    this.setState({ isDragging: false });
    document.removeEventListener("mousemove", this.handleOnMouseMove);
    document.removeEventListener("mouseup", this.handleOnMouseUp);
  };

  render() {
    return <div className={this.props.customClass} onMouseDown={this.startResizing}></div>;
  }
}

export default CommentResizer;
