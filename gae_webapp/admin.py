from flask import Flask, request
import data
import sheet_client

app = Flask(__name__)

@app.route('/admin/datastore/save', methods=['POST'])
def datastore_save():
    data.save_questionario(request.data)
    return 'Questionario salvato con successo sul Datastore', 200

@app.route('/admin/sheet/save', methods=['POST'])
def sheet_save():
    sheet_client.save_questionario(request.data)
    return 'Questionario salvato con successo su Google Sheet', 200