export type Product = {
  id: string;
  name: string;
  nameBn: string;
  price: number;
  originalPrice?: number;
  category: string;
  image: string;
  description: string;
  descriptionBn: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  isOrganic: boolean;
  isFeatured?: boolean;
  unit: string;
  origin: string;
};

export type Category = {
  id: string;
  name: string;
  nameBn: string;
  icon: "apple" | "leaf" | "droplet" | "flame" | "wheat" | "flask" | "milk" | "flower";
};

export const categories: Category[] = [
  { id: "fruits", name: "Organic Fruits", nameBn: "জৈব ফল", icon: "apple" },
  { id: "vegetables", name: "Fresh Vegetables", nameBn: "তাজা সবজি", icon: "leaf" },
  { id: "honey", name: "Pure Honey", nameBn: "খাঁটি মধু", icon: "droplet" },
  { id: "spices", name: "Natural Spices", nameBn: "প্রাকৃতিক মশলা", icon: "flame" },
  { id: "grains", name: "Organic Grains", nameBn: "জৈব শস্য", icon: "wheat" },
  { id: "oils", name: "Cold-Pressed Oils", nameBn: "ঠান্ডা চাপা তেল", icon: "flask" },
  { id: "dairy", name: "Farm Dairy", nameBn: "খামারের দুগ্ধ", icon: "milk" },
  { id: "beauty", name: "Natural Beauty", nameBn: "প্রাকৃতিক সৌন্দর্য", icon: "flower" },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Organic Mango (Himsagar)",
    nameBn: "জৈব হিমসাগর আম",
    price: 350,
    originalPrice: 420,
    category: "fruits",
    image:
      "https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&h=800&fit=crop",
    description:
      "Sweet and juicy Himsagar mangoes grown organically in Rajshahi. No chemical pesticides. Peak-season fruit, picked ripe.",
    descriptionBn:
      "রাজশাহীর জৈব পদ্ধতিতে চাষ করা মিষ্টি ও রসালো হিমসাগর আম। কোনো রাসায়নিক কীটনাশক ব্যবহার করা হয়নি।",
    rating: 4.9,
    reviews: 128,
    inStock: true,
    isOrganic: true,
    isFeatured: true,
    unit: "1 kg",
    origin: "Rajshahi",
  },
  {
    id: "2",
    name: "Fresh Organic Spinach",
    nameBn: "তাজা জৈব পালং শাক",
    price: 45,
    category: "vegetables",
    image:
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=800&h=800&fit=crop",
    description:
      "Locally grown organic spinach packed with iron and vitamins. Harvested daily from partner farms in Gazipur.",
    descriptionBn:
      "লোকাল জৈব পালং শাক, আয়রন ও ভিটামিন সমৃদ্ধ। গাজীপুরের পার্টনার খামার থেকে প্রতিদিন সংগ্রহ করা।",
    rating: 4.7,
    reviews: 89,
    inStock: true,
    isOrganic: true,
    isFeatured: true,
    unit: "500 g",
    origin: "Gazipur",
  },
  {
    id: "3",
    name: "Sundarban Pure Honey",
    nameBn: "সুন্দরবনের খাঁটি মধু",
    price: 850,
    originalPrice: 950,
    category: "honey",
    image:
      "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&h=800&fit=crop",
    description:
      "Raw, unfiltered honey collected from the Sundarbans mangrove forests. Rich in antioxidants and natural enzymes.",
    descriptionBn:
      "সুন্দরবনের ম্যানগ্রোভ বন থেকে সংগৃহীত কাঁচা, ফিল্টার না করা মধু। অ্যান্টিঅক্সিডেন্ট ও প্রাকৃতিক এনজাইম সমৃদ্ধ।",
    rating: 4.95,
    reviews: 256,
    inStock: true,
    isOrganic: true,
    isFeatured: true,
    unit: "500 g",
    origin: "Sundarbans",
  },
  {
    id: "4",
    name: "Organic Turmeric Powder",
    nameBn: "জৈব হলুদ গুঁড়া",
    price: 180,
    category: "spices",
    image:
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&h=800&fit=crop",
    description:
      "High-curcumin organic turmeric from Bogura. Sun-dried and stone-ground for maximum potency.",
    descriptionBn:
      "বগুড়ার উচ্চ কার্কিউমিন যুক্ত জৈব হলুদ। রোদে শুকিয়ে পাথরের চাকিতে গুঁড়ো করা।",
    rating: 4.8,
    reviews: 174,
    inStock: true,
    isOrganic: true,
    isFeatured: true,
    unit: "250 g",
    origin: "Bogura",
  },
  {
    id: "5",
    name: "Organic Brown Rice",
    nameBn: "জৈব বাদামি চাল",
    price: 120,
    category: "grains",
    image:
      "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?w=800&h=800&fit=crop",
    description:
      "Nutrient-rich organic brown rice from Dinajpur. Grown without synthetic fertilizers.",
    descriptionBn:
      "দিনাজপুরের পুষ্টিগুণসমৃদ্ধ জৈব বাদামি চাল। সিন্থেটিক সার ছাড়া চাষ করা।",
    rating: 4.6,
    reviews: 92,
    inStock: true,
    isOrganic: true,
    unit: "1 kg",
    origin: "Dinajpur",
  },
  {
    id: "6",
    name: "Cold-Pressed Mustard Oil",
    nameBn: "ঠান্ডা চাপা সরিষার তেল",
    price: 320,
    category: "oils",
    image:
      "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800&h=800&fit=crop",
    description:
      "Traditional cold-pressed mustard oil from Kushtia. Retains natural aroma and health benefits.",
    descriptionBn:
      "কুষ্টিয়ার ঐতিহ্যবাহী ঠান্ডা চাপা সরিষার তেল। প্রাকৃতিক সুগন্ধ ও স্বাস্থ্যগুণ অক্ষুণ্ণ।",
    rating: 4.85,
    reviews: 203,
    inStock: true,
    isOrganic: true,
    isFeatured: true,
    unit: "1 liter",
    origin: "Kushtia",
  },
  {
    id: "7",
    name: "Farm Fresh Cow Milk",
    nameBn: "খামারের তাজা গরুর দুধ",
    price: 90,
    category: "dairy",
    image:
      "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&h=800&fit=crop",
    description:
      "Pure cow milk from free-grazing cows in Savar. Delivered chilled within hours of milking.",
    descriptionBn:
      "সাভারের মুক্ত চারণভূমির গরুর খাঁটি দুধ। দোহনের কয়েক ঘণ্টার মধ্যে ঠান্ডা অবস্থায় ডেলিভারি।",
    rating: 4.7,
    reviews: 145,
    inStock: true,
    isOrganic: true,
    unit: "1 liter",
    origin: "Savar",
  },
  {
    id: "8",
    name: "Neem & Tulsi Face Pack",
    nameBn: "নিম ও তুলসী ফেস প্যাক",
    price: 280,
    category: "beauty",
    image:
      "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=800&fit=crop",
    description:
      "100% natural face pack made with neem, tulsi and multani mitti. Suitable for all skin types.",
    descriptionBn:
      "নিম, তুলসী ও মুলতানি মাটি দিয়ে তৈরি ১০০% প্রাকৃতিক ফেস প্যাক। সব ধরনের ত্বকের জন্য উপযোগী।",
    rating: 4.75,
    reviews: 67,
    inStock: true,
    isOrganic: true,
    unit: "100 g",
    origin: "Dhaka",
  },
  {
    id: "9",
    name: "Organic Jackfruit",
    nameBn: "জৈব কাঁঠাল",
    price: 150,
    category: "fruits",
    image:
      "https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?w=800&h=800&fit=crop",
    description:
      "Sweet organic jackfruit from Mymensingh. Naturally ripened on the tree.",
    descriptionBn:
      "ময়মনসিংহের মিষ্টি জৈব কাঁঠাল। গাছে প্রাকৃতিকভাবে পাকা।",
    rating: 4.5,
    reviews: 41,
    inStock: true,
    isOrganic: true,
    unit: "1 piece (~3kg)",
    origin: "Mymensingh",
  },
  {
    id: "10",
    name: "Organic Red Lentils (Masoor)",
    nameBn: "জৈব মসুর ডাল",
    price: 140,
    category: "grains",
    image:
      "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=800&h=800&fit=crop",
    description:
      "Premium organic red lentils grown in the fertile lands of Rangpur.",
    descriptionBn:
      "রংপুরের উর্বর মাটিতে চাষ করা প্রিমিয়াম জৈব মসুর ডাল।",
    rating: 4.65,
    reviews: 78,
    inStock: true,
    isOrganic: true,
    unit: "1 kg",
    origin: "Rangpur",
  },
  {
    id: "11",
    name: "Organic Green Chili",
    nameBn: "জৈব কাঁচা মরিচ",
    price: 60,
    category: "vegetables",
    image:
      "https://images.unsplash.com/photo-1588252303782-cb801f41b0d5?w=800&h=800&fit=crop",
    description:
      "Fresh organic green chilies with authentic heat. Grown in Jessore farms.",
    descriptionBn:
      "যশোরের খামারে চাষ করা তাজা জৈব কাঁচা মরিচ। আসল ঝাঁঝ বজায়।",
    rating: 4.4,
    reviews: 53,
    inStock: true,
    isOrganic: true,
    unit: "250 g",
    origin: "Jessore",
  },
  {
    id: "12",
    name: "Coconut Oil (Virgin)",
    nameBn: "ভার্জিন নারকেল তেল",
    price: 450,
    category: "oils",
    image:
      "https://images.unsplash.com/photo-1526947425960-945c6e72858f?w=800&h=800&fit=crop",
    description:
      "Cold-pressed virgin coconut oil from Cox's Bazar. Ideal for cooking and skincare.",
    descriptionBn:
      "কক্সবাজারের ঠান্ডা চাপা ভার্জিন নারকেল তেল। রান্না ও ত্বকের যত্নের জন্য আদর্শ।",
    rating: 4.9,
    reviews: 112,
    inStock: true,
    isOrganic: true,
    isFeatured: true,
    unit: "500 ml",
    origin: "Cox's Bazar",
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured);
}

export function formatPrice(price: number): string {
  return `৳${price.toLocaleString("en-BD")}`;
}

export const FREE_DELIVERY_MIN = 1000;
export const DELIVERY_FEE = 60;
