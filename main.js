const fs = require('fs');
const { parse } = require('.');

const no = '5389';
// const no = '8445';
const html = fs.readFileSync(`./txt/rfc${no}.txt`, { encoding: 'utf8' });
const { meta, sections } = parse(html);

console.log(`# ${meta.title}`);
for (const section of sections) {
  if (!section.title.startsWith('2.')) { continue; }

  console.log(`## ${section.title}`);
  const body = section.body.map(b => b.value).join('\n');
  console.log(body);
}
