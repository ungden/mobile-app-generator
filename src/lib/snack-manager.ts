/**
 * Snack Manager - Handles Expo Snack integration via iframe embed
 * Uses Snack's web embed API instead of snack-sdk (which has Node.js deps)
 * This approach is similar to how Rork works
 */

export interface ProjectFile {
  path: string;
  type: 'CODE' | 'ASSET';
  contents: string;
}

export interface ProjectState {
  files: Record<string, ProjectFile>;
  dependencies: Record<string, string>;
  name: string;
  description: string;
  sdkVersion: string;
  snackUrl?: string;
  isReady: boolean;
}

export interface FileChange {
  path: string;
  action: 'created' | 'edited' | 'deleted';
  contents?: string;
}

// Default Expo project template
const DEFAULT_PROJECT_FILES: Record<string, ProjectFile> = {
  'App.js': {
    path: 'App.js',
    type: 'CODE',
    contents: `import { registerRootComponent } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';

const Stack = createNativeStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default registerRootComponent(App);
`,
  },
  'screens/HomeScreen.js': {
    path: 'screens/HomeScreen.js',
    type: 'CODE',
    contents: `import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to 24fit</Text>
        <Text style={styles.subtitle}>Your app is ready!</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#a1a1aa',
  },
});
`,
  },
  'constants/Colors.js': {
    path: 'constants/Colors.js',
    type: 'CODE',
    contents: `// Design tokens
export const Colors = {
  // Backgrounds
  background: '#0a0a0a',
  card: '#111111',
  elevated: '#1a1a1a',
  
  // Primary
  primary: '#7c3aed',
  primaryLight: '#8b5cf6',
  
  // Accent
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  
  // Text
  text: '#ffffff',
  textSecondary: '#e5e5e5',
  textTertiary: '#a1a1aa',
  textMuted: '#52525b',
  
  // Border
  border: '#27272a',
  borderVisible: '#3f3f46',
};

export default Colors;
`,
  },
  'components/Button.js': {
    path: 'components/Button.js',
    type: 'CODE',
    contents: `import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

export default function Button({ title, onPress, variant = 'primary', style }) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'secondary' && styles.secondary,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[
        styles.text,
        variant === 'secondary' && styles.secondaryText,
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  text: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryText: {
    color: Colors.textTertiary,
  },
});
`,
  },
  'components/Card.js': {
    path: 'components/Card.js',
    type: 'CODE',
    contents: `import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

export default function Card({ children, style }) {
  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
`,
  },
};

const DEFAULT_DEPENDENCIES: Record<string, string> = {
  '@react-navigation/native': '6.x',
  '@react-navigation/native-stack': '6.x',
  'react-native-screens': '~3.29.0',
  'react-native-safe-area-context': '4.8.2',
};

export class SnackManager {
  private files: Record<string, ProjectFile> = {};
  private dependencies: Record<string, string> = {};
  private history: FileChange[][] = [];
  private historyIndex = -1;
  private listeners: Set<(state: ProjectState) => void> = new Set();
  private name: string = 'My App';
  private description: string = 'Built with 24fit';
  private sdkVersion: string = '52.0.0';

  constructor() {
    this.files = { ...DEFAULT_PROJECT_FILES };
    this.dependencies = { ...DEFAULT_DEPENDENCIES };
  }

  /**
   * Initialize manager (no-op in this implementation, kept for API compatibility)
   */
  initialize() {
    this.notifyListeners();
  }

  /**
   * Get current project state
   */
  getState(): ProjectState {
    return {
      files: this.files,
      dependencies: this.dependencies,
      name: this.name,
      description: this.description,
      sdkVersion: this.sdkVersion,
      snackUrl: this.getSnackEmbedUrl(),
      isReady: true,
    };
  }

  /**
   * Generate Snack embed URL with current code
   * This creates a URL that can be used in an iframe to preview the app
   */
  getSnackEmbedUrl(): string {
    // Build files object for Snack URL
    const snackFiles: Record<string, string> = {};
    for (const [path, file] of Object.entries(this.files)) {
      snackFiles[path] = file.contents;
    }

    // Create Snack URL parameters
    const params = new URLSearchParams({
      platform: 'web',
      name: this.name,
      description: this.description,
      sdkVersion: this.sdkVersion,
      theme: 'dark',
      preview: 'true',
      loading: 'lazy',
    });

    // Add dependencies
    const depsObj = Object.entries(this.dependencies).reduce((acc, [name, version]) => {
      acc[name] = version;
      return acc;
    }, {} as Record<string, string>);
    params.set('dependencies', JSON.stringify(depsObj));

    // Add files
    params.set('files', JSON.stringify(snackFiles));

    return `https://snack.expo.dev/embedded?${params.toString()}`;
  }

  /**
   * Get QR code URL for testing on Expo Go
   * Note: This requires saving to Expo servers first
   */
  getQRCodeUrl(): string | null {
    // For QR codes, we need to save the snack first
    // For now, return null - we can implement save functionality later
    return null;
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener: (state: ProjectState) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners() {
    const state = this.getState();
    this.listeners.forEach((listener) => listener(state));
  }

  /**
   * Write a file (create or update)
   */
  writeFile(path: string, contents: string, type: 'CODE' | 'ASSET' = 'CODE'): FileChange {
    const isNew = !this.files[path];
    const change: FileChange = {
      path,
      action: isNew ? 'created' : 'edited',
      contents,
    };

    this.files[path] = { path, type, contents };
    this.addToHistory([change]);
    this.notifyListeners();
    
    return change;
  }

  /**
   * Edit a file using search/replace (more efficient than rewriting)
   */
  editFile(path: string, searchText: string, replaceText: string): FileChange | null {
    const file = this.files[path];
    if (!file) return null;

    if (!file.contents.includes(searchText)) {
      console.warn(`Search text not found in ${path}`);
      return null;
    }

    const newContents = file.contents.replace(searchText, replaceText);
    return this.writeFile(path, newContents, file.type);
  }

  /**
   * Delete a file
   */
  deleteFile(path: string): FileChange | null {
    if (!this.files[path]) return null;

    const change: FileChange = {
      path,
      action: 'deleted',
    };

    delete this.files[path];
    this.addToHistory([change]);
    this.notifyListeners();
    
    return change;
  }

  /**
   * Read a file
   */
  readFile(path: string): string | null {
    return this.files[path]?.contents || null;
  }

  /**
   * List all files
   */
  listFiles(): string[] {
    return Object.keys(this.files);
  }

  /**
   * Apply multiple file changes at once
   */
  applyChanges(changes: FileChange[]): void {
    for (const change of changes) {
      if (change.action === 'deleted') {
        delete this.files[change.path];
      } else if (change.contents) {
        this.files[change.path] = {
          path: change.path,
          type: 'CODE',
          contents: change.contents,
        };
      }
    }

    this.addToHistory(changes);
    this.notifyListeners();
  }

  /**
   * Add dependency
   */
  addDependency(name: string, version: string = '*'): void {
    this.dependencies[name] = version;
    this.notifyListeners();
  }

  /**
   * Remove dependency
   */
  removeDependency(name: string): void {
    delete this.dependencies[name];
    this.notifyListeners();
  }

  /**
   * Add changes to history
   */
  private addToHistory(changes: FileChange[]): void {
    // Remove any future history if we're not at the end
    if (this.historyIndex < this.history.length - 1) {
      this.history = this.history.slice(0, this.historyIndex + 1);
    }
    
    this.history.push(changes);
    this.historyIndex = this.history.length - 1;
  }

  /**
   * Get change history
   */
  getHistory(): { changes: FileChange[]; index: number }[] {
    return this.history.map((changes, index) => ({ changes, index }));
  }

  /**
   * Restore to a specific point in history
   */
  restoreToHistory(index: number): void {
    if (index < 0 || index >= this.history.length) return;
    
    // Rebuild files from scratch by replaying history
    this.files = { ...DEFAULT_PROJECT_FILES };
    
    for (let i = 0; i <= index; i++) {
      for (const change of this.history[i]) {
        if (change.action === 'deleted') {
          delete this.files[change.path];
        } else if (change.contents) {
          this.files[change.path] = {
            path: change.path,
            type: 'CODE',
            contents: change.contents,
          };
        }
      }
    }

    this.historyIndex = index;
    this.notifyListeners();
  }

  /**
   * Reset project to default
   */
  reset(): void {
    this.files = { ...DEFAULT_PROJECT_FILES };
    this.dependencies = { ...DEFAULT_DEPENDENCIES };
    this.history = [];
    this.historyIndex = -1;
    this.notifyListeners();
  }

  /**
   * Set project name
   */
  setName(name: string): void {
    this.name = name;
    this.notifyListeners();
  }

  /**
   * Export project as object (for saving to database)
   */
  exportProject(): {
    name: string;
    files: Record<string, ProjectFile>;
    dependencies: Record<string, string>;
  } {
    return {
      name: this.name,
      files: this.files,
      dependencies: this.dependencies,
    };
  }

  /**
   * Import project from saved state
   */
  importProject(data: {
    name?: string;
    files?: Record<string, ProjectFile>;
    dependencies?: Record<string, string>;
  }): void {
    if (data.name) this.name = data.name;
    if (data.files) this.files = data.files;
    if (data.dependencies) this.dependencies = data.dependencies;
    this.history = [];
    this.historyIndex = -1;
    this.notifyListeners();
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.listeners.clear();
  }
}

// Singleton instance
let snackManagerInstance: SnackManager | null = null;

export function getSnackManager(): SnackManager {
  if (!snackManagerInstance) {
    snackManagerInstance = new SnackManager();
  }
  return snackManagerInstance;
}

/**
 * Create a new SnackManager instance (for testing or isolated use)
 */
export function createSnackManager(): SnackManager {
  return new SnackManager();
}
