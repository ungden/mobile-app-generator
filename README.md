# AppForge AI

Create mobile apps using AI in minutes. Built with Next.js, Sandpack, and OpenAI.

## Features

- **AI-Powered Code Generation**: Describe your app idea and watch it come to life
- **Live Preview**: See your React Native app in a phone simulator instantly
- **Code Editor**: View and edit the generated code with syntax highlighting
- **Export Ready**: Generated code is compatible with Expo for real device deployment

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4
- **Code Preview**: Sandpack by CodeSandbox
- **Mobile**: React Native Web

## Getting Started

### Prerequisites

- Node.js 18+
- OpenAI API Key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/appforge-ai.git
cd appforge-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Add your OpenAI API key to `.env.local`:
```
OPENAI_API_KEY=sk-your-api-key-here
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Type a description of your app in the chat panel
2. Wait for the AI to generate your React Native code
3. View the live preview in the phone simulator
4. Switch to "Code" tab to view/edit the source code
5. Export the code to use in a real Expo project

### Example Prompts

- "Create a todo list app with dark theme and swipe to delete"
- "Build a fitness tracker with workout logging and progress charts"
- "Make a recipe app with categories, search, and favorites"
- "Design a habit tracker with streaks and daily reminders"

## Deployment

### Deploy to Vercel

The easiest way to deploy is to use [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the repository on Vercel
3. Add the `OPENAI_API_KEY` environment variable
4. Deploy!

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Project Structure

```
ai-app-builder/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts    # AI code generation API
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx            # Main page component
│   ├── components/
│   │   ├── ChatPanel.tsx       # AI chat interface
│   │   └── CodePreview.tsx     # Code editor & phone preview
│   └── lib/
│       └── templates.ts        # Default code & AI prompts
├── .env.example
├── .env.local
└── package.json
```

## Monetization Ideas

- **Freemium Model**: Free tier with limited generations, paid for more
- **API Credits**: Sell API credits for code generation
- **Premium Templates**: Offer pre-built premium app templates
- **White Label**: License the platform to other businesses
- **Expo Build Integration**: Charge for APK/IPA generation

## License

MIT License - feel free to use this for your own projects!

## Acknowledgements

- [Expo](https://expo.dev) - React Native framework
- [Sandpack](https://sandpack.codesandbox.io) - Live code editor by CodeSandbox
- [OpenAI](https://openai.com) - AI models for code generation
