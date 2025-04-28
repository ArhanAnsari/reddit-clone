# Reddit AI Clone - Next.js 15 & Sanity CMS

A modern, AI-powered Reddit clone built with Next.js 15, Sanity CMS, Clerk, and AI content moderation. Features real-time content updates, community management, and AI-assisted content filtering.

## Things to do before you start

#### Support the Project

When you sign up for services using our affiliate links, you help support the continued development of project's like these at no extra cost to you:

- Sign up to **Clerk** here: https://go.clerk.com/if5bz07

- Sign up to **Sanity:** here: https://www.sanity.io/sonny?utm_source=youtube&utm_medium=video&utm_content=reddit

These partnerships allow us to maintain this project while keeping it free and open source.
Thank you for your support!

## Features

### For Users

- 🏠 Browse posts from all communities on the homepage
- 🔍 Search for posts and communities
- 📝 Create and manage posts with rich text formatting
- 📊 Vote on posts and comments
- 💬 Participate in community discussions through comments
- 🖼️ Include images in posts for visual content
- 👤 User profiles with post history

### For Communities

- 🌐 Create and customize subreddits / communities
- 📋 Community-specific post feeds
- 🚫 Report inappropriate content

### AI Features

- 🤖 AI-powered content moderation
- 🛡️ Automatic detection and censoring of inappropriate content
- 🚩 User reporting system for violations
- 🔍 Smart content analysis for community standards enforcement

### Technical Features

- 🚀 Server Components & Server Actions with Next.js 15
- 👤 Authentication with Clerk
- 📝 Content management with Sanity.io
- 🎨 Modern UI with Tailwind CSS and Radix UI
- 📱 Responsive design
- 🔄 Real-time content updates
- 🔒 Protected routes and content
- ⚡ Turbopack for fast development

### UI/UX Features

- 🎯 Clean, Reddit-inspired interface
- 🎨 Consistent design system using Radix UI components
- ♿ Accessible components
- 📱 Responsive across all devices
- ⏱️ Time-ago timestamps for posts and comments
- 🔍 Intuitive search functionality
- 💫 Micro-interactions for better engagement

## Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Clerk Account
- Sanity Account
- OpenAI API key (for AI moderation)

### Environment Variables

Create a `.env.local` file with:

```bash
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-sanity-read-token

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key

# OpenAI (for AI moderation)
OPENAI_API_KEY=your-openai-api-key
```

### Installation

```bash
# Clone the repository

# Install dependencies using pnpm
pnpm install

# Start the development server with Turbopack
pnpm dev

```

### Setting up Sanity CMS

1. Create a Sanity account
2. Create a new project
3. Install the Sanity CLI:
   ```bash
   npm install -g @sanity/cli
   ```
4. Initialize Sanity in your project:
   ```bash
   sanity init
   ```
5. Deploy Sanity Studio:
   ```bash
   sanity deploy
   ```

### Setting up Clerk

1. Create a Clerk application
2. Configure authentication providers
3. Set up redirect URLs
4. Add environment variables

### Core Technologies

- Next.js 15
- TypeScript
- Sanity CMS
- Clerk Auth
- OpenAI API
- Tailwind CSS
- Radix UI
- Lucide Icons

## Join the World's Best Developer Course & Community Zero to Full Stack Hero! 🚀

### Want to Master Modern Web Development?

This project was built as part of the [Zero to Full Stack Hero](https://www.papareact.com/course) course. Join thousands of developers and learn how to build projects like this and much more!

#### What You'll Learn:

- 📚 Comprehensive Full Stack Development Training
- 🎯 50+ Real-World Projects
- 🤝 Access to the PAPAFAM Developer Community
- 🎓 Weekly Live Coaching Calls
- 🤖 AI & Modern Tech Stack Mastery
- 💼 Career Guidance & Interview Prep

#### Course Features:

- ⭐ Lifetime Access to All Content
- 🎯 Project-Based Learning
- 💬 Private Discord Community
- 🔄 Regular Content Updates
- 👥 Peer Learning & Networking
- 📈 Personal Growth Tracking

[Join Zero to Full Stack Hero Today!](https://www.papareact.com/course)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

---

Built with ❤️ using Next.js, Sanity, Clerk, and OpenAI
