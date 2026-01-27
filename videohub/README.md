# VideoHub - Social Video & Photo Platform

A modern, full-featured social media platform for sharing videos and photos, built with React, Tailwind CSS, and Supabase.

## Features

- **User Authentication**: Secure login/signup with Supabase Auth
- **Profile System**: Custom user profiles with avatars, bios, and privacy settings
- **Content Creation**: Upload and share videos and photos
- **Social Feed**: Discover posts from creators with like and comment features
- **Creator Profiles**: Dedicated pages for each creator with their content
- **Content Management**: Users can edit and delete their own posts
- **Privacy Controls**: Creators can set posts to private or public
- **Token System**: Virtual currency for supporting creators
- **Payment Integration**: Buy tokens with real money via Stripe
- **Responsive Design**: Beautiful dark theme with smooth animations
- **Age Verification**: Content access control

## Tech Stack

- **Frontend**: React 18, React Router, Tailwind CSS
- **Backend**: Supabase (Database, Auth, Storage)
- **Payments**: Stripe
- **Icons**: Lucide React
- **Build**: Create React App

## Quick Start

### Prerequisites
- Node.js 16+
- Supabase account
- Stripe account (for payments)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Gdheubs/d-hub.git
cd d-hub/videohub
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up Supabase database:
- Create a new Supabase project
- Run the SQL script from `supabase_setup.sql` in the SQL Editor
- Enable Row Level Security (RLS) policies

5. Configure Stripe (optional for payments):
```env
REACT_APP_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### Development

```bash
npm start
```

Opens the app at [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
```

### Deploy to GitHub Pages

```bash
npm run deploy
```

The app will be available at `https://gdheubs.github.io/d-hub`.

## Database Schema

The app uses the following Supabase tables:

- `profiles`: User profile information
- `posts`: Videos and photos content
- `user_tokens`: Virtual currency balances
- `transactions`: Payment and token transaction history
- `post_likes`: User likes on posts
- `user_follows`: User follow relationships
- `user_watch_history`: Video watch history
- `user_likes`: Legacy video likes (for migration)

## Project Structure

```
videohub/
├── public/
│   ├── index.html
│   └── videos.json
├── src/
│   ├── components/
│   │   ├── AgeVerificationModal.jsx
│   │   ├── Header.jsx
│   │   ├── VideoPlayer.jsx
│   │   ├── VideoCard.jsx
│   │   ├── VideoGrid.jsx
│   │   ├── Footer.jsx
│   │   ├── LoginSignup.jsx
│   │   ├── Profile.jsx
│   │   ├── CreatorProfile.jsx
│   │   └── ...
│   ├── supabaseClient.js
│   ├── App.jsx
│   ├── index.js
│   └── index.css
├── supabase_setup.sql
├── package.json
└── README.md
```

## Key Components

### Authentication Flow
- Age verification on first visit
- Login/signup modal for user accounts
- Guest access option

### Profile System
- User profiles with customizable avatars and bios
- Privacy settings for content visibility
- Token balance display

### Content Management
- Upload videos and photos (UI ready, backend integration needed)
- Edit and delete own posts
- Organized by videos/photos tabs

### Social Features
- Like posts
- Follow creators
- View creator profiles
- Feed with posts from all users

### Payment System
- Buy tokens with credit/debit cards
- Support creators by sending tokens
- Transaction history

## API Endpoints

The app interacts with Supabase REST API for:
- User authentication
- CRUD operations on posts and profiles
- File uploads to Supabase Storage
- Payment processing via Stripe

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `REACT_APP_SUPABASE_URL` | Supabase project URL | Yes |
| `REACT_APP_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `REACT_APP_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | No |

## Deployment

### GitHub Pages
1. Update `homepage` in `package.json` with your GitHub Pages URL
2. Run `npm run deploy`
3. Enable GitHub Pages in repository settings

### Other Platforms
The built files in the `build` folder can be deployed to:
- Netlify
- Vercel
- AWS S3 + CloudFront
- Any static hosting service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Security Notes

- Supabase keys are public (client-side usage)
- RLS policies protect data access
- Stripe keys should be kept secure
- Age verification prevents underage access

## Future Enhancements

- Real-time notifications
- Direct messaging
- Advanced search and filters
- Analytics dashboard
- Mobile app version

## License

© 2026 VideoHub. All rights reserved.

## Support

For issues or questions, please open a GitHub issue or contact the maintainers.