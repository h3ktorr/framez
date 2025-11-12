# 📸 Framez

**Framez** is a social media app built with **Expo**, **React Native**, and **Supabase** — designed for sharing photos, captions, and connecting with others.  
Users can upload images, view their feed in real-time, manage their profile, and log in securely using Supabase authentication.

---

## 🚀 Features

- 🧑‍🤝‍🧑 **User Authentication** – Sign up, log in, and manage sessions via Supabase Auth
- 🖼️ **Photo Feed** – Browse posts from all users with live updates (real-time subscription)
- 📷 **Image Uploads** – Upload photos from device gallery and store securely in Supabase Storage
- 👤 **Profile Management** – Update your avatar, view your posts, and log out
- 🕒 **Timestamps** – Posts display when they were created

---

## 🧩 Tech Stack

| Layer              | Technology                           |
| ------------------ | ------------------------------------ |
| **Frontend**       | Expo (React Native)                  |
| **Backend**        | Supabase (Postgres + Auth + Storage) |
| **Realtime**       | Supabase Realtime Channels           |
| **Navigation**     | Expo Router                          |
| **Media Handling** | Expo Image Picker                    |
| **Builds**         | EAS Build                            |
| **Hosting (demo)** | Appetize.io                          |

---

## 📁 Folder Structure

framez/
├── app/
│ ├── (auth)/login.tsx
│ ├── (tabs)/
│ │ ├── index.tsx
│ │ ├── profile.tsx
│ │ └── upload.tsx
│ └── index.tsx
├── assets/
│ ├── images/
│ │ ├── icon.png
├── supabase/
│ └── config.ts
├── context/
│ └── SupabaseProvider.tsx
├── eas.json
├── app.json
└── README.md

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the repository

```bash
git clone https://github.com/<your-username>/framez.git
cd framez

2️⃣ Install dependencies

npm install

3️⃣ Create a .env file

Add your Supabase credentials:

EXPO_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

4️⃣ Run locally

npx expo start

    You can open it on your phone with the Expo Go app or run it in an Android/iOS emulator.

📦 Building the App (APK)

To generate an Android APK:

eas build -p android --profile preview

or to build for production:

eas build -p android --profile production

The resulting .apk will be available in your Expo Dashboard

.
🌐 Hosting the Demo on Appetize.io

    Upload your .apk build to Appetize.io

    Copy the generated link

    Share or embed it anywhere — Appetize will simulate your app in-browser

🧠 Environment Variables
Variable	Description
EXPO_PUBLIC_SUPABASE_URL	Supabase project URL
EXPO_PUBLIC_SUPABASE_ANON_KEY	Supabase public anon key
📲 Screens
Screen	Description
Feed	Displays latest posts with images and captions
Profile	Shows user info and personal uploads
Upload	Allows posting a new photo with caption
Login	User authentication screen
🧑‍💻 Author

Kelvin (h3ktorrr)
Frontend Developer | Mobile + Web
Expo.dev Profile
🪪 License

MIT License © 2025 Kelvin (h3ktorrr)
```
