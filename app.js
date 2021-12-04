const express = require('express')
const app = express();
const dfff = require('dialogflow-fulfillment')

const { mysqlConnection, resultado }= require('./database')

resultado()

app.get('/', (req, res) =>{
  res.send('todo bien')
})

app.post('/',express.json(),(req, res)=>{
  res.send({
    "speech": "<speak> The weather in is <say-as interpret-as='number'> degrees Farenheit </say-as> </speak>",  // ASCII characters only
    "displayText": "The weather in  is ",
    "data": {
      "google": {
        "expect_user_response": true,
        "is_ssml": true,
        "permissions_request": {
          "opt_context": "...",
          "permissions": [
            "NAME",
            "DEVICE_COARSE_LOCATION",
            "DEVICE_PRECISE_LOCATION"
          ]
        }
      }
    }
  });
})

app.listen(process.env.PORT, ()=> console.log('server por el puerto 3333'))