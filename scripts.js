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
    }).then(() => {
        updateTable();
    });
}

function updateTable(){
    var coinList = [];
        var dataHtml = '';
        console.log(coins);
        for (var coin in coins){
            if (coins[coin].at(-1) != null){
                coinList.push({name : coin, prices : coins[coin]});
            }
        }
        coinList.sort(compare5);
        for (var i in coinList){
            var coin = coinList[i];
            dataHtml += `<tr>
            <td>${i}</td>
            <td>${coin.name}</td>
            <td>${coin.prices.at(-1)}</td>
            <td>${(coin.prices.at(-1) - coin.prices.at(-2))/coin.prices.at(-1)*100}</td>
            </tr>`;
        }
        document.getElementById('5minTable').innerHTML = dataHtml;
        if (coinList[0].prices.length >= 5){
            coinList.sort(compare30);
            dataHtml = '';
            for (var i in coinList){
                var coin = coinList[i];
                dataHtml += `<tr>
                <td>${i}</td>
                <td>${coin.name}</td>
                <td>${(coin.prices.at(-1) - coin.prices.at(-5))/coin.prices.at(-5)*100}</td>
                </tr>`;
            }
            document.getElementById('30minTable').innerHTML = dataHtml;
        }
}

function compare5(a, b){
    var diffA = (a.prices.at(-1) - a.prices.at(-2))/a.prices.at(-1)
    var diffB = (b.prices.at(-1) - b.prices.at(-2))/b.prices.at(-1)
    if (isFinite(diffB-diffA)){
        return diffB-diffA;
    } else {
        return isFinite(diffA) ? -1 : 1;
    }
}

function compare30(a, b){
    var diffA = (a.prices.at(-1) - a.prices.at(-5))/a.prices.at(-1)
    var diffB = (b.prices.at(-1) - b.prices.at(-5))/b.prices.at(-1)
    if (isFinite(diffB-diffA)){
        return diffB-diffA;
    } else {
        return isFinite(diffA) ? -1 : 1;
    }
}

function main() {
    getCoins().then(idStrings =>{
        timestamp = Date.now();
        getPrices(idStrings, coins);
        setInterval(function() {
            getPrices(idStrings, coins);
        }, 60000);
    });
}

main();


