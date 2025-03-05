// setupUserCookie.js
const request = require('supertest'); 
const app = require('../../api');         

// This function handles the logic of creating a user and getting the cookie
const setupUserCookie = async (name, email) => {

  // Create a test user
  const userRes = await request(app)
    .post("/user/signup")
    .send({
      name: name,
      email: email,
      password: "hashedpassword",
    });

  const userObj = userRes.body;

  // Log in the user to get an authenticated session cookie
  const loginRes = await request(app)
    .post("/user/login")
    .send({ email: email, password: "hashedpassword" });

  // Extract the cookie from login response
  const cookieObj = loginRes.headers["set-cookie"];

  // Return both user and cookie for use in test files
  return { cookieObj, userObj };
};

module.exports = setupUserCookie;
