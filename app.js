const express = require('express')
const app = express();
const dfff = require('dialogflow-fulfillment')

const { mysqlConnection, resultado }= require('./database')

resultado()

app.get('/', (req, res) =>{
  res.send('todo bien')
})

app.post('/',express.json(),(req, res)=>{
  const agent = new dfff.WebhookClient({
    request : req,
    response : res
  });


  
  const  demo = (agent)=>{
    const  { planta } = agent.parameters;
    const idBluetooth = '30:ae:a4:99:49:aa'

    mysqlConnection.query('SELECT * FROM lecturaNodo WHERE registerDate = (SELECT MAX(registerDate) FROM lecturaNodo WHERE idBluetooth = ? );', [ idBluetooth ], (err, rows, fields) =>{
    

      console.log(err)

      if(rows.length !== 0){
        return console.log(' no se encontro')
    }
  
        console.log(rows[0])
        const lectura = { 
          "temperatura" : rows[0].temperatura,
          "luz" :  rows[0].luz,
          "humedad" : rows[0].humedad, 
          "ph" : rows[0].ph
        }
    
        const dialogo = `Voy a revisar, listo, tu planta ${planta} tiene de temperatura ${lectura.temperatura}, de humedad ${lectura.humedad} y de luz ${lectura.luz}`;
        console.log(' INFORMACION ')
        agent.add( dialogo )
    });

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