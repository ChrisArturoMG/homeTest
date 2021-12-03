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

  var intentMap = new Map();
  intentMap.set('demo', demo)

  agent.handleRequest(intentMap)
})

app.listen(process.env.PORT, ()=> console.log('server por el puerto 3333'))