const puppeteer = require('puppeteer');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
/*
const baseUrl = "https://www.lacapital.com.ar/secciones/laciudad.html/";
const numbers = Array.from({length: 10 + 1}, (_, i) => i);
const paginasCiudad = [];
const notas = [];

for (const number of numbers) {
  paginasCiudad.push(baseUrl + number);
};
console.log(paginasCiudad);
console.log("posPag");

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const urls = [];
    for (let pagina of paginasCiudad) {    
        await page.goto(pagina);
        const enlaces = await page.evaluate(() => {
            const elements = document.querySelectorAll('article.big-entry-box a.cover-link, article.standard-entry-box a.cover-link, article.medium-entry a.cover-link');
            const links = [];

            for (let element of elements) {
                links.push(element.href);
            }
            
            return links;
        });
        enlaces.forEach(element => {
            urls.push(element);
        });   
        
    }
    //await browser.close();  
    console.log(urls);

    const csvWriter = createCsvWriter({
        path: 'links.csv',
        header: [
          {id: 'link', title: 'Link'}
        ]
      });
    csvWriter.writeRecords(urls.map(link => ({link})))
        .then(() => console.log('Los links se han guardado en un archivo .csv llamado "links.csv"'))        
///////////////////
*/
/*
// Llamamos a las extensiones necesarias
const puppeteer = require('puppeteer');
const jsdom = require('jsdom');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { writeFileSync } = require('fs');

const urls =["https://www.lacapital.com.ar/la-ciudad/vecinos-denuncian-que-los-cuidacoches-les-cobran-1500-estacionar-la-calle-n10054172.html", "https://www.lacapital.com.ar/la-ciudad/el-tiempo-rosario-la-ultima-semana-marzo-arranca-pronosticos-inestabilidad-n10054224.html"];

(async () => {
    const browser = await puppeteer.launch({
        timeout: 60000 // 60 seconds
      });
    const page = await browser.newPage();
  
    try {
      const laCapital = [];
      //const urls = await obtenerEnlaces();
    
      for (let url of urls) {
        try {
          await page.goto(url, { waitUntil: 'domcontentloaded' });
    
          let newData = await page.evaluate(() => {
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
    
            return {Fecha: fecha, Título: titulo, Bajada: bajada, Nota: nota, Imagen: imagen, Sección: seccion, "Sección 2": seccion2, Tags: tags, Link: link, 'Link 2': link2, Fuente: fuente}
          });
    
          laCapital.push(newData);
        } catch (error) {
          console.log(error);
        }
      }
    
      const csvWriter = createCsvWriter({
        path: 'notas.csv',
        header: [
          {id: 'fecha', title: 'Fecha'},
          {id: 'titulo', title: 'Título'},
          {id: 'bajada', title: 'Bajada'},
          {id: 'nota', title: 'Nota'},
          {id: 'imagen', title: 'Imagen'},
          {id: 'seccion', title: 'Sección'},
          {id: 'seccion2', title: 'Sección 2'},
          {id: 'tags', title: 'Tags'},
          {id: 'link', title: 'Link'},
          {id: 'link2', title: 'Link 2'},
          {id: 'fuente', title: 'Fuente'}
        ]
      });
    
      await csvWriter.writeRecords(laCapital.map(nota => ({
        fecha: nota.fecha,
        titulo: nota.titulo,
        bajada: nota.bajada,
        nota: nota.nota,
        imagen: nota.imagen,
        seccion: nota.seccion,
        seccion2: nota.seccion2,
        tags: nota.tags,
        link: nota.link,
        link2: nota.link2,
        fuente: nota.fuente
    })));
      console.log(laCapital)
      console.log(`Se han guardado las notas en un archivo .csv llamado "notas.csv"`);
    } catch (error) {
      console.error(error);
    } finally {
      await browser.close();
    }

    
  })();
*/  


// Llamamos a las extensiones necesarias

const urls =["https://www.lacapital.com.ar/la-ciudad/vecinos-denuncian-que-los-cuidacoches-les-cobran-1500-estacionar-la-calle-n10054172.html", "https://www.lacapital.com.ar/la-ciudad/el-tiempo-rosario-la-ultima-semana-marzo-arranca-pronosticos-inestabilidad-n10054224.html"];

(async () => {
  const browser = await puppeteer.launch({
      timeout: 60000 // 60 seconds
    });
  const page = await browser.newPage();

  try {
    const laCapital = [];

    for (let url of urls) {
      try {
        await page.goto(url, { waitUntil: 'domcontentloaded' });
    
        let newData = {}; // objeto vacío
    
        newData.fecha = await page.$eval('span.nota-fecha', el => el.textContent);
        newData.titulo = await page.$eval('h1.nota-title', el => el.textContent);
        newData.bajada = await page.$eval('div.nota-bajada', el => el.textContent);
        newData.nota = await page.$$eval('div.article-body p', els => els.map(el => el.textContent).join('\n'));
        newData.imagen = await page.$eval('picture.preview-img > div.extra-holder > img', el => el.getAttribute('src'));
        newData.seccion = await page.$eval('div.breadcrumbs.flex-container.align-center', el => el.textContent);
        newData.seccion2 = '';
        newData.tags = await page.$eval('div.tags-container.flex-container.flex-wrap', el => el.textContent);
        newData.link = page.url();
        newData.link2 = '';
        newData.fuente = 'La Capital';
    
        laCapital.push(newData);
      } catch (error) {
        console.log(error);
      }
    }
    

    const csvWriter = createCsvWriter({
      path: 'notas.csv',
      header: [
        {id: 'fecha', title: 'Fecha'},
        {id: 'titulo', title: 'Título'},
        {id: 'bajada', title: 'Bajada'},
        {id: 'nota', title: 'Nota'},
        {id: 'imagen', title: 'Imagen'},
        {id: 'seccion', title: 'Sección'},
        {id: 'tags', title: 'Tags'},
        {id: 'link', title: 'Link'},
        {id: 'fuente', title: 'Fuente'}
      ]
    });

    await csvWriter.writeRecords(laCapital);
    console.log(laCapital);
    console.log(`Se han guardado las notas en un archivo .csv llamado "notas.csv"`);
  } catch (error) {
    console.error(error);
  } finally {
    await browser.close();
  }

  
})();

