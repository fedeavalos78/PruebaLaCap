const puppeteer = require('puppeteer');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

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
      
                //await puppeteer.launch();
            //await browser.newPage();
            
            /*
            await page.goto("https://www.lacapital.com.ar/la-ciudad/autoplanes-aumentan-las-quejas-incumplimientos-los-contratos-n10055556.html"
            ,{waitUntil: 'domcontentloaded'})
            
            const nota = await page.evaluate(() => {
                const cadaNota = {};
                cadaNota.fecha = document.querySelector('span.nota-fecha').textContent;
                cadaNota.titulo = document.querySelector('h1.nota-title').textContent;
                cadaNota.bajada = document.querySelector('div.nota-bajada').textContent;
                cadaNota.nota = Array.from(document.querySelectorAll('div.article-body p')).map(p => p.textContent).join('\n');
                cadaNota.imagen = document.querySelector('picture.preview-img > div.extra-holder > img').getAttribute('src');
                cadaNota.seccion = document.querySelector('div.breadcrumbs.flex-container.align-center').textContent;
                cadaNota.seccion2 = '';
                cadaNota.tags = document.querySelector('div.tags-container.flex-container.flex-wrap').textContent;
                cadaNota.link = window.location.href;
                cadaNota.link2 = '';
                cadaNota.fuente = 'La Capital'          
            });
            notas.push(nota);
            */
            //await browser.close();
      
        //return notas; // devolver el valor de la variable urlNotas
            
       
await browser.close();  
console.log (notas);
console.log ("posB");
})(); 