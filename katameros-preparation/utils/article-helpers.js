const cheerio = require('cheerio');

async function createArticleAccordions(content) {
  const $ = await cheerio.load(content);
  $('div').each(function () {
    $(this).children().unwrap();
  });
  const titles = $('h3').length ? $('h3') : $('h4');
  let xData = {};
  titles.each(function (index) {
    const collapseKey = 'heading' + index;
    xData[collapseKey] = false;
    $(this)
      .unwrap()
      .wrapInner('<span class="kufi">')
      .attr('@click', `${collapseKey} = !${collapseKey}`)
      .attr('role', 'button')
      .attr('aria-controls', collapseKey)
      .attr(
        'class',
        'flex items-center justify-between w-full px-4 py-2 bg-[#c46325] text-white text-xl mt-4',
      )
      .append(
        `<span class="ico-plus" :class="${collapseKey} && 'opened'" aria-hidden="true"></span>`,
      )
      .nextUntil($('h3').length ? 'h3' : 'h4')
      .wrapAll(
        `<div class="relative overflow-hidden transition-all max-h-0 duration-300 pt-4" x-ref="${collapseKey}" id="${collapseKey}" x-bind:style="${collapseKey} ? 'max-height: ' + $refs.${collapseKey}.scrollHeight + 'px' : ''"/>`,
      );
    if ($(this).text().includes('شواهد القراءات')) {
      $(this).next('div.transition-all').remove();
      $(this).remove();
    }
  });
  titles.parent().wrap(`<div x-data='${JSON.stringify(xData)}'>`);
  return $.root().html();
}

// clean content
function cleanContent(content) {
  return content
    .replaceAll('ـ', '')
    .replaceAll('&nbsp;', '')
    .replaceAll('&#8211;', '-')
    .replace(/<([^>]+)>\s*<\/\1>/g, '')
    .replace(/<([^>]+)>\s*<\/\1>/g, '')
    .replace(/<([^>]+)>\s*<\/\1>/g, '')
    .replace(/\s(?:class|dir|lang|align)="[^"]*"/gim, '')
    .replace(/^(\s)*$\n/gim, '')
    .replaceAll('', '');
}

const hourNames = {
  '1st': 'الساعة الأولى',
  '3rd': 'الساعة الثالثة',
  '6th': 'الساعة السادسة',
  '9th': 'الساعة التاسعة',
  '11th': 'الساعة الحادية عشر',
};

module.exports = {
  createArticleAccordions,
  cleanContent,
  hourNames,
};
