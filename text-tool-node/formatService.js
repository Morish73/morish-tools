function format({
    inputText = '',
    mode = 'normal',
    sortOrder = 'none',
    inputDelimiter = 'newline',
    outputDelimiter = 'newline',
    quoteType = 'none',
    options = []
  }) {
    if (!inputText || !inputText.trim()) {
      return '';
    }
  
    let items = splitInput(inputText, inputDelimiter);
  
    // trim指定時のみ前後空白削除
    if (options.includes('trim')) {
      items = items.map(item => item.trim());
    }
  
    // 空要素除去
    items = items.filter(item => item.length > 0);
  
    // 重複削除
    if (options.includes('dedupe')) {
      items = [...new Set(items)];
    }
  
    // ソート
    if (sortOrder !== 'none') {
      items = sortItems(items, sortOrder);
    }
  
    // モード別処理
    if (mode === 'sqlIn') {
      return toSqlIn(items);
    }
  
    if (mode === 'jsonString') {
      return toJsonArray(items);
    }
  
    // 通常整形時のみクォート適用
    if (quoteType !== 'none') {
      items = applyQuotes(items, quoteType);
    }
  
    return joinOutput(items, outputDelimiter);
  }
  
  /**
   * 入力テキストを指定区切りで分割する
   */
  function splitInput(inputText, inputDelimiter) {
    switch (inputDelimiter) {
      case 'comma':
        return inputText.split(',');
  
      case 'space':
        // 半角/全角スペースをまとめて扱う
        return inputText.split(/[ 　]+/);
  
      case 'tab':
        return inputText.split('\t');
  
      case 'newline':
        return inputText
          .replace(/\r\n/g, '\n')
          .replace(/\r/g, '\n')
          .split('\n');
  
      default:
        return inputText
          .replace(/\r\n/g, '\n')
          .replace(/\r/g, '\n')
          .split('\n');
    }
  }
  
  /**
   * 出力区切り文字で結合する
   */
  function joinOutput(items, outputDelimiter) {
    const delimiter = getOutputDelimiter(outputDelimiter);
    return items.join(delimiter);
  }
  
  function getOutputDelimiter(outputDelimiter) {
    switch (outputDelimiter) {
      case 'comma':
        return ', ';
      case 'space':
        return ' ';
      case 'tab':
        return '\t';
      case 'newline':
        return '\n';
      default:
        return '\n';
    }
  }
  
  /**
   * ソート処理
   * 数字だけの値は数値として比較、それ以外は日本語ロケールで比較
   */
  function sortItems(items, sortOrder) {
    const sorted = [...items];
  
    sorted.sort((a, b) => {
      const aTrimmed = a.trim();
      const bTrimmed = b.trim();
  
      const aIsNumeric = isNumeric(aTrimmed);
      const bIsNumeric = isNumeric(bTrimmed);
  
      let result = 0;
  
      if (aIsNumeric && bIsNumeric) {
        result = Number(aTrimmed) - Number(bTrimmed);
      } else {
        result = aTrimmed.localeCompare(bTrimmed, 'ja');
      }
  
      return sortOrder === 'desc' ? -result : result;
    });
  
    return sorted;
  }
  
  function isNumeric(value) {
    return value !== '' && !Number.isNaN(Number(value));
  }
  
  /**
   * 囲み文字を適用する
   */
  function applyQuotes(items, quoteType) {
    switch (quoteType) {
      case 'double':
        return items.map(item => `"${escapeDoubleQuote(item)}"`);
  
      case 'single':
        return items.map(item => `'${escapeSingleQuote(item)}'`);
  
      default:
        return items;
    }
  }
  
  /**
   * SQL IN句用
   * 例: ('Java', 'Python', 'AWS')
   */
  function toSqlIn(items) {
    const quoted = items.map(item => `'${escapeSingleQuote(stripOuterQuotes(item))}'`);
    return `(${quoted.join(', ')})`;
  }
  
  /**
   * JSON配列文字列
   * 例: ["Java","Python","AWS"]
   */
  function toJsonArray(items) {
    return JSON.stringify(items);
  }
  
  /**
   * すでに外側に付いているクォートを軽く剥がす
   */
  function stripOuterQuotes(text) {
    if (
      (text.startsWith('"') && text.endsWith('"')) ||
      (text.startsWith("'") && text.endsWith("'"))
    ) {
      return text.slice(1, -1);
    }
    return text;
  }
  
  function escapeSingleQuote(text) {
    return text.replace(/'/g, "''");
  }
  
  function escapeDoubleQuote(text) {
    return text.replace(/"/g, '\\"');
  }
  
  module.exports = {
    format
  };