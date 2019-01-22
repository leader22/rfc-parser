const tocRe = / \.{2,}\d+$/;

module.exports = function finalizeMeta(metaData) {
  const meta = {
    title: '',
    abstract: [],
    toc: [],
  };

  for (const line of metaData.title) {
    meta.title += line.trim() + ' ';
  }
  meta.title.trim();

  // TODO: finalize abstract as same as section contents

  let needConcat = false;
  const tempToc = [];
  for (let line of metaData.toc) {
    line = line.trim();

    if (needConcat) {
      tempToc[tempToc.length - 1] += (' ' + line);
      needConcat = false;
      continue;
    }
    // endsWith page number
    if (tocRe.test(line)) {
      tempToc.push(line);
    }
    // if not, need to append next one to last
    else {
      tempToc.push(line);
      needConcat = true;
    }
  }

  for (const toc of tempToc) {
    const [title] = toc.split(tocRe);
    meta.toc.push(title);
  }

  return meta;
};
