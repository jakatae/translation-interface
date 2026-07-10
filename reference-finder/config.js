/**
 * Reference Finder - Configuration File
 * Customize behavior, appearance, and API settings
 */

const ReferencFinderConfig = {
    // ============ API CONFIGURATION ============
    api: {
        // Bing Search API endpoint
        searchEndpoint: 'https://api.bing.microsoft.com/v7.0/search',
        
        // Replace with your actual Bing Search API key
        // Get it from: https://portal.azure.com/
        apiKey: 'YOUR_BING_SEARCH_KEY',
        
        // Request timeout in milliseconds
        timeout: 10000,
        
        // Delay between API calls (prevents rate limiting)
        requestDelay: 500,
        
        // Enable mock results when API fails
        useMockDataOnError: true
    },

    // ============ TEXT SEGMENTATION ============
    segmentation: {
        // Maximum characters for analysis
        maxCharacters: 50000,
        
        // Minimum segment length to include
        minSegmentLength: 20,
        
        // Default segment size options
        segmentSizes: {
            small: 100,
            medium: 200,
            large: 400
        },
        
        // Default selected size
        defaultSize: 200
    },

    // ============ SEARCH CONFIGURATION ============
    search: {
        // Default number of results per segment
        defaultResultCount: 5,
        
        // Result count options
        resultCountOptions: [3, 5, 10],
        
        // Default similarity threshold (0-100)
        defaultThreshold: 60,
        
        // Minimum word length for similarity calculation
        minWordLength: 3,
        
        // Stop words to exclude from matching
        stopWords: [
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
            'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'been', 'be',
            'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
            'should', 'may', 'might', 'must', 'can', 'it', 'this', 'that', 'these',
            'those', 'i', 'you', 'he', 'she', 'we', 'they', 'what', 'which', 'who',
            'when', 'where', 'why', 'how'
        ]
    },

    // ============ UI/UX CONFIGURATION ============
    ui: {
        // Show segments preview section
        showSegments: true,
        
        // Auto-scroll to results
        autoScroll: true,
        
        // Animation duration in milliseconds
        animationDuration: 300,
        
        // Show loading progress bar
        showProgress: true,
        
        // Enable dark mode (default)
        darkMode: true,
        
        // Results per page (pagination)
        resultsPerPage: 20
    },

    // ============ COLOR THEME ============
    theme: {
        // Primary brand color
        primaryColor: '#0066ff',
        primaryDark: '#0052cc',
        primaryLight: '#e6f0ff',
        
        // Accent color
        accentColor: '#00d9ff',
        
        // Status colors
        successColor: '#10b981',
        warningColor: '#f59e0b',
        dangerColor: '#ef4444',
        
        // Background colors
        bgPrimary: '#0f1419',
        bgSecondary: '#1a1f2e',
        bgTertiary: '#25293a',
        
        // Text colors
        textPrimary: '#e4e9f0',
        textSecondary: '#a0aac0',
        textTertiary: '#777d8d',
        
        // Border colors
        borderColor: '#2d3347',
        borderLight: '#3a4150'
    },

    // ============ SIMILARITY THRESHOLDS ============
    similarity: {
        // High similarity threshold
        highThreshold: 80,
        
        // Medium similarity threshold
        mediumThreshold: 60,
        
        // Colors for different similarity levels
        colors: {
            high: '#10b981',      // Green
            medium: '#f59e0b',    // Amber
            low: '#0066ff'        // Blue
        }
    },

    // ============ EXPORT CONFIGURATION ============
    export: {
        // CSV export enabled
        csvEnabled: true,
        
        // JSON export enabled
        jsonEnabled: false,
        
        // Include metadata in export
        includeMetadata: true,
        
        // CSV delimiter
        delimiter: ',',
        
        // CSV line ending
        lineEnding: '\n'
    },

    // ============ LANGUAGE & LOCALIZATION ============
    i18n: {
        // Default language (en-US)
        language: 'en-US',
        
        // Supported languages
        supportedLanguages: ['en-US', 'es', 'fr', 'de', 'zh', 'ja'],
        
        // Text strings (expandable for multiple languages)
        strings: {
            'en-US': {
                title: 'Reference Finder',
                subtitle: 'Intelligent Content Analysis & Reference Discovery',
                pasteContent: 'Paste Your Content',
                analyzeBtn: 'Analyze & Search',
                clearBtn: 'Clear',
                exportBtn: 'Export Results',
                sortBtn: 'Sort by Similarity',
                textSegments: 'Text Segments',
                referenceResults: 'Reference Search Results',
                noResults: 'No References Found',
                segmentsIdentified: 'segments identified',
                matchedSegment: 'Matched Segment',
                referenceSnippet: 'Reference Snippet',
                source: 'Source',
                analyzing: 'Analyzing content and searching references...',
                minSimilarity: 'Min. Similarity',
                segmentSize: 'Segment Size',
                resultsPerSegment: 'Results per Segment',
                smallSegments: 'Small (100 chars)',
                mediumSegments: 'Medium (200 chars)',
                largeSegments: 'Large (400 chars)',
                similarity: '% Match'
            }
        }
    },

    // ============ MOCK DATA CONFIGURATION ============
    mockData: {
        // Enable mock data for demonstration
        enabled: true,
        
        // Mock data sources
        sources: [
            'example-research.com',
            'academic-journal.org',
            'knowledge-base.io',
            'news-portal.com',
            'tech-docs.com',
            'tutorial-site.com',
            'reference-library.com',
            'research-hub.io'
        ],
        
        // Mock result templates
        templates: [
            {
                type: 'research',
                titleTemplate: 'Research: {query}',
                snippetTemplate: 'Comprehensive overview of {query} with detailed analysis.'
            },
            {
                type: 'academic',
                titleTemplate: 'Study: {query}',
                snippetTemplate: 'Peer-reviewed findings on {query} with methodology.'
            },
            {
                type: 'guide',
                titleTemplate: 'Guide: Understanding {query}',
                snippetTemplate: 'Detailed guide covering {query} with practical examples.'
            },
            {
                type: 'news',
                titleTemplate: 'News: Latest on {query}',
                snippetTemplate: 'Breaking news about {query} with expert opinions.'
            }
        ]
    },

    // ============ PERFORMANCE CONFIGURATION ============
    performance: {
        // Enable caching of search results
        enableCache: true,
        
        // Cache expiration in minutes
        cacheExpiration: 60,
        
        // Debounce delay for input events (ms)
        debounceDelay: 300,
        
        // Maximum concurrent requests
        maxConcurrentRequests: 3,
        
        // Enable request pooling
        enablePooling: true
    },

    // ============ LOGGING & DEBUGGING ============
    debug: {
        // Enable console logging
        enableLogging: false,
        
        // Log level: 'debug', 'info', 'warn', 'error'
        logLevel: 'info',
        
        // Log API calls
        logApiCalls: false,
        
        // Log segmentation process
        logSegmentation: false,
        
        // Show performance metrics
        showMetrics: false
    },

    // ============ ADVANCED OPTIONS ============
    advanced: {
        // Enable experimental features
        experimentalFeatures: false,
        
        // Custom CSS class prefix
        classPrefix: 'rf-',
        
        // Enable analytics tracking
        analytics: false,
        
        // Analytics endpoint
        analyticsEndpoint: 'https://analytics.example.com',
        
        // Session timeout (minutes)
        sessionTimeout: 30,
        
        // Auto-save results
        autoSave: false,
        
        // Save location (localStorage key)
        saveKey: 'referenceFinder_results'
    }
};

// ============ HELPER FUNCTIONS ============

/**
 * Get configuration value with dot notation
 * @example getConfigValue('api.apiKey')
 */
function getConfigValue(path, defaultValue = null) {
    const keys = path.split('.');
    let value = ReferencFinderConfig;
    
    for (const key of keys) {
        if (value && typeof value === 'object' && key in value) {
            value = value[key];
        } else {
            return defaultValue;
        }
    }
    
    return value;
}

/**
 * Set configuration value with dot notation
 * @example setConfigValue('api.apiKey', 'your-key')
 */
function setConfigValue(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    let target = ReferencFinderConfig;
    
    for (const key of keys) {
        if (!(key in target)) {
            target[key] = {};
        }
        target = target[key];
    }
    
    target[lastKey] = value;
}

/**
 * Log debug message if logging is enabled
 */
function debugLog(message, data = null) {
    if (ReferencFinderConfig.debug.enableLogging) {
        console.log(`[ReferenceFinder] ${message}`, data);
    }
}

/**
 * Get localized string
 */
function getString(key, language = null) {
    const lang = language || ReferencFinderConfig.i18n.language;
    const strings = ReferencFinderConfig.i18n.strings[lang] || ReferencFinderConfig.i18n.strings['en-US'];
    return strings[key] || key;
}

// Export for use in script.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ReferencFinderConfig,
        getConfigValue,
        setConfigValue,
        debugLog,
        getString
    };
}
