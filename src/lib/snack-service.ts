/**
 * Snack Service - Manages Expo Snack embeds
 * Uses Snack's embedded URL approach for compatibility with Next.js
 * Docs: https://github.com/expo/snack/blob/main/docs/url-query-parameters.md
 */

export interface SnackFile {
  type: 'CODE' | 'ASSET';
  contents: string;
}

export interface SnackProject {
  name: string;
  description?: string;
  files: Record<string, SnackFile>;
  dependencies: Record<string, string>;
  sdkVersion?: string;
}

export interface SnackUrls {
  embedUrl: string;
  webUrl: string;
  qrCodeUrl: string;
}

const SNACK_SDK_VERSION = '52.0.0';
const SNACK_EMBED_BASE = 'https://snack.expo.dev/embedded';
const SNACK_WEB_BASE = 'https://snack.expo.dev';

/**
 * Convert project files to Snack file format
 */
export function convertToSnackFiles(files: Record<string, string>): Record<string, SnackFile> {
  const snackFiles: Record<string, SnackFile> = {};
  
  for (const [path, contents] of Object.entries(files)) {
    snackFiles[path] = {
      type: 'CODE',
      contents,
    };
  }
  
  return snackFiles;
}

/**
 * Generate Snack embed URL
 * This URL can be used in an iframe for live preview
 * 
 * For single file: uses 'code' parameter
 * For multi-file: uses 'files' parameter with proper JSON format
 */
export function generateSnackEmbedUrl(project: SnackProject): string {
  const params = new URLSearchParams();
  
  // Basic parameters
  params.set('name', project.name);
  params.set('description', project.description || 'Built with 24fit');
  params.set('platform', 'web');
  params.set('theme', 'dark');
  params.set('preview', 'true');
  params.set('supportedPlatforms', 'ios,android,web');
  params.set('sdkVersion', project.sdkVersion || SNACK_SDK_VERSION);
  
  const fileCount = Object.keys(project.files).length;
  
  if (fileCount === 1 && project.files['App.js']) {
    // Single file - use 'code' parameter (simpler, shorter URL)
    params.set('code', project.files['App.js'].contents);
  } else {
    // Multi-file - use 'files' parameter with proper Snack format
    // Format: { 'path': { type: 'CODE', contents: '...' } }
    const filesObj: Record<string, { type: string; contents: string }> = {};
    for (const [path, file] of Object.entries(project.files)) {
      filesObj[path] = {
        type: file.type,
        contents: file.contents,
      };
    }
    params.set('files', JSON.stringify(filesObj));
  }
  
  // Encode dependencies as comma-separated list (Snack format)
  const deps = Object.entries(project.dependencies)
    .map(([name, version]) => {
      // If version is like "6.x", just use the package name
      // Snack will use compatible version
      if (version.includes('x') || version.includes('*')) {
        return name;
      }
      return `${name}@${version}`;
    })
    .join(',');
  
  if (deps) {
    params.set('dependencies', deps);
  }
  
  return `${SNACK_EMBED_BASE}?${params.toString()}`;
}

/**
 * Generate Snack web URL (for "Open in Snack" button)
 */
export function generateSnackWebUrl(project: SnackProject): string {
  const params = new URLSearchParams();
  
  params.set('name', project.name);
  params.set('platform', 'web');
  params.set('theme', 'dark');
  params.set('sdkVersion', project.sdkVersion || SNACK_SDK_VERSION);
  
  const fileCount = Object.keys(project.files).length;
  
  if (fileCount === 1 && project.files['App.js']) {
    // Single file - use code parameter
    params.set('code', project.files['App.js'].contents);
  } else {
    // Multi-file - use files parameter
    const filesObj: Record<string, { type: string; contents: string }> = {};
    for (const [path, file] of Object.entries(project.files)) {
      filesObj[path] = {
        type: file.type,
        contents: file.contents,
      };
    }
    params.set('files', JSON.stringify(filesObj));
  }
  
  // Add dependencies
  const deps = Object.entries(project.dependencies)
    .map(([name, version]) => {
      if (version.includes('x') || version.includes('*')) {
        return name;
      }
      return `${name}@${version}`;
    })
    .join(',');
  
  if (deps) {
    params.set('dependencies', deps);
  }
  
  return `${SNACK_WEB_BASE}?${params.toString()}`;
}

/**
 * Generate QR code URL for Expo Go
 * Uses a minimal snack URL that works with QR scanners
 */
export function generateQRCodeUrl(project: SnackProject): string {
  // For QR codes, we create a simpler URL that redirects to the snack
  const webUrl = generateSnackWebUrl(project);
  return webUrl;
}

/**
 * Generate all Snack URLs for a project
 */
export function generateSnackUrls(project: SnackProject): SnackUrls {
  return {
    embedUrl: generateSnackEmbedUrl(project),
    webUrl: generateSnackWebUrl(project),
    qrCodeUrl: generateQRCodeUrl(project),
  };
}

/**
 * Create a SnackProject from raw files and dependencies
 */
export function createSnackProject(
  name: string,
  files: Record<string, string>,
  dependencies: Record<string, string>,
  description?: string
): SnackProject {
  return {
    name,
    description,
    files: convertToSnackFiles(files),
    dependencies,
    sdkVersion: SNACK_SDK_VERSION,
  };
}

/**
 * Default project template
 */
export function getDefaultSnackProject(): SnackProject {
  return {
    name: 'My App',
    description: 'Built with 24fit',
    sdkVersion: SNACK_SDK_VERSION,
    files: {
      'App.js': {
        type: 'CODE',
        contents: `import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a0a" />
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to 24fit</Text>
        <Text style={styles.subtitle}>Describe your app to get started</Text>
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
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#a1a1aa',
    textAlign: 'center',
  },
});
`,
      },
    },
    dependencies: {},
  };
}

/**
 * Check if URL is too long for embedding
 * Browsers typically have 2000-8000 char limits
 */
export function isUrlTooLong(url: string): boolean {
  return url.length > 8000;
}

/**
 * Generate a shortened embed URL by only including essential files
 */
export function generateMinimalEmbedUrl(project: SnackProject): string {
  // Only include App.js for minimal embed
  const minimalFiles: Record<string, SnackFile> = {
    'App.js': project.files['App.js'] || { type: 'CODE', contents: '' },
  };
  
  const minimalProject: SnackProject = {
    ...project,
    files: minimalFiles,
  };
  
  return generateSnackEmbedUrl(minimalProject);
}
