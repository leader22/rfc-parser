module.exports = function parseSectionsFromDOM($) {
  let curSection = null;
  const sections = [];

  $('pre.newpage').each((_, el) => {
    // span(as header), span(as page anchor), a, textNode, ...
    $(el).contents().each((_, el) => {
      const $el = $(el);

      // ignorable (e.g. page footer
      if (isIgnorableNode($el)) {
        return;
      }

      // if header
      if (isSectionHeaderNode($el)) {
        const [id, title] = $el.text().split(/\s{2,}/);

        curSection = {
          id, title,
          lv: getSectionLevel(id),
          tokens: [],
          lines: [],
        };
        sections.push(curSection);

        return;
      }

      // if text before first header
      if (curSection === null) {
        return;
      }

      const text = $el.text();
      if (text.trim().length === 0) {
        return;
      }

      curSection.lines.push( text );
    });
  });

  return sections;
};

function isIgnorableNode($el) {
  if ($el.is('span') && $el.hasClass('grey')) {
    return true;
  }
  if ($el.is('a') && $el.hasClass('invisible')) {
    return true;
  }

  return false;
}

function isSectionHeaderNode($el) {
  return $el.is('span') && /h[2-6]/.test($el.attr('class'));
}

function getSectionLevel(id) {
  return id.split('.').length - 1;
}
