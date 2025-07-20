# 🎮 Pokémon Trainer Hub - Linktree Style Website

A beautiful, responsive Linktree-style webpage with a Pokémon theme featuring both social links and a Pokémon card gallery. Built with vanilla HTML, CSS, and JavaScript for easy deployment on Netlify.

![Pokémon Trainer Hub Preview](https://via.placeholder.com/800x400/667eea/ffffff?text=Pokémon+Trainer+Hub)

## ✨ Features

- 🎨 **Pokémon-themed Design**: Beautiful gradient backgrounds and Poké Ball-inspired elements
- 📱 **Fully Responsive**: Works perfectly on desktop, tablet, and mobile devices
- 🌙 **Dark/Light Mode**: Toggle between themes with a beautiful animated button
- 🔗 **Social Links**: Easy-to-customize payment and social media links
- 🃏 **Card Gallery**: Showcase your Pokémon card collection with rarity indicators
- ⚡ **Fast & Lightweight**: No frameworks, just vanilla HTML/CSS/JS
- 🚀 **Netlify Ready**: Deploy instantly with drag-and-drop or Git integration

## 🚀 Quick Start

### Option 1: Deploy to Netlify (Recommended)

1. **Fork this repository** or download the files
2. **Go to [Netlify](https://netlify.com)** and sign up/login
3. **Drag and drop** the entire folder to Netlify's deploy area
4. **Your site is live!** 🎉

### Option 2: GitHub + Netlify Integration

1. **Create a new GitHub repository** named `linktree-pokemon-site`
2. **Upload all files** to the repository
3. **Connect to Netlify**:
   - Go to Netlify → "New site from Git"
   - Choose GitHub and select your repository
   - Deploy settings: Build command: `none`, Publish directory: `.`
4. **Your site auto-deploys** on every push! 🚀

## 🛠️ Customization Guide

### 1. Update Your Profile

Edit `index.html` to customize your profile:

```html
<h1 class="trainer-name">Your Name</h1>
<p class="trainer-bio">Your custom bio • Your tagline</p>
```

### 2. Update Social Links

Replace the placeholder URLs in `index.html`:

```html
<!-- Replace YOUR_USERNAME with your actual usernames -->
<a href="https://venmo.com/YOUR_USERNAME" class="link-btn venmo-btn">
<a href="https://cash.app/$YOUR_USERNAME" class="link-btn cashapp-btn">
<a href="https://paypal.me/YOUR_USERNAME" class="link-btn paypal-btn">
<a href="https://instagram.com/YOUR_USERNAME" class="link-btn instagram-btn">
```

### 3. Add Your Profile Picture

1. **Replace** `assets/profile-pic.jpg` with your own image
2. **Recommended size**: 400x400 pixels (will be automatically resized)
3. **Format**: JPG, PNG, or WebP

### 4. Customize Your Card Collection

Edit `cards.json` to add your own Pokémon cards:

```json
{
  "name": "Card Name",
  "image": "assets/cards/your-card-image.jpg",
  "rarity": "Common|Uncommon|Rare|Legendary|Mythical"
}
```

**Rarity Levels & Colors:**
- **Common**: Gray gradient
- **Uncommon**: Green gradient  
- **Rare**: Blue gradient
- **Legendary**: Gold gradient
- **Mythical**: Purple gradient

### 5. Add Card Images

1. **Place your card images** in the `assets/cards/` folder
2. **Update the image paths** in `cards.json` to match your filenames
3. **Recommended format**: JPG or PNG, 300x400 pixels

### 6. Customize Colors & Theme

Edit the CSS variables in `style.css`:

```css
:root {
    --primary-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --pokeball-red: #e53e3e;
    /* Add more custom colors here */
}
```

## 📁 File Structure

```
linktree-pokemon-site/
├── index.html              # Main HTML file
├── style.css               # All styling and animations
├── script.js               # JavaScript functionality
├── cards.json              # Your card collection data
├── README.md               # This file
├── netlify.toml            # Netlify configuration (optional)
└── assets/
    ├── profile-pic.jpg     # Your profile picture
    ├── card-placeholder.jpg # Fallback card image
    └── cards/              # Your card images
        ├── charizard.jpg
        ├── pikachu.jpg
        └── ...
```

## 🎨 Design Features

### Pokémon Theme Elements
- **Poké Ball Profile Picture**: Circular frame with Poké Ball center button
- **Gradient Backgrounds**: Inspired by Pokémon battle scenes
- **Rarity Color Coding**: Different colors for card rarity levels
- **Smooth Animations**: Hover effects and transitions throughout

### Interactive Features
- **Tab Switching**: Toggle between Links and Cards sections
- **Theme Toggle**: Dark/light mode with persistent storage
- **Keyboard Navigation**: Use arrow keys to switch tabs, 'T' for theme
- **Touch Support**: Swipe gestures on mobile devices
- **Loading States**: Beautiful loading animations for cards

### Responsive Design
- **Mobile-First**: Optimized for all screen sizes
- **Touch-Friendly**: Large buttons and easy navigation
- **Fast Loading**: Optimized images and minimal dependencies

## 🔧 Advanced Customization

### Adding New Link Types

1. **Add the HTML** in `index.html`:
```html
<a href="YOUR_LINK" class="link-btn custom-btn" target="_blank">
    <div class="btn-icon">
        <i class="fab fa-your-icon"></i>
    </div>
    <span class="btn-text">Your Link</span>
</a>
```

2. **Add the CSS** in `style.css`:
```css
.custom-btn .btn-icon {
    background: linear-gradient(45deg, #your-color1, #your-color2);
}
```

### Adding New Tabs

1. **Add tab button** in the tab container
2. **Add tab content** section
3. **Update JavaScript** to handle the new tab

### Custom Animations

The site uses CSS animations for:
- **Entrance effects**: Fade-in animations
- **Hover effects**: Button and card interactions
- **Theme transitions**: Smooth color changes
- **Loading states**: Spinning and pulse animations

## 🚀 Deployment Options

### Netlify (Recommended)
- **Free hosting** with custom domain support
- **Automatic HTTPS** and CDN
- **Form handling** and serverless functions
- **Git integration** for continuous deployment

### Other Options
- **GitHub Pages**: Free static hosting
- **Vercel**: Fast deployment with Git integration
- **Firebase Hosting**: Google's hosting solution
- **Any static hosting**: Works with any web server

## 🐛 Troubleshooting

### Common Issues

**Images not loading:**
- Check file paths in `cards.json`
- Ensure images are in the correct folders
- Verify image file formats (JPG, PNG, WebP)

**Links not working:**
- Update URLs in `index.html`
- Remove `YOUR_USERNAME` placeholders
- Test links in a new browser tab

**Styling issues:**
- Clear browser cache
- Check for CSS syntax errors
- Verify all files are uploaded

### Browser Support
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers
- ⚠️ Internet Explorer (not supported)

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve this project!

## 🙏 Acknowledgments

- **Pokémon**: For the amazing world and characters
- **Font Awesome**: For the beautiful icons
- **Google Fonts**: For the typography
- **Netlify**: For the amazing hosting platform

---

**Made with ❤️ for Pokémon Trainers everywhere!**

*Gotta catch 'em all!* 🎮✨ 