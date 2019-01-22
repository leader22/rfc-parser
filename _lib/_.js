const cheerio = require('cheerio');
const parseSectionsFromDOM = require('./parse-sections-from-dom');

class Figure {
  constructor() {
    this.type = 'figure';
    this.tokens = [];
  }
  add(token) {
    this.tokens.push(token);
  }
}
class Paragraph {
  constructor() {
    this.type = 'paragraph';
    this.tokens = [];
  }
  add(token) {
    this.tokens.push(token);
  }
  append(token) {
    if (this.tokens.length === 0) {
      return this.add(token);
    }

    const last = this.tokens[this.tokens.length - 1];
    if (last.type !== 'text') {
      return this.add(token);
    }

    last.text += token.text;
  }
}

function parse(htmlString) {
  const $ = cheerio.load(htmlString);

  const sections = parseSectionsFromDOM($);
  for (const section of sections) {
    if (['19.'].includes(section.id)) {
    section.tokens = squashTokens(
      finalizeText(
        markFigureTokens(
          splitByParagraph(section.lines)
        )
      )
    );
    }

    // TEMP
    if (['19.'].includes(section.id)) {
      // console.log(`${'#'.repeat(section.lv)} ${section.id} ${section.title}`);
      // section.tokens.forEach(t => {
      //   console.log(t.type);
      //   t.tokens.forEach(tt => console.log('', tt.type));
      // });
      // console.log(section.tokens.slice(0, 7));
    }
  }

  return sections;
}

function squashTokens(tokens) {
  const contents = [];

  let curToken = null;
  for (const token of tokens) {
    if (token.type === 'space') {
      // contents.push(token);
      // just need to reset
      curToken = null;
      continue;
    }

    if (token.type === 'figure') {
      if (!curToken || curToken instanceof Figure === false) {
        curToken = new Figure();
        contents.push(curToken);
      }

      curToken.add(token);
      continue;
    }

    if (token.type === 'text' || token.type === 'link') {
      // starts with lower case should be placed to last paragraph
      if (token.type === 'text' && /^[ a-z]{2}/.test(token.text)) {
        contents[contents.length - 1].append(token);
        continue;
      }
      if (!curToken || curToken instanceof Paragraph === false) {
        curToken = new Paragraph();
        contents.push(curToken);
      }
      curToken.add(token);
      continue;
    }
  }

  console.log(contents);

  return contents;
}

function markFigureTokens(tokens) {
  const figureIdx = [];
  // first, find idx of `Figure: N`
  for (const token of tokens) {
    if (/^\s{10,}Figure/.test(token.text)) {
      figureIdx.push(tokens.indexOf(token));
    }
  }

  for (let toIdx of figureIdx) {
    while (toIdx) {
      const target = tokens[toIdx];

      if (/^\s{3}\w/.test(target.text)) {
        // maybe space(between text and figure)
        tokens[toIdx + 1].type = 'space';
        break;
      } else {
        target.type = 'figure';
      }

      toIdx--;
    }
  }

  return tokens;
}

function splitByParagraph(tokens) {
  const contents = [];

  for (const token of tokens) {
    // detect paragraph
    for (const line of token.text.split(/\n{2}/)) {
      // ignore padding
      if (line.length === 0) { continue; }

      // split paragraph
      if (contents.length && contents[contents.length - 1].type === 'text') {
        contents.push({ type: 'space', text: '' });
      }

      contents.push({ type: 'text', text: line });
    }
  }

  return contents;
}


function finalizeText(tokens) {
  for (const token of tokens) {
    if (!(token.type === 'text' || token.type === 'link')) {
      continue;
    }

    // manual start padding
    if (token.text.startsWith('  ')) {
      token.text = token.text.slice(3);
    }

    // manual line break
    token.text = token.text.replace(/\n {2}/g, '');
  }

  return tokens;
}

module.exports = { parse };
