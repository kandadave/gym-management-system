from config import app
from flask import jsonify
import routes
import logging

# Configure logging for console and file
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s %(levelname)s: %(message)s',
    handlers=[
        logging.FileHandler('backend.log'),
        logging.StreamHandler()  # Log to console
    ]
)

# Custom 404 handler
@app.errorhandler(404)
def not_found(error):
    logging.error(f"404 Not Found: {str(error)}")
    return jsonify({"error": "Not Found", "message": "The requested endpoint does not exist"}), 404


# Custom error handler to ensure CORS headers
@app.errorhandler(Exception)
def handle_error(error):
    logging.error(f"Unhandled error: {str(error)}")
    response = jsonify({'error': str(error)})
    response.status_code = 500
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000)