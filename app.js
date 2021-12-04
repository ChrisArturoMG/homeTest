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


  
  const  demo = async (agent)=>{
    const  { planta } = agent.parameters;
    const idBluetooth = '30:ae:a4:99:49:aa';
    var lectura = {}; 
    

    await mysqlConnection.query('SELECT * FROM lecturaNodo WHERE registerDate = (SELECT MAX(registerDate) FROM lecturaNodo WHERE idBluetooth = ? );', [ idBluetooth ], (err, rows, fields) =>{
      
      if(rows.length !== 0){
        console.log(rows[0])
        lectura = { 
          "temperatura" : rows[0].temperatura,
          "luz" :  rows[0].luz,
          "humedad" : rows[0].humedad, 
          "ph" : rows[0].ph
        }
      }else{
        return console.log(' no se encontro')
      }
    });
    const dialogo = `Voy a revisar, listo, tu planta ${planta} tiene de temperatura ${lectura.temperatura}, de humedad ${lectura.humedad} y de luz ${lectura.luz}`;
      console.log(' INFORMACION ')
      agent.add( dialogo )
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