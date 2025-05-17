const { Actor } = require('apify');

Actor.main(async () => {
    try {
        const mensaje = "Actor funcionando correctamente";
        console.log(mensaje);
        await Actor.setValue('OUTPUT', {
            ok: true,
            mensaje
        });
    } catch (error) {
        await Actor.setValue('OUTPUT', {
            ok: false,
            error: error.message || error.toString(),
            stack: error.stack || 'No stack trace'
        });
        throw error;
    }
});
