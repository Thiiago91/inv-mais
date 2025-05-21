const sequelize = require('./sequelize'); // caminho para seu sequelize.js
const Investidor = require('./models/investidormais'); // caminho correto

sequelize.sync({ force: false }) // use { force: true } só se quiser recriar a tabela sempre
  .then(() => {
    console.log('Tabela sincronizada com sucesso.');
  })
  .catch((err) => {
    console.error('Erro ao sincronizar tabela:', err);
  });
