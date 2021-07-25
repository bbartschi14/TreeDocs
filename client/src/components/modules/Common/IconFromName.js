import React, { Component } from "react";
import DescriptionIcon from "@material-ui/icons/Description";
import FunctionsIcon from "@material-ui/icons/Functions";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import PersonIcon from "@material-ui/icons/Person";
import ListIcon from "@material-ui/icons/List";
/**
 *  Component to load Material UI icon from name
 *
 * Proptypes
 * @param {string} iconName
 * @param {string} iconSize
 * @param {string} iconColor
 */
class IconFromName extends Component {
  constructor(props) {
    super(props);
    this.state = { defaultColor: "#999999" };
  }

  render() {
    let icon = null;
    let name = this.props.iconName;
    let useColor = this.state.defaultColor;
    if (typeof this.props.iconColor !== "undefined") {
      useColor = this.props.iconColor;
    }
    if (name == "Description") {
      icon = <DescriptionIcon fontSize={this.props.iconSize} style={{ color: useColor }} />;
    } else if (name == "Function") {
      icon = <FunctionsIcon fontSize={this.props.iconSize} style={{ color: useColor }} />;
    } else if (name == "Variable") {
      icon = <DonutLargeIcon fontSize={this.props.iconSize} style={{ color: useColor }} />;
    } else if (name == "Class") {
      icon = <PersonIcon fontSize={this.props.iconSize} style={{ color: useColor }} />;
    } else if (name == "List") {
      icon = <ListIcon fontSize={this.props.iconSize} style={{ color: useColor }} />;
    }
    return <>{icon}</>;
  }
}

export default IconFromName;
