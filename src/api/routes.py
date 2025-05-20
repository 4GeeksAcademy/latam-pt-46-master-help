"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required
from werkzeug.security import generate_password_hash, check_password_hash

# Allow CORS requests to this API
api = Blueprint('api', __name__)
CORS(api)


@api.route('/user/signin', methods=['POST'])
def handle_register_new_user():
    request_body = request.get_json()
    if not request_body:
        return jsonify({"message": "No request body"}), 400
    if not request_body.get("email"):
        return jsonify({"message": "No email"}), 400
    if not request_body.get("password"):
        return jsonify({"message": "No password"}), 400

    if User.query.filter_by(email=request_body["email"]).first():
        return jsonify({"message": "User already exists"}), 400
    if len(request_body["password"]) < 6:
        return jsonify({"message": "Password must be at least 6 characters"}), 400

    hashed_password = generate_password_hash(request_body["password"])
    user = User(
        email=request_body["email"],
        password=hashed_password,
        is_active=True
    )
    db.session.add(user)
    db.session.commit()
    return jsonify(user.serialize()), 201


@api.route('/user/login', methods=['POST'])
def handle_login_user():
    request_body = request.get_json()
    user = User.query.filter_by(email=request_body["email"]).first()
    if not user or not check_password_hash(user.password, request_body["password"]):
        return jsonify({"message": "Invalid Credentials"}), 404
    if not user.is_active:
        return jsonify({"message": "User is not active"}), 403

    access_token = create_access_token(identity=user.id)
    return jsonify({
        "access_token": access_token,
        "user": user.serialize()
    }), 200
