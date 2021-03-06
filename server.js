const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')



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
  
    
    database.users.push({
      id: '125',
      name: name,
      email: email,
      password: password,
      entries: 0,
      joined: new Date()
    })
    res.json(database.users[database.users.length - 1])
  })

app.get('/profile/:id',(req,res)=>{
    const { id } = req.params;
    let found = false;
    data.forEach(user => {
        if (user.id === id ){
            found = true;
            return res.json(user);
        }
     })
     if (!found ){
            res.status(404).json("user not found");
     }
})

app.put('/image', (req,res)=>{
    const { id } = req.body;
    console.log('1',req.body)
    let found = false;
    data.forEach(user => {
        if (user.id === id ){
            found = true;
            user.entries++ 
            return res.json(user.entries);
        }
     })
     if (!found ){
            res.status(404).json("user not found");
     }

})
app.listen(3000,()=>
console.log("app is listening port 3000"))
