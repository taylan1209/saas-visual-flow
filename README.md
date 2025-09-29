# VisualFlow - Social Media Graphics SaaS

VisualFlow is a web-based SaaS tool that allows companies to manage their social media graphics without needing a designer for every update. Designers create professional templates with editable fields and locked elements to maintain brand consistency.

## 🚀 Features

- **Template Management**: Upload and manage professional social media templates
- **Brand Consistency**: Lock design elements (colors, fonts, layout) while allowing text/image edits
- **Multi-Platform Export**: Export graphics for Instagram, Facebook, TikTok, and more
- **User Authentication**: Secure login/signup system
- **Dashboard**: Intuitive interface for managing projects and templates
- **Dark Mode Support**: Built-in dark/light theme switching

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Authentication**: Custom auth context (Firebase integration planned)
- **Icons**: Lucide React
- **Fonts**: Inter (Google Fonts)

## 🎨 Design System

The project uses a custom design system with:
- Primary color: `#13a4ec` (Blue)
- Light/Dark theme support
- Custom color palette for backgrounds, text, and borders
- Inter font family for consistent typography

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd saas-visual-flow
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔐 Demo Credentials

For testing purposes, use these demo credentials:

- **Email**: `demo@visualflow.com`
- **Password**: `demo123`

Alternative:
- **Email**: `admin@visualflow.com`
- **Password**: `admin123`

## 📁 Project Structure

```
src/
├── app/
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Dashboard interface
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page (redirects)
├── contexts/
│   └── AuthContext.tsx # Authentication context
└── components/         # Reusable components (to be added)
```

## 🔄 Authentication Flow

1. User visits the home page (`/`)
2. If not authenticated, redirected to `/auth`
3. User can login or signup using demo credentials
4. Upon successful authentication, redirected to `/dashboard`
5. User data is stored in localStorage for persistence

## 🎯 Roadmap

- [ ] Firebase Authentication integration
- [ ] Template upload and management system
- [ ] Canvas-based template editor
- [ ] Image upload and management
- [ ] Export functionality (PNG, JPG, PDF)
- [ ] User subscription management
- [ ] Template marketplace
- [ ] Collaboration features
- [ ] Analytics dashboard

## 🤝 Contributing

This project is in active development. More screens and features will be added progressively.

## 📄 License

This project is private and proprietary.

# saas-visual-flow

This project contains a visual design tool built with Next.js and Tailwind CSS.

New: Fabric.js Editor (Beta)
- A new page is available at /fabric-editor that uses Fabric.js to edit images with layers.
- Features: add/edit text (IText), shapes (rectangles, circles), move/resize/rotate, basic z-order controls, lock/unlock, background image filters (brightness, contrast, saturation, blur, opacity), overlay image upload, and export to PNG.

How to use
1. Install dependencies:
   - npm install
2. Run the dev server:
   - npm run dev
3. Open the Fabric editor:
   - http://localhost:3000/fabric-editor?img=YOUR_IMAGE_URL&w=1200&h=800

Notes
- The editor dynamically imports fabric to avoid SSR issues.
- Some remote images require CORS permission to be edited and exported in the canvas. If you see the canvas tainted error, host the image with proper CORS or upload it through the provided overlay import.
- You can still use the existing My Designs page at /my-designs. The Fabric editor is separate and non-invasive.
