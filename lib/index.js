const stripPages = require('./strip-page');
const readMeta = require('./read-meta');
const finalizeMeta = require('./finalize-meta');
const readBody = require('./read-body');

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
  readBody(sections, meta.toc.slice(), lines.slice(metaIdx));

  console.log(sections[0]);

  return '';
}


module.exports = { parse };
