const express = require('express');
const path = require('path');
const formatService = require('./formatService');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.render('index', {
    inputText: '',
    outputText: '',
    error: null
  });
});

app.post('/format', (req, res) => {
  const inputText = req.body.inputText || '';

  try {
    const outputText = formatService.formatText(inputText);
    res.render('index', {
      inputText,
      outputText,
      error: null
    });
  } catch (e) {
    res.render('index', {
      inputText,
      outputText: '',
      error: '変換に失敗しました'
    });
  }
});

// ローカル実行用
if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}


// Vercel用
module.exports = app;