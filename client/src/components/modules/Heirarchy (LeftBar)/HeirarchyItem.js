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

  toggleOpen = (event) => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  render() {
    let indentSpacer = [...Array(this.props.indentLevel)].map((e, i) => (
      <div className="HeirarchyItem-spacer" key={i}></div>
    ));
    return (
      <>
        <div
          className={this.props.isSelected ? "HeirarchyItem-selected" : "HeirarchyItem-container"}
          onClick={this.handleOnClick}
        >
          <div className="u-flex">
            {indentSpacer}
            <div className="HeirarchyItem-arrowContainer">
              {this.props.children != null &&
              (this.props.children[0] != null || this.props.children[1] != null) ? (
                <ArrowRightIcon
                  className="HeirarchyItem-arrow"
                  onClick={this.toggleOpen}
                  style={this.state.isOpen ? { transform: "rotate(90deg)" } : {}}
                />
              ) : null}
            </div>
            <div className="u-noselect">{this.props.name}</div>
          </div>
        </div>
        {this.state.isOpen ? this.props.children : null}
      </>
    );
  }
}

export default HeirarchyItem;
