import React, { Component } from "react";
import CanvasPanel from "../modules/Canvas/CanvasPanel.js";
import HeirarchyPanel from "../modules/Heirarchy (LeftBar)/HeirarchyPanel.js";
import PropertiesPanel from "../modules/Properties (RightBar)/PropertiesPanel.js";

import "./Home.css";

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // called when the "Feed" component "mounts", i.e.
  // when it shows up on screen
  componentDidMount() {
    document.title = "TreeDocs";
  }

  render() {
    return (
      <div className="Home-container u-flex">
        <HeirarchyPanel />
        <CanvasPanel />
        <PropertiesPanel />
      </div>
    );
  }
}

export default Home;
