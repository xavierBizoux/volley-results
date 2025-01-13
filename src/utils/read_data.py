import datetime
import json
import os
import shutil
import time

import requests
from bs4 import BeautifulSoup


def read_children(item: dict, url: str, output_folder: str):
    if len(item.get("children")) > 0:
        for child in item.get("children"):
            read_children(child, url, output_folder)
    else:
        if item.get("url"):
            filename = filenameCleaner(item.get("name"))
            read_data(
                url + item.get("url"),
                output_folder + "/" + filename + ".json",
            )


def filenameCleaner(filename: str):
    return filename.replace("Ht - ", "").replace("FVWB-", "").replace(" ", "_")


def proper_name(input_str: str):
    input_str = input_str.replace(".json", "").replace("_", " ")
    if len(input_str) > 1 and input_str[1].isdigit():
        match input_str[0]:
            case "P":
                replacement = "Provinciale"
            case "N":
                replacement = "Nationale"
            case _:
                replacement = input_str[0]
        return f"{replacement} {input_str[1:]}"
    else:
        return input_str


def get_menu(string: str):
    raw_data = (
        string.replace("self.__next_f.push(", "")[:-1]
        .replace("\\\\", "\\")
        .replace('\\"', '"')
    )
    data = json.loads(raw_data[6:-4])
    return data[3].get("value").get("menu")


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
            .replace("\\\\", "\\")
            .replace('\\"', '"')
        )
        data = json.loads(raw_data[6:-4])
        parse_data(data, output_file)


def web_selector(directory: str, target_directory: str):
    data = []
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".json") and "_R.json" not in file:
                with open(os.path.join(root, file), "r") as f:
                    if "Binchois" in f.read():
                        info = {
                            "path": "./data/" + file,
                            "name": proper_name(file, "Provinciale "),
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
    menu = get_menu(script.text)
    print("Scraping web files...")
    for item in menu:
        read_children(item, url, extract_path)
    print("Moving web files...")
    web_selector(extract_path, web_path)


if __name__ == "__main__":
    EXTRACT_DATA_PATH = "/home/xavierb1/volley_data/data"
    WEB_DATA_PATH = "/home/xavierb1/public_html/volley-data/data"
    reader("https://www.portailfvwb.be/", EXTRACT_DATA_PATH, WEB_DATA_PATH)
