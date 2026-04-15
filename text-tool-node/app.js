const express = require('express');
const formatService = require('./formatService');

const app = express();
const PORT = 3000;

// EJSをテンプレートエンジンとして使う
app.set('view engine', 'ejs');

// formのPOSTを受け取れるようにする
app.use(express.urlencoded({ extended: true }));

// 初期表示
app.get('/', (req, res) => {
  res.render('index', {
    inputText: '',
    outputText: '',
    message: 'テキストを貼り付けて整形方法を選んでください。'
  });
});

// 整形実行
app.post('/format', (req, res) => {
  const inputText = req.body.inputText || '';
  const mode = req.body.mode || '';

  const outputText = formatService.format(inputText, mode);

  res.render('index', {
    inputText,
    outputText,
    message: `整形しました: ${mode}`
  });
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT} で起動中`);
});