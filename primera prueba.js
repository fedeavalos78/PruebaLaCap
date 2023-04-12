// Llamamos a las extensiones necesarias
const puppeteer = require('puppeteer');
const jsdom = require('jsdom');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Conseguimos todos los links de las paginas de CIUDAD hasta 2019
const baseUrl = "https://www.lacapital.com.ar/secciones/laciudad.html/";
const numbers = Array.from({length: 550 + 1}, (_, i) => i);

// En vez de tirarlos x consola, tengo que meterlo en 
//¿UN ARCHIVO y que la asicronica vaya accediendo a cada link, 
//o UNA VARIABLE de a uno y que esa sea la variable que escrapee la funcion asincrónica
for (const number of numbers) {
  console.log(baseUrl + number);
}
/* 
<article class="big-entry-box exclusive-entry ">       
<div class="exclusive-icon">
    <svg width="10.667" height="10.667" viewBox="0 0 10.667 10.667">
        <path d="M5.333,0,6.72,3.89l3.947.185L7.577,6.663l1.053,4-3.3-2.29-3.3,2.29,1.053-4L0,4.074,3.947,3.89Z" fill="#eca050"></path>
    </svg>
</div>
        <div class="entry-data">
            <h2 class="entry-title">Compras municipales: cómo se repartieron $7.200 millones en 2022</h2>
            <p class="bajada">Un análisis de los expedientes vinculados a compras y licitaciones municipales durante el año que acaba de finalizar. El listado de las empresas ganadoras</p>
        </div>    
        <picture>
            <img src="https://www.lacapital.com.ar/css-custom/203/lazy.svg" data-td-src-property="https://media.lacapital.com.ar/p/efa67abb9055158e2cdcdaf389b96b6d/adjuntos/203/imagenes/100/257/0100257401/514x288/smart/licitacionesrosariojpg.jpg" alt="Compras municipales: cómo se repartieron $7.200 millones en 2022">
            
    <p class="entry-autor">Por <span class="font-700">Juan Chiummiento</span></p>
        </picture>
      
        <a href="https://www.lacapital.com.ar/suscriptores/compras-municipales-como-se-repartieron-7200-millones-2022-n10039607.html" class="cover-link" target="" title="Compras municipales: cómo se repartieron $7.200 millones en 2022"></a>
</article>
*/

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
