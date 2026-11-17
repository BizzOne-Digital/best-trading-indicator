// Default content. Seeded into MongoDB on first read; afterwards everything is edited in /admin.

export const DEFAULT_SETTINGS = {
  heroBadge: "TradingView Compatible",
  heroTitle1: "Stop guessing in the noise.",
  heroTitle2: "Start",
  heroHighlight: "reading the structure.",
  heroDescription: "Precision market structure on a single clean chart. No coding required — get your indicator access directly to your TradingView invite-only script.",
  heroPrimaryCta: "Get Started Now",
  heroSecondaryCta: "Watch Intro Video",
  heroImage: "/01_hero_chart.png",
  heroTitle1_es: "Deja de adivinar entre el ruido.",
  heroTitle2_es: "Empieza a",
  heroHighlight_es: "leer la estructura.",
  heroDescription_es: "Estructura de mercado precisa en un solo gráfico limpio. Sin programar: recibe acceso a tu script por invitación directamente en TradingView.",
  aboutTitle: "Welcome to BTI – Best Trading Indicator",
  aboutBody: "We are a professional team of traders with over 12 years of real market experience. Trading is not just our business — it is our daily practice.\n\nBecause we trade ourselves, we understand real market conditions, trader psychology, and the confusion traders face every day.\n\nWe do not believe in get-rich-quick schemes or unrealistic profit promises. Our mission is to help traders develop clarity, discipline, and consistency.",
  aboutTitle_es: "Bienvenido a BTI – Best Trading Indicator",
  aboutBody_es: "Somos un equipo profesional de traders con más de 12 años de experiencia real en los mercados. El trading no es solo nuestro negocio: es nuestra práctica diaria.\n\nComo operamos nosotros mismos, entendemos las condiciones reales del mercado, la psicología del trader y la confusión que los traders enfrentan cada día.\n\nNo creemos en esquemas para hacerse rico rápido ni en promesas de ganancias irreales. Nuestra misión es ayudar a los traders a desarrollar claridad, disciplina y consistencia.",
  aboutImage: "/04_about_trader.png",
  beforeImage: "/02_before_without_BTI.png",
  afterImage: "/03_after_with_BTI.png",
  videoUrl: "",
  videoThumbnail: "/07_intro_video_thumbnail.png",
  contactEmail: "trboalgo@gmail.com",
  instagramUrl: "",
  tiktokUrl: "",
  showTraderCount: false,
  traderCount: "",
  showRating: false,
  ratingText: "",
  seoTitle: "BTI – Best Trading Indicator | TradingView Market Structure Indicator",
  seoDescription: "BTI is a TradingView invite-only market structure indicator for stocks, forex and crypto. Non-repainting signal methodology, clear structure zones and Monthly, Yearly or Lifetime access.",
  ogImage: "/09_social_share_OG.png",
  logoUrl: "",
};
export type Settings = typeof DEFAULT_SETTINGS;

export const DEFAULT_FEATURES = [
  { icon: "target", title: "Non-Repainting Signals", description: "Signals are designed to print on confirmed bar closes, so what you see in history is what printed live. No indicator is perfectly accurate.", title_es: "Señales sin repintado", description_es: "Las señales se diseñan para imprimirse al cierre confirmado de la vela: lo que ves en el historial es lo que se mostró en vivo. Ningún indicador es perfecto." },
  { icon: "bars", title: "Market Structure", description: "Identify trend direction, structural shifts and key support and resistance zones on one clean chart.", title_es: "Estructura de mercado", description_es: "Identifica la dirección de la tendencia, cambios estructurales y zonas clave de soporte y resistencia en un solo gráfico." },
  { icon: "bell", title: "Buy & Sell Alerts", description: "Use TradingView alerts on BTI signals so you do not have to watch every candle. (Alert scope to be confirmed per release.)", title_es: "Alertas de compra y venta", description_es: "Usa alertas de TradingView sobre las señales de BTI para no vigilar cada vela. (Alcance de alertas sujeto a confirmación.)" },
  { icon: "layers", title: "Multi-Market Support", description: "Apply the same structure logic to stocks, forex and crypto charts available on TradingView.", title_es: "Multimercado", description_es: "Aplica la misma lógica de estructura a acciones, forex y cripto disponibles en TradingView." },
  { icon: "tv", title: "TradingView Integration", description: "Delivered as a TradingView invite-only script. No coding, no downloads — added straight to your account.", title_es: "Integración con TradingView", description_es: "Se entrega como script por invitación de TradingView. Sin programar ni descargar: se añade a tu cuenta." },
  { icon: "clock", title: "Multiple Timeframes", description: "Read market structure from intraday to higher timeframes and keep context aligned.", title_es: "Múltiples temporalidades", description_es: "Lee la estructura del mercado desde intradía hasta temporalidades mayores y mantén el contexto alineado." },
];

export const DEFAULT_PLANS = [
  { slug: "monthly", name: "Monthly", name_es: "Mensual", interval: "month", price: 59, order: 1, ctaLabel: "Get Monthly Access", ctaLabel_es: "Obtener acceso mensual", note: "Billed monthly. Cancel anytime.", note_es: "Facturación mensual. Cancela cuando quieras.",
    features: ["BTI TradingView indicator access", "Invite-only script access", "Monthly billing", "Access while subscription is active", "Product updates as provided by BTI"],
    features_es: ["Acceso al indicador BTI en TradingView", "Acceso al script por invitación", "Facturación mensual", "Acceso mientras la suscripción esté activa", "Actualizaciones según las publique BTI"] },
  { slug: "yearly", name: "Yearly", name_es: "Anual", interval: "year", price: 299, order: 2, featured: true, badge: "Best Value", ctaLabel: "Get Yearly Access", ctaLabel_es: "Obtener acceso anual", note: "$24.92/month when billed annually", note_es: "24,92 $/mes con facturación anual",
    features: ["BTI TradingView indicator access", "Annual billing", "Invite-only script access", "Active access throughout the paid year", "Product updates as provided by BTI"],
    features_es: ["Acceso al indicador BTI en TradingView", "Facturación anual", "Acceso al script por invitación", "Acceso activo durante el año pagado", "Actualizaciones según las publique BTI"] },
  { slug: "lifetime", name: "Lifetime", name_es: "De por vida", interval: "lifetime", price: 499, order: 3, ctaLabel: "Get Lifetime Access", ctaLabel_es: "Obtener acceso de por vida", note: "One-time payment", note_es: "Pago único",
    features: ["One-time purchase", "Lifetime BTI indicator access, subject to published license terms", "TradingView invite-only script access", "Product updates as provided by BTI"],
    features_es: ["Compra única", "Acceso de por vida al indicador, sujeto a los términos de licencia", "Acceso al script por invitación de TradingView", "Actualizaciones según las publique BTI"] },
];

export const DEFAULT_FAQS = [
  ["What is BTI?", "BTI (Best Trading Indicator) is a TradingView indicator that visualises market structure — trend, structural shifts and key zones — together with buy and sell signal markers on a single chart."],
  ["Does BTI work on TradingView?", "Yes. BTI is delivered as a TradingView invite-only script and runs inside your own TradingView account."],
  ["How do I receive indicator access?", "After your payment is confirmed, our team adds the TradingView username you provided at checkout to the invite-only script. You will then find BTI under Indicators → Invite-only scripts. Access is granted manually, usually within one business day."],
  ["What is an invite-only script?", "It is a TradingView script whose source code is protected and which can only be used by accounts the author has explicitly authorised."],
  ["Can beginners use BTI?", "Yes. BTI is designed to make structure easier to read, but it does not replace learning the basics of risk management and trading discipline."],
  ["Does BTI work for crypto, forex, and stocks?", "BTI can be applied to any symbol available on TradingView, including stocks, forex pairs and cryptocurrencies."],
  ["Is the indicator non-repainting?", "BTI signals are designed to be confirmed on bar close, so historical signals reflect what was displayed in real time. Signals can still appear and change on the currently forming candle until it closes."],
  ["How do monthly and yearly subscriptions work?", "Monthly and yearly plans renew automatically at the end of each billing period until you cancel. Your access remains active while your subscription is paid."],
  ["What happens if I cancel my subscription?", "Cancellation stops future renewals. You keep access until the end of the period you already paid for, after which invite-only access is removed."],
  ["What does lifetime access include?", "A one-time payment for ongoing access to the BTI indicator and the updates BTI publishes, subject to the published license terms."],
  ["Does BTI guarantee profitable trades?", "No. BTI is an analytical tool. Trading involves substantial risk and no indicator can guarantee profits or prevent losses."],
  ["How do I contact support?", "Use the contact form on this website or email trboalgo@gmail.com. Please include your TradingView username."],
].map(([question, answer], i) => ({ question, answer, order: i }));

const PENDING = "> Draft — awaiting client legal review and approval before publication.\n\n";
export const DEFAULT_LEGAL = [
  { slug: "privacy-policy", title: "Privacy Policy", content: PENDING + "## Information we collect\nWhen you purchase or contact us we collect your first and last name, email address, TradingView username and the content of your message. Payments are processed by Stripe; we never receive or store your card details.\n\n## How we use it\n- To deliver and manage your TradingView invite-only access\n- To process subscriptions, renewals, cancellations and refunds\n- To respond to support requests\n- To send essential service emails\n\n## Sharing\nWe share data only with service providers needed to operate the service (for example Stripe for payments, our hosting and email providers). We do not sell personal data.\n\n## Retention and your rights\nWe keep records for as long as needed to provide access and meet legal obligations. You may request access to, correction of, or deletion of your data by emailing trboalgo@gmail.com.\n\n## Cookies\nThe public site uses a language-preference cookie. The admin area uses a strictly necessary session cookie." },
  { slug: "terms-and-conditions", title: "Terms and Conditions", content: PENDING + "## The service\nBTI – Best Trading Indicator provides access to a TradingView invite-only indicator. Access is personal to the TradingView username you provide and may not be shared, resold or redistributed.\n\n## Subscriptions\nMonthly and yearly plans renew automatically until cancelled. Lifetime access is a one-time purchase, subject to these terms and continued availability of the TradingView platform.\n\n## No financial advice\nBTI is an analytical and educational tool. Nothing we provide is personalised financial, investment or trading advice. You are solely responsible for your trading decisions.\n\n## Termination\nWe may revoke access for chargebacks, abuse, sharing of access or breach of these terms.\n\n## Limitation of liability\nTo the maximum extent permitted by law, BTI is not liable for any trading losses or indirect damages arising from use of the indicator." },
  { slug: "refund-policy", title: "Refund & Cancellation Policy", content: PENDING + "## Cancellation\nYou can cancel a monthly or yearly subscription at any time from the billing portal. Cancellation stops future renewals; access continues until the end of the paid period.\n\n## Refunds\nRefund eligibility will be set out here once confirmed by BTI. Approved refunds are returned to the original payment method through Stripe, and associated indicator access is removed.\n\n## Failed payments\nIf a renewal payment fails, Stripe will retry. Access may be paused until payment succeeds." },
  { slug: "risk-disclaimer", title: "Trading Risk Disclaimer", content: PENDING + "Trading stocks, forex, and cryptocurrencies involves substantial risk and may result in financial loss. BTI is an analytical tool and does not guarantee profits or trading outcomes. Information provided is for educational and informational purposes only and should not be considered personalized financial advice.\n\n- Past performance does not guarantee future results.\n- The indicator does not eliminate market risk.\n- Users are responsible for their own trading decisions.\n- Subscription and refund terms apply.\n\nBTI is not a registered investment adviser, broker-dealer or financial institution. Charts shown on this website are illustrative and do not represent verified trading performance." },
];

export const DISCLAIMER = "Trading stocks, forex, and cryptocurrencies involves substantial risk and may result in financial loss. BTI is an analytical tool and does not guarantee profits or trading outcomes. Information provided is for educational and informational purposes only and should not be considered personalized financial advice.";

// Used until real screenshots are added in Admin → Images / Media.
export const DEFAULT_MEDIA = {
  showcase: [{ _id: "d-showcase", url: "/05_product_showcase.png", alt: "BTI indicator showing market structure zones with buy and sell signals" }],
  slideshow: [
    { _id: "d-s1", url: "/06_slideshow_chart.png", alt: "BTI chart screenshot" },
    { _id: "d-s2", url: "/03_after_with_BTI.png", alt: "BTI overlay on BTCUSDT 15m chart" },
    { _id: "d-s3", url: "/05_product_showcase.png", alt: "BTI market structure view" },
    { _id: "d-s4", url: "/01_hero_chart.png", alt: "BTI signals on TradingView" },
  ],
};
export const DEFAULT_BLOG_COVER = "/08_blog_featured.png";

export const BLOG_CATEGORIES = ["Technical Analysis", "Market Structure", "Trading Psychology", "Risk Management", "TradingView Guides", "Trading Education"];
