# Moonshot Signup Counter

A real-time analytics dashboard for tracking Moonshot signup counts with comprehensive growth projections and historical trend analysis.

![Dashboard Preview](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwindcss)

## 🛠️ Features

### Real-Time Analytics
- **Live Signup Counter** - Displays current signup count with automatic refresh every 60 seconds
- **Signup history & Analytics** - Browse a timestamped history of signup records along with analytics on the history
- **Progress Tracking** - Visual progress bar showing percentage towards the signup goal of 5000 people
- **Goal Projection** - Estimation of goal completion date based on current growth rate

## 📊 How It Works

TODO

## 🚀 Run locally

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
   - Create a new project at [Supabase](https://supabase.com)
   - Create a `signups` table with columns: `id` (int8, primary key), `count` (int8), `timestamp` (timestamptz, default value as now())
   - Enable RLS and realtime for the table
   - Add a policy `Enable read access for all users` for the table
   - Create an edge function and paste the code from `supabase/functions/signup-count.fetcher.ts` into the editor
   - Create a Cron Job for the edge function in `Integrations -> Cron -> Jobs`. Schedule it to run every minute and select the `signup-count-fetcher` edge function as the type. Set the method to `POST`, timeout to `1000ms` and add a HTTP header named `Authorization` with the value `Bearer <your service role key>` and insert the service role key from `Project Settings -> API Keys`. Put `{"name":"Functions"}` to the HTTP request body.

4. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

   You can find the project URL in `Project Settings -> Data API` and the anon key in `Project Settings -> API Keys`

5. **Run development server**
```bash
npm run dev
```

Open http://localhost:3000 with your browser.

## 🌐 Deployment

### Vercel (recommended)
1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy with one click
5. Automatic deployments on every push

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

## 📄 License

This project is licensed under the MIT license.
