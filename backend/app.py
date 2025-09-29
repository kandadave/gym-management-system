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

# Custom error handler to ensure CORS headers
@app.errorhandler(Exception)
def handle_error(error):
    logging.error(f"Unhandled error: {str(error)}")
    response = jsonify({'error': str(error)})
    response.status_code = 500
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    return response

if __name__ == '__main__':
    app.run(debug=True)