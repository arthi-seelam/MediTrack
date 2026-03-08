# healthee: Find My Care

A modern healthcare provider discovery platform that helps users find hospitals, doctors, and emergency services near their location.

## Features

- **Hospital Discovery**: Search and filter hospitals by name, location, and services
- **Doctor Finder**: Locate doctors by specialty, name, and consultation type
- **Emergency Services**: Quick access to nearest emergency facilities with critical care capabilities
- **Location Detection**: Automatic location detection to show services nearby
- **Advanced Filtering**: Filter by emergency support, ICU availability, and 24/7 operations
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with shadcn/ui components
- **Routing**: React Router v6
- **State Management**: React Context API with React Query
- **Geolocation**: Browser Geolocation API with Haversine distance calculation

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm, yarn, or bun package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd healthee-find-my-care
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
bun install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Available Scripts

- `npm run dev` - Start development server with hot module reloading
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint to check code quality
- `npm run test` - Run tests with Vitest
- `npm run test:watch` - Run tests in watch mode

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components
│   ├── DoctorCard.tsx
│   ├── HospitalCard.tsx
│   ├── Layout.tsx
│   └── Navbar.tsx
├── contexts/           # React Context providers
│   └── LocationContext.tsx
├── data/               # Mock data
│   └── mockData.ts
├── hooks/              # Custom React hooks
│   ├── use-geolocation.ts
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/                # Utility functions
│   └── utils.ts
├── pages/              # Page components
│   ├── Index.tsx
│   ├── HospitalSearchPage.tsx
│   ├── DoctorSearchPage.tsx
│   ├── HospitalDetailPage.tsx
│   ├── EmergencyPage.tsx
│   └── NotFound.tsx
├── test/               # Test files
│   ├── example.test.ts
│   └── setup.ts
└── App.tsx
```

## Key Components

### Pages

- **Index** - Landing page with quick actions and search functionality
- **HospitalSearchPage** - Hospital listing and filtering
- **HospitalDetailPage** - Detailed information about a specific hospital
- **DoctorSearchPage** - Doctor search with specialty and consultation type filters
- **EmergencyPage** - Emergency services with nearest facility detection
- **NotFound** - 404 page for invalid routes

### Hooks

- `useLocationContext` - Access location state and city selection
- `useGeolocation` - Browser geolocation with distance calculations
- `useToast` - Toast notification system
- `useMobile` - Detect if viewing on mobile device

## Features in Detail

### Location Management

The application automatically detects user location and finds the nearest city from the available list. Users can manually select a different city from the navigation bar. Location data is persisted in localStorage.

### Search and Filtering

Hospitals can be filtered by:
- Name/keyword search
- Emergency support availability
- ICU availability
- 24/7 operations

Doctors can be filtered by:
- Name/keyword search
- Specialization
- Consultation type (Online/Offline/Both)

### Distance Calculation

Uses the Haversine formula to accurately calculate distances between user location and facilities.

## TypeScript

The project uses strict TypeScript mode for type safety. All components and utilities are fully typed.

## Styling

- **Tailwind CSS** for utility-first styling
- **shadcn/ui** for accessible, pre-built components
- **Framer Motion** for smooth animations
- Custom color theme with semantic tokens

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Development Guidelines

- Follow the existing code structure and naming conventions
- Use TypeScript for all new code
- Add JSDoc comments for complex functions
- Ensure code passes ESLint checks
- Test components with the provided test setup

## License

This project is private and proprietary.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)
