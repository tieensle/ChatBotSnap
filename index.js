const VERIFY_TOKEN = "tienle11072000";
const PAGE_ACCESS_TOKEN =
  "EAAnZBo0Pduv0BAGp3yhVgaX2aFle306ATE9dTnRMz32VXdtpw3V2sXvRb7OdOJNRr69b7kIZC9YJuhTiYuXZCHy0WRJyROx6HbMuKlkTC640ZByPHCxGu2Bktlc93LbeLRCSs6w7gimIlvSZCyGVcunjOIIHB4WM7ZCqX7OLq1PgZDZD";
const express = require("express");
const request = require("request");
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const PORT = process.env.PORT || 1337;

app.get("/", (req, res) => {
  res.send("Server is running, OK!");
});

app.post("/webhook", (req, res) => {
  let body = req.body;

  if (body.object === "page") {
    body.entry.forEach((entry) => {
      let webhook_event = entry.messaging[0];
      let senderId = webhook_event.sender.id;
      if (webhook_event.message) {
        handleMessage(senderId, webhook_event.message);
      } else if (webhook_event.postback) {
        handlePostback(senderId, webhook_event.postback);
      }
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

async function handleMessage(senderId, message) {
  let response;
  if (message.text) {
    const text = await message.text;
    callSendAPI(senderId, { text: `Có phải bạn vừa nói "${text}"` });
    callSendAPI(senderId, {
      text: `Nhưng mà không biết trả lời đâu :v . Gửi tui cái tệp file ảnh đê!`,
    });
  } else if (message.attachments) {
    // Get the URL of the message attachment
    let attachment_url = message.attachments[0].payload.url;
    response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: "Is this the right picture?",
              subtitle: "Tap a button to answer.",
              image_url: attachment_url,
              buttons: [
                {
                  type: "postback",
                  title: "Yes!",
                  payload: "yes",
                },
                {
                  type: "postback",
                  title: "No!",
                  payload: "no",
                },
              ],
            },
          ],
        },
      },
    };
  }

  callSendAPI(senderId, response);
}

function handlePostback(senderId, postback) {
  let response;
  let payload = postback.payload;
  if (payload === "yes") {
    response = { text: "chuẩn vl!" };
  } else if (payload === "no") {
    response = { text: "bảo gửi ảnh cơ mà -_-" };
  }
  callSendAPI(senderId, response);
}

function callSendAPI(senderId, message) {
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
      message: message,
    },
  });
}

app.listen(PORT, () =>
  console.log(`Chat bot server listening at http://localhost:${PORT}`)
);
