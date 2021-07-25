import React, { Component } from "react";
import "./PropertiesConnectionPanel.css";

/**
 * PropertiesConnectionPanel
 *
 * Proptypes
 * @param {ConnectionObject} connectionObject
 */
class PropertiesConnectionPanel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <div className="PropertiesConnectionPanel-container">
          <div className="PropertiesConnectionPanel-heading">Connection</div>
          <ul>
            <li className="PropertiesConnectionPanel-li">
              Start: {this.props.connectionObject.startId}
            </li>
            <li className="PropertiesConnectionPanel-li">
              End: {this.props.connectionObject.endId}
            </li>
          </ul>
        </div>
      </>
    );
  }
}

export default PropertiesConnectionPanel;
