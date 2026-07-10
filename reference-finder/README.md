# Reference Finder - Intelligent Content Analysis Tool

A sophisticated, modern web-based tool that analyzes text content and automatically discovers similar references across the web. Perfect for researchers, content creators, and academics.

## 🚀 Features

### Core Functionality
- **Intelligent Text Segmentation**: Automatically breaks down content into meaningful segments for accurate analysis
- **Advanced Search**: Searches for similar references across the web using intelligent algorithms
- **Similarity Scoring**: Calculates and displays similarity percentages for each reference
- **Smart Filtering**: Filter results by minimum similarity threshold (0-100%)

### User Experience
- **Modern Tech UI**: Sleek, professional dark-themed interface with glassmorphism effects
- **Real-time Feedback**: Progress tracking and loading states during analysis
- **Responsive Design**: Fully responsive across desktop, tablet, and mobile devices
- **Sortable Results**: Sort results by similarity in ascending or descending order
- **Export Functionality**: Export all results to CSV for further analysis

### Configuration Options
- **Adjustable Segment Size**: Choose between Small (100), Medium (200), or Large (400) characters
- **Customizable Results**: Control how many results per segment (3, 5, or 10)
- **Similarity Threshold**: Set minimum similarity percentage with interactive slider

## 📋 How It Works

1. **Paste Content**: Input any text, article, or document (up to 50,000 characters)
2. **Configure Settings**: Adjust segment size, result count, and similarity threshold
3. **Analyze**: Click "Analyze & Search" to begin the analysis
4. **View Segments**: See how your text is broken into segments for analysis
5. **Review Results**: Browse through similar references with detailed information
6. **Export Data**: Save results as CSV for external use

### Algorithm Details

**Text Segmentation**:
- Splits content by sentences first
- Groups sentences to match chosen segment size
- Filters out very short segments (< 20 characters)
- Maintains natural language boundaries

**Similarity Calculation**:
- Uses word-overlap matching algorithm
- Filters common words for more accurate matching
- Calculates percentage based on unique word matches
- Visual representation with color-coded badges

## 🎨 UI/UX Design

### Design Philosophy
- **Modern Aesthetic**: Dark theme with neon accent colors (#0066FF, #00D9FF)
- **Visual Hierarchy**: Clear distinction between sections and actions
- **Interactive Feedback**: Hover effects, animations, and visual states
- **Accessibility**: High contrast text, readable fonts, clear CTAs

### Color Scheme
- **Primary**: #0066FF (Electric Blue)
- **Accent**: #00D9FF (Cyan)
- **Success**: #10B981 (Green)
- **Warning**: #F59E0B (Amber)
- **Background**: #0F1419 (Deep Navy)

### Component Highlights
- **Gradient Headers**: Linear gradients for visual depth
- **Glowing Effects**: Box shadows with colored glows
- **Smooth Animations**: CSS transitions and keyframe animations
- **Custom Scrollbar**: Styled scrollbar matching theme
- **Responsive Grid**: Flexible layout that adapts to screen size

## 💻 Technical Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Architecture**: Object-oriented JavaScript with class-based design
- **API Integration**: Bing Search API (configurable)
- **Styling**: CSS Grid, Flexbox, CSS Variables
- **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge)

## 📦 File Structure

```
reference-finder/
├── index.html          # Main HTML structure
├── styles.css          # Modern CSS styling
├── script.js           # JavaScript functionality
├── README.md           # Documentation
└── config.js           # Configuration (optional)
```

## 🔧 Installation & Setup

### Basic Setup
1. Clone or download the repository
2. Open `index.html` in a modern web browser
3. No dependencies or build process required!

### Bing Search API Setup (Optional)
To use real Bing Search API results:

1. Get your API key from [Azure Cognitive Services](https://azure.microsoft.com/en-us/services/cognitive-services/bing-web-search-api/)
2. In `script.js`, replace `'YOUR_BING_SEARCH_KEY'` with your actual key
3. Update the API endpoint if needed

### Local Development
```bash
# Simply serve with any HTTP server
python -m http.server 8000

# Or use Node.js
npx http-server
```

Then navigate to `http://localhost:8000/reference-finder/`

## 📖 Usage Guide

### Basic Analysis
1. Copy and paste your content into the input area
2. Keep default settings or customize:
   - **Segment Size**: Smaller for precise matching, larger for broader context
   - **Results**: More results for comprehensive analysis
   - **Threshold**: Higher threshold for stricter similarity matching
3. Click **Analyze & Search**
4. Review results organized by relevance

### Interpreting Results
- **Similarity Badge Color**:
  - 🟢 **Green (80%+)**: Highly relevant references
  - 🟡 **Amber (60-79%)**: Moderately relevant references
  - 🔵 **Blue (<60%)**: Loosely related references

- **Results Include**:
  - Reference title and direct link
  - Snippet from source document
  - Source domain
  - Matched segment from your content
  - Similarity percentage with visual bar

### Exporting Results
1. Once analysis is complete, click **Export Results**
2. CSV file automatically downloads with format:
   - Segment text
   - Reference title
   - URL
   - Similarity percentage
   - Reference snippet

## ⚙️ Configuration Options

### JavaScript Constants (in `script.js`)
```javascript
// Maximum characters allowed
const MAX_CHARS = 50000;

// Search API settings
const API_ENDPOINT = 'https://api.bing.microsoft.com/v7.0/search';
const API_KEY = 'YOUR_BING_SEARCH_KEY';

// Similarity calculation parameters
const MIN_WORD_LENGTH = 3;
const SEGMENT_DELAY = 500; // ms between searches
```

### CSS Variables (in `styles.css`)
```css
:root {
    --primary-color: #0066ff;
    --accent-color: #00d9ff;
    --bg-primary: #0f1419;
    --text-primary: #e4e9f0;
    /* ... more variables */
}
```

## 🎯 Use Cases

- **Academic Research**: Find similar studies and papers
- **Content Creation**: Discover relevant sources and references
- **Plagiarism Detection**: Identify similar content on the web
- **Market Research**: Find competitive content and industry insights
- **SEO Analysis**: Discover competing content and ranking factors
- **Translation Review**: Find context and similar translations
- **Document Analysis**: Comprehensive reference discovery

## 🚀 Advanced Features (Roadmap)

- [ ] Multiple search engine support (Google, DuckDuckGo)
- [ ] Local storage for saved analyses
- [ ] Advanced filtering (date range, domain, language)
- [ ] Batch processing for multiple documents
- [ ] Integration with citation managers
- [ ] PDF upload support
- [ ] Real-time collaboration features
- [ ] Custom search operators

## 🐛 Known Limitations

- **API Dependency**: Real search requires valid Bing Search API key
- **Rate Limiting**: Default mock data used if API calls exceed limits
- **Browser Storage**: Results not persisted (reload clears data)
- **Character Limit**: 50,000 characters maximum per analysis
- **Language**: English-optimized (other languages supported but not optimized)

## 📝 Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Latest versions |
| Firefox | ✅ Full | Latest versions |
| Safari | ✅ Full | Version 12+ |
| Edge | ✅ Full | Chromium-based |
| IE 11 | ❌ No | Not supported |

## 🔐 Privacy & Security

- **Client-side Processing**: Content analysis happens locally
- **API Calls**: Only segments are sent to search APIs
- **No Data Storage**: Results are not stored or logged
- **Secure Transmission**: Uses HTTPS for all API calls

## 📄 License

This project is part of the translation-interface repository.

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📞 Support

For issues or questions:
1. Check the documentation above
2. Review browser console for errors
3. Ensure API key is properly configured
4. Verify internet connection for search functionality

## 🌟 Features Demo

### Smart Segmentation
```
Original Text: "The quick brown fox jumps over the lazy dog. It runs fast."
Small Segments (100 chars):
  1. "The quick brown fox jumps over the lazy dog."
  2. "It runs fast."
```

### Similarity Matching
```
Segment: "artificial intelligence machine learning"
Result: "AI and machine learning algorithms" → 75% Match
```

### Export Format
```csv
Segment,Reference Title,URL,Similarity %,Snippet
"artificial intelligence...",Research Paper Title,https://example.com,85,"AI is transforming..."
```

## 🎓 Technical Notes

### Performance Optimization
- Lazy-loads search results as needed
- Implements request throttling to avoid API rate limits
- Uses efficient string matching algorithms
- Optimized CSS for smooth animations

### Accessibility Features
- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- High contrast color scheme
- Readable font sizes and spacing

### SEO Optimization
- Meta tags for proper indexing
- Semantic HTML markup
- Fast page load times
- Mobile-responsive design

---

**Created with ❤️ for content researchers and academics**

*Reference Finder v1.0 - Intelligent Content Analysis & Discovery*
