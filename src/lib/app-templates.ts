// Smart App Templates - Học từ Lovable + Expo Skills
// Focus: Beautiful UI first, Backend integration là optional

export interface AppCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  examplePrompts: string[];
  contextHints: string;
  uiPatterns: string[];
  commonFeatures: string[];
}

export const APP_CATEGORIES: AppCategory[] = [
  {
    id: "ecommerce",
    name: "E-Commerce",
    icon: "ShoppingBag",
    description: "Online store, marketplace, product catalog",
    color: "#10b981",
    examplePrompts: [
      "Tạo app bán quần áo với giỏ hàng",
      "Shop bán đồ điện tử với filter sản phẩm",
      "Marketplace cho đồ handmade",
      "App đặt đồ ăn như GrabFood",
    ],
    contextHints: `
E-COMMERCE UI PATTERNS:
- Product grid (2 columns) with image, name, price, rating badge
- Product detail: large image, sizes/colors selector, "Add to Cart" button
- Cart screen: item list with quantity +/-, total, checkout button
- Search bar with filter chips (category, price range)

MOCK DATA EXAMPLE:
const products = [
  { id: '1', name: 'Nike Air Max', price: 2500000, image: 'shoe1.jpg', rating: 4.8, colors: ['black', 'white'], sizes: [40, 41, 42] },
  // 8-10 more items
];
`,
    uiPatterns: ["Product Grid", "Cart Screen", "Filter Chips", "Quantity Selector"],
    commonFeatures: ["Product Catalog", "Shopping Cart", "Search & Filter", "Wishlist"],
  },
  {
    id: "social",
    name: "Social Media",
    icon: "Users",
    description: "Social network, community, messaging",
    color: "#3b82f6",
    examplePrompts: [
      "Mạng xã hội chia sẻ ảnh như Instagram",
      "App chat nhóm cho team",
      "Diễn đàn cộng đồng",
      "App dating như Tinder",
    ],
    contextHints: `
SOCIAL MEDIA UI PATTERNS:
- Feed: vertical list of posts with avatar, name, image, caption, like/comment counts
- Stories: horizontal scroll at top with circular avatars
- Profile: header with avatar, stats (posts/followers/following), tab for posts grid
- Double-tap to like with heart animation

MOCK DATA EXAMPLE:
const posts = [
  { id: '1', user: { name: 'Alex', avatar: 'avatar1.jpg' }, image: 'post1.jpg', caption: 'Beautiful sunset!', likes: 234, comments: 12 },
  // 5-8 more items
];
`,
    uiPatterns: ["Feed List", "Stories Bar", "Profile Header", "Like Animation"],
    commonFeatures: ["News Feed", "User Profiles", "Likes & Comments", "Stories"],
  },
  {
    id: "fitness",
    name: "Health & Fitness",
    icon: "Heart",
    description: "Workout tracker, health monitoring, diet",
    color: "#ef4444",
    examplePrompts: [
      "App theo dõi workout với timer",
      "Đếm calo và theo dõi dinh dưỡng",
      "App chạy bộ với GPS tracking",
      "Lịch tập gym với video hướng dẫn",
    ],
    contextHints: `
FITNESS UI PATTERNS:
- Dashboard: today's stats cards (steps, calories, water, active minutes)
- Circular progress rings for daily goals
- Workout list with duration, difficulty badge
- Timer screen with large countdown, start/pause/reset buttons
- Progress chart (weekly/monthly view)

MOCK DATA EXAMPLE:
const todayStats = { steps: 8432, goal: 10000, calories: 1850, water: 6, workouts: 1 };
const workouts = [
  { id: '1', name: 'Morning Run', duration: 30, calories: 320, difficulty: 'medium' },
];
`,
    uiPatterns: ["Stats Dashboard", "Progress Rings", "Timer", "Activity List"],
    commonFeatures: ["Workout Tracking", "Daily Goals", "Progress Charts", "Timer"],
  },
  {
    id: "productivity",
    name: "Productivity",
    icon: "CheckSquare",
    description: "Todo list, notes, project management",
    color: "#8b5cf6",
    examplePrompts: [
      "App quản lý công việc như Todoist",
      "Note-taking app với folders",
      "Pomodoro timer cho học tập",
      "Habit tracker hàng ngày",
    ],
    contextHints: `
PRODUCTIVITY UI PATTERNS:
- Task list with checkbox, title, due date badge, priority dot (red/yellow/green)
- Swipe left to delete, swipe right to complete
- FAB (floating action button) to add new task
- Category tabs or filter chips
- Empty state with illustration when no tasks

MOCK DATA EXAMPLE:
const tasks = [
  { id: '1', title: 'Review PR', completed: false, priority: 'high', dueDate: '2024-01-15', category: 'Work' },
  { id: '2', title: 'Buy groceries', completed: true, priority: 'low', dueDate: null, category: 'Personal' },
];
`,
    uiPatterns: ["Task List", "Swipe Actions", "FAB", "Filter Chips", "Empty State"],
    commonFeatures: ["Task Management", "Categories", "Due Dates", "Priority Levels"],
  },
  {
    id: "finance",
    name: "Finance",
    icon: "DollarSign",
    description: "Expense tracker, budget, investment",
    color: "#f59e0b",
    examplePrompts: [
      "App quản lý chi tiêu cá nhân",
      "Chia tiền nhóm như Splitwise",
      "Theo dõi đầu tư crypto",
      "Budget planner hàng tháng",
    ],
    contextHints: `
FINANCE UI PATTERNS:
- Balance card at top showing total, income, expense
- Transaction list with icon, name, amount (+green/-red), date
- Category breakdown (pie chart or horizontal bars)
- Quick add FAB with amount input
- Period selector (Today/Week/Month)

MOCK DATA EXAMPLE:
const balance = { total: 15000000, income: 20000000, expense: 5000000 };
const transactions = [
  { id: '1', name: 'Salary', amount: 20000000, type: 'income', category: 'Work', date: '2024-01-01', icon: 'briefcase' },
  { id: '2', name: 'Coffee', amount: -55000, type: 'expense', category: 'Food', date: '2024-01-02', icon: 'coffee' },
];
`,
    uiPatterns: ["Balance Card", "Transaction List", "Category Chart", "Quick Add"],
    commonFeatures: ["Expense Tracking", "Categories", "Income/Expense", "Reports"],
  },
  {
    id: "food",
    name: "Food & Delivery",
    icon: "Utensils",
    description: "Restaurant, recipes, food delivery",
    color: "#f97316",
    examplePrompts: [
      "App đặt đồ ăn với menu nhà hàng",
      "Cookbook với công thức nấu ăn",
      "Đánh giá nhà hàng quanh đây",
      "Meal planning cho tuần",
    ],
    contextHints: `
FOOD APP UI PATTERNS:
- Restaurant cards: image, name, rating stars, cuisine tags, delivery time
- Horizontal category tabs (All, Pizza, Sushi, Burger, etc.)
- Menu list grouped by category (Appetizers, Main, Drinks)
- Cart bottom bar showing items count and total
- Recipe card: image, title, cook time, difficulty, ingredients count

MOCK DATA EXAMPLE:
const restaurants = [
  { id: '1', name: 'Pizza Palace', image: 'pizza.jpg', rating: 4.5, cuisine: ['Italian', 'Pizza'], deliveryTime: '30-40 min', deliveryFee: 15000 },
];
`,
    uiPatterns: ["Restaurant Cards", "Category Tabs", "Menu List", "Cart Bar"],
    commonFeatures: ["Restaurant Listing", "Menu", "Cart", "Ratings"],
  },
  {
    id: "education",
    name: "Education",
    icon: "BookOpen",
    description: "Learning, courses, flashcards",
    color: "#06b6d4",
    examplePrompts: [
      "App học từ vựng với flashcards",
      "Nền tảng khóa học online",
      "Quiz app cho học sinh",
      "Language learning như Duolingo",
    ],
    contextHints: `
EDUCATION UI PATTERNS:
- Course card: thumbnail, title, progress bar, lesson count
- Lesson list with checkmarks for completed
- Flashcard with flip animation (front/back)
- Quiz: question, 4 answer buttons, progress indicator
- Streak counter and XP display

MOCK DATA EXAMPLE:
const courses = [
  { id: '1', title: 'JavaScript Basics', thumbnail: 'js.jpg', progress: 0.6, lessons: 12, completed: 7 },
];
const flashcards = [
  { id: '1', front: 'Hello', back: 'Xin chào', deck: 'Vietnamese' },
];
`,
    uiPatterns: ["Course Cards", "Flashcard Flip", "Quiz UI", "Progress Bar"],
    commonFeatures: ["Courses", "Lessons", "Flashcards", "Quizzes"],
  },
  {
    id: "travel",
    name: "Travel",
    icon: "Map",
    description: "Trip planning, booking, guides",
    color: "#14b8a6",
    examplePrompts: [
      "App lên kế hoạch du lịch",
      "Đặt khách sạn với so sánh giá",
      "Travel journal với photos",
      "City guide với địa điểm nổi bật",
    ],
    contextHints: `
TRAVEL UI PATTERNS:
- Destination card: large image, name overlay, country flag
- Search with date picker (check-in/check-out)
- Hotel card: image, name, stars, price/night, amenities icons
- Trip itinerary: day-by-day timeline with activities
- Attraction list with distance, open hours

MOCK DATA EXAMPLE:
const destinations = [
  { id: '1', name: 'Da Nang', country: 'Vietnam', image: 'danang.jpg', description: 'Beautiful beaches' },
];
const hotels = [
  { id: '1', name: 'Sunrise Hotel', image: 'hotel1.jpg', stars: 4, price: 1500000, amenities: ['wifi', 'pool', 'gym'] },
];
`,
    uiPatterns: ["Destination Cards", "Date Picker", "Hotel List", "Itinerary Timeline"],
    commonFeatures: ["Trip Planning", "Booking", "Itinerary", "Reviews"],
  },
  {
    id: "entertainment",
    name: "Entertainment",
    icon: "Play",
    description: "Streaming, music, podcasts",
    color: "#ec4899",
    examplePrompts: [
      "Music player với playlist",
      "Podcast app với subscriptions",
      "Movie database như IMDb",
      "Video streaming interface",
    ],
    contextHints: `
ENTERTAINMENT UI PATTERNS:
- Media grid: thumbnails with play button overlay
- Now Playing bar at bottom (mini player)
- Full player: large artwork, title, controls (prev/play/next), progress slider
- Playlist view: numbered list with duration
- Horizontal "Continue Watching" row

MOCK DATA EXAMPLE:
const tracks = [
  { id: '1', title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours', duration: 200, cover: 'cover1.jpg' },
];
const movies = [
  { id: '1', title: 'Inception', year: 2010, rating: 8.8, poster: 'inception.jpg', genre: ['Sci-Fi', 'Action'] },
];
`,
    uiPatterns: ["Media Grid", "Mini Player", "Full Player", "Playlist"],
    commonFeatures: ["Media Playback", "Playlists", "Search", "Library"],
  },
  {
    id: "custom",
    name: "Custom App",
    icon: "Wand2",
    description: "Describe any app you want",
    color: "#7c3aed",
    examplePrompts: ["Mô tả ý tưởng app của bạn..."],
    contextHints: "",
    uiPatterns: [],
    commonFeatures: [],
  },
];

// ============================================
// SYSTEM PROMPT - Học từ Lovable + Expo Skills
// Focus: Beautiful UI first, Supabase optional
// ============================================

export function getEnhancedSystemPrompt(category?: AppCategory): string {
  const basePrompt = `You are 24fit AI, an expert mobile app developer specializing in React Native and Expo.

YOUR MISSION: Create BEAUTIFUL, functional mobile apps from user descriptions.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CRITICAL OUTPUT RULES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Output ONLY valid JavaScript code - NO markdown, NO explanations, NO comments like "// more items here"
2. SINGLE FILE with one default export
3. VERIFY ALL syntax: commas, brackets, quotes, semicolons
4. Include REALISTIC mock data (8-12 items minimum)
5. ALL styles in StyleSheet.create() at the bottom

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ALLOWED IMPORTS (use ONLY these):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, ScrollView,
  TouchableOpacity, TextInput, Image, Modal,
  SafeAreaView, StatusBar, ActivityIndicator, Alert,
  Animated, Dimensions, Platform
} from 'react-native';

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESIGN PHILOSOPHY (Inspired by Apple HIG):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• BEAUTIFUL by default - every app should look professional
• MINIMALIST - clean UI, generous whitespace, clear hierarchy
• CONSISTENT - use design tokens, not random colors
• RESPONSIVE - flexbox layout, no hardcoded dimensions
• DELIGHTFUL - subtle animations, smooth interactions

DESIGN TOKENS:
- Background: #000000 (true black), #0a0a0a (near black), #111111 (cards), #1a1a1a (elevated)
- Primary: #7c3aed (purple), #8b5cf6 (purple light)
- Accent: #10b981 (green), #f59e0b (amber), #ef4444 (red)
- Text: #ffffff (primary), #e5e5e5 (secondary), #a1a1aa (tertiary), #52525b (muted)
- Border: #27272a (subtle), #3f3f46 (visible)
- Radius: 8 (small), 12 (medium), 16 (large), 24 (xl), 9999 (pill)
- Spacing: 4, 8, 12, 16, 20, 24, 32
- Shadow: use backgroundColor with opacity for glow effects

TYPOGRAPHY:
- Title: fontSize 28-32, fontWeight '700'
- Heading: fontSize 20-24, fontWeight '600'
- Body: fontSize 16, fontWeight '400'
- Caption: fontSize 12-14, color: tertiary

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
UI COMPONENT PATTERNS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

LISTS:
• Use FlatList for long lists (NOT ScrollView with .map)
• Include keyExtractor, renderItem
• Add ItemSeparatorComponent for spacing

BUTTONS:
<TouchableOpacity 
  style={styles.button} 
  activeOpacity={0.7}
  onPress={handlePress}
>
  <Text style={styles.buttonText}>Action</Text>
</TouchableOpacity>

CARDS:
<View style={styles.card}>
  <Image source={{uri}} style={styles.cardImage} />
  <View style={styles.cardContent}>
    <Text style={styles.cardTitle}>Title</Text>
    <Text style={styles.cardSubtitle}>Subtitle</Text>
  </View>
</View>

INPUTS:
<TextInput
  style={styles.input}
  placeholder="Search..."
  placeholderTextColor="#52525b"
  value={value}
  onChangeText={setValue}
/>

BADGES:
<View style={[styles.badge, styles.badgeSuccess]}>
  <Text style={styles.badgeText}>Active</Text>
</View>

LOADING:
<ActivityIndicator size="large" color="#7c3aed" />

EMPTY STATE:
<View style={styles.emptyState}>
  <Text style={styles.emptyIcon}>📭</Text>
  <Text style={styles.emptyTitle}>No items yet</Text>
  <Text style={styles.emptySubtitle}>Add your first item to get started</Text>
</View>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CODE TEMPLATE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
import { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, StatusBar, TextInput } from 'react-native';

// REALISTIC MOCK DATA (8-12 items)
const MOCK_DATA = [
  { id: '1', title: 'Item 1', subtitle: 'Description', value: 100 },
  { id: '2', title: 'Item 2', subtitle: 'Description', value: 200 },
  // ... more items (always include full data, never "// more items")
];

export default function App() {
  const [data, setData] = useState(MOCK_DATA);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = data.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>App Title</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          placeholderTextColor="#52525b"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* List */}
      <FlatList
        data={filteredData}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchInput: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#27272a',
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#111111',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#27272a',
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#a1a1aa',
  },
});

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IMPORTANT REMINDERS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• NO backend/database code - this is UI-FIRST approach
• If user asks for login/auth, create a MOCK login screen (no actual auth)
• If user asks for data persistence, use useState with mock data
• Focus on making the UI BEAUTIFUL and FUNCTIONAL
• Always include search/filter functionality where appropriate
• Add loading states and empty states
• Use realistic Vietnamese or English content based on user language`;

  if (category && category.contextHints) {
    return `${basePrompt}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SPECIFIC CONTEXT: ${category.name.toUpperCase()} APP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${category.contextHints}

KEY UI PATTERNS FOR ${category.name.toUpperCase()}:
${category.uiPatterns.map(p => `• ${p}`).join('\n')}

MUST-HAVE FEATURES:
${category.commonFeatures.map(f => `• ${f}`).join('\n')}

Create a BEAUTIFUL, professional ${category.name.toLowerCase()} app with these patterns.
Use the mock data structure provided above.`;
  }

  return basePrompt;
}

// Modify prompt - keep it simple
export function getEnhancedModifyPrompt(): string {
  return `You are 24fit AI. Modify the existing code based on user request.

RULES:
1. Output ONLY valid JavaScript code - NO markdown, NO explanations
2. Return the COMPLETE updated code, not just changes
3. VERIFY all syntax before outputting
4. Keep the same design tokens and patterns
5. All styles in StyleSheet.create() at the bottom

IMPORTANT: Output ONLY code, nothing else.`;
}

// Get category suggestions
export function getCategorySuggestions(categoryId: string): string[] {
  const category = APP_CATEGORIES.find(c => c.id === categoryId);
  if (!category) return [];
  return category.examplePrompts;
}

// Format user prompt
export function formatUserPrompt(userInput: string, category?: AppCategory): string {
  if (!category || category.id === 'custom') {
    return `Create a React Native app: ${userInput}`;
  }
  
  return `Create a ${category.name} mobile app: ${userInput}

Make it look BEAUTIFUL and professional with:
${category.uiPatterns.slice(0, 3).map(p => `• ${p}`).join('\n')}`;
}
