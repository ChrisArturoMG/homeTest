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
    default:
      break;
  }
}


app.post('/',express.json(), async (req, res)=>{
  const agent = new dfff.WebhookClient({ request : req, response : res });
  
  try {
    const  { planta } = agent.parameters;
    const  { lugar } = agent.parameters;


    console.log(' planta ', planta)
    console.log(' lugar ', lugar)

    if(planta !== ''){
      console.log('planta...')
      const { user } = agent.request_.body.originalDetectIntentRequest.payload
      const { accessToken } = user;
      const payload = await  verify(accessToken);
  
      const idPlanta = obtenerIdPlanta(planta);
  
      mysqlConnection.query('SELECT * FROM  usuario WHERE username = ?', [ payload.given_name ],  (err, usuario, fields) =>{
        if(err) {return console.log(err)};
  
        if(usuario.length !== 0){
  
            mysqlConnection.query('SELECT * FROM nodoCentral WHERE IdUsuario = ?', [ usuario[0].idUsuario ],  (err, nodos, fields) =>{  

              for (let i = 0; i < nodos.length; i++) {
                if(nodos[i].IdPlanta !== idPlanta){
                  nodos.splice(i, 1)
                  console.log('se elimino algo que no es ', planta)
                  i=-1;
                }
              }
              
              query = 'SELECT * FROM lecturaNodo WHERE registerDate = (SELECT MAX(registerDate) FROM lecturaNodo WHERE';
  
              for (let i = 0; i < nodos.length; i++) {
                if(i !== nodos.length-1){
                  query = query + ` idBluetooth = '` + nodos[i].IdBluetooth + `' OR `;
                }else{
                  query = query + ` idBluetooth = '` + nodos[i].IdBluetooth + `' ); `; 
                }
              }
  
              console.log('este es el QUERY ' ,   query)
  
            mysqlConnection.query((query), (err, rows, fields) =>{  

              if(rows.length !== 0 ){
                console.log('haciendo consulta')
                dialogo = `Hola ${usuario[0].username}, Voy a revisar! listo! tienes ${rows.length} para revisar.`; 
                
                for (let i = 0; i < rows.length; i++) {
                  dialogo = dialogo +  ` 
                  El ${planta} ${ i+1 }, tiene de temperatura ${rows[i].temperatura}, 
                  revisemos mas, veo que la humedad es de ${rows[i].humedad}% y  
                  la luz es de ${rows[0].luz}`;
                }
                
                dialogo = dialogo +  `. Ha sido un placer ayudarte`;
    
                console.log(dialogo)
              }

              
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
    }else{
      let dialogo;
      console.log('lugar...')
      const { user } = agent.request_.body.originalDetectIntentRequest.payload
      const { accessToken } = user;
      const payload = await  verify(accessToken);
  
      const idPlanta = obtenerIdPlanta(planta);
  
      mysqlConnection.query('SELECT * FROM  usuario WHERE username = ?', [ payload.given_name ],  (err, usuario, fields) =>{
        if(err) {return console.log(err)};
  
        if(usuario.length !== 0){
  
            mysqlConnection.query('SELECT * FROM nodoCentral WHERE IdUsuario = ? AND nodeName = ? INNER JOIN planta ON nodoCentral.IdPlanta = planta.idPlant', [ usuario[0].idUsuario, lugar ],  (err, nodos, fields) =>{  
  
              for (let i = 0; i < nodos.length; i++) {
                if(nodos[i].nodeName !== lugar){
                  nodos.splice(i, 1)
                  console.log('se elimino algo que no es ', lugar)
                  i=-1;
                }
              }
              
              query = 'SELECT * FROM lecturaNodo WHERE registerDate = (SELECT MAX(registerDate) FROM lecturaNodo WHERE';
  
              for (let i = 0; i < nodos.length; i++) {
                if(i !== nodos.length-1){
                  query = query + ` idBluetooth = '` + nodos[i].IdBluetooth + `' OR `;
                }else{
                  query = query + ` idBluetooth = '` + nodos[i].IdBluetooth + `' INNER JOIN planta ON IdPlanta = idPlant); `; 
                }
              }
  
              console.log('este es el QUERY ' ,   query)
  
            mysqlConnection.query((query), (err, rows, fields) =>{
              if(rows !== undefined ){
              
              console.log('mira esto ', rows)

                console.log('haciendo consulta')
                dialogo = `Hola ${usuario[0].username}, Voy a revisar, en tu ${ lugar } tienes ${rows.length} por revisar.`; 
                
                for (let i = 0; i < rows.length; i++) {
                  dialogo = dialogo +  ` 
                  Tu ${ planta } ${ i+1 }, tiene de temperatura ${rows[i].temperatura}, 
                  revisemos mas, veo que la humedad es de ${rows[i].humedad}%, 
                  la luz es de ${rows[0].luz} 
                  y el ph es de ${rows[0].ph}.`;
                }
                
                dialogo = dialogo +  `. Ha sido un placer ayudarte`;
    
                console.log(dialogo)
              }else{
                dialogo = `No tienes nodos en ese lugar`;
              }
              
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



    }
  
  
  
  
  } catch (error) {
      console.log(error)
    }
    
})
app.listen(process.env.PORT, ()=> console.log('server por el puerto 3333'))