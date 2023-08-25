// JWT
require("dotenv-safe").config();
const jwt = require('jsonwebtoken');
var { expressjwt: expressJWT } = require("express-jwt");
const cors = require('cors');

var cookieParser = require('cookie-parser')

const express = require('express');
const { usuario } = require('./models');

const app = express();

app.set('view engine', 'ejs');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static('public'));

app.use(cookieParser());
app.use(
  expressJWT({
    secret: process.env.SECRET,
    algorithms: ["HS256"],
    getToken: req => req.cookies.token
  }).unless({ path: ["/autenticar", "/logar", "/deslogar", "/usuarios/cadastrar"] })
);

app.get('/usuarios/listar', async function(req, res) {
  const usuarios = await usuario.findAll();
  res.render('listar', {registro: usuarios})
})

app.get('/usuarios/cadastrar', function(req, res){
  res.render('cadastrar');
})

app.post('/usuarios/cadastrar', async function(req,res){
  let {senha, csenha} = req.body;
  if(csenha == senha){
    const novoUsuario = await usuario.create(req.body);
    const id = novoUsuario.id;
    const token = jwt.sign({ id }, process.env.SECRET, { expiresIn: 300 });
    res.cookie('token', token, { httpOnly: true })
    res.redirect('/');
  } else(res.status(500).json({mensagem: 'As senhas inseridas não são iguais.'}))
})

app.get('/autenticar', async function(req, res){
  res.render('autenticar');
})

app.get('/', function(req, res){
  res.render('home');
})

app.post('/logar', async function(req, res) {
  const registro = await usuario.findAll();
  for(let i = 0; i < registro.length; i++){
    if(req.body.usuario == registro[i].usuario && req.body.senha == registro[i].senha){
      const id = registro[i].id;
      const token = jwt.sign({ id }, process.env.SECRET, { expiresIn: 300 });
      res.cookie('token', token, { httpOnly: true })
      return res.redirect('/')
    }
  }

  res.status(500).json({ message: 'Credenciais inválidas' })
})

app.post('/deslogar', function(req, res) {
  res.cookie('token', null, { httpOnly: true })
  res.redirect('/autenticar')
})

app.listen(3000, function() {
  console.log('App de Exemplo escutando na porta 3000!')
});