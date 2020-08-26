from flask import Flask
import os

application = Flask(__name__, static_folder='./chess-engine-app/build', static_url_path='/')

@application.route('/')
def index():
    return application.send_static_file('index.html')

from engine.views import main
application.register_blueprint(main)

if __name__ == "__main__":
    application.run(host='0.0.0.0', debug=False, port=os.environ.get('PORT', 80))
