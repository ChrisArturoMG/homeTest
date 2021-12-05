const express = require('express')
const app = express();
const dfff = require('dialogflow-fulfillment')
const jwt = require('jsonwebtoken')
const { mysqlConnection }= require('./database')

app.post('/',express.json(),(req, res)=>{
  const agent = new dfff.WebhookClient({ request : req, response : res });
  
  try {
    const { user } = agent.request_.body.originalDetectIntentRequest.payload
    
    const { accessToken } = user;
    const usuario = jwt.verify(accessToken, 'secret')
    console.log(usuario)

    const  { planta } = agent.parameters;
  
      const idBluetooth = '30:ae:a4:99:49:aa';
      const datos = mysqlConnection.query('SELECT * FROM lecturaNodo WHERE registerDate = (SELECT MAX(registerDate) FROM lecturaNodo WHERE idBluetooth = ? );', [ idBluetooth ], rows = (err, rows, fields) =>{  
        console.log('haciendo consulta')
           dialogo = ` Hola 
           Voy a revisar! listo! tu planta ${planta}, tiene de temperatura ${rows[0].temperatura}, vamos a ver que mas tenemos por aqui, veo que la humedad es de ${rows[0].humedad}%, vaya! interesante! la luz es de ${rows[0].luz} y el ph es de ${rows[0].ph}`;
           
           console.log(dialogo)
           
           const  demo =  (agent)=>{
             return agent.add( dialogo );
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
      
    } catch (error) {
      console.log(error)
    }
    
})

app.listen(process.env.PORT, ()=> console.log('server por el puerto 3333'))


