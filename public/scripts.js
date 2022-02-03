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

async function updateTable(){
    var coinList = [];
    var dataHtml = '';
    var coins = await getData('/api');
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

setInterval(updateTable, 30000);
