const request = require('supertest');
const app = require('../../api');
const sequelize = require('../../src/config/database');
const { Product, ProductReview } = require('../../src/models/index')
const setupUserCookie = require('../setup/setupUserCookie')

let user;
let cookie;

//Call before each test to login & setup user cookie, then use as needed for authorisation routes 
beforeEach(async () => {
  const { cookieObj, userObj } = await setupUserCookie('Test User', 'testuser@example.com');
  user = userObj;
  cookie = cookieObj;

  //Populate products
  try {
    const products = await Product.bulkCreate([
      {id: 1, name: 'Dragon Quest 3', price: 46.95, stock: 7 },
      {id: 2, name: 'Red Dead Redemption 2', price: 17.99, stock: 21 },
      {id: 3, name: 'Avowed', price: 59.99, stock: 32 }
    ]);
  } catch (err) {
    console.error('Error creating products:', err);
  }

});

describe('Product Route:', () => {

  test('All Products Retrieved', async () => {

    const res = await request(app)
      .get(`/products`)

    expect(res.statusCode).toBe(200);

    expect(Array.isArray(res.body)).toBe(true);
    
    expect(res.body[1]).toHaveProperty('name', 'Red Dead Redemption 2');
    expect(res.body[1]).toHaveProperty('price', '17.99');
    expect(res.body[1]).toHaveProperty('stock', 21);

  });

  test('Single Products Retrieved', async () => {

    const res = await request(app)
      .get(`/products/3`)

    expect(res.statusCode).toBe(200);

    expect(res.body).toHaveProperty('name', 'Avowed');
    expect(res.body).toHaveProperty('price', '59.99');
    expect(res.body).toHaveProperty('stock', 32);

  });

  test('Update Product Stock', async () => {

    const res = await request(app)
      .put(`/products/3/stock`)
      .set('Cookie', cookie)
      .send({stock: 134});

    expect(res.statusCode).toBe(200);

    expect(res.body).toHaveProperty('message', 'Stock Updated');
    expect(res.body.product).toHaveProperty('name', 'Avowed');
    expect(res.body.product).toHaveProperty('price', '59.99');
    expect(res.body.product).toHaveProperty('stock', 134);

  });

  test('Update Product Stock Below 0', async () => {

    const res = await request(app)
      .put(`/products/3/stock`)
      .set('Cookie', cookie)
      .send({stock: -1});

    expect(res.statusCode).toBe(400);

    expect(res.body).toHaveProperty('message', 'Invalid Stock Value');
  });

  test('Get Specific Product Reviews', async () => {
    
    // Create Additional User
    const reviewUserAwait = await setupUserCookie('Test Reviewer', 'testreviewer@example.com');
    const reviewUser = reviewUserAwait.userObj;

    
    //Populate Product Reviews
    ProductReview.bulkCreate(
      [
        {id: 1, product_id: 1, user_id: reviewUser.id, rating: 4, comment: 'Battle sprites suck!'},
        {id: 2, product_id: 1, user_id: user.id, rating: 5, comment: 'Nostalgia at its best!'},
        {id: 3, product_id: 3, user_id: reviewUser.id, rating: 5, comment: 'Skyrim on legs.'}
      ]
    )

    const res = await request(app)
      .get(`/products/1/reviews`)

    expect(res.statusCode).toBe(200);

    expect(Array.isArray(res.body)).toBe(true);
    
    console.log(res.body);

    expect(res.body[0]).toMatchObject({id: 1, product_id: 1, user_id: reviewUser.id, rating: 4, comment: 'Battle sprites suck!'})
    expect(res.body[1]).toMatchObject({id: 2, product_id: 1, user_id: user.id, rating: 5, comment: 'Nostalgia at its best!'});

  })
  
  test('Create Product Review', async () => {
    const res = await request(app)
      .post(`/products/${user.id}/1/reviews`)
      .set('cookie', cookie)
      .send({rating: 4, comment: 'Test reviews are the best'})

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Review Added');
    expect(res.body.review).toHaveProperty('id', 1);
    expect(res.body.review).toHaveProperty('product_id', 1);
    expect(res.body.review).toHaveProperty('user_id', user.id);
    expect(res.body.review).toHaveProperty('rating', 4);
    expect(res.body.review).toHaveProperty('comment', 'Test reviews are the best');

  }) 

});

afterAll(async () => {
    await sequelize.close();
});


