const express = require('express');
const server = express();
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("./db.sqlite");

let id_problemas = 1;
let id_score = 1;
let id_desafio = 1;

const port = process.env.PORT || 3000;
server.use(express.json());

let listaTabela = [];

//usando promisse para busca assincrona
function buscarTabela(tabela){
    
    return new Promise((resolve, reject) => { 
    db.all(`SELECT * FROM ${tabela}`, (err, rows) => {
        if(rows){
            rows.forEach((row) =>{
                if(tabela == "problems"){
                    listaTabela = [{
                        "problem": row.problem,
                        "description": row.description,
                        "correctWords": row.correctWords,
                        "randomWords": row.randomWords,
                        "xp": row.xp,
                        "level": row.level,
                        "lock": row.lock,
                        "completed": row.completed
                    }]
                } 
                else if(tabela == "desafio"){
                    listaTabela = [{
                        "id": row.id,
                        "id_problem": row.id
                    }]
                }
                else if(tabela == "score"){
                    listaTabela = [{
                        "id": row.id,
                        "id_usuario": row.id_usuario,
                        "totalXp": row.totalXp
                    }]
                }
            })
        }else{
            reject("Vazio")
        }
    })
    resolve(listaTabela);
    })
}

server.get("/problemas",(req, res)=>{
    buscarTabela("problems").then((data) => res.json(listaTabela))
})

server.get("/score",(req, res)=>{
    buscarTabela("score").then((data) => res.json(listaTabela))
})

server.get("/desafio",(req, res)=>{
    buscarTabela("desafio").then((data) => res.json(listaTabela))
})

//pagina html
server.get("/",(req, res)=>{
    res.sendFile(__dirname + "/index.html");
})

server.post('/CriarProblema', (req, res)=>{
    const 
    {   
        problem, 
        description, 
        correctWords, 
        randomWords, 
        xp, 
        level,
        lock,
        completed
    } = req.body;

    id_problemas++;

     db.run(`INSERT INTO problems (id, problem, description, correctWords, randomWords, xp, level, lock, completed) 
        VALUES (${id_problemas},'${problem}' , '${description}' , '${correctWords}' , '${randomWords}' , ${xp} , '${level}', '${lock}', '${completed}')`);

    buscarTabela("problems").then((data) => res.json(listaTabela))
});

server.post('/CriarScore', (req, res)=>{
    const {id_usuario, totalXp} = req.body;
    id_score++;
    db.run(`INSERT INTO score (id_usuario, id, totalXp) VALUES (${id_usuario},${id_score}, ${totalXp})`);
    buscarTabela("score").then((data) => res.json(listaTabela))
});

//vincular um problema a um desafio pelo id;
server.post('/CriarDesafio', (req, res)=>{
    const {id_problem} = req.body;
    id_desafio++;
    db.run(`INSERT INTO desafio (id, id_problem) VALUES (${id_desafio},${id_problem})`);
    buscarTabela("desafio").then((data) => res.json(listaTabela))
});

//atualizando o score
server.put('/score/:index',(req,res)=>{
    const {index} = req.params;
    const {totalXp} = req.body;

    db.run(`UPDATE score SET totalXp = ${totalXp} WHERE id_usuario = ${index}`);
    buscarTabela("score").then((data) => res.json(listaTabela))
});

//delete um problema
server.delete('/problema/:index',(req,res)=>{
    const {index} = req.params;
    db.run(`DELETE FROM problems WHERE id = ${index}`);

    buscarTabela("problems").then((data) => res.json("deletado"))
})

server.listen(port,()=>{
    console.log("servidor rodando na porta "+ port);
});


