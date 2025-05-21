const { DataTypes } = require('sequelize');
const sequelize = require('../src/database/sequelize'); // Caminho correto se sequelize.js estiver na raiz

const Investidor = sequelize.define('investidor', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  quantidade: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  preco: {
    type: DataTypes.FLOAT,
    allowNull: false
  }
});

module.exports = Investidor;
