# Mobile Engineering Portfolio & Admin CMS

A high-performance, responsive portfolio web application and Content Management System (CMS) designed for Mobile Engineers. Inspired by the Google Stitch **Indigo Precision** design system and engineered with **Next.js 16**, **React 19**, **Tailwind CSS v4**, and **Prisma ORM**.

---

## 🌟 Key Features

- **Public Showcase**:
  - **Home**: Hero intro, Live Metrics, Technical Stack matrix, Featured Case Studies, Work Experience, Education background, and Contact CTA.
  - **Projects Showcase (`/projects`)**: Interactive platform filtering (`iOS Native`, `Android Native`, `Cross-Platform`).
  - **Project Case Studies (`/projects/[slug]`)**: Detailed architectural breakdown, 🔴 **The Challenge**, 🟢 **The Solution**, screenshot gallery, and App Store / Play Store / GitHub links.
  - **Skills & Experience (`/skills`)**: Tech stack chips with years of experience tags, career timeline, and academic degree achievements.
  - **Contact Page (`/contact`)**: Interactive contact form submitting directly to the database.

- **Admin Dashboard (`/admin`)**:
  - **Passcode Authentication (`/admin/login`)**: Secure `httpOnly` cookie authentication protecting all administrative routes.
  - **Full CMS Management**: Manage Developer Profile, Projects, Tech Skills, Career Experience, Education records, and Contact Form Inbox messages in real-time.

---

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router + Turbopack) & React 19
- **Database & ORM**: Prisma ORM (v6) with SQLite (Dev) & MySQL / PostgreSQL (Prod)
- **Styling**: Tailwind CSS v4 with custom Indigo Precision tokens
- **Typography**: Google Fonts (`Geist`, `Inter`, `JetBrains Mono`)
- **Runtime**: Bun
- **Process Manager**: PM2
- **Reverse Proxy**: Nginx + Let's Encrypt SSL (Certbot)

---

## 🛠️ Local Development Setup

### 1. Prerequisites
- Bun 1.x or higher

### 2. Installation
```bash
# Clone repository
git clone <repository-url>
cd new-sendiko

# Install dependencies
bun install
```

### 3. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Inside `.env`:
```env
# MySQL Database
DATABASE_URL="mysql://user:password@host:3306/new_sendiko"
MYSQL_DATABASE="new_sendiko"
MYSQL_USER="sendiko"
MYSQL_PASSWORD="your-mysql-password"
MYSQL_PASSWORD_URLENCODED="your-url-encoded-mysql-password"
MYSQL_ROOT_PASSWORD="your-root-password"

# Admin Console Passcode
ADMIN_PASSWORD="admin123"
APP_PORT="3000"
```

### 4. Database Setup & Seeding
```bash
# Synchronize database schema
bunx --bun prisma db push

# Seed initial portfolio data
bun run db:seed
```

### 5. Run Local Server
```bash
bun run dev
```
Open [http://localhost:3000](http://localhost:3000). To access the admin panel, visit [http://localhost:3000/admin](http://localhost:3000/admin) (Default Passcode: `admin123`).

---

## 🐳 Docker Compose Setup

Docker Compose starts a MySQL 8 container and the Next.js application. The app connects to MySQL through the internal `mysql` hostname, while uploaded files use the hosted MinIO instance configured in `.env`:

```bash
cp .env.example .env
docker compose up --build -d
```

Set `MYSQL_PASSWORD`, `MYSQL_PASSWORD_URLENCODED`, `MYSQL_ROOT_PASSWORD`, `MINIO_ENDPOINT`, `MINIO_PORT`, `MINIO_USE_SSL`, `MINIO_ACCESS_KEY`, and `MINIO_SECRET_KEY` in `.env`. The application is available at [http://localhost:3000](http://localhost:3000), or the host port configured by `APP_PORT`.

The MySQL schema is synchronized automatically when the app starts. Seed the sample portfolio data once:

```bash
docker compose exec app bun run db:seed
```

Stop the services without removing persistent data:

```bash
docker compose down
```

To remove the MySQL data as well, use `docker compose down -v`. This does not delete anything from hosted MinIO.

---

## 🐳 Docker Compose Setup

Docker Compose runs the Next.js application against the MySQL database and hosted MinIO instance configured in `.env`:

```bash
cp .env.example .env
docker compose up --build -d
```

Set `DATABASE_URL`, `MINIO_ENDPOINT`, `MINIO_PORT`, `MINIO_USE_SSL`, `MINIO_ACCESS_KEY`, and `MINIO_SECRET_KEY` in `.env` to match your infrastructure. The application is available at [http://localhost:3000](http://localhost:3000), or the host port configured by `APP_PORT`. Uploaded files remain in your hosted MinIO instance.

The MySQL schema is synchronized automatically when the app starts. Seed the sample portfolio data once:

```bash
docker compose exec app bun run db:seed
```

Stop the services without removing persistent data:

```bash
docker compose down
```

To remove the local database as well, use `docker compose down -v`. This does not delete anything from hosted MinIO.

---

## 🐧 Linux Server Deployment Guide (Ubuntu / Debian / RHEL)

Follow these steps to deploy the application to a production Linux server (e.g. AWS EC2, DigitalOcean Droplet, Linode, or Hetzner).

---

### Step 1: System Dependencies Installation

Log in to your Linux server via SSH and install Bun, Nginx, PM2, and Certbot.

#### On Ubuntu / Debian:
```bash
# Update package list
sudo apt update && sudo apt upgrade -y

# Install Bun
curl -fsSL https://bun.sh/install | bash
sudo apt install -y nginx git certbot python3-certbot-nginx

# Install PM2 Globally
sudo bun add --global pm2
```

#### On Fedora / RHEL / AlmaLinux:
```bash
sudo dnf update -y
sudo dnf install -y nginx git certbot python3-certbot-nginx
sudo bun add --global pm2
```

---

### Step 2: Clone Project & Configure `.env`

```bash
# Navigate to web root directory
cd /var/www

# Clone repository
sudo git clone <your-repo-url> new-sendiko
sudo chown -R $USER:$USER /var/www/new-sendiko
cd /var/www/new-sendiko

# Install production dependencies
bun install
```

Create production `.env`:
```bash
nano .env
```

#### For MySQL Database:
Set `.env`:
   ```env
   DATABASE_URL="mysql://db_user:db_password@localhost:3306/portfolio_db"
   ADMIN_PASSWORD="YourStrongSecurePasscodeHere"
   NODE_ENV="production"
   ```

---

### Step 3: Database Migration & Seeding

```bash
# Push schema to SQLite/MySQL database
bunx --bun prisma db push

# Seed initial database records
bun run db:seed
```

---

### Step 4: Build Next.js Application

```bash
bun run build
```

---

### Step 5: Start & Daemonize with PM2

Start the production server using PM2 so it stays running in the background and restarts on server reboot:

```bash
# Start Next.js server on port 3000
pm2 start bun --name "sendiko-portfolio" -- run start

# Save PM2 process list
pm2 save

# Setup PM2 auto-start on system boot
pm2 startup
```

Verify PM2 status:
```bash
pm2 status
```

---

### Step 6: Configure Nginx Reverse Proxy & SSL

Create Nginx server configuration:
```bash
sudo nano /etc/nginx/sites-available/portfolio.conf
```

Paste the following configuration (replace `yourdomain.com` with your actual domain):
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site configuration and reload Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/portfolio.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### Obtain Free HTTPS SSL Certificate (Certbot):
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 🔧 Useful Server Maintenance Commands

| Action | Command |
| :--- | :--- |
| **Check App Status** | `pm2 status` |
| **View App Logs** | `pm2 logs sendiko-portfolio` |
| **Restart Application** | `pm2 restart sendiko-portfolio` |
| **Update Code & Redeploy** | `git pull && bun install && bunx --bun prisma db push && bun run build && pm2 restart sendiko-portfolio` |
| **Re-seed Database** | `bun run db:seed` |
| **Database Studio UI** | `bunx --bun prisma studio --port 5555` |

---

## 📄 License

Distributed under the MIT License. Created by Rizky Sendiko.
