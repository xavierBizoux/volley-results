import datetime
import json
import os
import shutil
import time

import requests
from bs4 import BeautifulSoup


def read_data(input_url, output_file):
    response = requests.get(input_url)
    soup = BeautifulSoup(response.text, "html.parser")
    script = soup.find("script", {"id": "__NEXT_DATA__"})
    try:
        data = json.loads(script.text)
        games = (
            data.get("props")
            .get("pageProps")
            .get("initialSections")[0]
            .get("data")
            .get("games")
        )
        with open(output_file, "w") as f:
            json.dump(games, f, indent=4)
    except:
        pass


def read_children(item, url):
    if len(item.get("children")) > 0:
        for child in item.get("children"):
            read_children(child, url)
    else:
        if item.get("url"):
            filename = filenameCleaner(item.get("name"))
            read_data(
                url + item.get("url"),
                "data/" + filename + ".json",
            )


def filenameCleaner(filename):
    return filename.replace("Ht - ", "").replace("FVWB-", "").replace(" ", "_")


def web_selector(directory, target_directory):
    data = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".json"):
                with open(os.path.join(root, file), "r") as f:
                    if "Binchois" in f.read() and "_R.json" not in file:
                        info = {
                            "path": "./data/" + file,
                            "name": file.replace(".json", "").replace("_", " "),
                            "last_update": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                        }
                        data.append(info)
                        shutil.copy(
                            os.path.join(root, file),
                            os.path.join(target_directory, file),
                        )
    with open(os.path.join(target_directory, "data.json"), "w") as f:
        json.dump(data, f, indent=4)


def reader(url, extract_path, web_path):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    script = soup.find("script", {"id": "__NEXT_DATA__"})
    data = json.loads(script.text)
    menu = data.get("props").get("menu")
    for item in menu:
        read_children(item, url)
    web_selector(extract_path, web_path)


if __name__ == "__main__":
    EXTRACT_DATA_PATH = "/home/xavierb1/volley_data/data"
    WEB_DATA_PATH = "/home/xavierb1/public_html/volley-data/data" 
    reader("https://www.portailfvwb.be/", EXTRACT_DATA_PATH, WEB_DATA_PATH)
