from flask import Flask

def create_app():
    app = Flask(__name__, static_folder='../chess-engine-app/build', static_url_path='/')

    @app.route('/')
    def index():
        return app.send_static_file('index.html')

    from .views import main
    app.register_blueprint(main)

    return app