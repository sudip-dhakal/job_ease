from flask_pymongo import PyMongo
from flask import Flask

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/Jobportal"  # replace with your database URI
mongo = PyMongo(app)  
