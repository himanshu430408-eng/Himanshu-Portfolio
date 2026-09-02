#!/bin/bash

# ==========================================
# HK CYBER OS - PORTFOLIO LAUNCHER
# ==========================================

PROJECT_DIR="$(cd "$(dirname "$0")" && pwd)"
VENV="$HOME/my_python_envs/project1/bin/activate"

BACKEND_DIR="$PROJECT_DIR/backend"

BACKEND_PORT=5000
FRONTEND_PORT=8000


echo "=========================================="
echo "        HK CYBER OS PORTFOLIO"
echo "=========================================="
echo


# ==========================================
# CHECK VIRTUAL ENVIRONMENT
# ==========================================

if [ ! -f "$VENV" ]; then
    echo "[ERROR] Python virtual environment not found:"
    echo "$VENV"
    exit 1
fi

echo "[+] Activating Python environment..."

source "$VENV"


# ==========================================
# CHECK BACKEND
# ==========================================

if [ ! -f "$BACKEND_DIR/app.py" ]; then
    echo "[ERROR] backend/app.py not found."
    exit 1
fi


# ==========================================
# CHECK FRONTEND
# ==========================================

if [ ! -f "$PROJECT_DIR/index.html" ]; then
    echo "[ERROR] index.html not found."
    exit 1
fi


# ==========================================
# CLEANUP FUNCTION
# ==========================================

cleanup() {

    echo
    echo "[*] Shutting down HK Cyber OS..."

    kill "$BACKEND_PID" 2>/dev/null
    kill "$FRONTEND_PID" 2>/dev/null

    echo "[+] Backend stopped."
    echo "[+] Frontend stopped."

    exit 0
}

trap cleanup SIGINT SIGTERM


# ==========================================
# START BACKEND
# ==========================================

echo "[+] Starting Contact Backend..."

cd "$BACKEND_DIR"

python app.py &

BACKEND_PID=$!

sleep 2


# ==========================================
# START FRONTEND
# ==========================================

echo "[+] Starting Portfolio Frontend..."

cd "$PROJECT_DIR"

python -m http.server "$FRONTEND_PORT" --bind 127.0.0.1 &

FRONTEND_PID=$!

sleep 2


# ==========================================
# SERVER INFORMATION
# ==========================================

echo
echo "=========================================="
echo "           SYSTEM ONLINE"
echo "=========================================="
echo
echo "Frontend:"
echo "http://127.0.0.1:$FRONTEND_PORT"
echo
echo "Backend:"
echo "http://127.0.0.1:$BACKEND_PORT"
echo
echo "Backend Health:"
echo "http://127.0.0.1:$BACKEND_PORT/api/health"
echo
echo "Press CTRL+C to stop everything."
echo


# ==========================================
# OPEN PORTFOLIO
# ==========================================

if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "http://127.0.0.1:$FRONTEND_PORT" >/dev/null 2>&1 &
fi


# ==========================================
# KEEP SCRIPT RUNNING
# ==========================================

wait