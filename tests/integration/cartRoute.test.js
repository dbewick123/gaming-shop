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

describe('Cart Route:', () => {

  test('Create a New Cart & Add Items', async () =>{
    
    //Create products for cartitems
    try {
      const products = await Product.bulkCreate([
        {id: 1, name: 'Dragon Quest 3', price: 46.95, stock: 7 },
        {id: 2, name: 'Red Dead Redemption 2', price: 17.99, stock: 21 },
        {id: 3, name: 'Avowed', price: 59.99, stock: 32 }
      ]);
    } catch (err) {
      console.error('Error creating products:', err);
    }

    const resCart = await request(app)
      .post(`/cart/${user.id}`)
      .set('cookie', cookie);

      expect(resCart.statusCode).toBe(201);
      expect(resCart.body).toMatchObject({message: 'Cart Created', cart: {id: 1, user_id: user.id}});

      const resItems = await request(app)
      .put(`/cart/${user.id}`)
      .set('cookie', cookie)
      .send({items:[{cart_id: resCart.body.cart.id, product_id: 1, quantity: 2},{cart_id: resCart.body.cart.id, product_id: 3, quantity: 1}]})

      expect(resItems.statusCode).toBe(201);
      expect(resItems.body).toMatchObject({message: 'Cart Updated Successfully', cart: { id: 1, user_id: 1 }});

      const resGetWholeCart = await request(app)
      .get(`/cart/${user.id}`)
      .set('cookie', cookie)

      expect(resGetWholeCart.body.items[0]).toMatchObject({ cart_id: resCart.body.cart.id, product_id: 1, quantity: 2, product: {id: 1, name: 'Dragon Quest 3', price: '46.95', stock: 7 } });
      expect(resGetWholeCart.body.items[1]).toMatchObject({ cart_id: resCart.body.cart.id, product_id: 3, quantity: 1, product: {id: 3, name: 'Avowed', price: '59.99', stock: 32} });
  });

});


afterAll(async () => {
  await sequelize.close();
});