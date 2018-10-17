from flask import Flask, request, render_template, jsonify
import data
import json
import sheet_client
from datetime import datetime

app = Flask(__name__)

@app.route('/admin/home')
def admin_home():
    return render_template('admin.html', title = 'Admin Page')   

@app.route('/admin/get-questions')
def get_questions():
    result = data.get_questions()
    return jsonify(result)

@app.route('/admin/get-answers', methods=['POST'])
def get_answers():
    inputData = json.loads(request.data)
    qid = inputData['qid']
    fromDate = datetime.strptime(inputData['from'] + ' 00:00:00', '%Y-%m-%d %H:%M:%S')
    toDate = datetime.strptime(inputData['to'] + ' 23:59:59', '%Y-%m-%d %H:%M:%S')
    result = data.get_answers(fromDate, toDate, qid)
    return jsonify(result)

@app.route('/admin/datastore/save', methods=['POST'])
def datastore_save():
    data.save_questionario(request.data)
    return 'Questionario salvato con successo sul Datastore', 200

@app.route('/admin/sheet/save', methods=['POST'])
def sheet_save():
    sheet_client.save_questionario(request.data)
    return 'Questionario salvato con successo su Google Sheet', 200