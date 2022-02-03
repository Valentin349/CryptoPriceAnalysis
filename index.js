const express = require('express');
const fetch = require('node-fetch');

// urls
const listURL = new URL("https://api.coingecko.com/api/v3/coins/list");
const pricesURL = new URL("https://api.coingecko.com/api/v3/simple/price");

// server
const app = express();
const port = process.env.PORT || 5555;
app.listen(port, () => {
    console.log(`Server running at ${port}`)
});
app.use(express.static('public'));

// global vars
var coins = {};

async function getData(url, parameters={}) {
    for (var param in parameters){
        url.searchParams.set(param, parameters[param]);
    }
    try{
        const response = await fetch(url);
        return await response.json();
    } catch(error) {
        console.error(error);
    }
}

async function getCoins(){
    var idStrings = [''];
    var pages = 0;
    var counter = 0;

    await getData(listURL).then(data =>{
        for (var coin in data){
            if (counter > 450){
                counter = 0;
                pages++;
                idStrings.push('');
            }
            idStrings[pages] = String(idStrings[pages]).concat(data[coin].id,',');
            coins[data[coin].id] = [];
            counter++;
        }
    })
    return idStrings;
}

function getPrices(idStrings, coins){
    var promises = [];
    for (var page in idStrings){
        promises.push(getData(pricesURL, {'vs_currencies': 'usd', 'ids':idStrings[page]}));
    }
    Promise.all(promises).then(pages => {
        for (var page in pages){
            var data = pages[page];
            for (var coin in data){
                coins[coin].push(data[coin].usd);
            }
        }
    });
}

function main(){
    getCoins().then(idStrings => {
        getPrices(idStrings, coins);
        setInterval(() => {
            getPrices(idStrings, coins);
        }, 300000);
    });
}

// routes
app.get('/api', (req, res) => {
    res.json(coins);
});

app.get('/favicon.ico', (req, res) => res.status(204));

main();