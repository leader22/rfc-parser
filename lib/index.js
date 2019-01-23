const stripPages = require('./strip-page');
const readMeta = require('./read-meta');
const finalizeMeta = require('./finalize-meta');
const readBody = require('./read-body');
const finalizeBody = require('./finalize-body');

console.clear();
function parse(rawText) {
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

  return { meta, sections };
}

module.exports = { parse };
