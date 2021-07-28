import React, { Component } from "react";
import { Link } from "@reach/router";
import GoogleLogin, { GoogleLogout } from "react-google-login";

import "./NavBar.css";
import GraphTitle from "./GraphTitle";

// This identifies your web application to Google's authentication service
const GOOGLE_CLIENT_ID = "473302145912-rdee01mcmup7f0otn3ocn2vv1a6is83f.apps.googleusercontent.com";

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
        <div className="u-flex-alignCenter">
          <div className="NavBar-logo"></div>
          <div className="u-spacer-16"></div>
          <div className="NavBar-title u-inlineBlock">TreeDocs</div>
          <div className="u-spacer-16"></div>
          <div className="u-spacer-16"></div>
          <div className="u-spacer-16"></div>

          <div className="NavBar-crumb NavBar-crumb-previous">Project</div>
          <div className="NavBar-slash">/</div>
          <div className="NavBar-crumb NavBar-crumb-current">{this.props.selectedGraph.name}</div>
        </div>
        <GraphTitle
          selectedGraph={this.props.selectedGraph}
          updateSelectedGraph={this.props.updateSelectedGraph}
        />
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
