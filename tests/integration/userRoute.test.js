const request = require('supertest');
const app = require('../../api');
const sequelize = require('../../src/config/database');
const setupUserCookie = require('../setup/setupUserCookie')

let user;
let cookie;

//Call before each test to login & setup user cookie, then use as needed for authorisation routes 
beforeEach(async () => {
  const { cookieObj, userObj } = await setupUserCookie('Test User', 'testuser@example.com');
  user = userObj;
  cookie = cookieObj;
});

describe('User Route:', () => {

  test('User Created & Login Success (Authentication Test)', async() => {
    // Create a test user
    const userRes = await request(app)
    .post("/user/signup")
    .send({
      name: "Test Auth",
      email: "testauth@example.com",
      password: "hashedpasswordauth",
    });

    // Log in the user to get an authenticated session cookie
    const loginRes = await request(app)
      .post("/user/login")
      .send({ email: "testauth@example.com", password: "hashedpasswordauth" });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.headers['set-cookie'].findIndex((arrItem) => arrItem.includes('connect.sid'))).toBeGreaterThanOrEqual(0);

  })
  
  test('User Retrieved ', async () => {
    
    const res = await request(app)
      .get(`/user/${user.id}`)
      .set('Cookie', cookie)

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', user.id);
    expect(res.body).toHaveProperty('name', user.name);
    expect(res.body).toHaveProperty('email', user.email);
  });

  test('User is Not Found', async () => {
    const res = await request(app)
      .get('/user/999')
      .set('Cookie', cookie); 

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('message', 'User Not Found');
  });

  test('User Updated', async () => {
    
    const res = await request(app)
      .put(`/user/${user.id}`)
      .set('Cookie', cookie)
      .send({name: 'Test Updated', email: 'testupdated@example.com'})

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', user.id);
    expect(res.body).toHaveProperty('name', 'Test Updated');
    expect(res.body).toHaveProperty('email', 'testupdated@example.com');
  });

});


afterAll(async () => {
    await sequelize.close();
});


