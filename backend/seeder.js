const mongoose = require('mongoose');
const Product = require('./Models/Product');
const User = require('./Models/User');
require('dotenv').config();

const connectDB = require('./config/db');

const sampleProducts = [
  {
    name: 'Lavender Dream',
    description: 'A soothing blend of lavender and vanilla that promotes relaxation and peaceful sleep.',
    price: 450,
    category: 'perfumes',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
    stock: 15
  },
  {
    name: 'Ocean Breeze',
    description: 'Fresh aquatic notes with hints of citrus and sea salt for a refreshing experience.',
    price: 320,
    category: 'perfumes',
    image: 'https://images.unsplash.com/photo-1592945403244-b3faa74b2cba?w=400',
    stock: 8
  },
  {
    name: 'Vanilla Comfort',
    description: 'Warm and cozy vanilla scent perfect for creating a welcoming atmosphere.',
    price: 280,
    category: 'candles',
    image: 'https://images.unsplash.com/photo-1603006905005-a36949a6a887?w=400',
    stock: 22
  },
  {
    name: 'Rose Garden',
    description: 'Elegant rose fragrance that brings the beauty of a blooming garden indoors.',
    price: 550,
    category: 'perfumes',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    stock: 5
  },
  {
    name: 'Sandalwood Serenity',
    description: 'Deep, woody sandalwood scent that promotes focus and inner peace.',
    price: 380,
    category: 'diffusers',
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400',
    stock: 12
  },
  {
    name: 'Citrus Fresh',
    description: 'Energizing blend of lemon, lime, and orange for a revitalizing experience.',
    price: 250,
    category: 'soaps',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
    stock: 18
  },
  {
    name: 'Mint & Eucalyptus',
    description: 'Cooling mint and eucalyptus blend that clears the mind and refreshes the senses.',
    price: 420,
    category: 'diffusers',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    stock: 10
  },
  {
    name: 'Coconut Paradise',
    description: 'Tropical coconut scent that transports you to a beach paradise.',
    price: 350,
    category: 'candles',
    image: 'https://images.unsplash.com/photo-1603006905005-a36949a6a887?w=400',
    stock: 14
  }
];

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@kscents.com',
    password: 'admin123',
    isAdmin: true
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    isAdmin: false
  }
];

const importData = async () => {
  try {
    await connectDB();

    // Wait a bit for connection to stabilize
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Clear existing data
    await Product.deleteMany();
    await User.deleteMany();

    // Import products
    await Product.insertMany(sampleProducts);
    console.log('Products imported successfully');

    // Import users
    await User.insertMany(sampleUsers);
    console.log('Users imported successfully');

    console.log('Data import completed!');

    // Close connection properly
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    await mongoose.connection.close();
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    // Wait a bit for connection to stabilize
    await new Promise(resolve => setTimeout(resolve, 1000));

    await Product.deleteMany();
    await User.deleteMany();

    console.log('Data destroyed successfully');

    // Close connection properly
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    await mongoose.connection.close();
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
