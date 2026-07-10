# Reference Finder - Quick Start Guide

## 🚀 Getting Started in 2 Minutes

### Step 1: Open the Tool
Simply open `index.html` in your web browser:
```
reference-finder/index.html
```

No installation, no dependencies, no setup required!

### Step 2: Paste Your Content
Click in the text area and paste any content you want to analyze:
- Articles
- Blog posts
- Research papers
- News items
- Any text content

### Step 3: Configure (Optional)
Adjust these settings if needed:
- **Segment Size**: How to break up your text (Small/Medium/Large)
- **Results**: How many references to find per segment (3/5/10)
- **Similarity**: Minimum match percentage (0-100%)

### Step 4: Click Analyze
Click the blue **"Analyze & Search"** button and wait for results.

### Step 5: Review & Export
- Browse through found references
- Click links to visit sources
- Sort by similarity
- Export results as CSV

---

## 💡 Tips & Tricks

### For Best Results:
1. **Use Clear Content**: Shorter, well-written text segments work best
2. **Adjust Thresholds**: Lower threshold = more results, higher = stricter matching
3. **Use Medium Segments**: Balances accuracy with breadth of search
4. **Export Often**: Save results as you go

### Common Use Cases:

**Academic Research**
- Segment Size: Medium
- Results: 5-10
- Threshold: 70%

**Content Marketing**
- Segment Size: Large
- Results: 5
- Threshold: 60%

**Quick Check**
- Segment Size: Small
- Results: 3
- Threshold: 80%

---

## 🎯 Understanding Results

### Match Percentage
- 🟢 **80%+**: Highly relevant, similar content
- 🟡 **60-79%**: Moderately relevant
- 🔵 **Below 60%**: Loosely related content

### Result Information
Each result shows:
- ✓ Reference title (clickable link)
- ✓ Similarity percentage
- ✓ Your matched text segment
- ✓ Reference snippet
- ✓ Source website

---

## 📊 Exporting Results

Click **"Export Results"** to download a CSV file containing:
```
Segment | Reference Title | URL | Similarity % | Snippet
```

Perfect for:
- Spreadsheet analysis
- Citation managers
- Research organization
- Sharing with team members

---

## ⚙️ Configuring Bing Search API (Advanced)

To use real search results instead of mock data:

1. **Get API Key**
   - Visit: https://portal.azure.com/
   - Create Bing Search API resource
   - Copy your API key

2. **Update config.js**
   - Open `reference-finder/config.js`
   - Find: `apiKey: 'YOUR_BING_SEARCH_KEY'`
   - Replace with your actual key

3. **Refresh Browser**
   - Reload the page
   - Now using live search results!

---

## 🔧 Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+A` | Select all text in input |
| `Ctrl+C` | Copy highlighted text |
| `Ctrl+V` | Paste content |
| `Enter` | Submit (when button focused) |
| `Esc` | Clear focus |

---

## ❓ Troubleshooting

### "No References Found"
- Try lowering the similarity threshold
- Use larger segment sizes
- Paste more content
- Check API key if using Bing Search

### Results Are Too Generic
- Increase similarity threshold to 80%+
- Use smaller segment sizes
- Paste more specific content

### Search Takes Too Long
- Use larger segment sizes (fewer searches)
- Lower result count per segment
- Wait for completion (may take 1-2 minutes)

### Browser Shows Blank Page
- Clear browser cache (Ctrl+Shift+Del)
- Try different browser
- Check browser console for errors (F12)

---

## 📱 Mobile Usage

Reference Finder works on mobile devices:
- Responsive design adapts to screen size
- Touch-friendly interface
- Full functionality on all devices
- Optimized for smaller screens

---

## 🌐 Browser Support

| Browser | Status | Min Version |
|---------|--------|-------------|
| Chrome | ✅ Supported | 80+ |
| Firefox | ✅ Supported | 75+ |
| Safari | ✅ Supported | 12+ |
| Edge | ✅ Supported | 80+ |
| Opera | ✅ Supported | 67+ |

---

## 💾 Local Usage

### Option 1: Direct File Access
```bash
# Windows
start reference-finder/index.html

# Mac
open reference-finder/index.html

# Linux
xdg-open reference-finder/index.html
```

### Option 2: Web Server
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```

Then visit: `http://localhost:8000/reference-finder/`

---

## 🔐 Privacy Notice

- ✓ Your content stays on your computer
- ✓ Text analysis happens locally in your browser
- ✓ Only search queries sent to Bing (if using API)
- ✓ No data stored or logged
- ✓ No cookies or tracking

---

## 📚 More Information

- See **README.md** for detailed documentation
- Check **config.js** for customization options
- Review **styles.css** for design customization
- Inspect **script.js** for functionality details

---

## 🎓 Example Workflow

### Research Paper Analysis
```
1. Copy abstract from research paper
2. Set Segment Size: Medium
3. Set Results: 10
4. Set Threshold: 65%
5. Click "Analyze & Search"
6. Wait for results (2-5 minutes)
7. Click "Export Results"
8. Open CSV in spreadsheet
9. Sort by similarity
10. Visit top 5 links for related research
```

### Content Competitor Analysis
```
1. Paste competitor's blog post
2. Set Segment Size: Large
3. Set Results: 5
4. Set Threshold: 60%
5. Click "Analyze & Search"
6. Review found references
7. Export and analyze pattern
```

---

## 🚀 Advanced Features

### Custom Configuration
Edit `config.js` to:
- Change colors and theme
- Adjust API settings
- Customize text strings
- Enable/disable features
- Set default values

### Integration
Integrate with:
- Zotero (bibliography management)
- Notion (note-taking)
- Google Sheets (data analysis)
- CSV import into other tools

---

## 💬 Feedback & Support

For issues or suggestions:
1. Check troubleshooting section above
2. Review configuration options
3. Try clearing browser cache
4. Test in different browser
5. Contact support (see README.md)

---

## 🎉 Next Steps

- ✅ Analyze your first document
- ✅ Export results
- ✅ Explore the interface
- ✅ Try different settings
- ✅ Share with colleagues

---

**Ready? Open `reference-finder/index.html` and start analyzing!**

*Reference Finder - Making research faster, smarter, easier*

**Version 1.0** | Last Updated: 2024
