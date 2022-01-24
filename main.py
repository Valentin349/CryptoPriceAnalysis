import requests, time

listURL = "https://api.coingecko.com/api/v3/coins/list"
pricesURL = "https://api.coingecko.com/api/v3/simple/price"
coins = []

def getData(url, payload=None):
    try:
        r = requests.get(url, params=payload)
        if r.status_code != 204:
            return r.json()
    except requests.exceptions.RequestException as e:
        raise SystemExit(e)

def getPrices(idStrings, pages):
    coins.append({})
    for i in range(pages):
        data = getData(pricesURL, {'vs_currencies': 'usd', 'include_last_updated_at': 'true', 'ids':idStrings[i]})
        coins[-1].update(data)

def getCoinNames():
    idStrings = ['']
    ids = []
    counter = 1
    pages = 0

    for data in getData(listURL):
        if counter > 450:
            counter = 0
            pages += 1
            idStrings.append('')
        idStrings[pages] += data["id"] + ","
        ids.append(data['id'])
        counter += 1
    priceDiff = dict.fromkeys(ids, 0)
    return idStrings, pages, priceDiff

def main():
    idStrings, pages, priceDiff = getCoinNames()
    getPrices(idStrings, pages)
    time.sleep(10)
    getPrices(idStrings, pages)
    while True:
        for coin in coins[-1]:
            if "usd" in coins[-1][coin].keys():
                priceDiff[coin] = coins[-1][coin]['usd'] - coins[-2][coin]['usd']
        print("bitcoin", priceDiff['bitcoin'])
        time.sleep(300)
        getPrices(idStrings, pages)

main()