# AI powered Smart Resume Builder

A smart and user-friendly resume builder, built in next.js, that helps users create impactful resumes using AI. Premium users can access advanced features such as AI-generated professional summaries, work experience descriptions, project details from GitHub links, and tailored suggestions based on the job title.

Project By :
23CS10027 : Jay Jani
23CS10067 : Sivaroop J

## Getting Started

Clone the repository and install dependencies:

```bash
git clone https://github.com/SivaroopJ/nextjs-15-ai-resume-builder
npm i --legacy-peer-deps
```

**Setup Environment Variables :** Create a .env file in the project directory and add:
```env
CLERK_SECRET_KEY=your_clerk_secret
CLERK_PUBLISHABLE_KEY=your_clerk_publishable
STRIPE_SECRET_KEY=your_stripe_secret
DATABASE_URL=your_vercel_postgres_url
DEEPSEEK_API_KEY=your_deepseek_key
```

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
