import datetime
import json
import os
import shutil
import time

import requests
from bs4 import BeautifulSoup


def get_urls(string):
    indices = []
    uris = []
    try:
        index = string.index("url")
        while index != -1:
            indices.append(index)
            index = string.index("url", index + 1)
    except ValueError:
        pass
    for index in indices:
        [key, value] = string[index:].split(",")[0].replace('\\"', '"').split(":", 1)
        uri = value.replace('"', "")
        if "http" not in uri:
            uris.append(uri)
    return uris


def parse_data(element: dict, output_file: str):
    if isinstance(element, dict):
        try:
            if element.get("data"):
                json_data = element.get("data")["games"]
                with open(output_file, "w") as f:
                    json.dump(json_data, f, indent=4)
            elif element.get("children"):
                parse_data(element.get("children"), output_file)
        except:
            pass
    if isinstance(element, list):
        for item in element:
            parse_data(item, output_file)


def read_data(input_url: str, output_file: str):
    response = requests.get(input_url)
    soup = BeautifulSoup(response.text, "html.parser")
    script = soup.find(lambda tag: tag.name == "script" and "data:" in tag.text)
    if script is not None:
        raw_data = (
            script.text.replace("self.__next_f.push(", "")[:-1]
            .replace('\\"', '"')
            .replace('\\"', '"')
        )
        data = json.loads(raw_data[6:-4])
        parse_data(data, output_file)


def proper_name(file: str):
    elements = file.split("-")
    if len(elements) > 3:
        elements[0] = elements[0].upper()
        if "Proma" in elements[0]:
            elements[0] = "Promotion A"
        elements[1] = elements[1].capitalize()
        if elements[2] == "r":
            elements[2] = "Réserve"
        elements.pop(3)
        return " ".join(elements)
    else:
        return file.replace(".json", "").replace("_", " ")


def web_selector(directory: str, target_directory: str):
    data = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".json"):
                with open(os.path.join(root, file), "r") as f:
                    if (
                        "Binchois" in f.read()
                        and "_R.json" not in file
                        and "belgian-volley" not in file
                    ):
                        info = {
                            "path": "./data/" + file,
                            "name": proper_name(file),
                            "last_update": datetime.datetime.now().strftime(
                                "%Y-%m-%d %H:%M:%S"
                            ),
                        }
                        try:
                            shutil.copy2(
                                os.path.join(root, file),
                                os.path.join(target_directory, file),
                            )
                            data.append(info)
                        except shutil.SameFileError:
                            pass
                        except Exception as e:
                            print(f"An unexpected error occurred: {e}")
    sorted_data = sorted(data, key=lambda d: d["name"])
    with open(os.path.join(target_directory, "data.json"), "w") as f:
        json.dump(sorted_data, f, indent=4)


def reader(url: str, extract_path: str, web_path: str):
    response = requests.get(url)
    soup = BeautifulSoup(response.text, "html.parser")
    script = soup.find(lambda tag: tag.name == "script" and "is_federation" in tag.text)
    uris = get_urls(script.text)
    print("Scraping web files...")
    for uri in uris:
        read_data(url + uri, extract_path + "/" + uri + ".json")
    print("Moving web files...")
    web_selector(extract_path, web_path)


if __name__ == "__main__":
    EXTRACT_DATA_PATH = "/home/xavierb1/volley_data/data"
    WEB_DATA_PATH = "/home/xavierb1/public_html/volley-data/data"
    reader("https://www.portailfvwb.be/", EXTRACT_DATA_PATH, WEB_DATA_PATH)
