function format(inputText, mode) {
    if (!inputText || !inputText.trim()) {
      return '';
    }
  
    const lines = toNormalizedLines(inputText);
  
    switch (mode) {
      case 'comma':
        return toCommaSeparated(lines);
      case 'bullet':
        return toBulletList(lines);
      case 'dedupe':
        return toDedupe(lines);
      case 'trim':
        return toTrim(lines);
      case 'doubleQuote':
        return toQuoted(lines, '"');
      case 'singleQuote':
        return toQuoted(lines, "'");
      case 'sqlIn':
        return toSqlIn(lines);
      case 'sortNum':
        return sortNumeric(lines);
      case 'sortJa':
        return sortJapanese(lines);
      case 'sortEn':
        return sortEnglish(lines);
      default:
        return inputText;
    }
  }
  
  /**
   * 改行コードを統一して、trimして、空行を除外
   */
  function toNormalizedLines(inputText) {
    return inputText
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  }
  
  function toCommaSeparated(lines) {
    return lines.join(', ');
  }
  
  function toBulletList(lines) {
    return lines.map(line => `- ${line}`).join('\n');
  }
  
  function toDedupe(lines) {
    return [...new Set(lines)].join('\n');
  }
  
  function toTrim(lines) {
    return lines.join('\n');
  }
  
  function toQuoted(lines, quote) {
    return lines.map(line => `${quote}${line}${quote}`).join('\n');
  }
  
  function toSqlIn(lines) {
    const quoted = lines.map(line => `'${escapeSingleQuote(line)}'`);
    return `(${quoted.join(', ')})`;
  }
  
  function escapeSingleQuote(text) {
    return text.replace(/'/g, "''");
  }
  
  function sortNumeric(lines) {
    const sorted = [...lines];
  
    sorted.sort((a, b) => {
      const na = Number(a);
      const nb = Number(b);
  
      const aIsNum = !Number.isNaN(na);
      const bIsNum = !Number.isNaN(nb);
  
      if (aIsNum && bIsNum) {
        return na - nb;
      }
  
      return a.localeCompare(b, 'ja');
    });
  
    return sorted.join('\n');
  }
  
  function sortJapanese(lines) {
    const sorted = [...lines];
    sorted.sort((a, b) => a.localeCompare(b, 'ja'));
    return sorted.join('\n');
  }
  
  function sortEnglish(lines) {
    const sorted = [...lines];
    sorted.sort((a, b) => a.localeCompare(b, 'en', { sensitivity: 'base' }));
    return sorted.join('\n');
  }
  
  module.exports = {
    format
  };