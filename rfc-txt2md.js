const fs = require('fs');
const { parse } = require('.');

const html = fs.readFileSync('./txt/rfc5389.txt', { encoding: 'utf8' });
const { meta, sections } = parse(html);

console.log(`# ${meta.title}`);
console.log('## ToC');
for (const toc of meta.toc) {
  console.log(`- ${toc}`);
}
console.log('## Main');
for (const section of sections) {
  console.log(`### ${section.title}`);
  console.log('');

  for (const token of section.body) {
    if (token.type === 'figure') {
      console.log('');
      console.log('```');
    }
    console.log(token.text);
    if (token.type === 'figure') {
      console.log('```');
      console.log('');
    }
  }
  console.log('');
}
