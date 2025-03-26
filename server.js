const express = require("express");
const AWS = require("aws-sdk");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

AWS.config.update({
  region: "us-east-1"
});

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const EVENTS_TABLE = "Events";
const REGISTRATIONS_TABLE = "Registrations";

// Get all events
app.get("/events", async (req, res) => {
  const params = { TableName: EVENTS_TABLE };
  const data = await dynamoDB.scan(params).promise();
  res.json(data.Items);
});

// Register for an event
app.post("/register", async (req, res) => {
  const { EventID, UserID, UserName } = req.body;
  
  const params = {
    TableName: REGISTRATIONS_TABLE,
    Item: { EventID, UserID, UserName }
  };
  
  await dynamoDB.put(params).promise();
  res.json({ message: "Registered successfully!" });
});

// Start Server
app.listen(3000, () => console.log("Server running on port 3000"));
