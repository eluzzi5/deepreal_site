from flask import Flask, render_template
import os
from flask import request
from flask_cors import CORS, cross_origin, logging
from flask import jsonify

import model_wrapper
import util
from util import *
from const import *

app = Flask(__name__)
# CORS(app, resources={r"/*": {"origins": "*"}})
CORS(app)
logging.getLogger('flask_cors').level = logging.DEBUG


app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = os.path.join('static')
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/')

@app.route('/index')
def show_index():
    return render_template("index.html")

@cross_origin()

@app.route("/upload", methods=["GET","POST"])
def post_video():
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', '*')
    session_id = create_session()

    save_request_file_stream(session_id, request.files["user_video"])
    resp_data = {
        "session_id": session_id,
        "avail_models": avail_models,
        "avail_inputs": avail_inputs
    }

    return jsonify(resp_data)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')