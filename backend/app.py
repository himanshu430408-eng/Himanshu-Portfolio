from flask import Flask, request, jsonify, send_from_directory
from dotenv import load_dotenv

from pathlib import Path
import os
import json
import re
import urllib.request
import urllib.error


# ==========================================
# PATHS
# ==========================================

BACKEND_DIR = Path(__file__).resolve().parent
PROJECT_DIR = BACKEND_DIR.parent

load_dotenv(BACKEND_DIR / ".env")


# ==========================================
# FLASK APP
# ==========================================

app = Flask(__name__, static_folder=None)


# ==========================================
# BREVO CONFIG
# ==========================================

BREVO_API_KEY = os.getenv("BREVO_API_KEY")
SENDER_EMAIL = os.getenv("SENDER_EMAIL")
RECEIVER_EMAIL = os.getenv("RECEIVER_EMAIL")

BREVO_API_URL = "https://api.brevo.com/v3/smtp/email"


# ==========================================
# HOME
# ==========================================

@app.route("/")
def home():

    return send_from_directory(
        PROJECT_DIR,
        "index.html"
    )


# ==========================================
# HEALTH CHECK
# ==========================================

@app.route("/api/health", methods=["GET"])
def health():

    return jsonify({
        "success": True,
        "status": "online",
        "service": "HK Cyber OS Portfolio"
    })


# ==========================================
# CONTACT API
# ==========================================

@app.route("/api/contact", methods=["POST"])
def contact():

    try:

        data = request.get_json(silent=True)

        if not data:

            return jsonify({
                "success": False,
                "message": "Invalid request."
            }), 400


        # ==================================
        # FORM DATA
        # ==================================

        name = str(
            data.get("name", "")
        ).strip()

        email = str(
            data.get("email", "")
        ).strip()

        subject = str(
            data.get("subject", "")
        ).strip()

        message = str(
            data.get("message", "")
        ).strip()


        # ==================================
        # VALIDATION
        # ==================================

        if not all([
            name,
            email,
            subject,
            message
        ]):

            return jsonify({
                "success": False,
                "message": "All fields are required."
            }), 400


        email_pattern = r"^[^\s@]+@[^\s@]+\.[^\s@]+$"

        if not re.match(email_pattern, email):

            return jsonify({
                "success": False,
                "message": "Invalid email address."
            }), 400


        if len(name) > 100:

            return jsonify({
                "success": False,
                "message": "Name is too long."
            }), 400


        if len(subject) > 200:

            return jsonify({
                "success": False,
                "message": "Subject is too long."
            }), 400


        if len(message) > 5000:

            return jsonify({
                "success": False,
                "message": "Message is too long."
            }), 400


        # ==================================
        # CHECK CONFIG
        # ==================================

        if not all([
            BREVO_API_KEY,
            SENDER_EMAIL,
            RECEIVER_EMAIL
        ]):

            print("BREVO CONFIGURATION MISSING")

            return jsonify({
                "success": False,
                "message": "Mail server is not configured."
            }), 500


        # ==================================
        # EMAIL BODY
        # ==================================

        email_body = f"""
NEW PORTFOLIO MESSAGE
================================

Name:
{name}

Visitor Email:
{email}

Subject:
{subject}

Message:
{message}

================================
Sent through HK CYBER OS Portfolio
"""


        # ==================================
        # BREVO REQUEST
        # ==================================

        payload = {

            "sender": {
                "name": "Himanshu Portfolio",
                "email": SENDER_EMAIL
            },

            "to": [
                {
                    "email": RECEIVER_EMAIL,
                    "name": "Himanshu"
                }
            ],

            # Reply button will reply to visitor
            "replyTo": {
                "email": email,
                "name": name
            },

            "subject": f"[Portfolio Contact] {subject}",

            "textContent": email_body
        }


        encoded_payload = json.dumps(
            payload
        ).encode("utf-8")


        brevo_request = urllib.request.Request(

            BREVO_API_URL,

            data=encoded_payload,

            method="POST",

            headers={
                "accept": "application/json",
                "api-key": BREVO_API_KEY,
                "content-type": "application/json"
            }
        )


        # ==================================
        # SEND EMAIL
        # ==================================

        with urllib.request.urlopen(
            brevo_request,
            timeout=20
        ) as response:

            response_body = response.read().decode(
                "utf-8"
            )

            result = json.loads(
                response_body
            )


        # ==================================
        # SUCCESS
        # ==================================

        return jsonify({
            "success": True,
            "message": "Message transmitted successfully.",
            "message_id": result.get("messageId")
        }), 200


    # ======================================
    # BREVO API ERROR
    # ======================================

    except urllib.error.HTTPError as error:

        error_body = error.read().decode(
            "utf-8",
            errors="replace"
        )

        print(
            "BREVO API ERROR:",
            error.code,
            error_body
        )

        return jsonify({
            "success": False,
            "message": "Unable to send message."
        }), 500


    # ======================================
    # OTHER ERROR
    # ======================================

    except Exception as error:

        print(
            "CONTACT ERROR:",
            error
        )

        return jsonify({
            "success": False,
            "message": "Unable to transmit message."
        }), 500


# ==========================================
# FRONTEND FILES
# ==========================================

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
# LOCAL DEVELOPMENT
# ==========================================

if __name__ == "__main__":

    print("=" * 55)
    print("HK CYBER OS PORTFOLIO")
    print("=" * 55)

    print("Website:")
    print("http://127.0.0.1:5000")

    print()

    print("Health:")
    print("http://127.0.0.1:5000/api/health")

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )