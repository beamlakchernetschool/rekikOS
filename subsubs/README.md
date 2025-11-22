# Beamlak SRTs - Subtitle Downloader

A modern web application for searching and downloading subtitles from OpenSubtitles. Built with Next.js 15, TypeScript, and styled with beautiful brown-gold colors.

## Features

- 🔍 **Search Subtitles**: Find subtitles for movies and TV shows from OpenSubtitles
- 📥 **Download SRT Files**: Direct download of subtitle files
- 📚 **Download History**: Track your downloaded subtitles
- 🌙 **Dark Mode**: Beautiful dark mode with seamless theme switching
- 🎨 **Beautiful UI**: Brown-gold color scheme with hover effects and animations
- 📱 **Responsive Design**: Works perfectly on all devices

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: Prisma with SQLite (for local development)
- **Styling**: Tailwind CSS with custom brown-gold theme
- **UI Components**: Radix UI with shadcn/ui
- **Icons**: Lucide React
- **Theme**: next-themes for dark mode

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd beamlak-srts
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenSubtitles API key:
   ```
   OPENSUBTITLES_API_KEY=your_api_key_here
   ```

4. **Set up the database**:
   ```bash
   npm run db:push
   ```

5. **Run the development server**:
   ```bash
   npm run dev
   ```

6. **Open your browser** and navigate to `http://localhost:3000`

## OpenSubtitles API Key

To get an API key:

1. Visit [OpenSubtitles API](https://www.opensubtitles.com/en/api)
2. Sign up for an account
3. Generate an API key
4. Add it to your `.env` file

## Project Structure

```
src/
├── app/
│   ├── api/subtitles/     # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/
│   ├── ui/                # Reusable UI components
│   └── mode-toggle.tsx    # Dark mode toggle
└── lib/
    ├── db.ts              # Prisma client
    └── utils.ts           # Utility functions
```

## Deployment

### Vercel (Recommended)

1. **Push your code to GitHub**
2. **Connect your repository to Vercel**
3. **Add environment variables in Vercel dashboard**:
   - `OPENSUBTITLES_API_KEY`
   - `NEXTAUTH_SECRET` (generate a random string)
4. **Deploy** - Vercel will automatically build and deploy your app

### Environment Variables for Production

Make sure to add these in your Vercel dashboard:

```
OPENSUBTITLES_API_KEY=your_production_api_key
NEXTAUTH_SECRET=your_random_secret_string
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Prisma Studio

## Features in Detail

### Search Functionality
- Search by movie or TV show title
- Filter by language
- View rating and download count
- See file details and comments

### Download History
- Automatic tracking of downloaded subtitles
- Sort by download date
- View file details and language

### UI/UX
- Beautiful brown-gold gradient theme
- Smooth hover effects and animations
- Dark mode support
- Fully responsive design
- Loading states and error handling

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Note**: This application uses the OpenSubtitles API. Please respect their terms of service and rate limits.