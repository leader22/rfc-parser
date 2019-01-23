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

  console.log(sectionsData[5]);
  console.log(sections[5]);
  // sections.forEach(section => {
  //   console.log(section.title);
  // });

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
  const figureIdx = [];
  // first, find idx of `Figure: N`
  for (const line of data) {
    if (/^\s{10,}Figure/.test(line)) {
      figureIdx.push(data.indexOf(line));
    }
  }
  return data;
}

module.exports = { parse };
