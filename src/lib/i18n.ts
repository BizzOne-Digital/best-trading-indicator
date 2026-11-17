export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];
export const LOCALE_COOKIE = "bti_locale";

const en = {
  nav: { home: "Home", about: "About Us", features: "Features", pricing: "Pricing", testimonials: "Testimonials", blogs: "Blogs", faq: "FAQ", contact: "Contact" },
  cta: { access: "Get BTI Access", learnAbout: "Learn More About Us", viewPricing: "View Pricing", contact: "Contact Us", readMore: "Read article" },
  hl: { nonRepaint: "Non-Repainting Signals", logic: "Real Market Logic", structure: "Clear Market Structure", consistency: "Built for Consistency" },
  stats: { years: "12+ Years", yearsSub: "Market Experience", tv: "TradingView", tvSub: "Invite-Only Script", plans: "Monthly, Yearly", plansSub: "& Lifetime Access", markets: "Stocks, Forex", marketsSub: "& Crypto" },
  about: { eyebrow: "About Us", b: ["Real market logic, not just theory", "Non-repainting signal methodology", "Clear structure to reduce confusion", "Focus on risk management", "Support for disciplined decision-making"] },
  ba: { eyebrow: "Before & After", title: "See the Difference BTI Makes", sub: "Compare chart readability with and without the BTI indicator.", before: "Before", beforeSub: "(Without BTI)", after: "After", afterSub: "(With BTI)", note: "Illustrative sample chart. Same candles in both views — only the BTI overlay differs." },
  feat: { eyebrow: "Our Features", title: "Powerful Features for Smarter Trading", sub: "Everything you need to understand market structure more clearly." },
  show: { eyebrow: "Product", title: "One Indicator. A Clearer View of the Market.", sub: "Structure, trend and signal zones layered on the chart you already use.", c: ["Market structure visualization", "Trend identification", "Signal zones", "TradingView compatibility", "Risk-aware decision support"], gallery: "Chart gallery", empty: "Product screenshots will appear here once uploaded." },
  video: { eyebrow: "Intro Video", title: "Discover How BTI Helps You Read the Market", sub: "A short walkthrough of the BTI chart layout, signals and structure zones.", soon: "The BTI intro video is coming soon.", close: "Close video" },
  pricing: { eyebrow: "Pricing", title: "Choose Your BTI Access Plan", sub: "Select the access option that works best for your trading journey.", month: "/ month", year: "/ year", lifetime: "one-time", terms: "Prices in USD. Subscriptions renew automatically until cancelled. Access is added manually to your TradingView username after payment is confirmed." },
  test: { eyebrow: "Testimonials", title: "What Traders Say", sub: "Feedback from BTI users. Only client-approved reviews are published.", empty: "Verified reviews from BTI users will be published here soon.", verified: "Verified customer" },
  blog: { eyebrow: "Blog", title: "Trading Education & Insights", sub: "Market structure, risk management and TradingView guides.", search: "Search articles", all: "All", empty: "No articles found.", min: "min read", related: "Related articles", share: "Share", featured: "Featured", prev: "Previous", next: "Next" },
  faq: { eyebrow: "FAQ", title: "Frequently Asked Questions", sub: "Clear answers about BTI, access and subscriptions." },
  contact: { eyebrow: "Contact", title: "Have Questions? Get in Touch.", sub: "Our team replies by email, usually within one business day.", first: "First Name", last: "Last Name", email: "Email Address", tv: "TradingView Account Name", subject: "Subject (optional)", plan: "Plan interest (optional)", message: "Message / Inquiry", send: "Send Message", sending: "Sending…", ok: "Thank you — your message has been received. We will reply by email.", none: "Not sure yet" },
  checkout: { title: "Complete your details", sub: "We need your TradingView username to grant invite-only access after payment.", tvHint: "Your exact TradingView username (case-sensitive), not your email.", pay: "Continue to secure payment", paying: "Redirecting to Stripe…", secure: "Payments are processed securely by Stripe. We never see or store your card details.", agree: "By continuing you agree to the Terms, Refund Policy and Risk Disclaimer." },
  v: { required: "This field is required", email: "Enter a valid email address", tv: "Enter a valid TradingView username (letters, numbers, _ . -)", min: "Please enter at least 10 characters", generic: "Something went wrong. Please try again.", rate: "Too many requests. Please wait a few minutes and try again." },
  footer: { desc: "BTI is a TradingView invite-only market structure indicator built by traders with 12+ years of market experience.", quick: "Quick Links", support: "Support", legal: "Legal", help: "Subscription Help", privacy: "Privacy Policy", terms: "Terms", refund: "Refund Policy", risk: "Risk Disclaimer", rights: "All rights reserved." },
  illustrative: "Illustrative chart — not live data or verified performance.",
};

type Dict = typeof en;

const es: Dict = {
  nav: { home: "Inicio", about: "Nosotros", features: "Funciones", pricing: "Precios", testimonials: "Testimonios", blogs: "Blog", faq: "FAQ", contact: "Contacto" },
  cta: { access: "Obtener BTI", learnAbout: "Conoce más sobre nosotros", viewPricing: "Ver precios", contact: "Contáctanos", readMore: "Leer artículo" },
  hl: { nonRepaint: "Señales sin repintado", logic: "Lógica real de mercado", structure: "Estructura clara", consistency: "Hecho para la consistencia" },
  stats: { years: "12+ años", yearsSub: "De experiencia", tv: "TradingView", tvSub: "Script por invitación", plans: "Mensual, anual", plansSub: "y de por vida", markets: "Acciones, Forex", marketsSub: "y Cripto" },
  about: { eyebrow: "Nosotros", b: ["Lógica real de mercado, no solo teoría", "Metodología de señales sin repintado", "Estructura clara para reducir la confusión", "Enfoque en la gestión del riesgo", "Apoyo a decisiones disciplinadas"] },
  ba: { eyebrow: "Antes y después", title: "Mira la diferencia que hace BTI", sub: "Compara la lectura del gráfico con y sin el indicador BTI.", before: "Antes", beforeSub: "(Sin BTI)", after: "Después", afterSub: "(Con BTI)", note: "Gráfico ilustrativo. Mismas velas en ambas vistas: solo cambia la capa de BTI." },
  feat: { eyebrow: "Funciones", title: "Funciones potentes para operar con más claridad", sub: "Todo lo que necesitas para entender mejor la estructura del mercado." },
  show: { eyebrow: "Producto", title: "Un indicador. Una visión más clara del mercado.", sub: "Estructura, tendencia y zonas de señal sobre el gráfico que ya usas.", c: ["Visualización de la estructura", "Identificación de tendencia", "Zonas de señal", "Compatible con TradingView", "Apoyo a decisiones con gestión del riesgo"], gallery: "Galería de gráficos", empty: "Las capturas del producto aparecerán aquí cuando se suban." },
  video: { eyebrow: "Video", title: "Descubre cómo BTI te ayuda a leer el mercado", sub: "Un recorrido breve por el gráfico, las señales y las zonas de estructura de BTI.", soon: "El video de presentación de BTI estará disponible pronto.", close: "Cerrar video" },
  pricing: { eyebrow: "Precios", title: "Elige tu plan de acceso a BTI", sub: "Selecciona la opción que mejor se adapte a tu camino como trader.", month: "/ mes", year: "/ año", lifetime: "pago único", terms: "Precios en USD. Las suscripciones se renuevan automáticamente hasta que las canceles. El acceso se añade manualmente a tu usuario de TradingView tras confirmar el pago." },
  test: { eyebrow: "Testimonios", title: "Lo que dicen los traders", sub: "Opiniones de usuarios de BTI. Solo publicamos reseñas aprobadas.", empty: "Pronto publicaremos aquí reseñas verificadas de usuarios de BTI.", verified: "Cliente verificado" },
  blog: { eyebrow: "Blog", title: "Formación y análisis de trading", sub: "Estructura de mercado, gestión del riesgo y guías de TradingView.", search: "Buscar artículos", all: "Todos", empty: "No se encontraron artículos.", min: "min de lectura", related: "Artículos relacionados", share: "Compartir", featured: "Destacado", prev: "Anterior", next: "Siguiente" },
  faq: { eyebrow: "FAQ", title: "Preguntas frecuentes", sub: "Respuestas claras sobre BTI, el acceso y las suscripciones." },
  contact: { eyebrow: "Contacto", title: "¿Tienes preguntas? Escríbenos.", sub: "Respondemos por correo, normalmente en un día hábil.", first: "Nombre", last: "Apellido", email: "Correo electrónico", tv: "Usuario de TradingView", subject: "Asunto (opcional)", plan: "Plan de interés (opcional)", message: "Mensaje / Consulta", send: "Enviar mensaje", sending: "Enviando…", ok: "Gracias: hemos recibido tu mensaje. Te responderemos por correo.", none: "Aún no lo sé" },
  checkout: { title: "Completa tus datos", sub: "Necesitamos tu usuario de TradingView para darte acceso tras el pago.", tvHint: "Tu usuario exacto de TradingView (distingue mayúsculas), no tu correo.", pay: "Continuar al pago seguro", paying: "Redirigiendo a Stripe…", secure: "Los pagos se procesan de forma segura con Stripe. Nunca vemos ni guardamos tu tarjeta.", agree: "Al continuar aceptas los Términos, la Política de reembolso y el Aviso de riesgo." },
  v: { required: "Este campo es obligatorio", email: "Introduce un correo válido", tv: "Introduce un usuario de TradingView válido (letras, números, _ . -)", min: "Escribe al menos 10 caracteres", generic: "Algo salió mal. Inténtalo de nuevo.", rate: "Demasiadas solicitudes. Espera unos minutos e inténtalo de nuevo." },
  footer: { desc: "BTI es un indicador de estructura de mercado por invitación en TradingView, creado por traders con más de 12 años de experiencia.", quick: "Enlaces", support: "Soporte", legal: "Legal", help: "Ayuda con suscripción", privacy: "Privacidad", terms: "Términos", refund: "Reembolsos", risk: "Aviso de riesgo", rights: "Todos los derechos reservados." },
  illustrative: "Gráfico ilustrativo: no son datos en vivo ni rendimiento verificado.",
};

export const DICTS: Record<Locale, Dict> = { en, es };
export type { Dict };

/** Picks a localized field (e.g. title_es) with English fallback. */
export function loc<T extends Record<string, unknown>>(obj: T, field: string, locale: Locale): string {
  if (locale !== "en") {
    const v = obj[`${field}_${locale}`];
    if (typeof v === "string" && v.trim()) return v;
  }
  return (obj[field] as string) ?? "";
}
