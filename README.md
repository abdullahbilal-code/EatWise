
# EatWise - Nutrition Appointment Management System

EatWise is a full-stack web application developed as part of an academic project. It allows users to submit health-related details and enables nutritionists to review these submissions, propose appointment slots, and manage appointments through an interactive dashboard.

##  Tech Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT (JSON Web Tokens)

---

##  User Roles

### 1. Regular Users
- Register and log in
- Submit health details (weight, height, goal, diseases, etc.)
- View appointment confirmations/cancellations (future scope)

### 2. Nutritionists
- View all submitted user profiles
- Propose appointment slots (date, time, purpose)
- View proposed appointments and their statuses

---

## Features

###  User Dashboard
- Submit health information via form
- Logout functionality
- Handles token-based form submission securely

###  Nutritionist Dashboard
- View all users and submitted health data
- Propose appointments via interactive form
- View own proposed slots and statuses

###  Authentication
- Secure login and registration using JWT
- Protected routes via middleware

