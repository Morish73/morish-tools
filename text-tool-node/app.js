const express = require('express');
const path = require('path');
const formatService = require('./formatService');
const charCountService = require('./charCountService');
const promptMakingService = require('./promptMakingService');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/', (req, res) => {
  res.render('home');
});


app.get('/text-format', (req, res) => {
  res.render('index', {
    inputText: '',
    outputText: '',
    message: 'テキストを貼り付けて整形方法を選んでください。',

    mode: 'normal',
    sortOrder: 'none',
    inputDelimiter: 'newline',
    outputDelimiter: 'newline',
    quoteType: 'none',
    options: []
  });
});


app.post('/format', (req, res) => {
  const inputText = req.body.inputText || '';
  const mode = req.body.mode || 'normal';
  const sortOrder = req.body.sortOrder || 'none';
  const inputDelimiter = req.body.inputDelimiter || 'comma';
  const outputDelimiter = req.body.outputDelimiter || 'comma';
  const quoteType = req.body.quoteType || 'none';
  const options = req.body.options
    ? Array.isArray(req.body.options) ? req.body.options : [req.body.options]
    : [];

  try {
    const outputText = formatService.format({
      inputText,
      mode,
      sortOrder,
      inputDelimiter,
      outputDelimiter,
      quoteType,
      options
    });
  
    res.render('index', {
      inputText,
      outputText,
      message: '整形しました',
      mode,
      sortOrder,
      inputDelimiter,
      outputDelimiter,
      quoteType,
      options      
    });
  } catch (e) {
    res.render('index', {
      inputText,
      outputText: '',
      message: `変換に失敗しました ${e.message}`
    });
  }
});

app.get('/char-count', (req, res) => {
  res.render('char-count', {
    inputText: '',
    outputText: '',
    message: 'テキストを貼り付けてください。',
  });
});

app.post('/char-count', (req, res) => {
  const inputText = req.body.inputText || '';
  const counts = charCountService.countCharacters(inputText);

  res.render('char-count', {
    inputText,
    counts
  });
}); 


app.get("/blog-prompt-maker", (req, res) => {
  res.render("blog-prompt-maker", {
    prompt: "",
    error: "",
    warnings: [],
    values: {}
  });
});

app.post("/generate", (req, res) => {
  const result = promptMakingService.buildPrompt(req.body);

  res.render("blog-prompt-maker", {
    prompt: result.prompt,
    error: result.error,
    warnings: result.warnings || [],
    values: req.body
  });
});



app.get('/privacy-policy', (req, res) => {
  res.render('privacy-policy');
});

app.get('/contact', (req, res) => {
  res.render('contact');
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