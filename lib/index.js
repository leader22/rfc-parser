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
  if (line === '') {
    return false;
  }

  return line.slice(-4) === title.slice(-4);
};

// TODO: とりあえずエラーはでないが、セクションタイトルが入り込んだりおかしい
// 本文がないセクションとかもおかしいかも
function readSections(sections, toc, lines) {
  let curSecTitle = toc.shift();
  let offset = 0;
  while (offset < lines.length) {
    const line = lines[offset];

    if (isSectionHeaderLine(line, curSecTitle)) {
      offset++;
      curSecTitle = toc.shift();

      const curSec = [];
      sections.push(curSec);

      while (this) {
        const line = lines[offset];

        // last section last line
        if (line === undefined) {
          break;
        }

        curSec.push(line);
        offset++;

        // last section
        if (curSecTitle === undefined) {
          continue;
        }

        // next section title found
        if (isSectionHeaderLine(line, curSecTitle)) {
          offset--;
          // reset outer offset++
          offset--;
          break;
        }
      }
    }

    offset++;
  }

  debugger;
  return offset;
}

module.exports = { parse };
