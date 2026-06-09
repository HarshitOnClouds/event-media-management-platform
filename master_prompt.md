You are a senior full-stack engineer. Build a complete, production-ready Event & Media Management Platform for a hackathon/project submission.

The goal is to create a visually stunning, AI-powered media platform for college clubs and event organizers.

IMPORTANT:
Prioritize:
1. UI/UX quality
2. Demo readiness
3. Smooth user experience
4. AI-powered features
5. Working deployment
6. Fast implementation speed

Do NOT overengineer infrastructure.

Use simplified implementations where needed if the UX and functionality remain impressive.

==================================================
TECH STACK (MANDATORY)
==================================================

Frontend + Backend:
- Next.js 16 (App Router)
- JavaScript
- Route Handlers only
- Server Actions where appropriate
- No separate backend server
- No microservices

UI:
- Tailwind CSS
- shadcn/ui
- Framer Motion
- Lucide Icons

Database:
- PostgreSQL
- Prisma ORM

Authentication:
- NextAuth v5
- JWT sessions
- Google OAuth + Credentials login

Storage:
- AWS S3

AI:
- AWS Rekognition only
- OpenAI API for captions/tags if needed

Realtime:
- Pusher only

Image Processing:
- Sharp

Deployment:
- Vercel

The final project must deploy successfully on Vercel with only:
- PostgreSQL
- AWS S3
- AWS Rekognition

No additional infrastructure.

==================================================
ARCHITECTURE
==================================================

Architecture:
- Fullstack Next.js 16 application
- App Router only
- Route Handlers only
- Prisma ORM
- AWS S3 storage
- AWS Rekognition AI
- Pusher realtime notifications

Keep architecture simple, scalable, and hackathon-friendly.

==================================================
DESIGN AESTHETIC
==================================================

The app should feel like:
- Instagram + Notion + professional photography portfolio

Theme:
- Dark premium aesthetic
- Cinematic visuals
- Minimal UI
- Editorial layouts

Colors:
- Background: #0A0A0A
- Surface: #141414
- Primary text: #F5F5F5
- Secondary text: #8B8B8B
- Accent: #E8FF00

Typography:
- Inter
- Space Grotesk

Use:
- glassmorphism overlays
- hover animations
- staggered animations
- skeleton loaders
- image blur placeholders
- smooth transitions
- subtle motion effects
- modern card layouts

NO WHITE BACKGROUNDS ANYWHERE.

==================================================
LANDING PAGE
==================================================

Landing page sections:
1. Hero section with animated media collage
2. Trusted clubs banner
3. AI-powered features showcase
4. Masonry event gallery preview
5. Feature cards
6. Stats section
7. Testimonials
8. CTA section
9. Footer

Hero section should feel premium and modern.

==================================================
CORE FEATURES
==================================================

1. AUTHENTICATION
--------------------------------

Implement:
- Login
- Signup
- Google OAuth
- Protected routes
- Session persistence

Roles:
- Admin
- Photographer
- Club Member
- Viewer

==================================================
2. EVENT MANAGEMENT
==================================================

Features:
- Create event
- Edit event
- Delete event
- Event cover image
- Event metadata
- Event albums

Fields:
- title
- description
- category
- tags
- visibility
- date
- organizers
- location

Event page:
- Hero banner
- Stats
- Media gallery
- Comments
- Participants
- AI highlights

Sorting:
- Date
- Category
- Trending
- Most viewed

==================================================
3. MEDIA MANAGEMENT
==================================================

Implement:
- Bulk upload
- Drag-and-drop uploads
- Upload progress
- Preview before upload
- Infinite scroll gallery
- Masonry layout
- Compression before upload
- Lazy loading
- Image + video uploads

Gallery modes:
- Grid
- Masonry
- Cinematic

Metadata:
- uploader
- event
- upload date
- AI tags
- detected people

==================================================
4. SOCIAL FEATURES
==================================================

Implement:
- Likes
- Comments
- Replies
- Share
- Download
- Favorites
- Tag friends
- Follow photographers

Realtime notifications:
- likes
- comments
- tags
- upload completion

==================================================
5. AI FEATURES
==================================================

A. SMART TAGGING
----------------
Automatically generate image tags using AWS Rekognition.

Detect:
- crowd
- sports
- mountains
- beach
- stage
- concert
- dance
- portrait
- group photo
etc.

Store tags in database.

B. NATURAL LANGUAGE SEARCH
--------------------------
Examples:
- "photos from robotics fest"
- "group photos"
- "pictures with mountains"
- "photos uploaded by Rahul"

Implement semantic-like search using:
- Prisma
- tags
- event names
- captions
- uploader names

C. FACE RECOGNITION
-------------------
Use AWS Rekognition Collections ONLY.

Flow:
1. User uploads selfie
2. Generate face embedding
3. Match against uploaded event photos
4. Show "Your Photos" section

D. AI GENERATED CAPTIONS
------------------------
Generate captions for uploaded images.

E. DUPLICATE IMAGE DETECTION
----------------------------
Use image hashing to detect duplicates before upload.

==================================================
6. ACCESS CONTROL
==================================================

Support:
- Public albums
- Private albums
- Invite-only albums

Permissions:
- View
- Upload
- Download
- Moderate

==================================================
7. WATERMARKING
==================================================

On image download:
- Apply dynamic watermark using Sharp

Include:
- Club name
- Event name
- Username

==================================================
8. CLOUD STORAGE
==================================================

Use AWS S3:
- Store all uploads
- Signed URLs
- Folder structure:
  /events/event-id/images
  /events/event-id/videos

Implement:
- thumbnail generation
- optimized delivery
- secure uploads

==================================================
9. BONUS FEATURES
==================================================

If time permits:
- Stories/highlights
- QR sharing
- Analytics dashboard
- Trending photos
- AI event recap
- PWA support
- Offline caching

==================================================
DATABASE SCHEMA
==================================================

Create Prisma schema for:
- User
- Event
- Album
- Media
- Comment
- Like
- Notification
- Favorite
- MediaTag
- FaceEmbedding

Include:
- relations
- indexes
- enums
- optimized querying

==================================================
FOLDER STRUCTURE
==================================================

src/
  app/
  components/
  features/
  lib/
  hooks/
  actions/
  prisma/
  services/
  store/
  types/
  utils/

==================================================
API REQUIREMENTS
==================================================

Create APIs for:
- auth
- events
- uploads
- comments
- likes
- notifications
- AI tagging
- face matching
- search
- downloads

Use:
- Zod validation
- pagination
- rate limiting
- typed responses
- proper error handling

==================================================
PERFORMANCE REQUIREMENTS
==================================================

Optimize:
- image loading
- DB queries
- caching
- infinite scrolling
- SSR rendering
- lazy loading

Use:
- Suspense
- Streaming
- Dynamic imports
- next/image

==================================================
ADMIN DASHBOARD
==================================================

Admin dashboard should include:
- User management
- Role assignment
- Event management
- Delete moderation
- Analytics
- Storage stats
- Total uploads
- Most active users

==================================================
SEEDED DEMO DATA
==================================================

Generate realistic seeded demo data:
- 5 users
- 8 events
- 100+ media items
- likes
- comments
- favorites
- AI tags

The app should feel fully populated for judging/demo purposes.

==================================================
IMPORTANT IMPLEMENTATION PRIORITY
==================================================

PHASE 1:
- Authentication
- Layout
- Event CRUD
- Upload system
- Gallery UI
- AWS S3 integration

PHASE 2:
- Likes/comments
- Notifications
- AI tagging
- Search
- Face recognition

PHASE 3:
- Watermarking
- Analytics
- Bonus features
- Final polish

==================================================
CODE QUALITY RULES
==================================================

- Use TypeScript everywhere
- Use reusable components
- Avoid duplicate code
- Use server components by default
- Add loading states
- Add error boundaries
- Fully responsive design
- Mobile-first approach
- Use optimistic updates where possible

==================================================
DELIVERABLES
==================================================

Generate:
1. Complete project code
2. README
3. Prisma schema
4. Seed script
5. API documentation
6. Architecture documentation
7. Docker setup
8. Environment variable template
9. Deployment guide

==================================================
ENV VARIABLES
==================================================

DATABASE_URL=

NEXTAUTH_SECRET=
NEXTAUTH_URL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET=
AWS_REKOGNITION_COLLECTION_ID=

PUSHER_APP_ID=
PUSHER_KEY=
PUSHER_SECRET=
PUSHER_CLUSTER=

NEXT_PUBLIC_PUSHER_KEY=
NEXT_PUBLIC_PUSHER_CLUSTER=

OPENAI_API_KEY=

==================================================
FINAL REQUIREMENTS
==================================================

- Generate complete production-ready code
- No TODO placeholders
- No pseudo code
- Connect all pages and flows
- Ensure app runs immediately
- Include installation commands
- Ensure deployment works on Vercel
- Prioritize polished UI over enterprise complexity
- Make the app feel premium and modern

Start with:
1. Architecture setup
2. Prisma schema
3. Next.js 16 initialization
4. Authentication
5. Upload/media pipeline
6. Then complete remaining modules incrementally