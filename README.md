# CivilPro Engineering App

A specialized management system designed for civil engineering projects, allowing for discipline-specific tracking, secure reporting, and centralized document management.

## 🚀 Features

- **Discipline Tracking:** Dedicated sections for Construction, Civil Engineering, Architecture, and Project Management.
- **Interactive Dashboard:** Data visualization for project distribution across different engineering categories.
- **Secure Authentication:** Full user lifecycle management (Sign In, Register, Password Reset) powered by Supabase.
- **Cloud Media Storage:** Integrated image and resource uploads via Cloudinary.
- **Project Documentation:** Centralized repository for engineering documents and site reports.
- **Responsive Design:** Modern, dark-themed UI built with Tailwind CSS 4.

## 🛠️ Tech Stack

- **Frontend:** [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Backend/Auth:** [Supabase](https://supabase.com/)
- **Media:** [Cloudinary](https://cloudinary.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)

## ⚙️ Local Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_public_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_unsigned_preset
```

### 3. Start Development
```bash
npm run dev
```

## 🚢 Deployment (Netlify)

1.  **Build:** Run `npm run build` to generate the `dist` folder.
2.  **Continuous Deployment:** Connect your GitHub repository to Netlify.
3.  **Site Configuration:**
    - **Build Command:** `npm run build`
    - **Publish Directory:** `dist`
4.  **Environment Variables:** Add your `VITE_` keys in the Netlify dashboard under **Site settings > Environment variables**.
5.  **SPA Routing:** To support React Router, add a `_redirects` file to your `public` folder:
    ```text
    /* /index.html 200
    ```

## 📝 License

Private Project - All Rights Reserved.
