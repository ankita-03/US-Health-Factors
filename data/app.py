from flask import Flask, render_template
from flask_pymongo import PyMongo
from read_data import getJSON
import pandas as pd

app = Flask(__name__)

# Use flask_pymongo to set up mongo connection
app.config["MONGO_URI"] = "mongodb://localhost:27017/project3"
mongo = PyMongo(app)


@app.route("/")
def index():
    listings = mongo.db.listings
    listings.drop()
    listings_data = getJSON(pd.read_csv("final_data.csv"))
    listings.insert_one(listings_data)
    listings = mongo.db.listings.find_one()
    return render_template("index.html", listings=listings)


if __name__ == "__main__":
    app.run(debug=True)
