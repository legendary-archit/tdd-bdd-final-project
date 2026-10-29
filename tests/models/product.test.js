const { Product, Category } = require('../../src/models/product');
const { sequelize } = require('../../src/database/connection');
const { ProductFactory } = require('../factories');

describe('Product Model', () => {


  
  describe('Product Creation', () => {
    test('should create a product and assert that it exists', () => {
      const productData = {
        name: 'Fedora',
        description: 'A red hat',
        price: 12.50,
        available: true,
        category: Category.CLOTHS
      };
      
      const product = new Product(productData);
      
      expect(product).toBeDefined();
      expect(product.id).toBeNull(); // Not saved yet
      expect(product.name).toBe('Fedora');
      expect(product.description).toBe('A red hat');
      expect(product.available).toBe(true);
      expect(product.price).toBe(12.50);
      expect(product.category).toBe(Category.CLOTHS);
    });
    
    test('should add a product to the database', async () => {
      // Check database is empty
      const products = await Product.findAll();
      expect(products).toEqual([]);
      
      // Create product using factory
      const productData = ProductFactory.build();
      delete productData.id; // Remove ID so database assigns one
      
      const product = await Product.create(productData);
      
      // Assert that it was assigned an id and shows up in the database
      expect(product.id).toBeDefined();
      
      const allProducts = await Product.findAll();
      expect(allProducts.length).toBe(1);
      
      // Check that it matches the original product
      const newProduct = allProducts[0];
      expect(newProduct.name).toBe(productData.name);
      expect(newProduct.description).toBe(productData.description);
      expect(parseFloat(newProduct.price)).toBe(productData.price);
      expect(newProduct.available).toBe(productData.available);
      expect(newProduct.category).toBe(productData.category);
    });
  });
  
  //
  // ADD YOUR TEST CASES HERE
  //

  describe('Read a Product', () => {
    test('should read a product', async () => {
      const productData = ProductFactory.build();
      delete productData.id;
      const product = await Product.create(productData);
      console.log('Created product:', product.serialize());

      // Product was saved and assigned an id
      expect(product.id).not.toBeNull();

      // Fetch it back and check every property
      const found = await Product.findByPk(product.id);
      expect(found.id).toBe(product.id);
      expect(found.name).toBe(product.name);
      expect(found.description).toBe(product.description);
      expect(parseFloat(found.price)).toBe(parseFloat(product.price));
      expect(found.available).toBe(product.available);
      expect(found.category).toBe(product.category);
    });
  });

  describe('Update a Product', () => {
    test('should update a product', async () => {
      const productData = ProductFactory.build();
      delete productData.id;
      const product = await Product.create(productData);
      console.log('Created product:', product.serialize());
      expect(product.id).not.toBeNull();

      // Change the description and save
      const originalId = product.id;
      product.description = 'testing';
      await product.save();
      console.log('Updated product:', product.serialize());
      expect(product.id).toBe(originalId);
      expect(product.description).toBe('testing');

      // Still only one product, with the same id and the new description
      const products = await Product.findAll();
      expect(products.length).toBe(1);
      expect(products[0].id).toBe(originalId);
      expect(products[0].description).toBe('testing');
    });
  });

  describe('Delete a Product', () => {
    test('should delete a product', async () => {
      const product = await ProductFactory.create();
      let products = await Product.findAll();
      expect(products.length).toBe(1);

      await product.destroy();
      products = await Product.findAll();
      expect(products.length).toBe(0);
    });
  });

  describe('List all Products', () => {
    test('should list all products in the database', async () => {
      let products = await Product.findAll();
      expect(products).toEqual([]);

      await ProductFactory.createList(5);
      products = await Product.findAll();
      expect(products.length).toBe(5);
    });
  });

  describe('Find a Product by Name', () => {
    test('should find products by name', async () => {
      const products = await ProductFactory.createList(5);
      const name = products[0].name;
      const count = products.filter(p => p.name === name).length;

      const found = await Product.findByName(name);
      expect(found.length).toBe(count);
      found.forEach(p => expect(p.name).toBe(name));
    });
  });

  describe('Find a Product by Category', () => {
    test('should find products by category', async () => {
      const products = await ProductFactory.createList(10);
      const category = products[0].category;
      const count = products.filter(p => p.category === category).length;

      const found = await Product.findByCategory(category);
      expect(found.length).toBe(count);
      found.forEach(p => expect(p.category).toBe(category));
    });
  });

  describe('Find a Product by Availability', () => {
    test('should find products by availability', async () => {
      const products = await ProductFactory.createList(10);
      const available = products[0].available;
      const count = products.filter(p => p.available === available).length;

      const found = await Product.findByAvailability(available);
      expect(found.length).toBe(count);
      found.forEach(p => expect(p.available).toBe(available));
    });
  });
});

  
  
