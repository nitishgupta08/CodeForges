#! /bin/bash
cd backend
nodemon server.js &
cd ../frontend
npm start