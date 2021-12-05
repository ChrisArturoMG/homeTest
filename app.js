'use strict';

const bodyParser = require('body-parser');
const {
    SignIn,
    Suggestion,
    dialogflow
} = require('actions-on-google');
const express = require('express');
const df = dialogflow({
    clientId: '597873273572-aogl07fq5do26b81v4fb0tk9cg31sqkd.apps.googleusercontent.com.apps.googleusercontent.com',

})
const app = express();
// you can change the app port here
app.listen(process.env.PORT, ()=> console.log('server por el puerto 3333'))


app.use(bodyParser.json());

// Register handlers for Dialogflow intents

// if 'Default Welcome Intent' has enabled webhook response
df.intent('Default Welcome Intent', (conv) => {
    conv.ask("Welcome to Sign in intent project");
});

// this function will initiate signup process
df.intent("sign-up", (conv, params, signin) => {
    conv.ask(new SignIn('This is signup Test'));
    console.log('after agent adding');
});

// this will be called after the signup event get completed verify here
df.intent("after-sign-up", conv => {
    const payload = conv.user.raw.accessToken;
    console.log(JSON.stringify(conv.user.raw, null, 2));
    console.log('Accesstoken is => ' + conv.user.raw.accessToken);
    if (conv.user.raw.accessToken) {
        conv.ask('You are successfully signed in.');
    } else {
        conv.ask("Not signed in yet.");
        conv.ask(new Suggestion("want to sign in"));
    }
});

// if 'Default Fallback Intent' has enabled webhook response
df.intent('Default Fallback Intent', conv => {
    conv.ask(`I didn't understand. Can you tell me something else?`)
});
app.post('/', df);

// Start up the server
app.listen(app.get('port'), function () {
    console.log('running on port', app.get('port'));
    console.log('Type \'ngrok http ' + app.get('port') + '\' in new terminal');
});

/*const express = require('express')
const app = express();
const dfff = require('dialogflow-fulfillment')

const { mysqlConnection }= require('./database')

app.get('/verficar', (req, res) =>{

  console.log("////////////////VERFICAR FUNCIONA/////////////////////////")
})

app.post('/',express.json(),(req, res)=>{
  const agent = new dfff.WebhookClient({ request : req, response : res });
  
  try {

    const { user } = agent.request_.body.originalDetectIntentRequest.payload

    console.log('informacion del usuario ', user)

    console.log(agent)

    const  { planta } = agent.parameters;
  
      const idBluetooth = '30:ae:a4:99:49:aa';
      const datos = mysqlConnection.query('SELECT * FROM lecturaNodo WHERE registerDate = (SELECT MAX(registerDate) FROM lecturaNodo WHERE idBluetooth = ? );', [ idBluetooth ], rows = (err, rows, fields) =>{  
        console.log('haciendo consulta')
           dialogo = `Voy a revisar! listo! tu planta ${planta}, tiene de temperatura ${rows[0].temperatura}, vamos a ver que mas tenemos por aqui, veo que la humedad es de ${rows[0].humedad}%, vaya! interesante! la luz es de ${rows[0].luz} y el ph es de ${rows[0].ph}`;
           
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



*/