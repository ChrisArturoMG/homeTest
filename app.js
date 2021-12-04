const express = require('express')
const app = express();
const dfff = require('dialogflow-fulfillment')

const { mysqlConnection }= require('./database')

app.post('/',express.json(),(req, res)=>{
  //mysqlConnection.query('SELECT * FROM lecturaNodo WHERE registerDate = (SELECT MAX(registerDate) FROM lecturaNodo WHERE idBluetooth = 30:ae:a4:99:49:aa'), (err, rows, fields) => {});
  
  const agent = new dfff.WebhookClient({
    request : req,
    response : res
  });
  
  const  demo =  (agent)=>{
    const  { planta } = agent.parameters;
    const idBluetooth = '30:ae:a4:99:49:aa';
    let temp, hum, luz, ph;

    let dialogo;

    try {
      const datos = mysqlConnection.query('SELECT * FROM lecturaNodo WHERE registerDate = (SELECT MAX(registerDate) FROM lecturaNodo WHERE idBluetooth = ? );', [ idBluetooth ], rows = (err, rows, fields) =>{  
          try {
          console.log('haciendo consulta')
           dialogo = `Voy a revisar, listo, tu planta ${planta} tiene de temperatura ${rows[0].temperatura}`;
           console.log(dialogo)

          } catch (error) {
            console.log(error)  
          }
      });
    } catch (error) {
      console.log(error)
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