import os
from flask import Flask, request, jsonify, url_for, send_from_directory
from flask_migrate import Migrate
from flask_cors import CORS
from flask_swagger import swagger
<<<<<<< HEAD
from flask_cors import CORS
=======
>>>>>>> development
from flask_jwt_extended import JWTManager

from api.utils import APIException, generate_sitemap
from api.models import db
from api.routes import api
from api.admin import setup_admin
from api.commands import setup_commands

ENV = "development" if os.getenv("FLASK_DEBUG") == "1" else "production"
static_file_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), '../public/')

app = Flask(__name__)

# ✅ CORS configurado de forma explícita
CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)

# ✅ JWT secret
app.config["JWT_SECRET_KEY"] = "M4st3rH4lp"
jwt = JWTManager(app)

<<<<<<< HEAD
=======
# ✅ Configuración de CORS global
CORS(app, resources={r"/api/*": {"origins": ["https://symmetrical-space-giggle-pgg5gxgg6rw36769-3000.app.github.dev"]}},
     supports_credentials=True,
     expose_headers="Authorization",
     allow_headers=["Content-Type", "Authorization"])

# ✅ CORS headers adicionales después de cada respuesta
@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "https://symmetrical-space-giggle-pgg5gxgg6rw36769-3000.app.github.dev"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,PUT,DELETE,OPTIONS"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

>>>>>>> development
app.url_map.strict_slashes = False

# ✅ Configuración de base de datos
db_url = os.getenv("DATABASE_URL")
if db_url is not None:
    app.config['SQLALCHEMY_DATABASE_URI'] = db_url.replace("postgres://", "postgresql://")
else:
    app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:////tmp/test.db"

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

MIGRATE = Migrate(app, db, compare_type=True)
db.init_app(app)

# ✅ Admin y comandos
setup_admin(app)
setup_commands(app)

# ✅ Rutas de API
app.register_blueprint(api, url_prefix='/api')

<<<<<<< HEAD
# ✅ Manejo de errores
=======
# ✅ Manejo de errores personalizados
>>>>>>> development
@app.errorhandler(APIException)
def handle_invalid_usage(error):
    return jsonify(error.to_dict()), error.status_code

# ✅ Sitemap para entorno de desarrollo
@app.route('/')
def sitemap():
    if ENV == "development":
        return generate_sitemap(app)
    return send_from_directory(static_file_dir, 'index.html')

# ✅ Servir archivos estáticos
@app.route('/<path:path>', methods=['GET'])
def serve_any_other_file(path):
    if not os.path.isfile(os.path.join(static_file_dir, path)):
        path = 'index.html'
    response = send_from_directory(static_file_dir, path)
    response.cache_control.max_age = 0
    return response

# ✅ Iniciar el servidor
if __name__ == '__main__':
    PORT = int(os.environ.get('PORT', 3001))
    app.run(host='0.0.0.0', port=PORT, debug=True)
