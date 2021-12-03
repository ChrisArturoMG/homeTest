const express = require('express')
const app = express();

app.get('/', (req, res) =>{
  res.send('todo bien')
})

app.listen( ()=> console.log('server por el puerto 3333'))