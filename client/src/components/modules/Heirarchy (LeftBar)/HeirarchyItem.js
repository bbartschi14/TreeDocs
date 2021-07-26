import React, { Component } from "react";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import "./HeirarchyItem.css";
import IconFromName from "../Common/IconFromName";

/**
 * Base Item component for the heirarchy list. Will be wrapped by other components
 * to define each possible item, e.g. HeirarchyClassItem
 *
 * Proptypes
 * @param {string} name name text for this item
 * @param {() => ()} onItemClicked callback for being clicked
 * @param {bool} isSelected used for styling
 * @param {bool} isPlaced
 * @param {bool} isPlaceable
 * @param {int} indentLevel
 * @param {string} iconName
 * @param {string} iconColor
 * @param {string} iconTooltip
 */
class HeirarchyItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  handleOnClick = (event) => {
    this.props.onItemClicked(event);
  };

  toggleOpen = (event) => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  handlePlaceExisting = (event) => {
    this.props.handleCreateNode(event);
  };

  render() {
    let indentSpacer = [...Array(this.props.indentLevel)].map((e, i) => (
      <div className="HeirarchyItem-spacer" key={i}></div>
    ));
    return (
      <div className={"HeirarchyItem-container"}>
        <div
          className={
            "u-flex " +
            (this.props.isSelected
              ? "HeirarchyItem-boundarySelected "
              : "HeirarchyItem-boundaryUnselected ") +
            (this.props.isClickable ? " u-pointer" : " HeirarchyItem-nonSelectable")
          }
          onClick={this.handleOnClick}
        >
          {this.props.isPlaceable ? (
            <div
              onMouseDown={this.handlePlaceExisting}
              className="HeirarchyItem-placedIcon"
              style={this.props.isPlaced ? { opacity: ".15" } : { opacity: ".75" }}
            ></div>
          ) : null}
          {indentSpacer}
          <div className="HeirarchyItem-arrowContainer">
            {this.props.children != null &&
            (this.props.children[0] != null || this.props.children[1] != null) ? (
              <div
                className={
                  this.state.isOpen
                    ? "HeirarchyItem-arrowRotaterOn"
                    : "HeirarchyItem-arrowRotaterOff"
                }
              >
                <ArrowRightIcon
                  className="HeirarchyItem-arrow"
                  onClick={this.toggleOpen}
                  // style={this.state.isOpen ? { transform: "rotate(90deg)" } : {}}
                />
              </div>
            ) : null}
          </div>
          <IconFromName
            iconName={this.props.iconName}
            iconSize="small"
            iconColor={this.props.iconColor}
            tooltipText={this.props.iconTooltip}
          />
          <span className="HeirarchyItem-text u-noselect">{this.props.name}</span>
        </div>
        <div className="HeirarchyItem-children">
          <div
            className={
              "HeirarchyItem-childrenLine " +
              (this.props.isSelected ? "HeirarchyItem-childrenLineSelected" : "")
            }
            style={{ left: 12 + this.props.indentLevel * 22 + "px" }}
          ></div>
          {this.state.isOpen ? this.props.children : null}
        </div>
      </div>
    );
  }
}

export default HeirarchyItem;
