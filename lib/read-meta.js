const headDateRe = /^\s+\w+ \d{4}$/;

// Parse meta info like title, toc..
module.exports = function readMeta(meta, lines) {
  let offset = 0;
  while (offset < lines.length) {
    const line = lines[offset];

    // get title of this RFC
    // title follows after date
    if (headDateRe.test(line)) {
      // +1: found date
      offset++;

      while (this) {
        const line = lines[offset];
        // skip blank until content
        if (line === '') {
          offset++;
        } else {
          // then skip until blank
          while (this) {
            const line = lines[offset];
            if (line !== '') {
              meta.title.push(line);
              offset++;
            } else {
              break;
            }
          }

          break;
        }
      }

      continue;
    }

    // get abstract
    if (line === 'Abstract') {
      // +1: found date
      offset++;
      // +1: blank between abstract header and content
      offset++;

      while (this) {
        const line = lines[offset];
        if (line === '' || line.startsWith('   ')) {
          meta.abstract.push(line);
          offset++;
        } else {
          break;
        }
      }

      continue;
    }

    // get toc
    if (line === 'Table of Contents') {
      // +1: found date
      offset++;
      // +1: blank between toc header and content
      offset++;

      while (this) {
        const line = lines[offset];
        if (line !== '') {
          meta.toc.push(line);
          offset++;
        } else {
          // maybe `1. Xxx`
          meta.toc.pop();
          offset--;
          break;
        }
      }

      // finish meta
      break;
    }

    offset++;
  }

  return offset;
};
