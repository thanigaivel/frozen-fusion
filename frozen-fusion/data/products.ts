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
    description: "Rich, creamy milk-based popsicles in decadent flavours.",
    headerColor: "#60A5FA",
    products: [
      p("milk-popsicles", "Vanilla",         "Classic creamy vanilla with sweet milky notes.",        "popsicle", "Best Seller", 4.8, ["classic","mild"]),
      p("milk-popsicles", "Chocolate",       "Rich Belgian cocoa swirled in pure cream milk.",         "chocolate","Best Seller", 4.9, ["rich","popular"]),
      p("milk-popsicles", "Strawberry",      "Fresh strawberry puree in a velvety milk base.",         "strawberry",null,          4.5, ["fruity","mild"]),
      p("milk-popsicles", "Mango",           "Alphonso mango blended with premium milk.",              "mango",   "Best Seller", 4.8, ["fruity","popular"]),
      p("milk-popsicles", "Butterscotch",    "Caramel-toffee swirl with a buttery cream finish.",      "popsicle", null,          4.6, ["sweet","caramel"]),
      p("milk-popsicles", "Kesar Pista",     "Royal saffron and pistachio in a luxe milk popsicle.",  "kulfi",   "Popular",     4.9, ["exotic","premium"]),
      p("milk-popsicles", "Black Currant",   "Tart black currant with a velvet cream base.",           "fruit",    null,          4.4, ["tart","bold"]),
      p("milk-popsicles", "Coffee",          "Double espresso and cream — a pick-me-up popsicle.",     "popsicle", "New",         4.6, ["bold","coffee"]),
      p("milk-popsicles", "Tender Coconut",  "Fresh tender coconut water and cream in every bite.",    "popsicle", null,          4.5, ["refreshing","light"]),
      p("milk-popsicles", "Badam Milk",      "Almond-infused warm spiced milk, now frozen to perfection.", "kulfi", null,         4.7, ["nutty","premium"]),
    ],
  },

  {
    id: "kulfi",
    name: "Kulfi Varieties",
    icon: "🍨",
    description: "Authentic Indian kulfi with premium ingredients and exotic spices.",
    headerColor: "#D4AF37",
    products: [
      p("kulfi", "Malai Kulfi",      "The original. Dense milk with a clotted cream crown.",        "kulfi",    "Best Seller", 5.0, ["classic","premium"]),
      p("kulfi", "Kesar Pista",      "Saffron threads and crushed pistachio — regal indulgence.",   "kulfi",    "Best Seller", 4.9, ["exotic","premium"]),
      p("kulfi", "Badam",            "Pure almond milk kulfi slow-frozen to silky perfection.",      "kulfi",    "Popular",     4.8, ["nutty","premium"]),
      p("kulfi", "Mango Kulfi",      "Alphonso mango meets the old-world kulfi tradition.",          "mango",    "Seasonal",   4.8, ["fruity","popular"]),
      p("kulfi", "Rose",             "Damask rose water and saffron, a Mughal-inspired kulfi.",      "kulfi",    "New",         4.6, ["floral","exotic"]),
      p("kulfi", "Elaichi",          "Green cardamom and pistachio in a creamy frozen stick.",       "kulfi",    null,          4.7, ["spiced","classic"]),
      p("kulfi", "Chocolate Kulfi",  "Dark chocolate fused with dense kulfi — a bold union.",        "chocolate",null,          4.7, ["rich","bold"]),
      p("kulfi", "Rabdi Kulfi",      "Slow-cooked reduced milk with cardamom and rose.",             "kulfi",    "Limited",    4.9, ["premium","exotic"]),
    ],
  },
  {
    id: "fruit-shaped",
    name: "Fruit Shaped Ice Cream",
    icon: "🍉",
    description: "Whimsical fruit-shaped ice creams that delight the eyes and the palate.",
    headerColor: "#4ADE80",
    products: [
      p("fruit-shaped", "Mango Shape",       "Mango-flavored ice shaped like a perfect mango.",         "mango",    "Best Seller", 4.8, ["fun","fruity"]),
      p("fruit-shaped", "Watermelon Shape",  "Watermelon cream shaped as a mini watermelon slice.",     "fruit",    "Popular",     4.7, ["fun","summer"]),
      p("fruit-shaped", "Orange Shape",      "Orange sorbet in a perfectly sculpted orange form.",       "fruit",    null,          4.5, ["fun","citrus"]),
      p("fruit-shaped", "Lemon Shape",       "Tangy lemon cream in a cute lemon-shaped shell.",          "fruit",    null,          4.4, ["fun","citrus"]),
      p("fruit-shaped", "Pineapple Shape",   "Tropical pineapple cream in a sculpted pineapple.",       "fruit",    "New",         4.5, ["fun","tropical"]),
      p("fruit-shaped", "Strawberry Shape",  "Strawberry cream in a lifelike strawberry shape.",         "strawberry",null,          4.6, ["fun","sweet"]),
      p("fruit-shaped", "Kiwi Shape",        "Kiwi ice cream with real kiwi seeds — strikingly real.",  "fruit",    "New",         4.7, ["fun","exotic"]),
      p("fruit-shaped", "Coconut Shape",     "Tender coconut cream in a half-coconut shell form.",       "fruit",    null,          4.5, ["fun","tropical"]),
    ],
  },
  {
    id: "scoops",
    name: "Classic Ice Creams",
    icon: "🍦",
    description: "Dense, rich hand-crafted scoops in 15 premium flavours.",
    headerColor: "#F472B6",
    products: [
      p("scoops", "Belgian Chocolate",       "Single-origin Belgian dark chocolate — pure decadence.",   "chocolate","Best Seller", 5.0, ["rich","bold","popular"]),
      p("scoops", "Vanilla Bean",            "Madagascar vanilla bean flecks in velvety cream.",          "vanilla",  "Best Seller", 4.8, ["classic","mild"]),
      p("scoops", "Strawberry",              "Fresh strawberry ripple swirled through cream.",             "strawberry","Popular",    4.6, ["fruity","sweet"]),
      p("scoops", "Black Currant",           "Bold black currant coulis in premium ice cream.",            "scoop",    null,          4.5, ["tart","bold"]),
      p("scoops", "Mango",                   "Alphonso mango from Ratnagiri, churned to perfection.",      "mango",    "Best Seller", 4.8, ["fruity","popular"]),
      p("scoops", "Pistachio",               "Iranian pistachio — rich, nutty, and brilliantly green.",    "scoop",    "Popular",     4.7, ["nutty","premium"]),
      p("scoops", "Cookies & Cream",         "Crushed dark cookies swirled in pure vanilla cream.",        "scoop",    "Best Seller", 4.9, ["popular","sweet"]),
      p("scoops", "Butterscotch",            "Caramel praline and rich buttery cream — irresistible.",     "scoop",    null,          4.6, ["sweet","caramel"]),
      p("scoops", "Coffee",                  "Cold brew concentrate blended with pure cream.",             "scoop",    "Popular",     4.7, ["bold","coffee"]),
      p("scoops", "Mint Chocolate",          "Cool peppermint cream laced with dark chocolate chips.",     "mint",     "New",         4.6, ["refreshing","popular"]),
      p("scoops", "Blueberry Cheesecake",    "Wild blueberry compote over a cream cheese base.",           "scoop",    "New",         4.8, ["fruity","premium"]),
      p("scoops", "Salted Caramel",          "Sea-salted caramel ribbons through silky cream.",            "scoop",    "Popular",     4.9, ["premium","sweet"]),
      p("scoops", "Cotton Candy",            "Fairground spun sugar aroma in a pastel pink scoop.",        "scoop",    null,          4.3, ["sweet","fun"]),
      p("scoops", "Bubblegum",               "Nostalgic bubblegum with a sky-blue pastel hue.",            "scoop",    null,          4.2, ["fun","sweet"]),
      p("scoops", "Tender Coconut",          "Pure fresh coconut water and flesh in every spoonful.",       "scoop",    "Best Seller", 4.7, ["refreshing","natural"]),
    ],
  },
  {
    id: "sandwiches",
    name: "Ice Cream Sandwich & Slices",
    icon: "🍪",
    description: "Creamy ice cream sandwiched between premium wafers and cookies.",
    headerColor: "#A78BFA",
    products: [
      p("sandwiches", "Vanilla",         "Classic vanilla cream between crisp golden wafers.",         "sandwich", "Best Seller", 4.8, ["classic","popular"]),
      p("sandwiches", "Chocolate",       "Rich chocolate between dark cocoa wafer cookies.",            "chocolate","Best Seller", 4.9, ["rich","popular"]),
      p("sandwiches", "Cookies & Cream", "Oreo-style cookies with vanilla cream — doubly delicious.",  "sandwich", "Popular",     4.8, ["sweet","popular"]),
      p("sandwiches", "Strawberry",      "Strawberry ripple cream between strawberry wafers.",          "strawberry",null,          4.5, ["fruity","sweet"]),
      p("sandwiches", "Coffee",          "Cold brew ice cream in espresso-dusted dark wafers.",         "sandwich", "New",         4.6, ["bold","coffee"]),
      p("sandwiches", "Butterscotch",    "Butterscotch cream in a toffee-coated wafer shell.",          "sandwich", null,          4.5, ["sweet","caramel"]),
    ],
  },
  {
    id: "shakes",
    name: "Thick Shakes",
    icon: "🥤",
    description: "Impossibly thick, luxuriously creamy shakes you have to taste to believe.",
    headerColor: "#67E8F9",
    products: [
      p("shakes", "Chocolate Shake",    "Four scoops of Belgian chocolate spun into pure silk.",     "shake",     "Best Seller", 5.0, ["rich","popular"]),
      p("shakes", "Oreo Shake",         "Crushed Oreos blended with vanilla cream and milk.",          "shake",     "Best Seller", 4.9, ["popular","sweet"]),
      p("shakes", "KitKat Shake",       "Chunky KitKat pieces in a hazelnut chocolate shake.",         "shake",     "Popular",     4.8, ["sweet","popular"]),
      p("shakes", "Vanilla Shake",      "Pure Madagascar vanilla in a thick, airy cream shake.",       "vanilla",   null,          4.6, ["classic","mild"]),
      p("shakes", "Strawberry Shake",   "Ripe strawberries blended with strawberry ice cream.",         "strawberry","Popular",     4.7, ["fruity","sweet"]),
      p("shakes", "Mango Shake",        "Thick Alphonso mango with cream — no filler, pure fruit.",    "mango",     "Best Seller", 4.8, ["fruity","popular"]),
      p("shakes", "Coffee Shake",       "Triple espresso with coffee ice cream and cold milk.",          "shake",     "New",         4.7, ["bold","coffee"]),
      p("shakes", "Butterscotch Shake", "Golden butterscotch blended with toffee bits and cream.",      "shake",     null,          4.6, ["sweet","caramel"]),
      p("shakes", "Caramel Shake",      "Sea-salted caramel swirled through thick cream — divine.",     "shake",     "Popular",     4.7, ["premium","sweet"]),
      p("shakes", "Brownie Shake",      "Warm brownie chunks blended into a thick chocolate shake.",    "shake",     "Limited",     4.9, ["premium","popular"]),
    ],
  },
  {
    id: "fusion-drinks",
    name: "Fusion Drinks",
    icon: "🍹",
    description: "Innovative beverage creations that blur the line between drink and dessert.",
    headerColor: "#34D399",
    products: [
      p("fusion-drinks", "Blue Lagoon",          "Electric blue curacao with citrus soda and mint ice.",   "drink",  "Best Seller", 4.8, ["refreshing","popular"]),
      p("fusion-drinks", "Berry Blast",           "Mixed berry smoothie with soda and berry sorbet.",        "drink",  "Popular",     4.7, ["fruity","bold"]),
      p("fusion-drinks", "Mango Passion",         "Mango puree with passion fruit and sparkling water.",     "mango",  "Best Seller", 4.9, ["tropical","popular"]),
      p("fusion-drinks", "Tropical Fusion",       "Pineapple, coconut, and mango — the ultimate trio.",      "drink",  null,          4.6, ["tropical","fruity"]),
      p("fusion-drinks", "Strawberry Lemonade",   "Fresh strawberry over tangy lemonade with ice.",          "strawberry","Popular",   4.7, ["citrus","sweet"]),
      p("fusion-drinks", "Mint Mojito",            "Fresh mint, lime, soda — a booze-free tropical classic.", "mint",  "New",         4.6, ["refreshing","tangy"]),
      p("fusion-drinks", "Pineapple Punch",        "Tropical pineapple with a fizzy punch of citrus.",       "drink",  null,          4.5, ["tropical","tangy"]),
      p("fusion-drinks", "Orange Spark",           "Fresh orange with a sparkling citrus kick.",              "drink",  null,          4.4, ["citrus","refreshing"]),
      p("fusion-drinks", "Kiwi Splash",            "Kiwi and lime soda with ice cream floats.",               "drink",  "New",         4.6, ["fruity","tangy"]),
      p("fusion-drinks", "Rainbow Fusion",         "Six fruit layers in a glass — as bold as it looks.",      "drink",  "Limited",     4.8, ["fun","premium"]),
    ],
  },
  {
    id: "sundaes",
    name: "Desserts",
    icon: "🍧",
    description: "Layered sundaes piled high with premium toppings and luxury sauces.",
    headerColor: "#F97316",
    products: [
      p("sundaes", "Chocolate Sundae",   "Three scoops drowned in dark chocolate sauce and nuts.",    "sundae",   "Best Seller", 5.0, ["rich","popular"]),
      p("sundaes", "Brownie Sundae",     "Warm brownie base with vanilla and hot fudge topping.",     "sundae",   "Best Seller", 4.9, ["premium","popular"]),
      p("sundaes", "Strawberry Sundae",  "Strawberry ice cream with fresh berry coulis and cream.",   "sundae",   "Popular",     4.7, ["fruity","sweet"]),
      p("sundaes", "Oreo Sundae",        "Vanilla base topped with crushed Oreos and fudge drizzle.", "sundae",   null,          4.8, ["popular","sweet"]),
      p("sundaes", "Caramel Sundae",     "Salted caramel sauce over butterscotch scoops.",            "sundae",   null,          4.7, ["sweet","caramel"]),
      p("sundaes", "Mango Sundae",       "Mango sorbet with mango coulis and toasted coconut.",        "mango",    "Seasonal",   4.7, ["fruity","tropical"]),
      p("sundaes", "Triple Chocolate",   "Dark, milk, and white chocolate in three-scoop glory.",     "chocolate","Best Seller", 4.9, ["rich","bold"]),
      p("sundaes", "Nuts Delight",       "Three scoops buried under praline, almonds, and toffee.",   "sundae",   null,          4.6, ["nutty","premium"]),
      p("sundaes", "Banana Split",       "The classic: two banana halves, three scoops, triple sauce.", "sundae",   "Popular",    4.8, ["classic","popular"]),
      p("sundaes", "Royal Sundae",       "Our most decadent creation with gold-dusted saffron cream.",  "sundae",  "Limited",     5.0, ["premium","exotic"]),
    ],
  },
  {
    id: "seasonal",
    name: "Premium Ice Cream",
    icon: "❄️",
    description: "Limited-time masterpieces crafted for each season and festival.",
    headerColor: "#A78BFA",
    products: [
      p("seasonal", "Mango Fiesta",           "Summer's crown jewel — pure Ratnagiri Alphonso mango.",    "mango",   "Seasonal",   4.9, ["summer","limited"]),
      p("seasonal", "Watermelon Chill",       "Cool, juicy watermelon to beat the summer heat.",           "fruit",   "Seasonal",   4.7, ["summer","refreshing"]),
      p("seasonal", "Coconut Bliss",          "Fresh tender coconut sorbet — cool and tropical.",           "fruit",   "Seasonal",   4.6, ["summer","natural"]),
      p("seasonal", "Hot Chocolate Float",    "Warm dark chocolate poured over vanilla ice cream.",         "chocolate","Limited",    4.8, ["winter","premium"]),
      p("seasonal", "Coffee Crunch",          "Espresso ice cream with a toffee crunch layer.",             "seasonal","Limited",    4.7, ["winter","bold"]),
      p("seasonal", "Diwali Delight",         "Kesar, rose, and pistachio — a festive trio.",               "kulfi",   "Limited",    5.0, ["festival","premium"]),
      p("seasonal", "Christmas Berry",        "Red velvet with white chocolate and cranberry swirl.",        "seasonal","Limited",    4.8, ["festival","sweet"]),
      p("seasonal", "New Year Celebration",   "Gold-dusted champagne sorbet — pop the new year in style.", "seasonal","Limited",    4.9, ["festival","exotic"]),
    ],
  },
  {
    id: "bulk",
    name: "Signature Ice Cream",
    icon: "🍨",
    description: "Premium family-pack tubs — perfect for gatherings and celebrations.",
    headerColor: "#60A5FA",
    products: [
      p("bulk", "Vanilla",          "The classic family favourite in a generous 4-litre tub.",    "vanilla",   "Best Seller", 4.8, ["classic","family"]),
      p("bulk", "Chocolate",        "Rich Belgian chocolate for the whole family to share.",       "chocolate", "Best Seller", 4.9, ["rich","popular"]),
      p("bulk", "Strawberry",       "Fresh strawberry ripple in a vibrant family-pack tub.",       "strawberry","Popular",     4.6, ["fruity","family"]),
      p("bulk", "Mango",            "Alphonso mango — the bestselling bulk flavour.",               "mango",     "Best Seller", 4.9, ["fruity","popular"]),
      p("bulk", "Butterscotch",     "Golden butterscotch in a caramel-swirled tub.",               "bulk",      null,          4.5, ["sweet","family"]),
      p("bulk", "Black Currant",    "Bold black currant in a deep purple family-pack.",             "bulk",      null,          4.4, ["tart","bold"]),
      p("bulk", "Pistachio",        "Roasted pistachio in a premium 4-litre pack.",                 "bulk",      "Popular",     4.7, ["nutty","premium"]),
      p("bulk", "Cookies & Cream",  "Family favourite: vanilla cream with crushed cookies.",        "bulk",      "Best Seller", 4.8, ["popular","sweet"]),
      p("bulk", "Tender Coconut",   "Fresh tender coconut — a tropical treat in bulk.",             "bulk",      null,          4.6, ["natural","refreshing"]),
    ],
  },
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
