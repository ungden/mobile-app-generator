/**
 * AI Agent - Manages AI interactions with tools
 * Inspired by Lovable's agent architecture
 */

import type { SnackManager, FileChange } from './snack-manager';

// Tool definitions for the AI
export interface Tool {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, { type: string; description: string }>;
    required: string[];
  };
}

export const AVAILABLE_TOOLS: Tool[] = [
  {
    name: 'write_file',
    description: 'Create a new file or completely overwrite an existing file with new contents. Use this for creating new screens, components, or when making major changes to a file.',
    parameters: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'The file path (e.g., "screens/HomeScreen.js", "components/Button.js")' },
        contents: { type: 'string', description: 'The complete file contents' },
      },
      required: ['path', 'contents'],
    },
  },
  {
    name: 'edit_file',
    description: 'Edit an existing file by replacing specific text. Use this for small, targeted changes like fixing a bug, changing a color, or updating a single function. More efficient than rewriting the entire file.',
    parameters: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'The file path to edit' },
        search: { type: 'string', description: 'The exact text to find (must match exactly, including whitespace and indentation)' },
        replace: { type: 'string', description: 'The new text to replace with' },
      },
      required: ['path', 'search', 'replace'],
    },
  },
  {
    name: 'delete_file',
    description: 'Delete a file from the project',
    parameters: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'The file path to delete' },
      },
      required: ['path'],
    },
  },
  {
    name: 'read_file',
    description: 'Read the contents of a file to understand its current state before making changes',
    parameters: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'The file path to read' },
      },
      required: ['path'],
    },
  },
  {
    name: 'list_files',
    description: 'List all files in the project to understand the project structure',
    parameters: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'add_dependency',
    description: 'Add an npm package dependency to the project. Use this when you need external libraries like expo-linear-gradient, react-native-maps, etc.',
    parameters: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'The npm package name (e.g., "expo-linear-gradient", "react-native-vector-icons")' },
        version: { type: 'string', description: 'The version (e.g., "12.x" or "*" for latest). Default is "*"' },
      },
      required: ['name'],
    },
  },
];

export interface ToolCall {
  name: string;
  arguments: Record<string, any>;
}

export interface ToolResult {
  success: boolean;
  result?: any;
  error?: string;
  changes?: FileChange[];
}

/**
 * Execute a tool call
 */
export function executeTool(toolCall: ToolCall, snackManager: SnackManager): ToolResult {
  try {
    switch (toolCall.name) {
      case 'write_file': {
        const { path, contents } = toolCall.arguments;
        const change = snackManager.writeFile(path, contents);
        return { success: true, result: `File ${path} ${change.action}`, changes: [change] };
      }

      case 'edit_file': {
        const { path, search, replace } = toolCall.arguments;
        const change = snackManager.editFile(path, search, replace);
        if (!change) {
          return { success: false, error: `Could not find text to replace in ${path}. Make sure the search text matches exactly.` };
        }
        return { success: true, result: `File ${path} edited`, changes: [change] };
      }

      case 'delete_file': {
        const { path } = toolCall.arguments;
        const change = snackManager.deleteFile(path);
        if (!change) {
          return { success: false, error: `File ${path} not found` };
        }
        return { success: true, result: `File ${path} deleted`, changes: [change] };
      }

      case 'read_file': {
        const { path } = toolCall.arguments;
        const contents = snackManager.readFile(path);
        if (contents === null) {
          return { success: false, error: `File ${path} not found` };
        }
        return { success: true, result: contents };
      }

      case 'list_files': {
        const files = snackManager.listFiles();
        return { success: true, result: files };
      }

      case 'add_dependency': {
        const { name, version = '*' } = toolCall.arguments;
        snackManager.addDependency(name, version);
        return { success: true, result: `Added dependency ${name}@${version}` };
      }

      default:
        return { success: false, error: `Unknown tool: ${toolCall.name}` };
    }
  } catch (error: any) {
    return { success: false, error: error.message || 'Tool execution failed' };
  }
}

/**
 * Parse tool calls from AI response
 * AI should respond in this format:
 * <tool_call>
 * {"name": "write_file", "arguments": {"path": "...", "contents": "..."}}
 * </tool_call>
 */
export function parseToolCalls(response: string): ToolCall[] {
  const toolCalls: ToolCall[] = [];
  
  // Match <tool_call>...</tool_call> blocks
  const toolCallRegex = /<tool_call>\s*([\s\S]*?)\s*<\/tool_call>/g;
  let match;
  
  while ((match = toolCallRegex.exec(response)) !== null) {
    try {
      const toolCall = JSON.parse(match[1].trim());
      if (toolCall.name && toolCall.arguments) {
        toolCalls.push(toolCall);
      }
    } catch (e) {
      console.warn('Failed to parse tool call:', match[1]);
    }
  }
  
  return toolCalls;
}

/**
 * Extract message content (text without tool calls)
 */
export function extractMessageContent(response: string): string {
  return response
    .replace(/<tool_call>[\s\S]*?<\/tool_call>/g, '')
    .trim();
}

/**
 * Generate system prompt for the AI with tools
 */
export function getAgentSystemPrompt(files: string[], fileContents?: Record<string, string>): string {
  const fileList = files.map(f => `- ${f}`).join('\n');
  
  return `You are 24fit AI, an expert React Native and Expo developer. You help users build mobile apps by writing clean, production-ready code.

## YOUR TOOLS

You have these tools to modify the project:

### write_file
Create a new file or completely overwrite an existing file.
Use for: Creating new screens, new components, or major rewrites.

### edit_file  
Edit an existing file by finding and replacing specific text.
Use for: Small changes like fixing bugs, changing colors, updating text.
IMPORTANT: The search text must match EXACTLY including whitespace and indentation.

### delete_file
Delete a file from the project.

### read_file
Read a file's contents before modifying it.

### add_dependency
Add an npm package to the project.

## CURRENT PROJECT FILES:
${fileList}

## HOW TO USE TOOLS

Wrap each tool call in <tool_call> tags with valid JSON:

<tool_call>
{"name": "write_file", "arguments": {"path": "screens/ProfileScreen.js", "contents": "import React from 'react';\\nimport { View, Text } from 'react-native';\\n..."}}
</tool_call>

You can use multiple tools in one response. They execute in order.

## PROJECT STRUCTURE

Follow this structure for React Native/Expo apps:
\`\`\`
App.js              # Entry point with navigation setup
screens/            # Screen components (HomeScreen.js, ProfileScreen.js, etc.)
components/         # Reusable UI components (Button.js, Card.js, etc.)
constants/          # Design tokens, colors, config (Colors.js)
hooks/              # Custom React hooks
utils/              # Utility functions
\`\`\`

## CODE STYLE GUIDELINES

1. **Imports**: Always use proper React Native imports
   \`\`\`javascript
   import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
   import { SafeAreaView } from 'react-native-safe-area-context';
   \`\`\`

2. **Styling**: Use StyleSheet.create() for styles
   \`\`\`javascript
   const styles = StyleSheet.create({
     container: { flex: 1, backgroundColor: '#0a0a0a' },
   });
   \`\`\`

3. **Colors**: Use the design system from constants/Colors.js
   - Background: #0a0a0a (dark), #111111 (card)
   - Primary: #7c3aed (purple)
   - Text: #ffffff (primary), #a1a1aa (muted)

4. **Navigation**: Use @react-navigation/native with native-stack
   \`\`\`javascript
   import { NavigationContainer } from '@react-navigation/native';
   import { createNativeStackNavigator } from '@react-navigation/native-stack';
   \`\`\`

5. **Components**: Export as default, use functional components with hooks

## WHEN TO USE WHICH TOOL

- **New feature/screen** → write_file to create new files
- **Bug fix** → edit_file to change specific code
- **Style change** → edit_file to update StyleSheet
- **Add new section** → edit_file or write_file depending on scope
- **Refactor** → May need multiple edit_file or write_file calls

## RESPONSE FORMAT

1. Brief explanation (1-2 sentences) of what you're doing
2. Your tool calls
3. Short confirmation of changes made

Keep responses concise and focused on actions. Don't explain code unless asked.`;
}

/**
 * Process AI response and execute tools
 */
export async function processAIResponse(
  response: string,
  snackManager: SnackManager
): Promise<{
  message: string;
  changes: FileChange[];
  toolResults: ToolResult[];
}> {
  const toolCalls = parseToolCalls(response);
  const message = extractMessageContent(response);
  const changes: FileChange[] = [];
  const toolResults: ToolResult[] = [];

  for (const toolCall of toolCalls) {
    const result = executeTool(toolCall, snackManager);
    toolResults.push(result);
    
    if (result.changes) {
      changes.push(...result.changes);
    }
  }

  return { message, changes, toolResults };
}
