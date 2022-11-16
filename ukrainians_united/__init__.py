from flask import Flask, render_template, request, make_response, redirect
from flask_mail import Mail, Message
from .liqpay import LiqPay
import base64
import json

PROJECT_FOLDER = "ukrainians_united"
UPLOAD_FOLDER = "uploads"
JSON_TEXT = PROJECT_FOLDER+"/text.json"
liqpay = LiqPay("12345678987", "12345678900----098765434567890987654")

app = Flask(__name__, static_url_path='')

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAIL_SERVER'] = 'mail.111111.com'
app.config['MAIL_PORT'] = 465
app.config['MAIL_USE_SSL'] = True
app.config['MAIL_USERNAME'] = 'info@111111.com'
app.config['MAIL_DEFAULT_SENDER'] = 'info@111111.com'
app.config['MAIL_PASSWORD'] = '111111111'

mail = Mail(app)

@app.route("/", methods=["GET"])
def index():

	# if request.url.startswith('http://'):
	# 	return redirect(request.url.replace('http', 'https', 1).replace('080', '443', 1))

	with open(JSON_TEXT, encoding="utf-8") as t:
		data = json.load(t)
	lang = request.args.get('lang', '')

	if lang:
		resp = make_response(render_template("index.html", data=data, lang=lang))
		resp.set_cookie('lang', lang)
		return resp
	else:
		lang = request.cookies.get("lang")
		if not lang:
			lang = "en"

		return render_template("index.html", data=data, lang=lang)

@app.route("/liqpay", methods=["POST"])
def pay_liqpay():
	data = {i:j for i, j in request.form.items()}
	data, signature = liqpay.cnb_signature(data)
	print(f"https://www.liqpay.ua/api/3/checkout?data={data.decode()}&signature={signature.decode()}")
	return redirect(f"https://www.liqpay.ua/api/3/checkout?data={data.decode()}&signature={signature.decode()}", code=302)

@app.route("/feedback", methods=["POST"])
def send_feedback():
	msg = Message(f"{request.form['assistance_email']} Запит на допомогу",  recipients=["111111@gmail.com"])

	msg.html = "<p>Запит на допомогу від:</p>"
	msg.html += f"<p>ПІБ: {request.form['fullname']}</p>"
	if request.form["organization"]:
		msg.html += f"<p>Організація: {request.form['organization']}</p>"
	msg.html += f"<p>E-mail: {request.form['assistance_email']}</p>"
	msg.html += f"<p>Для чого потрібні кошти:<br>{request.form['request_assistance']}</p>"

	mail.send(msg)

	msg = Message("Запит на допомогу відправленно",  recipients=[request.form['assistance_email']])

	msg.html = "<p>Запит на допомогу відправленно, найближчим часом з Вами зв'яжуться</p>"

	mail.send(msg)

	return redirect("/", code=302)