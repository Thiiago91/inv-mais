// sequelize.js
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('invmais', 'Th', '919191', {
  host: 'localhost',
  dialect: 'mysql'
});

sequelize.authenticate()
  .then(() => console.log('Conexão com o banco de dados estabelecida com sucesso.'))
  .catch(err => console.error('Erro ao conectar ao banco de dados:', err));

// Exporta a INSTÂNCIA do sequelize
module.exports = sequelize;
