const lineRe = /[\r|\n]/;
const pageHeaderRe = /^RFC \d+[\s\w]+ \d+$/;
const pageFooterRe = /\s+\[Page \d+\]$/;

// Remove page header and footer and their padding
module.exports = function stripPages(txt) {
  const lines = txt.trim().split(lineRe);
  const realLines = [];

  let offset = 0;
  while (offset < lines.length) {
    const line = lines[offset];

    if (pageFooterRe.test(line)) {
      // remove blank between content and footer
      while (this) {
        const line = realLines.pop();
        if (line !== '') {
          // need to restore
          realLines.push(line);
          break;
        }
      }

      // +1: found footer
      offset++;

      // remove blank between footer and header
      while (this) {
        const line = lines[offset];
        if (!pageHeaderRe.test(line)) {
          offset++;
          // last page has only footer(no header)
          if (offset > lines.length) { break; }
        } else {
          break;
        }
      }

      continue;
    }

    if (pageHeaderRe.test(line)) {
      // +1: found header
      offset++;

      // remove blank between header and content
      while (this) {
        const line = lines[offset];
        if (line === '') {
          offset++;
        } else {
          break;
        }
      }

      continue;
    }

    realLines.push(line);
    offset++;
  }

  return realLines;
};
