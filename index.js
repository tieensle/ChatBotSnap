const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const PORT = process.env.PORT || 1337;

app.get("/", (req, res) => {
  res.send("Server is running, OK!");
});

app.post("/webhook", (req, res) => {
  if (req.body.object === "page") {
    req.body.entry.forEach((entry) => {
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
    });
    res.status(200).send("EVENT_RECEIVED");
  } else {
    res.sendStatus(404);
  }
});

app.get("/webhook", (req, res) => {
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  if (mode && token) {
    if (mode === "subscribe" && token === process.env.VERIFY_TOKEN) {
      console.log("webhook is verified!");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

// function sendMessage(senderId, message) {
//   request({
//     url: "https://graph.facebook.com/v2.6/me/messages",
//     qs: {
//       access_token: process.env.PAGE_ACCESS_TOKEN,
//     },
//     method: "POST",
//     json: {
//       recipient: {
//         id: senderId,
//       },
//       message: {
//         text: message,
//       },
//     },
//   });
// }

app.listen(PORT, () =>
  console.log(`Chat bot server listening at http://localhost:${PORT}`)
);
