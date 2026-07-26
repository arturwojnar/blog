// Services offered — consumed by the /offer page.
// Content per plan.md §4 (5 numbered services + satisfaction guarantee).

export const services = [
  {
    num: "01",
    en: {
      title: "Mentoring",
      meta: "1:1 · recurring",
      points: [
        "Technical growth & conscious career pathing",
        "Engineer >> Solutions Architect transition",
        "Engineer >> Tech Lead / Engineering Manager transition",
        "Responsibility boundaries, hard decisions & conversations",
        "Code review & pair programming as hands-on learning",
        "Building, leading & motivating a team",
      ],
    },
    pl: {
      title: "Mentoring",
      meta: "1:1 · cyklicznie",
      points: [
        "Rozwój techniczny i świadome planowanie ścieżki kariery",
        "Przejście z roli inżyniera do Solutions Architecta",
        "Przejście z roli inżyniera do Tech Leada",
        "Granice odpowiedzialności, trudne decyzje i rozmowy",
        "Code review i pair programming jako nauka w praktyce",
        "Budowanie, prowadzenie i motywowanie zespołu",
      ],
    },
  },
  {
    num: "02",
    en: {
      title: "Consulting / Audits",
      meta: "audit · advisory → report + PoC",
      points: [
        "DDD — strategic & tactical modeling, boundaries, aggregates, event streams",
        "SDLC optimization — reducing lead time, decoupling delivery, flow",
        "AWS cloud architecture — spend audit, architecture-driven savings",
        "Data systems — discrepancies, pipelines, warehouses",
        "Architecture audit with prioritized report (examples + recommendations)",
        "Examples in Node.js / TypeScript",
      ],
    },
    pl: {
      title: "Konsultacje / Audyty",
      meta: "audyt · doradztwo → raport + PoC",
      points: [
        "DDD — modelowanie strategiczne i taktyczne, granice, agregaty",
        "Optymalizacja SDLC — skracanie lead time, odsprzęganie dostaw, flow",
        "Redukcja kosztów AWS — audyt wydatków, oszczędności przez architekturę",
        "Systemy danych — rozbieżności, potoki danych, hurtownie",
        "Audyt architektury z raportem (priorytety, przykłady, rekomendacje)",
        "Przykłady w Node.js / TypeScript",
      ],
    },
  },
  {
    num: "03",
    en: {
      title: "Workshops",
      meta: "1–3 days · online / on-site · EN & PL",
      points: [
        "Modernize legacy with Event Sourcing",
        "Domain-Driven Design — strategic & tactical",
        "Event-driven architecture & CQRS",
        "SDLC optimization",
        "Fixing cloud-native architecture & data pipelines",
        "All examples in Node.js",
      ],
    },
    pl: {
      title: "Warsztaty",
      meta: "1–3 dni · online / on-site · EN & PL",
      points: [
        "Modernizacja legacy z Event Sourcing (flagowy)",
        "Domain-Driven Design — strategicznie i taktycznie",
        "Optymalizacja SDLC / dostaw",
        "Koszty i architektura AWS",
        "Niezawodność potoków danych / hurtowni",
        "Wszystkie przykłady w Node.js",
      ],
    },
  },
  {
    num: "04",
    en: {
      title: "Talks / Webinars",
      meta: "conferences · meetups · webinars",
      points: [
        "Architecture, DDD, distributed systems",
        "Product-from-tech perspective",
        "See all talks on the Speaker page",
      ],
    },
    pl: {
      title: "Prelekcje / Webinary",
      meta: "konferencje · meetupy · webinary",
      points: [
        "Architektura, DDD, systemy rozproszone",
        "Perspektywa produktowa od strony technicznej",
        "Zobacz wszystkie wystąpienia na stronie Speaker",
      ],
    },
  },
  {
    num: "05",
    en: {
      title: "Product Discovery",
      meta: "online / on-site · facilitation",
      points: [
        "Event Storming — Big Picture / Process / Design level",
        "Business capability map",
        "Discovering business opportunities, pain points and bottlenecks",
        "Domain Storytelling",
        "Pivotal events, swimlanes, hotspots with owners",
        "From the board to a Context Map + glossary",
        "For engineers AND business/product people",
      ],
    },
    pl: {
      title: "Odkrywanie produktu",
      meta: "online / on-site · facylitacja",
      points: [
        "Event Storming — Big Picture / Process / Design level",
        "Domain Storytelling",
        "Pivotal events, swimlanes, hot spoty z właścicielami",
        "Od tablicy do Context Map i glosariusza",
        "Dla programistów I osób biznesowych/produktowych",
      ],
    },
  },
  {
    num: "06",
    en: {
      title: "Custom",
      meta: "your problem · your terms",
      points: [
        "Have a specific problem that doesn't fit a standard format?",
        "Bring it — we'll figure out the shape together",
        "Could be a deep-dive session, async review, or a short engagement",
        "No fixed scope, no upsell — just what you actually need",
      ],
    },
    pl: {
      title: "Na miarę",
      meta: "twój problem · twoje warunki",
      points: [
        "Masz konkretny problem, który nie pasuje do standardowego formatu?",
        "Przynieś go — wspólnie ustalimy, jak to ugryźć",
        "Może to być głęboka sesja, recenzja async lub krótkie zaangażowanie",
        "Bez sztywnego zakresu, bez upsellingu — tylko to, czego naprawdę potrzebujesz",
      ],
    },
  },
];

export const copy = {
  en: {
    eyebrow: "collaboration",
    title: "Offer",
    lede: "I help teams and individuals through hard technical decisions — from strategy and architecture, through code, to cloud. Six ways we can work together:",
    guaranteeTitle: "Satisfaction guarantee",
    guarantee:
      "If you're not happy with the results — a workshop, an audit, a session — you don't pay. Simple as that.",
    ctaTitle: "Stuck on a hard technical decision?",
    ctaText: "Book a short call and let's talk about where you're stuck.",
    ctaButton: "Book a call",
    langSwitch: "🇬🇧 EN",
    langSwitchUrl: "/offer",
    recoMore: "All recommendations on LinkedIn",
  },
  pl: {
    eyebrow: "współpraca",
    title: "Oferta",
    lede: "Pomagam zespołom i osobom przejść przez trudne decyzje techniczne — od strategii i architektury, przez kod, po chmurę. Sześć sposobów, w jakie możemy razem pracować:",
    guaranteeTitle: "Gwarancja satysfakcji",
    guarantee:
      "Jeśli nie jesteś zadowolony z rezultatów — warsztatu, audytu, sesji — nie płacisz. Tak po prostu.",
    ctaTitle: "Utknąłeś na trudnej decyzji technicznej?",
    ctaText: "Umów krótką rozmowę i pogadajmy o tym, gdzie utknąłeś.",
    ctaButton: "Umów rozmowę",
    langSwitch: "🇬🇧 EN »",
    langSwitchUrl: "/offer",
    recoMore: "Wszystkie rekomendacje na LinkedIn",
  },
};

export default { services, copy };
