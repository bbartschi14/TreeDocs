import React, { Component } from "react";
import "./ColorSelector.css";
import "./EditableText";
import SingleColorBox from "../Common/SingleColorBox.js";
/**
 * Component to select from
 *
 * Proptypes
 * @param {(string) => ()} updateColor
 * @param {string} selectedColor
 * @param {[string]} colors
 */
class ColorSelector extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <div className="ColorSelector-container ">
          {this.props.colors.map((color, i) => (
            <SingleColorBox
              key={i}
              color={color}
              isSelected={this.props.selectedColor == color}
              updateColor={this.props.updateColor}
            ></SingleColorBox>
          ))}
        </div>
        <div className="EditableText-property u-noselect">{"Color"}</div>
      </>
    );
  }
}

export default ColorSelector;
