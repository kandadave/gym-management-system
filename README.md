# Gym Management System

A robust web application for managing gym operations, built with React (frontend), Flask (backend), and PostgreSQL (database), featuring role-based access for users, trainers, and admins.

By David Chumo and Adreen Githinji

## Description

This application streamlines gym management by providing a platform where users can register, log in, and track their subscriptions, attendance, and health profiles. Trainers can manage classes and trainees, while admins oversee users, trainers, and subscription plans. The system leverages a live backend API built with Flask and a PostgreSQL database, ensuring a persistent and scalable experience. It showcases advanced front-end development concepts like React routing, form handling with Formik and Yup, and Tailwind CSS for responsive design.

## Features

  * **User Authentication**: Secure registration and login for users, trainers, and admins with role-based access.
  * **User Dashboard**: Displays subscription plans, trainer details, attendance history, and class RSVPs with days left on subscriptions.
  * **Trainer Dashboard**: Allows trainers to create and manage workout classes and view their assigned trainees.
  * **Admin Dashboard**: Enables admins to create, edit, and delete users, trainers, and subscription plans, plus assign trainers to users.
  * **Subscription Management**: Users can register for plans, with restrictions preventing overlap, and admins can define new plans.
  * **Attendance Tracking**: Features a GitHub-like calendar to visualize attendance and real-time marking.
  * **Class RSVP System**: Users can RSVP for classes, with trainers managing class schedules.
  * **Responsive Design**: A modern, interactive UI that adapts to desktop, tablet, and mobile devices using Tailwind CSS.
  * **Real-Time Updates**: Seamless data fetching and updates via API calls to the Flask backend.

## Screenshot

![User Dashboard](<Screenshot from 2025-09-30 23-15-43.png>)

## How to Use

### Requirements

  * A computer with **Node.js** and **npm** installed (for frontend).
  * **Python 3.x** and **pip** (for backend).
  * PostgreSQL database (local or hosted).
  * Access to the internet.
  * A modern web browser (e.g., Chrome, Firefox, Edge, Safari).
  * A code editor (VS Code recommended).
  * Terminal/Command Line.

### View Live Site

Visit the deployed application at: [Gym Management System](https://gym-management-system2.netlify.app/)

The live site allows you to:
  * Register and log in as a user, trainer, or admin.
  * Manage subscriptions, attendance, and classes.
  * Administer users, trainers, and plans.

### Local Development

To run the project locally, follow these steps:

#### Installation Process

1. **Clone this repository** using:

    ```bash
    git clone https://github.com/kandadave/gym-management-system.git
    ```

    or download a ZIP file of the code.

2. **Navigate to the project directory**:

    ```bash
    cd gym-management-system
    ```

3. **Set up the Backend**:
   - Install Python dependencies:
     ```bash
     cd backend
     pip install -r requirements.txt
     ```
   - Configure environment variables in a `.env` file (e.g., `DATABASE_URL`, `SECRET_KEY`, `JWT_SECRET_KEY`, mail settings).
   - Initialize the database:
     ```bash
     flask db init
     flask db migrate -m "Initial migration"
     flask db upgrade
     ```
   - Run the Flask app:
     ```bash
     python app.py
     ```

4. **Set up the Frontend**:
   - Install Node dependencies:
     ```bash
     cd ../frontend
     npm install
     ```
   - Start the development server:
     ```bash
     npm start
     ```
   - Open `http://localhost:3000` in your browser.

## Technologies Used

  * **React**: For building the dynamic front-end interface.
  * **Flask**: For the RESTful backend API.
  * **PostgreSQL**: For persistent data storage with SQLAlchemy ORM.
  * **Tailwind CSS**: For responsive and modern styling.
  * **Formik & Yup**: For form handling and validation.
  * **JWT**: For secure authentication.
  * **GitHub Actions**: For CI/CD pipeline (if configured).

## Support and Contact Details

If you have any questions, suggestions, or need assistance, please contact:

Email: david.chumo@student.moringaschool.com

## License

```
MIT License

Copyright © 2025 David Chumo / Adreen Githinji

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```