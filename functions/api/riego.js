// API para manejar historial de riegos
// GET: obtener historial de riegos
// POST: agregar fecha de riego al historial
// DELETE: quitar última fecha (deshacer)

const KEYS = {
    jade: 'waterings-jade',
    sansevieria: 'waterings-sansevieria'
};

// Historial inicial por defecto
const DEFAULTS = {
    jade: ['2026-01-19'],
    sansevieria: ['2026-01-30']
};

async function getHistory(env, planta) {
    const raw = await env.PLANTITAS_KV.get(KEYS[planta]);
    if (raw) {
        try {
            return JSON.parse(raw);
        } catch {
            return DEFAULTS[planta];
        }
    }
    return DEFAULTS[planta];
}

async function saveHistory(env, planta, history) {
    await env.PLANTITAS_KV.put(KEYS[planta], JSON.stringify(history));
}

export async function onRequestGet(context) {
    const { env } = context;
    
    try {
        const jade = await getHistory(env, 'jade');
        const sansevieria = await getHistory(env, 'sansevieria');
        
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
        
        // Obtener historial actual y agregar nueva fecha
        const history = await getHistory(env, planta);
        if (!history.includes(fecha)) {
            history.push(fecha);
            history.sort(); // Mantener ordenado
        }
        await saveHistory(env, planta, history);
        
        return new Response(JSON.stringify({ ok: true, planta, fecha, history }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}

export async function onRequestDelete(context) {
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
        
        // Obtener historial y quitar la fecha
        const history = await getHistory(env, planta);
        const index = history.indexOf(fecha);
        if (index > -1) {
            history.splice(index, 1);
        }
        await saveHistory(env, planta, history);
        
        return new Response(JSON.stringify({ ok: true, planta, fecha, history }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
