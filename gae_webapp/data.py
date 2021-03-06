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
    
def get_questions():
    result = []
    questions = model.Domanda.query()
    for question in questions:
        result.append({"key": question.key.string_id(), "text": question.text})
    return result

def get_answers_by_day(fromDate, toDate):
    result = {"total": 0, "data": []}
    answers = model.Risposta.query().filter(model.Risposta.created >= fromDate, model.Risposta.created<= toDate)
    counter = 0
    resultDict = {}
    for answer in answers:
        tmst = answer.created.strftime("%Y-%m-%d")
        if tmst in resultDict:
            resultDict[tmst] = resultDict[tmst] + 1
        else:
            resultDict[tmst] = 1
        counter = counter + 1
    for key, value in resultDict.iteritems():
        result['data'].append([key, value])
    result['total'] = counter
    return result
       
def get_answers(fromDate, toDate, qid):
    result = []
    result.append([qid, qid])
    answers = model.Risposta.query(ancestor=ndb.Key('Domanda', qid)).filter(model.Risposta.created >= fromDate, model.Risposta.created<= toDate)
    resultDict = {}
    for answer in answers:
        if answer.text in resultDict:
            resultDict[answer.text] = resultDict[answer.text] + 1
        else:
            resultDict[answer.text] = 1
    for key, value in resultDict.iteritems():
        result.append([key, value])
    return result