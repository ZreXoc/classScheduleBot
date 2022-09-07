import * as dotenv from "dotenv";
import schedule from "node-schedule";
import { WebSocket } from "ws";
import mySchedule, { classes, times } from "./schedule.js";
import { nextClass, parseTime, toTime } from "./util.js";

dotenv.config();

const { HTTP_HOST, WS_HOST, GROUP_ID } = process.env;

const sendMsg = (message) =>
  fetch(HTTP_HOST, {
    headers: new Headers({
      "Content-Type": "application/json",
    }),
    method: "POST",
    body: JSON.stringify({
      action: "send_group_msg",
      params: {
        group_id: +GROUP_ID,
        message: message,
      },
      echo: "test",
    }),
  });

mySchedule.map(({ time, message }) => {
  schedule.scheduleJob(time, function () {
    const msg = typeof message === "string" ? message : message();
    sendMsg(msg);
  });
});

const ws = new WebSocket(WS_HOST);

ws.on("open", () => {
  ws.on("message", (d) => {
    const data = JSON.parse(d.toString());
    if (!(data["post_type"] == "message" && data["group_id"] == 1021463756))
      return;
    const date = new Date();

    const msg = data["raw_message"];

    if (msg.match(/今[天日](.*)(什么课|课表)/)) {
      sendMsg(`今日课表: ${classes[date.getDay() - 1].join(" ")}`);
      return;
    }
    if (msg.match(/明[天日](.*)(什么课|课表)/)) {
      sendMsg(`明日课表: ${classes[date.getDay() % 7].join(" ")}`);
      return;
    }
    const idxOfNextClass = times.findIndex(
        (t) => parseTime(t).getTime() > date.getTime()
      ),
      idxOfCurrentClass = idxOfNextClass - 1;
    if (msg.match(/什么课/)) {
      sendMsg(
        `这节是${classes[date.getDay() - 1][idxOfNextClass - 1]}(${
          times[idxOfNextClass - 1]
        })\n下节是${classes[date.getDay() - 1][idxOfNextClass]}(${
          times[idxOfNextClass]
        })`
      );
      return;
    }
    if (msg.match(/^[多好]久下课$/)) {
      const timeOfCurrentClass = parseTime(times[idxOfCurrentClass]);

      const classOver = new Date();
      classOver.setTime(timeOfCurrentClass.getTime() + 40 * 60 * 1000);
      sendMsg(toTime(classOver));
      return;
    }
    const match = msg.match(/^叫\s*(.*?)\s+(.*)$/);
    if (match) {
      sendMsg(`${match[1] || "@" + data["sender"]["card"]} ${match[2]}`);
      return;
    }
  });
});

console.log("start");
