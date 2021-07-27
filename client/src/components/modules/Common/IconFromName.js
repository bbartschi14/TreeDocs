import React, { Component } from "react";
import DescriptionIcon from "@material-ui/icons/Description";
import FunctionsIcon from "@material-ui/icons/Functions";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import PersonIcon from "@material-ui/icons/Person";
import ListIcon from "@material-ui/icons/List";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import "./IconFromName.css";
/**
 *  Component to load Material UI icon from name
 *
 * Proptypes
 * @param {string} iconName
 * @param {string} iconSize
 * @param {string} iconColor
 * @param {string} tooltipText
 */
class IconFromName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultColor: "#999999",
      displayTooltip: false,
      tooltipPos: { x: 0, y: 0 },
      tooltipWidth: 0,
      tooltipPercentOffset: 0,
    };
    this.tooltipRef = React.createRef();
  }

  showTooltip = (event) => {
    if (typeof this.props.tooltipText != "undefined") {
      this.setState(
        {
          displayTooltip: true,
          tooltipPos: { x: event.pageX, y: event.pageY },
          tooltipPercentOffset: event.pageX / window.innerWidth,
        },
        () => {
          //console.log(this.tooltipRef.current.getBoundingClientRect());
          this.setState({
            tooltipWidth: this.tooltipRef.current.getBoundingClientRect().width,
          });
        }
      );
    }
  };

  hideTooltip = (event) => {
    this.setState({ displayTooltip: false });
  };

  moveTooltip = (event) => {
    if (this.state.displayTooltip) {
      this.setState({
        tooltipPos: {
          x: event.pageX,
          y: event.pageY,
        },
        tooltipPercentOffset: event.pageX / window.innerWidth,
      });
    }
  };

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
    } else if (name == "Graph") {
      icon = <AccountTreeIcon fontSize={this.props.iconSize} style={{ color: useColor }} />;
    }
    return (
      <div
        className="IconFromName-container"
        onMouseEnter={this.showTooltip}
        onMouseLeave={this.hideTooltip}
        onMouseMove={this.moveTooltip}
      >
        <div>{icon}</div>
        {this.state.displayTooltip ? (
          <div
            ref={this.tooltipRef}
            className="IconFromName-tooltipContainer u-default-shadow"
            style={{
              left:
                this.state.tooltipPos.x - this.state.tooltipWidth * this.state.tooltipPercentOffset,
              top: this.state.tooltipPos.y - 30,
            }}
          >
            {this.props.tooltipText}
          </div>
        ) : null}
      </div>
    );
  }
}

export default IconFromName;
