import React, { Component } from "react";
import "./CanvasPathConnection.css";
/**
 * Node path connection component rendering an svg
 *
 * Proptypes
 * @param {string} pathDescription svg path data
 * @param {bool} isSelected for styling
 * @param {ConnectionObject} connectionObject object that this represents
 * @param {(ConnectionObject) => ()} onConnectionSelected
 */
class CanvasPathConnection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHovered: false,
    };
  }

  handleSelection = (event) => {
    this.props.onConnectionSelected(this.props.connectionObject);
  };

  handleMouseEnter = (event) => {
    this.setState({ isHovered: true });
  };

  handleMouseLeave = (event) => {
    this.setState({ isHovered: false });
  };

  render() {
    return (
      <>
        <path
          className={
            "CanvasPathConnection-path " +
            (this.props.isSelected
              ? "CanvasPathConnection-selected "
              : "CanvasPathConnection-unselected ") +
            (this.state.isHovered ? "CanvasPathConnection-hovered" : "")
          }
          d={this.props.pathDescription}
        ></path>
        <path
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          onClick={this.handleSelection}
          className={"CanvasPathConnection-hoverArea"}
          d={this.props.pathDescription}
        ></path>
      </>
    );
  }
}

export default CanvasPathConnection;
