import React, { Component } from "react";
import "./CreateCanvasItemButton.css";

/**
 * Create Item button for canvas objects
 *
 * Proptypes
 * @param {() => ()} onCreateStart onmousedowncallback
 * @param {bool} isDragging
 */
class CreateCanvasItemButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={"CreateCanvasItemButton-itemButton"} onMouseDown={this.props.onCreateStart}>
        <div
          className={
            "CreateCanvasItemButton-innerContainer " +
            (this.props.isDragging
              ? "CreateCanvasItemButton-innerContainer-selected"
              : "CreateCanvasItemButton-innerContainer-unselected")
          }
        >
          {this.props.children}
        </div>
        <div className="CreateCanvasItemButton-borderContainer">
          <div
            className={
              "CreateCanvasItemButton-rotatingBorder " +
              (this.props.isDragging
                ? "CreateCanvasItemButton-rotatingBorder-selected"
                : "CreateCanvasItemButton-rotatingBorder-unselected")
            }
          ></div>
        </div>
      </div>
    );
  }
}

export default CreateCanvasItemButton;
