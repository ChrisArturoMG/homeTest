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
  return payload
}
app.post('/',express.json(), async (req, res)=>{
  const agent = new dfff.WebhookClient({ request : req, response : res });
  
  try {
    const { user } = agent.request_.body.originalDetectIntentRequest.payload
    const { accessToken } = user;
    const  { planta } = agent.parameters;
    const payload = await  verify(accessToken)
    mysqlConnection.query('SELECT * FROM  usuario WHERE username = ?', [ payload.given_name ],  (err, usuario, fields) =>{
      if(err) {return console.log(err)};

      console.log("datos de usuario " , usuario[0].idUsuario)
      if(rows.length !== 0){
          const idBluetooth = '30:ae:a4:99:49:aa';
          mysqlConnection.query('SELECT * FROM nodoCentral WHERE IdUsuario = ?', [ usuario[0].idUsuario ],  (err, nodos, fields) =>{  
          console.log(' tus nodos  ',  nodos)
          
          mysqlConnection.query('SELECT * FROM lecturaNodo WHERE registerDate = (SELECT MAX(registerDate) FROM lecturaNodo WHERE idBluetooth = ? );', [ idBluetooth ],  (err, rows, fields) =>{  
            console.log('haciendo consulta')
            console.log(rows)
            dialogo = `Hola ${usuario[0].username} 
            Ire a revisar! listo! tu planta ${planta}, tiene de temperatura ${rows[0].temperatura}, vamos a ver que mas tenemos por aqui, veo que la humedad es de ${rows[0].humedad}%, vaya! interesante! la luz es de ${rows[0].luz} y el ph es de ${rows[0].ph}`;
            
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
            });
          });
      }     
    });
//      } 
//  });
      } catch (error) {
      console.log(error)
    }
    
})
app.listen(process.env.PORT, ()=> console.log('server por el puerto 3333'))