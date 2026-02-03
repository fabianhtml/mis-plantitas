// API para manejar fechas de riego
// GET: obtener fechas guardadas
// POST: guardar fecha de riego

const KEYS = {
    jade: 'last-watered-jade',
    sansevieria: 'last-watered-sansevieria'
};

// Fechas por defecto si no hay datos
const DEFAULTS = {
    jade: '2026-01-19',
    sansevieria: '2026-01-30'
};

export async function onRequestGet(context) {
    const { env } = context;
    
    try {
        const jade = await env.PLANTITAS_KV.get(KEYS.jade) || DEFAULTS.jade;
        const sansevieria = await env.PLANTITAS_KV.get(KEYS.sansevieria) || DEFAULTS.sansevieria;
        
        return new Response(JSON.stringify({ jade, sansevieria }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function onRequestPost(context) {
    const { env, request } = context;
    
    try {
        const body = await request.json();
        const { planta, fecha } = body;
        
        // Validar planta
        if (!KEYS[planta]) {
            return new Response(JSON.stringify({ error: 'Planta no válida' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Validar formato de fecha (YYYY-MM-DD)
        if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
            return new Response(JSON.stringify({ error: 'Formato de fecha inválido' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        
        // Guardar en KV
        await env.PLANTITAS_KV.put(KEYS[planta], fecha);
        
        return new Response(JSON.stringify({ ok: true, planta, fecha }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
