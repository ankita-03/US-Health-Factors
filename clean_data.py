import pandas as pd
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
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


df = pd.read_csv("cities_data.csv")
countyPop = []
statePop = []
pofHealth = []
obesity = []
crimes = []
unemployment = []
preDeaths = []
toDrop = []
driver = webdriver.Chrome()
for x in range(len(df)):
    driver.get(df["url"].tolist()[x])
    try:
        element = WebDriverWait(driver, 3).until((
            EC.presence_of_element_located((By.XPATH, '//td[@ng-bind-html="row.county_value"]'))
        ))
        f = (int(str(element.get_attribute('innerHTML')).replace(",", "")))
        g = (int(str(driver.find_element(By.XPATH, '//td[@ng-bind-html="row.state_value"]')
                     .get_attribute('innerHTML')).replace(",", "")))
        allBodies = driver.find_elements(By.XPATH, '//tr[@class="measure ng-scope"]')
        for y in range(len(allBodies)):
            try:
                # Percentage dropped
                if "Poor or fair health" in allBodies[y].text:
                    a = (float(allBodies[y].text.replace('Poor or fair health', '').
                               replace('\n', ' ').replace(' ', '*').split('*')[1].replace("%", "")))
            except:
                None
            try:
                # Percentage dropped
                if "Adult obesity" in allBodies[y].text:
                    b = (float(allBodies[y].text.replace('Adult obesity', '').
                               replace('\n', ' ').replace(' ', '*').split('*')[1].replace("%", "")))
            except:
                None
            try:
                if "Violent crime" in allBodies[y].text:
                    c = (int(allBodies[y].text.replace('Violent crime', '').
                             replace('\n', ' ').replace(' ', '*').split('*')[1].replace(",", "")))
            except:
                None
            try:
                # Percentage dropped
                if "Unemployment" in allBodies[y].text:
                    d = (float(allBodies[y].text.replace('Unemployment', '').
                               replace('\n', ' ').replace(' ', '*').split('*')[1].replace("%", "")))
            except:
                None
            try:
                if "Premature death" in allBodies[y].text:
                    e = (int(allBodies[y].text.replace('Premature death', '').
                             replace('\n', ' ').replace(' ', '*').split('*')[1].replace(",", "")))
            except:
                None
        try:
            pofHealth.append(a)
            obesity.append(b)
            crimes.append(c)
            unemployment.append(d)
            preDeaths.append(e)
            countyPop.append(f)
            statePop.append(g)
        except:
            None
    except:
        print(f'{x} | {df["county"].tolist()[x]} will not be used.')
        toDrop.append(x)

driver.quit()
df = df.drop(index=toDrop)

df["countyPop"] = countyPop
df["statePop"] = statePop
df["pofHealth %"] = pofHealth
df["obesity %"] = obesity
df["crimes"] = crimes
df["unemployment %"] = unemployment
df["preDeath"] = preDeaths

df.to_csv("data.csv", index=False)
