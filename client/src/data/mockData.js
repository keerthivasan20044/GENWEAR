export const products = [
    // MEN SECTION (10 Items)
    {
        id: 1,
        name: "Premium Cotton Oversized Tee",
        price: 3499,
        originalPrice: 4999,
        gender: "men",
        category: "topwear",
        colors: [
            { name: "Black", hex: "#000000" }, { name: "Gray", hex: "#808080" }, { name: "White", hex: "#FFFFFF" }
        ],
        sizes: [
            { size: "S", stock: 15 }, { size: "M", stock: 20 }, { size: "L", stock: 25 }, { size: "XL", stock: 10 }
        ],
        images: [
            "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
            "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80",
            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80"
        ],
        description: "Premium heavy-weight cotton tee with a structured fit and drop-shoulder design.",
        features: ["100% Organic Cotton", "Heavyweight 240 GSM", "Relaxed Fit"],
        careInstructions: ["Machine wash cold", "Tumble dry low"],
        rating: 4.8,
        reviews: 124,
        isNew: true,
        inStock: true,
        brand: "GENWEAR",
        material: "Organic Cotton",
        fit: "Oversized"
    },
    {
        id: 2,
        name: "Technical Utility Cargo",
        price: 6999,
        originalPrice: 8500,
        gender: "men",
        category: "bottomwear",
        colors: [
            { name: "Olive", hex: "#556B2F" }, { name: "Black", hex: "#000000" }
        ],
        sizes: [
            { size: "30", stock: 12 }, { size: "32", stock: 18 }, { size: "34", stock: 15 }
        ],
        images: [
            "https://images.unsplash.com/photo-1624373666014-9426f0490f20?w=800&q=80",
            "https://images.unsplash.com/photo-1552346154-21d328109a27?w=800&q=80"
        ],
        description: "Multi-pocket technical cargo pants with water-resistant finish.",
        features: ["Water-resistant Ripstop", "6 Functional Pockets", "Adjustable Ankle Straps"],
        careInstructions: ["Machine wash cold", "Skip the dryer"],
        rating: 4.9,
        reviews: 89,
        isNew: true,
        inStock: true,
        brand: "GENWEAR",
        material: "Nylon Ripstop",
        fit: "Tapered"
    },
    {
        id: 3,
        name: "Smart Linen Shirt",
        price: 4500,
        originalPrice: 5500,
        gender: "men",
        category: "topwear",
        colors: [
            { name: "Beige", hex: "#F5F5DC" }, { name: "White", hex: "#FFFFFF" }
        ],
        sizes: [
            { size: "M", stock: 20 }, { size: "L", stock: 25 }, { size: "XL", stock: 15 }
        ],
        images: [
            "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&q=80",
            "https://images.unsplash.com/photo-1621072138294-592f20942bd3?w=800&q=80"
        ],
        description: "Breathable Italian linen shirt for a clean, effortless look.",
        features: ["100% Premium Linen", "Breathable Fabric", "Slim Fit"],
        careInstructions: ["Hand wash recommended"],
        rating: 4.7,
        reviews: 56,
        isNew: false,
        inStock: true,
        brand: "GENWEAR",
        material: "Italian Linen",
        fit: "Slim"
    },

    // WOMEN SECTION (10 Items)
    {
        id: 51,
        name: "Silk Blend Wrap Blazer",
        price: 14999,
        originalPrice: 18000,
        gender: "women",
        category: "outerwear",
        colors: [
            { name: "White", hex: "#FFFFFF" }, { name: "Black", hex: "#000000" }
        ],
        sizes: [
            { size: "S", stock: 10 }, { size: "M", stock: 15 }, { size: "L", stock: 8 }
        ],
        images: [
            "https://images.unsplash.com/photo-1548142813-c348350df52b?w=800&q=80",
            "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=800&q=80"
        ],
        description: "Tailored silk-blend blazer with a delicate wrap waist closure.",
        features: ["Silk-Cotton Blend", "Wrap Closure", "Padded Shoulders"],
        careInstructions: ["Dry clean only"],
        rating: 5.0,
        reviews: 28,
        isNew: true,
        inStock: true,
        brand: "GENWEAR",
        material: "Silk Blend",
        fit: "Tailored"
    },
    {
        id: 52,
        name: "Pleated Wide-Leg Pants",
        price: 5500,
        originalPrice: 7000,
        gender: "women",
        category: "bottomwear",
        colors: [
            { name: "Gray", hex: "#808080" }, { name: "Black", hex: "#000000" }
        ],
        sizes: [
            { size: "26", stock: 10 }, { size: "28", stock: 15 }, { size: "30", stock: 12 }
        ],
        images: [
            "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800&q=80",
            "https://images.unsplash.com/photo-1509556756506-307620d911ef?w=800&q=80"
        ],
        description: "Flowing wide-leg trousers with sharp front pleats.",
        features: ["Lightweight Crepe", "High-waisted Fit", "Deep Pleats"],
        careInstructions: ["Machine wash cold"],
        rating: 4.8,
        reviews: 64,
        isNew: false,
        inStock: true,
        brand: "GENWEAR",
        material: "Polyester Crepe",
        fit: "Wide-leg"
    },

    // KIDS SECTION (5 Items)
    {
        id: 101,
        name: "Comfort Cotton Hoodie",
        price: 3499,
        originalPrice: 4500,
        gender: "kids",
        category: "outerwear",
        colors: [
            { name: "Blue", hex: "#0000FF" }, { name: "Yellow", hex: "#FFFF00" }
        ],
        sizes: [
            { size: "4Y", stock: 15 }, { size: "6Y", stock: 12 }, { size: "8Y", stock: 10 }
        ],
        images: [
            "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&q=80",
            "https://images.unsplash.com/photo-1621454523226-eb4f525c8ff7?w=800&q=80"
        ],
        description: "Super soft thermal hoodie for all-day play.",
        features: ["Organic Cotton Blend", "Kangaroo Pocket", "Pre-shrunk"],
        careInstructions: ["Machine wash warm"],
        rating: 4.8,
        reviews: 56,
        isNew: true,
        inStock: true,
        brand: "GENWEAR",
        material: "Organic Cotton",
        fit: "Regular"
    },
    {
        id: 102,
        name: "Action Jogger Set",
        price: 4999,
        originalPrice: 6000,
        gender: "kids",
        category: "topwear",
        colors: [
            { name: "Gray", hex: "#808080" }, { name: "Pink", hex: "#FFC0CB" }
        ],
        sizes: [
            { size: "4Y", stock: 20 }, { size: "6Y", stock: 15 }
        ],
        images: [
            "https://images.unsplash.com/photo-1601342701802-98ed06ce0cbc?w=800&q=80",
            "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&q=80"
        ],
        description: "Matching two-piece sweatshirt and jogger set.",
        features: ["Soft Terry Cloth", "Elastic Waistband", "Ribbed Cuffs"],
        careInstructions: ["Machine wash cold"],
        rating: 4.7,
        reviews: 32,
        isNew: false,
        inStock: true,
        brand: "GENWEAR",
        material: "French Terry",
        fit: "Standard"
    },

    // ACCESSORIES (5 Items)
    {
        id: 201,
        name: "Merino Wool Beanie",
        price: 1999,
        originalPrice: 2499,
        gender: "unisex",
        category: "accessories",
        colors: [
            { name: "Charcoal", hex: "#36454F" }, { name: "Navy", hex: "#000080" }
        ],
        sizes: [
            { size: "One Size", stock: 50 }
        ],
        images: [
            "https://images.unsplash.com/photo-1618354691792-d1d42acfd860?w=800&q=80",
            "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800&q=80"
        ],
        description: "Classic rib-knit beanie made from premium merino wool.",
        features: ["100% Merino Wool", "Soft & Warm", "Adjustable Fit"],
        careInstructions: ["Hand wash cold"],
        rating: 4.5,
        reviews: 78,
        isNew: false,
        inStock: true,
        brand: "GENWEAR",
        material: "Merino Wool",
        fit: "One Size"
    },
    {
        id: 202,
        name: "Urban Explorer Backpack",
        price: 12999,
        originalPrice: 15999,
        gender: "unisex",
        category: "accessories",
        colors: [
            { name: "Black", hex: "#000000" }
        ],
        sizes: [
            { size: "25L", stock: 15 }
        ],
        images: [
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
            "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&q=80"
        ],
        description: "Durable urban backpack with dedicated laptop sleeve.",
        features: ["High-grade Nylon", "Water Resistant", "Padded Laptop Sleeve"],
        careInstructions: ["Wipe clean only"],
        rating: 4.9,
        reviews: 24,
        isNew: true,
        inStock: true,
        brand: "GENWEAR",
        material: "Nylon",
        fit: "Standard"
    }
];

export const users = [
    {
        id: 1,
        email: "admin@genwear.com",
        password: "Admin@123",
        firstName: "Admin",
        lastName: "User",
        role: "admin"
    },
    {
        id: 2,
        email: "john@example.com",
        password: "User@123",
        firstName: "John",
        lastName: "Doe",
        role: "customer"
    }
];
