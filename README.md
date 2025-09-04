#  Event Management System

EventX is a full-stack web application for managing events, booking tickets, and scanning QR codes.  
Built with **MERN Stack (MongoDB, Express, React, Node.js)**.

---

##  Features

###  User
- View upcoming events.
- Book seats and pay online (dummy payment).
- Download QR code tickets.
- Manage & view personal tickets 

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


- 
I tried multiple times to deploy the project online (Netlify, Render, Vercel), but unfortunately I couldn’t complete the deployment successfully due to build and routing issues.

However, the full project is working fine locally.

To run the backend:

npm run dev


To run the frontend:

cd frontend/client
npm start
