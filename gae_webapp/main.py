from flask import Flask, render_template, send_from_directory, request
import os
import data
import sheet_client

app = Flask(__name__)


@app.after_request
def add_header(r):
    r.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    r.headers["Pragma"] = "no-cache"
    r.headers["Expires"] = "0"
    r.headers['Cache-Control'] = 'public, max-age=0'
    return r

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')

##### VIEWS #####
@app.route('/')
def home():
    return render_template('home.html', title="Home Page")

##### API #####
@app.route('/save', methods=['POST'])
def save_questionario():
    payload = request.data
    data.save_questionario(payload)
    sheet_client.save_questionario(payload)
    return 'Questionario salvato con successo', 200