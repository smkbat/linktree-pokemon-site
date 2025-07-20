# 🚀 Deployment Guide

## Step 1: Create GitHub Repository

1. **Go to [GitHub.com](https://github.com)** and sign in
2. **Click the "+" icon** in the top right corner
3. **Select "New repository"**
4. **Repository name**: `linktree-pokemon-site`
5. **Description**: `Pokémon-themed Linktree style website with card gallery`
6. **Make it Public** (or Private if you prefer)
7. **Don't initialize** with README, .gitignore, or license (we already have these)
8. **Click "Create repository"**

## Step 2: Push to GitHub

After creating the repository, GitHub will show you commands. Run these in your terminal:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/linktree-pokemon-site.git

# Push your code to GitHub
git push -u origin main
```

## Step 3: Deploy to Netlify

### Option A: Connect GitHub Repository (Recommended)

1. **Go to [Netlify.com](https://netlify.com)** and sign up/login
2. **Click "New site from Git"**
3. **Choose "GitHub"** as your Git provider
4. **Authorize Netlify** to access your GitHub account
5. **Select your repository**: `linktree-pokemon-site`
6. **Deploy settings**:
   - **Build command**: Leave empty (or type `none`)
   - **Publish directory**: `.` (just a dot)
7. **Click "Deploy site"**

### Option B: Drag & Drop Deployment

1. **Go to [Netlify.com](https://netlify.com)** and sign up/login
2. **Drag and drop** the entire project folder to the deploy area
3. **Your site is live!** 🎉

## Step 4: Customize Your Site

### Update Links
Edit `index.html` and replace the placeholder URLs:
- `https://venmo.com/YOUR_USERNAME` → Your actual Venmo link
- `https://cash.app/$YOUR_USERNAME` → Your actual Cash App link
- `https://paypal.me/YOUR_USERNAME` → Your actual PayPal link
- `https://instagram.com/YOUR_USERNAME` → Your actual Instagram link

### Add Your Profile Picture
1. Replace `assets/profile-pic.jpg` with your own image
2. Recommended size: 400x400 pixels

### Add Your Card Images
1. Place your card images in `assets/cards/` folder
2. Update `cards.json` with your card data
3. Make sure image paths match your filenames

### Update Profile Info
Edit `index.html`:
```html
<h1 class="trainer-name">Your Name</h1>
<p class="trainer-bio">Your custom bio • Your tagline</p>
```

## Step 5: Continuous Deployment

If you used Option A (GitHub integration):
- **Every time you push** to GitHub, Netlify will automatically redeploy
- **No manual uploads** needed
- **Version control** for your changes

## Custom Domain (Optional)

1. **In Netlify dashboard**, go to your site settings
2. **Click "Domain settings"**
3. **Add custom domain** or use Netlify's free subdomain
4. **Configure DNS** if using a custom domain

## Troubleshooting

### Site not loading?
- Check Netlify deployment logs
- Verify all files are in the repository
- Ensure `index.html` is in the root directory

### Images not showing?
- Check file paths in `cards.json`
- Verify images are uploaded to GitHub
- Clear browser cache

### Links not working?
- Update URLs in `index.html`
- Remove placeholder text
- Test links in new browser tab

## Support

- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)
- **GitHub Help**: [help.github.com](https://help.github.com)
- **Project Issues**: Create an issue in the GitHub repository

---

**Your Pokémon Trainer Hub is now live!** 🎮✨ 