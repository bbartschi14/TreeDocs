import React, { Component } from "react";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import "./CollapsablePanel.css";

/**
 * Common component for collapsable subpanel, like Blenders lower right menu UI.
 *
 * Proptypes
 * @param {string} title Panel title
 */
class CollapsablePanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
    };
  }

  handleOnClick = (event) => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    return (
      <div className="CollapsablePanel-container">
        <div className="CollapsablePanel-headingBar" onClick={this.handleOnClick}>
          <div className="CollapsablePanel-titleText u-noselect">{this.props.title}</div>

          <div className="CollapsablePanel-leftSide"></div>
          <div className="CollapsablePanel-rightSide"></div>
        </div>
        <div className="CollapsablePanel-iconAbsolute" onClick={this.handleOnClick}>
          {this.state.isOpen ? (
            <ArrowDropDownIcon className="CollapsablePanel-dropDown" />
          ) : (
            <ArrowRightIcon className="CollapsablePanel-dropDown" />
          )}
        </div>
        {this.state.isOpen ? this.props.children : null}
      </div>
    );
  }
}

export default CollapsablePanel;
