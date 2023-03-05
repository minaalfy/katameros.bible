const fs = require('fs');
const { URLSearchParams } = require('url');
const { fetchBuilder, FileSystemCache } = require('node-fetch-cache');

const cacheOptions = {
  cacheDirectory: './katameros-preparation/articles/cache',
};
const fetch = fetchBuilder.withCache(new FileSystemCache(cacheOptions));

const {
  pentecostArticles,
  greatLentArticles,
  sundaysArticles,
  specialArticles,
  annualArticles,
} = require('./constants/articles');

const directories = [
  './src/articles/pentecost',
  './src/articles/great-lent',
  './src/articles/sundays',
  './src/articles/annual',
  './src/articles/special',
  './katameros-preparation/articles/pentecost',
  './katameros-preparation/articles/great-lent',
  './katameros-preparation/articles/sundays',
  './katameros-preparation/articles/annual',
  './katameros-preparation/articles/special',
];

for (const d of directories) {
  if (!fs.existsSync(d)) {
    fs.mkdirSync(d, { recursive: true });
  }
}

const greatLentData = fs.readFileSync(
  './katameros-prep/data/great-lent-readings.json',
);
const greatLent = JSON.parse(greatLentData);

const pentecostData = fs.readFileSync(
  './katameros-prep/data/pentecost-readings.json',
);
const pentecost = JSON.parse(pentecostData);

const sundaysData = fs.readFileSync(
  './katameros-prep/data/sunday-readings.json',
);
const sundays = JSON.parse(sundaysData);

const annualData = fs.readFileSync(
  './katameros-prep/data/annual-readings.json',
);
const annual = JSON.parse(annualData);

const specialData = fs.readFileSync(
  './katameros-prep/data/special-readings.json',
);
const special = JSON.parse(specialData);

async function createDayContent(permalink, title, day, articleContent) {
  let cleanedArticleContent = articleContent
    .replaceAll('ـ', '')
    .replaceAll('&nbsp;', '')
    .replaceAll('', '');
  const content = `---
layout: 'layouts/reading.html'
title: '${title}'
permalink: ${permalink}
---
  {% block content %}
    <section id="readings">
      <ul>
      {% if '${day.V_Psalm_Ref}' != 'null' %}
      <li class="mb-2" x-data="{selected:false}">
        <button type="button" class="w-full px-4 py-2 bg-[#c46325] text-white text-xl" @click="selected =! selected">
          <div class="flex items-center justify-between">
            <span class="kufi">العشية</span>
            <span class="ico-plus" :class="selected && 'opened'" aria-hidden="true"></span>
          </div>
        </button>
        <div class="relative overflow-hidden transition-all max-h-0 duration-300" x-ref="container1" x-bind:style="selected ? 'max-height: ' + $refs.container1.scrollHeight + 'px' : ''">
          <div class="p-4">
          {% makeVespers '${day.V_Psalm_Ref ? day.V_Psalm_Ref : ''}' '${
    day.V_Gospel_Ref ? day.V_Gospel_Ref : ''
  }' %}
          </div>
        </div>
      </li>
      {% endif %}
      <li class="mb-2" x-data="{selected:false}">
        <button type="button" class="w-full px-4 py-2 bg-[#c46325] text-white text-xl" @click="selected =! selected">
          <div class="flex items-center justify-between">
            <span class="kufi">باكر</span>
            <span class="ico-plus" :class="selected && 'opened'" aria-hidden="true"></span>
          </div>
        </button>
        <div class="relative overflow-hidden transition-all max-h-0 duration-300" x-ref="container1" x-bind:style="selected ? 'max-height: ' + $refs.container1.scrollHeight + 'px' : ''">
          <div class="p-4">
          {% makeMatins '${day.M_Psalm_Ref}' '${day.M_Gospel_Ref}' '${
    day.Prophecy ? day.Prophecy : ''
  }' %}
          </div>
        </div>
      </li>
      <li class="mb-2" x-data="{selected:false}">
        <button type="button" class="w-full px-4 py-2 bg-[#c46325] text-white text-xl" @click="selected =! selected">
          <h3 class="flex items-center justify-between">
            <span class="kufi">القداس</span>
            <span class="ico-plus" :class="selected && 'opened'" aria-hidden="true"></span>
          </h3>
        </button>
        <div class="relative overflow-hidden transition-all max-h-0 duration-300" x-ref="container1" x-bind:style="selected ? 'max-height: ' + $refs.container1.scrollHeight + 'px' : ''">
          <div class="p-4">
          {% makeLitugy '${day.P_Gospel_Ref}' '${day.C_Gospel_Ref}' '${
    day.X_Gospel_Ref
  }' '${day.L_Psalm_Ref}' '${day.L_Gospel_Ref}' %}
          </div>
        </div>
      </li>
        </ul>
    </section>
    <section id="article">
      <h3 class="mt-8 mb-4 heading-explain">شرح القراءات</h3>
      {% createArticleAccordions firstName, lastName %}
        ${cleanedArticleContent}
      {% endcreateArticleAccordions %}
    </section>
  {% endblock %}
  `;
  return content;
}
async function writeDayFiles(day, filename, articles) {
  const name = `./src/articles/${filename}.liquid`;
  const jsonPath = `./katameros-preparation/articles/${filename}.json`;

  const articleResponse = await fetch(
    'https://katameros.bible/wp-json/wp/v2/reads/' +
      articles[day.Id] +
      '?' +
      new URLSearchParams({
        _fields: 'title,content',
      }),
  );
  const articleJson = await articleResponse.text();

  const title = JSON.parse(articleJson).title.rendered;
  const articleContent = JSON.parse(articleJson).content.rendered;

  const content = await createDayContent(
    `${filename}.html`,
    title,
    day,
    articleContent,
  );

  fs.writeFile(name, content, (err) => {
    if (err) {
      return console.error(
        `Autsch! Failed to store ${filename} template: ${err.message}.`,
      );
    }
  });

  fs.writeFile(jsonPath, articleJson, (err) => {
    if (err) {
      return console.error(
        `Autsch! Failed to create ${filename} article jsons: ${err.message}.`,
      );
    }
  });
}

async function writeAllFiles() {
  for (const day of pentecost) {
    await writeDayFiles(
      day,
      `pentecost/${day.Week}-${day.DayOfWeek}`,
      pentecostArticles,
    );
  }
  for (const day of greatLent) {
    await writeDayFiles(
      day,
      `great-lent/${day.Week}-${day.DayOfWeek}`,
      greatLentArticles,
    );
  }
  for (const day of sundays) {
    await writeDayFiles(
      day,
      `sundays/${day.Month_Number}-${day.Day}`,
      sundaysArticles,
    );
  }
  for (const day of annual) {
    await writeDayFiles(
      day,
      `annual/${day.Month_Number}-${day.Day}`,
      annualArticles,
    );
  }
  for (const day of special) {
    await writeDayFiles(day, `special/${day.Id}`, specialArticles);
  }
}

writeAllFiles();
