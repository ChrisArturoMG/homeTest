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

const obtenerIdPlanta = ( planta )=>{
  switch (planta) {
  
    case 'Chile':
      return 8;

    case 'Jitomate':
        return 9;

    case 'Rabano':
        return 10;

    case 'Zanahoria':
        return 11;

    case 'Cebolla':
        return 12;

    case 'Limon':
        return 13;

    case 'Higuera':
        return 14;

    case 'Acelga':
        return 15;

    case 'Brocoli':
        return 16;

    case 'Espinca':
        return 17;

    case 'Calabaza':
        return 18;
        
    case 'Frijol':
        return 19;

    case 'Fresa':
        return 20;
    
    case 'Zarzamora':
        return 21;
    case 'Girasol':
      return 3;

      case 'Lechuga':
        return 4;

        case 'Camote':
          return 7;

    default:
      break;
  }
}


app.post('/',express.json(), async (req, res)=>{
  const agent = new dfff.WebhookClient({ request : req, response : res });
  
  
  try {
    console.log(agent.parameters)

    const  lugar = agent.parameters.pos;
    const  { planta } = agent.parameters;
    console.log('VALORES DE PETICION ', planta,'  ', lugar)


    console.log(' planta ', planta)
    console.log(' lugar ', lugar)

    if(planta !== ''){
      const  demo =  (agent)=>{
        dialogo = ''
        dialogo = 'Hola Sebastian, voy a revisar! listo! tienes 1 para revisar: Camote 1, tiene de temperatura 24 °C, revisemos mas, veo que la humedad es de 35% y la luz es de 7790 lux. Ha sido un placer ayudarte.'

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
    }else{
      dialogo = ''
      dialogo = 'Hola Sebastian, voy a revisar, en tu Jardin tienes 1 por revisar. Tu Lechuga, tiene de temperatura 23°C, revisemos mas, veo que la humedad es de 65% y la luz es de 6456 lux. Ha sido un placer ayudarte.'

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

    }
  } catch (error) {
      console.log(error)
    }
    
})
app.listen(process.env.PORT, ()=> console.log('server por el puerto 3333'))
