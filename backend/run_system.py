#!/usr/bin/env python3
"""
CARDEX Tourism Database System - Startup Script
This script starts the Flask server and opens the client form and admin dashboard in your browser.
"""

import os
import sys
import time
import webbrowser
import subprocess
import threading

def check_dependencies():
    """Check if required packages are installed"""
    try:
        import flask
        import flask_cors
        print("Flask dependencies found")
    except ImportError:
        print("Missing dependencies. Please run: pip install -r requirements.txt")
        sys.exit(1)

def start_server():
    """Start the Flask server"""
    print("\n" + "="*50)
    print("   CARDEX Tourism Database System")
    print("="*50)
    print("\nStarting Flask server...")
    print("Database: SQLite (cardex_clients.db)")
    print("Uploads: uploads/ directory")
    print("Admin users: admin, manager")

    # Import and run the Flask app
    from cardex_database import app

    # Run in a separate thread so we can open browser
    def run_flask():
        app.run(host='0.0.0.0', port=5000, debug=False)

    server_thread = threading.Thread(target=run_flask, daemon=True)
    server_thread.start()

    # Wait for server to start
    time.sleep(2)

    return server_thread

def open_browser():
    """Open the form and admin dashboard in browser"""
    print("\nOpening browser...")
    print("Client Form: http://localhost:5000/")
    print("Admin Dashboard: http://localhost:5000/static/admin-dashboard.html")

    try:
        # Open form
        webbrowser.open('http://localhost:5000/')
        time.sleep(1)
        # Open admin dashboard in new tab
        webbrowser.open_new_tab('http://localhost:5000/static/admin-dashboard.html')
    except Exception as e:
        print(f"⚠️  Could not open browser automatically: {e}")
        print("Please manually open: http://localhost:5000/")

def show_instructions():
    """Show usage instructions"""
    print("\n" + "="*50)
    print("   HOW TO USE THE SYSTEM")
    print("="*50)
    print("\nCLIENT FORM:")
    print("   URL: http://localhost:5000/")
    print("   - Fill out the 4-step form")
    print("   - Submit to create client records")
    print("   - File uploads supported (PDF, DOCX, images)")
    print("\nADMIN DASHBOARD:")
    print("   URL: http://localhost:5000/static/admin-dashboard.html")
    print("   - View all client submissions")
    print("   - Search and filter clients")
    print("   - Update status and assignments")
    print("   - Export data to CSV")
    print("   - Real-time statistics")
    print("\nADMIN ACCOUNTS:")
    print("   Username: admin    | Password: N/A (no auth yet)")
    print("   Username: manager  | Password: N/A (no auth yet)")
    print("   Both can modify client data")
    print("\nTO STOP:")
    print("   Press Ctrl+C in this terminal")
    print("\n" + "="*50)

def main():
    """Main startup function"""
    print("Checking dependencies...")
    check_dependencies()

    # Start the server
    server_thread = start_server()

    # Open browser
    open_browser()

    # Show instructions
    show_instructions()

    print("\nSystem is running! Press Ctrl+C to stop.")
    print("Check the terminal for server logs...")

    try:
        # Keep the main thread alive
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\n\nShutting down CARDEX system...")
        print("Thank you for using CARDEX Tourism Database!")
        sys.exit(0)

if __name__ == "__main__":
    main()