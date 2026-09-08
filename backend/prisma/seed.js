import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const PRODUCTS = [
  {
    slug: 'lunar-silver-ring',
    name: 'Lunar Silver Ring',
    category: 'Sculptural Ring Collection',
    price: 799,
    description: 'Cast in solid 925 sterling silver with a sculpted celestial bevel. Individually hand-finished in our Milanese atelier.',
    images: [
      { src: '/assets/lunar_ring_hero.jpg', alt: 'Lunar Silver Ring - Hero Studio Silhouette', label: 'The Form' },
      { src: '/assets/lunar_ring_macro.jpg', alt: 'Lunar Silver Ring - Celestial Bevel & S925 Hallmark', label: 'Macro Bevel' },
      { src: '/assets/lunar_ring_onmodel.jpg', alt: 'Lunar Silver Ring - On Model Editorial Styling', label: 'Silhouette' },
      { src: '/assets/lunar_ring_angle.jpg', alt: 'Lunar Silver Ring - Architectural 45-Degree View', label: 'Architecture' },
      { src: '/assets/lunar_ring_packaging.jpg', alt: 'Lunar Silver Ring - Velvet Monolith Box', label: 'The Monolith' },
    ],
  },
  {
    slug: 'nova-eclipse-ring',
    name: 'Nova Eclipse Ring',
    category: 'Architectural Ring Collection',
    price: 849,
    description: 'Dual concentric orbits sculpted in solid sterling silver. Features liquid rhodium mirror plating with recessed satin grooves.',
    images: [
      { src: '/assets/lunar_ring_angle.jpg', alt: 'Nova Eclipse Ring - Architectural Perspective', label: 'Concentric Arcs' },
      { src: '/assets/lunar_ring_macro.jpg', alt: 'Nova Eclipse Ring - Micro-Groove Chamfer', label: 'Macro Detail' },
      { src: '/assets/lunar_ring_hero.jpg', alt: 'Nova Eclipse Ring - Studio Silhouette', label: 'Studio Profile' },
      { src: '/assets/lunar_ring_onmodel.jpg', alt: 'Nova Eclipse Ring - Hand Editorial View', label: 'On-Model' },
      { src: '/assets/lunar_ring_packaging.jpg', alt: 'Nova Eclipse Ring - Velvet Monolith', label: 'Presentation' },
    ],
  },
  {
    slug: 'celestial-pendant',
    name: 'Celestial Pendant',
    category: 'Iconic Necklace Collection',
    price: 1299,
    description: 'Sculpted celestial medallion cast in solid 925 silver with liquid rhodium mirror finish on an Italian diamond-cut curb chain.',
    images: [
      { src: '/assets/eclipse_collection.jpg', alt: 'Celestial Pendant - Studio Front', label: 'The Medallion' },
      { src: '/assets/lunar_ring_macro.jpg', alt: 'Celestial Pendant - Macro Chamfer', label: 'Macro Bevel' },
      { src: '/assets/hero_editorial.jpg', alt: 'Celestial Pendant - Editorial Styling', label: 'On-Model' },
      { src: '/assets/lunar_ring_angle.jpg', alt: 'Celestial Pendant - Clasp Detail', label: 'Curb Geometry' },
      { src: '/assets/lunar_ring_packaging.jpg', alt: 'Celestial Pendant - Presentation Case', label: 'Packaging' },
    ],
  },
  {
    slug: 'orbit-bracelet',
    name: 'Orbit Bracelet',
    category: 'Kinetic Cuff Collection',
    price: 999,
    description: 'Engineered solid silver cuff with curved elliptical geometry and internal spring memory for effortless contouring.',
    images: [
      { src: '/assets/nova_collection.jpg', alt: 'Orbit Bracelet - Studio View', label: 'Elliptical Form' },
      { src: '/assets/lunar_ring_macro.jpg', alt: 'Orbit Bracelet - Beveled Edge Detail', label: 'Macro Finish' },
      { src: '/assets/lunar_ring_onmodel.jpg', alt: 'Orbit Bracelet - Worn on Wrist', label: 'On-Model' },
      { src: '/assets/lunar_ring_angle.jpg', alt: 'Orbit Bracelet - Architectural Profile', label: 'Architecture' },
      { src: '/assets/lunar_ring_packaging.jpg', alt: 'Orbit Bracelet - Presentation Box', label: 'Packaging' },
    ],
  },
  {
    slug: 'stellar-chain',
    name: 'Stellar Chain',
    category: 'Heavy Chain Collection',
    price: 1499,
    description: 'Heavy-gauge curb links with diamond-beveled facets that reflect ambient light in high-contrast razor reflections.',
    images: [
      { src: '/assets/hero_editorial.jpg', alt: 'Stellar Chain - Studio Editorial', label: 'Curb Architecture' },
      { src: '/assets/lunar_ring_macro.jpg', alt: 'Stellar Chain - Faceted Link Macro', label: 'Link Chamfers' },
      { src: '/assets/eclipse_collection.jpg', alt: 'Stellar Chain - Model Collarbone View', label: 'On-Model' },
      { src: '/assets/lunar_ring_angle.jpg', alt: 'Stellar Chain - Clasp Lock Perspective', label: 'Box Clasp' },
      { src: '/assets/lunar_ring_packaging.jpg', alt: 'Stellar Chain - Monolith Packaging', label: 'Packaging' },
    ],
  },
  {
    slug: 'nebula-band',
    name: 'Nebula Band',
    category: 'Minimalist Ring Collection',
    price: 699,
    description: 'Continuous band sculpted with tactile micro-fluting. Engineered to stack seamlessly or stand alone with understated grace.',
    images: [
      { src: '/assets/lunar_collection.jpg', alt: 'Nebula Band - Studio Front View', label: 'Fluted Perimeter' },
      { src: '/assets/lunar_ring_macro.jpg', alt: 'Nebula Band - Fluted Macro', label: 'Macro Texture' },
      { src: '/assets/lunar_ring_onmodel.jpg', alt: 'Nebula Band - Worn on Hand', label: 'Editorial' },
      { src: '/assets/lunar_ring_angle.jpg', alt: 'Nebula Band - Angle Geometry', label: 'Profile' },
      { src: '/assets/lunar_ring_packaging.jpg', alt: 'Nebula Band - Velvet Case', label: 'Packaging' },
    ],
  },
  {
    slug: 'solar-crest-ring',
    name: 'Solar Crest Ring',
    category: 'Signet Ring Collection',
    price: 899,
    description: 'Modern signet ring with a flat mirror-polished crest and faceted geometric shoulders in solid 925 silver.',
    images: [
      { src: '/assets/lunar_ring_angle.jpg', alt: 'Solar Crest Ring - Planar Plateau', label: 'Mirror Crest' },
      { src: '/assets/lunar_ring_macro.jpg', alt: 'Solar Crest Ring - Faceted Shoulders', label: 'Macro Shoulder' },
      { src: '/assets/lunar_ring_hero.jpg', alt: 'Solar Crest Ring - Studio View', label: 'Studio View' },
      { src: '/assets/lunar_ring_onmodel.jpg', alt: 'Solar Crest Ring - Index Finger Styling', label: 'On-Model' },
      { src: '/assets/lunar_ring_packaging.jpg', alt: 'Solar Crest Ring - Velvet Monolith', label: 'Packaging' },
    ],
  },
  {
    slug: 'cosmic-signature-pendant',
    name: 'Cosmic Signature Pendant',
    category: 'Haute Joaillerie Collection',
    price: 1599,
    description: 'The flagship emblem of the Maison. An articulated four-point celestial star suspended within a mirror-polished orbital ring.',
    images: [
      { src: '/assets/eclipse_collection.jpg', alt: 'Cosmic Signature Pendant - Studio Front', label: 'The Insignia' },
      { src: '/assets/lunar_ring_macro.jpg', alt: 'Cosmic Signature Pendant - Kinetic Star Macro', label: 'Kinetic Star' },
      { src: '/assets/hero_editorial.jpg', alt: 'Cosmic Signature Pendant - Editorial Profile', label: 'On-Model' },
      { src: '/assets/lunar_ring_angle.jpg', alt: 'Cosmic Signature Pendant - Venetian Chain Clasp', label: 'Box Chain' },
      { src: '/assets/lunar_ring_packaging.jpg', alt: 'Cosmic Signature Pendant - Monolith Box', label: 'Packaging' },
    ],
  },
];

async function main() {
  console.log('🚀 Seeding Cosmic Product Database...');

  for (const product of PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        name: product.name,
        category: product.category,
        price: product.price,
        description: product.description,
        images: product.images,
      },
      create: {
        slug: product.slug,
        name: product.name,
        category: product.category,
        price: product.price,
        description: product.description,
        images: product.images,
        stock: 100,
      },
    });
    console.log(`✅ Seeded: ${product.name}`);
  }

  console.log('✨ Database successfully populated.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
