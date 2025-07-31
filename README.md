# ![IC_Website](https://i.ibb.co/hFNnN9s3/ic-website-banner.png)

# 🔌 IC Website - Integrated Circuits Marketplace

## 🌟 Overview
IC Website is a comprehensive full-stack web application for browsing, searching, and managing **Integrated Circuits (ICs)** from various manufacturers. The platform features **role-based dashboards** for admins and users, complete **CRUD operations**, and an intuitive product catalog system with advanced search capabilities.

🔗 **Live Project**: [IC Website Live Demo](#) <!-- Add your live URL here -->

---

## 📌 Table of Contents
- [🌟 Overview](#-overview)
- [🛠️ Technologies Used](#️-technologies-used)
- [✨ Features](#-features)
- [📦 Dependencies](#-dependencies)
- [🚀 Getting Started](#-getting-started)
- [📱 Screenshots](#-screenshots)
- [🔗 Live Project & Resources](#-live-project--resources)

---

## 🛠️ Technologies Used
The project is built using modern technologies for optimal performance and scalability:

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API Routes, MongoDB, Mongoose
- **Authentication**: NextAuth.js (Google OAuth)
- **State Management**: React Hooks, Context API
- **UI Components**: Lucide React Icons, Custom Components
- **Search**: Real-time product search with debouncing
- **Development Tools**: ESLint, PostCSS, JavaScript ES6+

---

## ✨ Features

### 🏠 **User Experience**
✔️ **Product Catalog**: Browse integrated circuits by categories, brands, and manufacturers  
✔️ **Advanced Search**: Real-time search with auto-suggestions and filters  
✔️ **Product Details**: Comprehensive product specifications, datasheets, and images  
✔️ **Brand Showcase**: Dedicated brand pages with complete product listings  
✔️ **Category Navigation**: Organized product categories with subcategories  
✔️ **Responsive Design**: Optimized for desktop, tablet, and mobile devices  

### 🔐 **Authentication & Security**
✔️ **NextAuth Integration**: Secure Google OAuth authentication  
✔️ **Role-Based Access**: Admin and user role management  
✔️ **Protected Routes**: Secure admin dashboard access  
✔️ **Session Management**: Persistent login sessions  

### 🛠️ **Admin Dashboard**
✔️ **Product Management**: Create, read, update, and delete products  
✔️ **Brand Management**: Add and manage IC manufacturers and brands  
✔️ **Category Management**: Organize products into categories and subcategories  
✔️ **Blog Management**: Create and manage blog posts and articles  
✔️ **Inventory Control**: Track product availability and specifications  

### 🔍 **Search & Navigation**
✔️ **Intelligent Search**: Multi-field search across products, brands, and categories  
✔️ **Navbar Search**: Quick search directly from the navigation bar  
✔️ **Search Results Page**: Advanced filtering and sorting options  
✔️ **Keyboard Navigation**: Full accessibility support with arrow keys  

---

## 📦 Dependencies
Here are the main dependencies used in the project:

### **Core Dependencies**
```json
{
  "next": "^14.0.0",
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "next-auth": "^4.24.0",
  "mongoose": "^8.0.0",
  "tailwindcss": "^3.3.0",
  "lucide-react": "^0.263.1",
  "react-icons": "^4.11.0"
}
```

### **Development Dependencies**
```json
{
  "eslint": "^8.50.0",
  "eslint-config-next": "^14.0.0",
  "postcss": "^8.4.31",
  "autoprefixer": "^10.4.16"
}
```

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v18 or higher)
- MongoDB database
- Google OAuth credentials (for authentication)

### **Installation**
```bash
# Clone the repository
git clone https://github.com/zohir26/IC.git
cd ic-website

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your MongoDB URI, NextAuth secret, and Google OAuth credentials

# Run the development server
npm run dev
```

### **Environment Variables**
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### **Database Setup**
```bash
# The application will automatically connect to MongoDB
# Make sure your MongoDB instance is running
# Sample data can be imported using the provided scripts
```

---

## 📱 Screenshots

### **Homepage & Product Catalog**
- Clean, modern interface showcasing IC products
- Responsive brand carousel and category navigation
- Featured products and manufacturer highlights

### **Search Functionality**
- Real-time search with instant results
- Advanced filtering by category, brand, and specifications
- Keyboard-accessible dropdown suggestions

### **Admin Dashboard**
- Comprehensive CRUD operations for all entities
- Intuitive forms for product and brand management
- Real-time data updates and validation

### **Product Details**
- Detailed specifications and technical information
- High-quality product images and datasheets
- Related products and alternative suggestions

---

## 🔗 Live Project & Resources

- **Live Demo**: [IC Website Live](#) <!-- Add your live URL -->
- **GitHub Repository**: [GitHub Repo](#) <!-- Add your GitHub URL -->
- **API Documentation**: Available in `/docs` folder
- **Design System**: Built with Tailwind CSS components

---

## 📧 Contact & Support

For questions, suggestions, or support:
- **Email**: mdzohirhossain500@gmail.com
---

## 🙏 Acknowledgments

- Thanks to all IC manufacturers for providing product specifications
- Built with modern web technologies and best practices
- Inspired by the need for a comprehensive IC marketplace solution

---

*Made with ❤️ for the electronics community* 