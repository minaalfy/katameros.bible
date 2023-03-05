# Katameros.bible

It's nice to have a look on the stack used here.
[11ty](https://www.11ty.dev/), powered by [Vite](https://vitejs.dev/)
with [Tailwind CSS](https://tailwindcss.com) and
[Alpine.js](https://github.com/alpinejs/alpine/).

## Install Dependencies

First, make sure you have `npm` (packaged with
[Node.js](https://nodejs.org)) installed, then run `npm run setup` to install
the dependencies and validate that everything is running correctly.

## Available Scripts
### Fetch data from WP `npm run create`
- Please note that this script gonna takes sometime to run completely, be patient with it.
- This script you should run only if you want to refetch all wp content from the server, otherwise please skip this step and jump to `npm run dev`.
- We need to develop a similar scrip that can update 're fetch' one/momre articles from wp to be used in case we update an article.

### Development

```bash
# runs the app in the development mode.
npm run dev
```

Open http://localhost:8080/ to view it in your browser.

The page will reload if you make file changes.

### Production

```bash
# builds a static copy of your site to the `_site_/` folder.
npm run build
```

```bash
# serve the content from the `_site_/` folder.
npm run preview
```

Open http://localhost:5000/ to view it in your browser.

Your code is now ready to be deployed!

## Code structure
- Special thanks to [pierresaid](https://github.com/pierresaid).
- Content for Katameros data coming from this repo [katameros-api](https://github.com/pierresaid/katameros-api), Also the logic for getting the right readings for a specific date heavily inspired from that repo.

- There's 2 kind of content here first we fetch WP content into JSON files cached and stored in the folder katameros-preparation/articles/
- Then we build .liquid files "compiles to html using [11ty](https://www.11ty.dev/) later" 
First we get the katameros data for that specific day reading and then get the json files containing the article from wp for that specific date and build HTML structure for them in a .liquid file 
- .liquid files compiles to HTML using [11ty](https://www.11ty.dev/), shortcodes `makeVespers` for displaying html content for Vespers reading, `makeMatins` similar for Matins reading, `makeLitugy` for Mass readings, `createArticleAccordions` for creating clean HTML from the WP article content with good appeal.
- Styling using [Tailwind CSS](https://tailwindcss.com) + some custom CSS in the file styles/main.css, I did used basic look & feel app and open for changing the design.
- Logic for fetching content and build JSON/liquid Files are in a simple nodejs script `katameros-preparation/fetch-content.js` please read it and suggest any refactor needed.
- Logic for redirecting to the right article URL on a date input by the user stored in `src/main.js` please read it.

## Road map for the known issues and suggested features
- All days should work as expected except the Paskha days + palm sunday, so I'm currently will focus on this.
- Add 11ty plugin to generate sitemap.xml to be subimtted to search engines.
- Add google analytics to the template with cookie consent.
- Integrate a searching tool (ex: Algolia search).
- Personally I don't like the sliding animation for opening the navigation menu on mobile and see it's not smooth, also the Parchment SVG filter isn't working as expected on mobile so I've removed it from mmobile screens until fixing it.
- I'm gonna add the list very soon, please feel free to add your suggessions here.
