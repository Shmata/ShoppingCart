const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const products = require('./products.json');

const app = express();

app.use(express.static(__dirname + '/static'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/products', (req, res) => {
  setTimeout(() => {
    res.send(products);
  }, 500);
});

app.post('/contact', (req, res) => {
  const { name, email, title, text } = req.body;

  if (!name || typeof name !== 'string' || name.length === 0) {
    res
      .status(400)
      .json({ success: false, error: 'فیلد نام و نام خانوادگی الزامی است.' });
    return;
  }

  if (!email || typeof email !== 'string' || email.length === 0) {
    res.status(400).json({ success: false, error: 'فیلد ایمیل الزامی است.' });
    return;
  }

  if (!title || typeof title !== 'string' || title.length === 0) {
    res.status(400).json({ success: false, error: 'فیلد عنوان الزامی است.' });
    return;
  }

  res.send({ success: true });
});

app.post('/buy', (req, res) => {
  const { cart } = req.body;

  const q = cart.map(item => item.quantity).reduce((a, b) => a + b);

  console.log(q);

  res.send({ success: true, q });
});

app.listen(3000);
