const listURL = new URL("https://api.coingecko.com/api/v3/coins/list");
const pricesURL = new URL("https://api.coingecko.com/api/v3/simple/price");
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
    var counter = 0;
    var idStrings = [''];
    var ids = [];
    var pages = 0;

    await getData(listURL).then(data =>{
        for (var coin in data){
            if (counter > 450){
                counter = 0;
                pages++;
                idStrings.push('');
            }
            idStrings[pages] = String(idStrings[pages]).concat(data[coin].id,',');
            ids.push(data[coin].id);
            counter++;
        }
        ids.forEach(function(v){
            coins[v] = [];
        });
    })
    return idStrings;
}

async function getPrices(idStrings){
    var promises = [];
    idStrings.then(idString => {
        for (var page in idString){
            promises.push(getData(pricesURL, {'vs_currencies': 'usd', 'ids':idString[page]}));
        }
    }).then(() => {
        Promise.all(promises).then(pages => {
            for (var page in pages){
                var data = pages[page];
                for (var coin in data){
                    coins[coin].push(data[coin].usd);
                }
            }
        });
    })
    return coins;
}

var idStrings = getCoins();
coins = getPrices(idStrings);