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

// Conseguimos todos los links de las paginas de CIUDAD hasta 2019
const baseUrl = "https://www.lacapital.com.ar/secciones/laciudad.html/";
const numbers = Array.from({length: 550 + 1}, (_, i) => i);
let paginasCiudad = []

for (const number of numbers) {
  paginasCiudad.push(baseUrl + number);
}

console.log (paginasCiudad)

(async () => {
  try {
    // Abrimos una instancia del puppeteer y accedemos a la url de la capital
    const browser = await puppeteer.launch() ;
    const page = await browser.newPage();
    const response = await page.goto('https://www.lacapital.com.ar/secciones/laciudad.html');
    const body = await response.text();

    // Creamos una instancia del resultado devuelto por puppeter para parsearlo con jsdom
    const { window: { document } } = new jsdom.JSDOM(body);

    // Creamos un arreglo vacío para guardar los títulos
    let titulos = [];

    // Seleccionamos los títulos y lo agregamos al arreglo titulos
    document.querySelectorAll('h2.entry-title')
      .forEach(element => titulos.push(element.textContent));

    // Creamos un archivo .csv llamado "titulos.csv" y escribimos los títulos en él
    const csvWriter = createCsvWriter({
      path: 'titulos.csv',
      header: [
        {id: 'titulo', title: 'Título'}
      ]
    });
    csvWriter.writeRecords(titulos.map(titulo => ({titulo})))
      .then(() => console.log('Los títulos se han guardado en un archivo .csv llamado "titulos.csv"'));

    // Cerramos el puppeteer
    await browser.close();
  } catch (error) {
    console.error(error);
  }
})();
