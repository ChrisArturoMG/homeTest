const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
    host: 'ttplantas.eastus.cloudapp.azure.com:3306/',
    user: 'node',
    password: 'adam@22',
    database: 'tt_db'

    //host: 'mysql-chrismg.alwaysdata.net',
    //user: 'chrismg_chris',
    //password: 'Kcr@12345',
    //database: 'chrismg_project'

});

const resultado = async()=>{
    try {
        await mysqlConnection.connect(function(err){
            console.log("CONNECTED DB");
        });
        
    } catch (e) {
        console.log(e);
        throw new Error('No se pudo iniciar la base de datos');
    }
    
}
module.exports = {
    resultado, mysqlConnection
};