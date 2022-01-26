const listURL = new URL("https://api.coingecko.com/api/v3/coins/list");
const pricesURL = new URL("https://api.coingecko.com/api/v3/simple/price");
var coins = {};



async function getData(url, parameters={}) {
    try{
        const response = await fetch(url);
        return await response.json();
    } catch(error) {
        console.error(error);
    }
}

function getCoins(){
    var counter = 0;
    var idStrings = [''];
    var ids = []
    var pages = 0;

    getData(listURL).then(data =>{
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

        getPrices(idStrings);
    })
    console.log(pages);
}

function getPrices(idStrings){
    const time = Date.now();
    console.log(idStrings[0]);
    idStrings.forEach(page => {
        getData(pricesURL, {'vs_currencies': 'usd', 'include_last_updated_at': 'true', 'ids':page}).then(data => {

        })
    })
}

getCoins();
