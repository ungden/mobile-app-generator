/**
 * AI Agent - Generates complete multi-file apps in JSON format
 * Inspired by Rork's architecture
 */

export interface GeneratedApp {
  appName: string;
  description: string;
  files: Record<string, string>;
  dependencies: Record<string, string>;
}

export interface ParsedResponse {
  app: GeneratedApp | null;
  message: string;
  error?: string;
}

/**
 * System prompt for generating COMPLETE apps in JSON format
 */
export function getAppGenerationPrompt(): string {
  return `You are an expert React Native and Expo developer. Your task is to generate COMPLETE, production-ready mobile apps.

## OUTPUT FORMAT

You MUST respond with valid JSON in this exact format:

\`\`\`json
{
  "appName": "App Name Here",
  "description": "Brief description of the app",
  "files": {
    "App.js": "// Full code here",
    "screens/HomeScreen.js": "// Full code here",
    "screens/OtherScreen.js": "// Full code here",
    "components/Button.js": "// Full code here",
    "components/Card.js": "// Full code here",
    "constants/Colors.js": "// Full code here"
  },
  "dependencies": {
    "@react-navigation/native": "6.x",
    "@react-navigation/native-stack": "6.x",
    "react-native-screens": "~3.29.0",
    "react-native-safe-area-context": "4.8.2"
  }
}
\`\`\`

## CRITICAL REQUIREMENTS

### 1. App Structure (MANDATORY)
Every app MUST have these files:
- \`App.js\` - Entry point with NavigationContainer and Stack Navigator
- \`screens/HomeScreen.js\` - Main screen
- \`screens/\` - At least 2-3 screens for a complete app
- \`components/\` - Reusable UI components (Button, Card, etc.)
- \`constants/Colors.js\` - Design tokens

### 2. Navigation Setup (App.js)
\`\`\`javascript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
// Import other screens...

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
        {/* Add other screens */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
\`\`\`

### 3. Design System (constants/Colors.js)
\`\`\`javascript
export default {
  // Backgrounds
  background: '#0a0a0a',
  card: '#111111',
  elevated: '#1a1a1a',
  
  // Primary
  primary: '#7c3aed',
  primaryLight: '#8b5cf6',
  
  // Status
  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
  
  // Text
  text: '#ffffff',
  textSecondary: '#e5e5e5',
  textMuted: '#a1a1aa',
  
  // Border
  border: '#27272a',
};
\`\`\`

### 4. Screen Template
\`\`\`javascript
import React, { useState } from 'react';
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

export default function ScreenName({ navigation }) {
  // State and logic here
  
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.background} />
      {/* Content */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  // More styles...
});
\`\`\`

### 5. Component Template
\`\`\`javascript
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

export default function Button({ title, onPress, variant = 'primary' }) {
  return (
    <TouchableOpacity
      style={[styles.button, variant === 'secondary' && styles.secondary]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.text}>{title}</Text>
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
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
\`\`\`

### 6. Code Quality Rules
- Use functional components with hooks
- Use StyleSheet.create() for ALL styles
- Use FlatList for lists (NOT ScrollView with .map())
- Include realistic mock data (8-15 items)
- All strings properly escaped in JSON
- No trailing commas in JSON
- Proper imports in every file

### 7. UI/UX Guidelines
- Dark theme by default (background: #0a0a0a)
- Generous padding and spacing
- Consistent border radius (8, 12, 16)
- Touch feedback on all interactive elements
- Empty states for lists
- Loading indicators where needed

### 8. Dependencies
ONLY include dependencies that are actually used:
- Navigation: @react-navigation/native, @react-navigation/native-stack
- If using tabs: @react-navigation/bottom-tabs
- If using gradients: expo-linear-gradient
- If using icons: @expo/vector-icons (already included in Expo)

## RESPONSE RULES

1. Output ONLY the JSON object - no markdown, no explanations before or after
2. The JSON must be valid and parseable
3. All code strings must have newlines escaped as \\n
4. All quotes in code must be escaped as \\"
5. Generate a COMPLETE app, not partial code
6. Include at minimum: App.js, 2 screens, 2 components, Colors.js
7. Use realistic content in the user's language (Vietnamese or English)

## IMPORTANT

When the user asks for an app, analyze what screens and components are needed, then generate ALL of them in a single response. Think about:
- What screens does this app need?
- What components are reusable?
- What data structures are needed?
- What navigation flow makes sense?

Generate everything in one response - the user should have a working app immediately.`;
}

/**
 * System prompt for MODIFYING existing apps
 */
export function getAppModificationPrompt(currentFiles: Record<string, string>): string {
  const fileList = Object.keys(currentFiles).map(f => `- ${f}`).join('\n');
  const fileContents = Object.entries(currentFiles)
    .map(([path, content]) => `### ${path}\n\`\`\`javascript\n${content}\n\`\`\``)
    .join('\n\n');

  return `You are an expert React Native developer. Modify the existing app based on user request.

## CURRENT PROJECT FILES:
${fileList}

## CURRENT FILE CONTENTS:
${fileContents}

## OUTPUT FORMAT

Respond with JSON containing ONLY the files that need to be changed or added:

\`\`\`json
{
  "appName": "Updated App Name (or keep original)",
  "description": "What was changed",
  "files": {
    "screens/NewScreen.js": "// New file content",
    "screens/HomeScreen.js": "// Updated content (full file)"
  },
  "dependencies": {
    "new-package": "1.x"
  }
}
\`\`\`

## RULES

1. Only include files that are NEW or MODIFIED
2. For modified files, include the COMPLETE new content (not patches)
3. Keep the same code style and structure
4. Maintain consistency with existing components
5. Update navigation in App.js if adding new screens
6. Output ONLY valid JSON, no explanations`;
}

/**
 * Parse AI response to extract generated app
 */
export function parseGeneratedApp(response: string): ParsedResponse {
  try {
    // Try to extract JSON from the response
    let jsonStr = response;
    
    // Remove markdown code blocks if present
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }
    
    // Try to find JSON object directly
    const objectMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (objectMatch) {
      jsonStr = objectMatch[0];
    }

    const parsed = JSON.parse(jsonStr);
    
    // Validate required fields
    if (!parsed.files || typeof parsed.files !== 'object') {
      return {
        app: null,
        message: '',
        error: 'Invalid response: missing files object',
      };
    }

    // Ensure we have at least App.js
    if (!parsed.files['App.js']) {
      return {
        app: null,
        message: '',
        error: 'Invalid response: missing App.js',
      };
    }

    return {
      app: {
        appName: parsed.appName || 'My App',
        description: parsed.description || '',
        files: parsed.files,
        dependencies: parsed.dependencies || {},
      },
      message: parsed.description || 'App generated successfully!',
    };
  } catch (error: any) {
    console.error('Failed to parse AI response:', error);
    
    // Try to extract any useful message
    const messageMatch = response.match(/^[^{]*/);
    const message = messageMatch ? messageMatch[0].trim() : '';
    
    return {
      app: null,
      message,
      error: `Failed to parse response: ${error.message}`,
    };
  }
}

/**
 * Merge new files into existing project
 */
export function mergeProjectFiles(
  existing: Record<string, string>,
  updates: Record<string, string>
): Record<string, string> {
  return {
    ...existing,
    ...updates,
  };
}

/**
 * Validate generated code for common issues
 */
export function validateGeneratedCode(files: Record<string, string>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  for (const [path, content] of Object.entries(files)) {
    // Check for basic syntax issues
    const openBraces = (content.match(/\{/g) || []).length;
    const closeBraces = (content.match(/\}/g) || []).length;
    if (openBraces !== closeBraces) {
      errors.push(`${path}: Mismatched braces (${openBraces} open, ${closeBraces} close)`);
    }

    const openParens = (content.match(/\(/g) || []).length;
    const closeParens = (content.match(/\)/g) || []).length;
    if (openParens !== closeParens) {
      errors.push(`${path}: Mismatched parentheses (${openParens} open, ${closeParens} close)`);
    }

    // Check for required exports in screens and components
    if (path.includes('screens/') || path.includes('components/')) {
      if (!content.includes('export default')) {
        errors.push(`${path}: Missing default export`);
      }
    }

    // Check for StyleSheet usage
    if (content.includes('style=') && !content.includes('StyleSheet.create')) {
      errors.push(`${path}: Using inline styles instead of StyleSheet.create`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get default dependencies for Expo projects
 */
export function getDefaultDependencies(): Record<string, string> {
  return {
    '@react-navigation/native': '6.x',
    '@react-navigation/native-stack': '6.x',
    'react-native-screens': '~3.29.0',
    'react-native-safe-area-context': '4.8.2',
  };
}
