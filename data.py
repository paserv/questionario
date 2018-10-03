import json
import model
import datetime
from google.appengine.ext import ndb  
 
def save_questionario(payload):
    dictPayload = json.loads(payload)
    risposte = dictPayload['risposte']
    questMap = dictPayload['map']
    now = datetime.datetime.now()
    for key, value in risposte.iteritems():
        if isinstance(value, dict):
            for innerkey, innervalue in value.iteritems():
                save_risposta(innerkey, innervalue, questMap[innerkey], now) 
        else:
            save_risposta(key, value, questMap[key], now)
            
def save_risposta(key, risposta, domandatext, now):  
    domandaKey = ndb.Key('Domanda', key)
    
    curr_dom = domandaKey.get()
    if curr_dom == None:
        domandaEntity = model.Domanda(key = domandaKey, text = domandatext, created = now)
        domandaEntity.put()
    rispostaEntity = model.Risposta(parent=domandaKey, text=str(risposta), created=now)
    rispostaEntity.put()