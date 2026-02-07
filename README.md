<p align="center">
  <img src="https://github.com/user-attachments/assets/55c67f4b-cf72-4b6b-84b0-2fa88cce09b0" 
       alt="Spnd App Icon" 
       width="180" />
</p>
# 💰 Spnd - Smart Budget Tracking App
> A full-stack budget tracking application with React Native mobile app and Node.js backend, featuring automated CI/CD deployment to AWS EC2.
  
📱 **Mobile App**: Available for iOS & Android  
🐳 **Docker Hub**: [rowydaramdan/spnd](https://hub.docker.com/r/rowydaramdan/spnd)

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT-based authentication
- Google OAuth integration
- Secure password hashing with bcrypt
- Session management

### 💸 Expense & Income Tracking
- Add, edit, and delete expenses
- Track income sources
- Categorize transactions
- View transaction history

### 👥 Shared Budgets
- Create shared budgets with family/friends
- Collaborative expense tracking
- Real-time updates

### 📊 Analytics & Insights
- Monthly spending overview
- Category-wise breakdown
- Budget vs actual comparison

### 📱 Cross-Platform Mobile App
- React Native for iOS & Android
- Offline support
- Push notifications
- Smooth animations

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│     React Native Mobile App             │
│     (iOS & Android)                     │
└──────────────┬──────────────────────────┘
               │ REST API
               ↓
┌─────────────────────────────────────────┐
│     Node.js Backend (Express)           │
│     Deployed on AWS EC2                 │
│     - JWT Authentication                │
│     - RESTful API                       │
│     - Input Validation                  │
└──────────────┬──────────────────────────┘
               │ MongoDB Driver
               ↓
┌─────────────────────────────────────────┐
│     MongoDB Atlas                       │
│     - User Data                         │
│     - Transactions                      │
│     - Shared Budgets                    │
└─────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 18.x
- **Framework**: Express.js
- **Database**: MongoDB (Atlas)
- **Authentication**: JWT, Passport.js
- **Validation**: Express Validator
- **Security**: Helmet, bcrypt

### Frontend (Mobile)
- **Framework**: React Native
- **Navigation**: React Navigation
- **State Management**: Context API / Redux
- **HTTP Client**: Axios
- **UI Components**: Custom + React Native Paper

### DevOps & Infrastructure
- **Cloud**: AWS EC2 (t2.micro)
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions
- **Registry**: Docker Hub
- **Monitoring**: CloudWatch (planned)

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18.x or higher
- Docker & Docker Compose
- MongoDB (local or Atlas)
- AWS Account (for deployment)

### Local Development

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/spnd.git
cd spnd

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run with Docker Compose
docker-compose up -d

# Or run locally
npm run dev

# Backend will be available at http://localhost:3003
```

### Environment Variables

```env
# Server
NODE_ENV=development
PORT=3003

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/spnd

# Authentication
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRE=7d

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

---

## 🐳 Docker Deployment

### Using Docker Compose (Recommended)

```bash
# Pull and start
docker-compose pull
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop
docker-compose down
```

### Using Docker directly

```bash
# Build image
docker build -t spnd:latest .

# Run container
docker run -d \
  -p 3003:3003 \
  -e MONGO_URI="your-mongo-uri" \
  -e JWT_SECRET="your-secret" \
  --name spnd \
  spnd:latest
```

---

## ☁️ AWS Deployment

### Automated Deployment (CI/CD)

The app automatically deploys to AWS EC2 on every push to `master` branch.

**Deployment Pipeline:**
1. ✅ Lint code quality
2. ✅ Run integration tests
3. ✅ Build Docker image
4. ✅ Push to Docker Hub
5. ✅ Deploy to EC2
6. ✅ Health check verification

### Manual Deployment

```bash
# SSH to EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Navigate to app directory
cd ~/spnd

# Pull latest image
docker-compose pull

# Restart containers
docker-compose up -d

# Verify deployment
curl http://localhost:3003/health
```

---

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run integration tests
npm run test:integration

# Run with coverage
npm run test:coverage

# Watch mode (development)
npm run test:watch
```

### Test Coverage

- Integration tests with real MongoDB
- API endpoint testing
- Authentication flow testing
- Database operation testing

**Current Coverage**: ~80% (lines)

---

## 📱 Mobile App Setup

### Prerequisites

- Node.js 18.x
- Expo CLI
- iOS Simulator (Mac) or Android Studio

### Installation

```bash
# Navigate to mobile directory
cd mobile

# Install dependencies
npm install

# Start Expo development server
npx expo start

# Run on iOS
npx expo start --ios

# Run on Android
npx expo start --android
```

### Configuration

Update API endpoint in mobile app:

```javascript
// mobile/config/api.js
export const API_BASE_URL = 'http://YOUR-EC2-IP:3003';
```

---

## 🔒 Security

### Implemented Security Measures

- ✅ JWT token-based authentication
- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ Environment variable protection
- ✅ Non-root Docker user
- ✅ MongoDB authentication

### Security Best Practices

- Secrets stored in environment variables
- No sensitive data in Git repository
- Regular dependency updates
- AWS Security Groups configured
- HTTPS planned (Let's Encrypt)

---

## 📊 API Documentation

### Authentication Endpoints

```bash
POST /register
# Register new user
# Body: { email, username, password }

POST /login/jwt
# Login with credentials
# Body: { email, password }
# Returns: { token, user }

POST /login/google/mobile
# Google OAuth login
# Body: { idToken }

GET /me
# Get current user profile
# Headers: { Authorization: "Bearer <token>" }
```

### Expense Endpoints

```bash
GET /expenses
# Get user's expenses
# Headers: { Authorization: "Bearer <token>" }

POST /expenses
# Create new expense
# Body: { amount, category, description, date }
```

### Income Endpoints

```bash
GET /income
# Get user's income

POST /income
# Add income source

```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

**Triggers**: Push to `master` or Pull Request

**Jobs**:
1. **Lint** - ESLint code quality check
2. **Test** - Integration tests with MongoDB
3. **Build** - Docker image build & push to Docker Hub
4. **Deploy** - Automated deployment to AWS EC2
5. **Verify** - Health check and smoke tests

### Deployment Flow

```
Developer pushes code
    ↓
GitHub Actions triggered
    ↓
Tests run (2-3 min)
    ↓
Docker image built (2-3 min)
    ↓
Image pushed to Docker Hub
    ↓
SSH to EC2 & deploy (30 sec)
    ↓
Health check verification
    ↓
✅ Deployment complete! (Total: ~5-7 min)
```

### Required GitHub Secrets

```
DOCKER_USERNAME     # Docker Hub username
DOCKER_PASSWORD     # Docker Hub token
EC2_HOST           # EC2 public IP
EC2_SSH_KEY        # Private SSH key (.pem file)
```

---

## 📈 Monitoring & Logging

### Current Setup

```bash
# View application logs
docker-compose logs -f backend

# Check container status
docker ps

# Monitor resource usage
docker stats
```

### Planned Improvements

- [ ] CloudWatch integration
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring (New Relic)
- [ ] Automated alerting
- [ ] Log aggregation

---

## 🚦 Project Status

### ✅ Completed Features

- [x] User authentication (JWT & OAuth)
- [x] Expense tracking
- [x] Income tracking
- [x] Shared budgets
- [x] Mobile app (React Native)
- [x] Docker containerization
- [x] AWS EC2 deployment
- [x] CI/CD pipeline
- [x] Integration tests
- [x] MongoDB Atlas integration

### 🔨 In Progress

- [ ] HTTPS/SSL certificate
- [ ] Advanced analytics dashboard
- [ ] Export to CSV/PDF
- [ ] Budget notifications
- [ ] Multi-currency support

### 🎯 Planned Features

- [ ] Receipt scanning (OCR)
- [ ] Recurring transactions
- [ ] Budget recommendations (ML)
- [ ] Dark mode
- [ ] Widget support
- [ ] Biometric authentication

---

## 📝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow ESLint configuration
- Write tests for new features
- Update documentation
- Keep commits atomic and descriptive

---

## 🐛 Known Issues

- [ ] OAuth redirect not working in mobile app (Expo limitation)
- [ ] Database connection timeout on cold starts (~5 sec)
- [ ] iOS HTTP requests require NSAllowsArbitraryLoads (no HTTPS yet)

---

## 🙏 Acknowledgments

- [Express.js](https://expressjs.com/) - Backend framework
- [React Native](https://reactnative.dev/) - Mobile framework
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - Database
- [AWS](https://aws.amazon.com/) - Cloud infrastructure
- [Docker](https://www.docker.com/) - Containerization
---

## 📞 Support

If you have any questions or need help, please:

- Open an [issue](https://github.com/rowyda020/spnd/issues)
- Email: rowydaramadan@gmail.com
---

## ⭐ Show Your Support

If you found this project helpful, please give it a ⭐️!

---

<div align="center">
  Made with ❤️ by Rowyda Ramadan
  
  [Report Bug](https://github.com/rowyda020/spnd/issues) · 
  [Request Feature](https://github.com/rowyda020/spnd/issues) · 
</div>
