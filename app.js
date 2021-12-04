const express = require('express')
const app = express();
const dfff = require('dialogflow-fulfillment')


const { mysqlConnection, resultado }= require('./database')

resultado()


const revisar = async ()=>{
  const idBluetooth = '30:ae:a4:99:49:aa';
  const datos = await mysqlConnection.query('SELECT * FROM lecturaNodo WHERE registerDate = (SELECT MAX(registerDate) FROM lecturaNodo WHERE idBluetooth = ? );', [ idBluetooth ], rows = (err, rows, fields) =>{    
    console.log('revision de datos')
    return new Promise( resolve => { rows[0]} )
    });  
}

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
    let temp, hum, luz, ph;
    let rows;
    try {
    
    console.log(await revisar())

    } catch (error) {
      console.log(error)
    }
    
    console.log('se revisaron tus plantas')
    dialogo = `Voy a revisar, listo, tu planta `;//${planta} tiene de temperatura ${rows[0].temperatura}`;
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

app.listen(process.env.PORT || 8080, ()=> console.log('server por el puerto ' + process.env.PORT))