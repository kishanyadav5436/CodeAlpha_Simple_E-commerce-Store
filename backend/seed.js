const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const products = [
    { name: "Wireless Noise-Cancelling Headphones", price: 249.99, category: "electronics", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop", description: "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and studio-quality sound.", rating: 4.8, reviews: 1247, stock: 45 },
    { name: "Minimalist Leather Watch", price: 179.99, category: "accessories", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop", description: "Elegant timepiece with genuine leather strap, sapphire crystal glass, and Swiss quartz movement.", rating: 4.6, reviews: 892, stock: 30 },
    { name: "Smart Fitness Tracker", price: 129.99, category: "electronics", image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=400&fit=crop", description: "Advanced health monitoring with heart rate, SpO2, sleep tracking, and 7-day battery life.", rating: 4.5, reviews: 2103, stock: 60 },
    { name: "Premium Sunglasses", price: 159.99, category: "accessories", image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop", description: "Polarized UV400 lenses with lightweight titanium frame. Includes premium carrying case.", rating: 4.7, reviews: 634, stock: 40 },
    { name: "Portable Bluetooth Speaker", price: 89.99, category: "electronics", image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop", description: "Waterproof speaker with 360° sound, deep bass, and 12 hours of playtime.", rating: 4.4, reviews: 1876, stock: 55 },
    { name: "Canvas Backpack", price: 69.99, category: "accessories", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop", description: "Durable waxed canvas with padded laptop compartment and anti-theft pocket.", rating: 4.3, reviews: 445, stock: 35 },
    { name: "Mechanical Keyboard", price: 139.99, category: "electronics", image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&h=400&fit=crop", description: "Hot-swappable switches, per-key RGB lighting, and PBT keycaps for the ultimate typing experience.", rating: 4.9, reviews: 3201, stock: 25 },
    { name: "Running Shoes", price: 119.99, category: "apparel", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop", description: "Lightweight, breathable mesh upper with responsive cushioning for all-day comfort.", rating: 4.6, reviews: 1590, stock: 50 },
    { name: "Wireless Earbuds", price: 79.99, category: "electronics", image: "https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=400&h=400&fit=crop", description: "True wireless with ANC, transparency mode, and 24-hour total battery with charging case.", rating: 4.5, reviews: 2780, stock: 70 },
    { name: "Ceramic Coffee Mug Set", price: 34.99, category: "home", image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop", description: "Set of 4 handcrafted ceramic mugs with matte finish. Microwave and dishwasher safe.", rating: 4.2, reviews: 312, stock: 80 },
    { name: "Desk Lamp with Wireless Charger", price: 59.99, category: "home", image: "https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=400&h=400&fit=crop", description: "LED desk lamp with adjustable color temperature and built-in Qi wireless charging pad.", rating: 4.4, reviews: 567, stock: 40 },
    { name: "Vintage Denim Jacket", price: 89.99, category: "apparel", image: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&h=400&fit=crop", description: "Classic wash denim with distressed details. Relaxed fit with button closure.", rating: 4.3, reviews: 421, stock: 30 }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');

        await Product.deleteMany({});
        console.log('Cleared existing products.');

        await Product.insertMany(products);
        console.log(`Seeded ${products.length} products.`);

        process.exit(0);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedDB();
