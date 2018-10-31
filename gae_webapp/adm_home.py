from flask import Flask, render_template

app = Flask(__name__)

@app.route('/home')
def adm_home():
    return render_template('adm_home.html', title = 'Admin Home')