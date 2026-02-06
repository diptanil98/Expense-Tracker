# 💰 Expense Tracker

A full-stack expense tracking application built with modern web technologies to help users manage their finances efficiently.

![TypeScript](https://img.shields.io/badge/TypeScript-85.9%25-blue)
![JavaScript](https://img.shields.io/badge/JavaScript-13.1%25-yellow)


## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Application](#running-the-application)
- [Usage](#usage)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [Contact](#contact)

## 🎯 Overview

Expense Tracker is a comprehensive financial management tool that allows users to track their income and expenses, categorize transactions, and visualize their spending patterns. The application provides an intuitive interface for managing personal finances with real-time updates and detailed analytics.

## ✨ Features

- **Transaction Management**
  - Add, edit, and delete income/expense transactions
  - Categorize transactions for better organization
  - Add notes and descriptions to transactions
  - Date-based transaction recording

- **Financial Analytics**
  - Real-time balance calculation
  - Monthly/yearly expense summaries
  - Category-wise spending breakdown
  - Visual charts and graphs for data visualization

- **User Experience**
  - Clean and intuitive user interface
  - Responsive design for mobile and desktop
  - Fast and seamless user experience
  - Real-time data updates

- **Data Management**
  - Secure data storage
  - Data persistence
  - Export functionality for reports

## 🛠️ Tech Stack

### Frontend
- **TypeScript** - Type-safe JavaScript
- **React** - UI component library
- **Modern CSS** - Styling and responsive design
- **State Management** - For application state handling

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **TypeScript** - Type-safe backend development
- **RESTful API** - API architecture

### Database
- **MongoDB** 
## 📁 Project Structure
```
Expense-Tracker/
├── Backend/                 # Backend API server
│   ├── src/                # Source files
│   ├── controllers/        # Route controllers
│   ├── models/            # Data models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   └── config/            # Configuration files
│
├── Frontend/              # Frontend application
│   └── Expense-Tracker/  
│       ├── src/          # React source files
│       ├── components/   # React components
│       ├── pages/        # Page components
│       ├── services/     # API services
│       ├── utils/        # Utility functions
│       └── public/       # Static assets
│
└── README.md             # Project documentation
```

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v14.0 or higher)
- **npm** or **yarn** package manager
- **MongoDB** or **PostgreSQL** (depending on your database choice)
- **Git** for version control

### Installation

1. **Clone the repository**
```bash
   git clone https://github.com/diptanil98/Expense-Tracker.git
   cd Expense-Tracker
```

2. **Install Backend Dependencies**
```bash
   cd Backend
   npm install
```

3. **Install Frontend Dependencies**
```bash
   cd ../Frontend/Expense-Tracker
   npm install
```

4. **Environment Configuration**
   
   Create a `.env` file in the Backend directory:
```env
   PORT=5000
   DATABASE_URL=your_database_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
```

   Create a `.env` file in the Frontend directory:
```env
   REACT_APP_API_URL=http://localhost:5000/api
```

### Running the Application

1. **Start the Backend Server**
```bash
   cd Backend
   npm run dev
```
   The backend server will run on `http://localhost:5000`

2. **Start the Frontend Application**
```bash
   cd Frontend/Expense-Tracker
   npm start
```
   The frontend will run on `http://localhost:3000`

3. **Access the Application**
   
   Open your browser and navigate to `http://localhost:3000`

## 💡 Usage

1. **Adding Transactions**
   - Click on "Add Transaction" button
   - Select transaction type (Income/Expense)
   - Enter amount, category, and description
   - Set the transaction date
   - Click "Save" to record the transaction

2. **Viewing Analytics**
   - Navigate to the Dashboard to see your financial overview
   - View category-wise spending charts
   - Check monthly trends and patterns

3. **Managing Categories**
   - Create custom categories for better organization
   - Edit or delete existing categories
   - Assign colors to categories for visual distinction

4.  **Smart Receipt Upload**
   - Click on "Upload Receipt" or drag and drop a receipt image
   - The system automatically scans and extracts:
     - Transaction amount
     - Merchant/vendor name
     - Transaction date
     - Items purchased (if applicable)
   - Review and edit the auto-filled information
   - Assign a category if not auto-detected
   - Click "Save" to add the transaction
   - Original receipt image is stored for future reference



## 📸 Screenshots

<!-- Add screenshots of your application here -->
![WhatsApp Image 2026-02-06 at 8 40 01 PM](https://github.com/user-attachments/assets/cf1f522d-93be-4445-ba8c-ca944ab4fc80)
![WhatsApp Image 2026-02-06 at 8 40 40 PM](https://github.com/user-attachments/assets/9880eb16-deb6-4ac2-a5ca-8037f50965ca)
![WhatsApp Image 2026-02-06 at 8 41 13 PM](https://github.com/user-attachments/assets/42a02330-9425-484f-9b84-a4a053f39c01)
![WhatsApp Image 2026-02-06 at 8 41 13 PM](https://github.com/user-attachments/assets/5ed09518-3ffc-4346-8fe1-25668c34c56a)
![WhatsApp Image 2026-02-06 at 8 45 40 PM](https://github.com/user-attachments/assets/7ad36a4a-fd4a-4050-8b9b-2d79a4535704)
![WhatsApp Image 2026-02-06 at 8 45 40 PM (1)](https://github.com/user-attachments/assets/ebe0b668-dda3-4b13-adae-641d4fb20d5a)


## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/YourFeature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/YourFeature`)
5. Open a Pull Request

### Contribution Guidelines
- Write clean, maintainable code
- Follow the existing code style
- Add appropriate comments and documentation
- Test your changes thoroughly
- Update the README if needed


## 👤 Contact

**Diptanil Saha**

- GitHub: [@diptanil98](https://github.com/diptanil98)
- Project Link:[Expenzo](https://expenzo-frontend-6tgx.onrender.com/)

---

## 🌟 Acknowledgments

- Thanks to all contributors who help improve this project
- Inspired by modern expense tracking applications
- Built with love and TypeScript ❤️

---

**If you find this project helpful, please give it a ⭐️!**
