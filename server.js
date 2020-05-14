const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex')
const bcrypt = require('bcrypt');
const saltRounds = 10;

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : '0000',
    database : 'smart-brain'
  }
});

const app = express();
app.use(bodyParser.json());
app.use(cors())

const database = {
    users: [{
        id: '123',
        name: 'John',
        email: 'j',
        password:'1',
        entries: 0,
        joined: new Date()
      },

      {
        id: '124',
        name: 'sally',
        email: 's',
        password:'1',
        entries: 0,
        joined: new Date()
        }],
}

let data = database.users

app.get('/',(req,res)=>{
        res.send(data)
})

app.post('/signin', (req, res) => {
        if (req.body.email === data[0].email && 
        req.body.password === data[0].password){
    res.json(data[0]);}
    else{
        res.status(400).json("user or password incorrect")
    }
  })
app.post('/register', (req, res) => {
    const {email, name , password } = req.body;
    const hash = bcryptbcrypt.hashSync(password, saltRounds);
      db.transaction(trx => {
        trx.insert({
          hash: hash,
          email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail =>{
          return trx('users')
            .returning('*')
            .insert({
              email:loginEmail,
              name:name,
              joined:new Date()
            })
          .then(user => {
            res.json(user[0]);
          }) 
          .then(trx.commit)
          .catch(trx.rollback)
        })
      })
      
        
  .catch(err => res.status(400).json('unable to register'))
})
app.get('/profile/:id',(req,res)=>{
    const { id } = req.params;
      db.select('*').from('users').where({id}).then(user => {
      if(user.length){
      res.json(user[0])}
      else{
        res.json.status(400)('User not found')
      }
  })
        .catch(err => res.status(400).json("error getting user"));
})

app.put('/image', (req,res)=>{
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries',1)
    .returning('entries')
    .then(entries => {
      res.json(entries[0])
    })
    .catch(err => res.status(400).json('unable to get entries'))

})
app.listen(3000,()=>
console.log("app is listening port 3000"))
