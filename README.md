# AI Interviewer

A modern web application that leverages artificial intelligence to conduct and manage interviews efficiently.

## Features

- AI-powered interview conduction
- Real-time facial analysis during interviews
- Role-based access control (Admin, Recruiter, Candidate)
- Interactive dashboard
- Job posting and management
- Candidate tracking
- Notification system
- Profile management
- Settings customization

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Radix UI Components
- Face-API.js
- OpenAI Integration
- React Hook Form
- Zod Validation

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```
3. Set up environment variables:
   Create a `.env.local` file with the following variables:
   ```
   OPENAI_API_KEY=your_openai_api_key
   DATABASE_URL=your_database_url
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- `/app` - Next.js app router pages and layouts
- `/components` - Reusable UI components
- `/hooks` - Custom React hooks
- `/lib` - Utility functions and configurations
- `/public` - Static assets
- `/styles` - Global styles and Tailwind configuration
- `/types` - TypeScript type definitions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 