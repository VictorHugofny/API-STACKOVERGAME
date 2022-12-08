const express = require('express');
const server = express();

const port = process.env.PORT || 3000
server.use(express.json());

//Listar pessoas
server.get("/perguntas",(req, res)=>{
    res.sendFile(__dirname + "/dados.json");
})

server.get("/",(req, res)=>{
    res.sendFile(__dirname + "/index.html");
})

// server.post('/perguntas:enviar', async (req, res)=>{  
// })        

server.listen(port,()=>{
    console.log("servidor rodando na porta "+ port);
});
