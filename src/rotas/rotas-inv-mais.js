const express = require('express');
const router = express.Router();
const Investidor = require('../../models/investidor');

router.post('/cadastrar', async (req, res) => {
  try {
    await Investidor.create({
      nome: req.body.nome,
      email: req.body.email,
      telefone: req.body.telefone,
      cpf: req.body.cpf,
    });
    res.send('Investidor cadastrado com sucesso!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro ao cadastrar investidor');
  }
});

module.exports = router;
