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
      document.querySelectorAll("a[href]")
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

