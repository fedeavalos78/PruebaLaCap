const puppeteer = require('puppeteer');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const baseUrl = "https://www.lacapital.com.ar/secciones/laciudad.html/";
const numbers = Array.from({length: 2 + 1}, (_, i) => i);
const paginasCiudad = [];

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
            var links = [];

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
    const csvWriter = createCsvWriter({
        path: 'links.csv',
        header: [
          {id: 'link', title: 'Link'}
        ]
      });
    csvWriter.writeRecords(urls.map(link => ({link})))
        .then(() => console.log('Los links se han guardado en un archivo .csv llamado "links.csv"'))
    
        console.log(urls);

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
        var laCapital = [];
        for (let url of urls) {
            try {
                const newData = {}; // objeto vacío
  
                await page.goto(url, { waitUntil: 'load' });
      
                newData.fecha = await page.$eval('span.nota-fecha', el => el.textContent);
                newData.titulo = await page.$eval('h1.nota-title', el => el.textContent);
                newData.bajada = await page.$eval('div.nota-bajada', el => el.textContent);
                newData.nota = await page.$$eval('div.article-body p', els => els.map(el => el.textContent).join('\n'));
                newData.imagen = await page.$eval('picture.preview-img > div.extra-holder > img', el => el.getAttribute('src'));
                newData.seccion = await page.$eval('div.breadcrumbs.flex-container.align-center', el => el.textContent);
                newData.seccion2 = '';
                newData.tags = await page.$eval('div.tags-container.flex-container.flex-wrap', el => el.textContent);
                //newData.link = page.url();
                newData.link2 = '';
                newData.fuente = 'La Capital';
            
                laCapital.push(newData)
        
                await csvWriter.writeRecords(laCapital);
                //console.log(newData);
                console.log(`Se ha guardado la nota en un archivo .csv llamado "notas.csv"AA`);
                } catch (error) {
                console.log(error);
                }
            }
            //console.log(laCapital)
            console.log(`Se han guardado todas las notas en un archivo .csv llamado "notas.csv"BB`);
        } catch (error) {
        console.error(error);
        } finally {
    await browser.close();
    }
})();