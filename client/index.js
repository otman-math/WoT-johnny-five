import React from "react";
import ReactDOM from "react-dom";

import App from "./components/app";

const style = {
  fontSize: "20px",
  textAlign: "center"
};

const Index = () => (
  <div className="container">
    <h1 style={style}>Demo tp4 arduino</h1>
    <div style={{ textAlign: "center" }}>
      <App />
    </div>
  </div>
);

ReactDOM.render(<Index />, document.getElementById("root"));
