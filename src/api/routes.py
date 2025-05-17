"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required

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

    user = User(email=request_body["email"],
                password=request_body["password"],
                is_active=True
                )
    db.session.add(user)
    db.session.commit()
    return jsonify(user.serialize()), 201


@api.route('/user/login', methods=['POST'])
def handle_login_user():
    request_body = request.get_json()
    if not request_body:
        return jsonify({"message": "No request body"}), 400
    if not request_body.get("email"):
        return jsonify({"message": "No email"}), 400
    if not request_body.get("password"):
        return jsonify({"message": "No password"}), 400

    user = User.query.filter_by(
        email=request_body["email"], password=request_body["password"]).first()
    if not user:
        return jsonify({"message": "Invalid Credentials"}), 404
    if not user.is_active:
        return jsonify({"message": "User is not active"}), 403

    access_token = create_access_token(identity=user.id)
    return jsonify({
        "access_token": access_token,
        "user": user.serialize()
    }), 200
