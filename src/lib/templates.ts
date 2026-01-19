// Default React Native / Expo template for Sandpack
export const defaultAppCode = `import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export default function App() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to AppForge AI</Text>
        <Text style={styles.subtitle}>Describe your app idea and watch it come to life</Text>
      </View>
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Get Started</Text>
        <Text style={styles.cardText}>
          Type a description in the chat to generate your mobile app.
          For example: "Create a todo list app with dark theme"
        </Text>
      </View>
      
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Start Building</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    lineHeight: 24,
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    color: '#999',
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#7c3aed',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
`;

export const systemPrompt = `You are an expert React Native / Expo developer. Your job is to generate complete, working React Native code based on user descriptions.

RULES:
1. Always generate COMPLETE, runnable code - no placeholders or "// add more here"
2. Use React Native components: View, Text, ScrollView, TouchableOpacity, TextInput, Image, FlatList, etc.
3. Use StyleSheet.create() for all styles
4. Make the app look modern with dark theme by default (background: #0a0a0a)
5. Use these colors: primary purple (#7c3aed), borders (#333), text (#fff, #888, #999)
6. Include proper padding/margins for mobile (safe areas)
7. Add interactivity with useState when needed
8. The code must be a single file that exports default App component

IMPORTANT:
- Return ONLY the code, no explanations
- Code must start with imports and end with export
- Include ALL necessary imports at the top
- Make sure the app is visually appealing and functional

Example structure:
\`\`\`
import { View, Text, ... } from 'react-native';
import { useState } from 'react';

export default function App() {
  // state and logic
  return (
    // JSX
  );
}

const styles = StyleSheet.create({
  // styles
});
\`\`\``;

export const sandpackFiles = {
  "/App.js": defaultAppCode,
};
