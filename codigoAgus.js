const rvestjs = require('rvestjs');
const fs = require('fs');

const urls = [
  ...Array.from({ length: 513 - 8 }, (_, i) => `https://www.lacapital.com.ar/secciones/laciudad.html/${i + 8}`),
  ...Array.from({ length: 250 - 4 }, (_, i) => `https://www.lacapital.com.ar/secciones/policiales.html/${i + 4}`),
  ...Array.from({ length: 190 - 4 }, (_, i) => `https://www.lacapital.com.ar/secciones/laregion.html/${i + 4}`),
  ...Array.from({ length: 240 - 3 }, (_, i) => `https://www.lacapital.com.ar/secciones/politica.html/${i + 3}`),
  ...Array.from({ length: 230 - 5 }, (_, i) => `https://www.lacapital.com.ar/secciones/informaciongral.html/${i + 5}`),
  ...Array.from({ length: 32 }, (_, i) => `https://www.lacapital.com.ar/secciones/educacion.html/${i}`),
  ...Array.from({ length: 56 }, (_, i) => `https://www.lacapital.com.ar/secciones/edicion_impresa.html/${i}`)
];

const urls2 = [
  'https://www.lacapital.com.ar/secciones/laciudad.html/22',
  'https://www.lacapital.com.ar/secciones/laciudad.html/47',
  'https://www.lacapital.com.ar/secciones/laciudad.html/54',
  'https://www.lacapital.com.ar/secciones/laciudad.html/108',
  'https://www.lacapital.com.ar/secciones/laciudad.html/107',
  'https://www.lacapital.com.ar/secciones/laciudad.html/106',
  'https://www.lacapital.com.ar/secciones/laciudad.html/102',
  'https://www.lacapital.com.ar/secciones/laciudad.html/98',
  'https://www.lacapital.com.ar/secciones/laciudad.html/97',
  'https://www.lacapital.com.ar/secciones/laciudad.html/95',
  'https://www.lacapital.com.ar/secciones/laciudad.html/46',
  'https://www.lacapital.com.ar/secciones/laciudad.html/278'
];

const links = [];

async function getLinks(urls) {
  for (const url of urls) {
    try {
      const html = await rvestjs.read_html(url);
      const hrefs = await rvestjs.html_attr(html_elements(html, 'article.big-entry-box a.cover-link, article.standard-entry-box a.cover-link, article.medium-entry a.cover-link'), 'href');
      links.push(...hrefs);
    } catch (error) {
      console.log(`Error fetching ${url}: ${error}`);
    }
    console.log(`${urls.indexOf(url) + 1} | ${url}`);
  }

  fs.writeFileSync('links.json', JSON.stringify(links));
}

getLinks([...urls, ...urls2]);

//-----------RASPADO

let LaCapital = [];

for (let link of links) {
    try {
        let html = await rvest.read_html(link);
        let newData = {
            fecha: rvest.html_text2(rvest.html_element(html, "span.nota-fecha")),
            titulo: rvest.html_text2(rvest.html_element(html, "h1.nota-title")),
            bajada: rvest.html_text2(rvest.html_element(html, "div.nota-bajada")),
            nota: rvest.html_text2(rvest.html_elements(html, "div.article-body p")).join("\n "),
            imagen: rvest.html_attr(rvest.html_element(html, "picture.preview-img > div.extra-holder > img"), "src"),
            seccion: rvest.html_text2(rvest.html_element(html, "div.breadcrumbs.flex-container.align-center")),
            seccion2: "",
            tags: rvest.html_text2(rvest.html_element(html, "div.tags-container.flex-container.flex-wrap")),
            link: link,
            link2: "",
            fuente: "La Capital"
        };
        LaCapital.push(newData);
    } catch (error) {
        console.log(error);
    }
}

// guarda el resultado en un archivo RDS
// saveRDS(LaCapital, "LaCapital_rvest.rds");

// guarda el resultado en un archivo xlsx
// xlsx.write.xlsx2(LaCapital, "LaCapital_rvest.xlsx");