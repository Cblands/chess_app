from flask import Flask
import os

def create_app():
    app = Flask(__name__, static_folder='../build', static_url_path='/')

    @app.route('/')
    def index():
        return app.send_static_file('index.html')

    from engine.views import main
    app.register_blueprint(main)

    if __name__ == "__main__":
        app.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))

    return app