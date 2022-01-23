import requests

listURL = "https://api.coingecko.com/api/v3/coins/list"
pricesURL = "https://api.coingecko.com/api/v3/simple/price"

def getData(url, payload=None):
    try:
        r = requests.get(url, params=payload)
        if r.status_code != 204:
            return r.json()
    except requests.exceptions.RequestException as e:
        raise SystemExit(e)

# get all coins
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

coins = dict.fromkeys(ids, [])
# get prices
print(len(coins))