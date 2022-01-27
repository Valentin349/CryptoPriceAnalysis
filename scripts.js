const listURL = new URL("https://api.coingecko.com/api/v3/coins/list");
const pricesURL = new URL("https://api.coingecko.com/api/v3/simple/price");


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
    var coins = {};
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
    return {idStrings, coins};
}

async function getPrices(idStrings, coins){
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
    }).then(() => {
        var i = 1;
        var dataHtml = '';
        for (var coin in coins){
            if (i<500){
                dataHtml += `<tr><td>${i}</td><td>${coin}</td><td>${coins[coin].at(-1)}</td></tr>`;
            }
            i++;
        }
        document.getElementById('cryptocurrencies').innerHTML = dataHtml;
    }
    );
}


getCoins().then(data =>{
    getPrices(data.idStrings, data.coins);
});


