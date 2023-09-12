import React, { useState } from "react";
import Modal from "react-modal";
import config from "../config";
import { getMessaging } from "firebase/messaging/sw";
import { getToken } from "firebase/messaging";
import { json } from "react-router-dom";

const customStyles = {
  content: {
    width: "50%",
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

function ModalApp(props) {
  const messaging = getMessaging(config.firebase);
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const [topics, setTopics] = useState([]);
  const [selected, setSelected] = useState("");
  const [action, setAction] = useState("");
  const [token, setToken] = useState("");
  const [user_auth, setUserAuth] = useState(props.user_auth_token);
  const [address, SetAddress] = useState("");
  const [notification, setNotification] = React.useState({
    visible: false,
    title: "",
    message: "",
    variant: "",
  });
  const [busy, setBusy] = useState(false);
  getToken(messaging)
    .then((token) => {
      setToken(token);
    })
    .catch((err) => {
      console.log(err);
    });
  function openModal() {
    setIsOpen(true);
  }

  function selectTopic(event) {
    console.log(event.target);
    setSelected(event.target.value);
  }

  function afterOpenModal() {
    fetch(`${config.api}default/workflow-management`)
      .then((response) => response.json())
      .then((data) => {
        if (data[0]) setSelected(data[0].doc.trigger);
        setTopics(data);
      });
  }

  function closeModal() {
    setIsOpen(false);
  }

  function register({ auth_token, topic, token, address, action }) {
    setBusy(true);
    const input = { address: address };
    var requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        mode: "no-cors",
        "Access-Control-Allow-Origin": "*",
        authorization: localStorage.getItem("authToken")
        // "Access-Control-Allow-Methods": "GET,POST,OPTIONS,PUT,PATCH,DELETE",
        // "Access-Control-Allow-Credentials" : "true"
      },
      body: JSON.stringify({
        address: action,
        topic: topic,
        token: localStorage.getItem("authToken"),
        input: input,
        auth_token: auth_token,
      }),
    };
    console.log(requestOptions.body);

    console.log(requestOptions.headers);
    fetch(`${config.api}default/workflow-management.json`, requestOptions)
      .then((response) => {
        console.log(response);
        response.json();
      })
      .then((data) => {
        console.log(data);
        setNotification({
          visible: true,
          title: "Success",
          message: "Registered!",
          variant: "positive",
        });
      })
      .catch((error) => {
        setNotification({
          visible: true,
          title: "Failed",
          message: "Not Registered!",
          variant: "negative",
        });
      })
      .finally(() => {
        setBusy(false);
        setTimeout(() => {
          setNotification({
            visible: false,
            title: "",
            message: "",
            variant: "",
          });
        }, 5000);
      });
  }
  return (
    <div>
      <button onClick={openModal} className="ui button">
        Register Icon/Eth Notification
      </button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Register Icon Notification"
      >
        {/* <div className="ui grid">
                    <div className="ten column row">
                        <div className="right floated column">
                            <button className="circular ui icon button" onClick={closeModal}>
                                <i className="icon close"></i>
                            </button>
                        </div>
                    </div>
                </div> */}
        {notification.visible && (
          <div className={"ui message ".concat(notification.variant)}>
            <i className="close icon"></i>
            <div className="header">{notification.title}</div>
            <p>{notification.message}</p>
          </div>
        )}

        <div>
          <div className="label">Event Source</div>
          <div className="ui dropdown">
            <select
              className="ui dropdown w-full pt pb"
              onChange={selectTopic}
              value={selected}
            >
              {topics.map(function (item) {
                return (
                  <option key={item.doc.trigger} value={item.doc.trigger}>
                    {item.doc.name}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div>
          <div className="label">Address</div>
          <div className="ui input focus">
            <input
              type="text"
              placeholder="Address in BTP format <btp://<network>/<contract address>>"
              value={address}
              onChange={(event) => SetAddress(event.target.value)}
            />
          </div>
        </div>
        <div>
          <div className="label">Push Notification Token</div>
          <div className="ui fluid disabled input pt pb">
            <input value={token} readOnly />
          </div>
        </div>
        <div className="ui grid">
          <div className="four column centered row">
            <button
              onClick={() =>
                register({
                  auth_token: user_auth,
                  topic: selected,
                  token,
                  address: address,
                  action: action,
                })
              }
              className={"ui primary button ".concat(
                busy ? "disabled loading" : ""
              )}
            >
              register
            </button>
            <button onClick={closeModal} className="ui button">
              close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ModalApp;
