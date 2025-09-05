# Event Management System

EventX is a full-stack web application for managing events, booking tickets, and scanning QR codes.  
Built with **MERN Stack (MongoDB, Express, React, Node.js)**.

---

##  Features

###  User
- View upcoming events.
- Book seats and pay online (dummy payment).
- Download QR code tickets.
- Manage & view personal tickets. 

###  Admin
- Create, update, and delete events.
- View all bookings and tickets.
- Scan tickets (QR validation).
- Manage users and system.

---

##  Tech Stack

- **Frontend:** React, TailwindCSS, Axios, React Router. 
- **Backend:** Node.js, Express.js, JWT Authentication.
- **Database:** MongoDB (Mongoose ODM).
- **Other:** QRCode Generator, bcryptjs, jsonwebtoken.

---

##  Sample Data

The project includes **sample JSON data** to simulate users, events, and tickets for testing and demonstration purposes.

Data files are located here:
backend/data/
├── eventx.users.json
├── eventx.events.json
└── eventx.tickets.json


نسخ الكود

 Note: The old `seed.js` script is no longer needed. The application now directly supports loading from MongoDB or falling back to JSON data.

---

##  Running the Project

 Backend

cd backend
npm install
npm run dev

Frontend
cd frontend/client
npm install
npm start

 Deployment
I tried multiple times to deploy the project online (Netlify, Render, Vercel), but unfortunately I couldn’t complete the deployment successfully:

https://event-management-system-j3ti-lehdjfmlc-rawan-2112s-projects.vercel.app

https://stellular-sunburst-6f5034.netlify.app/

However, the full project is working fine locally.

نسخ الكود
