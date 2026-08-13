// ─────────────────────────────────────────────────────────────────
//  Frozen Fusion — Product Data
//  This is the static fallback data. In production, this will be
//  replaced by MongoDB data fetched via the admin panel API.
// ─────────────────────────────────────────────────────────────────

export type Badge = "Best Seller" | "New" | "Limited" | "Popular" | "Seasonal" | null;

export interface Product {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  description: string;
  color: string;       // hex — drives glow + accent
  glow: string;        // rgba glow string
  gradient: string;    // CSS gradient for card
  badge: Badge;
  rating: number;
  image: string;
  tags: string[];
  visible: boolean;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  headerColor: string;
  products: Product[];
}

// ─── Flavor color map ─────────────────────────────────────────────
export const FLAVOR_COLORS: Record<string, { color: string; glow: string; gradient: string }> = {
  vanilla:        { color: "#F5E6C8", glow: "rgba(245,230,200,0.35)", gradient: "from-amber-100/20 to-yellow-900/20" },
  chocolate:      { color: "#7B4F2E", glow: "rgba(123,79,46,0.45)",  gradient: "from-amber-900/30 to-stone-900/30" },
  strawberry:     { color: "#FF6B8A", glow: "rgba(255,107,138,0.4)", gradient: "from-rose-400/20 to-pink-900/20" },
  mango:          { color: "#FFB347", glow: "rgba(255,179,71,0.4)",  gradient: "from-amber-400/20 to-orange-900/20" },
  butterscotch:   { color: "#D4A843", glow: "rgba(212,168,67,0.4)",  gradient: "from-yellow-500/20 to-amber-900/20" },
  "kesar pista":  { color: "#8CC63F", glow: "rgba(140,198,63,0.4)",  gradient: "from-green-400/20 to-emerald-900/20" },
  "black currant":{ color: "#6A0DAD", glow: "rgba(106,13,173,0.4)",  gradient: "from-purple-600/20 to-violet-900/20" },
  coffee:         { color: "#6F4E37", glow: "rgba(111,78,55,0.4)",   gradient: "from-amber-800/20 to-stone-900/20" },
  "tender coconut":{ color: "#C8F5E0", glow: "rgba(200,245,224,0.35)", gradient: "from-emerald-200/20 to-teal-900/20" },
  badam:          { color: "#C19A6B", glow: "rgba(193,154,107,0.4)", gradient: "from-amber-300/20 to-stone-800/20" },
  orange:         { color: "#FF8C00", glow: "rgba(255,140,0,0.4)",   gradient: "from-orange-500/20 to-red-900/20" },
  watermelon:     { color: "#FC4F6D", glow: "rgba(252,79,109,0.4)",  gradient: "from-red-400/20 to-rose-900/20" },
  pineapple:      { color: "#FFD700", glow: "rgba(255,215,0,0.4)",   gradient: "from-yellow-400/20 to-amber-900/20" },
  lemon:          { color: "#F5E642", glow: "rgba(245,230,66,0.4)",  gradient: "from-yellow-300/20 to-lime-900/20" },
  kiwi:           { color: "#5EBB4E", glow: "rgba(94,187,78,0.4)",   gradient: "from-green-500/20 to-emerald-900/20" },
  guava:          { color: "#FFA07A", glow: "rgba(255,160,122,0.4)", gradient: "from-red-300/20 to-rose-900/20" },
  lychee:         { color: "#FFB6C1", glow: "rgba(255,182,193,0.35)", gradient: "from-pink-300/20 to-rose-900/20" },
  "mixed fruit":  { color: "#FF6FA8", glow: "rgba(255,111,168,0.4)", gradient: "from-pink-400/20 to-purple-900/20" },
  grape:          { color: "#6F2DA8", glow: "rgba(111,45,168,0.4)",  gradient: "from-purple-700/20 to-indigo-900/20" },
  apple:          { color: "#7BC950", glow: "rgba(123,201,80,0.4)",  gradient: "from-green-400/20 to-lime-900/20" },
  malai:          { color: "#FFF5DC", glow: "rgba(255,245,220,0.3)", gradient: "from-yellow-100/20 to-amber-900/20" },
  rose:           { color: "#FF69B4", glow: "rgba(255,105,180,0.4)", gradient: "from-pink-400/20 to-rose-900/20" },
  elaichi:        { color: "#90EE90", glow: "rgba(144,238,144,0.35)", gradient: "from-green-300/20 to-emerald-900/20" },
  rabdi:          { color: "#F4C27F", glow: "rgba(244,194,127,0.4)", gradient: "from-amber-300/20 to-orange-900/20" },
  belgian:        { color: "#3D1C02", glow: "rgba(61,28,2,0.5)",     gradient: "from-stone-800/30 to-black/40" },
  pistachio:      { color: "#93C47D", glow: "rgba(147,196,125,0.4)", gradient: "from-green-400/20 to-emerald-900/20" },
  "cookies cream":{ color: "#D2B48C", glow: "rgba(210,180,140,0.4)", gradient: "from-amber-200/20 to-stone-900/20" },
  mint:           { color: "#98FF98", glow: "rgba(152,255,152,0.4)", gradient: "from-green-300/20 to-teal-900/20" },
  blueberry:      { color: "#4169E1", glow: "rgba(65,105,225,0.4)",  gradient: "from-blue-500/20 to-indigo-900/20" },
  "salted caramel":{ color: "#C68642", glow: "rgba(198,134,66,0.4)", gradient: "from-amber-500/20 to-orange-900/20" },
  "cotton candy": { color: "#FFB7D5", glow: "rgba(255,183,213,0.4)", gradient: "from-pink-300/20 to-purple-900/20" },
  bubblegum:      { color: "#87CEEB", glow: "rgba(135,206,235,0.4)", gradient: "from-sky-300/20 to-blue-900/20" },
  oreo:           { color: "#2D2D2D", glow: "rgba(45,45,45,0.5)",    gradient: "from-neutral-700/20 to-black/40" },
  kitkat:         { color: "#C0392B", glow: "rgba(192,57,43,0.4)",   gradient: "from-red-600/20 to-rose-900/20" },
  brownie:        { color: "#5C3317", glow: "rgba(92,51,23,0.5)",    gradient: "from-amber-950/30 to-stone-900/30" },
  caramel:        { color: "#C68642", glow: "rgba(198,134,66,0.4)",  gradient: "from-amber-400/20 to-orange-900/20" },
  "blue lagoon":  { color: "#00CED1", glow: "rgba(0,206,209,0.4)",   gradient: "from-cyan-400/20 to-teal-900/20" },
  "berry blast":  { color: "#8B0000", glow: "rgba(139,0,0,0.4)",     gradient: "from-red-900/20 to-purple-900/20" },
  "mango passion":{ color: "#FF8243", glow: "rgba(255,130,67,0.4)",  gradient: "from-orange-400/20 to-red-900/20" },
  tropical:       { color: "#00FA9A", glow: "rgba(0,250,154,0.4)",   gradient: "from-emerald-400/20 to-teal-900/20" },
  mojito:         { color: "#50C878", glow: "rgba(80,200,120,0.4)",  gradient: "from-green-400/20 to-teal-900/20" },
  rainbow:        { color: "#FF69B4", glow: "rgba(255,105,180,0.4)", gradient: "from-pink-400/20 to-purple-900/20" },
  seasonal:       { color: "#FFD700", glow: "rgba(255,215,0,0.4)",   gradient: "from-yellow-400/20 to-orange-900/20" },
  default:        { color: "#60A5FA", glow: "rgba(96,165,250,0.35)", gradient: "from-blue-400/20 to-indigo-900/20" },
};

function fc(key: string) {
  const k = key.toLowerCase();
  return (
    FLAVOR_COLORS[k] ||
    Object.entries(FLAVOR_COLORS).find(([fk]) => k.includes(fk))?.[1] ||
    FLAVOR_COLORS.default
  );
}

// ─── Image helpers ────────────────────────────────────────────────
const IMG = {
  popsicle:   "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&q=80",
  fruit:      "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=600&q=80",
  kulfi:      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80",
  scoop:      "https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=600&q=80",
  sandwich:   "https://images.unsplash.com/photo-1604537466608-109fa2f16c3b?w=600&q=80",
  shake:      "https://images.unsplash.com/photo-1541658016709-82535e94bc69?w=600&q=80",
  drink:      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&q=80",
  sundae:     "https://images.unsplash.com/photo-1567206563114-c179706b9b01?w=600&q=80",
  seasonal:   "https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?w=600&q=80",
  bulk:       "https://images.unsplash.com/photo-1488900128323-21503983a07e?w=600&q=80",
  chocolate:  "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=600&q=80",
  mango:      "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80",
  strawberry: "https://images.unsplash.com/photo-1560008581-09826d1de69e?w=600&q=80",
  vanilla:    "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600&q=80",
  mint:       "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=600&q=80",
};

function img(type: keyof typeof IMG) { return IMG[type]; }

// ─── Helper to build a product ────────────────────────────────────
let _id = 0;
function p(
  categoryId: string,
  name: string,
  desc: string,
  imageType: keyof typeof IMG,
  badge: Badge = null,
  rating = 4.5,
  tags: string[] = []
): Product {
  const colorKey = name.toLowerCase().replace(/\s+/g, " ");
  const { color, glow, gradient } = fc(colorKey);
  return {
    id: `${categoryId}-${++_id}`,
    name,
    category: "",   // filled by buildCategory
    categoryId,
    description: desc,
    color,
    glow,
    gradient,
    badge,
    rating,
    image: img(imageType),
    tags,
    visible: true,
  };
}

// ─────────────────────────────────────────────────────────────────
//  Category Definitions
// ─────────────────────────────────────────────────────────────────

// ─── Category definitions (inferred, cast on export) ────────────
const RAW_CATEGORIES = [
  {
    id: "milk-popsicles",
    name: "Premium Popsicle",
    icon: "🥛",
    description: "Experience the rich, creamy delight of our signature milk-based popsicles.",
    headerColor: "#60A5FA",
    products: [
      {
        id: "6a79c87b50a038a1e54aa529",
        name: "Berry Blast",
        categoryId: "milk-popsicles",
        description: "A refreshing burst of mixed berry goodness in every bite, blending deliciously sweet and tangy berry flavours into a vibrant, fruity popsicle. Cool, juicy, and irresistibly refreshing!",
        badge: "New",
        rating: 4.7,
        image: "",
        tags: [],
        visible: true,
        // computed properties
        ...fc("berry blast")
      },
      {
        id: "6a79c86650a038a1e54aa528",
        name: "Oreo Streak",
        categoryId: "milk-popsicles",
        description: "A creamy, indulgent popsicle swirled with the irresistible taste of Oreo cookies. Rich, crunchy, and delightfully chocolaty, delivering a perfect Oreo-inspired treat in every bite.",
        badge: "Best Seller",
        rating: 4.5,
        image: "",
        tags: [],
        visible: true,
        // computed properties
        ...fc("oreo streak")
      },
      {
        id: "6a79c7f450a038a1e54aa527",
        name: "Chocolate Brownie Magnum",
        categoryId: "milk-popsicles",
        description: "A rich and indulgent chocolate popsicle inspired by the classic Magnum, packed with luscious brownie flavour and deep chocolate goodness. Creamy, decadent, and irresistibly satisfying in every bite.",
        badge: "Best Seller",
        rating: 4.7,
        image: "https://res.cloudinary.com/pkdupslt/image/upload/v1786436023/frozen-fusion/products/Premium_Popsicle/t2vrkx1bf2dlqz1xypub.jpg",
        tags: ["popular"],
        visible: true,
        // computed properties
        ...fc("chocolate brownie magnum")
      },
      {
        id: "6a79c6d150a038a1e54aa526",
        name: "Coffee Almond Fudge Magnum",
        categoryId: "milk-popsicles",
        description: "A luxurious blend of rich coffee, roasted almonds, and indulgent fudge in a creamy Magnum-style popsicle. Bold, nutty, and irresistibly chocolaty—a perfect treat for coffee and chocolate lovers.",
        badge: "Popular",
        rating: 4.7,
        image: "https://res.cloudinary.com/pkdupslt/image/upload/v1786433119/frozen-fusion/products/Premium_Popsicle/ttpn8vtlhz8gd1pwpn24.jpg",
        tags: ["popular"],
        visible: true,
        // computed properties
        ...fc("coffee almond fudge magnum")
      },
      {
        id: "6a79c55950a038a1e54aa525",
        name: "Lotus Biscoff",
        categoryId: "milk-popsicles",
        description: "A creamy and indulgent popsicle infused with the irresistible caramelised flavour of Lotus Biscoff. Smooth, rich, and deliciously spiced, with the signature Biscoff taste in every bite.",
        badge: "New",
        rating: 4.9,
        image: "https://res.cloudinary.com/pkdupslt/image/upload/v1786426018/frozen-fusion/products/Premium_Popsicle/w8dstikp7y5zlrsrn2cp.jpg",
        tags: ["Best Seller"],
        visible: true,
        // computed properties
        ...fc("lotus biscoff")
      },
      {
        id: "6a78295970a892e9e4ae965a",
        name: "Belgium chocolate",
        categoryId: "milk-popsicles",
        description: "A rich and creamy chocolate popsicle crafted with the deep, luxurious flavour of Belgian chocolate. Smooth, indulgent, and intensely chocolaty—a decadent treat for true chocolate lovers.",
        badge: "Popular",
        rating: 4.5,
        image: "/products/Premium Milk Popsicles/1786259801485-2.png_2K_202608081310.jpeg",
        tags: ["popular","premium"],
        visible: true,
        // computed properties
        ...fc("belgium chocolate")
      }
    ],
  },
  {
    id: "kulfi",
    name: "Kulfi Varieties",
    icon: "🍨",
    description: "Traditional Indian kulfi in authentic and exotic fusion flavours.",
    headerColor: "#FBBF24",
    products: [
      {
        id: "6a79ca3350a038a1e54aa52c",
        name: "Malai Infused Pista Kulfi",
        categoryId: "kulfi",
        description: "Malai Infused Pista Kulfi Flavour",
        badge: "New",
        rating: 4.5,
        image: "",
        tags: [],
        visible: true,
        // computed properties
        ...fc("malai infused pista kulfi")
      },
      {
        id: "6a79ca1650a038a1e54aa52b",
        name: "Rose Gulkhaad Kulfi",
        categoryId: "kulfi",
        description: "Rose Gulkhand Kulfi Flavour",
        badge: null,
        rating: 4.5,
        image: "",
        tags: [],
        visible: true,
        // computed properties
        ...fc("rose gulkhaad kulfi")
      },
      {
        id: "6a79c9ed50a038a1e54aa52a",
        name: "Malai Kulfi",
        categoryId: "kulfi",
        description: "Malai Kulfi Flavour",
        badge: null,
        rating: 4.5,
        image: "",
        tags: [],
        visible: true,
        // computed properties
        ...fc("malai kulfi")
      }
    ],
  },
  {
    id: "fruit-shaped",
    name: "Viral Trending Dessert",
    icon: "🍉",
    description: "Fun, fruity, and incredibly delicious — shaped like real fruits!",
    headerColor: "#34D399",
    products: [
      {
        id: "6a79cb6750a038a1e54aa533",
        name: "Kutty Pops Tub",
        categoryId: "fruit-shaped",
        description: "A fun-filled tub packed with 10 delicious mini–Kutty Pops in assorted flavours. Perfectly sized, colourful, and bursting with flavour—great for sharing, parties, or enjoying a little bit of everything!",
        badge: null,
        rating: 4.7,
        image: "",
        tags: ["Premium"],
        visible: true,
        // computed properties
        ...fc("kutty pops tub")
      },
      {
        id: "6a79cb5750a038a1e54aa532",
        name: "Lemon Fruit Shaped Ice Cream",
        categoryId: "fruit-shaped",
        description: "Lemon Fruit Shaped Ice Cream",
        badge: null,
        rating: 4.5,
        image: "",
        tags: [],
        visible: true,
        // computed properties
        ...fc("lemon fruit shaped ice cream")
      },
      {
        id: "6a79cb4650a038a1e54aa531",
        name: "Mango Fruit Shaped Ice Cream",
        categoryId: "fruit-shaped",
        description: "Mango Fruit Shaped Ice Cream",
        badge: null,
        rating: 4.5,
        image: "",
        tags: [],
        visible: true,
        // computed properties
        ...fc("mango fruit shaped ice cream")
      }
    ],
  },
  {
    id: "scoops",
    name: "Classic Ice Creams",
    icon: "🍦",
    description: "Timeless classics made with premium ingredients and real dairy.",
    headerColor: "#F472B6",
    products: [
      {
        id: "6a79ccaa50a038a1e54aa53f",
        name: "Pulpy Mango",
        categoryId: "scoops",
        description: "A creamy and refreshing mango ice cream made with the rich, juicy flavour of ripe mango pulp. Smooth, fruity, and bursting with authentic mango goodness in every scoop.",
        badge: null,
        rating: 4.5,
        image: "",
        tags: [],
        visible: true,
        // computed properties
        ...fc("pulpy mango")
      },
      {
        id: "6a79cc9750a038a1e54aa53e",
        name: "Nut Butterscotch",
        categoryId: "scoops",
        description: "A rich and creamy butterscotch ice cream loaded with crunchy roasted nuts and irresistible caramelised notes. Smooth, nutty, and delightfully indulgent with a satisfying crunch in every scoop.",
        badge: null,
        rating: 4.5,
        image: "",
        tags: [],
        visible: true,
        // computed properties
        ...fc("nut butterscotch")
      },
      {
        id: "6a79cc8550a038a1e54aa53d",
        name: "Strawberry",
        categoryId: "scoops",
        description: "A smooth and creamy ice cream bursting with the fresh, fruity sweetness of ripe strawberries. Refreshing, luscious, and delightfully fruity—a timeless favourite in every scoop.",
        badge: null,
        rating: 4.5,
        image: "",
        tags: [],
        visible: true,
        // computed properties
        ...fc("strawberry")
      },
      {
        id: "6a79cc7750a038a1e54aa53c",
        name: "Vanilla",
        categoryId: "scoops",
        description: "A smooth and creamy classic with the delicate, aromatic flavour of premium vanilla. Rich, velvety, and perfectly balanced, making every scoop timelessly delicious.",
        badge: null,
        rating: 4.5,
        image: "",
        tags: [],
        visible: true,
        // computed properties
        ...fc("vanilla")
      }
    ],
  },
  {
    id: "sandwiches",
    name: "Ice Cream Sandwich & Slices",
    icon: "🍪",
    description: "Decadent ice cream sandwiched between premium cookies or cut into perfect slices.",
    headerColor: "#A78BFA",
    products: [
      {
        id: "6a79ca7b50a038a1e54aa52f",
        name: "Roasted Almond Caramel Pineapple Slices",
        categoryId: "sandwiches",
        description: "Juicy pineapple slices topped with rich caramel and crunchy roasted almonds, creating a delicious blend of sweet, tangy, nutty, and caramelised flavours. A refreshing yet indulgent frozen treat in every bite.",
        badge: "Best Seller",
        rating: 4.9,
        image: "",
        tags: [],
        visible: true,
        // computed properties
        ...fc("roasted almond caramel pineapple slices")
      },
      {
        id: "6a79853483d89583aa19b945",
        name: "Oreo Ice Cream Sandwich",
        categoryId: "sandwiches",
        description: "Rich and creamy cookies-and-cream ice cream packed with crunchy Oreo cookie pieces, perfectly sandwiched between two delicious chocolatey Oreo-style biscuits. Every bite brings together smooth creaminess, deep chocolate flavour, and the satisfying crunch of cookies.",
        badge: "Best Seller",
        rating: 4.9,
        image: "/products/Ice Cream Sandwiches/1786348851739-IMG_2110.PNG",
        tags: ["Premium"],
        visible: true,
        // computed properties
        ...fc("oreo ice cream sandwich")
      },
      {
        id: "6a79848a83d89583aa19b944",
        name: "Lotus Biscoff Ice Cream Sandwich",
        categoryId: "sandwiches",
        description: "Creamy Biscoff ice cream with crunchy caramelised biscuit pieces, sandwiched between two delicious Biscoff biscuits. A perfect harmony of creamy indulgence and irresistible crunch.",
        badge: "Best Seller",
        rating: 4.9,
        image: "/products/Ice Cream Sandwiches/1786348682940-IMG_2111.PNG",
        tags: ["Signature"],
        visible: true,
        // computed properties
        ...fc("lotus biscoff ice cream sandwich")
      }
    ],
  },
  {
    id: "shakes",
    name: "Thick Shakes",
    icon: "🥤",
    description: "Thick, creamy, and loaded with your favourite flavours.",
    headerColor: "#F87171",
    products: [
      {
        id: "6a79cb9d50a038a1e54aa536",
        name: "Lotus Biscoff Shakes",
        categoryId: "shakes",
        description: "A rich and creamy shake blended with the irresistible caramelised flavour of Lotus Biscoff biscuits. Smooth, indulgent, and delightfully crunchy—a perfect treat for every Biscoff lover.",
        badge: "Best Seller",
        rating: 4.9,
        image: "",
        tags: ["Signature"],
        visible: true,
        // computed properties
        ...fc("lotus biscoff shakes")
      },
      {
        id: "6a79cb9150a038a1e54aa535",
        name: "Chocolate Fantasy Shake",
        categoryId: "shakes",
        description: "A rich, creamy, and indulgent chocolate shake crafted for true chocolate lovers. Smooth, thick, and loaded with irresistible chocolate goodness in every sip.",
        badge: "Limited",
        rating: 4.9,
        image: "",
        tags: [],
        visible: true,
        // computed properties
        ...fc("chocolate fantasy shake")
      },
      {
        id: "6a79cb7d50a038a1e54aa534",
        name: "Oreo Shake",
        categoryId: "shakes",
        description: "A thick and creamy shake blended with the classic taste of Oreo cookies and rich vanilla goodness. Smooth, crunchy, and irresistibly indulgent—a delicious treat in every sip.",
        badge: "Popular",
        rating: 4.5,
        image: "",
        tags: [],
        visible: true,
        // computed properties
        ...fc("oreo shake")
      }
    ],
  },
  {
    id: "fusion-drinks",
    name: "Fusion Drinks",
    icon: "🍹",
    description: "Refreshing, exotic mocktails and fusion beverages.",
    headerColor: "#38BDF8",
    products: [
      {
        id: "6a79cc0750a038a1e54aa53b",
        name: "Blue Moon Mojito",
        categoryId: "fusion-drinks",
        description: "Blue Moon Mojito",
        badge: null,
        rating: 4.5,
        image: "",
        tags: [],
        visible: true,
        // computed properties
        ...fc("blue moon mojito")
      },
      {
        id: "6a79cbf650a038a1e54aa53a",
        name: "Electric Fizz Mojito",
        categoryId: "fusion-drinks",
        description: "Electric Fizz Mojito",
        badge: null,
        rating: 4.5,
        image: "",
        tags: [],
        visible: true,
        // computed properties
        ...fc("electric fizz mojito")
      },
      {
        id: "6a79cbe450a038a1e54aa539",
        name: "Mint Mojito",
        categoryId: "fusion-drinks",
        description: "Mint Mojito",
        badge: null,
        rating: 4.5,
        image: "",
        tags: [],
        visible: true,
        // computed properties
        ...fc("mint mojito")
      }
    ],
  },
  {
    id: "sundaes",
    name: "Desserts",
    icon: "🍧",
    description: "Over-the-top sundaes loaded with toppings and pure joy.",
    headerColor: "#FBBF24",
    products: [
      {
        id: "6a79cbcb50a038a1e54aa538",
        name: "Falooda",
        categoryId: "sundaes",
        description: "Falooda",
        badge: null,
        rating: 4.5,
        image: "",
        tags: [],
        visible: true,
        // computed properties
        ...fc("falooda")
      },
      {
        id: "6a79cbaf50a038a1e54aa537",
        name: "Chocolate Kalakki",
        categoryId: "sundaes",
        description: "Chocolate Kalakki",
        badge: null,
        rating: 4.9,
        image: "",
        tags: [],
        visible: true,
        // computed properties
        ...fc("chocolate kalakki")
      }
    ],
  },
  {
    id: "seasonal",
    name: "Premium Ice Cream",
    icon: "❄️",
    description: "Limited-time masterpieces crafted for each season and festival.",
    headerColor: "#A78BFA",
    products: [
      {
        id: "6a79cd3e50a038a1e54aa546",
        name: "Tiramisu",
        categoryId: "seasonal",
        description: "A rich and indulgent Italian-inspired ice cream layered with creamy coffee flavour and delicate cocoa notes. Smooth, velvety, and irresistibly delicious—a perfect treat for every tiramisu lover.",
        badge: "Limited",
        rating: 4.8,
        image: "",
        tags: [],
        visible: true,
        // computed properties
        ...fc("tiramisu")
      },
      {
        id: "6a79cd2e50a038a1e54aa545",
        name: "Red Velvet",
        categoryId: "seasonal",
        description: "A luxurious, creamy ice cream inspired by the classic red velvet cake, with rich cocoa notes and a smooth, velvety texture. Decadent, indulgent, and deliciously satisfying in every scoop.",
        badge: "Limited",
        rating: 4.5,
        image: "",
        tags: ["Premium"],
        visible: true,
        // computed properties
        ...fc("red velvet")
      },
      {
        id: "6a79cd1c50a038a1e54aa544",
        name: "Lychee",
        categoryId: "seasonal",
        description: "A refreshing and creamy ice cream infused with the delicate, juicy sweetness of ripe lychee. Light, fruity, and irresistibly refreshing—perfect for a deliciously tropical treat.",
        badge: "Popular",
        rating: 4.5,
        image: "",
        tags: ["Premium"],
        visible: true,
        // computed properties
        ...fc("lychee")
      },
      {
        id: "6a79cd0e50a038a1e54aa543",
        name: "Cotton Candy",
        categoryId: "seasonal",
        description: "A fun and dreamy ice cream bursting with the sweet, nostalgic flavour of classic cotton candy. Creamy, colourful, and delightfully playful—a magical treat for kids and the young at heart.",
        badge: "Popular",
        rating: 4.5,
        image: "",
        tags: ["Premium"],
        visible: true,
        // computed properties
        ...fc("cotton candy")
      },
      {
        id: "6a79ccf750a038a1e54aa542",
        name: "Chocolate Fantasy",
        categoryId: "seasonal",
        description: "A rich and indulgent chocolate ice cream crafted for true chocolate lovers. Creamy, smooth, and intensely chocolaty, delivering a decadent burst of chocolate goodness in every scoop.",
        badge: "Limited",
        rating: 4.9,
        image: "",
        tags: ["Exotic"],
        visible: true,
        // computed properties
        ...fc("chocolate fantasy")
      },
      {
        id: "6a79ccda50a038a1e54aa541",
        name: "Black Forest",
        categoryId: "seasonal",
        description: "A rich and indulgent ice cream inspired by the classic Black Forest cake, combining luscious chocolate, sweet cherry flavours, and creamy goodness in every scoop. A decadent dessert for every chocolate lover",
        badge: "Popular",
        rating: 4.8,
        image: "",
        tags: [],
        visible: true,
        // computed properties
        ...fc("black forest")
      },
      {
        id: "6a79ccc850a038a1e54aa540",
        name: "Black Currant",
        categoryId: "seasonal",
        description: "A creamy and refreshing ice cream bursting with the rich, tangy-sweet flavour of black currants. Smooth, fruity, and irresistibly refreshing—a perfect balance of bold berry flavour and creamy indulgence.",
        badge: "Popular",
        rating: 4.5,
        image: "",
        tags: [],
        visible: true,
        // computed properties
        ...fc("black currant")
      }
    ],
  },
  {
    id: "bulk",
    name: "Signature Ice Cream",
    icon: "🍨",
    description: "Premium family-pack tubs — perfect for gatherings and celebrations.",
    headerColor: "#60A5FA",
    products: [
      {
        id: "6a79cdcd50a038a1e54aa54d",
        name: "White Chocolate Raspberry",
        categoryId: "bulk",
        description: "A luxurious blend of creamy white chocolate and the vibrant, tangy sweetness of raspberries. Smooth, rich, and delightfully fruity, creating a perfect balance of indulgence and freshness in every scoop.",
        badge: "Best Seller",
        rating: 4.9,
        image: "",
        tags: [],
        visible: true,
        // computed properties
        ...fc("white chocolate raspberry")
      },
      {
        id: "6a79cdbb50a038a1e54aa54c",
        name: "Royal Fruits and Nuts",
        categoryId: "bulk",
        description: "A rich and creamy indulgence loaded with a delicious medley of premium fruits and crunchy nuts. Bursting with texture, flavour, and royal richness in every scoop—truly fit for a king!",
        badge: "Best Seller",
        rating: 4.5,
        image: "",
        tags: [],
        visible: true,
        // computed properties
        ...fc("royal fruits and nuts")
      },
      {
        id: "6a79cda750a038a1e54aa54b",
        name: "Roasted Almond Pineapple Caramel",
        categoryId: "bulk",
        description: "A luxurious blend of roasted almonds, juicy pineapple, and rich caramel swirled into creamy ice cream. Sweet, nutty, fruity, and irresistibly indulgent—a delightful combination of flavours and textures in every scoop.",
        badge: "Best Seller",
        rating: 4.9,
        image: "",
        tags: [],
        visible: true,
        // computed properties
        ...fc("roasted almond pineapple caramel")
      },
      {
        id: "6a79cd8f50a038a1e54aa54a",
        name: "Meetha Paan",
        categoryId: "bulk",
        description: "A unique Indian-inspired ice cream infused with the refreshing flavours of traditional meetha paan, with delicate notes of betel leaf, sweet fennel, and aromatic spices. Creamy, refreshing, and delightfully indulgent in every scoop",
        badge: null,
        rating: 4.5,
        image: "",
        tags: [],
        visible: true,
        // computed properties
        ...fc("meetha paan")
      },
      {
        id: "6a79cd7d50a038a1e54aa549",
        name: "Lotus Biscoff",
        categoryId: "bulk",
        description: "A rich and creamy ice cream infused with the irresistible caramelised flavour of Lotus Biscoff biscuits. Smooth, crunchy, and delightfully indulgent, with warm spiced notes in every scoop.",
        badge: "Best Seller",
        rating: 4.5,
        image: "",
        tags: [],
        visible: true,
        // computed properties
        ...fc("lotus biscoff")
      },
      {
        id: "6a79cd6650a038a1e54aa548",
        name: "Chocolate Almond Fudge",
        categoryId: "bulk",
        description: "A rich and creamy chocolate ice cream loaded with crunchy roasted almonds and luscious fudge swirls. Decadent, nutty, and intensely chocolaty—a heavenly treat for true chocolate lovers.",
        badge: "Best Seller",
        rating: 4.9,
        image: "",
        tags: [],
        visible: true,
        // computed properties
        ...fc("chocolate almond fudge")
      },
      {
        id: "6a79cd5350a038a1e54aa547",
        name: "Blueberry Cheesecake",
        categoryId: "bulk",
        description: "A creamy cheesecake-inspired ice cream swirled with luscious blueberry flavour and delicate biscuit notes. Rich, tangy, fruity, and irresistibly indulgent in every scoop.",
        badge: "Best Seller",
        rating: 4.9,
        image: "",
        tags: [],
        visible: true,
        // computed properties
        ...fc("blueberry cheesecake")
      }
    ],
  }
];

// ─── Attach category name and export ─────────────────────────────
export const CATEGORIES: Category[] = RAW_CATEGORIES.map((cat) => ({
  ...cat,
  products: (cat.products as Omit<Product, "category">[]).map((prod) => ({
    ...prod,
    category: cat.name,
  })) as Product[],
})) as Category[];

export const ALL_PRODUCTS: Product[] = CATEGORIES.flatMap((c) => c.products);

export const BADGE_OPTIONS: Badge[] = ["Best Seller", "New", "Limited", "Popular", null];

export const CATEGORY_IDS = CATEGORIES.map((c) => c.id);
