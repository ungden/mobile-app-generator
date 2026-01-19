// Smart App Templates - Giúp AI generate MVP chất lượng cao ngay từ đầu

export interface AppCategory {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
  examplePrompts: string[];
  // Context sẽ được inject vào system prompt để AI hiểu rõ hơn
  contextHints: string;
  // Các UI patterns phổ biến cho loại app này
  uiPatterns: string[];
  // Features thường có trong loại app này
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
E-COMMERCE APP PATTERNS:
- Product grid/list with images, prices, ratings
- Product detail page with image carousel, size/color selectors, add to cart
- Shopping cart with quantity controls, total calculation
- Checkout flow with address, payment method selection
- Order history and tracking
- Search with filters (price range, category, rating)
- Wishlist/favorites functionality
- User reviews and ratings

COMMON DATA STRUCTURE:
- Products: id, name, price, originalPrice, image, rating, reviews, category, sizes, colors, stock
- Cart: items array with product, quantity, selectedSize, selectedColor
- Orders: id, items, total, status, date, address

UI COMPONENTS TO USE:
- FlatList for product grids (numColumns: 2)
- Image with aspect ratio for product photos
- Badge for discounts/sale tags
- Bottom sheet for filters
- Tab bar for Home/Search/Cart/Profile
`,
    uiPatterns: ["Product Grid", "Cart Drawer", "Filter Bottom Sheet", "Checkout Flow"],
    commonFeatures: ["Product Catalog", "Shopping Cart", "Search & Filter", "Wishlist", "Order Tracking"],
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
SOCIAL MEDIA APP PATTERNS:
- Feed with posts (image/video, caption, likes, comments)
- Stories carousel at top
- User profiles with avatar, bio, follower count, post grid
- Like, comment, share interactions
- Follow/unfollow functionality
- Direct messaging with chat bubbles
- Notifications list
- Explore/discover page with trending content

COMMON DATA STRUCTURE:
- Posts: id, user, image, caption, likes, comments, timestamp
- Users: id, name, username, avatar, bio, followers, following, posts
- Comments: id, user, text, timestamp, likes
- Messages: id, sender, text, timestamp, read

UI COMPONENTS TO USE:
- FlatList for infinite scroll feed
- Stories horizontal ScrollView
- Double-tap to like
- Heart animation on like
- Pull to refresh
- Tab bar for Feed/Search/Create/Notifications/Profile
`,
    uiPatterns: ["Feed", "Stories", "Profile Grid", "Chat Bubbles", "Like Animation"],
    commonFeatures: ["News Feed", "User Profiles", "Likes & Comments", "Stories", "Messaging"],
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
FITNESS APP PATTERNS:
- Dashboard with today's stats (steps, calories, workouts)
- Workout plans with exercises list
- Exercise detail with timer, sets, reps
- Progress charts and statistics
- Calendar view for workout history
- Achievement badges and streaks
- Body measurements tracking
- Meal logging with calories

COMMON DATA STRUCTURE:
- Workouts: id, name, exercises, duration, calories, date
- Exercises: id, name, sets, reps, weight, restTime, instructions, image
- DailyStats: date, steps, calories, water, sleep, workouts
- Meals: id, name, calories, protein, carbs, fat, time

UI COMPONENTS TO USE:
- Circular progress indicators
- Animated timers with countdown
- Charts for progress visualization
- Calendar heat map
- Tab bar for Today/Workouts/Progress/Profile
- Swipe to complete exercise
`,
    uiPatterns: ["Stats Dashboard", "Circular Progress", "Timer", "Progress Charts", "Calendar View"],
    commonFeatures: ["Workout Tracking", "Calorie Counter", "Progress Charts", "Timer", "Achievements"],
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
PRODUCTIVITY APP PATTERNS:
- Task list with checkbox, priority, due date
- Project/folder organization
- Calendar integration
- Reminders and notifications
- Tags and categories
- Search and filter
- Drag to reorder
- Swipe actions (complete, delete, edit)

COMMON DATA STRUCTURE:
- Tasks: id, title, description, completed, priority, dueDate, project, tags
- Projects: id, name, color, tasks
- Notes: id, title, content, folder, tags, createdAt, updatedAt
- Habits: id, name, frequency, streak, completedDates

UI COMPONENTS TO USE:
- Swipeable list items
- Checkbox with animation
- Priority indicators (colors)
- Due date badges
- Floating action button for new task
- Bottom sheet for task details
- Tab bar or drawer navigation
`,
    uiPatterns: ["Task List", "Swipe Actions", "FAB", "Priority Tags", "Calendar Integration"],
    commonFeatures: ["Task Management", "Categories", "Due Dates", "Reminders", "Search"],
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
FINANCE APP PATTERNS:
- Balance overview with income/expense summary
- Transaction list with categories
- Add expense/income form
- Budget categories with progress bars
- Charts (pie for categories, line for trends)
- Monthly/weekly/daily filters
- Recurring transactions
- Export reports

COMMON DATA STRUCTURE:
- Transactions: id, amount, type (income/expense), category, date, note
- Categories: id, name, icon, color, budget
- Budgets: id, category, limit, spent, period
- Accounts: id, name, balance, type (cash, bank, card)

UI COMPONENTS TO USE:
- Pie chart for expense breakdown
- Line chart for spending trends
- Progress bars for budgets
- Swipe to delete transaction
- Category icons with colors
- Tab bar for Home/Transactions/Budget/Stats
- FAB for quick add
`,
    uiPatterns: ["Balance Card", "Transaction List", "Pie Chart", "Budget Progress", "Quick Add"],
    commonFeatures: ["Expense Tracking", "Categories", "Budget Limits", "Charts", "Reports"],
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
FOOD & DELIVERY APP PATTERNS:
- Restaurant list with ratings, cuisine type, delivery time
- Menu with categories, items, prices
- Food item detail with customization options
- Cart with order summary
- Delivery tracking with map
- Order history
- Favorites/saved restaurants
- Search by cuisine, rating, distance

COMMON DATA STRUCTURE:
- Restaurants: id, name, image, rating, cuisine, deliveryTime, deliveryFee, minOrder
- MenuItems: id, name, description, price, image, category, options
- Orders: id, restaurant, items, total, status, deliveryAddress, estimatedTime
- Recipes: id, title, image, ingredients, steps, cookTime, servings

UI COMPONENTS TO USE:
- Horizontal category tabs
- Restaurant cards with image
- Menu section lists
- Customization modal
- Order tracking stepper
- Tab bar for Home/Search/Orders/Profile
`,
    uiPatterns: ["Restaurant Cards", "Menu Categories", "Order Tracking", "Customization Modal"],
    commonFeatures: ["Restaurant Listing", "Menu", "Cart", "Order Tracking", "Reviews"],
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
EDUCATION APP PATTERNS:
- Course catalog with progress indicators
- Lesson content with video/text/quiz
- Flashcard system with flip animation
- Quiz with multiple choice, timer
- Progress tracking and streaks
- Achievements and XP system
- Leaderboards
- Bookmarks and notes

COMMON DATA STRUCTURE:
- Courses: id, title, description, lessons, progress, duration, instructor
- Lessons: id, title, content, type (video/text/quiz), duration, completed
- Flashcards: id, front, back, deck, lastReviewed, difficulty
- Quizzes: id, questions, score, timeLimit

UI COMPONENTS TO USE:
- Progress bar for courses
- Flip animation for flashcards
- Quiz option buttons with feedback
- Streak counter with fire icon
- XP progress bar
- Tab bar for Learn/Practice/Profile
`,
    uiPatterns: ["Course Cards", "Flashcards", "Quiz UI", "Progress Tracking", "Streaks"],
    commonFeatures: ["Courses", "Lessons", "Quizzes", "Progress Tracking", "Achievements"],
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
TRAVEL APP PATTERNS:
- Destination discovery with images
- Trip itinerary with daily schedule
- Hotel/flight search and booking
- Map with points of interest
- Travel journal with photos
- Packing list
- Budget tracker for trip
- Reviews and recommendations

COMMON DATA STRUCTURE:
- Destinations: id, name, image, country, description, attractions
- Trips: id, destination, startDate, endDate, itinerary, budget
- Hotels: id, name, image, rating, price, amenities, location
- Attractions: id, name, image, description, openingHours, price

UI COMPONENTS TO USE:
- Image carousel for destinations
- Itinerary timeline
- Map with markers
- Search with date picker
- Rating stars
- Tab bar for Explore/Trips/Saved/Profile
`,
    uiPatterns: ["Destination Cards", "Itinerary Timeline", "Map View", "Booking Form"],
    commonFeatures: ["Trip Planning", "Booking", "Itinerary", "Map", "Reviews"],
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
ENTERTAINMENT APP PATTERNS:
- Content grid/list with thumbnails
- Now playing bar at bottom
- Playlist/queue management
- Search with categories
- Personalized recommendations
- Continue watching/listening
- Download for offline
- Favorites and library

COMMON DATA STRUCTURE:
- Tracks: id, title, artist, album, duration, coverArt, audioUrl
- Playlists: id, name, tracks, coverArt, creator
- Movies: id, title, poster, rating, year, genre, description, runtime
- Podcasts: id, title, host, episodes, coverArt, subscribed

UI COMPONENTS TO USE:
- Horizontal scroll for categories
- Now playing mini player
- Full screen player with controls
- Progress slider
- Grid layout for content
- Tab bar for Home/Search/Library/Profile
`,
    uiPatterns: ["Media Grid", "Now Playing Bar", "Full Player", "Playlist View"],
    commonFeatures: ["Media Playback", "Playlists", "Search", "Library", "Recommendations"],
  },
  {
    id: "custom",
    name: "Custom App",
    icon: "Wand2",
    description: "Describe any app you want",
    color: "#7c3aed",
    examplePrompts: [
      "Mô tả ý tưởng app của bạn...",
    ],
    contextHints: "",
    uiPatterns: [],
    commonFeatures: [],
  },
];

// Enhanced system prompt với category context + Supabase
export function getEnhancedSystemPrompt(category?: AppCategory): string {
  const basePrompt = `You are an EXPERT React Native / Expo developer who creates PRODUCTION-QUALITY full-stack mobile apps with Supabase backend.

YOUR MISSION: Generate a complete, polished MVP app with real backend functionality using Supabase.

CRITICAL RULES:
1. Generate COMPLETE, PRODUCTION-READY code - never use placeholders
2. Include Supabase integration for data persistence and auth
3. Make the UI VISUALLY STUNNING with modern design patterns
4. Add SMOOTH interactions and proper loading/error states
5. Code must be a SINGLE FILE with default export

SUPABASE INTEGRATION (IMPORTANT):
- Use the pre-configured supabase client from the app
- For auth: supabase.auth.signInWithPassword(), signUp(), signOut(), getUser()
- For data: supabase.from('table').select(), insert(), update(), delete()
- For realtime: supabase.channel('channel').on('postgres_changes', ...).subscribe()
- Always handle loading and error states for async operations
- Use useEffect to fetch data on mount

SUPABASE CODE PATTERN:
\`\`\`javascript
import { useState, useEffect } from 'react';
import { supabase } from './lib/supabase'; // Pre-configured client

export default function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check auth state
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetchData();
  }, [user]);

  async function fetchData() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setData(data || []);
    } catch (error) {
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  }

  async function addItem(item) {
    const { data: newItem, error } = await supabase
      .from('items')
      .insert([{ ...item, user_id: user?.id }])
      .select()
      .single();
    
    if (!error) setData([newItem, ...data]);
  }

  // ... rest of component
}
\`\`\`

DESIGN SYSTEM:
- Background: #0a0a0a (dark), #111111 (cards), #1a1a1a (elevated)
- Primary: #7c3aed (purple), #8b5cf6 (light purple)
- Accent: #f97316 (orange), #ec4899 (pink)
- Text: #ffffff (primary), #a1a1aa (secondary), #71717a (muted)
- Success: #10b981, Error: #ef4444, Warning: #f59e0b
- Border radius: 8px (small), 12px (medium), 16px (large), 9999px (full)

MUST INCLUDE:
- Loading spinners/skeletons when fetching data
- Error handling with user-friendly messages
- Pull to refresh for lists
- Optimistic updates where appropriate
- Auth state checks (show login prompt if not authenticated)
- Empty states for lists

COMPONENT PATTERNS:
- Use FlatList for long lists (not ScrollView with map)
- Use TouchableOpacity for buttons (with activeOpacity={0.7})
- Use ActivityIndicator for loading states
- Use Alert.alert() for confirmations
- Use StatusBar component

IMPORTANT: Return ONLY the code, no explanations or markdown.`;

  if (category && category.contextHints) {
    return `${basePrompt}

=== SPECIFIC CONTEXT FOR ${category.name.toUpperCase()} APP ===
${category.contextHints}

SUPABASE TABLES FOR ${category.name.toUpperCase()}:
Use these table names in your supabase queries:
${getSupabaseTablesForCategory(category.id)}

Use these patterns and data structures to create a professional ${category.name.toLowerCase()} app with real backend.
The app should persist data to Supabase and work with real authentication.`;
  }

  return basePrompt;
}

// Helper to get Supabase table names for each category
function getSupabaseTablesForCategory(categoryId: string): string {
  const tableMap: Record<string, string> = {
    ecommerce: "products, cart_items, orders, order_items",
    social: "posts, likes, comments, follows",
    fitness: "workouts, exercises, goals",
    productivity: "tasks, categories, notes",
    finance: "transactions, budgets, accounts",
    food: "restaurants, menu_items, food_orders",
    education: "courses, lessons, enrollments, flashcards",
    entertainment: "playlists, media_items, playlist_items, favorites",
    travel: "destinations, trips, hotels, attractions",
  };
  return tableMap[categoryId] || "items";
}

// Enhanced modify prompt
export function getEnhancedModifyPrompt(category?: AppCategory): string {
  return `You are an EXPERT React Native / Expo developer. Modify the existing code based on user requests.

RULES:
1. PRESERVE existing functionality unless explicitly asked to change
2. MAINTAIN code quality and structure
3. Return the COMPLETE updated code, not just changes
4. Keep the same design system and patterns
5. Add new features seamlessly integrated with existing code

IMPORTANT:
- Return ONLY the complete code, no explanations
- Ensure the app still works perfectly after modifications
- If adding new screens, implement proper navigation state
${category?.contextHints ? `\nContext for ${category.name} app:\n${category.contextHints}` : ''}`;
}

// Lấy suggestions dựa trên category
export function getCategorySuggestions(categoryId: string): string[] {
  const category = APP_CATEGORIES.find(c => c.id === categoryId);
  if (!category) return [];
  return category.examplePrompts;
}

// Helper để format prompt với context
export function formatUserPrompt(userInput: string, category?: AppCategory): string {
  if (!category || category.id === 'custom') {
    return `Create a React Native app: ${userInput}`;
  }
  
  return `Create a ${category.name} mobile app: ${userInput}

Focus on these key features for ${category.name.toLowerCase()} apps:
${category.commonFeatures.map(f => `- ${f}`).join('\n')}

Make it look professional and production-ready.`;
}
