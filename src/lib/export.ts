import JSZip from "jszip";
import { saveAs } from "file-saver";

export function downloadAsFile(code: string, filename: string = "App.js") {
  const blob = new Blob([code], { type: "text/javascript" });
  saveAs(blob, filename);
}

export async function downloadAsExpoProject(
  code: string,
  projectName: string = "my-app"
) {
  const zip = new JSZip();
  const safeName = projectName.toLowerCase().replace(/[^a-z0-9-]/g, "-");

  // package.json
  const packageJson = {
    name: safeName,
    version: "1.0.0",
    main: "expo-router/entry",
    scripts: {
      start: "expo start",
      android: "expo start --android",
      ios: "expo start --ios",
      web: "expo start --web",
    },
    dependencies: {
      expo: "~52.0.0",
      "expo-router": "~4.0.0",
      "expo-status-bar": "~2.0.0",
      react: "18.3.1",
      "react-native": "0.76.0",
      "react-native-safe-area-context": "4.12.0",
      "react-native-screens": "~4.1.0",
    },
    devDependencies: {
      "@babel/core": "^7.25.2",
      "@types/react": "~18.3.12",
      typescript: "~5.3.3",
    },
    private: true,
  };

  // app.json
  const appJson = {
    expo: {
      name: projectName,
      slug: safeName,
      version: "1.0.0",
      orientation: "portrait",
      icon: "./assets/icon.png",
      userInterfaceStyle: "automatic",
      newArchEnabled: true,
      splash: {
        image: "./assets/splash-icon.png",
        resizeMode: "contain",
        backgroundColor: "#0a0a0a",
      },
      ios: {
        supportsTablet: true,
        bundleIdentifier: `com.${safeName}`,
      },
      android: {
        adaptiveIcon: {
          foregroundImage: "./assets/adaptive-icon.png",
          backgroundColor: "#0a0a0a",
        },
        package: `com.${safeName}`,
      },
      web: {
        bundler: "metro",
        output: "static",
        favicon: "./assets/favicon.png",
      },
      plugins: ["expo-router"],
      scheme: safeName,
    },
  };

  // babel.config.js
  const babelConfig = `module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
`;

  // tsconfig.json
  const tsConfig = {
    extends: "expo/tsconfig.base",
    compilerOptions: {
      strict: true,
      paths: {
        "@/*": ["./*"],
      },
    },
    include: ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"],
  };

  // app/_layout.tsx
  const layoutCode = `import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
`;

  // app/index.tsx (user's code wrapped)
  const indexCode = code;

  // .gitignore
  const gitignore = `node_modules/
.expo/
dist/
npm-debug.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision
*.orig.*
web-build/
.env*.local
`;

  // README.md
  const readme = `# ${projectName}

Built with [AppForge AI](https://appforge.ai)

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Start the development server:
\`\`\`bash
npx expo start
\`\`\`

3. Scan the QR code with:
   - **iOS**: Camera app or Expo Go
   - **Android**: Expo Go app

## Build for Production

\`\`\`bash
# Install EAS CLI
npm install -g eas-cli

# Build for Android
eas build --platform android

# Build for iOS
eas build --platform ios
\`\`\`

## Learn More

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
`;

  // Add files to zip
  zip.file("package.json", JSON.stringify(packageJson, null, 2));
  zip.file("app.json", JSON.stringify(appJson, null, 2));
  zip.file("babel.config.js", babelConfig);
  zip.file("tsconfig.json", JSON.stringify(tsConfig, null, 2));
  zip.file(".gitignore", gitignore);
  zip.file("README.md", readme);

  // App folder
  zip.file("app/_layout.tsx", layoutCode);
  zip.file("app/index.tsx", indexCode);

  // Assets folder with placeholder images (base64 encoded simple icon)
  const placeholderIcon = createPlaceholderIcon();
  zip.file("assets/icon.png", placeholderIcon, { base64: true });
  zip.file("assets/splash-icon.png", placeholderIcon, { base64: true });
  zip.file("assets/adaptive-icon.png", placeholderIcon, { base64: true });
  zip.file("assets/favicon.png", placeholderIcon, { base64: true });

  // Generate and download
  const content = await zip.generateAsync({ type: "blob" });
  saveAs(content, `${safeName}.zip`);
}

// Create a simple placeholder icon (1x1 purple pixel PNG)
function createPlaceholderIcon(): string {
  // A simple 100x100 purple PNG encoded as base64
  // This is a minimal valid PNG
  return "iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAACXBIWXMAAAsTAAALEwEAmpwYAAABN0lEQVR4nO3bMQ6CQBBA0f3/oxtswMTEhNLYWFhYuIUbWFiA0dhYKN5AK2MDJsYbeCUNLjEsYZd/8F+x7MxkJwMBAAAAAAAAAAAAAPy/Ilcr6u+9Vk5OOqNFPXerNF7V8jJ4qjwb+b4cDgaTfIpHHXxWHs28yqdZvVFOHRd3+1S+xqvyJR9mwb7Gh8pXefYa+W/xoPJtnj5HvsMXvKk8y4cZ8C3eVJ7lo9e4Uflv8Kny33lXeZYPXuNR5Vk+zIJv8aryLB+8xrPKs3yYBT/Gh8qXefYa+Q5f8KbyLB9mwLd4UXmWj17jWuVZPniNJ5Vn+TALvsWbyrN89Br5Dl/wqvIsH7zGs8qzfJgFP8aHypd59hr5Dl/wpvIsH2bAt3hReZaPXuNa5Vk+eI0AAAAAAAAAAAD4fz4AqTWZHgmG3REAAAAASUVORK5CYII=";
}

export function generateExpoGoQRUrl(code: string): string {
  // Create a Snack URL that can be opened in Expo Go
  const encodedCode = encodeURIComponent(code);
  // This creates a temporary Snack - for production, you'd want to use Snack API
  return `https://snack.expo.dev/?code=${encodedCode}`;
}
