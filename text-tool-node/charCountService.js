function countCharacters(text = '') {
    const safeText = String(text);
  
    const total = safeText.length;
    const withoutSpaces = safeText.replace(/[ \u3000]/g, '').length;
    const withoutNewlines = safeText.replace(/\r?\n/g, '').length;
    const withoutSpacesAndNewlines = safeText
      .replace(/[ \u3000]/g, '')
      .replace(/\r?\n/g, '')
      .length;
  
    return {
      total,
      withoutSpaces,
      withoutNewlines,
      withoutSpacesAndNewlines
    };
  }
  
  module.exports = {
    countCharacters
  };