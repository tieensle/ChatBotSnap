const VERIFY_TOKEN = "tienle11072000";
const PAGE_ACCESS_TOKEN =
  "EAAnZBo0Pduv0BAGp3yhVgaX2aFle306ATE9dTnRMz32VXdtpw3V2sXvRb7OdOJNRr69b7kIZC9YJuhTiYuXZCHy0WRJyROx6HbMuKlkTC640ZByPHCxGu2Bktlc93LbeLRCSs6w7gimIlvSZCyGVcunjOIIHB4WM7ZCqX7OLq1PgZDZD";
const APP_SECRET = "e038f0c1c9d8ee795bb3b28ac86181c2";
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
      let messaging = entry.messaging;
      messaging.forEach((message) => {
        const senderId = message.sender.id;
        if (message.message) {
          handleMessage(senderId, message.message);
        } else if (message.postback) {
          handlePostback(senderId, message.postback);
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

function handleMessage(senderId, message) {
  let response;
  if (message.text) {
    const text = message.message.text;
    callSendAPI(senderId, `Có phải bạn vừa nói "${text}"`);
    callSendAPI(
      senderId,
      `Nhưng mà không biết trả lời đâu :v . Gửi tui cái tệp file ảnh đê!`
    );
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

// ("use strict");
// const PAGE_ACCESS_TOKEN =
//   "EAAnZBo0Pduv0BAGp3yhVgaX2aFle306ATE9dTnRMz32VXdtpw3V2sXvRb7OdOJNRr69b7kIZC9YJuhTiYuXZCHy0WRJyROx6HbMuKlkTC640ZByPHCxGu2Bktlc93LbeLRCSs6w7gimIlvSZCyGVcunjOIIHB4WM7ZCqX7OLq1PgZDZD";
// // Imports dependencies and set up http server
// const request = require("request"),
//   express = require("express"),
//   body_parser = require("body-parser"),
//   app = express().use(body_parser.json()); // creates express http server

// // Sets server port and logs message on success
// app.listen(process.env.PORT || 1337, () => console.log("webhook is listening"));

// // Accepts POST requests at /webhook endpoint
// app.post("/webhook", (req, res) => {
//   // Parse the request body from the POST
//   let body = req.body;

//   // Check the webhook event is from a Page subscription
//   if (body.object === "page") {
//     body.entry.forEach(function (entry) {
//       // Gets the body of the webhook event
//       let webhook_event = entry.messaging[0];
//       console.log(webhook_event);

//       // Get the sender PSID
//       let sender_psid = webhook_event.sender.id;
//       console.log("Sender ID: " + sender_psid);

//       // Check if the event is a message or postback and
//       // pass the event to the appropriate handler function
//       if (webhook_event.message) {
//         handleMessage(sender_psid, webhook_event.message);
//       } else if (webhook_event.postback) {
//         handlePostback(sender_psid, webhook_event.postback);
//       }
//     });
//     // Return a '200 OK' response to all events
//     res.status(200).send("EVENT_RECEIVED");
//   } else {
//     // Return a '404 Not Found' if event is not from a page subscription
//     res.sendStatus(404);
//   }
// });

// // Accepts GET requests at the /webhook endpoint
// app.get("/webhook", (req, res) => {
//   /** UPDATE YOUR VERIFY TOKEN **/
//   const VERIFY_TOKEN = "tienle11072000";

//   // Parse params from the webhook verification request
//   let mode = req.query["hub.mode"];
//   let token = req.query["hub.verify_token"];
//   let challenge = req.query["hub.challenge"];

//   // Check if a token and mode were sent
//   if (mode && token) {
//     // Check the mode and token sent are correct
//     if (mode === "subscribe" && token === VERIFY_TOKEN) {
//       // Respond with 200 OK and challenge token from the request
//       console.log("WEBHOOK_VERIFIED");
//       res.status(200).send(challenge);
//     } else {
//       // Responds with '403 Forbidden' if verify tokens do not match
//       res.sendStatus(403);
//     }
//   }
// });

// function handleMessage(sender_psid, received_message) {
//   let response;

//   // Checks if the message contains text
//   if (received_message.text) {
//     // Create the payload for a basic text message, which
//     // will be added to the body of our request to the Send API
//     response = {
//       text: `You sent the message: "${received_message.text}". Now send me an attachment!`,
//     };
//   } else if (received_message.attachments) {
//     // Get the URL of the message attachment
//     let attachment_url = received_message.attachments[0].payload.url;
//     response = {
//       attachment: {
//         type: "template",
//         payload: {
//           template_type: "generic",
//           elements: [
//             {
//               title: "Is this the right picture?",
//               subtitle: "Tap a button to answer.",
//               image_url: attachment_url,
//               buttons: [
//                 {
//                   type: "postback",
//                   title: "Yes!",
//                   payload: "yes",
//                 },
//                 {
//                   type: "postback",
//                   title: "No!",
//                   payload: "no",
//                 },
//               ],
//             },
//           ],
//         },
//       },
//     };
//   }

//   // Send the response message
//   callSendAPI(sender_psid, response);
// }

// function handlePostback(sender_psid, received_postback) {
//   console.log("ok");
//   let response;
//   // Get the payload for the postback
//   let payload = received_postback.payload;

//   // Set the response based on the postback payload
//   if (payload === "yes") {
//     response = { text: "Thanks!" };
//   } else if (payload === "no") {
//     response = { text: "Oops, try sending another image." };
//   }
//   // Send the message to acknowledge the postback
//   callSendAPI(sender_psid, response);
// }

// function callSendAPI(sender_psid, response) {
//   // Construct the message body
//   let request_body = {
//     recipient: {
//       id: sender_psid,
//     },
//     message: response,
//   };

//   // Send the HTTP request to the Messenger Platform
//   request(
//     {
//       uri: "https://graph.facebook.com/v2.6/me/messages",
//       qs: { access_token: PAGE_ACCESS_TOKEN },
//       method: "POST",
//       json: request_body,
//     },
//     (err, res, body) => {
//       if (!err) {
//         console.log("message sent!");
//       } else {
//         console.error("Unable to send message:" + err);
//       }
//     }
//   );
// }
