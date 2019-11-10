require('dotenv').config();
const express = require('express');
const {explain} = require("./library/YouDaoExplain")

let app = express();

app.use("/voices", express.static('./voices'));

app.get('/', (req, res) => {
    res.end('<h1>hello world</h1>')
});

app.get('/word', async (req, res) => {

    if (req.query.q === undefined) {
        res.sendStatus(400)
        return;
    }

    try {
        let info = await explain(req.query.q)
        res.send({message: 'success', data: {explain: info, voice: `/voices/${req.query.q}.mp3`}})
        res.end()
    } catch (e) {
        res.sendStatus(404)
        console.log(e.message)
    }
});

/*
create table wordList (
    id int primary key auto_increment,
    name varchar(64) not null default '',
    remark varchar(255) not null default ''
) 

create table wordElements (
    id int primary key auto_increment,
    word varchar(64) not null default '',
)

create table wordListElements (
    id int primary key auto_increment,
    list_id int not null default 0,
    element_id int not null default 0
)

create table wordElementLists (
    id int primary key auto_increment,
    element_id int not null default 0,
    list_id int not null default 0
)

create table wordExplains (

)


 */
app.get('/lists', async (req, res) => {})

app.post('/lists', async(req, res) => {})

app.put('/lists/{id}', async(req, res) => {})

app.delete('/lists/{id}', async(req, res) => {})

app.get('/lists/words', async(req, res) => {})

app.post('/list/words', async(req, res) => {})

app.get('/lists/words/{$id}', async(req, res) => {})

app.delete('/list/words/{id}', async(req, res) => {})

app.listen(8000, ()=>{ console.log("server start success") })