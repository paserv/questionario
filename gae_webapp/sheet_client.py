from google.appengine.api import urlfetch
import json
from datetime import datetime, timedelta

sheet_webapp_url = "https://script.google.com/macros/s/AKfycbycad7IIw9ByYEFLVy3vv1ZsHbRp_ZZYaayokjfEO1VC6zCXiI/exec"

def save_questionario(quest):
    payload = {"data": []}
    dictPayload = json.loads(quest)
    risposte = dictPayload['risposte']
    questMap = dictPayload['map']
    now = (datetime.now() + + timedelta(hours=2)).strftime("%Y-%m-%d %H:%M:%S")
    for key, value in risposte.iteritems():
        if isinstance(value, dict):
            for innerkey, innervalue in value.iteritems():
                payload['data'].append({'id': innerkey, 'testo': questMap[innerkey], 'risposta': innervalue, 'timestamp': now})
        else:
            payload['data'].append({'id': key, 'testo': questMap[key], 'risposta': value, 'timestamp': now})
    
    payloadString = json.dumps(payload)
    sheetResponse = urlfetch.fetch(sheet_webapp_url, method=urlfetch.POST, payload=payloadString)
    if sheetResponse.status_code == 200:
        pablo = sheetResponse
