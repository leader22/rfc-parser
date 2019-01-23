const trimArr = arr => {
  if (arr[0] === '') {
    arr.shift();
  }
  if (arr[arr.length - 1] === '') {
    arr.pop();
  }
};

module.exports = function finalizeBody(sectionsData) {
  const sections = [];

  for (const sectionData of sectionsData) {
    const [title, ...bodyData] = sectionData;

    trimArr(bodyData);
    const body = finalizeSection(bodyData);

    sections.push({ title, body });
  }

  return sections;
};

const normalLineRe = /^\s{3}\w+/;
function finalizeSection(data) {
  const seeds = [];

  const figureIdx = [];
  // first, find idx of `Figure: N`
  for (const line of data) {
    if (/^\s{10,}Figure/.test(line)) {
      figureIdx.push(data.indexOf(line));
      seeds.push({ type: 'figure', value: line });
    } else {
      // may include figure
      seeds.push({ type: 'text', value: line });
    }
  }

  // escape figures
  if (figureIdx.length !== 0) {
    for (let toIdx of figureIdx) {
      while (toIdx) {
        const target = seeds[toIdx];

        if (normalLineRe.test(target.value)) {
          // maybe space between text and figure start
          const seed = seeds[toIdx + 1];
          if (seed.value === '') {
            seed.type = 'text';
          }
          break;
        } else {
          target.type = 'figure';
        }

        toIdx--;
      }
    }
  }

  for (const seed of seeds) {
    if (seed.type !== 'text') {
      continue;
    }

    // trim start padding
    seed.value = seed.value.trim();

    // mark space between paragraph
    if (seed.value === '') {
      seed.type = 'space';
    }
  }

  return seeds;
}
