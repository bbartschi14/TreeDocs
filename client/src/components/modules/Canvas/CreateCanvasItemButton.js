import React, { Component } from "react";
import "./CreateCanvasItemButton.css";

/**
 * Create Item button for canvas objects
 *
 * Proptypes
 * @param {() => ()} onCreateStart onmousedowncallback
 * @param {bool} isDragging
 * @param {String} tooltipText
 * @param {string} hotkeyText
 * @param {bool} isClickButton
 * @param {() => ()} handleClick
 * @param {bool} useSecondaryColor
 */
class CreateCanvasItemButton extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let hotkey = null;
    if (typeof this.props.hotkeyText != "undefined") {
      hotkey = this.props.hotkeyText;
    }
    return (
      <div
        className={"CreateCanvasItemButton-itemButton"}
        onMouseDown={this.props.isClickButton ? this.props.handleClick : this.props.onCreateStart}
      >
        <div
          className="CreateCanvasItemButton-toolip"
          style={
            this.props.tooltipRight
              ? {
                  left: "105%",
                  backgroundColor: this.props.useSecondaryColor ? "#92140c" : "#99a880",
                }
              : {
                  right: "105%",
                  backgroundColor: this.props.useSecondaryColor ? "#92140c" : "#99a880",
                }
          }
        >
          {this.props.tooltipText}
          {hotkey != null ? (
            <span className="CreateCanvasItemButton-toolipHotkey">{" [" + hotkey + "]"}</span>
          ) : null}
        </div>
        <div
          style={this.props.useSecondaryColor ? { backgroundColor: "#92140c" } : {}}
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
            style={this.props.useSecondaryColor ? { borderColor: "#92140c" } : {}}
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
