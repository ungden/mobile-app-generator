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
⚠️ CRITICAL SYNTAX RULES (MOST IMPORTANT):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. EVERY property in StyleSheet MUST end with a COMMA (except the last one in each block)
2. EVERY style block MUST end with }, (comma after closing brace) except the last block
3. VERIFY bracket pairs: { } ( ) [ ] must ALL match
4. NO trailing commas after the last property before }
5. Strings MUST be properly quoted and terminated

CORRECT StyleSheet example:
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',  // <-- comma
  },  // <-- comma after block
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',  // <-- comma
  },  // <-- comma after block  
  lastStyle: {
    padding: 16,
  },  // <-- NO comma needed (last block)
});

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OUTPUT RULES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Output ONLY valid JavaScript code - NO markdown, NO explanations
2. SINGLE FILE with one default export
3. Keep code UNDER 400 lines - be concise
4. Include 5-8 mock data items (not more)
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
• Keep the app SIMPLE - one main screen with key features
• Use realistic Vietnamese or English content based on user language

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚠️ BEFORE OUTPUTTING - VERIFY CHECKLIST:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
□ All { have matching }
□ All ( have matching )
□ All [ have matching ]
□ All strings are properly closed with matching quotes
□ All style properties end with commas (except last in block)
□ All style blocks end with }, (except the very last one)
□ Code has export default function App()
□ Code ends with });`;

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

⚠️ CRITICAL SYNTAX RULES:
1. EVERY property in StyleSheet MUST end with a COMMA (except the last one in each block)
2. EVERY style block MUST end with }, (comma after closing brace) except the last block
3. VERIFY all brackets match: { } ( ) [ ]
4. All strings must be properly quoted

OUTPUT RULES:
1. Output ONLY valid JavaScript code - NO markdown, NO explanations
2. Return the COMPLETE updated code, not just changes
3. Keep code UNDER 400 lines
4. All styles in StyleSheet.create() at the bottom

⚠️ BEFORE OUTPUTTING - VERIFY:
□ All brackets match
□ All commas are in place in StyleSheet
□ Code ends with });

Output ONLY the code.`;
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

// ============================================
// COMPLETE PROJECT TEMPLATES
// For new JSON-based multi-file generation
// ============================================

export interface ProjectTemplate {
  appName: string;
  description: string;
  files: Record<string, string>;
  dependencies: Record<string, string>;
}

/**
 * Get a complete project template by category
 */
export function getProjectTemplate(categoryId: string): ProjectTemplate | null {
  return PROJECT_TEMPLATES[categoryId] || null;
}

/**
 * Complete multi-file project templates
 */
export const PROJECT_TEMPLATES: Record<string, ProjectTemplate> = {
  fitness: {
    appName: "FitTrack",
    description: "A fitness tracking app with workouts, progress, and daily goals",
    files: {
      "App.js": `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import WorkoutScreen from './screens/WorkoutScreen';
import ProgressScreen from './screens/ProgressScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0a0a0a' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Workout" component={WorkoutScreen} />
        <Stack.Screen name="Progress" component={ProgressScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}`,
      "screens/HomeScreen.js": `import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Colors from '../constants/Colors';
import StatsCard from '../components/StatsCard';
import WorkoutCard from '../components/WorkoutCard';

const DAILY_STATS = {
  steps: 8432,
  stepsGoal: 10000,
  calories: 1850,
  caloriesGoal: 2200,
  water: 6,
  waterGoal: 8,
  activeMinutes: 45,
  activeGoal: 60,
};

const WORKOUTS = [
  { id: '1', name: 'Morning Run', duration: 30, calories: 320, type: 'cardio' },
  { id: '2', name: 'Upper Body', duration: 45, calories: 280, type: 'strength' },
  { id: '3', name: 'Yoga Flow', duration: 20, calories: 120, type: 'flexibility' },
  { id: '4', name: 'HIIT Session', duration: 25, calories: 350, type: 'cardio' },
];

export default function HomeScreen({ navigation }) {
  const [stats] = useState(DAILY_STATS);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good Morning!</Text>
          <Text style={styles.title}>Let's crush your goals</Text>
        </View>
        <TouchableOpacity 
          style={styles.progressButton}
          onPress={() => navigation.navigate('Progress')}
        >
          <Text style={styles.progressButtonText}>Stats</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          <StatsCard
            icon="👟"
            label="Steps"
            value={stats.steps.toLocaleString()}
            goal={stats.stepsGoal}
            progress={stats.steps / stats.stepsGoal}
            color={Colors.primary}
          />
          <StatsCard
            icon="🔥"
            label="Calories"
            value={stats.calories.toString()}
            goal={stats.caloriesGoal}
            progress={stats.calories / stats.caloriesGoal}
            color={Colors.warning}
          />
          <StatsCard
            icon="💧"
            label="Water"
            value={\`\${stats.water} cups\`}
            goal={stats.waterGoal}
            progress={stats.water / stats.waterGoal}
            color={Colors.info}
          />
          <StatsCard
            icon="⏱️"
            label="Active"
            value={\`\${stats.activeMinutes} min\`}
            goal={stats.activeGoal}
            progress={stats.activeMinutes / stats.activeGoal}
            color={Colors.success}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Workouts</Text>
          {WORKOUTS.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onPress={() => navigation.navigate('Workout', { workout })}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 4,
  },
  progressButton: {
    backgroundColor: Colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  progressButtonText: {
    color: Colors.text,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingTop: 16,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
});`,
      "screens/WorkoutScreen.js": `import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import Colors from '../constants/Colors';

export default function WorkoutScreen({ route, navigation }) {
  const { workout } = route.params;
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(workout.duration * 60);

  useEffect(() => {
    let interval = null;
    if (isRunning && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(s => s - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, seconds]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return \`\${mins.toString().padStart(2, '0')}:\${remainingSecs.toString().padStart(2, '0')}\`;
  };

  const progress = 1 - (seconds / (workout.duration * 60));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.workoutName}>{workout.name}</Text>
        <Text style={styles.workoutType}>{workout.type.toUpperCase()}</Text>

        <View style={styles.timerContainer}>
          <View style={[styles.progressRing, { borderColor: Colors.primary }]}>
            <Text style={styles.timerText}>{formatTime(seconds)}</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{workout.calories}</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statValue}>{workout.duration}</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, isRunning && styles.pauseButton]}
            onPress={() => setIsRunning(!isRunning)}
          >
            <Text style={styles.controlButtonText}>
              {isRunning ? 'PAUSE' : 'START'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.resetButton}
            onPress={() => {
              setIsRunning(false);
              setSeconds(workout.duration * 60);
            }}
          >
            <Text style={styles.resetButtonText}>RESET</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backButton: {
    padding: 20,
  },
  backText: {
    color: Colors.primary,
    fontSize: 16,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  workoutName: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  workoutType: {
    fontSize: 14,
    color: Colors.textMuted,
    letterSpacing: 2,
  },
  timerContainer: {
    marginVertical: 48,
  },
  progressRing: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.card,
  },
  timerText: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.text,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 48,
    marginBottom: 48,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
  },
  controls: {
    width: '100%',
    gap: 16,
  },
  controlButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  pauseButton: {
    backgroundColor: Colors.warning,
  },
  controlButtonText: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  resetButton: {
    backgroundColor: 'transparent',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  resetButtonText: {
    color: Colors.textMuted,
    fontSize: 16,
    fontWeight: '600',
  },
});`,
      "screens/ProgressScreen.js": `import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Colors from '../constants/Colors';

const WEEKLY_DATA = [
  { day: 'Mon', steps: 8500, calories: 1900 },
  { day: 'Tue', steps: 10200, calories: 2100 },
  { day: 'Wed', steps: 7800, calories: 1750 },
  { day: 'Thu', steps: 9100, calories: 2000 },
  { day: 'Fri', steps: 11500, calories: 2300 },
  { day: 'Sat', steps: 6200, calories: 1500 },
  { day: 'Sun', steps: 8432, calories: 1850 },
];

export default function ProgressScreen({ navigation }) {
  const maxSteps = Math.max(...WEEKLY_DATA.map(d => d.steps));
  const totalSteps = WEEKLY_DATA.reduce((sum, d) => sum + d.steps, 0);
  const avgSteps = Math.round(totalSteps / 7);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Weekly Progress</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{totalSteps.toLocaleString()}</Text>
            <Text style={styles.summaryLabel}>Total Steps</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{avgSteps.toLocaleString()}</Text>
            <Text style={styles.summaryLabel}>Daily Average</Text>
          </View>
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Steps This Week</Text>
          <View style={styles.chart}>
            {WEEKLY_DATA.map((data, index) => (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height: \`\${(data.steps / maxSteps) * 100}%\`,
                        backgroundColor: data.day === 'Sun' ? Colors.primary : Colors.elevated,
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.barLabel}>{data.day}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.detailsSection}>
          <Text style={styles.sectionTitle}>Daily Breakdown</Text>
          {WEEKLY_DATA.map((data, index) => (
            <View key={index} style={styles.detailRow}>
              <Text style={styles.detailDay}>{data.day}</Text>
              <View style={styles.detailStats}>
                <Text style={styles.detailSteps}>{data.steps.toLocaleString()} steps</Text>
                <Text style={styles.detailCalories}>{data.calories} cal</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  backText: {
    color: Colors.primary,
    fontSize: 16,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    margin: 20,
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
  },
  divider: {
    width: 1,
    backgroundColor: Colors.border,
  },
  chartSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    height: 100,
    width: 24,
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderRadius: 4,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 8,
  },
  detailsSection: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailDay: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  detailStats: {
    alignItems: 'flex-end',
  },
  detailSteps: {
    fontSize: 16,
    color: Colors.text,
  },
  detailCalories: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 2,
  },
});`,
      "components/StatsCard.js": `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

export default function StatsCard({ icon, label, value, goal, progress, color }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.label}>{label}</Text>
      </View>
      <Text style={styles.value}>{value}</Text>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { 
              width: \`\${Math.min(progress * 100, 100)}%\`,
              backgroundColor: color,
            }
          ]} 
        />
      </View>
      <Text style={styles.goal}>Goal: {goal}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '50%',
    padding: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  value: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 8,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.elevated,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  goal: {
    fontSize: 12,
    color: Colors.textMuted,
  },
});`,
      "components/WorkoutCard.js": `import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

const TYPE_ICONS = {
  cardio: '🏃',
  strength: '💪',
  flexibility: '🧘',
};

const TYPE_COLORS = {
  cardio: Colors.error,
  strength: Colors.primary,
  flexibility: Colors.success,
};

export default function WorkoutCard({ workout, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.iconContainer, { backgroundColor: TYPE_COLORS[workout.type] + '20' }]}>
        <Text style={styles.icon}>{TYPE_ICONS[workout.type]}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{workout.name}</Text>
        <Text style={styles.details}>
          {workout.duration} min • {workout.calories} cal
        </Text>
      </View>
      <View style={[styles.badge, { backgroundColor: TYPE_COLORS[workout.type] + '20' }]}>
        <Text style={[styles.badgeText, { color: TYPE_COLORS[workout.type] }]}>
          {workout.type}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  details: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});`,
      "constants/Colors.js": `export default {
  background: '#0a0a0a',
  card: '#111111',
  elevated: '#1a1a1a',
  
  primary: '#7c3aed',
  primaryLight: '#8b5cf6',
  
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  text: '#ffffff',
  textSecondary: '#e5e5e5',
  textMuted: '#a1a1aa',
  
  border: '#27272a',
};`,
    },
    dependencies: {
      "@react-navigation/native": "6.x",
      "@react-navigation/native-stack": "6.x",
      "react-native-screens": "~3.29.0",
      "react-native-safe-area-context": "4.8.2",
    },
  },

  productivity: {
    appName: "TaskFlow",
    description: "A task management app with categories, priorities, and due dates",
    files: {
      "App.js": `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import AddTaskScreen from './screens/AddTaskScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0a0a0a' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddTask" component={AddTaskScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}`,
      "screens/HomeScreen.js": `import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Colors from '../constants/Colors';
import TaskItem from '../components/TaskItem';

const INITIAL_TASKS = [
  { id: '1', title: 'Review pull request', completed: false, priority: 'high', category: 'Work', dueDate: '2024-01-15' },
  { id: '2', title: 'Buy groceries', completed: true, priority: 'medium', category: 'Personal', dueDate: '2024-01-14' },
  { id: '3', title: 'Prepare presentation', completed: false, priority: 'high', category: 'Work', dueDate: '2024-01-16' },
  { id: '4', title: 'Call mom', completed: false, priority: 'low', category: 'Personal', dueDate: null },
  { id: '5', title: 'Gym workout', completed: true, priority: 'medium', category: 'Health', dueDate: '2024-01-14' },
  { id: '6', title: 'Read book chapter', completed: false, priority: 'low', category: 'Personal', dueDate: '2024-01-17' },
];

const CATEGORIES = ['All', 'Work', 'Personal', 'Health'];

export default function HomeScreen({ navigation }) {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredTasks = selectedCategory === 'All' 
    ? tasks 
    : tasks.filter(t => t.category === selectedCategory);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Today</Text>
          <Text style={styles.subtitle}>{completedCount} of {tasks.length} completed</Text>
        </View>
      </View>

      <View style={styles.categories}>
        {CATEGORIES.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryChip,
              selectedCategory === cat && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === cat && styles.categoryTextActive,
            ]}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskItem 
            task={item} 
            onToggle={() => toggleTask(item.id)}
            onDelete={() => deleteTask(item.id)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>✅</Text>
            <Text style={styles.emptyTitle}>All done!</Text>
            <Text style={styles.emptySubtitle}>No tasks in this category</Text>
          </View>
        }
      />

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('AddTask')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 4,
  },
  categories: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: Colors.text,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    color: Colors.text,
    fontWeight: '300',
  },
});`,
      "screens/AddTaskScreen.js": `import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Colors from '../constants/Colors';

const PRIORITIES = ['low', 'medium', 'high'];
const CATEGORIES = ['Work', 'Personal', 'Health'];

export default function AddTaskScreen({ navigation }) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [category, setCategory] = useState('Personal');

  const handleSave = () => {
    if (title.trim()) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>New Task</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={[styles.saveText, !title.trim() && styles.saveDisabled]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="What needs to be done?"
            placeholderTextColor={Colors.textMuted}
            value={title}
            onChangeText={setTitle}
            autoFocus
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Priority</Text>
          <View style={styles.optionRow}>
            {PRIORITIES.map((p) => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.optionButton,
                  priority === p && styles.optionButtonActive,
                  priority === p && { borderColor: Colors[p === 'high' ? 'error' : p === 'medium' ? 'warning' : 'success'] },
                ]}
                onPress={() => setPriority(p)}
              >
                <View style={[
                  styles.priorityDot,
                  { backgroundColor: Colors[p === 'high' ? 'error' : p === 'medium' ? 'warning' : 'success'] }
                ]} />
                <Text style={[
                  styles.optionText,
                  priority === p && styles.optionTextActive,
                ]}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.optionRow}>
            {CATEGORIES.map((c) => (
              <TouchableOpacity
                key={c}
                style={[
                  styles.optionButton,
                  category === c && styles.optionButtonActive,
                ]}
                onPress={() => setCategory(c)}
              >
                <Text style={[
                  styles.optionText,
                  category === c && styles.optionTextActive,
                ]}>
                  {c}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  cancelText: {
    color: Colors.textMuted,
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  saveText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  saveDisabled: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  optionButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '15',
  },
  optionText: {
    color: Colors.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  optionTextActive: {
    color: Colors.text,
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
});`,
      "components/TaskItem.js": `import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';

const PRIORITY_COLORS = {
  high: Colors.error,
  medium: Colors.warning,
  low: Colors.success,
};

export default function TaskItem({ task, onToggle, onDelete }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.checkbox} onPress={onToggle}>
        <View style={[
          styles.checkboxInner,
          task.completed && styles.checkboxChecked,
        ]}>
          {task.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={[styles.title, task.completed && styles.titleCompleted]}>
          {task.title}
        </Text>
        <View style={styles.meta}>
          <View style={[styles.priorityDot, { backgroundColor: PRIORITY_COLORS[task.priority] }]} />
          <Text style={styles.category}>{task.category}</Text>
          {task.dueDate && (
            <Text style={styles.dueDate}>Due {task.dueDate}</Text>
          )}
        </View>
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
        <Text style={styles.deleteText}>×</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  checkbox: {
    marginRight: 16,
  },
  checkboxInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  checkmark: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priorityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  category: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  dueDate: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  deleteButton: {
    padding: 8,
  },
  deleteText: {
    fontSize: 24,
    color: Colors.textMuted,
    fontWeight: '300',
  },
});`,
      "constants/Colors.js": `export default {
  background: '#0a0a0a',
  card: '#111111',
  elevated: '#1a1a1a',
  
  primary: '#7c3aed',
  primaryLight: '#8b5cf6',
  
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  text: '#ffffff',
  textSecondary: '#e5e5e5',
  textMuted: '#a1a1aa',
  
  border: '#27272a',
};`,
    },
    dependencies: {
      "@react-navigation/native": "6.x",
      "@react-navigation/native-stack": "6.x",
      "react-native-screens": "~3.29.0",
      "react-native-safe-area-context": "4.8.2",
    },
  },

  finance: {
    appName: "MoneyTrack",
    description: "Personal finance tracker with transactions, balance overview, and categories",
    files: {
      "App.js": `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import AddTransactionScreen from './screens/AddTransactionScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0a0a0a' },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}`,
      "screens/HomeScreen.js": `import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Colors from '../constants/Colors';
import BalanceCard from '../components/BalanceCard';
import TransactionItem from '../components/TransactionItem';

const TRANSACTIONS = [
  { id: '1', name: 'Salary', amount: 20000000, type: 'income', category: 'Work', date: 'Jan 1', icon: '💼' },
  { id: '2', name: 'Coffee', amount: 55000, type: 'expense', category: 'Food', date: 'Jan 2', icon: '☕' },
  { id: '3', name: 'Grocery', amount: 350000, type: 'expense', category: 'Shopping', date: 'Jan 3', icon: '🛒' },
  { id: '4', name: 'Freelance', amount: 5000000, type: 'income', category: 'Work', date: 'Jan 4', icon: '💻' },
  { id: '5', name: 'Electric Bill', amount: 450000, type: 'expense', category: 'Bills', date: 'Jan 5', icon: '⚡' },
  { id: '6', name: 'Dinner', amount: 280000, type: 'expense', category: 'Food', date: 'Jan 6', icon: '🍜' },
  { id: '7', name: 'Netflix', amount: 180000, type: 'expense', category: 'Entertainment', date: 'Jan 7', icon: '🎬' },
];

export default function HomeScreen({ navigation }) {
  const [transactions] = useState(TRANSACTIONS);

  const income = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expense;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning!</Text>
        <Text style={styles.title}>Finance Overview</Text>
      </View>

      <BalanceCard balance={balance} income={income} expense={expense} />

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionItem transaction={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.list}
        />
      </View>

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('AddTransaction')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  greeting: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 4,
  },
  section: {
    flex: 1,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  seeAll: {
    fontSize: 14,
    color: Colors.primary,
  },
  list: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    color: Colors.text,
    fontWeight: '300',
  },
});`,
      "screens/AddTransactionScreen.js": `import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Colors from '../constants/Colors';

const CATEGORIES = [
  { id: 'food', name: 'Food', icon: '🍔' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️' },
  { id: 'transport', name: 'Transport', icon: '🚗' },
  { id: 'bills', name: 'Bills', icon: '📄' },
  { id: 'entertainment', name: 'Entertainment', icon: '🎮' },
  { id: 'work', name: 'Work', icon: '💼' },
];

export default function AddTransactionScreen({ navigation }) {
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('expense');
  const [category, setCategory] = useState(null);
  const [note, setNote] = useState('');

  const handleSave = () => {
    if (amount && category) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Add Transaction</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={[styles.saveText, (!amount || !category) && styles.saveDisabled]}>
            Save
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.amountSection}>
          <Text style={styles.currencySymbol}>$</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0"
            placeholderTextColor={Colors.textMuted}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.typeToggle}>
          <TouchableOpacity
            style={[styles.typeButton, type === 'expense' && styles.typeButtonActive]}
            onPress={() => setType('expense')}
          >
            <Text style={[styles.typeText, type === 'expense' && styles.typeTextActive]}>
              Expense
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, type === 'income' && styles.incomeButtonActive]}
            onPress={() => setType('income')}
          >
            <Text style={[styles.typeText, type === 'income' && styles.typeTextActive]}>
              Income
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Category</Text>
          <View style={styles.categories}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.categoryButton,
                  category?.id === cat.id && styles.categoryButtonActive,
                ]}
                onPress={() => setCategory(cat)}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text style={[
                  styles.categoryName,
                  category?.id === cat.id && styles.categoryNameActive,
                ]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Note (Optional)</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="Add a note..."
            placeholderTextColor={Colors.textMuted}
            value={note}
            onChangeText={setNote}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  cancelText: {
    color: Colors.textMuted,
    fontSize: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  saveText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  saveDisabled: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  amountSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 32,
  },
  currencySymbol: {
    fontSize: 48,
    fontWeight: '300',
    color: Colors.textMuted,
    marginRight: 8,
  },
  amountInput: {
    fontSize: 64,
    fontWeight: '700',
    color: Colors.text,
    minWidth: 100,
  },
  typeToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  typeButtonActive: {
    backgroundColor: Colors.error,
  },
  incomeButtonActive: {
    backgroundColor: Colors.success,
  },
  typeText: {
    color: Colors.textMuted,
    fontWeight: '600',
  },
  typeTextActive: {
    color: Colors.text,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: Colors.textMuted,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryButton: {
    width: '30%',
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '15',
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  categoryNameActive: {
    color: Colors.text,
  },
  noteInput: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});`,
      "components/BalanceCard.js": `import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
};

export default function BalanceCard({ balance, income, expense }) {
  return (
    <View style={styles.card}>
      <Text style={styles.balanceLabel}>Total Balance</Text>
      <Text style={styles.balanceAmount}>{formatCurrency(balance)}</Text>
      
      <View style={styles.row}>
        <View style={styles.stat}>
          <View style={[styles.indicator, styles.incomeIndicator]} />
          <View>
            <Text style={styles.statLabel}>Income</Text>
            <Text style={styles.statAmount}>+{formatCurrency(income)}</Text>
          </View>
        </View>
        <View style={styles.stat}>
          <View style={[styles.indicator, styles.expenseIndicator]} />
          <View>
            <Text style={styles.statLabel}>Expense</Text>
            <Text style={styles.statAmount}>-{formatCurrency(expense)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 20,
    padding: 24,
    backgroundColor: Colors.primary,
    borderRadius: 24,
  },
  balanceLabel: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 8,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 32,
    borderRadius: 4,
    marginRight: 12,
  },
  incomeIndicator: {
    backgroundColor: Colors.success,
  },
  expenseIndicator: {
    backgroundColor: Colors.error,
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
  },
  statAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 2,
  },
});`,
      "components/TransactionItem.js": `import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Colors from '../constants/Colors';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN').format(amount);
};

export default function TransactionItem({ transaction }) {
  const isIncome = transaction.type === 'income';

  return (
    <TouchableOpacity style={styles.container} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{transaction.icon}</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.name}>{transaction.name}</Text>
        <Text style={styles.category}>{transaction.category} • {transaction.date}</Text>
      </View>
      
      <Text style={[styles.amount, isIncome ? styles.income : styles.expense]}>
        {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.elevated,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  category: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  amount: {
    fontSize: 16,
    fontWeight: '600',
  },
  income: {
    color: Colors.success,
  },
  expense: {
    color: Colors.error,
  },
});`,
      "constants/Colors.js": `export default {
  background: '#0a0a0a',
  card: '#111111',
  elevated: '#1a1a1a',
  
  primary: '#7c3aed',
  primaryLight: '#8b5cf6',
  
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  text: '#ffffff',
  textSecondary: '#e5e5e5',
  textMuted: '#a1a1aa',
  
  border: '#27272a',
};`,
    },
    dependencies: {
      "@react-navigation/native": "6.x",
      "@react-navigation/native-stack": "6.x",
      "react-native-screens": "~3.29.0",
      "react-native-safe-area-context": "4.8.2",
    },
  },
};
