const express = require('express')
const app = express();
const dfff = require('dialogflow-fulfillment')
const jwt = require('jsonwebtoken')
const { mysqlConnection }= require('./database')
const {OAuth2Client} = require('google-auth-library');


const client = new OAuth2Client('1074458211545-57sn8sif1cu4sbib3fu7m0f16ge862en.apps.googleusercontent.com' );

async function verify(token) {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '1074458211545-57sn8sif1cu4sbib3fu7m0f16ge862en.apps.googleusercontent.com',  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  console.log(payload)
  return payload
}



app.post('/',express.json(),(req, res)=>{
  const agent = new dfff.WebhookClient({ request : req, response : res });
  
  try {
    const { user } = agent.request_.body.originalDetectIntentRequest.payload
    const { accessToken } = user;
    const  { planta } = agent.parameters;
    const usuario = verify(accessToken)
    //mysqlConnection.query('SELECT * FROM  usuario WHERE username = ? );', [ usuario.name ], rows = (err, rows, fields) =>{
//      if(rows.length === 0){
//        mysqlConnection.query('INSERT INTO usuario tokenGoogleHome =? );', [ accessToken ], rows = (err, rows, fields) =>{});
//      }     
      //if(rows.length!==0){
        const idBluetooth = '30:ae:a4:99:49:aa';
        mysqlConnection.query('SELECT * FROM lecturaNodo WHERE registerDate = (SELECT MAX(registerDate) FROM lecturaNodo WHERE idBluetooth = ? );', [ idBluetooth ], rows = (err, rows, fields) =>{  
          console.log('haciendo consulta')

          console.log(rows)

          dialogo = `${payload.name}
          Ire a reviar! listo! tu planta ${planta}, tiene de temperatura ${rows[0].temperatura}, vamos a ver que mas tenemos por aqui, veo que la humedad es de ${rows[0].humedad}%, vaya! interesante! la luz es de ${rows[0].luz} y el ph es de ${rows[0].ph}`;
          
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
//      } 
//  });
      } catch (error) {
      console.log(error)
    }
    
})

app.listen(process.env.PORT, ()=> console.log('server por el puerto 3333'))


