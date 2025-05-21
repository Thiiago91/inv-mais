const Sequelize = require('sequelize');
const sequelize = new Sequelize('podtsapp', 'Th', '919191', {
    host: 'localhost',
    dialect: 'mysql',
});

sequelize.authenticate().then(function() {
    console.log('Conexão com o banco de dados estabelecida com sucesso.');
}).catch(function(err) {
    console.log('Erro ao conectar ao banco de dados: ' + err);
});

module.exports = sequelize;