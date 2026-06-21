import { CONTACT_EMAIL } from "@/lib/contact";

export const es = {
  nav: {
    home: "Inicio",
    about: "Acerca de",
    resources: "Recursos",
    faq: "Preguntas",
    contact: "Contacto",
    dashboard: "Panel",
    admin: "Administración",
    preferences: "Preferencias",
  },
  shell: {
    brandName: "ResourceHive",
    brandSubtitle: "Inteligencia de recursos comunitarios",
    brandLogoAlt: "Logotipo de ResourceHive",
    demoLogin: "Iniciar sesión",
    demoUserName: "Usuario demo",
    signOut: "Cerrar sesión",
    platform: "Plataforma",
    needSupport: "¿Necesitas apoyo?",
    emergencyLine: "Línea de emergencia: 211",
    email: `Correo: ${CONTACT_EMAIL}`,
    footerDescription:
      "Conectamos comunidades con los recursos que necesitan mediante búsqueda moderna, descubrimiento por mapa y herramientas prácticas para familias, personas en búsqueda de empleo y equipos sin fines de lucro.",
    menuToggleAria: "Abrir o cerrar menú",
    themeToggleAria: "Cambiar modo de color",
  },
  common: {
    languageLabel: "Idioma",
    mission: "Conectando a las comunidades con los recursos que necesitan",
    emergencyBanner:
      "¿Necesitas apoyo urgente? Llama al 211 o visita el refugio de emergencia más cercano ahora mismo.",
    emergencyAction: "Ver recursos urgentes",
    open: "Abierto",
    free: "Gratis",
    allCategories: "Todas las categorías",
    allLocations: "Todas las ubicaciones",
    selectedResource: "Recurso seleccionado",
    viewDetails: "Ver detalles",
    visitSite: "Visitar sitio",
    visitWebsite: "Visitar sitio web",
    reachOut: "Contáctate",
    getDirections: "Cómo llegar",
    unavailable: "No disponible",
    select: "Seleccionar",
    searchByOrgServiceNeed: "Buscar por organización, servicio o necesidad",
    noResultsFound:
      "No se encontraron resultados. Prueba quitando un filtro, ampliando la ubicación o buscando por servicio en lugar del nombre de una organización.",
    noMapResults:
      "No hay recursos que coincidan con los filtros actuales. Quita algunos filtros e inténtalo de nuevo.",
    noHeroResults:
      "Aún no hay resultados. Prueba con una palabra más amplia o una ciudad cercana.",
    loadMoreResources: "Cargar más recursos",
    preferredCity: "Ciudad preferida",
    services: "Servicios",
    eligibility: "Elegibilidad",
    mapPreview: "Vista previa del mapa",
    relatedServices: "Servicios relacionados",
    whyThisMatters: "Por qué importa",
    saveResource: "Guardar recurso",
    saved: "Guardado",
    backToDirectory: "Volver al directorio",
    resourceNotFound: "Recurso no encontrado",
    searchNeeds: "Buscar en el directorio",
    exploreResults: "Explorar resultados",
    openMap: "Abrir mapa",
    sendMessage: "Enviar mensaje",
    sendingMessage: "Enviando...",
    contactMessageSent: "Gracias. Tu mensaje fue enviado.",
    contactMessageSetupRequired:
      "La entrega de correo aún no está configurada. Agrega RESEND_API_KEY para habilitar este formulario.",
    contactMessageInvalidApiKey:
      "Resend rechazó la clave API. Crea una clave nueva, pega la clave completa en .env.local y reinicia el servidor de desarrollo.",
    contactMessageSenderNotVerified:
      "El envío de correo aún no está completamente configurado. Usa el enlace directo de correo abajo.",
    contactMessageFailed:
      "No pudimos enviar el mensaje ahora. Envíanos un correo directamente.",
    emailDirectly: "Enviar correo a {email} directamente",
    notProvided: "No proporcionado",
    urgentSupport: "Apoyo urgente",
    browseResourcesByCity: "Explorar recursos por ciudad",
    viewGrid: "Vista de cuadr\u00edcula",
    viewList: "Vista de lista",
    fullName: "Nombre completo",
    emailAddress: "Correo electrónico",
    organization: "Organización",
    helpPrompt: "¿Cómo puede ayudar ResourceHive?",
    chooseNeedsPrompt:
      "Elige necesidades y una ciudad preferida para ver sugerencias personalizadas de recursos.",
    recommendationSummary: "Resumen de recomendaciones",
    getRecommendations: "Obtener recomendaciones",
    uploadSheet: "Subir hoja",
    new: "Nuevo",
    cancel: "Cancelar",
    createResource: "Crear recurso",
    updateResource: "Actualizar recurso",
    saving: "Guardando...",
    selected: "Seleccionado",
    resourceName: "Nombre del recurso",
    description: "Descripción",
    address: "Dirección",
    city: "Ciudad",
    state: "Estado",
    zip: "Código postal",
    phone: "Teléfono",
    contactName: "Nombre del contacto",
    resourceInformation: "InformaciÃ³n del recurso",
    info: "InformaciÃ³n",
    website: "Sitio web",
    hours: "Horario",
    languagesComma: "Idiomas (separados por comas)",
    servicesComma: "Servicios (separados por comas)",
    tagsComma: "Etiquetas (separadas por comas)",
    latitude: "Latitud",
    longitude: "Longitud",
    mapApiKeyMessage:
      "Agrega una clave válida de NEXT_PUBLIC_GOOGLE_MAPS_API_KEY en .env.local para habilitar el mapa en vivo.",
    mapLoadError:
      "Google Maps no pudo cargarse en este momento. Revisa la clave API y los dominios permitidos.",
    noMapLocations: "No hay ubicaciones de recursos que coincidan con los filtros actuales.",
  },
  home: {
    heroBadge: "Encuentra apoyo confiable",
    heroTitleStart: "Encuentra la ayuda que",
    heroTitleAccent: "más necesitas",
    heroDescription:
      "Explora recursos de alimentos, refugio, salud, empleo y educación en un directorio moderno y tranquilo diseñado para la claridad.",
    browseDirectory: "Explorar directorio",
    yourFavorites: "Tus favoritos",
    heroTitleFindThe: "Encuentra la",
    heroTitleHelp: "ayuda",
    heroTitleYouNeed: "que necesitas",
    heroTitleMost: "m\u00e1s",
    heroLead: "Personas reales, recursos reales, actualizados todos los d\u00edas.",
    heroLeadStatic:
      "Personas reales, recursos reales, actualizados todos los d\u00edas. Encuentra comida, refugio, empleo y atenci\u00f3n cerca de ti.",
    findHelpIn: "Encuentra ayuda en",
    scrollHint: "Despl\u00e1zate",
    previewLabel: "Vista previa",
    statsResources: "Recursos activos",
    statsCategories: "Categorías comunitarias",
    statsPartners: "Organizaciones aliadas",
    categoriesEyebrow: "Categorías destacadas",
    categoriesTitle: "Una experiencia tranquila y confiable para necesidades urgentes",
    categoriesDescription:
      "Cada categoría está diseñada para hacer evidente el siguiente paso, desde refugio de emergencia hasta apoyo laboral y educativo a largo plazo.",
    exploreCategory: "Explorar",
    featuredResourcesEyebrow: "Recursos destacados",
    featuredResourcesTitle: "Ayuda verificada, lista para explorar",
    featuredResourcesDescription:
      "Una muestra de organizaciones locales de confianza — los detalles, horarios y direcciones están siempre a un toque.",
    strategyEyebrow: "IA + estrategia",
    strategyTitle: "Una estrategia de producto basada en un caso real de negocio",
    strategyDescription:
      "ResourceHive combina credibilidad sin fines de lucro con un modelo de servicio digital escalable para familias, trabajadores sociales y organizaciones aliadas.",
    execSummary: "Resumen ejecutivo",
    execSummaryText:
      "ResourceHive es una plataforma moderna de apoyo comunitario creada para reducir el tiempo de búsqueda, aumentar la visibilidad de recursos y mejorar el acceso a los servicios.",
    marketUsers: "Mercado y usuarios",
    marketUsersText:
      "Los usuarios principales incluyen familias de bajos ingresos, personas en búsqueda de empleo, trabajadores sociales y organizaciones que coordinan servicios de alimentos, refugio, salud y educación.",
    growthFeatures: "Funciones de crecimiento",
    growthFeaturesText:
      "La coincidencia con IA, el soporte multilingüe, los historiales guardados y las alertas en tiempo real crean una base para desplegarse en toda la ciudad y con organizaciones aliadas.",
    volunteerEyebrow: "Voluntariado y donaciones",
    volunteerTitle: "Apoya la red detrás de los servicios",
    volunteerDescription:
      "Cada listado se mantiene al día porque la gente colabora. Dona, echa una mano o suma tu organización a la colmena.",
    volunteerPoint1: "Patrocina kits de comida de emergencia o suministros de higiene.",
    volunteerPoint2: "Haz voluntariado para traducción, transporte o apoyo de admisión.",
    volunteerPoint3: "Asóciate con ResourceHive para publicar listados locales verificados.",
    becomeVolunteer: "Ser voluntario",
    donate: "Donar",
    howItWorksEyebrow: "C\u00f3mo funciona",
    howItWorksTitle: "Ayuda en tres pasos sencillos",
    howItWorksDescription:
      "Sin registros ni tecnicismos: solo el camino m\u00e1s r\u00e1pido desde una necesidad hasta apoyo local real.",
    step1Title: "Dinos qu\u00e9 necesitas",
    step1Text:
      "Elige una necesidad: comida, refugio, una cl\u00ednica, o simplemente escr\u00edbela. Sin cuenta ni formularios.",
    step2Title: "Mira qu\u00e9 est\u00e1 abierto cerca",
    step2Text:
      "Explora listados verificados con horarios reales, elegibilidad y ubicaci\u00f3n, en un mapa o en una lista.",
    step3Title: "Comun\u00edcate con confianza",
    step3Text:
      "Llama, obt\u00e9n direcciones o gu\u00e1rdalo para despu\u00e9s: todo lo que necesitas saber antes de ir.",
  },
  about: {
    eyebrow: "Acerca de ResourceHive",
    title: "Una plataforma con propósito diseñada como un producto de primer nivel",
    description:
      "ResourceHive existe para que el apoyo esencial sea más fácil de descubrir, más fácil de confiar y más fácil de usar.",
    storyTitle: "Nuestra historia",
    storyText:
      "Demasiadas familias pierden tiempo y energía persiguiendo enlaces desactualizados, PDFs dispersos y directorios fragmentados. ResourceHive convierte esa fricción en una experiencia clara y moderna.",
    impactTitle: "Nuestra visión de impacto",
    impactText:
      "Ayudamos a las personas a encontrar apoyo más rápido mientras damos a organizaciones y equipos comunitarios una entrada digital más clara para sus programas diarios.",
    scaleTitle: "Cómo escalamos",
    scaleText:
      "El producto está estructurado para expansión por ciudad con interfaces multilingües, flujo de administración, sugerencias con IA y exploración guiada por mapas.",
  },
  contact: {
    title: "Construyamos una red local de apoyo más fuerte",
    description:
      "Contáctanos para colaborar, enviar una actualización de recurso o preguntar cómo ResourceHive puede apoyar a tu organización.",
    hub: "Centro comunitario de operaciones de Dallas-Fort Worth",
  },
  auth: {
    notConnected:
      "El inicio de sesi\u00f3n a\u00fan no est\u00e1 conectado. Agrega tus claves de Supabase a .env.local para habilitar cuentas.",
    signupTitle: "Crea tu cuenta",
    loginTitle: "Inicia sesi\u00f3n con correo",
    signupDescription: "\u00danete a ResourceHive para guardar recursos y administrar tu propia colmena.",
    loginDescription: "Bienvenido de nuevo. Inicia sesi\u00f3n para ver tu panel y recursos guardados.",
    password: "Contrase\u00f1a",
    hidePassword: "Ocultar contrase\u00f1a",
    showPassword: "Mostrar contrase\u00f1a",
    forgotPassword: "\u00bfOlvidaste tu contrase\u00f1a?",
    getStarted: "Comenzar",
    signIn: "Iniciar sesi\u00f3n",
    orSignUpWith: "O reg\u00edstrate con",
    orSignInWith: "O inicia sesi\u00f3n con",
    continueWithGoogle: "Continuar con Google",
    alreadyHaveAccount: "\u00bfYa tienes una cuenta? ",
    newToResourceHive: "\u00bfNuevo en ResourceHive? ",
    createAccount: "Crear una cuenta",
    checkEmail: "Revisa tu correo para confirmar tu cuenta y luego inicia sesi\u00f3n.",
    enterEmailFirst: "Primero ingresa tu correo arriba y luego toca restablecer.",
    resetSent: "Si ese correo existe, el enlace para restablecer la contrase\u00f1a ya va en camino.",
  },
  faq: {
    eyebrow: "Ayuda de ResourceHive",
    title: "Preguntas frecuentes",
    q1: "¿Cómo decide ResourceHive qué listados aparecen primero?",
    a1: "Los resultados pueden filtrarse por ciudad y categoría, mientras que las recomendaciones con IA priorizan los recursos que mejor coinciden con las necesidades seleccionadas y la cercanía.",
    q2: "¿Las organizaciones pueden enviar o actualizar sus propios listados?",
    a2: "Sí. El panel de administración está preparado para crear, editar y eliminar listados, y luego puede conectarse a autenticación basada en roles.",
    q3: "¿La aplicación admite varios idiomas?",
    a3: "Sí. La versión actual incluye un selector bilingüe de inglés y español y está preparada para ampliar más idiomas.",
    q4: "¿ResourceHive está lista para desplegarse?",
    a4: "Sí. El proyecto está construido con Next.js y está listo para un despliegue estilo Vercel, con persistencia local en JSON que puede cambiarse por una base de datos alojada.",
  },
  resourcesPage: {
    eyebrow: "Directorio de recursos",
    title: "Busca servicios confiables con rapidez y claridad",
    description:
      "Explora apoyo de alimentos, refugio, salud, empleo, educación, ayuda legal y servicios comunitarios con filtros elegantes y vistas rápidas de detalle.",
    matched: "recursos encontrados",
    totalInDirectory: "en total en el directorio",
  },
  mapPage: {
    eyebrow: "Vista de mapa",
    title: "Visualiza apoyo cercano de un vistazo",
    description:
      "La exploración basada en mapa ayuda a visualizar servicios cercanos, identificar categorías rápidamente y abrir detalles directamente desde los marcadores.",
  },
  heroSearch: {
    placeholder: "Busca comida, vivienda, empleo, clínicas, escuelas...",
  },
  recommendation: {
    title: "Recomendaciones con IA",
    description:
      "Comienza con las necesidades que una persona tiene en este momento y ResourceHive mostrará las coincidencias de apoyo más fuertes.",
    cityFragment: " en {city}",
    summaryFound:
      "Estas son las coincidencias más fuertes para {needs}{city}, ordenadas por afinidad de servicio y cercanía.",
    summaryEmpty:
      "No se encontraron coincidencias exactas para {needs}{city}, así que prueba ampliando los filtros.",
  },
  dashboard: {
    welcomeBack: "Bienvenido de nuevo",
    defaultTitle: "Tu panel de apoyo",
    description:
      "Haz seguimiento de recursos guardados, revisa búsquedas recientes y mantente al tanto de actualizaciones comunitarias urgentes.",
    savedResources: "Recursos guardados",
    recentViews: "Vistas recientes",
    nearbyCities: "Ciudades cercanas",
    weeklyUpdates: "Actualizaciones semanales",
    communityAlerts: "Alertas comunitarias",
    alertsSubtitle: "Novedades relevantes para residentes locales esta semana.",
    recentHistory: "Historial reciente",
    saveHint:
      "Guarda recursos de alimentos, vivienda, salud y empleo para crear una lista personalizada de apoyo.",
    historyHint:
      "Empieza a explorar el directorio y tus visitas recientes aparecerán aquí automáticamente.",
    open: "Abrir",
    alert1: "Harbor Night Shelter agregó 12 camas de emergencia adicionales para ingresos de abril.",
    alert2:
      "Open Door Skills Lab lanzó una cohorte de certificación de montacargas de fin de semana.",
    alert3:
      "Hope Harvest Pantry Network ofrece recogida de productos el mismo día los viernes.",
  },
  admin: {
    title: "Administrar listados",
    description: "Agrega, edita, elimina o importa recursos comunitarios en bloque.",
    imported: "Importados",
    resources: "recursos",
    skipped: "omitidos",
    rowIssues: "problemas de filas detectados",
  },
  preferences: {
    eyebrow: "Tus preferencias",
    title: "Tus favoritos y tus propios recursos",
    description:
      "Todo aquí es privado de tu cuenta: los favoritos que marcas y los recursos que agregas aparecen solo para ti, nunca para otros usuarios ni en el directorio público.",
    favoritesTitle: "Tus favoritos",
    favoritesEmpty:
      "Toca el corazón en cualquier recurso del directorio para guardarlo aquí y acceder rápido.",
    yourList: "Tus recursos agregados",
    addTitle: "Agregar un recurso",
    editTitle: "Editar recurso",
    emptyHint:
      "Aún no has agregado ningún recurso. Completa el formulario para agregar el primero: solo tú lo verás.",
  },
  resourceDetail: {
    whyThisMattersText:
      "ResourceHive está diseñado para reducir la fricción justo en el momento en que se necesita ayuda, con claridad sobre horarios, ubicación y elegibilidad antes de que alguien haga el viaje.",
  },
} as const;
