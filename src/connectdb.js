const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',      
  user: 'thiiago91',    
  password: '919191',  
  database: 'podtsapp', 
});
connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados: ' + err.stack);
    return;
  }
  console.log('Conectado ao banco de dados como ID ' + connection.threadId);
});

module.exports = connection;