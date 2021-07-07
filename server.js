const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname));

const stripe = require('stripe')('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');
//sk_test_51Ifhe0LkQ1xbpEUQZBVP3fDsfuA3NdNlTF12ZPyqavHhXHWLIpfOfPJc7B3LVvFYjmNguhirQ2YSdGIODdJxc4cc00WTsBHSwr
//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

//price_1IjpVgLkQ1xbpEUQE79DiqIj
//price_1IjpVgLkQ1xbpEUQ0eOm20MW

//test
//price_1Ijpz3LkQ1xbpEUQynLI34VR
//price_1Ijpz3LkQ1xbpEUQIROkKlwg
//==============================================================================================//
let custid;
let plan;

app.post('/plan', async (req, res) => {
  plan = req.body.plan;
  res.status(200).end();
});

app.post('/process', async (req, res) => {
    const requestParams = req.body;
    
    try {
  await stripe.paymentMethods.create({
    type: 'card',
      card: {
      number: requestParams.card.number,
      exp_month: requestParams.card.exp_month,
      exp_year: requestParams.card.exp_year,
      cvc: requestParams.card.cvc
    }
  })
  .then(paymentMethod => createCustomer(paymentMethod.id, requestParams.userInfo.email, requestParams.userInfo.userName))
  } catch(error) { console.log(error);}

    res.status(200).json({
    'title': '9'
  });

});

const createCustomer = async (paymentMethod, email, userName) => {
  try {
    await stripe.customers.create({            
      email: email,
      metadata: {
        userName: userName
      }
      }).then(customer => {
        custid = customer.id;
        attachPayment(customer.id, paymentMethod);
      });
  } catch(error) { console.log(error);}
}

const attachPayment = async (customerId, paymentMethodId) => {

  try {
  await stripe.paymentMethods.attach(
  paymentMethodId,
  {customer: customerId}
  ).then(() => updateCustomer(customerId, paymentMethodId));;
  } catch(error) { console.log(error);}       

}

const updateCustomer = async (customerId, paymentMethodId) => {

  try {
  await stripe.customers.update(
    customerId,
    {invoice_settings: {default_payment_method: paymentMethodId}} 
  ).then(() => createSubscription(customerId));
  } catch(error) {console.log(error);}       

}

const createSubscription = async customerId => {

  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {price: plan}
      ],
    })
    } catch(error) {console.log(error);}

}

let l;
let p;

app.post('/hook', (request, response) => {

l = request.body.type;
p = l === 'invoice.payment_action_required' || l ===  'invoice.payment_failed' ? request.body.data.object.hosted_invoice_url : 'Na';

console.log(l)
console.log(p);

response.status(200).end();
});

app.post('/result', (re, res) => {

    if(l === 'payment_intent.succeeded') {res.status(200).json({'title': 'Successful'});}

    if(l === 'invoice.payment_failed') {
      //del();
        res.status(200).json(
          {
            'title': 'Card Failed',
            'result': p
        });        
    }
  
    if(l === 'invoice.payment_action_required') {
      res.status(200).json(
      {
          'title': 'Bank Authentication',
          'result': p
      });
    }

})

const del = async () => {await stripe.customers.del(custid);}

 //==============================================================================================//

app.listen(
    port,
    () => console.log(`listening on - http://localhost:${port}`)
  );


//   res.status(200).json({
//     'title': 'Successful',
//     'result': customer
//   });