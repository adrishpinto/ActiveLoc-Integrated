npm install

first terminal:

1.cd client

2.npm install

3.npm run dev

second terminal:

1.cd server

2.npm install

3.npm start

setup:
create .env file in server

add your email and password for otp to work, if nodemailer does not work for email, enable two factor auth and create application process or use a different service (change transporter from gmail to other service). JWT_KEY should remain the same as it is hard coded into frontend.

URI = mongodb+srv://user1234:1234@cluster0.edxwi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

EMAIL_USER= your_email

EMAIL_PASS= your_password

JWT_KEY = asd1u2h2u89h9ansixnc

frontend is set-up already if API's don't work check the .env URI to make sure it is the correct URL (VITE_URI=http://localhost:3000)
if data is not updating to database use a different mongoDB atlas cluster (create a new one as this cluster may not work for all ip).
