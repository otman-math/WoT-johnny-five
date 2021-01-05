const arduino = require("../arduino/arduino");
const express = require("express");

const app = express();
const path = require("path");
const http = require("http");
app.use(express.json());
const httpsServer = http.createServer(app);
var io = require("socket.io")(httpsServer);

const DIST_DIR = path.join(__dirname, "../dist");
const port = process.env.PORT || 3000;

app.use(express.static(DIST_DIR));

function log(text) {
  const time = new Date();

  console.log(`[${time.toLocaleTimeString()}] ${text}`);
}

httpsServer.listen(port, () => {
  log(`Server is listening on port ${port}`);
});

app.get("/door", function(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.send({ type: "position", value: arduino.getDoorPosition() });
});

app.put("/door", function(req, res) {
  res.setHeader("Content-Type", "application/json");
  arduino.moveDoor(
    req.body.position,
    arduino.servo,
    arduino.ledRed,
    arduino.ledGreen
  );
  res.send({ type: "position", value: arduino.getDoorPosition() });
});

app.post("/unlock", function(req, res) {
  res.setHeader("Content-Type", "application/json");
  var msg = arduino.toggleDoor(
    req.body.code,
    arduino.servo,
    arduino.ledRed,
    arduino.ledGreen
  );
  res.send({
    type: "position",
    message: msg,
    value: arduino.getDoorPosition()
  });
});

function broadcast(text) {
  io.emit("event", text);
}
module.exports.broadcast = broadcast;
console.log("connecting to arduino");
io.on("connection", function(socket) {
  console.log("a user connected");
});
