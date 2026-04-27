# CivicSync - Civic Issue Reporting & Management Platform
# Demo
https://github.com/user-attachments/assets/ac9ef975-e20b-4588-92a8-a7133e026eb6

https://github.com/user-attachments/assets/31f2cd8a-7cb9-4732-b2cf-73444e886938

https://github.com/user-attachments/assets/ed7b6681-771f-4b41-925e-0d8fba5845cd

https://github.com/user-attachments/assets/824ec156-9ae5-44d8-9d0d-a261c95cad57



A comprehensive civic issue reporting and management platform that empowers citizens to identify, report, and track local infrastructure, sanitation, safety, and environmental issues with geolocation-based mapping and AI-powered assistance.

---

## 🌟 Key Features

### 📍 **Geolocation-Based Issue Mapping**

- Interactive map interface powered by Leaflet for visual issue tracking
- Multi-level geographic navigation (State → City → Town)
- Real-time pin placement on maps with precise coordinates (latitude, longitude)
- Heat map visualization to identify issue hotspots
- Marker clustering for better UX with dense issue areas

### 🎫 **Issue Reporting & Tracking**

- Create and report issues with detailed descriptions
- Categorize issues: Infrastructure, Sanitation, Safety, Greenery
- Track issue status: New, In Progress, Resolved
- Community voting system to prioritize issues
- Multi-level location tagging (State, City, Town)

### 💬 **AI-Powered Chat Assistant**

- Real-time chat interface with AI integration
- AI SDK powered by Ollama models
- Natural language assistance for issue description and guidance
- Context-aware responses for civic problem-solving
- Web search integration using Tavily API for real-time information retrieval

### 📱 **Multi-Channel Alerts & Notifications**

- **WhatsApp Integration**: SOS alerts via WhatsApp API (WHAPI)
- **Telegram Bot**: Real-time notifications and issue updates
- **Email Notifications**: Automated alerts using SMTP with Nodemailer

### 👥 **User Management & Authentication**

- Email/password authentication with JWT tokens
- Google OAuth integration for seamless sign-up and login
- Session management with secure token storage
- User profile management

### 📊 **Advanced Issue Management**

- Kanban Board with drag-and-drop task management
- Issue dashboard with real-time metrics
- Customizable issue cards with status visualization

### 📄 **Report Generation & Export**

- PDF generation for issue reports and summaries
- Excel export functionality
- Custom report formatting with jsPDF
- Image capture and embedding in reports

### 🗺️ **Multi-Level Geographic Interface**

- State-level overview map with Leaflet
- City-level detailed navigation
- Town-level precise issue pinning with SVG map coordinates
- SVG-based coordinate system for town-level mapping
- India-specific geographic data with state and city hierarchies

### 🎨 **Modern User Interface**

- Next.js 16 with TypeScript for type-safe frontend
- Responsive design with Tailwind CSS
- Dark mode support
- Smooth animations with Framer Motion
- Mobile-friendly responsive layout

### 🌐 **Multilingual User Interface**

- Language selection component with multiple language support
- Google Translate API integration for dynamic language translation
- Real-time translation of issue descriptions and content
- Support for multiple locales and seamless language switching

### 📈 **Analytics & Metrics**

- Map metrics dashboard
- Issue statistics and analytics
- Visual data representation with Chart.js
- Community engagement metrics

### 🔐 **Security & Data Protection**

- Password encryption using bcryptjs
- JWT-based authentication
- CORS protection with domain whitelisting
- Secure session management
- Environment variable protection

---

## 🛠️ Tech Stack

### **Backend**

- **Runtime**: Node.js with ES modules
- **Framework**: Express.js 5
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT, bcryptjs
- **AI Models**: Ollama
- **Web Search**: Tavily API
- **Notifications**: WhatsApp API (WHAPI), Telegram Bot API, SMTP/Nodemailer
- **File Processing**: PDF, Excel, OCR (Tesseract.js)
- **Image Processing**: Sharp

### **Frontend**

- **Framework**: Next.js 16 (React 18)
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS
- **Maps**: Leaflet with React Leaflet for interactive mapping and SVG coordinate system
- **Animations**: Framer Motion
- **Authentication**: Firebase
- **HTTP Client**: Axios
- **Charts**: Chart.js with React Charts
- **PDF Generation**: jsPDF with autotable
- **Drag & Drop**: dnd-kit

---

## 📋 Core Modules

### **Backend Modules**

- **Controllers**: Auth, Issue, User, WhatsApp SOS management
- **Services**: AI, Email, Geocoding, PDF, Telegram Bot, WhatsApp Service
- **Middleware**: Authentication and authorization
- **Models**: User and Issue data models
- **Routes**: API endpoints for auth, users, issues, WhatsApp

### **Frontend Modules**

- **Pages**: Home, About, Login, Signup, Contact Us, Map View
- **Components**: Chat UI, Navigation, Language selector
- **Map Components**: Interactive maps, Kanban board, Issue cards
- **State Management**: Redux, Context API, Custom hooks

---

## 🎯 Use Cases

1. **Citizens** can report civic issues they encounter in their locality
2. **Community Members** can vote on issues to prioritize them
3. **Administrators** can track and manage issue resolution
4. **Emergency Responders** can receive SOS alerts via WhatsApp/Telegram
5. **Government Agencies** can access reports and analytics
6. **Volunteers** can coordinate resolution efforts

---

## 📱 Integration Capabilities

- **Google Ollama API** for local AI model support
- **Firebase** for authentication and storage
- **WHAPI (WhatsApp API)** for emergency SOS notifications
- **Telegram Bot API** for real-time alerts and updates
- **Google Translate API** for multilingual UI and dynamic content translation
- **Tavily** for real-time web search and information retrieval
- **SMTP/Nodemailer** for email notification delivery

---

## 🚀 Application Highlights

- **Scalable Architecture**: Designed for growing user base and data volume
- **Multi-Channel Notifications**: Enables instant alerts through WhatsApp, Telegram, and Email
- **Mobile Optimized**: Fully responsive design
- **Accessibility**: Built with modern accessibility standards
- **Performance**: Optimized for fast load times and smooth interactions

---

## 🔄 Workflow

1. User registers/logs in (email or Google OAuth)
2. Navigates to map view and selects location (State → City → Town)
3. Reports issue with details and category
4. System notifies relevant stakeholders via multiple channels
5. Issue gets tracked on Kanban board
6. Progress updates sent via WhatsApp/Telegram/Email
7. Issue marked as resolved
8. Analytics updated for community impact

---

**CivicSync** - Empowering citizens to build better communities! 🌍
