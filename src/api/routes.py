from flask import Blueprint, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from api.models import db, User, Process, Step, StepType, Category
import cloudinary.uploader
import cloudinary
from cloudinary.utils import cloudinary_url
from os import getenv

# Configuración de Cloudinary
cloudinary.config(
    cloud_name=getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=getenv("CLOUDINARY_API_KEY"),
    api_secret=getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

api = Blueprint('api', __name__)
# ------------------------- AUTH -------------------------


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
        return jsonify({"message": "User already exists"}), 409
    if len(request_body["password"]) < 6:
        return jsonify({"message": "Password must be at least 6 characters"}), 400

    hashed_password = generate_password_hash(request_body["password"])
    user = User(email=request_body["email"],
                password=hashed_password, is_active=True)
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

    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        "access_token": access_token,
        "user": user.serialize()
    }), 200


@api.route('/categories', methods=['POST'])
@jwt_required()
def create_category():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    name = data.get("name")

    if not name:
        return jsonify({"error": "El nombre es obligatorio"}), 400

    existing = Category.query.filter_by(name=name, user_id=user_id).first()
    if existing:
        return jsonify({"error": "La categoría ya existe"}), 409

    new_category = Category(name=name, user_id=user_id)
    db.session.add(new_category)
    db.session.commit()

    return jsonify(new_category.serialize()), 201


@api.route('/categories/<int:category_id>', methods=['DELETE'])
@jwt_required()
def delete_category(category_id):
    user_id = int(get_jwt_identity())
    category = Category.query.filter_by(
        id=category_id, user_id=user_id).first()

    if not category:
        return jsonify({"error": "Categoría no encontrada"}), 404

    db.session.delete(category)
    db.session.commit()
    return jsonify({"message": "Categoría eliminada correctamente"}), 200


@api.route('/categories', methods=['GET'])
@jwt_required()
def get_all_categories():
    user_id = int(get_jwt_identity())
    categories = Category.query.filter_by(user_id=user_id).all()
    return jsonify([cat.serialize() for cat in categories]), 200


@api.route('/categories/<int:category_id>', methods=['GET'])
@jwt_required()
def get_category_by_id(category_id):
    user_id = int(get_jwt_identity())
    category = Category.query.filter_by(
        id=category_id, user_id=user_id).first()
    if not category:
        return jsonify({"error": "Categoría no encontrada"}), 404

    return jsonify(category.serialize()), 200


@api.route('/categories/<int:category_id>', methods=['PUT'])
@jwt_required()
def update_category(category_id):
    user_id = int(get_jwt_identity())
    data = request.get_json()
    new_name = data.get("name")

    if not new_name:
        return jsonify({"error": "El nuevo nombre es obligatorio"}), 400

    category = Category.query.filter_by(
        id=category_id, user_id=user_id).first()
    if not category:
        return jsonify({"error": "Categoría no encontrada"}), 404

    category.name = new_name
    db.session.commit()

    return jsonify(category.serialize()), 200

# ------------------------- PROCESOS -------------------------


@api.route('/process/create/<int:category_id>', methods=['POST'])
@jwt_required()
def create_process(category_id):
    user_id = int(get_jwt_identity())
    data = request.get_json()

    if not data or not data.get("name"):
        return jsonify({"error": "Falta el nombre del proceso"}), 400

    category = Category.query.filter_by(
        id=category_id, user_id=user_id).first()
    if not category:
        return jsonify({"error": "Categoría no válida o no te pertenece"}), 404

    new_process = Process(
        name=data["name"],
        description=data.get("description"),
        category_id=category.id,
        user_id=user_id
    )

    db.session.add(new_process)
    db.session.commit()

    return jsonify(new_process.serialize()), 201


@api.route('/process', methods=['GET'])
@jwt_required()
def get_user_processes():
    user_id = get_jwt_identity()
    processes = Process.query.filter_by(user_id=user_id).all()
    return jsonify([p.serialize() for p in processes]), 200


@api.route('/process/<int:process_id>', methods=['GET'])
@jwt_required()
def get_process_detail(process_id):
    user_id = get_jwt_identity()
    process = Process.query.filter_by(id=process_id, user_id=user_id).first()
    if not process:
        return jsonify({"error": "Proceso no encontrado"}), 404

    steps = [step.serialize() for step in process.steps]
    return jsonify({
        "process": process.serialize(),
        "steps": sorted(steps, key=lambda s: s["order"])
    }), 200


@api.route('/process/<int:process_id>', methods=['DELETE'])
@jwt_required()
def delete_process(process_id):
    user_id = get_jwt_identity()
    process = Process.query.filter_by(id=process_id, user_id=user_id).first()
    if not process:
        return jsonify({"error": "Proceso no encontrado o no autorizado"}), 404

    db.session.delete(process)
    db.session.commit()
    return jsonify({"message": "Proceso eliminado correctamente"}), 200


@api.route('/categories/<int:category_id>/processes', methods=['GET'])
@jwt_required()
def get_processes_by_category(category_id):
    user_id = int(get_jwt_identity())

    category = Category.query.filter_by(
        id=category_id, user_id=user_id).first()
    if not category:
        return jsonify({"error": "Categoría no encontrada o no te pertenece"}), 404

    processes = Process.query.filter_by(
        user_id=user_id, category_id=category_id).all()

    return jsonify([p.serialize() for p in processes]), 200


# ------------------------- PASOS -------------------------

@api.route('/step/upload', methods=['POST'])
@jwt_required()
def upload_step():
    process_id = request.form.get("process_id")
    label = request.form.get("label")
    step_type = request.form.get("type")
    order = request.form.get("order")

    if not all([process_id, label, step_type, order]):
        return jsonify({"error": "Faltan campos obligatorios"}), 400

    if step_type in ["IMAGE", "PDF", "VIDEO"]:
        if "file" not in request.files:
            return jsonify({"error": "Archivo no encontrado"}), 400
        upload_result = cloudinary.uploader.upload(
            request.files["file"],
            resource_type="auto"
        )
        content_url = upload_result.get("secure_url")
    else:
        content_url = request.form.get("content")
        if not content_url:
            return jsonify({"error": "Contenido requerido"}), 400

    step = Step(
        process_id=process_id,
        label=label,
        type=StepType[step_type],
        content=content_url,
        order=int(order)
    )

    db.session.add(step)
    db.session.commit()
    return jsonify(step.serialize()), 201


@api.route('/step/<int:step_id>', methods=['PUT'])
@jwt_required()
def update_step(step_id):
    user_id = int(get_jwt_identity())
    step = Step.query.get(step_id)
    if not step:
        return jsonify({"error": "Paso no encontrado"}), 404
    if step.process.user_id != user_id:
        return jsonify({"error": "No autorizado"}), 403

    # Check if request is multipart (file upload) or JSON (text/url)
    if request.content_type and request.content_type.startswith("multipart/form-data"):
        label = request.form.get("label", step.label)
        step_type = request.form.get("type", step.type.name)
        order = request.form.get("order", step.order)
        # If a file is provided, upload and update content
        if step_type in ["IMAGE", "PDF", "VIDEO"] and "file" in request.files:
            upload_result = cloudinary.uploader.upload(
                request.files["file"],
                resource_type="auto"
            )
            step.content = upload_result.get("secure_url")
        elif "content" in request.form:
            step.content = request.form.get("content")
        step.label = label
        step.type = StepType[step_type]
        step.order = int(order)
    else:
        data = request.get_json()
        if "label" in data:
            step.label = data["label"]
        if "type" in data:
            step.type = StepType[data["type"]]
        if "content" in data:
            step.content = data["content"]
        if "order" in data:
            step.order = int(data["order"])

    db.session.commit()
    return jsonify(step.serialize()), 200


@api.route('/step/<int:step_id>', methods=['DELETE'])
@jwt_required()
def delete_step(step_id):
    user_id = int(get_jwt_identity())
    step = Step.query.get(step_id)
    if not step:
        return jsonify({"error": "Paso no encontrado"}), 404
    if step.process.user_id != user_id:
        return jsonify({"error": "No autorizado"}), 403

    db.session.delete(step)
    db.session.commit()
    return jsonify({"msg": "Paso eliminado correctamente"}), 200


# ------------------------- Autocomplete -------------------------

@api.route('/autocomplete', methods=['GET'])
@jwt_required()
def handle_autocomplete():
    user_id = int(get_jwt_identity())
    text = request.args.get("query", "")
    if not text:
        return jsonify({"error": "Falta el texto para autocompletar"}), 400

    processes = Process.query.filter(
        Process.user_id == user_id,
        Process.name.ilike(f"%{text}%")
    ).all()

    return jsonify([p.serialize() for p in processes]), 200
