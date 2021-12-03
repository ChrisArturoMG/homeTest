const express = require('express')
const app = express();

const dfff = require('dialogflow-fulfillment')

app.get('/', (req, res) =>{
  res.send('todo bien')
})

app.post('/',express.json(),(req, res)=>{
  const agent = new dfff.WebhookClient({
    request : req,
    response : res
  });

  function demo(agent){
    agent.add(' Enviando respuesta desde el server ')
  }

  function customPayloadDemo(agent){
    var payloadData = {
      "richContent":[
        [
          {
            "type" : "accordion",
            "title": "Accordion title",
            "subtitle": "Accordion subtitle",
            "image" : {
              "src": {
                "rawUrl": "https://example.com/images/logo.png"
              }
            },
            "text": "According text"
          }
        ]
      ]
    }
    agent.add( new dfff.Payload(platform.UNSPECIFIED, payloadData, { sendAsMessage: true, rawPayload: true}))
  }

  var intentMap = new Map();
  intentMap.set('demo', demo);
  intentMap.set('customPayloadDemo', customPayloadDemo)

  agent.handleRequest(intentMap)
})

app.listen(process.env.PORT, ()=> console.log('server por el puerto 3333'))