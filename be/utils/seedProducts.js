import Product from "../models/Product.js";

// Sample products data for seeding
const sampleProducts = [
  // 1. Premium Headphones
  {
    title: "Premium Headphones",
    description:
      "High-quality wireless headphones with noise cancellation and premium sound quality.",
    price: 199.99,
    inventory: 50,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    variants: [
      {
        name: "Black",
        price: 199.99,
        inventory: 20,
        image:
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        name: "White",
        price: 199.99,
        inventory: 15,
        image:
          "https://images.unsplash.com/photo-1577174881658-0f30ed549adc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        name: "Limited Edition Gold",
        price: 249.99,
        inventory: 5,
        image:
          "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
    ],
  },
  // 2. Smartphone Case
  {
    title: "Smartphone Case",
    description:
      "Durable and stylish smartphone case with shock absorption technology.",
    price: 29.99,
    inventory: 100,
    image:
      "https://images.unsplash.com/photo-1541877944-ac82a091518a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    variants: [
      {
        name: "iPhone 13",
        price: 29.99,
        inventory: 30,
        image:
          "https://images.unsplash.com/photo-1541877944-ac82a091518a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        name: "iPhone 14",
        price: 34.99,
        inventory: 40,
        image:
          "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        name: "Samsung Galaxy S22",
        price: 29.99,
        inventory: 30,
        image:
          "https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
    ],
  },
  // 3. Wireless Charging Pad
  {
    title: "Wireless Charging Pad",
    description:
      "Fast wireless charging pad compatible with all Qi-enabled devices.",
    price: 49.99,
    inventory: 75,
    image: "https://m.media-amazon.com/images/I/61oIAKY9s1L.jpg",
    variants: [
      {
        name: "Standard (10W)",
        price: 49.99,
        inventory: 45,
        image: "https://m.media-amazon.com/images/I/61oIAKY9s1L.jpg",
      },
      {
        name: "Pro (15W)",
        price: 69.99,
        inventory: 30,
        image: "https://m.media-amazon.com/images/I/61oIAKY9s1L.jpg",
      },
    ],
  },
  // 4. Smart Watch
  {
    title: "Smart Watch",
    description:
      "Feature-rich smartwatch with health tracking and notifications.",
    price: 249.99,
    inventory: 40,
    image:
      "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    variants: [
      {
        name: "Black",
        price: 249.99,
        inventory: 20,
        image:
          "https://images.unsplash.com/photo-1546868871-7041f2a55e12?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        name: "Silver",
        price: 249.99,
        inventory: 15,
        image:
          "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        name: "Rose Gold",
        price: 279.99,
        inventory: 5,
        image:
          "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
    ],
  },
  // 5. Bluetooth Speaker
  {
    title: "Bluetooth Speaker",
    description:
      "Portable Bluetooth speaker with 360° sound and waterproof design.",
    price: 79.99,
    inventory: 60,
    image:
      "https://images.unsplash.com/photo-1589003077984-894e133dabab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    variants: [
      {
        name: "Black",
        price: 79.99,
        inventory: 25,
        image:
          "https://images.unsplash.com/photo-1589003077984-894e133dabab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        name: "Blue",
        price: 79.99,
        inventory: 20,
        image:
          "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        name: "Red",
        price: 79.99,
        inventory: 15,
        image:
          "https://images.unsplash.com/photo-1593078165899-c7d2ac0d6aea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
    ],
  },
  // 6. Laptop Backpack
  {
    title: "Laptop Backpack",
    description:
      "Ergonomic backpack with padded laptop compartment and multiple pockets.",
    price: 59.99,
    inventory: 85,
    image:
      "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    variants: [
      {
        name: "Black",
        price: 59.99,
        inventory: 40,
        image:
          "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        name: "Navy Blue",
        price: 59.99,
        inventory: 30,
        image:
          "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        name: "Gray",
        price: 59.99,
        inventory: 15,
        image:
          "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
    ],
  },
  // 7. Mechanical Keyboard
  {
    title: "Mechanical Keyboard",
    description:
      "High-performance mechanical keyboard with customizable RGB lighting.",
    price: 129.99,
    inventory: 35,
    image:
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    variants: [
      {
        name: "Blue Switches",
        price: 129.99,
        inventory: 15,
        image:
          "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        name: "Red Switches",
        price: 129.99,
        inventory: 10,
        image:
          "https://images.unsplash.com/photo-1595225476474-87563907a212?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        name: "Brown Switches",
        price: 129.99,
        inventory: 10,
        image:
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
    ],
  },
  // 8. Wireless Mouse
  {
    title: "Wireless Mouse",
    description:
      "Ergonomic wireless mouse with precision tracking and long battery life.",
    price: 39.99,
    inventory: 90,
    image:
      "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    variants: [
      {
        name: "Black",
        price: 39.99,
        inventory: 40,
        image:
          "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        name: "White",
        price: 39.99,
        inventory: 30,
        image:
          "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        name: "Gaming Edition",
        price: 49.99,
        inventory: 20,
        image:
          "https://images.unsplash.com/photo-1605773527852-c546a8584ea3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
    ],
  },
  // 9. Tablet Stand
  {
    title: "Tablet Stand",
    description:
      "Adjustable tablet stand compatible with all tablets and e-readers.",
    price: 24.99,
    inventory: 120,
    image:
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    variants: [
      {
        name: "Silver",
        price: 24.99,
        inventory: 50,
        image:
          "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        name: "Black",
        price: 24.99,
        inventory: 40,
        image:
          "https://images.unsplash.com/photo-1584164087636-6b0c4bca7b2b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        name: "Wood Finish",
        price: 34.99,
        inventory: 30,
        image:
          "https://images.unsplash.com/photo-1619506147448-b56ba8ee11ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
    ],
  },
  // 10. Portable Power Bank
  {
    title: "Portable Power Bank",
    description:
      "High-capacity power bank with fast charging for all your devices.",
    price: 49.99,
    inventory: 80,
    image:
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    variants: [
      {
        name: "10,000 mAh",
        price: 49.99,
        inventory: 40,
        image:
          "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        name: "20,000 mAh",
        price: 69.99,
        inventory: 30,
        image:
          "https://images.unsplash.com/photo-1585338069738-65b9e65db9b7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        name: "Wireless Charging",
        price: 79.99,
        inventory: 10,
        image:
          "https://images.unsplash.com/photo-1618410320928-25228d811631?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
    ],
  },
  // 11. Fitness Tracker
  {
    title: "Fitness Tracker",
    description:
      "Advanced fitness tracker with heart rate monitoring and sleep tracking.",
    price: 89.99,
    inventory: 65,
    image:
      "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    variants: [
      {
        name: "Black",
        price: 89.99,
        inventory: 30,
        image:
          "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        name: "Blue",
        price: 89.99,
        inventory: 20,
        image:
          "https://images.unsplash.com/photo-1557935728-e6d1eaabe558?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        name: "Premium Edition",
        price: 119.99,
        inventory: 15,
        image:
          "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
    ],
  },
  // 12. Wireless Earbuds
  {
    title: "Wireless Earbuds",
    description:
      "True wireless earbuds with noise isolation and long battery life.",
    price: 129.99,
    inventory: 55,
    image:
      "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    variants: [
      {
        name: "Black",
        price: 129.99,
        inventory: 25,
        image:
          "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        name: "White",
        price: 129.99,
        inventory: 20,
        image:
          "https://images.unsplash.com/photo-1631176093617-e045e0f82a56?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        name: "Sport Edition",
        price: 149.99,
        inventory: 10,
        image:
          "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
    ],
  },
  // 13. Smart Home Hub
  {
    title: "Smart Home Hub",
    description:
      "Central hub for controlling all your smart home devices with voice commands.",
    price: 149.99,
    inventory: 40,
    image:
      "https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    variants: [
      {
        name: "Standard",
        price: 149.99,
        inventory: 25,
        image:
          "https://images.unsplash.com/photo-1558002038-1055907df827?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        name: "With Screen",
        price: 199.99,
        inventory: 15,
        image:
          "https://images.unsplash.com/photo-1544428571-affe9f8c91a6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
    ],
  },
  // 14. Digital Camera
  {
    title: "Digital Camera",
    description:
      "High-resolution digital camera with optical zoom and image stabilization.",
    price: 499.99,
    inventory: 25,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    variants: [
      {
        name: "Standard Kit",
        price: 499.99,
        inventory: 15,
        image:
          "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        name: "Pro Kit",
        price: 699.99,
        inventory: 10,
        image:
          "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
    ],
  },
  // 15. Laptop Cooling Pad
  {
    title: "Laptop Cooling Pad",
    description:
      "Cooling pad with multiple fans to prevent laptop overheating during intensive tasks.",
    price: 34.99,
    inventory: 70,
    image:
      "https://images.unsplash.com/photo-1619953942547-233eab5a70d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    variants: [
      {
        name: "Standard (2 Fans)",
        price: 34.99,
        inventory: 40,
        image:
          "https://images.unsplash.com/photo-1619953942547-233eab5a70d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        name: "Gaming (4 Fans)",
        price: 49.99,
        inventory: 30,
        image:
          "https://images.unsplash.com/photo-1593640495253-23196b27a87f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
    ],
  },
  // 16. External SSD
  {
    title: "External SSD",
    description:
      "Portable solid-state drive with high-speed data transfer and durable design.",
    price: 119.99,
    inventory: 45,
    image:
      "https://images.unsplash.com/photo-1597764690523-15bea4c581c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    variants: [
      {
        name: "500GB",
        price: 119.99,
        inventory: 20,
        image:
          "https://images.unsplash.com/photo-1597764690523-15bea4c581c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        name: "1TB",
        price: 179.99,
        inventory: 15,
        image:
          "https://images.unsplash.com/photo-1597764690523-15bea4c581c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        name: "2TB",
        price: 249.99,
        inventory: 10,
        image:
          "https://images.unsplash.com/photo-1597764690523-15bea4c581c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
    ],
  },
  // 17. Desk Lamp
  {
    title: "LED Desk Lamp",
    description:
      "Adjustable LED desk lamp with multiple brightness levels and color temperatures.",
    price: 39.99,
    inventory: 85,
    image: "https://m.media-amazon.com/images/I/61QPRxJk3dL.jpg",
    variants: [
      {
        name: "White",
        price: 39.99,
        inventory: 45,
        image: "https://m.media-amazon.com/images/I/61QPRxJk3dL.jpg",
      },
      {
        name: "Black",
        price: 39.99,
        inventory: 40,
        image:
          "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
    ],
  },
  // 18. Wireless Keyboard
  {
    title: "Wireless Keyboard",
    description:
      "Slim wireless keyboard with long battery life and comfortable typing experience.",
    price: 59.99,
    inventory: 60,
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    variants: [
      {
        name: "Black",
        price: 59.99,
        inventory: 30,
        image:
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        name: "White",
        price: 59.99,
        inventory: 20,
        image:
          "https://images.unsplash.com/photo-1561112078-7d24e04c3407?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        name: "Compact",
        price: 49.99,
        inventory: 10,
        image:
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
    ],
  },
  // 19. Smartphone Gimbal
  {
    title: "Smartphone Gimbal",
    description:
      "3-axis stabilizer for smartphones to capture smooth, professional-looking videos.",
    price: 89.99,
    inventory: 30,
    image:
      "https://m.media-amazon.com/images/I/51Q0I+lvW9L._AC_UF1000,1000_QL80_DpWeblab_.jpg",
    variants: [
      {
        name: "Standard",
        price: 89.99,
        inventory: 20,
        image:
          "https://m.media-amazon.com/images/I/51Q0I+lvW9L._AC_UF1000,1000_QL80_DpWeblab_.jpg",
      },
      {
        name: "Pro",
        price: 129.99,
        inventory: 10,
        image:
          "https://x.imastudent.com/content/0021663_godox-zp1-smartphone-gimbal_500.jpeg",
      },
    ],
  },
  // 20. USB-C Hub
  {
    title: "USB-C Hub",
    description:
      "Multi-port USB-C hub with HDMI, USB-A, and card reader ports for laptops and tablets.",
    price: 45.99,
    inventory: 75,
    image:
      "https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    variants: [
      {
        name: "6-in-1",
        price: 45.99,
        inventory: 40,
        image:
          "https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        name: "10-in-1",
        price: 69.99,
        inventory: 25,
        image:
          "https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
      {
        name: "Thunderbolt",
        price: 89.99,
        inventory: 10,
        image:
          "https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      },
    ],
  },
];

// Function to seed products
export const seedProducts = async () => {
  try {
    // Check if products collection is empty
    const count = await Product.countDocuments();

    if (count === 0) {
      console.log("Seeding products...");

      // Insert sample products
      await Product.insertMany(sampleProducts);

      console.log("Products seeded successfully!");
    } else {
      console.log("Products collection is not empty. Skipping seed.");
    }
  } catch (error) {
    console.error("Error seeding products:", error);
  }
};
