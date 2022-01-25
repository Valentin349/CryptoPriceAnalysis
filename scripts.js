const listURL = "https://api.coingecko.com/api/v3/coins/list"
const pricesURL = "https://api.coingecko.com/api/v3/simple/price"
var coins = []

async function getData(url, parameters="") {
    try{
    const response = await fetch(url.concat(parameters));
    return await response.json();
    } catch(error) {
        console.error(error);
    }
}

function getCoinNames(){
    var counter = 0;
    var pages = 0;
    var idStrings = [''];
    var ids = [];

    getData(listURL).then(data =>{
        for (var coin in data){
            if (counter > 450){
                counter = 0;
                pages++;
                idStrings.push("");
            }
            idStrings[pages] = String(idStrings[pages]).concat(data[coin].id,',');
            ids.push(coin.id);
            counter++;
        }
        // create price diff object bellow
    })
    
}

getCoinNames();
