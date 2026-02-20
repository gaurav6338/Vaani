# Vaani - AI Complaint Management System

**आपकी आवाज़ सरकार तक** (Your voice to the government)

An AI-powered complaint management system that automatically categorizes and routes citizen complaints to appropriate government departments.

## Features

- **Multi-user Support**: Citizen, Department, and Admin roles
- **AI-Powered Categorization**: Automatic complaint routing using AI analysis
- **Real-time Tracking**: Monitor complaint status from submission to resolution
- **Photo Evidence**: Upload photos with complaints
- **Department Dashboard**: Manage and respond to assigned complaints
- **Admin Panel**: System-wide oversight and management
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend Framework**: React 18.3.1
- **Build Tool**: Vite 6.3.6
- **Language**: TypeScript
- **UI Components**: Shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **Form Handling**: React Hook Form
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: Sonner

## Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

```bash
# Clone the repository
git clone <repository-url>
cd "AI Complaint Management System"

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

## Development

```bash
# Start development server
npm run dev

# The application will open at http://localhost:3000/
```

## Production Build

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Deployment on Vercel

### Option 1: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Option 2: Using GitHub Integration

1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Select your GitHub repository
4. Vercel will auto-detect Vite configuration
5. Deploy

### Environment Variables on Vercel

1. Go to your project settings on Vercel
2. Add environment variables:
   - `VITE_API_URL`: Your API endpoint

## Project Structure

```
src/
├── components/
│   ├── AdminDashboard.tsx      # Admin panel
│   ├── AuthInterface.tsx        # Login/Register
│   ├── DepartmentDashboard.tsx # Department portal
│   ├── UserComplaintInterface.tsx # Complaint submission
│   ├── ui/                      # Shadcn/ui components
│   └── sideUI/                  # Custom components
├── styles/
│   └── globals.css
├── App.tsx                      # Main app component
├── main.tsx                     # Entry point
└── index.css                    # Base styles
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm audit` | Check for vulnerabilities |
| `npm audit fix` | Fix security vulnerabilities |

## Demo Accounts

For testing, use these credentials:

- **Citizen**: john.doe@email.com
- **Department**: electricity@city.gov
- **Admin**: admin@city.gov

(No password required for demo)

## Key Components

### UserComplaintInterface
- Complaint form with category and priority selection
- Photo upload functionality
- Real-time preview
- Complaint history tracking

### DepartmentDashboard
- View assigned complaints
- Update complaint status
- Department analytics

### AdminDashboard
- System-wide oversight
- User and department management
- System statistics

## Security

- TypeScript for type safety
- React Hook Form for secure form handling
- Environment-based configuration
- Input validation

## Performance

- SWC compiler for fast builds
- Code splitting and lazy loading
- Optimized bundle size
- Vite's fast HMR during development

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Contributing

1. Create a feature branch
2. Commit your changes
3. Push to the branch
4. Create a Pull Request

## License

This project is licensed under the MIT License.

## Contact

For issues and feedback, please create an issue in the repository.

---

**Made with ❤️ for better citizen grievance management**
