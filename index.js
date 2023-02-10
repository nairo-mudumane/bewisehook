require("dotenv").config();
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const token = process.env.TOKEN;
const myToken = process.env.MY_TOKEN;

app.get("/webhook", (req, res) => {
  let mode = req.query["hub.mode"];
  let challenge = req.query["hub.challenge"];
  let token = req.query["hub.verify_token"];

  if (mode && token) {
    if (mode == "subscribe" && token == myToken) {
      res.status(200).send(challenge);
    } else {
      res.status(403);
    }
  }
});

app.post("/webhook", (req, res) => {
  let body_param = req.body;

  // var phone_no_id = "107708638906499"
  // var from = "258843655568"

  if (body_param.object) {
    if (
      body_param.entry &&
      body_param.entry[0].changes //&&
      // body_param.entry[0].changes.value.messages &&
      // body_param.entry[0].changes.value.messages[0]
    ) {
      var changes = body_param.entry[0].changes[0].value;

      var phonenumber = changes.metadata.display_phone_number;
      var review = changes.messages
        .map((message) => message.text.body)
        .join("\n\n");
      var phone_id = changes.metadata.phone_number_id;

      sendMessage("Hello ", phonenumber, phone_id);

      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  }
});

async function sendMessage(message, to, phone_id) {
  var BASE_URL =
    "https://graph.facebook.com/v15.0/" +
    phone_id +
    "/messages?access_token=" +
    token;

  var data = {
    messaging_product: "whatsapp",
    to: "258843655568",
    type: "template",
    template: { name: "hello_world", language: { code: "en_US" } },
  };

  try {
    const response = await axios.post(BASE_URL, data);
  } catch (error) {
    console.log("Ohhhhhhhhhhh");
    console.error(error);
  }
}

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log("webhook is listening");
});
