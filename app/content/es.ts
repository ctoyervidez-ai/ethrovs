import type { ProjectKey } from "./site";

const es = {
  meta: {
    title: "ETHROVS — Diseño de páginas web en Laredo y Nuevo Laredo",
    description:
      "Estudio web bilingüe de la frontera. Páginas profesionales para negocios locales, entregadas en 24 horas, desde $300 USD o $5,900 MXN.",
    ogDescription: "Páginas web que mueven negocios. Estudio bilingüe · Laredo / Nuevo Laredo.",
  },
  nav: { work: "Trabajo", services: "Servicios", process: "Proceso", pricing: "Precio", faq: "Dudas", contact: "Iniciar proyecto", contactShort: "Empezar" },
  suggest: { text: "This site is also available in English.", cta: "View in English", dismiss: "Seguir en español" },
  hero: {
    kicker: "Estudio web bilingüe · Laredo / Nuevo Laredo",
    line1: "Páginas web que",
    line2: "mueven negocios.",
    text: "Diseño estratégico, desarrollo rápido y tecnología inteligente para negocios que están listos para crecer.",
    primary: "Crear mi página",
    secondary: "Ver nuestro trabajo",
    proof: ["Entrega mínima", "Sitios en vivo", "Bilingüe", "Desde"],
    deckLabel: "Proyectos",
    deckView: "Ver",
  },
  work: {
    label: "Trabajo seleccionado · 2026",
    title: "Diseñado para verse bien. Construido para funcionar.",
    visit: "Ver en vivo",
    descriptions: {
      costa: "Una experiencia cálida y directa para un restaurante de mariscos, optimizada para convertir visitas en reservaciones.",
      vsr: "Una tienda editorial de edición limitada que une moda, música y una identidad visual construida desde la presión.",
      excessive: "Una experiencia bilingüe para detallado automotriz premium, diseñada para mostrar resultados y convertir visitas en citas.",
      ciao: "Una experiencia cálida y llena de sabor para una pizzería artesanal, diseñada para abrir el apetito y convertir visitas en pedidos.",
    } as Record<ProjectKey, string>,
  },
  services: {
    title: "Todo lo necesario para lanzar con fuerza.",
    items: [
      { title: "Diseño", text: "Dirección visual, estructura y textos para que tu negocio se sienta confiable en el primer segundo.", bullets: ["Identidad y paleta", "Jerarquía y textos", "Diseño móvil primero"] },
      { title: "Desarrollo", text: "Sitios rápidos que cargan bien en cualquier teléfono y quedan listos para crecer contigo.", bullets: ["Carga en segundos", "WhatsApp, mapa y llamada", "Tu dominio conectado"] },
      { title: "Crecimiento", text: "SEO básico, analítica y automatizaciones para que la página trabaje también cuando tú no estás.", bullets: ["Google Business", "Analítica de visitas", "Respuestas automáticas"] },
    ],
  },
  process: {
    title: "De idea a internet en tres movimientos.",
    steps: [
      { title: "Nos mandas tu contenido", text: "Tu logo, fotos, servicios y lo esencial del negocio. Si algo te falta, te decimos exactamente qué necesitamos y cómo conseguirlo.", when: "Día 0 · 15 min" },
      { title: "Diseñamos y construimos", text: "Definimos una dirección visual clara y desarrollamos la página completa en una sola producción, sin pasarnos la pelota.", when: "Mismo día" },
      { title: "Revisas y publicamos", text: "Haces una ronda de cambios, conectamos tu dominio y te entregamos el sitio en vivo, listo para recibir clientes.", when: "Antes de 24 h" },
    ],
  },
  pricing: {
    label: "Tres paquetes",
    title: "Elige dónde cae",
    titleAccent: "tu negocio.",
    cta: "Reservar",
    tiers: {
      express: {
        name: "Express",
        for: "El negocio que necesita existir en internet ya",
        items: ["Una página de hasta seis secciones, diseño propio", "Versión móvil, llamada, mapa y WhatsApp", "SEO básico y conexión de tu dominio", "Una ronda de cambios"],
        when: "Entrega en 24 h",
        whatsappMessage: "Hola ETHROVS, me interesa el paquete Express de 24 h",
      },
      completo: {
        name: "Completo",
        for: "Restaurante, clínica o despacho que ya creció",
        items: ["Hasta doce secciones o varias páginas", "Versión bilingüe incluida, no como extra", "Perfil de Google Business configurado", "Dos rondas de cambios"],
        when: "Entrega en 3 a 5 días",
        whatsappMessage: "Hola ETHROVS, me interesa el paquete Completo",
      },
      tienda: {
        name: "Tienda",
        for: "Marca que vende producto y quiere cobrar en línea",
        items: ["Tienda en Shopify con el tema a tu marca", "Hasta 25 productos cargados con fotos", "Pagos con tarjeta, Mercado Pago y OXXO", "Envíos, zonas e impuestos configurados", "Una hora de capacitación para que tú la manejes"],
        when: "Entrega en 5 a 7 días",
        whatsappMessage: "Hola ETHROVS, me interesa el paquete Tienda en línea",
      },
    },
    flexible: "Precio sujeto a evaluación. Cuéntanos qué necesita tu negocio y ajustamos la propuesta al mejor precio posible para tu caso.",
    terms: "50% para comenzar · 50% antes de publicar",
    care: {
      title: "Plan de cuidado",
      per: "al mes",
      text: "Hosting, dominio, respaldos y hasta treinta minutos de cambios chicos cada mes. Sin contrato forzoso.",
    },
    extrasTitle: "Se cobra aparte",
    extrasText: "Se cobran una sola vez y se suman al total antes de empezar.",
    extras: ["Versión bilingüe en el paquete Express", "Producto adicional en la tienda, pasando de 25", "Página adicional", "Ronda de cambios extra"],
  },
  faq: {
    title: "Las dudas que siempre nos hacen.",
    items: [
      ["¿De verdad en 24 horas?", "Sí, siempre que tengamos tu contenido completo desde el inicio: logo, fotos, servicios y textos. El reloj empieza cuando recibimos todo, no cuando pagas. Si falta material, te avisamos el mismo día."],
      ["No tengo logo ni fotos. ¿Puedo empezar?", "Sí. Podemos crear un logotipo sencillo y generar imágenes a la medida de tu marca. Nos lo dices al escribir y lo ajustamos en la propuesta antes de cobrarte nada."],
      ["¿Qué pasa después de publicar?", "El sitio es tuyo: dominio, contenido y acceso. Te dejamos publicado y funcionando. Si más adelante quieres cambios o secciones nuevas, se cotizan aparte, sin mensualidad obligatoria."],
      ["¿Trabajan de los dos lados de la frontera?", "Sí. Atendemos Laredo, Nuevo Laredo y el resto de Texas y México. Cobramos en dólares o en pesos, y el sitio puede quedar en español, en inglés o en los dos idiomas."],
      ["¿Y si no me gusta el diseño?", "Tienes una ronda de cambios incluida y la usamos para afinar lo que haga falta. Como solo pagas la mitad al inicio, no liberas el resto hasta que el sitio te convenza."],
    ] as Array<[string, string]>,
  },
  testimonials: {
    title: "Lo que dicen los negocios que ya lanzaron.",
    // TODO(daniel): sustituir por frases reales de clientes (nombre + negocio) antes de activar
    // la sección en app/components/Home.tsx (SHOW_TESTIMONIALS).
    items: [
      { quote: "PENDIENTE: frase real del cliente.", name: "Nombre", role: "Costa Grill" },
      { quote: "PENDIENTE: frase real del cliente.", name: "Nombre", role: "Excessive Detailing" },
    ],
  },
  contact: {
    label: "Oferta de lanzamiento · Website Express 24 h",
    line1: "Hagamos algo que la gente",
    line2: "recuerde.",
    text: "Cuéntanos qué vendes y qué necesitas. Te respondemos con una propuesta clara, sin llamadas eternas ni precios escondidos.",
    whatsapp: "Hablar por WhatsApp",
    whatsappMessage: "Hola ETHROVS, quiero una página web",
    email: "Enviar un correo",
    emailSubject: "Quiero una página web",
    note: "Respuesta el mismo día · 50% para comenzar, 50% antes de publicar.",
  },
  footer: "Energía digital en movimiento",
};

export type SiteCopy = typeof es;
export default es;
