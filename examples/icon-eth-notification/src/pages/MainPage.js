import React from "react";

import { useLocation } from "react-router-dom";
import { Nav, NavLink, NavMenu } from "./Navigate";
import { useState } from "react";
import ModalApp from "./Modal";
import {
  Menu,
  Button,
  Dropdown,
  Container,
  Icon,
  Image,
  Label,
} from "semantic-ui-react";
import { useNavigate } from "react-router-dom";

function Main() {
  const location = useLocation();
  const navigate = useNavigate();
  // const user_auth_token = location.state.auth_token;
  const [auther, setAuth] = useState(localStorage.getItem("authToken"));

  const [activeScreen, setActiveScreen] = useState("home");

  function handleChangeActiveScreen(screen) {
    setActiveScreen(screen);
  }

  const handleLogout = () => {
    location.state.auth_token = "";
    console.log(location.state.auth_token);
    console.log("kaskkkf");
    setAuth("");
    localStorage.clear();
  };

  const handleAbout = () => {
    activeScreen === "home";
  };
  if (auther == "") {
    alert(" Please Login");
    navigate("/");
  }

  return (
    <>
      <Nav>
        <NavMenu>
          <NavLink to="/main" activeStyle OnClick={handleAbout}>
            Home
          </NavLink>
          <Menu.Menu position="right" style={{ alignItems: "center" }}>
            {auther ? <ModalApp user_auth_token={auther}></ModalApp> : null}
            {!auther ? (
              <span>
              </span>
            ) : null}
          </Menu.Menu>

          <NavLink
            exact
            to={{ pathname: "/" }}
            activeStyle
            OnClick={handleLogout}
          >
            Sign Out
          </NavLink>
        </NavMenu>
      </Nav>
      <div className="division">
        <h1>Aurras</h1>
      </div>

      {activeScreen === "home" && (
        <div className="one">
          <h1></h1>
          <p className="para">
            Aurras is a middleware that acts as an event processor and a low
            code workflow orchestration platform. Aurras is being pitched as a
            next-generation system for enabling decentralized push notification.
            This middleware solution listens to events from blockchain
            applications and propagates them to a registered pool of MQTT
            brokers. The broader architecture consist of parachain from which
            the middleware listens for the events.
          </p>
          <p className="para">
            Aurras present you an application for icon-eth notification system
            that will help the developers and users to notify one message is
            recieved on the other end chain. for do so you need to register with
            your DAPP address. the system will register your dapp and along with
            the device token. once an event emitted from the xcall, aurras event
            feed will catch and give to the aurras system. aurras system will
            filter and parse the event and it will check for any register user
            and sent the notification
          </p>

          <p className="para">
            Future scope of this system is the automating the execute call,
            personalizing the notification for specid dapp and also for the
            user.
          </p>

          <p className="para">
            while registering for the notification, you should provide the DAPP
            address in btp format for example{" "}
            <b>btp://0x3.icon/cxabsabcababcbacbabcbabcabacbacb </b>
          </p>
        </div>
      )}

      <div className="three">
        <h1></h1>
        <p>Thanks to hugobyte</p>
      </div>
    </>
  );
}

export default Main;
