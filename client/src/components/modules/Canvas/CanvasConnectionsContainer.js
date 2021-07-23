import React, { Component } from "react";
import "./CanvasConnectionsContainer.css";

/**
 * SVG container component for all the line connections
 *
 * Proptypes
 * @param {GraphObject} selectedGraph
 * @param {NodeObject} connectionStartNode live connection not yet attached
 * @param {bool} connectionStartType type of live connection
 */
class CanvasConnectionsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
      scheduleGetMousPos: false,
      initialMousePos: { x: 0, y: 0 },
      currentMouseDelta: { x: 0, y: 0 },
    };
    this.svgRef = React.createRef();
  }

  updateSvgDimensions = () => {
    if (this.svgRef.current != null) {
      console.log(this.svgRef.current);
      this.setState({
        width: this.svgRef.current.offsetWidth,
        height: this.svgRef.current.offsetHeight,
      });
    }
  };

  handleOnMouseMove = (event) => {
    if (this.state.scheduleGetMousPos) {
      this.setState({
        initialMousePos: { x: event.pageX, y: event.pageY },
        scheduleGetMousPos: false,
      });
      return;
    }

    let deltaX = event.pageX - this.state.initialMousePos.x;
    let deltaY = event.pageY - this.state.initialMousePos.y;

    this.setState({ currentMouseDelta: { x: deltaX, y: deltaY } });
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.connectionStartNode != null && prevProps.connectionStartNode == null) {
      document.addEventListener("mousemove", this.handleOnMouseMove);
      this.setState({ scheduleGetMousPos: true, currentMouseDelta: { x: 0, y: 0 } });
    } else if (this.props.connectionStartNode == null && prevProps.connectionStartNode != null) {
      document.removeEventListener("mousemove", this.handleOnMouseMove);
    }
  }

  componentDidMount() {
    // window.addEventListener("resize", this.updateCanvasDimensions);
    this.updateSvgDimensions();
  }

  render() {
    let pathsList = [];
    let connections = this.props.selectedGraph.connections;
    for (var i = 0; i < connections.length; i++) {
      let offset = 50;

      // Get start position
      let startPosition = this.props.selectedGraph.nodes.filter(
        (node) => node.classObject._id == connections[i].startId
      )[0].savedPosition;

      // Get end position
      let endPosition = this.props.selectedGraph.nodes.filter(
        (node) => node.classObject._id == connections[i].endId
      )[0].savedPosition;

      // Flop offsets if needed
      if (connections[i].startIsInput) {
        offset = offset * -1;
      }

      // Define path
      pathsList.push(
        <path
          d={`M${startPosition.x},${startPosition.y + offset} 
          L${endPosition.x},${endPosition.y - offset} Z`}
          key={`ConnectionPath_${connections[i].startId}_to_${connections[i].endId}_${connections[i].startIsInput}`}
        />
      );
    }

    // Make the creating path
    if (this.props.connectionStartNode != null) {
      let offset = 50;
      pathsList.push(
        <path
          d={`M${this.props.connectionStartNode.savedPosition.x},${
            this.props.connectionStartNode.savedPosition.y +
            offset * (this.props.connectionStartType ? -1 : 1)
          } 
              L${this.props.connectionStartNode.savedPosition.x + this.state.currentMouseDelta.x},${
            this.props.connectionStartNode.savedPosition.y +
            +offset * (this.props.connectionStartType ? -1 : 1) +
            this.state.currentMouseDelta.y
          } Z`}
          key={`ConnectionPath_${this.props.connectionStartNode.classObject._id}_to_empty`}
        />
      );
    }

    return (
      <div className="CanvasConnectionsContainer-svgWrapper" ref={this.svgRef}>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${this.state.width} ${this.state.height}`}
          className="CanvasConnectionsContainer-svg"
          // preserveAspectRatio="xMinYMin meet"
        >
          <g stroke="#99a880" strokeWidth="3px" fill="none">
            {pathsList}
          </g>
        </svg>
      </div>
    );
  }
}

export default CanvasConnectionsContainer;
