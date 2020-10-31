from flask import Flask, jsonify, request, render_template
from flask_pymongo import PyMongo
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

app.config['MONGO_DBNAME'] = 'acme'
app.config['MONGO_URI'] = 'mongodb://localhost:27017/acme'

mongo = PyMongo(app)

@app.route('/users', methods=['GET'])
def get_users():
	users = mongo.db.users 	
	output = []
	for user in users.find({'firstname':{ '$exists': True }}):
		output.append({'firstname': user['firstname'], 'lastname': user['lastname'], 'age': user['age']})
	return jsonify(output)


@app.route('/users', methods=['POST'])
def add_post():
	users = mongo.db.users 	
	firstname = request.json['firstname']
	lastname = request.json['lastname']
	age = request.json['age']
	added_user = users.insert_one({'firstname': firstname, 'lastname': lastname, 'age': age})
	_id = added_user.inserted_id
	new_user = users.find_one({'_id': _id})
	output = {'firstname': firstname, 'lastname': lastname, 'age': age}
	return jsonify(output)

app.run(port=5000, debug=True)