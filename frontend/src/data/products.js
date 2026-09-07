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
  // 1. LUNAR SILVER RING (Flagship)
  {
    id: 'lunar-silver-ring',
    slug: 'lunar-silver-ring',
    name: 'Lunar Silver Ring',
    category: 'Sculptural Ring Collection',
    collection: 'Lunar Series',
    type: 'Rings',
    price: 799,
    rating: 4.8,
    reviewCount: 24,
    availability: 'In Stock',
    tag: 'Flagship Creation',
    shortDescription: 'Cast in solid 925 sterling silver with a sculpted celestial bevel. Individually hand-finished in our Milanese atelier.',
    story: 'Inspired by celestial movement and cosmic elegance, the Lunar Silver Ring combines polished craftsmanship with timeless minimalism. Sculpted with faceted outer chamfers that mirror the curvature of planetary orbits, each ring is forged in solid 925 sterling silver and finished with a 14-step liquid rhodium immersion bath. Light glances across its beveled surface in razor-sharp ribbons, offering a tactile testament to modern luxury.',
    colors: COLOR_VARIANTS,
    sizes: ['6', '7', '8', '9', '10'],
    sizeType: 'Size (US)',
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
    ],
    relatedSlugs: ['nova-eclipse-ring', 'stellar-chain', 'orbit-bracelet', 'celestial-pendant'],
  },

  // 2. NOVA ECLIPSE RING
  {
    id: 'nova-eclipse-ring',
    slug: 'nova-eclipse-ring',
    name: 'Nova Eclipse Ring',
    category: 'Architectural Ring Collection',
    collection: 'Nova Series',
    type: 'Rings',
    price: 849,
    rating: 4.9,
    reviewCount: 31,
    availability: 'In Stock',
    tag: 'New Edition',
    shortDescription: 'Dual concentric orbits sculpted in solid sterling silver. Features liquid rhodium mirror plating with recessed satin grooves.',
    story: 'Conceived from the harmonic alignment of celestial eclipses, the Nova Eclipse Ring suspends two micro-chamfered bands in permanent architectural tension. The interior band features a brushed shadow recess, contrasting against the razor-mirror liquid chrome outer perimeter.',
    colors: COLOR_VARIANTS,
    sizes: ['6', '7', '8', '9', '10'],
    sizeType: 'Size (US)',
    gallery: [
      { id: 1, src: angleRingImg, alt: 'Nova Eclipse Ring - Architectural Perspective', label: 'Concentric Arcs' },
      { id: 2, src: macroRingImg, alt: 'Nova Eclipse Ring - Micro-Groove Chamfer', label: 'Macro Detail' },
      { id: 3, src: heroRingImg, alt: 'Nova Eclipse Ring - Studio Silhouette', label: 'Studio Profile' },
      { id: 4, src: onModelRingImg, alt: 'Nova Eclipse Ring - Hand Editorial View', label: 'On-Model' },
      { id: 5, src: packagingRingImg, alt: 'Nova Eclipse Ring - Velvet Monolith', label: 'Presentation' },
    ],
    accordions: {
      details: [
        { label: 'Edition', value: 'Nova Series • Batch 02' },
        { label: 'Band Structure', value: 'Dual concentric channel with acoustic balance' },
        { label: 'Hallmark', value: 'Laser-inscribed S925 on internal chamfer' },
        { label: 'Packaging', value: 'Matte black textured monolith case' },
      ],
      materials: [
        { label: 'Base Metal', value: 'Solid 925 Sterling Silver' },
        { label: 'Plating', value: 'Triple-dip Liquid Rhodium immersion' },
        { label: 'Hypoallergenic', value: 'Guaranteed 100% Nickel & Lead Free' },
      ],
      dimensions: [
        { label: 'Band Width', value: '7.0 mm continuous width' },
        { label: 'Thickness', value: '2.5 mm precision shank' },
        { label: 'Average Weight', value: '9.4 grams' },
      ],
      shipping: [
        { label: 'Dispatch', value: 'Dispatched within 24 hours via Air Express' },
        { label: 'Transit Time', value: '2-3 business days across India' },
      ],
      returns: [
        { label: 'Policy', value: '30-day complimentary exchange or return' },
      ],
      care: [
        { label: 'Care', value: 'Buff with microfibre cloth to maintain mirror reflection' },
      ],
    },
    reviews: [
      {
        id: 1,
        name: 'Julian B.',
        location: 'New York, USA',
        date: 'August 18, 2026',
        rating: 5,
        size: '9',
        color: 'Chrome',
        verified: true,
        title: 'Architectural perfection on the hand',
        comment: 'The dual concentric bands catch light independently, creating an optical shimmer when moving your hand. Substantial heft and immaculate interior comfort bevel.',
      },
      {
        id: 2,
        name: 'Rohan M.',
        location: 'Mumbai, IN',
        date: 'July 26, 2026',
        rating: 5,
        size: '8',
        color: 'Midnight Black',
        verified: true,
        title: 'Dark ruthenium finish is insane',
        comment: 'The contrast between the satin recess and mirror outer rim looks straight out of an avant-garde runway show.',
      },
    ],
    relatedSlugs: ['lunar-silver-ring', 'celestial-pendant', 'orbit-bracelet', 'stellar-chain'],
  },

  // 3. CELESTIAL PENDANT
  {
    id: 'celestial-pendant',
    slug: 'celestial-pendant',
    name: 'Celestial Pendant',
    category: 'Iconic Necklace Collection',
    collection: 'Eclipse Series',
    type: 'Necklaces',
    price: 1299,
    rating: 4.9,
    reviewCount: 42,
    availability: 'In Stock',
    tag: 'Iconic Design',
    shortDescription: 'Sculpted celestial medallion cast in solid 925 silver with liquid rhodium mirror finish on an Italian diamond-cut curb chain.',
    story: 'Tracing the stark juxtaposition of cosmic voids and stellar radiance, the Celestial Pendant captures the celestial geometry of deep space. Hand-finished with faceted perimeter chamfers and suspended from an articulated 20-inch diamond-cut curb chain with a custom cylindrical security lock.',
    colors: COLOR_VARIANTS,
    sizes: ['18"', '20"', '22"', '24"'],
    sizeType: 'Chain Length',
    gallery: [
      { id: 1, src: eclipseImg, alt: 'Celestial Pendant - Studio Front', label: 'The Medallion' },
      { id: 2, src: macroRingImg, alt: 'Celestial Pendant - Macro Chamfer', label: 'Macro Bevel' },
      { id: 3, src: heroEditorial, alt: 'Celestial Pendant - Editorial Styling', label: 'On-Model' },
      { id: 4, src: angleRingImg, alt: 'Celestial Pendant - Clasp Detail', label: 'Curb Geometry' },
      { id: 5, src: packagingRingImg, alt: 'Celestial Pendant - Presentation Case', label: 'Packaging' },
    ],
    accordions: {
      details: [
        { label: 'Pendant Form', value: 'Sculptural cosmic circular medallion with faceted chamfer' },
        { label: 'Chain Type', value: 'Italian Diamond-Cut Curb Chain (solid S925)' },
        { label: 'Clasp Mechanism', value: 'Bespoke cylindrical twist clasp with detent' },
        { label: 'Packaging', value: 'Matte black velvet-lined presentation monolith' },
      ],
      materials: [
        { label: 'Base Metal', value: 'Solid 925 Sterling Silver' },
        { label: 'Finish', value: 'Liquid Rhodium immersion with anti-tarnish barrier' },
        { label: 'Safety', value: '100% Hypoallergenic, nickel-free' },
      ],
      dimensions: [
        { label: 'Pendant Diameter', value: '22.0 mm' },
        { label: 'Pendant Thickness', value: '3.4 mm' },
        { label: 'Chain Gauge', value: '2.8 mm width' },
        { label: 'Total Weight', value: '16.8 grams (with 20" chain)' },
      ],
      shipping: [
        { label: 'Delivery', value: 'Complimentary insured express delivery with tracking' },
        { label: 'Dispatch', value: 'Same-day dispatch for orders placed before 2 PM' },
      ],
      returns: [
        { label: 'Return Window', value: '30-day white-glove return policy' },
      ],
      care: [
        { label: 'Storage', value: 'Store flat in the provided velvet tray' },
      ],
    },
    reviews: [
      {
        id: 1,
        name: 'Elena S.',
        location: 'Berlin, DE',
        date: 'August 12, 2026',
        rating: 5,
        size: '20"',
        color: 'Chrome',
        verified: true,
        title: 'Unmatched presence and weight',
        comment: 'The medallion has genuine heft and rests perfectly against the chest. The diamond-cut curb chain sparkles intensely under natural daylight.',
      },
      {
        id: 2,
        name: 'Tara S.',
        location: 'Mumbai, IN',
        date: 'July 19, 2026',
        rating: 5,
        size: '22"',
        color: 'Silver',
        verified: true,
        title: 'Luxury packaging and flawless finish',
        comment: 'Came in a heavy matte black velvet box with microfibre cloth. Worth significantly more than its price.',
      },
    ],
    relatedSlugs: ['lunar-silver-ring', 'stellar-chain', 'orbit-bracelet', 'cosmic-signature-pendant'],
  },

  // 4. ORBIT BRACELET
  {
    id: 'orbit-bracelet',
    slug: 'orbit-bracelet',
    name: 'Orbit Bracelet',
    category: 'Kinetic Cuff Collection',
    collection: 'Nova Series',
    type: 'Bracelets',
    price: 999,
    rating: 4.9,
    reviewCount: 18,
    availability: 'In Stock',
    tag: 'Atelier Favorite',
    shortDescription: 'Engineered solid silver cuff with curved elliptical geometry and internal spring memory for effortless contouring.',
    story: 'Forged from tempered solid 925 sterling silver, the Orbit Bracelet wraps the wrist in fluid planetary geometry. Engineered with calibrated tensile elasticity, it flexes open smoothly and snaps gently into place without hinges or clasps.',
    colors: COLOR_VARIANTS,
    sizes: ['6.5"', '7.0"', '7.5"', '8.0"'],
    sizeType: 'Wrist Size',
    gallery: [
      { id: 1, src: novaImg, alt: 'Orbit Bracelet - Studio View', label: 'Elliptical Form' },
      { id: 2, src: macroRingImg, alt: 'Orbit Bracelet - Beveled Edge Detail', label: 'Macro Finish' },
      { id: 3, src: onModelRingImg, alt: 'Orbit Bracelet - Worn on Wrist', label: 'On-Model' },
      { id: 4, src: angleRingImg, alt: 'Orbit Bracelet - Architectural Profile', label: 'Architecture' },
      { id: 5, src: packagingRingImg, alt: 'Orbit Bracelet - Presentation Box', label: 'Packaging' },
    ],
    accordions: {
      details: [
        { label: 'Design', value: 'Continuous elliptical cuff with rounded terminals' },
        { label: 'Flexibility', value: 'Calibrated memory silver for seamless wear' },
        { label: 'Hallmark', value: 'Laser-etched S925 on inner terminal' },
      ],
      materials: [
        { label: 'Metal', value: 'Solid 925 Sterling Silver • Liquid Rhodium finish' },
      ],
      dimensions: [
        { label: 'Cuff Width', value: '6.5 mm' },
        { label: 'Thickness', value: '3.0 mm contoured profile' },
        { label: 'Weight', value: '22.4 grams' },
      ],
      shipping: [
        { label: 'Shipping', value: 'Insured air delivery in 2-4 business days' },
      ],
      returns: [
        { label: 'Guarantee', value: '30-day complimentary size exchange' },
      ],
      care: [
        { label: 'Maintenance', value: 'Buff with microfibre cloth after wear' },
      ],
    },
    reviews: [
      {
        id: 1,
        name: 'Camille L.',
        location: 'Geneva, CH',
        date: 'August 04, 2026',
        rating: 5,
        size: '7.0"',
        color: 'Chrome',
        verified: true,
        title: 'Pure minimalism on the wrist',
        comment: 'No awkward clasps. Just slips over the side of the wrist and holds firmly. Substantial solid silver weight.',
      },
    ],
    relatedSlugs: ['lunar-silver-ring', 'stellar-chain', 'nova-eclipse-ring', 'nebula-band'],
  },

  // 5. STELLAR CHAIN
  {
    id: 'stellar-chain',
    slug: 'stellar-chain',
    name: 'Stellar Chain',
    category: 'Heavy Chain Collection',
    collection: 'Lunar Series',
    type: 'Necklaces',
    price: 1499,
    rating: 5.0,
    reviewCount: 38,
    availability: 'In Stock',
    tag: 'Statement Piece',
    shortDescription: 'Heavy-gauge curb links with diamond-beveled facets that reflect ambient light in high-contrast razor reflections.',
    story: 'Engineered for commanding weight and architectural line, the Stellar Chain redefines the luxury Cuban curb link. Each individual solid silver link is faceted by hand on four chamfered axes and liquid-rhodium dipped for maximum luminescence.',
    colors: COLOR_VARIANTS,
    sizes: ['18"', '20"', '22"', '24"'],
    sizeType: 'Chain Length',
    gallery: [
      { id: 1, src: heroEditorial, alt: 'Stellar Chain - Studio Editorial', label: 'Curb Architecture' },
      { id: 2, src: macroRingImg, alt: 'Stellar Chain - Faceted Link Macro', label: 'Link Chamfers' },
      { id: 3, src: eclipseImg, alt: 'Stellar Chain - Model Collarbone View', label: 'On-Model' },
      { id: 4, src: angleRingImg, alt: 'Stellar Chain - Clasp Lock Perspective', label: 'Box Clasp' },
      { id: 5, src: packagingRingImg, alt: 'Stellar Chain - Monolith Packaging', label: 'Packaging' },
    ],
    accordions: {
      details: [
        { label: 'Link Type', value: '4-sided diamond-cut curb link' },
        { label: 'Lock', value: 'Double-safety hidden box clasp with Cosmic star engraving' },
      ],
      materials: [
        { label: 'Metal', value: 'Solid 925 Sterling Silver (38+ grams)' },
        { label: 'Finish', value: '0.08 micron mirror liquid rhodium' },
      ],
      dimensions: [
        { label: 'Link Width', value: '6.0 mm' },
        { label: 'Link Thickness', value: '2.8 mm' },
        { label: 'Weight', value: '38.5 grams (at 20 inches)' },
      ],
      shipping: [
        { label: 'Express Shipping', value: 'Complimentary insured shipping nationwide' },
      ],
      returns: [
        { label: 'Return Window', value: '30 days unconditional return policy' },
      ],
      care: [
        { label: 'Care', value: 'Store flat in presentation tray' },
      ],
    },
    reviews: [
      {
        id: 1,
        name: 'Kabir T.',
        location: 'Delhi, IN',
        date: 'August 14, 2026',
        rating: 5,
        size: '20"',
        color: 'Chrome',
        verified: true,
        title: 'Incredible heft and razor facets',
        comment: 'Weighs nearly 40 grams in solid silver. The diamond bevels catch every ray of ambient light. Clasp feels like bank vault security.',
      },
    ],
    relatedSlugs: ['lunar-silver-ring', 'orbit-bracelet', 'celestial-pendant', 'solar-crest-ring'],
  },

  // 6. NEBULA BAND
  {
    id: 'nebula-band',
    slug: 'nebula-band',
    name: 'Nebula Band',
    category: 'Minimalist Ring Collection',
    collection: 'Lunar Series',
    type: 'Rings',
    price: 699,
    rating: 4.7,
    reviewCount: 22,
    availability: 'In Stock',
    tag: 'Stackable',
    shortDescription: 'Continuous band sculpted with tactile micro-fluting. Engineered to stack seamlessly or stand alone with understated grace.',
    story: 'Sculpted with continuous vertical micro-fluting that disperses light in soft gradients, the Nebula Band channels the tactile topography of planetary rings. Designed as a stackable companion to the Lunar Silver Ring or a standalone minimalist statement.',
    colors: COLOR_VARIANTS,
    sizes: ['6', '7', '8', '9', '10'],
    sizeType: 'Size (US)',
    gallery: [
      { id: 1, src: lunarImg, alt: 'Nebula Band - Studio Front View', label: 'Fluted Perimeter' },
      { id: 2, src: macroRingImg, alt: 'Nebula Band - Fluted Macro', label: 'Macro Texture' },
      { id: 3, src: onModelRingImg, alt: 'Nebula Band - Worn on Hand', label: 'Editorial' },
      { id: 4, src: angleRingImg, alt: 'Nebula Band - Angle Geometry', label: 'Profile' },
      { id: 5, src: packagingRingImg, alt: 'Nebula Band - Velvet Case', label: 'Packaging' },
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
        name: 'Pooja K.',
        location: 'Bengaluru, IN',
        date: 'July 15, 2026',
        rating: 5,
        size: '7',
        color: 'Chrome',
        verified: true,
        title: 'Minimalist perfection for stacking',
        comment: 'Stacks right alongside my Lunar Silver Ring with zero gap. The fluting feels tactile and therapeutic.',
      },
    ],
    relatedSlugs: ['lunar-silver-ring', 'solar-crest-ring', 'nova-eclipse-ring', 'orbit-bracelet'],
  },

  // 7. SOLAR CREST RING
  {
    id: 'solar-crest-ring',
    slug: 'solar-crest-ring',
    name: 'Solar Crest Ring',
    category: 'Signet Ring Collection',
    collection: 'Nova Series',
    type: 'Rings',
    price: 899,
    rating: 4.9,
    reviewCount: 27,
    availability: 'In Stock',
    tag: 'Bold Signet',
    shortDescription: 'Modern signet ring with a flat mirror-polished crest and faceted geometric shoulders in solid 925 silver.',
    story: 'Reinterpreting the classic signet ring through futuristic brutalism. The Solar Crest Ring features an unadorned planar mirror plateau flanked by razor-cut geometric shoulders that taper into a sculpted comfort-fit shank.',
    colors: COLOR_VARIANTS,
    sizes: ['6', '7', '8', '9', '10'],
    sizeType: 'Size (US)',
    gallery: [
      { id: 1, src: angleRingImg, alt: 'Solar Crest Ring - Planar Plateau', label: 'Mirror Crest' },
      { id: 2, src: macroRingImg, alt: 'Solar Crest Ring - Faceted Shoulders', label: 'Macro Shoulder' },
      { id: 3, src: heroRingImg, alt: 'Solar Crest Ring - Studio View', label: 'Studio View' },
      { id: 4, src: onModelRingImg, alt: 'Solar Crest Ring - Index Finger Styling', label: 'On-Model' },
      { id: 5, src: packagingRingImg, alt: 'Solar Crest Ring - Velvet Monolith', label: 'Packaging' },
    ],
    accordions: {
      details: [
        { label: 'Style', value: 'Futuristic architectural signet ring' },
        { label: 'Plateau', value: '14.0 mm x 11.0 mm mirror planar surface' },
        { label: 'Shank', value: 'Curved comfort-fit ergonomic profile' },
      ],
      materials: [
        { label: 'Metal', value: 'Solid 925 Sterling Silver • High-sheen Rhodium' },
      ],
      dimensions: [
        { label: 'Top Width', value: '14.0 mm' },
        { label: 'Base Width', value: '5.2 mm' },
        { label: 'Weight', value: '11.8 grams' },
      ],
      shipping: [
        { label: 'Dispatch', value: 'Same-day insured shipping' },
      ],
      returns: [
        { label: 'Guarantee', value: '30-day exchange for alternative sizes' },
      ],
      care: [
        { label: 'Care', value: 'Buff crest with polishing cloth' },
      ],
    },
    reviews: [
      {
        id: 1,
        name: 'Alexander V.',
        location: 'London, UK',
        date: 'August 01, 2026',
        rating: 5,
        size: '10',
        color: 'Chrome',
        verified: true,
        title: 'Modern brutalist masterpiece',
        comment: 'Worn on the pinky or index finger, it commands attention. The flat mirror crest reflects sunlight like a signal mirror.',
      },
    ],
    relatedSlugs: ['lunar-silver-ring', 'nebula-band', 'stellar-chain', 'cosmic-signature-pendant'],
  },

  // 8. COSMIC SIGNATURE PENDANT
  {
    id: 'cosmic-signature-pendant',
    slug: 'cosmic-signature-pendant',
    name: 'Cosmic Signature Pendant',
    category: 'Haute Joaillerie Collection',
    collection: 'Eclipse Series',
    type: 'Necklaces',
    price: 1599,
    rating: 5.0,
    reviewCount: 34,
    availability: 'In Stock',
    tag: 'Haute Joaillerie',
    shortDescription: 'The flagship emblem of the Maison. An articulated four-point celestial star suspended within a mirror-polished orbital ring.',
    story: 'The defining insignia of Cosmic Haute Joaillerie. Handcrafted from 925 sterling silver with a suspended four-point celestial star that rotates micro-kinetically within an outer rhodium orbit, strung on a heavy Venetian box chain.',
    colors: COLOR_VARIANTS,
    sizes: ['18"', '20"', '22"', '24"'],
    sizeType: 'Chain Length',
    gallery: [
      { id: 1, src: eclipseImg, alt: 'Cosmic Signature Pendant - Studio Front', label: 'The Insignia' },
      { id: 2, src: macroRingImg, alt: 'Cosmic Signature Pendant - Kinetic Star Macro', label: 'Kinetic Star' },
      { id: 3, src: heroEditorial, alt: 'Cosmic Signature Pendant - Editorial Profile', label: 'On-Model' },
      { id: 4, src: angleRingImg, alt: 'Cosmic Signature Pendant - Venetian Chain Clasp', label: 'Box Chain' },
      { id: 5, src: packagingRingImg, alt: 'Cosmic Signature Pendant - Monolith Box', label: 'Packaging' },
    ],
    accordions: {
      details: [
        { label: 'Pendant Form', value: 'Kinetic four-point star in orbital ring' },
        { label: 'Chain Type', value: 'Heavy Venetian Box Chain (2.6 mm gauge)' },
        { label: 'Clasp', value: 'Signature cylindrical twist lock' },
      ],
      materials: [
        { label: 'Metal', value: 'Solid 925 Sterling Silver' },
        { label: 'Plating', value: 'Liquid Rhodium with diamond-dust polish' },
      ],
      dimensions: [
        { label: 'Pendant Diameter', value: '25.0 mm' },
        { label: 'Pendant Depth', value: '4.2 mm' },
        { label: 'Total Weight', value: '19.5 grams (with 20" chain)' },
      ],
      shipping: [
        { label: 'Shipping', value: 'Complimentary insured courier with tracking' },
      ],
      returns: [
        { label: 'Policy', value: '30-day white glove return guarantee' },
      ],
      care: [
        { label: 'Care', value: 'Store flat in presentation tray' },
      ],
    },
    reviews: [
      {
        id: 1,
        name: 'Julian B.',
        location: 'New York, USA',
        date: 'August 28, 2026',
        rating: 5,
        size: '20"',
        color: 'Chrome',
        verified: true,
        title: 'The ultimate luxury signature piece',
        comment: 'The kinetic star has subtle movement when walking. The Venetian box chain has substantial weight and never kinks. Worth every rupee.',
      },
    ],
    relatedSlugs: ['celestial-pendant', 'lunar-silver-ring', 'stellar-chain', 'solar-crest-ring'],
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
