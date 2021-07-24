import React, { Component } from "react";
import "./CanvasSnackbar.css";
const clamp = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a));
const invlerp = (x, y, a) => clamp((a - x) / (y - x));

/**
 * Snackbar for notifications
 *
 * Proptypes
 * @param {ToastObject} toastObject to display
 * @param {(ToastObject) => ()} removeToastNotification callback
 */
class CanvasSnackbar extends Component {
  constructor(props) {
    super(props);
    this.state = { isActive: true, lifePercent: 0.0 };
  }

  removeOnClick = (event) => {
    this.props.removeToastNotification(this.props.toastObject);
  };

  updateAnimation = () => {
    let delta = Date.now() - this.props.toastObject.timeCreated;
    let newPercent = delta / 2200.0;

    if (newPercent <= 1.15) {
      this.setState({ lifePercent: newPercent });
      requestAnimationFrame(this.updateAnimation);
    } else {
      this.props.removeToastNotification(this.props.toastObject);
    }
  };

  componentDidMount() {
    requestAnimationFrame(this.updateAnimation);
  }

  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    let barFill = Math.min(this.state.lifePercent, 1) * 100;
    let opacity =
      this.state.lifePercent > 1.0 ? 1 - invlerp(1.0, 1.15, this.state.lifePercent) : 1.0;
    return (
      <div
        onClick={this.removeOnClick}
        className={
          "CanvasSnackbar-container u-default-shadow " +
          (this.state.isActive ? "CanvasSnackbar-active " : "")
        }
        style={{ opacity: opacity }}
      >
        <div className="CanvasSnackbar-fill" style={{ width: barFill + "%" }}></div>
        <div style={{ zIndex: 10 }}>{this.props.toastObject.message}</div>
      </div>
    );
  }
}

export default CanvasSnackbar;
