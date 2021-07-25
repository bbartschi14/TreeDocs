import React, { Component } from "react";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import IconFromName from "../Common/IconFromName.js";
import AddPropertyButton from "../Properties (RightBar)/AddPropertyButton.js";
import "./CollapsablePanel.css";

/**
 * Common component for collapsable subpanel, like Blenders lower right menu UI.
 *
 * Proptypes
 * @param {string} title Panel title
 * @param {string} iconName
 * @param {bool} includeButton
 * @param {string} buttonText
 * @param {() => ()} buttonCallback
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
          <div className="CollapsablePanel-headingBarLeft u-flex">
            <div style={{ width: "10px" }}></div>
            <IconFromName iconName={this.props.iconName} />
            <div className="CollapsablePanel-titleText u-noselect">{this.props.title}</div>
          </div>
          {this.props.includeButton ? (
            <AddPropertyButton
              buttonText={this.props.buttonText}
              onAddClicked={this.props.buttonCallback}
            />
          ) : null}

          <div className="CollapsablePanel-leftSide"></div>
          <div className="CollapsablePanel-rightSide"></div>
        </div>
        <div
          className={
            this.state.isOpen
              ? "CollapsablePanel-iconAbsoluteRotated"
              : "CollapsablePanel-iconAbsolute"
          }
          onClick={this.handleOnClick}
        >
          <ArrowRightIcon className={"CollapsablePanel-dropDown"} color="action" />
        </div>
        {this.state.isOpen ? this.props.children : null}
      </div>
    );
  }
}

export default CollapsablePanel;
