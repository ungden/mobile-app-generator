/**
 * Supabase Schema Templates for 24fit
 * 
 * These templates are used by AI to generate appropriate database schemas
 * based on the app category and user requirements.
 */

export interface SchemaTemplate {
  categoryId: string;
  tables: TableDefinition[];
  rlsPolicies: string[];
  functions?: string[];
  triggers?: string[];
  description: string;
}

export interface TableDefinition {
  name: string;
  columns: ColumnDefinition[];
  description: string;
}

export interface ColumnDefinition {
  name: string;
  type: string;
  constraints?: string;
  description: string;
}

// Base tables that every app needs
export const BASE_SCHEMA = `
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profile policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
`;

// Category-specific schema templates
export const CATEGORY_SCHEMAS: Record<string, SchemaTemplate> = {
  ecommerce: {
    categoryId: "ecommerce",
    description: "E-commerce app with products, cart, orders",
    tables: [
      {
        name: "products",
        description: "Store products/items for sale",
        columns: [
          { name: "id", type: "UUID DEFAULT gen_random_uuid() PRIMARY KEY", description: "Unique product ID" },
          { name: "user_id", type: "UUID REFERENCES auth.users(id) ON DELETE CASCADE", description: "Seller/owner" },
          { name: "name", type: "TEXT NOT NULL", description: "Product name" },
          { name: "description", type: "TEXT", description: "Product description" },
          { name: "price", type: "DECIMAL(10,2) NOT NULL", description: "Price in dollars" },
          { name: "image_url", type: "TEXT", description: "Product image URL" },
          { name: "category", type: "TEXT", description: "Product category" },
          { name: "stock", type: "INTEGER DEFAULT 0", description: "Available stock" },
          { name: "is_active", type: "BOOLEAN DEFAULT true", description: "Is product listed" },
          { name: "created_at", type: "TIMESTAMPTZ DEFAULT NOW()", description: "Created timestamp" },
          { name: "updated_at", type: "TIMESTAMPTZ DEFAULT NOW()", description: "Updated timestamp" },
        ],
      },
      {
        name: "cart_items",
        description: "Shopping cart items",
        columns: [
          { name: "id", type: "UUID DEFAULT gen_random_uuid() PRIMARY KEY", description: "Cart item ID" },
          { name: "user_id", type: "UUID REFERENCES auth.users(id) ON DELETE CASCADE", description: "Cart owner" },
          { name: "product_id", type: "UUID REFERENCES products(id) ON DELETE CASCADE", description: "Product reference" },
          { name: "quantity", type: "INTEGER DEFAULT 1", description: "Item quantity" },
          { name: "created_at", type: "TIMESTAMPTZ DEFAULT NOW()", description: "Added timestamp" },
        ],
      },
      {
        name: "orders",
        description: "Customer orders",
        columns: [
          { name: "id", type: "UUID DEFAULT gen_random_uuid() PRIMARY KEY", description: "Order ID" },
          { name: "user_id", type: "UUID REFERENCES auth.users(id) ON DELETE CASCADE", description: "Customer" },
          { name: "status", type: "TEXT DEFAULT 'pending'", description: "Order status: pending, paid, shipped, delivered" },
          { name: "total", type: "DECIMAL(10,2) NOT NULL", description: "Order total" },
          { name: "shipping_address", type: "JSONB", description: "Shipping address JSON" },
          { name: "created_at", type: "TIMESTAMPTZ DEFAULT NOW()", description: "Order timestamp" },
        ],
      },
      {
        name: "order_items",
        description: "Items in each order",
        columns: [
          { name: "id", type: "UUID DEFAULT gen_random_uuid() PRIMARY KEY", description: "Order item ID" },
          { name: "order_id", type: "UUID REFERENCES orders(id) ON DELETE CASCADE", description: "Order reference" },
          { name: "product_id", type: "UUID REFERENCES products(id)", description: "Product reference" },
          { name: "quantity", type: "INTEGER NOT NULL", description: "Quantity ordered" },
          { name: "price", type: "DECIMAL(10,2) NOT NULL", description: "Price at time of order" },
        ],
      },
    ],
    rlsPolicies: [
      "CREATE POLICY \"Anyone can view active products\" ON products FOR SELECT USING (is_active = true);",
      "CREATE POLICY \"Users can manage own products\" ON products FOR ALL USING (auth.uid() = user_id);",
      "CREATE POLICY \"Users can manage own cart\" ON cart_items FOR ALL USING (auth.uid() = user_id);",
      "CREATE POLICY \"Users can view own orders\" ON orders FOR SELECT USING (auth.uid() = user_id);",
      "CREATE POLICY \"Users can create orders\" ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);",
      "CREATE POLICY \"Users can view own order items\" ON order_items FOR SELECT USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));",
    ],
  },

  social: {
    categoryId: "social",
    description: "Social media app with posts, likes, follows",
    tables: [
      {
        name: "posts",
        description: "User posts/content",
        columns: [
          { name: "id", type: "UUID DEFAULT gen_random_uuid() PRIMARY KEY", description: "Post ID" },
          { name: "user_id", type: "UUID REFERENCES auth.users(id) ON DELETE CASCADE", description: "Author" },
          { name: "content", type: "TEXT", description: "Post text content" },
          { name: "image_url", type: "TEXT", description: "Post image URL" },
          { name: "likes_count", type: "INTEGER DEFAULT 0", description: "Number of likes" },
          { name: "comments_count", type: "INTEGER DEFAULT 0", description: "Number of comments" },
          { name: "created_at", type: "TIMESTAMPTZ DEFAULT NOW()", description: "Posted timestamp" },
        ],
      },
      {
        name: "likes",
        description: "Post likes",
        columns: [
          { name: "id", type: "UUID DEFAULT gen_random_uuid() PRIMARY KEY", description: "Like ID" },
          { name: "user_id", type: "UUID REFERENCES auth.users(id) ON DELETE CASCADE", description: "User who liked" },
          { name: "post_id", type: "UUID REFERENCES posts(id) ON DELETE CASCADE", description: "Liked post" },
          { name: "created_at", type: "TIMESTAMPTZ DEFAULT NOW()", description: "Liked timestamp" },
        ],
      },
      {
        name: "comments",
        description: "Post comments",
        columns: [
          { name: "id", type: "UUID DEFAULT gen_random_uuid() PRIMARY KEY", description: "Comment ID" },
          { name: "user_id", type: "UUID REFERENCES auth.users(id) ON DELETE CASCADE", description: "Commenter" },
          { name: "post_id", type: "UUID REFERENCES posts(id) ON DELETE CASCADE", description: "Parent post" },
          { name: "content", type: "TEXT NOT NULL", description: "Comment text" },
          { name: "created_at", type: "TIMESTAMPTZ DEFAULT NOW()", description: "Comment timestamp" },
        ],
      },
      {
        name: "follows",
        description: "User follow relationships",
        columns: [
          { name: "id", type: "UUID DEFAULT gen_random_uuid() PRIMARY KEY", description: "Follow ID" },
          { name: "follower_id", type: "UUID REFERENCES auth.users(id) ON DELETE CASCADE", description: "Follower" },
          { name: "following_id", type: "UUID REFERENCES auth.users(id) ON DELETE CASCADE", description: "Being followed" },
          { name: "created_at", type: "TIMESTAMPTZ DEFAULT NOW()", description: "Followed timestamp" },
        ],
      },
    ],
    rlsPolicies: [
      "CREATE POLICY \"Anyone can view posts\" ON posts FOR SELECT USING (true);",
      "CREATE POLICY \"Users can manage own posts\" ON posts FOR ALL USING (auth.uid() = user_id);",
      "CREATE POLICY \"Anyone can view likes\" ON likes FOR SELECT USING (true);",
      "CREATE POLICY \"Users can manage own likes\" ON likes FOR ALL USING (auth.uid() = user_id);",
      "CREATE POLICY \"Anyone can view comments\" ON comments FOR SELECT USING (true);",
      "CREATE POLICY \"Users can manage own comments\" ON comments FOR ALL USING (auth.uid() = user_id);",
      "CREATE POLICY \"Anyone can view follows\" ON follows FOR SELECT USING (true);",
      "CREATE POLICY \"Users can manage own follows\" ON follows FOR ALL USING (auth.uid() = follower_id);",
    ],
  },

  fitness: {
    categoryId: "fitness",
    description: "Fitness/health tracking app",
    tables: [
      {
        name: "workouts",
        description: "User workout sessions",
        columns: [
          { name: "id", type: "UUID DEFAULT gen_random_uuid() PRIMARY KEY", description: "Workout ID" },
          { name: "user_id", type: "UUID REFERENCES auth.users(id) ON DELETE CASCADE", description: "User" },
          { name: "name", type: "TEXT NOT NULL", description: "Workout name" },
          { name: "type", type: "TEXT", description: "Workout type: strength, cardio, flexibility" },
          { name: "duration_minutes", type: "INTEGER", description: "Duration in minutes" },
          { name: "calories_burned", type: "INTEGER", description: "Estimated calories burned" },
          { name: "notes", type: "TEXT", description: "Workout notes" },
          { name: "completed_at", type: "TIMESTAMPTZ DEFAULT NOW()", description: "Completion timestamp" },
        ],
      },
      {
        name: "exercises",
        description: "Exercises within workouts",
        columns: [
          { name: "id", type: "UUID DEFAULT gen_random_uuid() PRIMARY KEY", description: "Exercise ID" },
          { name: "workout_id", type: "UUID REFERENCES workouts(id) ON DELETE CASCADE", description: "Parent workout" },
          { name: "name", type: "TEXT NOT NULL", description: "Exercise name" },
          { name: "sets", type: "INTEGER", description: "Number of sets" },
          { name: "reps", type: "INTEGER", description: "Reps per set" },
          { name: "weight", type: "DECIMAL(5,2)", description: "Weight used" },
          { name: "duration_seconds", type: "INTEGER", description: "Duration for timed exercises" },
        ],
      },
      {
        name: "goals",
        description: "Fitness goals",
        columns: [
          { name: "id", type: "UUID DEFAULT gen_random_uuid() PRIMARY KEY", description: "Goal ID" },
          { name: "user_id", type: "UUID REFERENCES auth.users(id) ON DELETE CASCADE", description: "User" },
          { name: "title", type: "TEXT NOT NULL", description: "Goal title" },
          { name: "target_value", type: "DECIMAL(10,2)", description: "Target number" },
          { name: "current_value", type: "DECIMAL(10,2) DEFAULT 0", description: "Current progress" },
          { name: "unit", type: "TEXT", description: "Unit: kg, miles, minutes, etc" },
          { name: "deadline", type: "DATE", description: "Target date" },
          { name: "is_completed", type: "BOOLEAN DEFAULT false", description: "Goal completed" },
          { name: "created_at", type: "TIMESTAMPTZ DEFAULT NOW()", description: "Created timestamp" },
        ],
      },
    ],
    rlsPolicies: [
      "CREATE POLICY \"Users can manage own workouts\" ON workouts FOR ALL USING (auth.uid() = user_id);",
      "CREATE POLICY \"Users can manage own exercises\" ON exercises FOR ALL USING (EXISTS (SELECT 1 FROM workouts WHERE workouts.id = exercises.workout_id AND workouts.user_id = auth.uid()));",
      "CREATE POLICY \"Users can manage own goals\" ON goals FOR ALL USING (auth.uid() = user_id);",
    ],
  },

  productivity: {
    categoryId: "productivity",
    description: "Task/productivity app",
    tables: [
      {
        name: "tasks",
        description: "User tasks/todos",
        columns: [
          { name: "id", type: "UUID DEFAULT gen_random_uuid() PRIMARY KEY", description: "Task ID" },
          { name: "user_id", type: "UUID REFERENCES auth.users(id) ON DELETE CASCADE", description: "Task owner" },
          { name: "title", type: "TEXT NOT NULL", description: "Task title" },
          { name: "description", type: "TEXT", description: "Task description" },
          { name: "status", type: "TEXT DEFAULT 'todo'", description: "Status: todo, in_progress, done" },
          { name: "priority", type: "TEXT DEFAULT 'medium'", description: "Priority: low, medium, high" },
          { name: "due_date", type: "DATE", description: "Due date" },
          { name: "category_id", type: "UUID REFERENCES categories(id)", description: "Task category" },
          { name: "created_at", type: "TIMESTAMPTZ DEFAULT NOW()", description: "Created timestamp" },
          { name: "completed_at", type: "TIMESTAMPTZ", description: "Completion timestamp" },
        ],
      },
      {
        name: "categories",
        description: "Task categories",
        columns: [
          { name: "id", type: "UUID DEFAULT gen_random_uuid() PRIMARY KEY", description: "Category ID" },
          { name: "user_id", type: "UUID REFERENCES auth.users(id) ON DELETE CASCADE", description: "Owner" },
          { name: "name", type: "TEXT NOT NULL", description: "Category name" },
          { name: "color", type: "TEXT DEFAULT '#8B5CF6'", description: "Display color" },
          { name: "icon", type: "TEXT", description: "Icon name" },
        ],
      },
      {
        name: "notes",
        description: "Quick notes",
        columns: [
          { name: "id", type: "UUID DEFAULT gen_random_uuid() PRIMARY KEY", description: "Note ID" },
          { name: "user_id", type: "UUID REFERENCES auth.users(id) ON DELETE CASCADE", description: "Note owner" },
          { name: "title", type: "TEXT", description: "Note title" },
          { name: "content", type: "TEXT", description: "Note content" },
          { name: "is_pinned", type: "BOOLEAN DEFAULT false", description: "Is pinned" },
          { name: "created_at", type: "TIMESTAMPTZ DEFAULT NOW()", description: "Created timestamp" },
          { name: "updated_at", type: "TIMESTAMPTZ DEFAULT NOW()", description: "Updated timestamp" },
        ],
      },
    ],
    rlsPolicies: [
      "CREATE POLICY \"Users can manage own tasks\" ON tasks FOR ALL USING (auth.uid() = user_id);",
      "CREATE POLICY \"Users can manage own categories\" ON categories FOR ALL USING (auth.uid() = user_id);",
      "CREATE POLICY \"Users can manage own notes\" ON notes FOR ALL USING (auth.uid() = user_id);",
    ],
  },

  finance: {
    categoryId: "finance",
    description: "Personal finance/expense tracking app",
    tables: [
      {
        name: "transactions",
        description: "Financial transactions",
        columns: [
          { name: "id", type: "UUID DEFAULT gen_random_uuid() PRIMARY KEY", description: "Transaction ID" },
          { name: "user_id", type: "UUID REFERENCES auth.users(id) ON DELETE CASCADE", description: "User" },
          { name: "type", type: "TEXT NOT NULL", description: "Type: income or expense" },
          { name: "amount", type: "DECIMAL(12,2) NOT NULL", description: "Transaction amount" },
          { name: "category", type: "TEXT", description: "Category: food, transport, salary, etc" },
          { name: "description", type: "TEXT", description: "Transaction description" },
          { name: "date", type: "DATE DEFAULT CURRENT_DATE", description: "Transaction date" },
          { name: "created_at", type: "TIMESTAMPTZ DEFAULT NOW()", description: "Created timestamp" },
        ],
      },
      {
        name: "budgets",
        description: "Monthly budgets",
        columns: [
          { name: "id", type: "UUID DEFAULT gen_random_uuid() PRIMARY KEY", description: "Budget ID" },
          { name: "user_id", type: "UUID REFERENCES auth.users(id) ON DELETE CASCADE", description: "User" },
          { name: "category", type: "TEXT NOT NULL", description: "Budget category" },
          { name: "amount", type: "DECIMAL(12,2) NOT NULL", description: "Budget amount" },
          { name: "month", type: "INTEGER NOT NULL", description: "Month (1-12)" },
          { name: "year", type: "INTEGER NOT NULL", description: "Year" },
        ],
      },
      {
        name: "accounts",
        description: "Financial accounts",
        columns: [
          { name: "id", type: "UUID DEFAULT gen_random_uuid() PRIMARY KEY", description: "Account ID" },
          { name: "user_id", type: "UUID REFERENCES auth.users(id) ON DELETE CASCADE", description: "User" },
          { name: "name", type: "TEXT NOT NULL", description: "Account name" },
          { name: "type", type: "TEXT", description: "Type: checking, savings, credit" },
          { name: "balance", type: "DECIMAL(12,2) DEFAULT 0", description: "Current balance" },
          { name: "currency", type: "TEXT DEFAULT 'USD'", description: "Currency code" },
        ],
      },
    ],
    rlsPolicies: [
      "CREATE POLICY \"Users can manage own transactions\" ON transactions FOR ALL USING (auth.uid() = user_id);",
      "CREATE POLICY \"Users can manage own budgets\" ON budgets FOR ALL USING (auth.uid() = user_id);",
      "CREATE POLICY \"Users can manage own accounts\" ON accounts FOR ALL USING (auth.uid() = user_id);",
    ],
  },

  food: {
    categoryId: "food",
    description: "Food ordering/delivery app",
    tables: [
      {
        name: "restaurants",
        description: "Restaurant listings",
        columns: [
          { name: "id", type: "UUID DEFAULT gen_random_uuid() PRIMARY KEY", description: "Restaurant ID" },
          { name: "owner_id", type: "UUID REFERENCES auth.users(id)", description: "Restaurant owner" },
          { name: "name", type: "TEXT NOT NULL", description: "Restaurant name" },
          { name: "description", type: "TEXT", description: "Description" },
          { name: "image_url", type: "TEXT", description: "Cover image" },
          { name: "address", type: "TEXT", description: "Address" },
          { name: "rating", type: "DECIMAL(2,1) DEFAULT 0", description: "Average rating" },
          { name: "cuisine_type", type: "TEXT", description: "Cuisine type" },
          { name: "is_open", type: "BOOLEAN DEFAULT true", description: "Is currently open" },
        ],
      },
      {
        name: "menu_items",
        description: "Menu items",
        columns: [
          { name: "id", type: "UUID DEFAULT gen_random_uuid() PRIMARY KEY", description: "Item ID" },
          { name: "restaurant_id", type: "UUID REFERENCES restaurants(id) ON DELETE CASCADE", description: "Restaurant" },
          { name: "name", type: "TEXT NOT NULL", description: "Item name" },
          { name: "description", type: "TEXT", description: "Item description" },
          { name: "price", type: "DECIMAL(8,2) NOT NULL", description: "Price" },
          { name: "image_url", type: "TEXT", description: "Item image" },
          { name: "category", type: "TEXT", description: "Category: appetizer, main, dessert" },
          { name: "is_available", type: "BOOLEAN DEFAULT true", description: "Is available" },
        ],
      },
      {
        name: "food_orders",
        description: "Food orders",
        columns: [
          { name: "id", type: "UUID DEFAULT gen_random_uuid() PRIMARY KEY", description: "Order ID" },
          { name: "user_id", type: "UUID REFERENCES auth.users(id) ON DELETE CASCADE", description: "Customer" },
          { name: "restaurant_id", type: "UUID REFERENCES restaurants(id)", description: "Restaurant" },
          { name: "status", type: "TEXT DEFAULT 'pending'", description: "Status: pending, preparing, delivering, delivered" },
          { name: "total", type: "DECIMAL(10,2) NOT NULL", description: "Order total" },
          { name: "delivery_address", type: "TEXT", description: "Delivery address" },
          { name: "notes", type: "TEXT", description: "Special instructions" },
          { name: "created_at", type: "TIMESTAMPTZ DEFAULT NOW()", description: "Order timestamp" },
        ],
      },
    ],
    rlsPolicies: [
      "CREATE POLICY \"Anyone can view restaurants\" ON restaurants FOR SELECT USING (true);",
      "CREATE POLICY \"Owners can manage own restaurants\" ON restaurants FOR ALL USING (auth.uid() = owner_id);",
      "CREATE POLICY \"Anyone can view menu items\" ON menu_items FOR SELECT USING (true);",
      "CREATE POLICY \"Users can manage own orders\" ON food_orders FOR ALL USING (auth.uid() = user_id);",
    ],
  },

  education: {
    categoryId: "education",
    description: "Learning/education app",
    tables: [
      {
        name: "courses",
        description: "Courses/lessons",
        columns: [
          { name: "id", type: "UUID DEFAULT gen_random_uuid() PRIMARY KEY", description: "Course ID" },
          { name: "instructor_id", type: "UUID REFERENCES auth.users(id)", description: "Instructor" },
          { name: "title", type: "TEXT NOT NULL", description: "Course title" },
          { name: "description", type: "TEXT", description: "Course description" },
          { name: "image_url", type: "TEXT", description: "Cover image" },
          { name: "category", type: "TEXT", description: "Subject category" },
          { name: "difficulty", type: "TEXT DEFAULT 'beginner'", description: "Difficulty level" },
          { name: "is_published", type: "BOOLEAN DEFAULT false", description: "Is published" },
          { name: "created_at", type: "TIMESTAMPTZ DEFAULT NOW()", description: "Created timestamp" },
        ],
      },
      {
        name: "lessons",
        description: "Course lessons",
        columns: [
          { name: "id", type: "UUID DEFAULT gen_random_uuid() PRIMARY KEY", description: "Lesson ID" },
          { name: "course_id", type: "UUID REFERENCES courses(id) ON DELETE CASCADE", description: "Parent course" },
          { name: "title", type: "TEXT NOT NULL", description: "Lesson title" },
          { name: "content", type: "TEXT", description: "Lesson content" },
          { name: "video_url", type: "TEXT", description: "Video URL" },
          { name: "order_index", type: "INTEGER DEFAULT 0", description: "Lesson order" },
          { name: "duration_minutes", type: "INTEGER", description: "Estimated duration" },
        ],
      },
      {
        name: "enrollments",
        description: "Course enrollments",
        columns: [
          { name: "id", type: "UUID DEFAULT gen_random_uuid() PRIMARY KEY", description: "Enrollment ID" },
          { name: "user_id", type: "UUID REFERENCES auth.users(id) ON DELETE CASCADE", description: "Student" },
          { name: "course_id", type: "UUID REFERENCES courses(id) ON DELETE CASCADE", description: "Course" },
          { name: "progress", type: "INTEGER DEFAULT 0", description: "Progress percentage" },
          { name: "enrolled_at", type: "TIMESTAMPTZ DEFAULT NOW()", description: "Enrollment timestamp" },
        ],
      },
      {
        name: "flashcards",
        description: "Study flashcards",
        columns: [
          { name: "id", type: "UUID DEFAULT gen_random_uuid() PRIMARY KEY", description: "Flashcard ID" },
          { name: "user_id", type: "UUID REFERENCES auth.users(id) ON DELETE CASCADE", description: "Owner" },
          { name: "deck_name", type: "TEXT", description: "Deck/set name" },
          { name: "front", type: "TEXT NOT NULL", description: "Front side (question)" },
          { name: "back", type: "TEXT NOT NULL", description: "Back side (answer)" },
          { name: "difficulty", type: "INTEGER DEFAULT 0", description: "Difficulty score 0-5" },
          { name: "next_review", type: "TIMESTAMPTZ", description: "Next review date" },
        ],
      },
    ],
    rlsPolicies: [
      "CREATE POLICY \"Anyone can view published courses\" ON courses FOR SELECT USING (is_published = true);",
      "CREATE POLICY \"Instructors can manage own courses\" ON courses FOR ALL USING (auth.uid() = instructor_id);",
      "CREATE POLICY \"Enrolled users can view lessons\" ON lessons FOR SELECT USING (EXISTS (SELECT 1 FROM enrollments WHERE enrollments.course_id = lessons.course_id AND enrollments.user_id = auth.uid()) OR EXISTS (SELECT 1 FROM courses WHERE courses.id = lessons.course_id AND courses.instructor_id = auth.uid()));",
      "CREATE POLICY \"Users can manage own enrollments\" ON enrollments FOR ALL USING (auth.uid() = user_id);",
      "CREATE POLICY \"Users can manage own flashcards\" ON flashcards FOR ALL USING (auth.uid() = user_id);",
    ],
  },

  entertainment: {
    categoryId: "entertainment",
    description: "Entertainment/media app",
    tables: [
      {
        name: "playlists",
        description: "Music/video playlists",
        columns: [
          { name: "id", type: "UUID DEFAULT gen_random_uuid() PRIMARY KEY", description: "Playlist ID" },
          { name: "user_id", type: "UUID REFERENCES auth.users(id) ON DELETE CASCADE", description: "Owner" },
          { name: "name", type: "TEXT NOT NULL", description: "Playlist name" },
          { name: "description", type: "TEXT", description: "Description" },
          { name: "image_url", type: "TEXT", description: "Cover image" },
          { name: "is_public", type: "BOOLEAN DEFAULT false", description: "Is public" },
          { name: "created_at", type: "TIMESTAMPTZ DEFAULT NOW()", description: "Created timestamp" },
        ],
      },
      {
        name: "media_items",
        description: "Songs/videos",
        columns: [
          { name: "id", type: "UUID DEFAULT gen_random_uuid() PRIMARY KEY", description: "Media ID" },
          { name: "title", type: "TEXT NOT NULL", description: "Title" },
          { name: "artist", type: "TEXT", description: "Artist/creator" },
          { name: "url", type: "TEXT", description: "Media URL" },
          { name: "thumbnail_url", type: "TEXT", description: "Thumbnail" },
          { name: "duration_seconds", type: "INTEGER", description: "Duration" },
          { name: "type", type: "TEXT DEFAULT 'audio'", description: "Type: audio, video" },
        ],
      },
      {
        name: "playlist_items",
        description: "Items in playlists",
        columns: [
          { name: "id", type: "UUID DEFAULT gen_random_uuid() PRIMARY KEY", description: "Entry ID" },
          { name: "playlist_id", type: "UUID REFERENCES playlists(id) ON DELETE CASCADE", description: "Playlist" },
          { name: "media_id", type: "UUID REFERENCES media_items(id) ON DELETE CASCADE", description: "Media item" },
          { name: "order_index", type: "INTEGER DEFAULT 0", description: "Order in playlist" },
          { name: "added_at", type: "TIMESTAMPTZ DEFAULT NOW()", description: "Added timestamp" },
        ],
      },
      {
        name: "favorites",
        description: "User favorites",
        columns: [
          { name: "id", type: "UUID DEFAULT gen_random_uuid() PRIMARY KEY", description: "Favorite ID" },
          { name: "user_id", type: "UUID REFERENCES auth.users(id) ON DELETE CASCADE", description: "User" },
          { name: "media_id", type: "UUID REFERENCES media_items(id) ON DELETE CASCADE", description: "Favorited media" },
          { name: "created_at", type: "TIMESTAMPTZ DEFAULT NOW()", description: "Favorited timestamp" },
        ],
      },
    ],
    rlsPolicies: [
      "CREATE POLICY \"Users can manage own playlists\" ON playlists FOR ALL USING (auth.uid() = user_id);",
      "CREATE POLICY \"Anyone can view public playlists\" ON playlists FOR SELECT USING (is_public = true OR auth.uid() = user_id);",
      "CREATE POLICY \"Anyone can view media\" ON media_items FOR SELECT USING (true);",
      "CREATE POLICY \"Users can manage playlist items\" ON playlist_items FOR ALL USING (EXISTS (SELECT 1 FROM playlists WHERE playlists.id = playlist_items.playlist_id AND playlists.user_id = auth.uid()));",
      "CREATE POLICY \"Users can manage own favorites\" ON favorites FOR ALL USING (auth.uid() = user_id);",
    ],
  },
};

/**
 * Generate complete SQL schema for a category
 */
export function generateSchema(categoryId: string): string {
  const categorySchema = CATEGORY_SCHEMAS[categoryId];
  if (!categorySchema) {
    return BASE_SCHEMA;
  }

  let sql = BASE_SCHEMA;
  sql += `\n-- =============================================\n`;
  sql += `-- ${categorySchema.description}\n`;
  sql += `-- =============================================\n\n`;

  // Create tables
  for (const table of categorySchema.tables) {
    sql += `-- ${table.description}\n`;
    sql += `CREATE TABLE IF NOT EXISTS ${table.name} (\n`;
    sql += table.columns.map(col => `  ${col.name} ${col.type}`).join(",\n");
    sql += `\n);\n\n`;

    // Enable RLS
    sql += `ALTER TABLE ${table.name} ENABLE ROW LEVEL SECURITY;\n\n`;

    // Add updated_at trigger if table has updated_at column
    if (table.columns.some(c => c.name === "updated_at")) {
      sql += `CREATE TRIGGER update_${table.name}_updated_at\n`;
      sql += `  BEFORE UPDATE ON ${table.name}\n`;
      sql += `  FOR EACH ROW EXECUTE FUNCTION update_updated_at();\n\n`;
    }
  }

  // Add RLS policies
  sql += `-- Row Level Security Policies\n`;
  for (const policy of categorySchema.rlsPolicies) {
    sql += `${policy}\n`;
  }

  return sql;
}

/**
 * Get Supabase client code template for React Native
 */
export function getSupabaseClientTemplate(): string {
  return `
// lib/supabase.ts
import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
`;
}

export default CATEGORY_SCHEMAS;
