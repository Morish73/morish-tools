
function buildPrompt(form) {
  const theme = form.theme?.trim() || "";
  const audience = form.audience?.trim() || "一般読者";
  const purpose = form.purpose?.trim() || "読者にわかりやすく情報を伝える";
  const materials = form.materials?.trim() || "特になし";
  const keywords = form.keywords?.trim() || "特になし";
  const references = form.references?.trim() || "特になし";
  const tone = form.tone?.trim() || "わかりやすく親しみやすい文体";
  const length = form.length?.trim() || "3000文字前後";
  const structureStyle = form.structureStyle?.trim() || "導入→本文→まとめ";
  const headingCount = form.headingCount?.trim() || "3〜5個";
  const forbiddenExpressions = form.forbiddenExpressions?.trim() || "なし";
  const differentiation = form.differentiation?.trim() || "実用性を重視する";

  const seo = form.seo === "on" ? "SEOを意識してください" : "SEOは過度に意識しなくて構いません";
  const simpleWords = form.simpleWords === "on"
    ? "専門用語はできるだけかみ砕いて説明してください"
    : "専門用語は必要に応じて使用して構いません";
  const cta = form.cta === "on"
    ? "記事の最後に自然なCTAを入れてください"
    : "CTAは不要です";

  if (!theme) {
    return {
      error: "記事テーマは必須です。",
      prompt: ""
    };
  }

  const warnings = [];
  if (!form.audience?.trim()) warnings.push("想定読者が未入力のため、「一般読者」を補完しました。");
  if (!form.purpose?.trim()) warnings.push("記事の目的が未入力のため、汎用的な目的を補完しました。");
  if (!form.length?.trim()) warnings.push("文字数が未入力のため、「3000文字前後」を補完しました。");

  const prompt = `
あなたはプロの日本語Webライター兼編集者です。
以下の条件に従って、高品質なブログ記事を作成してください。

【記事テーマ】
${theme}

【想定読者】
${audience}

【記事の目的】
${purpose}

【記事に含めたい情報】
${materials}

【参考キーワード】
${keywords}

【参考URL・メモ】
${references}

【文体】
${tone}

【文字数の目安】
${length}

【構成スタイル】
${structureStyle}

【見出し数の目安】
${headingCount}

【SEO方針】
${seo}

【専門用語の扱い】
${simpleWords}

【避けたい表現】
${forbiddenExpressions}

【差別化ポイント】
${differentiation}

【CTA】
${cta}

【出力要件】
- まず記事タイトル案を3つ提示してください
- 次に導入文を書いてください
- 次に見出し構成を作成してください
- その後、記事本文を完成させてください
- 見出しは読者が理解しやすい順序にしてください
- 内容は具体的で、抽象論だけで終わらせないでください
- 必要に応じて箇条書きも使ってください
- 出力はMarkdown形式にしてください
`.trim();

  return {
    error: "",
    warnings,
    prompt
  };
}

module.exports = {
    buildPrompt
  };