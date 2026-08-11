const cjkSegmenter = new Intl.Segmenter('zh', { granularity: 'word' });

function addCjkSubtokens(token: string, output: Set<string>) {
  const characters = [...token];
  if (characters.length < 2) return;
  for (let index = 0; index < characters.length - 1; index += 1) {
    output.add(`${characters[index]}${characters[index + 1]}`);
  }
}

export const cjkTokenizer = {
  language: 'cjk',
  normalizationCache: new Map<string, string>(),
  tokenize(raw: string) {
    const output = new Set<string>();
    const normalized = raw.normalize('NFKC').toLocaleLowerCase();

    for (const segment of cjkSegmenter.segment(normalized)) {
      const token = segment.segment.trim();
      if (!token || (!segment.isWordLike && !/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/u.test(token))) {
        continue;
      }
      output.add(token);
      addCjkSubtokens(token, output);
    }

    return [...output];
  },
};
