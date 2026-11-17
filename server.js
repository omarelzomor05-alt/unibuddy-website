const express = require('express');
const cors = require('cors');
const dialogflow = require('@google-cloud/dialogflow');
const crypto = require('crypto');
const uuid = { v4: () => crypto.randomUUID() };

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Replace 'YOUR-PROJECT-ID' with your Dialogflow Project ID from Agent Settings
const PROJECT_ID = 'unibuddy-project'; 

app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;
  const sessionId = uuid.v4();

  try {
    // Connect to Dialogflow using your downloaded service account JSON key
    const sessionClient = new dialogflow.SessionsClient({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON)
});
    
const sessionPath = sessionClient.projectAgentSessionPath('unibuddy-bbgf', sessionId);
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: userMessage,
          languageCode: 'en-US',
        },
      },
    };

    const responses = await sessionClient.detectIntent(request);
    const result = responses[0].queryResult;

    res.json({ reply: result.fulfillmentText });
  } catch (error) {
    console.error("Dialogflow Error:", error);
    res.json({ 
      reply: `⚠️ Backend connected, but Dialogflow key is missing. (Received: "${userMessage}")` 
    });
  }
});

module.exports = app;

