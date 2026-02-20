const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');

const connectDB = require('./config/db');

const sampleProducts = [
  {
    name: 'Lavender Dream',
    description: 'A sophisticated blend that captures the essence of French lavender fields at twilight. This luxurious fragrance combines the calming properties of pure lavender with warm vanilla undertones, creating a perfect balance for relaxation and peaceful moments.',
    shortDescription: 'Calming lavender and vanilla blend for relaxation',
    price: 450,
    discount_percentage: 10,
    category: 'perfumes',
    subCategory: 'eau-de-parfum',
    brand: 'K-Scents',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
        alt: 'Lavender Dream perfume bottle',
        isPrimary: true
      }
    ],
    stock: 15,
    lowStockThreshold: 5,
    size: {
      volume: 50,
      weight: 200,
      dimensions: { length: 12, width: 4, height: 15 }
    },
    fragrance_notes: {
      top: ['French Lavender', 'Bergamot', 'Lemon'],
      middle: ['Vanilla', 'Jasmine', 'Rose'],
      base: ['Sandalwood', 'Musk', 'Amber']
    },
    intensity: 'moderate',
    longevity: '6-8 hours',
    sillage: 'moderate',
    season: ['spring', 'summer'],
    occasion: ['casual', 'evening'],
    gender: 'unisex',
    ingredients: ['Ethanol', 'Fragrance', 'Water', 'Lavender Oil', 'Vanilla Extract'],
    isFeatured: true,
    isNewArrival: true,
    tags: ['relaxing', 'floral', 'evening', 'luxury']
  },
  {
    name: 'Ocean Breeze',
    description: 'Dive into the refreshing embrace of coastal waters with this invigorating aquatic fragrance. Fresh marine notes blend seamlessly with zesty citrus and mineral sea salt, evoking memories of pristine beaches and ocean adventures.',
    shortDescription: 'Fresh aquatic scent with citrus and sea salt',
    price: 380,
    category: 'perfumes',
    subCategory: 'eau-de-toilette',
    brand: 'K-Scents',
    image: 'https://images.unsplash.com/photo-1592945403244-b3faa74b2cba?w=400',
    stock: 22,
    size: {
      volume: 75,
      weight: 250
    },
    fragrance_notes: {
      top: ['Sea Salt', 'Lemon', 'Lime', 'Marine Notes'],
      middle: ['Eucalyptus', 'Mint', 'Water Lily'],
      base: ['Driftwood', 'Ambergris', 'White Musk']
    },
    intensity: 'light',
    longevity: '4-6 hours',
    sillage: 'moderate',
    season: ['spring', 'summer'],
    occasion: ['casual', 'office'],
    gender: 'unisex',
    isBestSeller: true,
    tags: ['fresh', 'aquatic', 'citrus', 'energizing']
  },
  {
    name: 'Vanilla Comfort Candle',
    description: 'Transform your space into a warm sanctuary with this premium vanilla-scented candle. Hand-poured with natural soy wax and infused with Madagascar vanilla, it creates an inviting atmosphere perfect for cozy evenings and intimate gatherings.',
    shortDescription: 'Premium soy candle with Madagascar vanilla',
    price: 280,
    category: 'candles',
    subCategory: 'scented-candles',
    brand: 'K-Scents',
    image: 'https://images.unsplash.com/photo-1603006905005-a36949a6a887?w=400',
    stock: 30,
    size: {
      weight: 300,
      dimensions: { length: 10, width: 10, height: 12 }
    },
    burnTime: 45,
    ingredients: ['Soy Wax', 'Madagascar Vanilla', 'Cotton Wick', 'Essential Oils'],
    careInstructions: 'Trim wick to 1/4 inch before each use. Burn for no more than 4 hours at a time.',
    season: ['autumn', 'winter'],
    occasion: ['casual', 'evening'],
    isFeatured: true,
    tags: ['cozy', 'warm', 'vanilla', 'home']
  },
  {
    name: 'Rose Garden',
    description: 'Experience the timeless elegance of a blooming rose garden with this exquisite floral fragrance. Crafted with Bulgarian rose petals and complemented by green stems and morning dew, it embodies romantic sophistication.',
    shortDescription: 'Elegant Bulgarian rose with green accents',
    price: 550,
    discount_percentage: 15,
    category: 'perfumes',
    subCategory: 'eau-de-parfum',
    brand: 'K-Scents',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    stock: 8,
    lowStockThreshold: 3,
    size: {
      volume: 50,
      weight: 180
    },
    fragrance_notes: {
      top: ['Bulgarian Rose', 'Pink Pepper', 'Green Leaves'],
      middle: ['Damask Rose', 'Peony', 'Lily of the Valley'],
      base: ['White Musk', 'Cedar', 'Soft Woods']
    },
    intensity: 'strong',
    longevity: '8+ hours',
    sillage: 'strong',
    season: ['spring', 'summer'],
    occasion: ['special', 'date-night', 'evening'],
    gender: 'women',
    isOnSale: true,
    isFeatured: true,
    tags: ['floral', 'romantic', 'elegant', 'luxury']
  },
  {
    name: 'Sandalwood Serenity Diffuser',
    description: 'Create a meditative atmosphere with this elegant reed diffuser featuring pure Australian sandalwood. The warm, woody aroma promotes focus and inner peace, making it perfect for study areas, yoga spaces, or meditation rooms.',
    shortDescription: 'Australian sandalwood reed diffuser for meditation',
    price: 320,
    category: 'diffusers',
    subCategory: 'reed-diffusers',
    brand: 'K-Scents',
    image: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400',
    stock: 18,
    size: {
      volume: 100,
      weight: 350
    },
    fragrance_notes: {
      top: ['Australian Sandalwood'],
      middle: ['Cedar', 'Patchouli'],
      base: ['Vanilla', 'Amber', 'Musk']
    },
    intensity: 'moderate',
    season: ['autumn', 'winter'],
    occasion: ['casual', 'office'],
    gender: 'unisex',
    careInstructions: 'Flip reeds weekly for optimal fragrance throw. Lasts 2-3 months.',
    tags: ['woody', 'meditative', 'calming', 'natural']
  },
  {
    name: 'Citrus Fresh Body Soap',
    description: 'Energize your daily routine with this invigorating citrus soap blend. Enriched with natural citrus oils and moisturizing ingredients, it cleanses gently while leaving your skin feeling refreshed and beautifully scented.',
    shortDescription: 'Energizing citrus soap with natural oils',
    price: 180,
    category: 'soaps',
    subCategory: 'bath-soap',
    brand: 'K-Scents',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
    stock: 45,
    size: {
      weight: 120
    },
    fragrance_notes: {
      top: ['Lemon', 'Lime', 'Orange', 'Grapefruit'],
      middle: ['Mint', 'Green Tea'],
      base: ['White Tea', 'Light Musk']
    },
    intensity: 'light',
    season: ['spring', 'summer'],
    occasion: ['casual'],
    gender: 'unisex',
    ingredients: ['Glycerin', 'Coconut Oil', 'Citrus Essential Oils', 'Shea Butter'],
    careInstructions: 'Keep dry between uses. Store in cool, dry place.',
    isBestSeller: true,
    tags: ['fresh', 'citrus', 'energizing', 'natural']
  },
  {
    name: 'Mint & Eucalyptus Diffuser',
    description: 'Clear your mind and refresh your senses with this cooling aromatherapy blend. The perfect combination of peppermint and eucalyptus creates an spa-like environment that promotes mental clarity and respiratory wellness.',
    shortDescription: 'Cooling mint and eucalyptus aromatherapy blend',
    price: 340,
    category: 'diffusers',
    subCategory: 'electric-diffusers',
    brand: 'K-Scents',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    stock: 12,
    size: {
      volume: 75,
      weight: 180
    },
    fragrance_notes: {
      top: ['Peppermint', 'Eucalyptus', 'Spearmint'],
      middle: ['Tea Tree', 'Rosemary'],
      base: ['Light Woods', 'Clean Musk']
    },
    intensity: 'moderate',
    season: ['spring', 'summer'],
    occasion: ['office', 'casual'],
    gender: 'unisex',
    ingredients: ['Essential Oils', 'Carrier Oil', 'Natural Extracts'],
    tags: ['refreshing', 'spa', 'wellness', 'cooling']
  },
  {
    name: 'Coconut Paradise Candle',
    description: 'Escape to a tropical paradise with this luxurious coconut-scented candle. Made with premium coconut wax and infused with natural coconut essence, it brings the warmth and serenity of island life to your home.',
    shortDescription: 'Tropical coconut candle with premium wax',
    price: 350,
    category: 'candles',
    subCategory: 'scented-candles',
    brand: 'K-Scents',
    image: 'https://images.unsplash.com/photo-1603006905005-a36949a6a887?w=400',
    stock: 25,
    size: {
      weight: 380,
      dimensions: { length: 11, width: 11, height: 13 }
    },
    burnTime: 50,
    fragrance_notes: {
      top: ['Fresh Coconut', 'Lime Zest'],
      middle: ['Coconut Milk', 'Vanilla'],
      base: ['Warm Sand', 'Driftwood']
    },
    intensity: 'moderate',
    season: ['spring', 'summer'],
    occasion: ['casual', 'party'],
    gender: 'unisex',
    ingredients: ['Coconut Wax', 'Natural Coconut Extract', 'Cotton Wick'],
    careInstructions: 'Trim wick before each use. Allow full wax pool to form.',
    isNewArrival: true,
    tags: ['tropical', 'coconut', 'vacation', 'relaxing']
  },
  {
    name: 'Midnight Oud',
    description: 'Indulge in the mysterious allure of this sophisticated oud-based fragrance. Blending rare agarwood with spicy saffron and smoky incense, it creates an intense and captivating scent perfect for special occasions.',
    shortDescription: 'Sophisticated oud with saffron and incense',
    price: 680,
    category: 'perfumes',
    subCategory: 'eau-de-parfum',
    brand: 'K-Scents',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=400',
    stock: 6,
    lowStockThreshold: 2,
    size: {
      volume: 30,
      weight: 150
    },
    fragrance_notes: {
      top: ['Saffron', 'Pink Pepper', 'Cardamom'],
      middle: ['Oud', 'Rose', 'Smoky Incense'],
      base: ['Amber', 'Sandalwood', 'Leather']
    },
    intensity: 'intense',
    longevity: '8+ hours',
    sillage: 'enormous',
    season: ['autumn', 'winter'],
    occasion: ['evening', 'special', 'date-night'],
    gender: 'unisex',
    isFeatured: true,
    tags: ['oud', 'luxury', 'oriental', 'intense']
  },
  {
    name: 'Fresh Linen Gift Set',
    description: 'Experience the crisp, clean comfort of fresh laundry with this delightful gift set. Includes body wash, lotion, and room spray, all featuring the beloved fresh linen scent that evokes clean sheets and sunny days.',
    shortDescription: 'Complete fresh linen gift set with 3 products',
    price: 120,
    category: 'gift-sets',
    brand: 'K-Scents',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400',
    stock: 20,
    fragrance_notes: {
      top: ['Clean Cotton', 'Fresh Air', 'Light Citrus'],
      middle: ['White Flowers', 'Soft Powder'],
      base: ['Clean Musk', 'Soft Woods']
    },
    intensity: 'light',
    season: ['spring', 'summer'],
    occasion: ['casual'],
    gender: 'unisex',
    isBestSeller: true,
    tags: ['clean', 'fresh', 'gift', 'linen']
  }
];

const sampleUsers = [
  {
    name: 'Admin User',
    email: 'admin@kscents.com',
    password: 'admin123',
    isAdmin: true,
    profile: {
      firstName: 'Admin',
      lastName: 'User',
      phoneNumber: '+1234567890',
      bio: 'System Administrator for K-Scents'
    },
    preferences: {
      newsletter: true,
      emailNotifications: true,
      favoriteCategories: ['perfumes', 'candles', 'diffusers'],
      fragrancePreferences: {
        intensity: 'moderate',
        preferredNotes: ['vanilla', 'sandalwood', 'rose'],
        seasons: ['spring', 'autumn'],
        occasions: ['casual', 'evening']
      }
    },
    addresses: [
      {
        type: 'work',
        street: '123 Business Ave',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'United States',
        isDefault: true
      }
    ],
    loyaltyPoints: 5000,
    emailVerified: true,
    accountStatus: 'active'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    isAdmin: false,
    profile: {
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1990-05-15'),
      gender: 'male',
      phoneNumber: '+1987654321',
      bio: 'Fragrance enthusiast and regular customer'
    },
    preferences: {
      newsletter: true,
      smsNotifications: true,
      emailNotifications: true,
      favoriteCategories: ['perfumes', 'soaps'],
      fragrancePreferences: {
        intensity: 'strong',
        preferredNotes: ['oud', 'sandalwood', 'amber'],
        seasons: ['winter', 'autumn'],
        occasions: ['evening', 'special']
      },
      priceRange: {
        min: 100,
        max: 500
      }
    },
    addresses: [
      {
        type: 'home',
        street: '456 Oak Street',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'United States',
        isDefault: true
      },
      {
        type: 'work',
        street: '789 Corporate Blvd',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90211',
        country: 'United States',
        isDefault: false
      }
    ],
    loyaltyPoints: 1250,
    emailVerified: true,
    accountStatus: 'active'
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    password: 'password123',
    isAdmin: false,
    profile: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      dateOfBirth: new Date('1985-08-22'),
      gender: 'female',
      phoneNumber: '+1555666777',
      bio: 'Love trying new fragrances and candles!'
    },
    preferences: {
      newsletter: true,
      emailNotifications: true,
      favoriteCategories: ['candles', 'diffusers', 'gift-sets'],
      fragrancePreferences: {
        intensity: 'light',
        preferredNotes: ['vanilla', 'rose', 'lavender'],
        seasons: ['spring', 'summer'],
        occasions: ['casual', 'date-night']
      },
      priceRange: {
        min: 50,
        max: 300
      }
    },
    addresses: [
      {
        type: 'home',
        street: '321 Pine Road',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'United States',
        isDefault: true
      }
    ],
    loyaltyPoints: 750,
    emailVerified: true,
    accountStatus: 'active'
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
    console.log('✅ Products imported successfully');

    // Import users
    await User.insertMany(sampleUsers);
    console.log('✅ Users imported successfully');

    console.log('🎉 Data import completed successfully!');
    console.log(`📦 Imported ${sampleProducts.length} products`);
    console.log(`👥 Imported ${sampleUsers.length} users`);

    // Close connection properly
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    await mongoose.connection.close();
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();

    // Wait a bit for connection to stabilize
    await new Promise(resolve => setTimeout(resolve, 1000));

    const productCount = await Product.countDocuments();
    const userCount = await User.countDocuments();

    await Product.deleteMany();
    await User.deleteMany();

    console.log('🗑️ Data destroyed successfully');
    console.log(`📦 Deleted ${productCount} products`);
    console.log(`👥 Deleted ${userCount} users`);

    // Close connection properly
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    await mongoose.connection.close();
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
