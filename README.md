# Project Eleven: Poverty Line

## Overview
The **Poverty Line** project aims to address the global challenge of poverty, particularly in Sub-Saharan Africa, where a significant portion of the population lives below the internationally agreed poverty line. The project focuses on providing tools for **social integration**, **employment generation**, and **poverty eradication** by creating a platform for users to manage data related to poverty levels, social backgrounds, and more.

## Problem Statement
While global poverty rates have decreased significantly since 2000, millions of people, especially in developing regions, continue to live on less than Ksh 190 a day — the international poverty line. In Sub-Saharan Africa, 42% of the population still lives below this line.

Poverty goes beyond income deficiencies and includes issues such as:
- **Hunger and malnutrition**
- **Limited access to education and other basic services**
- **Social exclusion and discrimination**
- **Lack of participation in decision-making**

In 2015, more than 736 million people lived below the international poverty line. Vulnerable groups, such as women and children, are disproportionately affected, with more than 160 million children at risk of continuing to live in extreme poverty by 2030.

## Solution
**Blah Company** has identified three core areas to address the issue of global poverty:
- **Poverty Eradication**: Providing actionable tools and data for individuals and organizations to combat poverty.
- **Employment Generation**: Creating opportunities for income generation and self-sufficiency.
- **Social Integration**: Enabling marginalized groups to gain equal access to opportunities, services, and decision-making platforms.

This platform provides a user-friendly interface for managing poverty-related records, enabling users to classify and categorize data, interact with others, and make informed decisions to help tackle poverty.

## Features

### MVP Features
1. **User Registration & Login**:
   - Users can create accounts and log in securely.

2. **Social Login Integration**:
   - Users can log in using **Google** or **GitHub** accounts via **Firebase Authentication** for seamless social integration.

3. **Profile Creation**:
   - Users can create and manage their profiles, adding personal details and information relevant to poverty-related data.

4. **Record Management**:
   - Users can create, update, and delete records related to poverty data, allowing them to maintain a dynamic and accurate system.

5. **Categorization**:
   - Users can categorize and sort records based on various criteria such as region, social background, etc.

6. **Search Functionality**:
   - Users can search through the records to find relevant data based on filters or keywords.

7. **User Interaction**:
   - Users can view and interact with records from other users, enabling collaboration and data sharing.

## Technical Specifications

### Backend:
- **Framework**: Flask  
  Flask is used to build a RESTful API to handle requests from the frontend and provide access to the database.

- **Database**: PostgreSQL with SQLAlchemy  
  SQLAlchemy is used as an ORM to interact with PostgreSQL for data storage and retrieval.

- **Authentication**: Firebase Authentication  
  Handles secure login and registration using social authentication methods (Google and GitHub).

- **API Security**: Token-based Authentication (e.g., JWT)  
  Ensures secure access to the API and protects sensitive user data.

### Frontend:
- **Framework**: ReactJS  
  ReactJS is used to create a dynamic and responsive user interface.

- **State Management**: Context API or Redux Toolkit  
  Used to manage global state across the application, ensuring consistent data flow between components.

- **UI Design**: Figma  
  Designed wireframes using Figma for a responsive and mobile-friendly layout.

### Testing:
- **Testing Framework**: Pytest  
  Pytest is used to write unit and integration tests for the backend to ensure that all features are working correctly.

## API Endpoints

### User Management:
| Endpoint               | Description                                  |
|------------------------|----------------------------------------------|
| `GET /users`            | Get a list of current active users           |
| `GET /users/<user_id>`  | Get details of a specific user by ID         |

### Record Management:
| Endpoint               | Description                                  |
|------------------------|----------------------------------------------|
| `GET /<record>`         | Retrieve all records                         |
| `POST /<record>`        | Create a new record                          |
| `PUT /<record>`         | Update an existing record                    |

### Authentication:
| Endpoint               | Description                                  |
|------------------------|----------------------------------------------|
| `POST /auth/google`     | Google Authentication via Firebase           |
| `POST /auth/github`     | GitHub Authentication via Firebase           |

### Security
All API endpoints will be secured with token-based authentication to ensure that only authorized users can access sensitive data.  
Tokens (such as JWT) are issued upon login and must be included in the request header for all protected endpoints.

## Firebase Authentication

**Firebase Authentication** is integrated into this project to provide an easy and secure way for users to log in using their existing Google and GitHub accounts.

### Setup and Configuration

1. **Create a Firebase Project**:
   - To start using Firebase Authentication, you need to create a Firebase project via the [Firebase Console](https://console.firebase.google.com/).
   - Once your project is created, you can enable different authentication providers like Google and GitHub.

2. **Enable Authentication Providers**:
   - In the Firebase Console, navigate to the **Authentication** section.
   - Under the **Sign-in method** tab, enable **Google** and **GitHub** as authentication providers.
   - For Google, you simply enable it and provide a project support email.
   - For GitHub, you will need to configure OAuth credentials by registering your application on GitHub and copying the **Client ID** and **Client Secret** into Firebase.

3. **Integrating Firebase in the Frontend**:
   - Firebase Authentication SDK is integrated into the frontend (ReactJS). It allows users to log in through their Google or GitHub accounts, and Firebase will handle all the heavy lifting for managing sessions, tokens, and user details.

4. **Token Management**:
   - After a user successfully logs in using either Google or GitHub, Firebase returns a token. This token can be sent to the Flask backend for further verification and to establish a user session.
   - The backend uses **Firebase Admin SDK** to verify the token and ensure the user's authenticity.

5. **Backend Token Validation**:
   - On the backend, **Firebase Admin SDK** is used to verify the Firebase ID token, ensuring that it is valid and has been issued by Firebase Authentication. If the token is valid, the backend grants access to the user’s data or requested resources.

6. **Security Considerations**:
   - By using Firebase Authentication, sensitive user data such as passwords is not stored on your backend. Instead, Firebase handles authentication securely, and only an authenticated token is passed to your backend.
   - Firebase also allows the easy management of user authentication states and supports features like password resets, email verification, and multi-factor authentication.

## Technical Expectations

### Frontend
- **State Management**: Use **Context API** or **Redux Toolkit** to manage state across the application.
- **Responsive Design**: The app should be mobile-friendly with responsive UI elements designed using **Figma**.

### Backend
- **Flask** is used to create the server-side logic and handle API requests.
- Use **SQLAlchemy** as the ORM to interact with a PostgreSQL database.
- Secure the API with **Firebase Authentication** for Google and GitHub login.

### Testing:
- Write unit and integration tests using **Pytest** for testing backend logic and ensuring reliability.

## Getting Started

### 1. Clone the repository
