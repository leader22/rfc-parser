const stripPages = require('./strip-page');
const readMeta = require('./read-meta');
const finalizeMeta = require('./finalize-meta');

function parse(rawText) {
  const lines = stripPages(rawText);

  const metaData = {
    title: [],
    abstract: [],
    toc: [],
  };
  const metaIdx = readMeta(metaData, lines);
  const meta = finalizeMeta(metaData);

  const sections = [];
  readSections(sections, meta.toc.slice(), lines.slice(metaIdx));

  // console.log(text);

  return '';
}

// XXX: 目次の数値とタイトルの間のスペースがバラバラなので
// とりあえず逆から数文字を適当に当てて判断する
const isSectionHeaderLine = (line, title) => {
  return line.slice(-4) === title.slice(-4);
};

function readSections(sections, toc, lines) {
  let curSecTitle = toc.shift();
  let offset = 0;
  while (offset < lines.length) {
    const line = lines[offset];

    if (isSectionHeaderLine(line, curSecTitle)) {
      offset++;

      const curSec = [];
      sections.push(curSec);

      while (this) {
        const line = lines[offset];
        // TODO: 最後のsectionでエラーになってる
        // next section title found
        if (isSectionHeaderLine(line, toc[0])) {
          curSecTitle = toc.shift();
          offset--;
          break;
        } else {
          curSec.push(line);
          offset++;
        }
      }
    }

    offset++;
  }

  debugger;
  return offset;
}

module.exports = { parse };
