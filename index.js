const VERIFY_TOKEN = "tienle11072000";
const PAGE_ACCESS_TOKEN =
  "EAADdKA6ZAg64BAAJHZAlDgLKRWm991ItnLdsrQikGoCmbQLyecMoCg5LwbG2t84oVQRfMCFPf4bhWCUvFZAIC1KL3fzAH4HWYVeFOzA3eGUs2R6KW7eEz9lA1hyZA7awdHF1WyvzkKh5mG3cpRacKCH7p7PQFKjCceT3BtuXKgZDZD";
const APP_SECRET = "e038f0c1c9d8ee795bb3b28ac86181c2";
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
      let messaging = entry.messaging;
      messaging.forEach((message) => {
        const senderId = message.sender.id;
        if (message.message) {
          if (message.message.text) {
            const text = message.message.text;
            console.log(text);
            sendMessage(
              senderId,
              `Đang trong giai đoạn thử nghiệm nên không biết nói gì :))
               Có phải bạn vừa nói "${text}"`
            );
          }
        }
      });
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
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("webhook is verified!");
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
});

function sendMessage(senderId, message) {
  request({
    url: "https://graph.facebook.com/v2.6/me/messages",
    qs: {
      access_token: PAGE_ACCESS_TOKEN,
    },
    method: "POST",
    json: {
      recipient: {
        id: senderId,
      },
      message: {
        text: message,
      },
    },
  });
}

app.listen(PORT, () =>
  console.log(`Chat bot server listening at http://localhost:${PORT}`)
);
