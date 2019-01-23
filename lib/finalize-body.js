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
    const seeds = toSeeds(bodyData);
    const body = toTokens(seeds);

    sections.push({ title, body });
  }

  return sections;
};

const normalLineRe = /^\s{3}\w+/;
const figureTitleRe = /^\s{10,}Figure/;
function toSeeds(data) {
  const seeds = [];

  const figureIdx = [];
  // first, find idx of `Figure: N`
  for (const line of data) {
    if (figureTitleRe.test(line)) {
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

function toTokens(seeds) {
  const tokens = [];
  let curToken = null;
  let lastType = null;
  for (const seed of seeds) {
    if (lastType !== seed.type) {
      curToken = {
        type: seed.type,
        seeds: [],
        text: '',
      };
      tokens.push(curToken);
    }
    curToken.seeds.push(seed);
    lastType = seed.type;
  }

  for (const token of tokens) {
    const seeds = token.seeds;

    // join line as sentence
    if (token.type === 'text') {
      let text = '';
      for (const seed of seeds) {
        text += (seed.value + ' ');
      }
      token.text = text;
    }
    else if (token.type === 'figure') {
      let text = '';
      for (const seed of seeds) {
        text += (seed.value + '\n');
      }
      token.text = text;
    }

    delete token.seeds;
  }

  return tokens;
}
