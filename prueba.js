// PONER TODOS LOS LINKS EN EL ARREGLO paginas

// ARMAR UN FOR PARA QUE ENTRE A CADA POSICIÓN DE paginas Y OBTENGA EL URL DE CADA NOTA DENTRO DE ESA 
//PÁGINA, GUARDANDO EL URL EN EL ARREGLO notas

// dECIRLE QUE ENTRE A CADA POSICIÓN DE notas BUSQUE LOS CAMPOS NECESARIOS Y LOS PONGA EN EL OBJETO info 
//QUE SEA PUSHEADO EN EL ARREGLO infoPorNota

//ESCRIBIR UN ARCHIVO CON EL ARRELGO

// Llamamos a las extensiones necesarias
const puppeteer = require('puppeteer');
const jsdom = require('jsdom');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { writeFileSync } = require('fs');

// Conseguimos todos los links de las paginas de CIUDAD hasta 2019
const baseUrl = "https://www.lacapital.com.ar/secciones/laciudad.html/";
const numbers = Array.from({length: 10 + 1}, (_, i) => i);
let paginasCiudad = []

for (const number of numbers) {
  paginasCiudad.push(baseUrl + number);
};
console.log(paginasCiudad)

const urlNotas = [];

(async () => {
  try {
    // Abrimos una instancia del puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Iteramos sobre el arreglo de páginas de ciudad
    for (let pag = 0; pag < paginasCiudad.length; pag++) {
      const response = await page.goto(paginasCiudad[pag]);
      const body = await response.text();

      // Creamos una instancia del resultado devuelto por puppeter para parsearlo con jsdom
      const { window: { document } } = new jsdom.JSDOM(body);

      // Seleccionamos los links y los agregamos al arreglo de los enlaces
      document.querySelectorAll('article.big-entry-box a.cover-link, article.standard-entry-box a.cover-link, article.medium-entry a.cover-link')
        .forEach(element => urlNotas.push(element.href));
    }

    
    // Cerramos el puppeteer
    await browser.close();
  } catch (error) {
    console.error(error);
  }
  // Imprimimos los enlaces obtenidos  
  const csvWriter = createCsvWriter({
    path: 'links.csv',
    header: [
      {id: 'link', title: 'Link'}
    ]
  });
  csvWriter.writeRecords(urlNotas.map(link => ({link})))
    .then(() => console.log('Los links se han guardado en un archivo .csv llamado "links.csv"'));  
  //console.log(urlNotas);

})();

// Levantar info de cada link
let laCapital = [];

Promise.all(urlNotas.map(async url => {(async () =>{
  const browser1 = await puppeteer.launch();
  const page1 = await browser1.newPage();

  console.log(urlNotas)
  console.log("pos2");

  for (let url of urlNotas) {
    try {
      await page1.goto(url, { waitUntil: 'domcontentloaded' });

      let newData = await page1.evaluate(() => {
        const fecha = document.querySelector('span.nota-fecha').textContent;
        const titulo = document.querySelector('h1.nota-title').textContent;
        const bajada = document.querySelector('div.nota-bajada').textContent;
        const nota = Array.from(document.querySelectorAll('div.article-body p')).map(p => p.textContent).join('\n');
        const imagen = document.querySelector('picture.preview-img > div.extra-holder > img').getAttribute('src');
        const seccion = document.querySelector('div.breadcrumbs.flex-container.align-center').textContent;
        const seccion2 = '';
        const tags = document.querySelector('div.tags-container.flex-container.flex-wrap').textContent;
        const link = window.location.href;
        const link2 = '';
        const fuente = 'La Capital';

        return { fecha, titulo, bajada, nota, imagen, seccion, seccion2, tags, link, link2, fuente };
      });

      laCapital.push(newData);
    } catch (error) {
      console.log(error);
    }

  }
  await browser1.close();

})()
}));
console.log(urlNotas)
console.log(laCapital)
