const fs = require('fs');

// Read the dataset
const rawData = fs.readFileSync('./dataset/datasetfordopetech.json', 'utf8');
const posts = JSON.parse(rawData);

// Function to extract price from caption
function extractPrice(caption) {
  const priceRegex = /(?:Rs\.?|₹|NPR)\s*(\d+(?:,\d+)*(?:\.\d{2})?)/i;
  const match = caption.match(priceRegex);
  return match ? parseFloat(match[1].replace(/,/g, '')) : null;
}

// Function to extract product name from caption
function extractProductName(caption) {
  // Look for common product indicators
  const lines = caption.split('\n');
  for (let line of lines) {
    line = line.trim();
    if (line.includes(':') && !line.includes('http') && !line.includes('@')) {
      const parts = line.split(':');
      if (parts.length >= 2) {
        const productName = parts[1].trim();
        if (productName.length > 3 && productName.length < 100) {
          return productName;
        }
      }
    }
  }
  
  // Fallback: look for brand names
  const brands = ['Razer', 'Logitech', 'SteelSeries', 'Corsair', 'HyperX', 'DopeTech'];
  for (let brand of brands) {
    if (caption.includes(brand)) {
      return `${brand} Product`;
    }
  }
  
  return 'DopeTech Product';
}

// Function to determine category from hashtags
function getCategory(hashtags) {
  if (!hashtags) return 'accessory';
  
  const hashtagString = hashtags.join(' ').toLowerCase();
  
  if (hashtagString.includes('headset') || hashtagString.includes('headphone')) return 'audio';
  if (hashtagString.includes('keyboard')) return 'keyboard';
  if (hashtagString.includes('mouse')) return 'mouse';
  if (hashtagString.includes('speaker')) return 'speaker';
  if (hashtagString.includes('gaming')) return 'gaming';
  
  return 'accessory';
}

// Function to clean description
function cleanDescription(caption) {
  if (!caption) return '';
  
  // Remove hashtags
  let cleaned = caption.replace(/#\w+/g, '').trim();
  
  // Remove URLs
  cleaned = cleaned.replace(/https?:\/\/[^\s]+/g, '').trim();
  
  // Remove phone numbers
  cleaned = cleaned.replace(/\d{10}/g, '').trim();
  
  // Remove extra whitespace
  cleaned = cleaned.replace(/\n+/g, '\n').trim();
  
  return cleaned.substring(0, 500); // Limit length
}

// Process posts and extract products
const products = [];
let productId = 1;

posts.forEach(post => {
  if (!post.caption || post.caption.length < 10) return;
  
  const price = extractPrice(post.caption);
  const name = extractProductName(post.caption);
  const description = cleanDescription(post.caption);
  const category = getCategory(post.hashtags);
  
  // Use first image as main image
  const imageUrl = post.images && post.images.length > 0 ? post.images[0] : post.displayUrl;
  
  // Skip if no image
  if (!imageUrl) return;
  
  // Create product object
  const product = {
    id: productId++,
    name: name,
    price: price || 999.99, // Default price if not found
    original_price: price ? price * 1.2 : 1199.99, // 20% markup for original price
    description: description,
    category: category,
    image_url: imageUrl,
    in_stock: true,
    stock_quantity: Math.floor(Math.random() * 50) + 10, // Random stock
    features: post.hashtags ? post.hashtags.slice(0, 5) : [],
    rating: Math.floor(Math.random() * 2) + 4, // Random rating 4-5
    reviews: Math.floor(Math.random() * 20) + 5, // Random reviews
    discount: price ? Math.floor(Math.random() * 15) + 5 : 0, // Random discount
    hidden_on_home: false
  };
  
  products.push(product);
});

// Create SQL insert statements
const sqlStatements = products.map(product => {
  return `INSERT INTO products (name, price, original_price, description, category, image_url, in_stock, stock_quantity, features, rating, reviews, discount, hidden_on_home) VALUES (
    '${product.name.replace(/'/g, "''")}',
    ${product.price},
    ${product.original_price},
    '${product.description.replace(/'/g, "''")}',
    '${product.category}',
    '${product.image_url}',
    ${product.in_stock},
    ${product.stock_quantity},
    '${JSON.stringify(product.features)}',
    ${product.rating},
    ${product.reviews},
    ${product.discount},
    ${product.hidden_on_home}
  );`;
});

// Write SQL file
const sqlContent = sqlStatements.join('\n\n');
fs.writeFileSync('./supabase-products.sql', sqlContent);

// Write JSON file for reference
fs.writeFileSync('./processed-products.json', JSON.stringify(products, null, 2));

console.log(`✅ Processed ${products.length} products from Instagram dataset`);
console.log('📁 Generated files:');
console.log('   - supabase-products.sql (SQL insert statements)');
console.log('   - processed-products.json (JSON data)');
console.log('\n📊 Product categories:');
const categories = {};
products.forEach(p => {
  categories[p.category] = (categories[p.category] || 0) + 1;
});
Object.entries(categories).forEach(([cat, count]) => {
  console.log(`   - ${cat}: ${count} products`);
});
