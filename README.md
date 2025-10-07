# Moonshot Signup Count

A real-time analytics dashboard for tracking Moonshot signup counts with comprehensive growth projections and historical trend analysis.

![Dashboard Preview](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwindcss)

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

### Data Collection
1. **Python Script** (`app.py`) - Polls the Moonshot stats API periodically
2. **Data Storage** - Appends timestamped counts to `data.csv` in the repository
3. **Automation** - GitHub Actions runs the script every 5 minutes automatically
4. **Version Control** - All data is tracked and versioned in Git

### Frontend Dashboard
1. **Next.js App** - Modern React framework with App Router
2. **Data Fetching** - Reads `data.csv` from GitHub raw URL with cache-busting
3. **Real-Time Updates** - Auto-refreshes data every minute without page reload
4. **Analytics Engine** - Calculates growth metrics, projections, and trends in real-time

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.5** - React framework with Turbopack
- **TypeScript** - Type-safe development
- **Tailwind CSS 4.0** - Utility-first CSS framework
- **Recharts** - Composable charting library
- **Vercel Analytics** - Web analytics and performance monitoring

### Backend
- **Python 3.x** - Data collection script
- **GitHub Actions** - Automated workflow scheduling
- **CSV Storage** - Simple, version-controlled data storage

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ and npm
- Git

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

3. **Run development server**
```bash
npm run dev
```

4. **Open in browser**
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
├── app.py                 # Python data collection script
├── data.csv              # Historical signup data
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

### Update Data Source
Change the CSV URL in `app/page.tsx`:
```typescript
const baseUrl = 'https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/data.csv';
```

## 🔄 Automated Data Collection

The Python script runs automatically via GitHub Actions every 5 minutes. The workflow:
1. Fetches current signup count from API
2. Appends timestamp and count to `data.csv`
3. Commits and pushes changes to repository
4. Dashboard automatically picks up new data on next refresh

## 🌐 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Deploy with one click
4. Automatic deployments on every push

### Other Platforms
- **Netlify** - Connect GitHub repo and deploy
- **AWS Amplify** - Full-stack deployment
- **Docker** - Containerize the Next.js app

## 📝 Data Format

The `data.csv` file structure:
```csv
timestamp,count
2025-01-01T12:00:00Z,1234
2025-01-01T12:05:00Z,1235
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Charts powered by [Recharts](https://recharts.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Analytics by [Vercel Analytics](https://vercel.com/analytics)

## 📧 Contact

Project Link: [https://github.com/Zawaer/moonshot-signup-count](https://github.com/Zawaer/moonshot-signup-count)
Project Link: [https://github.com/Stefanos0710/moonshot-signup-count](https://github.com/Stefanos0710/moonshot-signup-count)
---

Made with ❤️ for tracking Moonshot signups
