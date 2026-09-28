# Server Configuration: Hide .md File Implementation

**Nginx & Server Configuration to hide that content is stored as .md files.**

Users should only see rendered website content, never know about .md files.

---

## Nginx Configuration

### File: `/etc/nginx/sites-available/examai`

```nginx
server {
    listen 80;
    listen 443 ssl http2;
    server_name examai.local www.examai.local;

    # SSL certificates
    ssl_certificate /etc/ssl/certs/examai.crt;
    ssl_certificate_key /etc/ssl/private/examai.key;

    # ========================================================================
    # RULE 1: Block direct .md file access
    # ========================================================================
    
    # Block all .md files
    location ~ \.md$ {
        return 403;
        access_log /var/log/nginx/blocked-md-access.log;
    }

    # Block .md files with any extension/query
    location ~ \.md\.? {
        return 403;
    }

    # ========================================================================
    # RULE 2: Block hidden directories
    # ========================================================================

    # Block /content/ directory (internal markdown storage)
    location /content/ {
        return 403;
        access_log /var/log/nginx/blocked-content-access.log;
    }

    # Block /markdown/ directory
    location /markdown/ {
        return 403;
        access_log /var/log/nginx/blocked-markdown-access.log;
    }

    # Block /raw/ endpoints
    location /raw/ {
        return 403;
    }

    # Block /source/ endpoints
    location /source/ {
        return 403;
    }

    # ========================================================================
    # RULE 3: Block API endpoints that expose .md files
    # ========================================================================

    # Block /api/content/ (exposes markdown files)
    location ~ ^/api/content/ {
        return 403;
    }

    # Block /api/markdown/ (exposes markdown)
    location ~ ^/api/markdown/ {
        return 403;
    }

    # Block /api requests with .md extension
    location ~ ^/api/.*\.md$ {
        return 403;
    }

    # Block download markdown endpoints
    location ~ ^/api/download.*\.md$ {
        return 403;
    }

    # ========================================================================
    # RULE 4: Allow only safe public routes
    # ========================================================================

    # Allow syllabus pages
    location ~ ^/syllabus/[a-z0-9-]+/?$ {
        try_files $uri @app;
    }

    # Allow notes pages
    location ~ ^/notes/[a-z0-9-]+/?$ {
        try_files $uri @app;
    }

    # Allow solutions pages
    location ~ ^/solutions?/[a-z0-9-]+/?$ {
        try_files $uri @app;
    }

    # Allow past-papers pages
    location ~ ^/past-papers?/[a-z0-9-]+/?$ {
        try_files $uri @app;
    }

    # Allow share pages (exam results only)
    location ~ ^/share/[a-zA-Z0-9_=-]+/?$ {
        try_files $uri @app;
    }

    # Allow API share endpoints (exam results only)
    location ~ ^/api/share/ {
        try_files $uri @app;
    }

    # ========================================================================
    # RULE 5: Security Headers (hide implementation)
    # ========================================================================

    # Prevent MIME type sniffing
    add_header X-Content-Type-Options "nosniff" always;

    # Prevent clickjacking
    add_header X-Frame-Options "SAMEORIGIN" always;

    # XSS protection
    add_header X-XSS-Protection "1; mode=block" always;

    # NEVER add these headers (reveal implementation):
    # add_header X-Powered-By "Markdown" always; ← NO
    # add_header X-Content-Source "file.md" always; ← NO
    # add_header X-Original-File "/content/syllabus.md" always; ← NO

    # ========================================================================
    # RULE 6: robots.txt prevents indexing of hidden directories
    # ========================================================================

    location = /robots.txt {
        add_header Content-Type text/plain;
        return 200 "User-agent: *\n
Disallow: /content/\n
Disallow: /markdown/\n
Disallow: /api/\n
Disallow: /*.md\n
Disallow: /raw/\n
Disallow: /source/\n
Allow: /api/share/\n";
    }

    # ========================================================================
    # RULE 7: Redirect attempts to access .md files
    # ========================================================================

    # User tries /syllabus/os-101.md → redirect to /syllabus/os-101
    rewrite ^/(.*)/(.*)\.md$ /$1/$2 permanent;

    # User tries /content/syllabus.md → block with 403
    rewrite ^/content/(.*)$ / permanent;

    # ========================================================================
    # RULE 8: Cache rendered content (not source)
    # ========================================================================

    # Cache HTML pages (rendered content)
    location ~ ^/(syllabus|notes|solutions?|past-papers?)/ {
        expires 1h;
        add_header Cache-Control "public, max-age=3600";
    }

    # Cache API responses (rendered content)
    location ~ ^/api/(syllabus|notes|solutions?|past-papers?)/ {
        expires 10m;
        add_header Cache-Control "public, max-age=600";
    }

    # Don't cache share links (time-sensitive)
    location ~ ^/share/ {
        add_header Cache-Control "public, max-age=300";
    }

    # ========================================================================
    # RULE 9: Pass to Next.js app
    # ========================================================================

    location @app {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # ========================================================================
    # RULE 10: 404 for unknown routes (don't leak structure)
    # ========================================================================

    location / {
        try_files $uri $uri/ @app;
    }

    error_page 404 /404.html;
    error_page 403 /403.html;

    # ========================================================================
    # RULE 11: Access Logging
    # ========================================================================

    # Log blocked access attempts
    access_log /var/log/nginx/access.log combined;
    error_log /var/log/nginx/error.log;

    # Separate log for blocked .md attempts
    map $uri $blocked_log {
        ~*\.md$ 1;
        ~*/content/ 1;
        ~*/markdown/ 1;
        default 0;
    }

    access_log /var/log/nginx/blocked-requests.log combined if=$blocked_log;
}
```

---

## File System Layout

### What to Hide (NOT in web root):
```
/var/examai/content/              ← PRIVATE: .md files here
  ├── syllabus/
  │   ├── os-101.md
  │   ├── cs-201.md
  ├── notes/
  │   ├── biology-101.md
  ├── solutions/
  │   └── algebra-201.md
```

### What to Expose (IN web root):
```
/var/www/html/examai/             ← PUBLIC: Only rendered content
  ├── public/                      ← Static assets
  │   ├── css/
  │   ├── js/
  │   ├── images/
  ├── .next/                       ← Next.js build output
  │   └── (generated HTML pages)
  ├── robots.txt
  ├── sitemap.xml
  ├── next.config.js
```

### File Permissions:
```bash
# .md files: restricted access
sudo chmod 600 /var/examai/content/**/*.md
sudo chown app:app /var/examai/content/

# Public files: read-only for web server
sudo chmod 755 /var/www/html/examai/
sudo chmod 644 /var/www/html/examai/**/*.html
sudo chown www-data:www-data /var/www/html/examai/

# .md files NOT accessible by web server
sudo chown app:app /var/examai/content/
sudo chmod 700 /var/examai/content/
```

---

## Next.js Configuration

### File: `next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ========================================================================
  // Hide .md files from build output
  // ========================================================================
  
  // Exclude markdown files from static generation
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
  // Don't expose source maps in production
  productionBrowserSourceMaps: false,
  
  // ========================================================================
  // Security headers
  // ========================================================================
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Don't add these:
          // 'X-Powered-By': 'Markdown'
          // 'X-Source-Path': 'file.md'
        ],
      },
    ];
  },

  // ========================================================================
  // Rewrites: Hide .md file access attempts
  // ========================================================================

  async rewrites() {
    return {
      beforeFiles: [
        // Block .md file requests
        {
          source: '/:path*\\.md',
          destination: '/api/blocked',
        },
      ],
    };
  },

  // ========================================================================
  // Redirects: Send users to rendered pages
  // ========================================================================

  async redirects() {
    return [
      // Redirect /syllabus/os-101.md to /syllabus/os-101
      {
        source: '/:category/:slug\\.md',
        destination: '/:category/:slug',
        permanent: true,
      },
      // Block content directory
      {
        source: '/content/:path*',
        destination: '/404',
        permanent: false,
      },
      // Block markdown directory
      {
        source: '/markdown/:path*',
        destination: '/404',
        permanent: false,
      },
    ];
  },

  // ========================================================================
  // Environment variables: Hide file paths
  // ========================================================================

  env: {
    // ✅ Safe: URL routes only
    NEXT_PUBLIC_SYLLABUS_URL: '/syllabus',
    NEXT_PUBLIC_NOTES_URL: '/notes',
    NEXT_PUBLIC_SOLUTIONS_URL: '/solutions',
    
    // ✅ Safe: API endpoints only
    NEXT_PUBLIC_API_SHARE: '/api/share',
    
    // ❌ Never expose these:
    // NEXT_PUBLIC_CONTENT_PATH: '/var/examai/content' ← NO
    // NEXT_PUBLIC_MARKDOWN_DIR: '/content' ← NO
  },
};

export default nextConfig;
```

---

## Build Process

### File: `build.sh`

```bash
#!/bin/bash

# ========================================================================
# Build Script: Hide .md file implementation
# ========================================================================

set -e

echo "📦 Building ExamAI..."

# Step 1: Render .md files to HTML during build
echo "✓ Rendering .md files to HTML..."
npm run render:markdown

# Step 2: Build Next.js
echo "✓ Building Next.js..."
npm run build

# Step 3: Remove source maps in production
echo "✓ Removing source maps..."
find .next -name "*.map" -delete
find public -name "*.map" -delete

# Step 4: Remove .md files from output
echo "✓ Cleaning up .md files..."
find .next -name "*.md" -delete
find public -name "*.md" -delete

# Step 5: Verify no .md files in build output
echo "✓ Verifying no .md files exposed..."
if find .next public -name "*.md" 2>/dev/null | grep -q .; then
  echo "❌ ERROR: Found .md files in build output!"
  exit 1
fi

echo "✅ Build complete. No .md files exposed."
```

### Add to `package.json`:
```json
{
  "scripts": {
    "render:markdown": "node scripts/render-markdown.js",
    "build": "next build",
    "build:production": "bash build.sh"
  }
}
```

---

## Security Checklist

- [ ] .md files stored outside `/var/www/html/`
- [ ] .md files have restricted permissions (600)
- [ ] `/content/` directory blocked by nginx (403)
- [ ] `/markdown/` directory blocked by nginx (403)
- [ ] All `*.md` requests blocked by nginx (403)
- [ ] Source maps excluded from production build
- [ ] No `.md` files in Next.js build output
- [ ] No `.md` files in public directory
- [ ] Git history not publicly accessible
- [ ] robots.txt blocks .md and hidden directories
- [ ] API never returns raw markdown
- [ ] Security headers prevent MIME sniffing
- [ ] No "X-Powered-By: Markdown" header
- [ ] No "X-Source-Path" or similar headers
- [ ] Error messages don't mention .md files
- [ ] nginx logs blocked .md access attempts
- [ ] URL rewrites hide .md extension
- [ ] Rendered content cached, not source

---

## Testing

### Verify blocking works:
```bash
# Should return 403 (not 404)
curl -I https://examai.local/content/syllabus.md
→ 403 Forbidden

curl -I https://examai.local/api/notes.md
→ 403 Forbidden

curl -I https://examai.local/raw/solutions.md
→ 403 Forbidden

# Should redirect to rendered page
curl -I https://examai.local/syllabus/os-101.md
→ 301 to /syllabus/os-101

# Should work normally
curl -I https://examai.local/syllabus/os-101
→ 200 OK
```

### Check logs for blocked attempts:
```bash
tail -f /var/log/nginx/blocked-requests.log
tail -f /var/log/nginx/blocked-md-access.log
tail -f /var/log/nginx/blocked-content-access.log
```

