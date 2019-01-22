const fs = require('fs');
const { parse } = require('.');

const no = '5389';
// const no = '8445';
const html = fs.readFileSync(`./txt/rfc${no}.txt`, { encoding: 'utf8' });
parse(html);
