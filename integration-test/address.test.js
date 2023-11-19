const request = require('supertest');
const uuid = require('uuid');

const appUrl = 'http://30.102.23.142';

test('Register a customer and verify updated customer list', async () => {
  // Register a new customer using the /register endpoint
  const registerResponse = await request(appUrl)
    .post('/register')
    .send({
      email: 'test123@gmail.com',
      firstName: 'test',
      lastName: 'test',
      password: 'testpassword100',
      username: 'testuser100'
    });

  expect(registerResponse.status).toBe(200);
  expect(registerResponse.body.id).toBeDefined();

  // Setting cookie value
  let cookie_value = '';
  const setCookieHeader = registerResponse.headers['set-cookie'];
  if (setCookieHeader) {
    const cookies = setCookieHeader.map((cookie) => cookie.split(';')[0]);
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      // Checking if cookie includes logged_in value or not
      if (cookie.includes('logged_in')) {
        const cookieValue = cookie.split('=')[1];
        // Setting cookie value
        cookie_value = cookieValue;
        break;
      }
    }
  }

  const registeredUserId = registerResponse.body.id;

  // Add address to the customer
  const addAddressResponse = await request(appUrl)
    .post('/address')
    .send({
      id: uuid.v4(), // Dynamically generate a unique ID
      city: 'Ghaziabad',
      country: 'India',
      number: '213289312',
      postcode: '32132',
      street: 'temp',
      custId: `${registeredUserId}`
    })
    .set('Cookie', `logged_in=${cookie_value}`);

  expect(addAddressResponse.status).toBe(200);

  // Retrieve the address
  const address = await request(appUrl)
    .get('/address')
    .query({ custId: `${registeredUserId}` })
    .set('Cookie', `logged_in=${cookie_value}`);

  expect(address.status).toBe(200);
  expect(address.body).toBeDefined(); 
});
