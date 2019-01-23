const sectionHeaderIdRe = /\.\s+/;
const isSectionHeaderLine = (line, title) => {
  if (line === '') {
    return false;
  }
  if (title === undefined) {
    return false;
  }

  const [lineId] = line.split(sectionHeaderIdRe);
  const [titleId] = title.split(sectionHeaderIdRe);
  return lineId === titleId;
};

// Parse section body
module.exports = function readBody(sections, toc, lines) {
  let curSecTitle = toc.shift();
  let offset = 0;
  while (offset < lines.length) {
    const line = lines[offset];

    if (isSectionHeaderLine(line, curSecTitle)) {
      // for this section
      const curSec = [];
      sections.push(curSec);

      // for next section
      curSecTitle = toc.shift();

      while (this) {
        const line = lines[offset];

        // last section last line
        if (line === undefined) {
          return offset;
        }

        // next section title found
        if (isSectionHeaderLine(line, curSecTitle)) {
          // reset outer offset++
          offset--;
          break;
        }

        curSec.push(line);
        offset++;
      }
    }

    offset++;
  }
};
