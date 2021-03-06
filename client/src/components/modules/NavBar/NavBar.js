import React, { Component } from "react";
import { Link } from "@reach/router";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import "./NavBar.css";
import GraphTitle from "./GraphTitle";
import EditableText from "../Common/EditableText";

// This identifies your web application to Google's authentication service
const GOOGLE_CLIENT_ID = "584650489585-pbmvmtumr8ni4soas7gqcu74f69cl0cr.apps.googleusercontent.com";

/**
 * The navigation bar at the top of all pages. Takes no props.
 */
class NavBar extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <nav className="NavBar-container u-default-shadow">
        {this.props.saveSuccessful ? (
          <div className="NavBar-saveSuccessful">
            Save Successful{" "}
            <span onClick={this.props.onSaveBoxClose} className="NavBar-saveSuccessfulClose">
              x
            </span>
          </div>
        ) : null}
        <div className="u-flex-alignCenter">
          <div className="NavBar-logo"></div>
          <div className="u-spacer-16"></div>
          <div className="NavBar-title u-inlineBlock">TreeDocs</div>
          <div className="u-spacer-16"></div>
          <div className="u-spacer-16"></div>
          <div className="u-spacer-16"></div>

          {this.props.selectedProject && this.props.userId ? (
            <div>
              <EditableText
                text={this.props.selectedProject.name}
                customClass="NavBar-crumb"
                iconSize="medium"
                hideIcon={false}
                hideUnderline={true}
                onTextChanged={this.props.onProjectNameChange}
              />
            </div>
          ) : null}

          {/* {this.props.selectedGraph ? (
            <>
              <div className="NavBar-slash">/</div>
              <div className="NavBar-crumb NavBar-crumb-current">
                {this.props.selectedGraph.name}
              </div>
            </>
          ) : null} */}
        </div>
        {this.props.selectedGraph && this.props.userId ? (
          <GraphTitle
            selectedGraph={this.props.selectedGraph}
            updateSelectedGraph={this.props.updateSelectedGraph}
          />
        ) : null}

        <div className="NavBar-linkContainer u-inlineBlock">
          {this.props.userId ? (
            <GoogleLogout
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Logout"
              onLogoutSuccess={this.props.handleLogout}
              onFailure={(err) => console.log(err)}
              className="NavBar-link NavBar-login"
            />
          ) : (
            <GoogleLogin
              clientId={GOOGLE_CLIENT_ID}
              buttonText="Login"
              onSuccess={this.props.handleLogin}
              onFailure={(err) => console.log(err)}
              className="NavBar-link NavBar-login"
            />
          )}
        </div>
      </nav>
    );
  }
}

export default NavBar;
