const request = require('supertest');
const app = require('../../api');
const sequelize = require('../../src/config/database');
const { Product } = require('../../src/models/index')
const setupUserCookie = require('../setup/setupUserCookie')

let user;
let cookie;

//Call before each test to login & setup user cookie, then use as needed for authorisation routes 
beforeEach(async () => {
  const { cookieObj, userObj } = await setupUserCookie('Test User', 'testuser@example.com');
  user = userObj;
  cookie = cookieObj;  

});

describe('Order Route:', () => {

  test('Create Order, Get Order', async () => {
    
    //Create Products for Order
    try {
      const products = await Product.bulkCreate([
        {id: 1, name: 'Dragon Quest 3', price: 46.95, stock: 7 },
        {id: 2, name: 'Red Dead Redemption 2', price: 17.99, stock: 21 },
        {id: 3, name: 'Avowed', price: 59.99, stock: 32 }
      ]);
    } catch (err) {
      console.error('Error creating products:', err);
    }

    const resPost = await request(app)
      .post(`/orders/${user.id}`)
      .set('cookie', cookie)
      .send({items:[{product_id: 1, quantity: 2},{product_id: 3, quantity: 1}]})

    expect(resPost.statusCode).toBe(201);
    expect(resPost.body).toHaveProperty('message', 'Order Created');
    expect(resPost.body.order).toHaveProperty('id', 1);
    expect(resPost.body.order).toHaveProperty('user_id', user.id);
    expect(resPost.body.order).toHaveProperty('total', 153.89000000000001);
    expect(resPost.body.order).toHaveProperty('status', 'pending');


    //get Order object to test the get order route
    const resGet = await request(app)
      .get(`/orders/${user.id}/1`)
      .set('cookie', cookie)

      console.log('resgetttttt', resGet.body)

      expect(resGet.statusCode).toBe(200);
      //Check OrderItems are correct
      expect(resGet.body.items[0]).toMatchObject({ order_id: 1, product_id: 1, quantity: 2 });
      expect(resGet.body.items[1]).toMatchObject({ order_id: 1, product_id: 3, quantity: 1 });

      //Check product stock
      const resProduct1 = await request(app)
      .get(`/products/1`);
      const resProduct2 = await request(app)
      .get(`/products/3`)

      expect(resProduct1.body).toHaveProperty('stock', 5);
      expect(resProduct2.body).toHaveProperty('stock', 31);


  }) 

})

afterAll(async () => {
  await sequelize.close();
});

