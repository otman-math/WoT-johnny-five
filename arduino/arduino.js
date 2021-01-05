const { Board, Led, Servo, Button, Sensor } = require("johnny-five");
const socketServer = require("../server/index");
const board = new Board({ port: "COM3" });
module.exports.board = board;
const maxPosition = 90;
const minPosition = 0;
var doorOpened = false;
module.exports.doorOpened = doorOpened;
var doorPosition = minPosition;
module.exports.doorPosition = doorPosition;
var ledYellow = null;
var ledGreen = null;
var ledRed = null;
var button = null;
var sensor = null;
var servo = null;

board.on("ready", () => {
  activateChange = true; // separate sensor events
  ledYellow = new Led(3);
  module.exports.ledYellow = ledYellow;
  ledGreen = new Led(4);
  module.exports.ledGreen = ledGreen;
  ledRed = new Led(5);
  module.exports.ledRed = ledRed;
  button = new Button(2);
  module.exports.button = button;
  sensor = new Sensor("A0");
  module.exports.sensor = sensor;
  knocks = 0;
  servo = new Servo({
    pin: 9,
    startAt: minPosition
  });
  module.exports.servo = servo;
  ledRed.on();
  board.repl.inject({
    button: button
  });
  button.on("up", function() {
    toggleDoor(100, servo, ledRed, ledGreen);
  });

  sensor.on("change", function() {
    //TODO: ajouter le websocket
    console.log(sensor.value);
    if (sensor.value > 20 && activateChange) {
      activateChange = false;
      setTimeout(function() {
        activateChange = true;
      }, 3000);
      ledYellow.on();
      socketServer.broadcast("Someone is knocking on the door");
      if (++knocks >= 3) {
        unlock(servo, ledRed, ledGreen);
      }
      // Toggle the led after 5 seconds (shown in ms)
      board.wait(2000, () => {
        ledYellow.off();
        lock(servo, ledRed, ledGreen);
      });
    }
  });

  board.on("exit", () => {
    ledYellow.stop();
    ledYellow.off();
    ledGreen.stop();
    ledGreen.off();
    ledRed.stop();
    ledRed.off();
    servo.stop();
  });
});

function toggleDoor(code, servo, ledRed, ledGreen) {
  if (code == 100) {
    setTimeout(function() {
      if (doorOpened) {
        lock(servo, ledRed, ledGreen);
        return "Door closed";
      } else {
        unlock(servo, ledRed, ledGreen);

        board.wait(3000, () => {
          //ledGreen.off();
          lock(servo, ledRed, ledGreen);
        });
      }
    }, 3000);
  } else {
    return "Code incorrect";
  }
}
module.exports.toggleDoor = toggleDoor;

function unlock(servo, ledRed, ledGreen) {
  servo.to(maxPosition);
  doorPosition = maxPosition;
  doorOpened = true;
  ledGreen.on();
  ledRed.off();
}

function lock(servo, ledRed, ledGreen) {
  servo.to(minPosition);
  doorPosition = minPosition;
  doorOpened = false;
  ledRed.on();
  ledGreen.off();
}

function moveDoor(position, servo, ledRed, ledGreen) {
  servo.to(position);
  doorPosition = position;
  if (position == minPosition) {
    ledRed.on();
    ledGreen.off();
  } else {
    ledRed.off();
    ledGreen.on();
  }
}
module.exports.moveDoor = moveDoor;

function getDoorOpened() {
  return doorOpened;
}
module.exports.getDoorOpened = getDoorOpened;

function getDoorPosition() {
  return doorPosition;
}
module.exports.getDoorPosition = getDoorPosition;
