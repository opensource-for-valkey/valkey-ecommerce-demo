const API_URL = 'http://localhost:5000/api';

async function seed() {
  console.log('Starting seed...');

  // 1. Create categories
  const catNames = ['Mobile & Accessories', 'Laptop', 'Electronics', 'Smart Watch', 'Vegetables'];
  const categories = {};
  for (const name of catNames) {
    const res = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, slug: name.toLowerCase().replace(/ /g, '-') })
    });
    const data = await res.json();
    categories[name] = data.id;
    console.log('Created category:', data.id);
  }

  // 2. Create vendors
  const vendorNames = ['Farms Direct', 'Tech Hub', 'GadgetStore'];
  const vendors = {};
  for (const name of vendorNames) {
    const res = await fetch(`${API_URL}/vendors`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email: `${name.toLowerCase().replace(/ /g, '')}@example.com` })
    });
    const data = await res.json();
    vendors[name] = data.id;
    console.log('Created vendor:', data.id);
  }

  // 3. Create products
  const productsToCreate = [
    {
      name: "Taylor Farms Broccoli Florets Vegetables",
      categoryId: categories['Vegetables'],
      vendorId: vendors['Farms Direct'],
      brand: "Taylor Farms",
      description: "Fresh broccoli florets",
      price: { amount: 14.99, currency: "USD", discount: 0 },
      inventory: { quantity: 150, sku: "TF-BR-01" },
      ratings: { average: 4.8, count: 17000 },
      images: ["assets/images/thumbs/product-two-img1.png"],
      attributes: { weight: "500g" }
    },
    {
      name: "Galaxy Ultra Pro",
      categoryId: categories['Mobile & Accessories'],
      vendorId: vendors['Tech Hub'],
      brand: "Samsung",
      description: "Latest smartphone",
      price: { amount: 899.99, currency: "USD", discount: 50 },
      inventory: { quantity: 200, sku: "SAM-GU-PRO" },
      ratings: { average: 4.9, count: 2500 },
      images: ["assets/images/thumbs/product-two-img2.png"],
      attributes: { color: "Black" }
    },
    {
      name: "MacBook Pro M3",
      categoryId: categories['Laptop'],
      vendorId: vendors['Tech Hub'],
      brand: "Apple",
      description: "Powerful laptop",
      price: { amount: 1999.00, currency: "USD", discount: 0 },
      inventory: { quantity: 45, sku: "APP-MBP-M3" },
      ratings: { average: 4.9, count: 850 },
      images: ["assets/images/thumbs/product-two-img3.png"],
      attributes: { color: "Silver" }
    },
    {
      name: "Dell XPS 15",
      categoryId: categories['Laptop'],
      vendorId: vendors['GadgetStore'],
      brand: "DELL",
      description: "Premium windows laptop",
      price: { amount: 1499.50, currency: "USD", discount: 100 },
      inventory: { quantity: 80, sku: "DELL-XPS-15" },
      ratings: { average: 4.7, count: 1200 },
      images: ["assets/images/thumbs/product-two-img4.png"],
      attributes: { color: "Gray" }
    },
    {
      name: "Dell Inspiron 14",
      categoryId: categories['Laptop'],
      vendorId: vendors['GadgetStore'],
      brand: "DELL",
      description: "Budget friendly laptop",
      price: { amount: 699.99, currency: "USD", discount: 50 },
      inventory: { quantity: 150, sku: "DELL-INSP-14" },
      ratings: { average: 4.4, count: 800 },
      images: ["assets/images/thumbs/product-two-img4.png"],
      attributes: { color: "Silver" }
    },
    {
      name: "Dell Alienware m16",
      categoryId: categories['Laptop'],
      vendorId: vendors['GadgetStore'],
      brand: "DELL",
      description: "High-end gaming laptop",
      price: { amount: 2499.00, currency: "USD", discount: 0 },
      inventory: { quantity: 30, sku: "DELL-ALW-M16" },
      ratings: { average: 4.8, count: 450 },
      images: ["assets/images/thumbs/product-two-img4.png"],
      attributes: { color: "Dark Side of the Moon" }
    },
    {
      name: "Dell UltraSharp 27 Monitor",
      categoryId: categories['Electronics'],
      vendorId: vendors['Tech Hub'],
      brand: "DELL",
      description: "4K USB-C Hub Monitor",
      price: { amount: 599.99, currency: "USD", discount: 20 },
      inventory: { quantity: 60, sku: "DELL-U2723QE" },
      ratings: { average: 4.9, count: 620 },
      images: ["assets/images/thumbs/product-two-img4.png"],
      attributes: { color: "Black" }
    },
    {
      name: "HP Envy",
      categoryId: categories['Laptop'],
      vendorId: vendors['GadgetStore'],
      brand: "HP",
      description: "Everyday laptop",
      price: { amount: 899.00, currency: "USD", discount: 0 },
      inventory: { quantity: 120, sku: "HP-ENVY-01" },
      ratings: { average: 4.5, count: 320 },
      images: ["assets/images/thumbs/product-two-img5.png"],
      attributes: { color: "White" }
    }
  ];

  for (const p of productsToCreate) {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p)
    });
    const data = await res.json();
    console.log(`Created product ${p.name}:`, data.id);
  }

  console.log('Seeding complete!');
}

seed().catch(console.error);
