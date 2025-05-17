const { Actor } = require('apify');
const puppeteer = require('puppeteer');

Actor.main(async () => {
    try {
        const input = await Actor.getInput();
        const { nombreEmpresa, cif } = input;

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox']
        });

        const page = await browser.newPage();
        await page.goto('https://www.publicidadconcursal.es/consulta-publicidad-concursal-new', {
            waitUntil: 'networkidle0',
        });

        await page.waitForSelector('#busquedaNombre');
        await page.type('#busquedaNombre', nombreEmpresa);
        await page.type('#busquedaNif', cif);

        await Promise.all([
            page.click('#btnBuscar'),
            page.waitForNavigation({ waitUntil: 'networkidle0' })
        ]);

        const resultados = await page.$$eval('.tablaResultados tbody tr', filas => {
            return filas.map(fila => {
                const celdas = fila.querySelectorAll('td');
                return {
                    nombre: celdas[0]?.innerText.trim(),
                    cif: celdas[1]?.innerText.trim(),
                    juzgado: celdas[2]?.innerText.trim(),
                    procedimiento: celdas[3]?.innerText.trim(),
                    estado: celdas[4]?.innerText.trim(),
                    fecha: celdas[5]?.innerText.trim()
                };
            });
        });

        await browser.close();

        if (resultados.length === 0) {
            await Actor.setValue('OUTPUT', {
                encontrado: false,
                mensaje: 'No hay situación concursal',
                input
            });
        } else {
            await Actor.setValue('OUTPUT', {
                encontrado: true,
                concursos: resultados,
                input
            });
        }

    } catch (error) {
        await Actor.setValue('OUTPUT', {
            ok: false,
            error: error.message,
            stack: error.stack
        });
        throw error;
    }
});
