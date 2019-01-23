const stripPages = require('./strip-page');
const readMeta = require('./read-meta');
const finalizeMeta = require('./finalize-meta');
const readBody = require('./read-body');

function parse(rawText) {
  console.clear();
  const lines = stripPages(rawText);

  const metaData = {
    title: [],
    abstract: [],
    toc: [],
  };
  const metaIdx = readMeta(metaData, lines);
  const meta = finalizeMeta(metaData);

  const sectionsData = [];
  readBody(sectionsData, meta.toc.slice(), lines.slice(metaIdx));
  const sections = finalizeBody(sectionsData);

  // console.log(sectionsData[5]);
  // console.log(sections[5]);
  // sections.forEach(section => {
    // console.log(section.title);
  // });
  sections;

  debugger;

  return '';
}

const trimArr = arr => {
  if (arr[0] === '') {
    arr.shift();
  }
  if (arr[arr.length - 1] === '') {
    arr.pop();
  }
};

function finalizeBody(sectionsData) {
  const sections = [];

  for (const sectionData of sectionsData) {
    const [title, ...bodyData] = sectionData;

    trimArr(bodyData);
    const body = finalizeSection(bodyData);

    sections.push({ title, body });
  }

  return sections;
}

function finalizeSection(data) {
  const tokens = [];

  const figureIdx = [];
  // first, find idx of `Figure: N`
  for (const line of data) {
    if (/^\s{10,}Figure/.test(line)) {
      figureIdx.push(data.indexOf(line));
      tokens.push({ type: 'figure', value: line });
    } else {
      // may include figure
      tokens.push({ type: 'text', value: line });
    }
  }

  // escape figures
  if (figureIdx.length !== 0) {
    for (let toIdx of figureIdx) {
      while (toIdx) {
        const target = tokens[toIdx];

        if (/^\s{3}\w/.test(target.value)) {
          // maybe space between text and figure start
          const token = tokens[toIdx + 1];
          if (token.value === '') {
            token.type = 'text';
          }
          break;
        } else {
          target.type = 'figure';
        }

        toIdx--;
      }
    }
  }

  // TODO: trim and join and squash

  return tokens;
}

module.exports = { parse };
