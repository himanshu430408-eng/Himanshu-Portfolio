from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from pathlib import Path

import os
import smtplib

from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


load_dotenv()

BACKEND_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BACKEND_DIR.parent

app = Flask(__name__, static_folder=None)

CORS(app)


# ==========================================
# ENVIRONMENT VARIABLES
# ==========================================

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))

SMTP_EMAIL = os.getenv("SMTP_EMAIL")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")

RECEIVER_EMAIL = os.getenv("RECEIVER_EMAIL")


# ==========================================
# FRONTEND ROUTES
# ==========================================

@app.route("/")
def home():
    return send_from_directory(
        PROJECT_DIR,
        "index.html"
    )


@app.route("/<path:filepath>")
def frontend_files(filepath):

    if filepath.startswith("api/"):
        return jsonify({
            "success": False,
            "message": "API endpoint not found."
        }), 404

    return send_from_directory(
        PROJECT_DIR,
        filepath
    )


# ==========================================
# HEALTH CHECK
# ==========================================

@app.route("/api/health", methods=["GET"])
def health():

    return jsonify({
        "success": True,
        "status": "online",
        "service": "HK Portfolio Contact API"
    })


# ==========================================
# CONTACT API
# ==========================================

@app.route("/api/contact", methods=["POST"])
def contact():

    try:

        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "message": "Invalid request."
            }), 400


        name = data.get("name", "").strip()
        email = data.get("email", "").strip()
        subject = data.get("subject", "").strip()
        message = data.get("message", "").strip()


        # ======================================
        # VALIDATION
        # ======================================

        if not name or not email or not subject or not message:

            return jsonify({
                "success": False,
                "message": "All fields are required."
            }), 400


        if "@" not in email:

            return jsonify({
                "success": False,
                "message": "Invalid email address."
            }), 400


        # ======================================
        # BUILD EMAIL
        # ======================================

        mail = MIMEMultipart()

        mail["From"] = SMTP_EMAIL
        mail["To"] = RECEIVER_EMAIL

        mail["Subject"] = f"[Portfolio Contact] {subject}"

        # Reply button will reply to visitor
        mail["Reply-To"] = email


        body = f"""
NEW PORTFOLIO MESSAGE
==============================

Name:
{name}

Email:
{email}

Subject:
{subject}

Message:
{message}

==============================

Sent from HK CYBER OS Portfolio
"""


        mail.attach(
            MIMEText(body, "plain")
        )


        # ======================================
        # SEND EMAIL
        # ======================================

        server = smtplib.SMTP(
            SMTP_HOST,
            SMTP_PORT,
            timeout=15
        )

        server.starttls()

        server.login(
            SMTP_EMAIL,
            SMTP_PASSWORD
        )

        server.sendmail(
            SMTP_EMAIL,
            RECEIVER_EMAIL,
            mail.as_string()
        )

        server.quit()


        return jsonify({
            "success": True,
            "message": "Message transmitted successfully."
        }), 200


    except Exception as error:

        print("CONTACT ERROR:", error)

        return jsonify({
            "success": False,
            "message": "Unable to transmit message."
        }), 500


# ==========================================
# START SERVER
# ==========================================

if __name__ == "__main__":

    print("=" * 55)
    print("HK PORTFOLIO CONTACT SERVER")
    print("=" * 55)

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )