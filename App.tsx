import { useState, useMemo } from "react";
import {
  LayoutDashboard, User, SlidersHorizontal, Sparkles,
  CalendarDays, Droplets, Wind, BookOpen, Search,
  ChevronRight, Check, ArrowRight, ChevronLeft,
  Clock, Info, Flame, Star, Leaf, Edit2,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

interface StudentProfile {
  name: string;
  year: string;
  college: string;
  living: string;
}

interface StudentPrefs {
  diet: string;
  budget: string;
  prepTime: string;
  activity: string;
  cuisines: string[];
  allergies: string[];
  likes: string;
  dislikes: string;
  goal: string;
  mealStyle: string;
}

interface FoodRec {
  id: string;
  name: string;
  category: string;
  emoji: string;
  dietTypes: string[];
  budgetLevels: string[];
  prepLevels: string[];
  nutrients: string[];
  skinBenefit: string;
  hairBenefit: string;
  costEst: string;
  prepMin: number;
  tags: string[];
  reason: string;
}

// ── Data ───────────────────────────────────────────────────────────────────────

const FOOD_RECS: FoodRec[] = [
  {
    id: "r1", name: "Overnight Oats", category: "Breakfast", emoji: "🥣",
    dietTypes: ["veg", "vegan"], budgetLevels: ["tight", "moderate", "flexible"], prepLevels: ["minimal", "moderate", "ample"],
    nutrients: ["Complex Carbs", "Fiber", "B-Vitamins", "Iron"], skinBenefit: "Zinc controls sebum and reduces breakouts", hairBenefit: "Iron strengthens hair follicles and prevents fall",
    costEst: "₹30–50", prepMin: 5, tags: ["no-cook", "meal-prep", "hostel-friendly"],
    reason: "Prep the night before in under 5 minutes. Oats release energy slowly, keeping you focused through morning lectures without crashing.",
  },
  {
    id: "r2", name: "Peanut Butter Banana Toast", category: "Breakfast", emoji: "🍞",
    dietTypes: ["veg", "vegan"], budgetLevels: ["tight", "moderate"], prepLevels: ["minimal", "moderate", "ample"],
    nutrients: ["Protein", "Potassium", "Healthy Fats", "B6"], skinBenefit: "Vitamin E in peanuts protects skin from oxidative stress", hairBenefit: "Biotin in peanuts promotes hair thickness and growth",
    costEst: "₹25–45", prepMin: 5, tags: ["quick", "protein-rich", "filling"],
    reason: "High protein and healthy fats suppress hunger between lectures. Zero cooking — just spread, slice, and go.",
  },
  {
    id: "r3", name: "Dal Tadka with Rice", category: "Lunch", emoji: "🍛",
    dietTypes: ["veg", "vegan"], budgetLevels: ["tight", "moderate"], prepLevels: ["moderate", "ample"],
    nutrients: ["Plant Protein", "Fiber", "Iron", "Folate"], skinBenefit: "Turmeric in dal has potent anti-inflammatory effects on skin", hairBenefit: "Iron in dal directly combats deficiency-related hair fall",
    costEst: "₹40–70", prepMin: 25, tags: ["classic", "complete-protein", "balanced"],
    reason: "Dal and rice together form a complete protein — something most students miss. Budget-friendly and nutritionally one of the best meals you can eat.",
  },
  {
    id: "r4", name: "Sprouts Chaat", category: "Snack", emoji: "🫘",
    dietTypes: ["veg", "vegan"], budgetLevels: ["tight", "moderate"], prepLevels: ["minimal", "moderate"],
    nutrients: ["Vitamin C", "Plant Protein", "Fiber", "Zinc"], skinBenefit: "Vitamin C boosts collagen synthesis for firm, bright skin", hairBenefit: "Zinc prevents scalp inflammation and follicle thinning",
    costEst: "₹20–35", prepMin: 5, tags: ["no-cook", "high-protein", "quick"],
    reason: "Soaked sprouts pack more nutrients than cooked legumes and need zero cooking. A 5-minute snack that beats any packaged chips.",
  },
  {
    id: "r5", name: "Poha with Peanuts", category: "Breakfast", emoji: "🍽️",
    dietTypes: ["veg"], budgetLevels: ["tight", "moderate"], prepLevels: ["minimal", "moderate"],
    nutrients: ["Carbohydrates", "Iron", "Vitamin B1", "Protein"], skinBenefit: "Niacin in peanuts helps maintain the skin moisture barrier", hairBenefit: "Iron in poha combats anemia-related hair loss",
    costEst: "₹20–40", prepMin: 15, tags: ["light", "hostel-friendly", "traditional"],
    reason: "Light yet satisfying — great before morning classes. Easy to cook in a hostel kitchen and kinder on the stomach than heavy parathas.",
  },
  {
    id: "r6", name: "Chicken Rice Bowl", category: "Lunch", emoji: "🍗",
    dietTypes: ["nonveg"], budgetLevels: ["moderate", "flexible"], prepLevels: ["moderate", "ample"],
    nutrients: ["Complete Protein", "B12", "Iron", "Zinc"], skinBenefit: "Complete protein fuels collagen repair and skin cell renewal", hairBenefit: "B12 and zinc directly power hair follicle cell division",
    costEst: "₹80–120", prepMin: 25, tags: ["high-protein", "gym-friendly", "satisfying"],
    reason: "For active students, lean chicken protein speeds up recovery and sustains energy through long study sessions. Zinc supports both skin and hair.",
  },
  {
    id: "r7", name: "Fruit & Yogurt Bowl", category: "Breakfast", emoji: "🍓",
    dietTypes: ["veg"], budgetLevels: ["moderate", "flexible"], prepLevels: ["minimal"],
    nutrients: ["Probiotics", "Vitamin C", "Calcium", "Antioxidants"], skinBenefit: "Probiotics balance gut microbiome — directly linked to clearer skin", hairBenefit: "Biotin in yogurt is essential for keratin production",
    costEst: "₹50–80", prepMin: 5, tags: ["refreshing", "gut-health", "no-cook"],
    reason: "Gut health is the foundation of clear skin and strong hair. This delivers probiotics, antioxidants, and quick energy — all in one bowl.",
  },
  {
    id: "r8", name: "Moong Dal Cheela", category: "Breakfast", emoji: "🫓",
    dietTypes: ["veg", "vegan"], budgetLevels: ["tight", "moderate"], prepLevels: ["moderate", "ample"],
    nutrients: ["Plant Protein", "Fiber", "Folate", "Magnesium"], skinBenefit: "Folate helps repair skin cell DNA damage from sun exposure", hairBenefit: "Magnesium activates enzymes critical to the hair growth cycle",
    costEst: "₹25–45", prepMin: 20, tags: ["high-protein", "savory", "healthy"],
    reason: "Far more nutritious than parathas. A savory high-protein crepe that keeps you full until lunch — ideal for students who dislike sweet breakfasts.",
  },
  {
    id: "r9", name: "Rajma Chawal", category: "Lunch", emoji: "🥘",
    dietTypes: ["veg", "vegan"], budgetLevels: ["tight", "moderate"], prepLevels: ["moderate", "ample"],
    nutrients: ["Plant Protein", "Iron", "Fiber", "Potassium"], skinBenefit: "Antioxidants in kidney beans neutralise free radicals that age skin", hairBenefit: "Folate and iron address common deficiencies that cause hair fall",
    costEst: "₹45–70", prepMin: 30, tags: ["comfort-food", "filling", "complete"],
    reason: "A beloved comfort meal with excellent nutrition. One bowl covers a large portion of your daily protein and iron — both crucial for student wellness.",
  },
  {
    id: "r10", name: "Tuna Sandwich", category: "Lunch", emoji: "🥪",
    dietTypes: ["nonveg"], budgetLevels: ["moderate", "flexible"], prepLevels: ["minimal", "moderate"],
    nutrients: ["Complete Protein", "Omega-3", "B12", "Selenium"], skinBenefit: "Omega-3 fatty acids reduce skin inflammation and dryness", hairBenefit: "Selenium and omega-3 nourish the scalp and add natural shine",
    costEst: "₹60–90", prepMin: 10, tags: ["quick", "omega-3", "brain-food"],
    reason: "Omega-3s are rare in most student diets but critical for brain function, mood stability, and reducing exam-stress inflammation in skin.",
  },
  {
    id: "r11", name: "Green Smoothie", category: "Snack", emoji: "🥤",
    dietTypes: ["veg", "vegan"], budgetLevels: ["moderate", "flexible"], prepLevels: ["minimal"],
    nutrients: ["Vitamin A", "Vitamin C", "Folate", "Iron"], skinBenefit: "Spinach and cucumber hydrate and detoxify for naturally glowing skin", hairBenefit: "Vitamin A from spinach regulates scalp sebum production",
    costEst: "₹40–60", prepMin: 5, tags: ["detox", "energising", "quick"],
    reason: "A nutrient-dense snack between classes. Spinach + banana + coconut water delivers electrolytes and vitamins that most packaged drinks cannot match.",
  },
  {
    id: "r12", name: "Egg Bhurji with Toast", category: "Breakfast", emoji: "🍳",
    dietTypes: ["nonveg"], budgetLevels: ["tight", "moderate"], prepLevels: ["minimal", "moderate"],
    nutrients: ["Complete Protein", "Choline", "B12", "Vitamin D"], skinBenefit: "Lutein in egg yolks improves skin elasticity and hydration", hairBenefit: "Biotin and sulfur amino acids in eggs rebuild damaged hair structure",
    costEst: "₹30–55", prepMin: 10, tags: ["high-protein", "quick", "savory"],
    reason: "Eggs are the most complete, affordable protein source available. This keeps you full for 4+ hours — essential for days with back-to-back classes.",
  },
  {
    id: "r13", name: "Chole with Roti", category: "Dinner", emoji: "🫘",
    dietTypes: ["veg", "vegan"], budgetLevels: ["tight", "moderate"], prepLevels: ["moderate", "ample"],
    nutrients: ["Plant Protein", "Iron", "Folate", "Manganese"], skinBenefit: "Chickpea zinc controls acne-causing bacteria on skin surface", hairBenefit: "Manganese activates enzymes needed for collagen and hair protein synthesis",
    costEst: "₹40–65", prepMin: 30, tags: ["protein-rich", "filling", "traditional"],
    reason: "One of the highest plant-protein Indian meals available. Chickpeas rank among the top foods for both hair and skin health.",
  },
];

const WEEKLY_PLAN: Record<string, { breakfast: string; lunch: string; dinner: string }> = {
  Monday: { breakfast: "Overnight oats with banana and honey", lunch: "Dal tadka, steamed rice, cucumber raita", dinner: "2 rotis, mixed veg sabzi, curd" },
  Tuesday: { breakfast: "Peanut butter banana toast (2 slices)", lunch: "Rajma chawal with onion salad", dinner: "Moong dal khichdi with papad" },
  Wednesday: { breakfast: "Poha with peanuts and green chutney", lunch: "Paneer bhurji, rice, dal soup", dinner: "Roti, chole, and sliced cucumber" },
  Thursday: { breakfast: "Moong dal cheela with mint chutney", lunch: "Chole rice with lemon pickle", dinner: "Dal, jeera rice, roasted broccoli" },
  Friday: { breakfast: "Fruit yogurt bowl with mixed fruits", lunch: "Veg pulao with mint raita", dinner: "Palak dal, roti, sliced tomato" },
  Saturday: { breakfast: "Upma with coconut chutney", lunch: "Pav bhaji (light version, less butter)", dinner: "Rajma rice or stuffed paratha with curd" },
  Sunday: { breakfast: "Banana shake + boiled eggs or paneer toast", lunch: "Special meal — biryani (small) with raita", dinner: "Light dal khichdi or vegetable soup + roti" },
};

const SKIN_TIPS = [
  { title: "Hydrate First", desc: "Drink 8–10 glasses of water daily. Dehydration directly causes dull, dry skin and makes pores more visible.", emoji: "💧", color: "#3A7DB5" },
  { title: "Vitamin C Every Day", desc: "Amla, oranges, guava, and bell peppers boost collagen synthesis — the protein responsible for firm, plump skin.", emoji: "🍊", color: "#E07B39" },
  { title: "Cut Sugary Drinks", desc: "High sugar spikes insulin and triggers excess sebum. Replacing soda with water can visibly reduce acne in 4–6 weeks.", emoji: "🚫", color: "#C0392B" },
  { title: "Prioritise Sleep", desc: "Skin repairs itself most actively between 10 PM–2 AM. Even 6 hours of quality sleep reduces puffiness and dark circles.", emoji: "😴", color: "#7B61FF" },
  { title: "Eat Antioxidants", desc: "Tomatoes, green tea, dark chocolate, and berries neutralise free radicals that cause premature ageing and dullness.", emoji: "🍵", color: "#4A8C5C" },
  { title: "Stop Touching Your Face", desc: "Phones and keyboards carry bacteria transferred directly to skin when you touch your face. A major, underrated cause of acne.", emoji: "🤚", color: "#D4A847" },
];

const SKIN_FOODS = [
  { name: "Tomatoes", benefit: "Lycopene protects from UV-induced damage", emoji: "🍅" },
  { name: "Walnuts", benefit: "Omega-3 fatty acids reduce skin inflammation", emoji: "🥜" },
  { name: "Turmeric", benefit: "Curcumin has antibacterial and brightening effects", emoji: "🟡" },
  { name: "Sweet Potato", benefit: "Beta-carotene converts to Vitamin A for glow", emoji: "🍠" },
  { name: "Spinach", benefit: "Folate repairs UV-damaged skin cells", emoji: "🥬" },
  { name: "Amla", benefit: "Highest natural source of Vitamin C available", emoji: "🫐" },
  { name: "Green Tea", benefit: "EGCG catechins reduce acne-causing bacteria", emoji: "🍵" },
  { name: "Cucumber", benefit: "95% water content — hydrates skin from inside", emoji: "🥒" },
];

const HAIR_TIPS = [
  { title: "Protein at Every Meal", desc: "Hair is made of 95% keratin (protein). Eating dal, eggs, or paneer at every meal prevents gradual hair thinning.", emoji: "💪", color: "#D4A847" },
  { title: "Iron-Rich Foods", desc: "Iron deficiency is the most common cause of hair fall in young adults. Add spinach, rajma, and dates to your weekly diet.", emoji: "🩸", color: "#C0392B" },
  { title: "Daily Scalp Massage", desc: "Massaging your scalp for 4 minutes daily increases blood flow to follicles — clinically shown to increase hair thickness.", emoji: "✋", color: "#4A8C5C" },
  { title: "Biotin Sources", desc: "Eggs, peanuts, almonds, and sweet potatoes are rich in Biotin (B7) — the vitamin most directly linked to hair growth.", emoji: "🥚", color: "#E07B39" },
  { title: "Limit Heat Styling", desc: "Frequent use of dryers or straighteners strips moisture and weakens the hair shaft. Air-dry when possible.", emoji: "🔥", color: "#3A7DB5" },
  { title: "Omega-3 Fats", desc: "Walnuts, flaxseeds, and fish provide omega-3 that nourishes follicles, reduces scalp inflammation, and adds natural shine.", emoji: "✨", color: "#7B61FF" },
];

const HAIR_FOODS = [
  { name: "Eggs", benefit: "Complete protein + biotin for keratin synthesis", emoji: "🥚" },
  { name: "Spinach", benefit: "Iron, folate, and Vitamin A for scalp health", emoji: "🥬" },
  { name: "Walnuts", benefit: "Omega-3 and biotin nourish the follicle", emoji: "🥜" },
  { name: "Dal (Lentils)", benefit: "Protein, iron, zinc, and biotin all in one", emoji: "🫘" },
  { name: "Sweet Potato", benefit: "Beta-carotene converts to Vitamin A for scalp", emoji: "🍠" },
  { name: "Amla", benefit: "Vitamin C boosts iron absorption significantly", emoji: "🫐" },
  { name: "Curd / Yogurt", benefit: "Protein and Vitamin D activate hair growth", emoji: "🥛" },
  { name: "Flaxseeds", benefit: "ALA omega-3 reduces scalp dryness and flaking", emoji: "🌱" },
];

const FOOD_DB = [
  { name: "Greek Yogurt", qty: "200g", cal: 130, protein: 17, carbs: 9, fat: 0 },
  { name: "Banana", qty: "1 medium", cal: 89, protein: 1, carbs: 23, fat: 0 },
  { name: "Oatmeal (cooked)", qty: "240g", cal: 158, protein: 6, carbs: 27, fat: 3 },
  { name: "Boiled Eggs", qty: "2 large", cal: 155, protein: 13, carbs: 1, fat: 11 },
  { name: "Brown Rice (cooked)", qty: "185g", cal: 216, protein: 5, carbs: 45, fat: 2 },
  { name: "Moong Dal (cooked)", qty: "100g", cal: 105, protein: 7, carbs: 18, fat: 1 },
  { name: "Paneer", qty: "100g", cal: 265, protein: 18, carbs: 3, fat: 20 },
  { name: "Peanut Butter", qty: "2 tbsp", cal: 188, protein: 8, carbs: 6, fat: 16 },
  { name: "Rajma (cooked)", qty: "165g", cal: 164, protein: 9, carbs: 27, fat: 3 },
  { name: "Spinach (raw)", qty: "100g", cal: 23, protein: 3, carbs: 4, fat: 0 },
  { name: "Almonds", qty: "28g", cal: 164, protein: 6, carbs: 6, fat: 14 },
  { name: "Roti (wheat)", qty: "1 medium", cal: 71, protein: 3, carbs: 15, fat: 0 },
  { name: "Curd (Dahi)", qty: "200g", cal: 118, protein: 6, carbs: 9, fat: 6 },
  { name: "Apple", qty: "1 medium", cal: 95, protein: 0, carbs: 25, fat: 0 },
  { name: "Chicken Breast (grilled)", qty: "100g", cal: 165, protein: 31, carbs: 0, fat: 4 },
  { name: "Milk (full fat)", qty: "240ml", cal: 149, protein: 8, carbs: 12, fat: 8 },
  { name: "Peanuts (roasted)", qty: "28g", cal: 166, protein: 7, carbs: 6, fat: 14 },
  { name: "Chickpeas (cooked)", qty: "165g", cal: 164, protein: 9, carbs: 27, fat: 3 },
];

const CUISINES = ["North Indian", "South Indian", "Bengali", "Street Food", "Continental", "Chinese"];
const ALLERGIES = ["Nuts", "Dairy", "Gluten", "Eggs", "Shellfish"];
const DIET_GOALS = ["Better skin", "Healthy hair", "More energy", "Balanced diet", "All of these"];

// ── Utility Components ─────────────────────────────────────────────────────────

function Tag({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
      style={{ color, backgroundColor: bg, fontFamily: "'Barlow', sans-serif", fontSize: "10px", letterSpacing: "0.06em" }}
    >
      {label}
    </span>
  );
}

function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="mb-6">
      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1"
        style={{ fontFamily: "'Barlow', sans-serif", fontSize: "10px", letterSpacing: "0.16em" }}>
        {eyebrow}
      </p>
      <h1 className="text-3xl font-bold text-foreground"
        style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.02em" }}>
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1.5 text-sm text-muted-foreground max-w-xl" style={{ fontFamily: "'Barlow', sans-serif" }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

function DisclaimerBanner({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2.5 px-4 py-3 rounded-lg border mb-6"
      style={{ backgroundColor: "#FFF8E7", borderColor: "#D4A84730" }}>
      <Info size={14} style={{ color: "#D4A847", marginTop: 2, flexShrink: 0 }} />
      <p className="text-xs text-muted-foreground leading-relaxed" style={{ fontFamily: "'Barlow', sans-serif" }}>
        {text}
      </p>
    </div>
  );
}

// ── Onboarding ─────────────────────────────────────────────────────────────────

function Radio({ label, checked, onClick }: { label: string; checked: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-lg border w-full text-left transition-all"
      style={{
        borderColor: checked ? "#1E3A28" : "rgba(26,26,23,0.12)",
        backgroundColor: checked ? "#1E3A2808" : "transparent",
        fontFamily: "'Barlow', sans-serif",
      }}>
      <div className="w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors"
        style={{ borderColor: checked ? "#1E3A28" : "#B0AEA8", backgroundColor: checked ? "#1E3A28" : "transparent" }}>
        {checked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
      </div>
      <span className="text-sm text-foreground">{label}</span>
    </button>
  );
}

function Checkbox({ label, checked, onClick }: { label: string; checked: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg border transition-all text-sm"
      style={{
        borderColor: checked ? "#1E3A28" : "rgba(26,26,23,0.12)",
        backgroundColor: checked ? "#1E3A2808" : "transparent",
        fontFamily: "'Barlow', sans-serif",
        color: checked ? "#1E3A28" : "#1A1A17",
      }}>
      <div className="w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-colors"
        style={{ borderColor: checked ? "#1E3A28" : "#B0AEA8", backgroundColor: checked ? "#1E3A28" : "transparent" }}>
        {checked && <Check size={10} color="white" />}
      </div>
      {label}
    </button>
  );
}

function Onboarding({ onDone }: {
  onDone: (profile: StudentProfile, prefs: StudentPrefs) => void;
}) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<StudentProfile>({ name: "", year: "1st Year", college: "", living: "Hostel" });
  const [prefs, setPrefs] = useState<StudentPrefs>({
    diet: "veg", budget: "tight", prepTime: "minimal", activity: "sedentary",
    cuisines: [], allergies: [], likes: "", dislikes: "", goal: "All of these", mealStyle: "balanced",
  });

  const steps = ["About You", "Food Preferences", "Lifestyle", "Goals"];

  const toggleArr = (arr: string[], val: string): string[] =>
    arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val];

  const canNext = [
    profile.name.trim().length > 0 && profile.college.trim().length > 0,
    prefs.diet.length > 0,
    prefs.budget.length > 0,
    prefs.goal.length > 0,
  ];

  const submit = () => { if (canNext[3]) onDone(profile, prefs); };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded flex items-center justify-center" style={{ backgroundColor: "#1E3A28" }}>
            <Flame size={15} color="#F5F2EC" />
          </div>
          <span className="font-bold tracking-wide text-foreground"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "18px", letterSpacing: "0.08em" }}>
            NOURISH
          </span>
        </div>

        {/* Progress */}
        <div className="flex gap-2 mb-6">
          {steps.map((s, i) => (
            <div key={s} className="flex-1 flex flex-col gap-1.5">
              <div className="h-1 rounded-full transition-all duration-300"
                style={{ backgroundColor: i <= step ? "#1E3A28" : "#E6E2D8" }} />
              <span className="text-xs text-muted-foreground hidden sm:block"
                style={{ fontFamily: "'Barlow', sans-serif", fontSize: "10px" }}>
                {s}
              </span>
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-foreground mb-1"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            {step === 0 && "Tell us about yourself"}
            {step === 1 && "What do you eat?"}
            {step === 2 && "Your lifestyle"}
            {step === 3 && "Your wellness goals"}
          </h2>
          <p className="text-sm text-muted-foreground mb-6" style={{ fontFamily: "'Barlow', sans-serif" }}>
            {step === 0 && "We will personalise your nutrition plan around your college life."}
            {step === 1 && "Choose what applies to your diet so we recommend the right foods."}
            {step === 2 && "Your budget and schedule shape what is actually realistic for you."}
            {step === 3 && "Your goals guide which nutrients and habits we highlight."}
          </p>

          {step === 0 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2"
                  style={{ fontFamily: "'Barlow', sans-serif", fontSize: "10px", letterSpacing: "0.12em" }}>
                  Full Name *
                </label>
                <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  placeholder="e.g. Priya Sharma"
                  className="w-full bg-input-background rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
                  style={{ fontFamily: "'Barlow', sans-serif" }} />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2"
                  style={{ fontFamily: "'Barlow', sans-serif", fontSize: "10px", letterSpacing: "0.12em" }}>
                  College / University *
                </label>
                <input value={profile.college} onChange={(e) => setProfile({ ...profile, college: e.target.value })}
                  placeholder="e.g. Delhi University"
                  className="w-full bg-input-background rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
                  style={{ fontFamily: "'Barlow', sans-serif" }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2"
                    style={{ fontFamily: "'Barlow', sans-serif", fontSize: "10px", letterSpacing: "0.12em" }}>
                    Year of Study
                  </label>
                  <div className="space-y-2">
                    {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((y) => (
                      <Radio key={y} label={y} checked={profile.year === y} onClick={() => setProfile({ ...profile, year: y })} />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2"
                    style={{ fontFamily: "'Barlow', sans-serif", fontSize: "10px", letterSpacing: "0.12em" }}>
                    Living Situation
                  </label>
                  <div className="space-y-2">
                    {["Hostel", "PG", "Apartment", "Family Home"].map((l) => (
                      <Radio key={l} label={l} checked={profile.living === l} onClick={() => setProfile({ ...profile, living: l })} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2"
                  style={{ fontFamily: "'Barlow', sans-serif", fontSize: "10px", letterSpacing: "0.12em" }}>
                  Dietary Type
                </label>
                <div className="space-y-2">
                  {[["veg", "Vegetarian"], ["vegan", "Vegan"], ["nonveg", "Non-Vegetarian"]].map(([val, lbl]) => (
                    <Radio key={val} label={lbl} checked={prefs.diet === val} onClick={() => setPrefs({ ...prefs, diet: val })} />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2"
                  style={{ fontFamily: "'Barlow', sans-serif", fontSize: "10px", letterSpacing: "0.12em" }}>
                  Food Allergies (if any)
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALLERGIES.map((a) => (
                    <Checkbox key={a} label={a} checked={prefs.allergies.includes(a)}
                      onClick={() => setPrefs({ ...prefs, allergies: toggleArr(prefs.allergies, a) })} />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2"
                  style={{ fontFamily: "'Barlow', sans-serif", fontSize: "10px", letterSpacing: "0.12em" }}>
                  Favourite Cuisines
                </label>
                <div className="flex flex-wrap gap-2">
                  {CUISINES.map((c) => (
                    <Checkbox key={c} label={c} checked={prefs.cuisines.includes(c)}
                      onClick={() => setPrefs({ ...prefs, cuisines: toggleArr(prefs.cuisines, c) })} />
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2"
                    style={{ fontFamily: "'Barlow', sans-serif", fontSize: "10px", letterSpacing: "0.12em" }}>
                    Foods I Love
                  </label>
                  <textarea value={prefs.likes} onChange={(e) => setPrefs({ ...prefs, likes: e.target.value })}
                    placeholder="e.g. Dal, paneer, bananas..."
                    rows={3}
                    className="w-full bg-input-background rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground resize-none"
                    style={{ fontFamily: "'Barlow', sans-serif" }} />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2"
                    style={{ fontFamily: "'Barlow', sans-serif", fontSize: "10px", letterSpacing: "0.12em" }}>
                    Foods I Dislike
                  </label>
                  <textarea value={prefs.dislikes} onChange={(e) => setPrefs({ ...prefs, dislikes: e.target.value })}
                    placeholder="e.g. Bitter gourd, mushrooms..."
                    rows={3}
                    className="w-full bg-input-background rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground resize-none"
                    style={{ fontFamily: "'Barlow', sans-serif" }} />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2"
                  style={{ fontFamily: "'Barlow', sans-serif", fontSize: "10px", letterSpacing: "0.12em" }}>
                  Weekly Food Budget
                </label>
                <div className="space-y-2">
                  {[["tight", "Under ₹500 — very tight"], ["moderate", "₹500–1,500 — manageable"], ["flexible", "₹1,500+ — comfortable"]].map(([val, lbl]) => (
                    <Radio key={val} label={lbl} checked={prefs.budget === val} onClick={() => setPrefs({ ...prefs, budget: val })} />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2"
                  style={{ fontFamily: "'Barlow', sans-serif", fontSize: "10px", letterSpacing: "0.12em" }}>
                  Available Prep Time
                </label>
                <div className="space-y-2">
                  {[["minimal", "No time — under 5 minutes"], ["moderate", "Some time — around 15 minutes"], ["ample", "Can cook — 30 minutes or more"]].map(([val, lbl]) => (
                    <Radio key={val} label={lbl} checked={prefs.prepTime === val} onClick={() => setPrefs({ ...prefs, prepTime: val })} />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2"
                  style={{ fontFamily: "'Barlow', sans-serif", fontSize: "10px", letterSpacing: "0.12em" }}>
                  Activity Level
                </label>
                <div className="space-y-2">
                  {[["sedentary", "Mostly sitting — classes and studying"], ["light", "Light activity — walks or yoga"], ["active", "Active — sports, gym, or dance"]].map(([val, lbl]) => (
                    <Radio key={val} label={lbl} checked={prefs.activity === val} onClick={() => setPrefs({ ...prefs, activity: val })} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2"
                  style={{ fontFamily: "'Barlow', sans-serif", fontSize: "10px", letterSpacing: "0.12em" }}>
                  Primary Wellness Goal
                </label>
                <div className="space-y-2">
                  {DIET_GOALS.map((g) => (
                    <Radio key={g} label={g} checked={prefs.goal === g} onClick={() => setPrefs({ ...prefs, goal: g })} />
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-widest text-muted-foreground mb-2"
                  style={{ fontFamily: "'Barlow', sans-serif", fontSize: "10px", letterSpacing: "0.12em" }}>
                  Meal Style Preference
                </label>
                <div className="space-y-2">
                  {[["homestyle", "Home-style comfort food"], ["quickbites", "Quick bites and easy snacks"], ["balanced", "Balanced and varied meals"]].map(([val, lbl]) => (
                    <Radio key={val} label={lbl} checked={prefs.mealStyle === val} onClick={() => setPrefs({ ...prefs, mealStyle: val })} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Nav buttons */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <button onClick={() => setStep((s) => s - 1)} disabled={step === 0}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-0"
              style={{ fontFamily: "'Barlow', sans-serif" }}>
              <ChevronLeft size={15} /> Back
            </button>
            <button
              onClick={step < 3 ? () => setStep((s) => s + 1) : submit}
              disabled={!canNext[step]}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-40"
              style={{ backgroundColor: "#1E3A28", color: "#F5F2EC", fontFamily: "'Barlow', sans-serif" }}>
              {step < 3 ? <>Next <ArrowRight size={14} /></> : <>Get My Recommendations <ArrowRight size={14} /></>}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4" style={{ fontFamily: "'Barlow', sans-serif" }}>
          BCA Mini Project · Nutrition & Wellness AI
        </p>
      </div>
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────────

function Dashboard({ profile, prefs, recs }: { profile: StudentProfile; prefs: StudentPrefs; recs: FoodRec[] }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const featured = recs[0];
  const skinTip = SKIN_TIPS[Math.floor(Math.random() * SKIN_TIPS.length)];
  const hairTip = HAIR_TIPS[Math.floor(Math.random() * HAIR_TIPS.length)];

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground"
            style={{ fontFamily: "'Barlow', sans-serif", fontSize: "10px", letterSpacing: "0.15em" }}>
            Personalised Dashboard
          </p>
          <h1 className="text-3xl font-bold text-foreground mt-1"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            {greeting}, {profile.name.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5" style={{ fontFamily: "'Barlow', sans-serif" }}>
            {profile.college} · {profile.year} · {profile.living}
          </p>
        </div>
      </div>

      {/* Today's top rec */}
      {featured && (
        <div className="rounded-xl overflow-hidden border border-border"
          style={{ background: "linear-gradient(135deg, #1E3A28 0%, #2A5240 100%)" }}>
          <div className="p-5 lg:p-6">
            <div className="flex items-center gap-2 mb-3">
              <Star size={12} color="#D4A847" fill="#D4A847" />
              <span className="text-xs font-medium uppercase tracking-widest"
                style={{ color: "#D4A847", fontFamily: "'Barlow', sans-serif", fontSize: "10px", letterSpacing: "0.12em" }}>
                Top Pick for You Today
              </span>
            </div>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{featured.emoji}</span>
                  <div>
                    <h2 className="text-xl font-bold" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#F5F2EC" }}>
                      {featured.name}
                    </h2>
                    <Tag label={featured.category} color="#D4A847" bg="rgba(212,168,71,0.15)" />
                  </div>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(245,242,236,0.75)", fontFamily: "'Barlow', sans-serif", maxWidth: "480px" }}>
                  {featured.reason}
                </p>
              </div>
              <div className="flex-shrink-0 text-right hidden sm:block">
                <p className="font-mono text-sm" style={{ color: "rgba(245,242,236,0.6)", fontFamily: "'JetBrains Mono', monospace" }}>
                  {featured.costEst}
                </p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(245,242,236,0.4)", fontFamily: "'Barlow', sans-serif" }}>
                  {featured.prepMin} min prep
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wellness tip cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">{skinTip.emoji}</span>
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground"
              style={{ fontFamily: "'Barlow', sans-serif", fontSize: "10px", letterSpacing: "0.12em" }}>
              Skin Tip of the Day
            </span>
          </div>
          <h3 className="font-semibold text-foreground mb-1"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "17px" }}>
            {skinTip.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: "'Barlow', sans-serif" }}>
            {skinTip.desc}
          </p>
        </div>
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">{hairTip.emoji}</span>
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground"
              style={{ fontFamily: "'Barlow', sans-serif", fontSize: "10px", letterSpacing: "0.12em" }}>
              Hair Tip of the Day
            </span>
          </div>
          <h3 className="font-semibold text-foreground mb-1"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "17px" }}>
            {hairTip.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: "'Barlow', sans-serif" }}>
            {hairTip.desc}
          </p>
        </div>
      </div>

      {/* Profile summary chips */}
      <div className="bg-card border border-border rounded-xl p-5">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3"
          style={{ fontFamily: "'Barlow', sans-serif", fontSize: "10px", letterSpacing: "0.14em" }}>
          Your Profile Summary
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: prefs.diet === "veg" ? "🌱 Vegetarian" : prefs.diet === "vegan" ? "🌿 Vegan" : "🍗 Non-Vegetarian", color: "#4A8C5C", bg: "#4A8C5C15" },
            { label: `💰 ${prefs.budget === "tight" ? "Tight budget" : prefs.budget === "moderate" ? "Moderate budget" : "Flexible budget"}`, color: "#3A7DB5", bg: "#3A7DB515" },
            { label: `⏱ ${prefs.prepTime === "minimal" ? "Quick prep" : prefs.prepTime === "moderate" ? "Some time" : "Can cook"}`, color: "#E07B39", bg: "#E07B3915" },
            { label: `🏃 ${prefs.activity === "sedentary" ? "Sedentary" : prefs.activity === "light" ? "Light activity" : "Active"}`, color: "#7B61FF", bg: "#7B61FF15" },
            { label: `🎯 ${prefs.goal}`, color: "#D4A847", bg: "#D4A84715" },
          ].map(({ label, color, bg }) => (
            <span key={label} className="px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ color, backgroundColor: bg, fontFamily: "'Barlow', sans-serif" }}>
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Student Profile ─────────────────────────────────────────────────────────────

function ProfileView({ profile, prefs, onEdit }: { profile: StudentProfile; prefs: StudentPrefs; onEdit: () => void }) {
  const fields = [
    { label: "Full Name", value: profile.name },
    { label: "College / University", value: profile.college },
    { label: "Year of Study", value: profile.year },
    { label: "Living Situation", value: profile.living },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <div className="flex items-start justify-between mb-6">
        <SectionHeader eyebrow="Your Account" title="Student Profile" />
        <button onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-secondary transition-colors"
          style={{ fontFamily: "'Barlow', sans-serif" }}>
          <Edit2 size={13} /> Edit Profile
        </button>
      </div>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-7">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold"
          style={{ backgroundColor: "#1E3A28", color: "#F5F2EC", fontFamily: "'Barlow Condensed', sans-serif" }}>
          {profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
            {profile.name}
          </h2>
          <p className="text-sm text-muted-foreground" style={{ fontFamily: "'Barlow', sans-serif" }}>
            {profile.year} Student · {profile.college}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {fields.map(({ label, value }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1"
              style={{ fontFamily: "'Barlow', sans-serif", fontSize: "10px", letterSpacing: "0.12em" }}>
              {label}
            </p>
            <p className="text-base font-medium text-foreground" style={{ fontFamily: "'Barlow', sans-serif" }}>
              {value || "—"}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-5">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3"
          style={{ fontFamily: "'Barlow', sans-serif", fontSize: "10px", letterSpacing: "0.14em" }}>
          Wellness Goal
        </p>
        <p className="text-base font-medium text-foreground" style={{ fontFamily: "'Barlow', sans-serif" }}>
          {prefs.goal}
        </p>
        {prefs.likes && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1"
              style={{ fontFamily: "'Barlow', sans-serif", fontSize: "10px", letterSpacing: "0.12em" }}>
              Foods I Love
            </p>
            <p className="text-sm text-foreground" style={{ fontFamily: "'Barlow', sans-serif" }}>{prefs.likes}</p>
          </div>
        )}
        {prefs.dislikes && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1"
              style={{ fontFamily: "'Barlow', sans-serif", fontSize: "10px", letterSpacing: "0.12em" }}>
              Foods I Dislike
            </p>
            <p className="text-sm text-foreground" style={{ fontFamily: "'Barlow', sans-serif" }}>{prefs.dislikes}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Nutrition Preferences ───────────────────────────────────────────────────────

function PreferencesView({ prefs, profile, onEdit }: { prefs: StudentPrefs; profile: StudentProfile; onEdit: () => void }) {
  const items = [
    { label: "Dietary Type", value: prefs.diet === "veg" ? "Vegetarian" : prefs.diet === "vegan" ? "Vegan" : "Non-Vegetarian", emoji: "🌱" },
    { label: "Weekly Budget", value: prefs.budget === "tight" ? "Under ₹500" : prefs.budget === "moderate" ? "₹500–1,500" : "₹1,500+", emoji: "💰" },
    { label: "Prep Time", value: prefs.prepTime === "minimal" ? "Quick — under 5 min" : prefs.prepTime === "moderate" ? "Some — ~15 min" : "Can cook — 30+ min", emoji: "⏱" },
    { label: "Activity Level", value: prefs.activity === "sedentary" ? "Mostly sitting" : prefs.activity === "light" ? "Light activity" : "Active", emoji: "🏃" },
    { label: "Meal Style", value: prefs.mealStyle === "homestyle" ? "Home-style comfort" : prefs.mealStyle === "quickbites" ? "Quick bites" : "Balanced & varied", emoji: "🍽️" },
    { label: "Living Situation", value: profile.living, emoji: "🏠" },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <div className="flex items-start justify-between mb-6">
        <SectionHeader eyebrow="Personalisation" title="Nutrition Preferences" subtitle="These settings power your AI recommendations. Update them anytime as your lifestyle changes." />
        <button onClick={onEdit}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-secondary transition-colors flex-shrink-0 mt-1"
          style={{ fontFamily: "'Barlow', sans-serif" }}>
          <Edit2 size={13} /> Edit
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {items.map(({ label, value, emoji }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2"
              style={{ fontFamily: "'Barlow', sans-serif", fontSize: "10px", letterSpacing: "0.12em" }}>
              {label}
            </p>
            <p className="text-sm font-medium text-foreground" style={{ fontFamily: "'Barlow', sans-serif" }}>
              {emoji} {value}
            </p>
          </div>
        ))}
      </div>

      {(prefs.cuisines.length > 0 || prefs.allergies.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {prefs.cuisines.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3"
                style={{ fontFamily: "'Barlow', sans-serif", fontSize: "10px", letterSpacing: "0.12em" }}>
                Favourite Cuisines
              </p>
              <div className="flex flex-wrap gap-2">
                {prefs.cuisines.map((c) => (
                  <Tag key={c} label={c} color="#4A8C5C" bg="#4A8C5C15" />
                ))}
              </div>
            </div>
          )}
          {prefs.allergies.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3"
                style={{ fontFamily: "'Barlow', sans-serif", fontSize: "10px", letterSpacing: "0.12em" }}>
                Allergies / Avoidances
              </p>
              <div className="flex flex-wrap gap-2">
                {prefs.allergies.map((a) => (
                  <Tag key={a} label={a} color="#C0392B" bg="#C0392B15" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── AI Recommendations ──────────────────────────────────────────────────────────

function AIRecommendations({ recs, profile, prefs }: { recs: FoodRec[]; profile: StudentProfile; prefs: StudentPrefs }) {
  const [tab, setTab] = useState("All");
  const categories = ["All", "Breakfast", "Lunch", "Dinner", "Snack"];
  const filtered = tab === "All" ? recs : recs.filter((r) => r.category === tab);
  const dietLabel = prefs.diet === "veg" ? "Vegetarian" : prefs.diet === "vegan" ? "Vegan" : "Non-Vegetarian";

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <SectionHeader
        eyebrow="Powered by AI"
        title="Food Recommendations"
        subtitle={`Personalised for ${profile.name.split(" ")[0]} · ${dietLabel} · ${prefs.budget === "tight" ? "Budget-conscious" : prefs.budget === "moderate" ? "Moderate budget" : "Flexible budget"}`}
      />

      <div className="flex items-center gap-1 p-1 bg-secondary rounded-lg mb-6 w-fit">
        {categories.map((c) => (
          <button key={c} onClick={() => setTab(c)}
            className="px-3 py-1.5 rounded-md text-xs font-medium transition-all"
            style={{
              fontFamily: "'Barlow', sans-serif",
              backgroundColor: tab === c ? "#1E3A28" : "transparent",
              color: tab === c ? "#F5F2EC" : "#7A7868",
            }}>
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Sparkles size={32} className="mx-auto mb-3 opacity-30" />
          <p style={{ fontFamily: "'Barlow', sans-serif" }}>No recommendations in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((rec) => (
            <div key={rec.id} className="bg-card border border-border rounded-xl p-5 hover:border-accent/30 transition-colors">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{rec.emoji}</span>
                  <div>
                    <h3 className="font-semibold text-foreground" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "17px" }}>
                      {rec.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Tag label={rec.category} color="#4A8C5C" bg="#4A8C5C15" />
                      {(rec.dietTypes.includes("vegan")) && <Tag label="Vegan" color="#4A8C5C" bg="#4A8C5C10" />}
                      {(!rec.dietTypes.includes("vegan") && rec.dietTypes.includes("veg")) && <Tag label="Veg" color="#4A8C5C" bg="#4A8C5C10" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI reason */}
              <div className="rounded-lg p-3 mb-3" style={{ backgroundColor: "#7B61FF0C", borderLeft: "3px solid #7B61FF" }}>
                <p className="text-xs font-medium mb-1" style={{ color: "#7B61FF", fontFamily: "'Barlow', sans-serif", letterSpacing: "0.04em" }}>
                  ✨ Why AI picked this for you
                </p>
                <p className="text-sm text-foreground leading-relaxed" style={{ fontFamily: "'Barlow', sans-serif" }}>
                  {rec.reason}
                </p>
              </div>

              {/* Wellness benefits */}
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="rounded-lg px-3 py-2" style={{ backgroundColor: "#E07B3910" }}>
                  <p className="text-xs font-medium mb-0.5" style={{ color: "#E07B39", fontFamily: "'Barlow', sans-serif" }}>Skin</p>
                  <p className="text-xs text-muted-foreground" style={{ fontFamily: "'Barlow', sans-serif" }}>{rec.skinBenefit}</p>
                </div>
                <div className="rounded-lg px-3 py-2" style={{ backgroundColor: "#D4A84710" }}>
                  <p className="text-xs font-medium mb-0.5" style={{ color: "#D4A847", fontFamily: "'Barlow', sans-serif" }}>Hair</p>
                  <p className="text-xs text-muted-foreground" style={{ fontFamily: "'Barlow', sans-serif" }}>{rec.hairBenefit}</p>
                </div>
              </div>

              {/* Nutrients */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {rec.nutrients.map((n) => (
                  <span key={n} className="px-2 py-0.5 rounded text-xs"
                    style={{ backgroundColor: "#E6E2D8", color: "#7A7868", fontFamily: "'Barlow', sans-serif" }}>
                    {n}
                  </span>
                ))}
              </div>

              {/* Meta */}
              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-3 border-t border-border">
                <span className="flex items-center gap-1" style={{ fontFamily: "'Barlow', sans-serif" }}>
                  <Clock size={11} /> {rec.prepMin} min
                </span>
                <span className="font-mono" style={{ fontFamily: "'JetBrains Mono', monospace" }}>{rec.costEst}</span>
                <div className="flex gap-1 ml-auto">
                  {rec.tags.map((t) => (
                    <span key={t} className="px-1.5 py-0.5 rounded text-xs"
                      style={{ backgroundColor: "#1E3A2810", color: "#1E3A28", fontFamily: "'Barlow', sans-serif", fontSize: "10px" }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Meal Plans ─────────────────────────────────────────────────────────────────

function MealPlans({ profile }: { profile: StudentProfile }) {
  const days = Object.keys(WEEKLY_PLAN);
  const [activeDay, setActiveDay] = useState("Monday");
  const meals = WEEKLY_PLAN[activeDay];

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <SectionHeader eyebrow="This Week" title="Meal Recommendations"
        subtitle="A balanced week of practical, student-friendly meals. Adapt based on availability and preference." />

      {/* Day tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 mb-6">
        {days.map((d) => (
          <button key={d} onClick={() => setActiveDay(d)}
            className="px-3 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex-shrink-0"
            style={{
              fontFamily: "'Barlow', sans-serif",
              backgroundColor: activeDay === d ? "#1E3A28" : "#E6E2D8",
              color: activeDay === d ? "#F5F2EC" : "#7A7868",
            }}>
            {d.slice(0, 3)}
          </button>
        ))}
      </div>

      {/* Meals for selected day */}
      <div className="mb-2">
        <h2 className="text-xl font-bold text-foreground mb-4" style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
          {activeDay}
        </h2>
        <div className="space-y-3">
          {([["Breakfast", "☀️", "#E07B39"], ["Lunch", "🌤️", "#4A8C5C"], ["Dinner", "🌙", "#7B61FF"]] as const).map(
            ([meal, emoji, color]) => (
              <div key={meal} className="bg-card border border-border rounded-xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0"
                  style={{ backgroundColor: `${color}15` }}>
                  {emoji}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground mb-1"
                    style={{ fontFamily: "'Barlow', sans-serif", fontSize: "10px", letterSpacing: "0.12em", color }}>
                    {meal}
                  </p>
                  <p className="text-base text-foreground font-medium" style={{ fontFamily: "'Barlow', sans-serif" }}>
                    {meal === "Breakfast" ? meals.breakfast : meal === "Lunch" ? meals.lunch : meals.dinner}
                  </p>
                </div>
                <Tag label="Suggested" color={color} bg={`${color}15`} />
              </div>
            )
          )}
        </div>
      </div>

      {/* Weekly overview mini grid */}
      <div className="mt-8">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4"
          style={{ fontFamily: "'Barlow', sans-serif", fontSize: "10px", letterSpacing: "0.14em" }}>
          Full Week at a Glance
        </p>
        <div className="overflow-x-auto">
          <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${days.length}, minmax(130px, 1fr))`, minWidth: "700px" }}>
            {days.map((d) => (
              <button key={d} onClick={() => setActiveDay(d)}
                className="text-left p-3 rounded-lg border transition-colors"
                style={{
                  borderColor: activeDay === d ? "#1E3A28" : "rgba(26,26,23,0.12)",
                  backgroundColor: activeDay === d ? "#1E3A2808" : "#FFFFFF",
                }}>
                <p className="font-semibold text-xs mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: activeDay === d ? "#1E3A28" : "#1A1A17" }}>
                  {d}
                </p>
                {["breakfast", "lunch", "dinner"].map((m) => (
                  <p key={m} className="text-xs text-muted-foreground truncate mb-0.5" style={{ fontFamily: "'Barlow', sans-serif" }}>
                    {WEEKLY_PLAN[d][m as keyof typeof WEEKLY_PLAN[typeof d]].split(",")[0]}
                  </p>
                ))}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Skin Wellness ───────────────────────────────────────────────────────────────

function SkinWellness() {
  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <SectionHeader eyebrow="Wellness" title="Skin Wellness"
        subtitle="Nutrition and lifestyle habits that support healthy skin — from the inside out." />
      <DisclaimerBanner text="These are general wellness tips for educational purposes only and are not medical advice, diagnosis, or treatment. Consult a qualified dermatologist for any skin concerns." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {SKIN_TIPS.map((tip) => (
          <div key={tip.title} className="bg-card border border-border rounded-xl p-5 hover:border-border/60 transition-colors">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-3"
              style={{ backgroundColor: `${tip.color}15` }}>
              {tip.emoji}
            </div>
            <h3 className="font-semibold text-foreground mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "17px" }}>
              {tip.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: "'Barlow', sans-serif" }}>
              {tip.desc}
            </p>
          </div>
        ))}
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4"
          style={{ fontFamily: "'Barlow', sans-serif", fontSize: "10px", letterSpacing: "0.14em" }}>
          Foods for Glowing Skin
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {SKIN_FOODS.map((food) => (
            <div key={food.name} className="bg-card border border-border rounded-xl p-4 text-center hover:border-accent/30 transition-colors">
              <div className="text-2xl mb-2">{food.emoji}</div>
              <p className="font-semibold text-sm text-foreground mb-1" style={{ fontFamily: "'Barlow', sans-serif" }}>
                {food.name}
              </p>
              <p className="text-xs text-muted-foreground" style={{ fontFamily: "'Barlow', sans-serif" }}>
                {food.benefit}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Hair Wellness ───────────────────────────────────────────────────────────────

function HairWellness() {
  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <SectionHeader eyebrow="Wellness" title="Hair Wellness"
        subtitle="Nutritional habits and simple practices that support stronger, healthier hair over time." />
      <DisclaimerBanner text="These are general wellness tips for educational purposes only and are not medical advice, diagnosis, or treatment. Consult a qualified trichologist for specific hair or scalp conditions." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {HAIR_TIPS.map((tip) => (
          <div key={tip.title} className="bg-card border border-border rounded-xl p-5 hover:border-border/60 transition-colors">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl mb-3"
              style={{ backgroundColor: `${tip.color}15` }}>
              {tip.emoji}
            </div>
            <h3 className="font-semibold text-foreground mb-2" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: "17px" }}>
              {tip.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: "'Barlow', sans-serif" }}>
              {tip.desc}
            </p>
          </div>
        ))}
      </div>

      <div>
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4"
          style={{ fontFamily: "'Barlow', sans-serif", fontSize: "10px", letterSpacing: "0.14em" }}>
          Foods for Stronger Hair
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {HAIR_FOODS.map((food) => (
            <div key={food.name} className="bg-card border border-border rounded-xl p-4 text-center hover:border-accent/30 transition-colors">
              <div className="text-2xl mb-2">{food.emoji}</div>
              <p className="font-semibold text-sm text-foreground mb-1" style={{ fontFamily: "'Barlow', sans-serif" }}>
                {food.name}
              </p>
              <p className="text-xs text-muted-foreground" style={{ fontFamily: "'Barlow', sans-serif" }}>
                {food.benefit}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Food Library ────────────────────────────────────────────────────────────────

function FoodLibrary() {
  const [query, setQuery] = useState("");
  const results = FOOD_DB.filter((f) => f.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8">
      <SectionHeader eyebrow="Nutrition Database" title="Food Library"
        subtitle="Reference nutritional data for common foods. Values are approximate per typical serving." />

      <div className="relative mb-5">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input value={query} onChange={(e) => setQuery(e.target.value)}
          placeholder="Search foods..."
          className="w-full bg-card border border-border rounded-lg px-4 py-2.5 pl-9 text-sm outline-none focus:ring-1 focus:ring-ring placeholder:text-muted-foreground"
          style={{ fontFamily: "'Barlow', sans-serif" }} />
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="grid px-5 py-3 border-b border-border"
          style={{ gridTemplateColumns: "1fr 100px 60px 64px 64px 60px" }}>
          {["Food", "Serving", "Cal", "Protein", "Carbs", "Fat"].map((h) => (
            <span key={h}
              className="text-right first:text-left text-xs uppercase tracking-widest text-muted-foreground"
              style={{ fontFamily: "'Barlow', sans-serif", fontSize: "10px", letterSpacing: "0.12em" }}>
              {h}
            </span>
          ))}
        </div>
        {results.map((item, i) => (
          <div key={i}
            className="grid px-5 py-3.5 border-b border-border last:border-0 hover:bg-secondary/40 transition-colors items-center"
            style={{ gridTemplateColumns: "1fr 100px 60px 64px 64px 60px" }}>
            <span className="text-sm font-medium text-foreground" style={{ fontFamily: "'Barlow', sans-serif" }}>
              {item.name}
            </span>
            <span className="text-right text-xs text-muted-foreground" style={{ fontFamily: "'Barlow', sans-serif" }}>
              {item.qty}
            </span>
            {[item.cal, item.protein, item.carbs, item.fat].map((v, j) => (
              <span key={j} className="text-right font-mono text-sm tabular-nums text-foreground"
                style={{ fontFamily: "'JetBrains Mono', monospace" }}>
                {v}
                <span className="text-muted-foreground text-xs">g</span>
              </span>
            ))}
          </div>
        ))}
        {results.length === 0 && (
          <div className="py-10 text-center text-muted-foreground text-sm" style={{ fontFamily: "'Barlow', sans-serif" }}>
            No foods found matching "{query}"
          </div>
        )}
      </div>
    </div>
  );
}

// ── App Shell ──────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "profile", label: "My Profile", icon: User },
  { id: "preferences", label: "Preferences", icon: SlidersHorizontal },
  { id: "ai-recs", label: "AI Recs", icon: Sparkles },
  { id: "meals", label: "Meal Plans", icon: CalendarDays },
  { id: "skin", label: "Skin Wellness", icon: Droplets },
  { id: "hair", label: "Hair Wellness", icon: Wind },
  { id: "library", label: "Food Library", icon: BookOpen },
];

const NAV_GROUPS = [
  { label: "Overview", ids: ["dashboard", "profile", "preferences"] },
  { label: "Recommendations", ids: ["ai-recs", "meals"] },
  { label: "Wellness", ids: ["skin", "hair"] },
  { label: "Resources", ids: ["library"] },
];

export default function App() {
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [profile, setProfile] = useState<StudentProfile>({ name: "", year: "1st Year", college: "", living: "Hostel" });
  const [prefs, setPrefs] = useState<StudentPrefs>({
    diet: "veg", budget: "tight", prepTime: "minimal", activity: "sedentary",
    cuisines: [], allergies: [], likes: "", dislikes: "", goal: "All of these", mealStyle: "balanced",
  });

  const recs = useMemo(() => {
    const filtered = FOOD_RECS.filter(
      (r) => r.dietTypes.includes(prefs.diet) && r.budgetLevels.includes(prefs.budget) && r.prepLevels.includes(prefs.prepTime)
    );
    return filtered.length > 0 ? filtered : FOOD_RECS.filter((r) => r.dietTypes.includes(prefs.diet));
  }, [prefs]);

  const handleOnboardingDone = (p: StudentProfile, pr: StudentPrefs) => {
    setProfile(p);
    setPrefs(pr);
    setOnboardingDone(true);
  };

  if (!onboardingDone) {
    return <Onboarding onDone={handleOnboardingDone} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background" style={{ fontFamily: "'Barlow', sans-serif" }}>
      {/* Sidebar */}
      <aside className="w-14 lg:w-56 flex-shrink-0 flex flex-col border-r"
        style={{ backgroundColor: "#1E3A28", borderColor: "rgba(245,242,236,0.08)" }}>
        {/* Logo */}
        <div className="px-3 lg:px-4 py-4 border-b" style={{ borderColor: "rgba(245,242,236,0.08)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "#4A8C5C" }}>
              <Flame size={14} color="#F5F2EC" />
            </div>
            <span className="hidden lg:block font-bold tracking-wide text-sm"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", color: "#F5F2EC", letterSpacing: "0.1em", fontSize: "16px" }}>
              NOURISH
            </span>
          </div>
        </div>

        {/* Nav with groups */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="hidden lg:block px-2 mb-1 text-xs uppercase tracking-widest"
                style={{ color: "rgba(245,242,236,0.28)", fontFamily: "'Barlow', sans-serif", fontSize: "9px", letterSpacing: "0.14em" }}>
                {group.label}
              </p>
              {group.ids.map((id) => {
                const item = NAV_ITEMS.find((n) => n.id === id)!;
                const Icon = item.icon;
                const active = activeNav === id;
                return (
                  <button key={id} onClick={() => setActiveNav(id)}
                    className="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg transition-colors text-left"
                    style={{
                      backgroundColor: active ? "#2A5240" : "transparent",
                      color: active ? "#F5F2EC" : "rgba(245,242,236,0.5)",
                    }}>
                    <Icon size={15} className="flex-shrink-0" />
                    <span className="hidden lg:block text-sm" style={{ fontFamily: "'Barlow', sans-serif" }}>
                      {item.label}
                    </span>
                    {active && <ChevronRight size={12} className="hidden lg:block ml-auto opacity-50" />}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* User chip */}
        <div className="px-3 py-3 border-t" style={{ borderColor: "rgba(245,242,236,0.08)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
              style={{ backgroundColor: "#4A8C5C", color: "#F5F2EC", fontFamily: "'Barlow Condensed', sans-serif" }}>
              {profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() || "ST"}
            </div>
            <div className="hidden lg:block min-w-0">
              <p className="text-xs font-medium truncate" style={{ color: "#F5F2EC", fontFamily: "'Barlow', sans-serif" }}>
                {profile.name || "Student"}
              </p>
              <p className="truncate" style={{ color: "rgba(245,242,236,0.4)", fontFamily: "'Barlow', sans-serif", fontSize: "10px" }}>
                {profile.year} · {profile.college.split(" ")[0] || "College"}
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {activeNav === "dashboard" && <Dashboard profile={profile} prefs={prefs} recs={recs} />}
        {activeNav === "profile" && <ProfileView profile={profile} prefs={prefs} onEdit={() => setOnboardingDone(false)} />}
        {activeNav === "preferences" && <PreferencesView prefs={prefs} profile={profile} onEdit={() => setOnboardingDone(false)} />}
        {activeNav === "ai-recs" && <AIRecommendations recs={recs} profile={profile} prefs={prefs} />}
        {activeNav === "meals" && <MealPlans profile={profile} />}
        {activeNav === "skin" && <SkinWellness />}
        {activeNav === "hair" && <HairWellness />}
        {activeNav === "library" && <FoodLibrary />}
      </main>
    </div>
  );
}
