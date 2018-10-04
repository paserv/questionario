from google.appengine.ext import ndb

class Domanda(ndb.Model):
    text = ndb.StringProperty(indexed=False)
    created = ndb.DateTimeProperty(indexed=False)

class Risposta(ndb.Model):
    text = ndb.StringProperty(indexed=False)
    created = ndb.DateTimeProperty(indexed=True)
    
