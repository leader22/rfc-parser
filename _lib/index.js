const cheerio = require('cheerio');

function parse(htmlString) {
  const $ = cheerio.load(htmlString);

  const all = [];
  // every page is inside `pre` element
  $('pre').each((_, el) => {
    // every `pre` has anchor, page header, header text, main text, ...
    // all of them are as `contents()`, not `children()`.
    $(el).contents().each((_, el) => {
      const $el = $(el);

      // ignorable (e.g. page footer
      if (isIgnorableNode($el)) {
        return;
      }

      console.log($el.text());
    });
  });

  return '';
}

function isIgnorableNode($el) {
  if ($el.is('span') && $el.hasClass('grey')) {
    return true;
  }
  if ($el.is('a') && $el.hasClass('invisible')) {
    return true;
  }

  return false;
}

module.exports = { parse };
