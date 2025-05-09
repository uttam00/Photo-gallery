# 🎨 Creative Portfolio Site

Welcome to my digital canvas! This portfolio site is where art meets technology, creating a beautiful showcase for creative works. ✨

## 🌟 Features

### 🖼️ Gallery Management

- **Dynamic Image Gallery**: A beautiful grid layout showcasing your creative works
- **Smart Pagination**: Navigate through your works with ease
- **Category Organization**: Sort and filter works by categories
- **Responsive Design**: Looks stunning on all devices

### 👨‍💼 Admin Dashboard

- **Secure Authentication**: Protected admin area for managing content
- **Work Upload System**: Easy-to-use interface for adding new works
- **Image Management**: Upload, delete, and organize your works
- **Admin Details**: Manage your professional information

### 📱 Contact System

- **Interactive Contact Form**: Let visitors reach out to you
- **Form Validation**: Smart validation for all input fields
- **Success/Error Notifications**: Beautiful toast notifications for feedback
- **Responsive Design**: Works perfectly on all devices

### 🎯 Technical Features

- **Modern Stack**: Built with Next.js 14 and React
- **Type Safety**: Full TypeScript implementation
- **Beautiful UI**: Using shadcn/ui components
- **Animations**: Smooth transitions with Framer Motion
- **Responsive Design**: Mobile-first approach
- **SEO Optimized**: Better visibility in search engines

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/uttam00/Photo-gallery.git
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## 🔐 Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

    ```env
    # MongoDB Configuration
    MONGODB_URI="your_mongodb_connection_string"
    MONGODB_DB="your_database_name"

    # Cloudinary Configuration
    CLOUDINARY_CLOUD_NAME="your_cloud_name"
    CLOUDINARY_API_KEY="your_api_key"
    CLOUDINARY_API_SECRET="your_api_secret"

    # Email Configuration
    SENDGRID_API_KEY="your_sendgrid_api_key"
    FROM_EMAIL="your_email_address"
    ```

> ⚠️ **Note**: Never commit your `.env` file to version control. Make sure it's listed in your `.gitignore` file.

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **Form Handling**: React Hook Form
- **API Routes**: Next.js API Routes
- **Database**: MongoDB
- **Image Storage**: Cloudinary

## 📦 Project Structure

```
portfolio-site/
├── app/                 # Next.js app directory
│   ├── admin/          # Admin dashboard pages
│   ├── api/            # API routes
│   └── contact/        # Contact page
├── components/         # React components
│   ├── ui/            # UI components
│   └── forms/         # Form components
├── lib/               # Utility functions
└── public/            # Static assets
```

## 🎨 UI Components

- **FormInput**: Reusable form input component
- **GalleryTable**: Dynamic gallery management
- **AdminDetailsForm**: Admin information management
- **WorkUploadForm**: Work upload interface
- **Toast Notifications**: Beautiful feedback system

## 🔒 Security Features

- **Protected Routes**: Secure admin area
- **Form Validation**: Client and server-side validation
- **API Security**: Protected API endpoints
- **Environment Variables**: Secure configuration

## 🎯 Future Enhancements

- [ ] 🔍 Advanced search functionality
- [ ] 📊 Analytics dashboard
- [ ] 🌐 Multi-language support
- [ ] 📱 Progressive Web App features
- [ ] 🎨 Custom theme support

## 🤝 Contributing

Contributions are welcome! Feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Framer Motion](https://www.framer.com/motion/) for animations

---

Made with ❤️ and ☕ by Uttam Danidhariya

---
