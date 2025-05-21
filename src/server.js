const express = require('express');
const bodyParser = require('body-parser');
const rotasInvMais = require('./rotas/rotas-inv-mais');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // se seu HTML estiver em /public
app.use(rotasInvMais);

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});
