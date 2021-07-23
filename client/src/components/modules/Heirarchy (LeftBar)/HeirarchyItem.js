import React, { Component } from "react";
import ArrowRightIcon from "@material-ui/icons/ArrowRight";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import "./HeirarchyItem.css";

/**
 * Base Item component for the heirarchy list. Will be wrapped by other components
 * to define each possible item, e.g. HeirarchyClassItem
 *
 * Proptypes
 * @param {string} name name text for this item
 * @param {() => ()} onItemClicked callback for being clicked
 * @param {bool} isSelected used for styling
 * @param {int} indentLevel
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

  render() {
    let indentSpacer = [...Array(this.props.indentLevel)].map((e, i) => (
      <div className="HeirarchyItem-spacer" key={i}></div>
    ));

    return (
      <div
        className={this.props.isSelected ? "HeirarchyItem-selected" : "HeirarchyItem-container"}
        onClick={this.handleOnClick}
      >
        <div className="u-flex">
          {indentSpacer}
          <div className="HeirarchyItem-arrowContainer">
            {this.state.isOpen ? (
              <ArrowDropDownIcon className="HeirarchyItem-arrow" />
            ) : (
              <ArrowRightIcon className="HeirarchyItem-arrow" />
            )}
          </div>
          <div className="u-noselect">{this.props.name}</div>
        </div>
      </div>
    );
  }
}

export default HeirarchyItem;
