import pandas as pd


def getJSON(df: pd.DataFrame):
    return df.to_json()