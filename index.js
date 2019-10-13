const dotenv = require('dotenv');
dotenv.config();

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

app.listen(8000, ()=>{ console.log("server start success") })