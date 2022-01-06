import pandas as pd
from splinter import Browser
from bs4 import BeautifulSoup
import os

if not os.path.exists("cities_data.csv"):
    df = pd.read_csv("geo-data.csv")
    df = df.drop_duplicates(subset=['county'])
    for x in range(65, 91):
        df = df[~df.zipcode.str.contains(chr(x))]
    df.reset_index()
    url = "https://www.countyhealthrankings.org/"
    df["url"] = [
        url + f'app/{df["state"].tolist()[x].lower().replace(" ", "-").replace(".", "")}/2021/rankings/' \
              f'{df["county"].tolist()[x].lower().replace(" ", "-").replace(".", "")}' \
              f'/county/outcomes/overall/snapshot'
        for x in range(len(df))
    ]
    df.to_csv("cities_data.csv", index=False)