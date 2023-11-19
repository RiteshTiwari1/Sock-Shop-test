const request = require('supertest');
const appUrl = 'http://35.154.13.117';

test('Register a customer and verify updated customer list', async () => {
  // Register a new customer using the /register endpoint
  const registerResponse = await request(appUrl)
    .post('/register')
    .send({
            email:'test@gmail.com',
            firstName:'test',
            lastName:'test',
            password:'testpassword100',
            username:'testuser100'
          });

  expect(registerResponse.status).toBe(200);
  expect(registerResponse.body.id).toBeDefined();

 //setting cookie value
  let cookie_value = ''
  setCookieHeader=registerResponse.headers['set-cookie']
  if(setCookieHeader){
	const cookies = setCookieHeader.map((cookie) => cookie.split(';')[0]);
	for (let i = 0; i < cookies.length; i++) {
        	const cookie = cookies[i];
        	// chaecking if cookie includes logged_in value or not
        	if (cookie.includes('logged_in')) {
            		const cookieValue = cookie.split('=')[1];
            		// setting cookie value
            		cookie_value =  cookieValue;
            	break;
        	}
    	}
  }

 // add product to the cart
 const addCartResponse = await request(appUrl)
 .post('/cart')
 .send({
      id:"31db021-7a45-2313-f542-f12c2dae41g",
      name:"Yellow Sock",
      size:"small",
 })
.set('Cookie', `logged_in=${cookie_value}`);

 expect(addCartResponse.status).toBe(201)


 const registeredUserId = registerResponse.body.id;

 const cartItems = await request(appUrl)
 .get('/cart')
 .query({custId:`${registeredUserId}`})
 .set('Cookie', `logged_in=${cookie_value}`);

 cartList=JSON.parse(cartItems.text)

// check if newly added item is in the cart list or not
const newCartItem = cartList.filter((item)=>item.itemId==="31db021-7a45-2313-f542-f12c2dae41g")
expect(newCartItem).toBeDefined();

})