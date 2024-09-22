import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import "react-notifications/lib/notifications.css";
import "react-confirm-alert/src/react-confirm-alert.css";
import { App } from "./App";
import { Provider } from "react-redux";
import store from "./Redux/Store";
import { NotificationContainer } from "react-notifications";
import { LoadingAlert } from "./Common";
ReactDOM.render(
  <Provider store={store}>
    <App />
    <NotificationContainer />
    <LoadingAlert />
  </Provider>,
  document.getElementById("root")
);
