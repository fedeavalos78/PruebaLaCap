const puppeteer = require('puppeteer');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const baseUrl = "https://www.lacapital.com.ar/secciones/laciudad.html/";
const numbers = Array.from({length: 10 + 1}, (_, i) => i);
const paginasCiudad = [];
const books = [];

for (const number of numbers) {
  paginasCiudad.push(baseUrl + number);
};
console.log(paginasCiudad);
console.log("posPag");

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    for (let pagina of paginasCiudad) {    
        const links = [];
        await page.goto(pagina);
        const enlaces = await page.evaluate(() => {
            const elements = document.querySelectorAll('article.big-entry-box a.cover-link, article.standard-entry-box a.cover-link, article.medium-entry a.cover-link');
            
            for (let element of elements) {
                links.push(element.href);
            }
            
            return links;
        });
        
        console.log(enlaces);

        for (let enlace of enlaces) {
            await page.goto(enlace)
            await page.waitForSelector("selector x")

            const book = await page.evaluate(() => {
                const tmp = {};
                tmp.title = document.querySelector("selctor").innerText;
                tmp.author = document.querySelector("selctor").innerText;  
                return tmp;          
            });
            
            books.push(book);
        }
    }
        
    await browser.close();
    console.log (paginasCiudad);
    console.log ("posB");
})();
