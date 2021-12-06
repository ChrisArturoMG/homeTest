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
    
    default:
      break;
  }
}


app.post('/',express.json(), async (req, res)=>{
  const agent = new dfff.WebhookClient({ request : req, response : res });
  
  try {
    const { user } = agent.request_.body.originalDetectIntentRequest.payload
    const { accessToken } = user;
    const  { planta } = agent.parameters;
    const payload = await  verify(accessToken);

    const idPlanta = obtenerIdPlanta(planta);

    mysqlConnection.query('SELECT * FROM  usuario WHERE username = ?', [ payload.given_name ],  (err, usuario, fields) =>{
      if(err) {return console.log(err)};

      if(usuario.length !== 0){
        console.log("datos de usuario " , usuario[0].idUsuario)

          mysqlConnection.query('SELECT * FROM nodoCentral WHERE IdUsuario = ?', [ usuario[0].idUsuario ],  (err, nodos, fields) =>{  

            for (let i = 0; i < nodos.length; i++) {
              if(nodos[i].IdPlanta !== idPlanta){
                nodos.splice(i, 1)
                console.log('se elimino algo que no es un limon')
                i=-1;
              }
            }
            
            query = 'SELECT * FROM lecturaNodo WHERE registerDate = (SELECT MAX(registerDate) FROM lecturaNodo WHERE';

            for (let i = 0; i < array.length; i++) {
              if(i !== array.length){
                query = query + ' idBluetooth = ' + array.IdBluetooth + ' OR ';
              }else{
                query = query + ' idBluetooth = ' + array.IdBluetooth + ' ; '; 
              }
            }

            console.log('este es el QUERY ' ,   query)

          mysqlConnection.query(query), (err, rows, fields) =>{  
            console.log('haciendo consulta')
            console.log(rows)
            dialogo = `Hola ${usuario[0].username}, Voy a revisar! listo! tu planta ${planta}, tiene de temperatura ${rows[0].temperatura}, vamos a ver que mas tenemos por aqui, veo que la humedad es de ${rows[0].humedad}%, vaya! interesante! la luz es de ${rows[0].luz} y el ph es de ${rows[0].ph}`;
            
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