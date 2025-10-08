# Moonshot Signup Counter

A real-time analytics dashboard for tracking Moonshot signup counts with comprehensive growth projections and historical trend analysis.

![Dashboard Preview](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)

## 🚀 Features

### Real-Time Analytics
- **Live Signup Counter** - Displays current signup count with automatic refresh every 60 seconds
- **Progress Tracking** - Visual progress bar showing percentage towards 5,000 signup goal
- **Goal Projection** - AI-powered estimation of goal completion date based on current growth rate

### Comprehensive Statistics
- **Growth Rate** - Total percentage growth since tracking started
- **Average per Hour** - Real-time calculation of signup velocity
- **24-Hour Activity** - Recent signup count from the last day
- **Remaining Count** - Signups needed to reach target goal

### Interactive Data Visualization
- **Historical Chart** - Beautiful area chart showing signup trends over time
- **Time Range Filters** - View data by 24 hours, 7 days, or all-time
- **Responsive Design** - Fully optimized for desktop, tablet, and mobile devices
- **Dark Mode Support** - Seamless light/dark theme switching

### Professional UI/UX
- **Modern Design** - Clean, professional interface with smooth animations
- **Hover Effects** - Interactive cards with scale and shadow transitions
- **Loading States** - Elegant loading animation with spinner and ping effect
- **Detail Toggle** - Show/hide additional statistics with eye icon button

## 📊 How It Works

### Data Storage
1. **Supabase Database** - Cloud-hosted PostgreSQL database for reliable data storage
2. **Real-Time Updates** - Data is stored with timestamps
3. **Scalable Architecture** - Handles high-frequency updates and queries efficiently
4. **Secure Access** - Row Level Security (RLS) policies ensure data integrity

### Frontend Dashboard
1. **Next.js App** - Modern React framework with App Router
2. **Supabase Client** - Direct database queries using `@supabase/supabase-js`
3. **Real-Time Updates** - Auto-refreshes data every minute without page reload
4. **Analytics Engine** - Calculates growth metrics, projections, and trends in real-time

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.5** - React framework with Turbopack
- **TypeScript** - Type-safe development
- **Tailwind CSS 4.0** - Utility-first CSS framework
- **Recharts** - Composable charting library
- **Vercel Analytics** - Web analytics and performance monitoring

### Backend & Database
- **Supabase** - Backend-as-a-Service with PostgreSQL database
- **@supabase/supabase-js** - Official Supabase JavaScript client
- **Real-time subscriptions** - WebSocket support for live updates

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ and npm
- Git
- Supabase account (free tier available)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Zawaer/moonshot-signup-count.git
cd moonshot-signup-count
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Create a `signups` table with columns: `id` (int8, primary key), `timestamp` (timestamptz), `count` (int8)
   - Get your project URL and anon key from project settings

4. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Run development server**
```bash
npm run dev
```

6. **Open in browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## 📁 Project Structure

```
moonshot-signup-count/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Main dashboard component
│   ├── layout.tsx         # Root layout with metadata
│   ├── globals.css        # Global styles and animations
│   └── favicon.ico        # App icon
├── .env.local            # Environment variables (not in git)
├── package.json          # Node dependencies
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.js    # Tailwind CSS config
└── next.config.ts        # Next.js configuration
```

## 📈 Key Metrics Explained

### Growth Rate
Calculates the total percentage increase in signups from the first recorded data point to the current count.

### Average per Hour
Divides total signup growth by the total time elapsed to determine the average signup velocity per hour.

### Goal Projection
Uses the current average signup rate to extrapolate when the 5,000 signup goal will be reached. Formula:
```
Days Remaining = (Goal - Current Count) / (Average per Hour × 24)
```

### Last 24 Hours
Filters data points from the last 24 hours and calculates the net increase in signups during that period.

## 🎨 Customization

### Change Goal Target
Edit the `TARGET` constant in `app/page.tsx`:
```typescript
const TARGET = 5000; // Change to your desired goal
```

### Adjust Refresh Interval
Modify the interval in the `useEffect` hook:
```typescript
const interval = setInterval(fetchData, 60000); // 60000ms = 1 minute
```

### Update Supabase Configuration
Change the Supabase credentials in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_new_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_new_anon_key
```

## � Database Schema

### Supabase Table: `signups`

| Column    | Type        | Description                    |
|-----------|-------------|--------------------------------|
| id        | int8        | Primary key, auto-increment    |
| timestamp | timestamptz | When the count was recorded    |
| count     | int8        | Number of signups at timestamp |

### Data Collection
Data can be inserted into the Supabase database through:
- Manual inserts via Supabase dashboard
- API endpoints (requires authentication)
- Scheduled jobs or webhooks
- Third-party automation tools

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy with one click
5. Automatic deployments on every push

### Other Platforms
- **Netlify** - Connect GitHub repo and deploy
- **AWS Amplify** - Full-stack deployment
- **Docker** - Containerize the Next.js app

## 📝 Environment Variables

Required environment variables in `.env.local`:

| Variable                      | Description                           |
|-------------------------------|---------------------------------------|
| NEXT_PUBLIC_SUPABASE_URL      | Your Supabase project URL             |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Your Supabase anonymous/public key    |

**Note:** Never commit `.env.local` to version control. The file is already in `.gitignore`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database powered by [Supabase](https://supabase.com/)
- Charts powered by [Recharts](https://recharts.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Analytics by [Vercel Analytics](https://vercel.com/analytics)

## 📄 License

This project is licensed under the MIT license.
