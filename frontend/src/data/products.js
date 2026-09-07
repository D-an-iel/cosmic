import heroRingImg from '../assets/lunar_ring_hero.jpg';
import macroRingImg from '../assets/lunar_ring_macro.jpg';
import onModelRingImg from '../assets/lunar_ring_onmodel.jpg';
import packagingRingImg from '../assets/lunar_ring_packaging.jpg';
import angleRingImg from '../assets/lunar_ring_angle.jpg';
import lunarImg from '../assets/lunar_collection.jpg';
import novaImg from '../assets/nova_collection.jpg';
import eclipseImg from '../assets/eclipse_collection.jpg';
import heroEditorial from '../assets/hero_editorial.jpg';

export const COLOR_VARIANTS = [
  { id: 'silver', name: 'Silver', hex: '#E2E8F0', desc: 'Solid 925 Sterling Silver with raw mirror polish' },
  { id: 'chrome', name: 'Chrome', hex: '#94A3B8', desc: 'Liquid Rhodium immersion for extreme mirror sheen' },
  { id: 'midnight-black', name: 'Midnight Black', hex: '#18181B', desc: 'Ruthenium shadow dip with satin edge bevels' },
];

export const SIZE_VARIANTS = ['6', '7', '8', '9', '10'];

export const PRODUCTS = [
  {
    id: 'lunar-silver-ring',
    slug: 'lunar-silver-ring',
    name: 'Lunar Silver Ring',
    category: 'Premium Ring Collection',
    collection: 'Lunar Series',
    type: 'Rings',
    price: 799,
    rating: 4.8,
    reviewCount: 24,
    availability: 'In Stock',
    tag: 'Flagship Creation',
    shortDescription: 'Cast in solid 925 sterling silver with a sculpted celestial bevel. Individually hand-finished in our Milanese atelier.',
    story: 'Inspired by celestial movement and cosmic elegance, the Lunar Silver Ring combines polished craftsmanship with timeless minimalism. Sculpted with faceted outer chamfers that mirror the curvature of planetary orbits, each ring is forged in solid 925 sterling silver and finished with a 14-step liquid rhodium immersion bath. Light glances across its beveled surface in razor-sharp ribbons, offering a tactile testament to modern luxury.',
    gallery: [
      { id: 1, src: heroRingImg, alt: 'Lunar Silver Ring - Hero Studio Silhouette', label: 'The Form' },
      { id: 2, src: macroRingImg, alt: 'Lunar Silver Ring - Celestial Bevel & S925 Hallmark', label: 'Macro Bevel' },
      { id: 3, src: onModelRingImg, alt: 'Lunar Silver Ring - On Model Editorial Styling', label: 'Silhouette' },
      { id: 4, src: angleRingImg, alt: 'Lunar Silver Ring - Architectural 45-Degree View', label: 'Architecture' },
      { id: 5, src: packagingRingImg, alt: 'Lunar Silver Ring - Velvet Monolith Box', label: 'The Monolith' },
    ],
    accordions: {
      details: [
        { label: 'Edition', value: 'Permanent Flagship Collection • Batch 04' },
        { label: 'Hallmark', value: 'Laser-inscribed S925 & Cosmic Star logo' },
        { label: 'Fit Profile', value: 'Comfort Fit interior shank with curved inner radius' },
        { label: 'Packaging', value: 'Matte black textured monolith box lined in micro-velvet' },
      ],
      materials: [
        { label: 'Base Metal', value: 'Solid 925 Sterling Silver (92.5% pure silver, 7.5% copper)' },
        { label: 'Surface Plating', value: '0.05 micron Liquid Rhodium or Ruthenium protective dip' },
        { label: 'Hypoallergenic', value: '100% Nickel-free, Lead-free, Cadmium-free' },
        { label: 'Tarnish Resistance', value: 'Engineered anti-oxidation barrier applied at atelier' },
      ],
      dimensions: [
        { label: 'Band Width', value: '6.2 mm at crown, tapering to 4.8 mm at base' },
        { label: 'Band Thickness', value: '2.4 mm sculpted profile' },
        { label: 'Average Weight', value: '8.6 grams (varies slightly by size)' },
        { label: 'Ring Sizes', value: 'US 6 to US 10 standard sizing' },
      ],
      shipping: [
        { label: 'Dispatch', value: 'Orders placed before 2:00 PM IST dispatched same day' },
        { label: 'Complimentary Delivery', value: 'Insured express shipping across India (2-4 business days)' },
        { label: 'Tracking', value: 'Real-time SMS & email tracking updates with secured OTP delivery' },
        { label: 'Global Shipping', value: 'Available to 40+ countries via DHL Express (3-6 days)' },
      ],
      returns: [
        { label: '30-Day Window', value: 'Complimentary exchanges & returns within 30 days of delivery' },
        { label: 'Size Exchange', value: 'Free doorstep reverse pickup for hassle-free size changes' },
        { label: 'Condition', value: 'Items must be unworn in original presentation packaging' },
        { label: 'Refund Method', value: 'Processed back to original payment method within 48 hours' },
      ],
      care: [
        { label: 'Storage', value: 'Store individually in the provided velvet Cosmic monolith box' },
        { label: 'Cleaning', value: 'Gently buff with the complimentary microfibre polishing cloth' },
        { label: 'Avoid Chemicals', value: 'Remove before swimming, hot tubs, or applying perfumes/lotions' },
        { label: 'Atelier Refurbishing', value: 'Complimentary ultrasonic cleaning service valid for lifetime' },
      ],
    },
    reviews: [
      {
        id: 1,
        name: 'Alexander V.',
        location: 'London, UK',
        date: 'August 24, 2026',
        rating: 5,
        size: '8',
        color: 'Chrome',
        verified: true,
        title: 'Phenomenal weight and sculptural presence',
        comment: 'The geometric facets catch ambient light exactly like in the studio editorial. It has substantial heft in hand without feeling bulky on the finger. The rhodium finish is intensely reflective—closest thing to wearable liquid chrome.',
      },
      {
        id: 2,
        name: 'Valerie D.',
        location: 'Paris, FR',
        date: 'July 18, 2026',
        rating: 5,
        size: '7',
        color: 'Silver',
        verified: true,
        title: 'Supreme craftsmanship, beats high jewelry houses',
        comment: 'Ordered this after admiring the editorial campaign. The registered S925 hallmark is razor sharp on the inside shank. Packaged inside a heavy matte black velvet box that feels like an art piece. Worth way more than ₹799.',
      },
      {
        id: 3,
        name: 'Marcus K.',
        location: 'Tokyo, JP',
        date: 'June 30, 2026',
        rating: 5,
        size: '8',
        color: 'Midnight Black',
        verified: true,
        title: 'Represent / Fear of God aesthetic done to perfection',
        comment: 'Pairs seamlessly with heavy dark tailored streetwear. The bevels reflect ambient light in angular slices. Delivery to Tokyo took only 3 days via express courier.',
      },
      {
        id: 4,
        name: 'Rohan M.',
        location: 'Mumbai, IN',
        date: 'May 12, 2026',
        rating: 5,
        size: '10',
        color: 'Silver',
        verified: true,
        title: 'Flawless mirror finish, exceptional value',
        comment: 'At ₹799 this is genuinely unbeatable for solid 925 sterling silver. Had to exchange sizes and their concierge completed the replacement in 48 hours without friction.',
      },
      {
        id: 5,
        name: 'Camille L.',
        location: 'Geneva, CH',
        date: 'April 28, 2026',
        rating: 5,
        size: '7',
        color: 'Chrome',
        verified: true,
        title: 'A futuristic artifact worthy of high fashion',
        comment: 'The architectural bevels catch the light like polished diamond facets. Wearing this makes any tailored dark blazer look like runway couture. The monolith velvet packaging alone is museum grade.',
      },
      {
        id: 6,
        name: 'Julian B.',
        location: 'New York, USA',
        date: 'April 04, 2026',
        rating: 5,
        size: '9',
        color: 'Midnight Black',
        verified: true,
        title: 'Liquid chrome that outclasses traditional jewelry',
        comment: 'The ruthenium midnight finish is subtle yet commanding. Substantial comfort-fit weight on the hand. Arrived in Manhattan in 3 days with tamper-evident serial seal.',
      },
    ],
    relatedSlugs: ['nova-orbital-hoops', 'eclipse-pave-pendant', 'stardust-band-ring', 'astral-drop-earrings'],
  },
  {
    id: 'nova-orbital-hoops',
    slug: 'nova-orbital-hoops',
    name: 'Nova Orbital Hoops',
    category: 'Orbital Earring Collection',
    collection: 'Nova Series',
    type: 'Earrings',
    price: 849,
    rating: 4.9,
    reviewCount: 32,
    availability: 'In Stock',
    tag: 'New Arrival',
    shortDescription: 'Dual planetary concentric rings finished in high-lustre liquid rhodium for brilliant reflection under any ambient light.',
    story: 'Conceived from the harmonic resonance of binary stellar systems, the Nova Orbital Hoops suspend two concentric arcs in suspended equilibrium. Forged in solid sterling silver with precision spring-hinged closures, they catch even subtle room lighting with effortless radiance.',
    gallery: [
      { id: 1, src: novaImg, alt: 'Nova Orbital Hoops - Editorial Studio', label: 'Studio Front' },
      { id: 2, src: macroRingImg, alt: 'Nova Orbital Hoops - Concentric Macro Detailing', label: 'Macro Bevel' },
      { id: 3, src: heroEditorial, alt: 'Nova Orbital Hoops - On Model High Fashion', label: 'Editorial' },
      { id: 4, src: angleRingImg, alt: 'Nova Orbital Hoops - Profile Geometry', label: 'Architectural' },
      { id: 5, src: packagingRingImg, alt: 'Nova Orbital Hoops - Luxury Box Packaging', label: 'Packaging' },
    ],
    accordions: {
      details: [
        { label: 'Edition', value: 'Nova First Run • Handcrafted' },
        { label: 'Clasp Mechanism', value: 'Concealed acoustic snap hinge' },
        { label: 'Wearability', value: 'Balanced weight distribution for all-day comfort' },
        { label: 'Packaging', value: 'Matte black textured monolith box with suede pouch' },
      ],
      materials: [
        { label: 'Base Metal', value: 'Solid 925 Sterling Silver' },
        { label: 'Plating', value: 'Triple-layer Liquid Rhodium immersion' },
        { label: 'Post Material', value: 'Surgical grade hypoallergenic silver' },
        { label: 'Certification', value: 'Atelier registered hallmark' },
      ],
      dimensions: [
        { label: 'Diameter', value: '24.0 mm outer hoop, 16.5 mm inner orbit' },
        { label: 'Thickness', value: '2.8 mm tubular profile' },
        { label: 'Weight per Ear', value: '4.8 grams' },
        { label: 'Post Length', value: '11.0 mm comfortable fit' },
      ],
      shipping: [
        { label: 'Dispatch', value: 'Same-day dispatch for orders confirmed before 2 PM' },
        { label: 'Standard Delivery', value: '2-4 business days across India via Express Courier' },
        { label: 'Packaging', value: 'Tamper-evident luxury seal packaging' },
      ],
      returns: [
        { label: 'Hygiene Seal', value: 'Returns accepted within 30 days if seal remains intact' },
        { label: 'Exchange Policy', value: 'Free replacement in case of sizing or fitting inquiries' },
      ],
      care: [
        { label: 'Cleaning', value: 'Wipe with soft polishing cloth after each wear' },
        { label: 'Storage', value: 'Keep in individual micro-suede compartments' },
      ],
    },
    reviews: [
      {
        id: 1,
        name: 'Elena S.',
        location: 'Berlin, DE',
        date: 'August 14, 2026',
        rating: 5,
        size: 'Standard',
        color: 'Chrome',
        verified: true,
        title: 'Lightweight yet commanding presence',
        comment: 'I was worried concentric hoops might pull down my earlobes, but the hollow core engineering makes them remarkably light. The shine is unreal.',
      },
      {
        id: 2,
        name: 'Pooja K.',
        location: 'Bengaluru, IN',
        date: 'July 29, 2026',
        rating: 5,
        size: 'Standard',
        color: 'Silver',
        verified: true,
        title: 'Architectural minimalism at its peak',
        comment: 'Received compliments constantly during fashion week. The click when snapping the clasp closed feels like a luxury car door.',
      },
    ],
    relatedSlugs: ['lunar-silver-ring', 'eclipse-pave-pendant', 'astral-drop-earrings', 'stardust-band-ring'],
  },
  {
    id: 'eclipse-pave-pendant',
    slug: 'eclipse-pave-pendant',
    name: 'Eclipse Pavé Pendant',
    category: 'Architectural Necklace Collection',
    collection: 'Eclipse Series',
    type: 'Necklaces',
    price: 1299,
    rating: 4.9,
    reviewCount: 41,
    availability: 'In Stock',
    tag: 'Iconic Design',
    shortDescription: 'Inspired by the geometry of a total lunar eclipse. Features a concealed clasp and architectural diamond-cut chain.',
    story: 'Tracing the stark juxtaposition of shadow and illumination, the Eclipse Pavé Pendant captures the celestial totality of a solar-lunar convergence. Hand-set with micro-faceted moissanite crystals along a crescent abyss, suspended on an articulated 20-inch diamond-cut curb chain.',
    gallery: [
      { id: 1, src: eclipseImg, alt: 'Eclipse Pavé Pendant - Editorial Studio', label: 'Studio Front' },
      { id: 2, src: macroRingImg, alt: 'Eclipse Pavé Pendant - Pavé Detailing', label: 'Macro Bevel' },
      { id: 3, src: heroEditorial, alt: 'Eclipse Pavé Pendant - Editorial Silhouette', label: 'Editorial' },
      { id: 4, src: angleRingImg, alt: 'Eclipse Pavé Pendant - Beveled Clasp Geometry', label: 'Architectural' },
      { id: 5, src: packagingRingImg, alt: 'Eclipse Pavé Pendant - Presentation Case', label: 'Packaging' },
    ],
    accordions: {
      details: [
        { label: 'Chain Type', value: 'Diamond-cut Venetian Box Chain (20 inches)' },
        { label: 'Clasp', value: 'Bespoke cylindrical twist lock with security detent' },
        { label: 'Stone Setting', value: 'Micro-pavé channel setting by master gemsetters' },
        { label: 'Packaging', value: 'Heavyweight matte black presentation monolith box' },
      ],
      materials: [
        { label: 'Base Metal', value: 'Solid 925 Sterling Silver' },
        { label: 'Gems', value: 'Lab-grown VVS1 clarity Moissanite (0.85 ctw)' },
        { label: 'Finish', value: 'Liquid Rhodium with oxidised shadow recesses' },
        { label: 'Anti-tarnish', value: 'Atelier nano-ceramic protective seal' },
      ],
      dimensions: [
        { label: 'Pendant Diameter', value: '21.5 mm' },
        { label: 'Pendant Depth', value: '3.6 mm' },
        { label: 'Chain Length', value: '20 inches (50 cm) + 2 inch extender' },
        { label: 'Total Weight', value: '14.2 grams' },
      ],
      shipping: [
        { label: 'Delivery', value: 'Complimentary insured courier with tracking' },
        { label: 'Transit Time', value: '2-4 business days across metro cities' },
      ],
      returns: [
        { label: 'Guaranteed Return', value: '30-day hassle-free return and exchange guarantee' },
      ],
      care: [
        { label: 'Maintenance', value: 'Store flat in presentation case to prevent chain tangles' },
      ],
    },
    reviews: [
      {
        id: 1,
        name: 'Julian B.',
        location: 'New York, USA',
        date: 'August 03, 2026',
        rating: 5,
        size: '20"',
        color: 'Chrome',
        verified: true,
        title: 'The centerpiece of my everyday rotation',
        comment: 'The contrast between the dark oxidised groove and the brilliant chrome rim is hypnotic. Chain is sturdy and never catches hairs.',
      },
    ],
    relatedSlugs: ['lunar-silver-ring', 'nova-orbital-hoops', 'stardust-band-ring', 'celestial-cascade-choker'],
  },
  {
    id: 'stardust-band-ring',
    slug: 'stardust-band-ring',
    name: 'Stardust Band Ring',
    category: 'Minimalist Ring Collection',
    collection: 'Lunar Series',
    type: 'Rings',
    price: 699,
    rating: 4.7,
    reviewCount: 19,
    availability: 'In Stock',
    tag: 'Limited Edition',
    shortDescription: 'A continuous band sculpted with tactile cosmic fluting. Dipped in rare platinum for unmatched resistance to tarnish.',
    story: 'Sculpted with continuous vertical micro-fluting that disperses light in soft gradients, the Stardust Band Ring channels the tactile topography of lunar crater rims. Designed as a stackable companion or a standalone minimalist statement.',
    gallery: [
      { id: 1, src: lunarImg, alt: 'Stardust Band Ring - Studio View', label: 'Studio Front' },
      { id: 2, src: macroRingImg, alt: 'Stardust Band Ring - Fluted Macro', label: 'Macro Bevel' },
      { id: 3, src: onModelRingImg, alt: 'Stardust Band Ring - Hand Stack Styling', label: 'Editorial' },
      { id: 4, src: angleRingImg, alt: 'Stardust Band Ring - Architectural Perspective', label: 'Architectural' },
      { id: 5, src: packagingRingImg, alt: 'Stardust Band Ring - Packaging', label: 'Packaging' },
    ],
    accordions: {
      details: [
        { label: 'Profile', value: 'Continuous fluted perimeter' },
        { label: 'Stackability', value: 'Flush edges engineered for stacking with Lunar Silver Ring' },
      ],
      materials: [
        { label: 'Metal', value: 'Solid 925 Silver with rare platinum electro-deposition' },
      ],
      dimensions: [
        { label: 'Band Width', value: '4.5 mm uniform width' },
        { label: 'Band Thickness', value: '2.0 mm' },
        { label: 'Weight', value: '6.4 grams' },
      ],
      shipping: [
        { label: 'Dispatch', value: 'Dispatched within 24 hours' },
      ],
      returns: [
        { label: 'Exchange', value: 'Free 30-day exchange for alternative sizes' },
      ],
      care: [
        { label: 'Care', value: 'Buff with microfibre cloth occasionally' },
      ],
    },
    reviews: [
      {
        id: 1,
        name: 'Kabir T.',
        location: 'Delhi, IN',
        date: 'August 19, 2026',
        rating: 5,
        size: '9',
        color: 'Chrome',
        verified: true,
        title: 'Subtle and supremely comfortable',
        comment: 'The fluted texture feels amazing when spinning it on your finger. Pairs cleanly with my chronograph.',
      },
    ],
    relatedSlugs: ['lunar-silver-ring', 'nova-orbital-hoops', 'eclipse-pave-pendant', 'astral-drop-earrings'],
  },
  {
    id: 'celestial-cascade-choker',
    slug: 'celestial-cascade-choker',
    name: 'Celestial Cascade Choker',
    category: 'Haute Joaillerie Collection',
    collection: 'Nova Series',
    type: 'Necklaces',
    price: 1899,
    rating: 5.0,
    reviewCount: 15,
    availability: 'In Stock',
    tag: 'Haute Joaillerie',
    shortDescription: 'An editorial statement collar that rests effortlessly along the collarbone. Hand-articulated links provide fluid movement.',
    story: 'A magnum opus of modern silversmithing. Constructed from 48 articulated chrome segments that conform seamlessly to the contours of the neck like molten metal. Created for avant-garde editorial presence.',
    gallery: [
      { id: 1, src: heroEditorial, alt: 'Celestial Cascade Choker - Hero Editorial', label: 'Studio Front' },
      { id: 2, src: eclipseImg, alt: 'Celestial Cascade Choker - Articulated Links', label: 'Macro Bevel' },
      { id: 3, src: macroRingImg, alt: 'Celestial Cascade Choker - Detail', label: 'Editorial' },
      { id: 4, src: angleRingImg, alt: 'Celestial Cascade Choker - Geometry', label: 'Architectural' },
      { id: 5, src: packagingRingImg, alt: 'Celestial Cascade Choker - Case', label: 'Packaging' },
    ],
    accordions: {
      details: [
        { label: 'Crafting Hours', value: '18 hours of benchwork per collar' },
        { label: 'Articulation', value: '48 hand-riveted kinetic links' },
      ],
      materials: [
        { label: 'Metal', value: 'Solid 925 Argentium Silver • Mirror Chrome' },
      ],
      dimensions: [
        { label: 'Internal Circumference', value: '38.0 cm with 5 cm micro-adjustment chain' },
        { label: 'Band Height', value: '14.0 mm' },
        { label: 'Weight', value: '42.0 grams' },
      ],
      shipping: [
        { label: 'Delivery', value: 'Armored courier delivery with signature required' },
      ],
      returns: [
        { label: 'Policy', value: 'White-glove concierge return service within 30 days' },
      ],
      care: [
        { label: 'Care', value: 'Store flat in velvet presentation tray' },
      ],
    },
    reviews: [
      {
        id: 1,
        name: 'Camille L.',
        location: 'Geneva, CH',
        date: 'July 11, 2026',
        rating: 5,
        size: 'Adjustable',
        color: 'Chrome',
        verified: true,
        title: 'Wearable modern sculpture',
        comment: 'The movement of the links is as smooth as silk. A true showstopper at gallery openings.',
      },
    ],
    relatedSlugs: ['lunar-silver-ring', 'nova-orbital-hoops', 'eclipse-pave-pendant', 'astral-drop-earrings'],
  },
  {
    id: 'astral-drop-earrings',
    slug: 'astral-drop-earrings',
    name: 'Astral Drop Earrings',
    category: 'Sculptural Earring Collection',
    collection: 'Eclipse Series',
    type: 'Earrings',
    price: 749,
    rating: 4.8,
    reviewCount: 28,
    availability: 'In Stock',
    tag: 'New Edition',
    shortDescription: 'Elongated architectural teardrops featuring a brushed matte interior contrasted against mirror-chrome outer bevels.',
    story: 'Capturing the trajectory of falling meteorites across silent voids, the Astral Drop Earrings elongate the neck with aerodynamic elegance. Cast in solid silver with contrasting satin and mirror-chrome faceting.',
    gallery: [
      { id: 1, src: novaImg, alt: 'Astral Drop Earrings - Studio View', label: 'Studio Front' },
      { id: 2, src: macroRingImg, alt: 'Astral Drop Earrings - Beveled Facets', label: 'Macro Bevel' },
      { id: 3, src: heroEditorial, alt: 'Astral Drop Earrings - Editorial Profile', label: 'Editorial' },
      { id: 4, src: angleRingImg, alt: 'Astral Drop Earrings - Architectural View', label: 'Architectural' },
      { id: 5, src: packagingRingImg, alt: 'Astral Drop Earrings - Monolith Box', label: 'Packaging' },
    ],
    accordions: {
      details: [
        { label: 'Profile', value: 'Elongated teardrop with dual-finish surfaces' },
        { label: 'Backing', value: 'Bespoke comfort clutch backings included' },
      ],
      materials: [
        { label: 'Metal', value: 'Solid 925 Sterling Silver • Platinum dip' },
      ],
      dimensions: [
        { label: 'Drop Length', value: '46.0 mm' },
        { label: 'Maximum Width', value: '8.5 mm' },
        { label: 'Weight per Earring', value: '5.2 grams' },
      ],
      shipping: [
        { label: 'Shipping', value: 'Insured express shipping within 48 hours' },
      ],
      returns: [
        { label: 'Returns', value: '30-day exchange warranty' },
      ],
      care: [
        { label: 'Care', value: 'Clean gently with microfibre cloth' },
      ],
    },
    reviews: [
      {
        id: 1,
        name: 'Tara S.',
        location: 'Mumbai, IN',
        date: 'August 09, 2026',
        rating: 5,
        size: 'Standard',
        color: 'Chrome',
        verified: true,
        title: 'Architectural and stunning',
        comment: 'They frame the jawline beautifully. Very comfortable to wear for an entire evening without feeling heavy.',
      },
    ],
    relatedSlugs: ['lunar-silver-ring', 'nova-orbital-hoops', 'eclipse-pave-pendant', 'stardust-band-ring'],
  },
];

export function getProductBySlug(slug) {
  if (!slug) return PRODUCTS[0];
  const found = PRODUCTS.find((p) => p.slug.toLowerCase() === slug.toLowerCase());
  return found || PRODUCTS[0];
}

export function getRelatedProducts(slug) {
  const current = getProductBySlug(slug);
  if (!current || !current.relatedSlugs) {
    return PRODUCTS.filter((p) => p.slug !== slug).slice(0, 4);
  }
  const related = current.relatedSlugs
    .map((s) => PRODUCTS.find((p) => p.slug === s))
    .filter(Boolean);
  return related.slice(0, 4);
}
