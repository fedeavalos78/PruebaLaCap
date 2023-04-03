const puppeteer = require('puppeteer');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const urls = ["https://www.lacapital.com.ar/la-ciudad/vecinos-denuncian-que-los-cuidacoches-les-cobran-1500-estacionar-la-calle-n10054172.html", "https://www.lacapital.com.ar/la-ciudad/el-tiempo-rosario-la-ultima-semana-marzo-arranca-pronosticos-inestabilidad-n10054224.html"];

(async () => {
  const browser = await puppeteer.launch({
      timeout: 60000 // 60 seconds
    });
  const page = await browser.newPage();

  try {
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

    for (let url of urls) {
      try {
        const newData = {}; // objeto vacío

        await page.goto(url, { waitUntil: 'domcontentloaded' });
    
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
    
        const laCapital = [];
        laCapital.push(newData)

        await csvWriter.writeRecords(laCapital);
        console.log(newData);
        console.log(`Se ha guardado la nota en un archivo .csv llamado "notas.csv"`);
      } catch (error) {
        console.log(error);
      }
    }
    console.log(laCapital)
    console.log(`Se han guardado todas las notas en un archivo .csv llamado "notas.csv"`);
  } catch (error) {
    console.error(error);
  } finally {
    await browser.close();
  }
})();
