# EventLens 📸

**Live Demo:** [https://event-media-management-platform-zeta.vercel.app](https://event-media-management-platform-zeta.vercel.app)

A full-stack, real-time Event Media Management Platform built with Next.js. EventLens allows users to organize events, share media, and automatically tag people in photos using AWS Rekognition.

## ✨ Features

- **Event Galleries:** Create and manage decentralized events with private or public galleries.
- **AI Face Recognition:** Upload a selfie to your profile, and the platform uses AWS Rekognition to automatically find and tag you in all event photos.
- **Real-Time Social:** Live push notifications (powered by Pusher) for likes, comments, and `@mentions`.
- **Direct S3 Uploads:** Lightning-fast media uploads directly from the browser to AWS S3 using Presigned URLs.
- **QR Sharing:** Generate dynamic QR codes for instant event sharing.
- **Impact Analytics:** Track your profile's engagement with an integrated analytics dashboard.

## 🛠 Tech Stack

- **Framework:** Next.js (App Router)
- **Database:** PostgreSQL (via Neon)
- **ORM:** Prisma
- **Auth:** NextAuth.js
- **Styling:** Tailwind CSS + shadcn/ui
- **Cloud Storage:** AWS S3
- **AI / Computer Vision:** AWS Rekognition
- **Real-Time WebSockets:** Pusher

## 🏗 Architecture

EventLens uses a modern, decentralized Serverless Architecture:

```mermaid
sequenceDiagram
    participant User
    participant Client as Next.js Client
    participant Server as Next.js Server Actions
    participant S3 as AWS S3
    participant Rekognition as AWS Rekognition
    participant DB as PostgreSQL (Neon)
    participant Pusher as Pusher WebSockets

    User->>Client: Upload Photo
    Client->>Server: Request Presigned URL
    Server-->>Client: Return URL & Object Key
    Client->>S3: Direct PUT Image Data
    S3-->>Client: 200 OK
    Client->>Server: Action: createMedia()
    Server->>Rekognition: Analyze Image & Faces
    Rekognition-->>Server: FaceIDs & AI Labels
    Server->>DB: Save Record + AI Tags
    Server->>Pusher: Broadcast Notification
    Pusher-->>Client: Real-time UI Update
```

- **Client Layer (Next.js App Router):** Renders dynamic React Server Components and interactive Client Components. State is managed via React Hooks, with UI from shadcn/ui and Tailwind CSS.
- **Server Layer (Next.js Server Actions):** Handles secure data mutations, direct database queries, and server-side authentication (NextAuth).
- **Media Pipeline:** 
  1. Client requests an AWS S3 Presigned URL from the Server.
  2. Client uploads high-resolution media directly to the S3 Bucket (bypassing Vercel limits).
  3. Server invokes AWS Rekognition to analyze the image, detect faces, and apply AI tags.
- **Real-Time Pipeline:** When users Like, Comment, or Tag others, the Server Action records the interaction in PostgreSQL and triggers a WebSocket event via Pusher to instantly update connected clients.

## 🗄 Database Schema

The relational database is managed via Prisma ORM and hosted on Neon (Serverless PostgreSQL). 

**Core Entities:**
- **`User`**: Identity model. Has many Events, Media, Comments, Likes, and a `FaceEmbedding`.
- **`Event`**: Represents a gathering. Has visibility controls (`PUBLIC`, `PRIVATE`, `INVITE_ONLY`) and an Organizer.
- **`EventRole`**: Access control mapping Users to Events (`ADMIN`, `PHOTOGRAPHER`, `CLUB_MEMBER`, `VIEWER`).
- **`Media`**: Contains S3 Object Keys, metadata, and relationships to Events/Albums.
- **`MediaTag`**: AI-generated tags (including `PERSON_{userId}` for recognized faces) with confidence scores.
- **`FaceEmbedding`**: Links a User to an AWS Rekognition `FaceId` for automatic face detection.
- **`Notification`**: Stores unread real-time activity alerts.
- **Social Models (`Like`, `Comment`, `Favorite`)**: Maps User interactions to specific Media assets.

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A PostgreSQL database (Neon recommended)
- AWS Account (S3 and Rekognition)
- Pusher Account

### 1. Clone & Install
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory and add the following keys:

```env
# Database
DATABASE_URL="postgresql://user:password@host/db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# AWS (S3 & Rekognition)
MY_AWS_ACCESS_KEY_ID="your-aws-access-key"
MY_AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="ap-south-1"
AWS_S3_BUCKET="your-bucket-name"
AWS_REKOGNITION_COLLECTION_ID="your-collection-id"

# Pusher
PUSHER_APP_ID="your-app-id"
PUSHER_KEY="your-key"
PUSHER_SECRET="your-secret"
PUSHER_CLUSTER="your-cluster"
NEXT_PUBLIC_PUSHER_KEY="your-key"
NEXT_PUBLIC_PUSHER_CLUSTER="your-cluster"
```

*(Note: We use `MY_AWS_ACCESS_KEY_ID` instead of `AWS_ACCESS_KEY_ID` to prevent Vercel from overriding AWS credentials in production).*

### 3. Database Setup
Initialize Prisma and push the schema to your database:
```bash
npx prisma generate
npx prisma db push
```

### 4. AWS Setup
1. **S3 CORS**: Ensure your S3 bucket has a CORS policy allowing `PUT` requests from `http://localhost:3000` (and your production domain).
2. **Rekognition**: Create a Rekognition Collection using the AWS CLI matching your `AWS_REKOGNITION_COLLECTION_ID`.
   ```bash
   aws rekognition create-collection --collection-id your-collection-id --region ap-south-1
   ```

### 5. Run Development Server
```bash
npm run dev
```
Visit `http://localhost:3000` to view the app!

## ☁️ Deployment (Vercel)
1. Import the project into Vercel.
2. Add all environment variables from `.env` into the Vercel dashboard.
3. The `package.json` includes `"postinstall": "prisma generate"` to automatically build the Prisma client.
4. Deploy! Ensure your Vercel domain is added to your S3 bucket's CORS policy.

## 📄 License
MIT License
