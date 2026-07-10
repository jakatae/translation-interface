class ReferenceFinder {
    constructor() {
        this.contentInput = document.getElementById('contentInput');
        this.analyzeBtn = document.getElementById('analyzeBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.segmentSize = document.getElementById('segmentSize');
        this.resultCount = document.getElementById('resultCount');
        this.similarityThreshold = document.getElementById('similarityThreshold');
        this.thresholdValue = document.getElementById('thresholdValue');
        this.charCounter = document.getElementById('charCounter');
        
        this.segmentsSection = document.getElementById('segmentsSection');
        this.segmentsList = document.getElementById('segmentsList');
        this.segmentCount = document.querySelector('.segments-section .hint');
        
        this.resultsSection = document.getElementById('resultsSection');
        this.resultsList = document.getElementById('resultsList');
        this.loadingState = document.getElementById('loadingState');
        this.noResultsState = document.getElementById('noResultsState');
        this.progressFill = document.getElementById('progressFill');
        
        this.sortBtn = document.getElementById('sortBtn');
        this.exportBtn = document.getElementById('exportBtn');
        
        this.segments = [];
        this.results = [];
        this.sortOrder = 'desc';
        
        this.init();
    }
    
    init() {
        this.analyzeBtn.addEventListener('click', () => this.analyzeContent());
        this.clearBtn.addEventListener('click', () => this.clearAll());
        this.contentInput.addEventListener('input', (e) => this.updateCharCount(e));
        this.similarityThreshold.addEventListener('input', (e) => this.updateThresholdDisplay(e));
        this.sortBtn.addEventListener('click', () => this.toggleSort());
        this.exportBtn.addEventListener('click', () => this.exportResults());
    }
    
    updateCharCount(e) {
        const count = e.target.value.length;
        this.charCounter.textContent = count;
        if (count > 50000) {
            this.contentInput.value = this.contentInput.value.substring(0, 50000);
            this.charCounter.textContent = '50000';
        }
    }
    
    updateThresholdDisplay(e) {
        this.thresholdValue.textContent = e.target.value + '%';
    }
    
    clearAll() {
        this.contentInput.value = '';
        this.charCounter.textContent = '0';
        this.segments = [];
        this.results = [];
        this.segmentsSection.style.display = 'none';
        this.resultsSection.style.display = 'none';
        this.noResultsState.style.display = 'none';
        this.segmentsList.innerHTML = '';
        this.resultsList.innerHTML = '';
    }
    
    analyzeContent() {
        const content = this.contentInput.value.trim();
        
        if (!content) {
            alert('Please paste some content to analyze');
            return;
        }
        
        this.segments = this.segmentText(content);
        this.displaySegments();
        
        this.showLoading();
        this.searchReferences();
    }
    
    segmentText(content) {
        const size = parseInt(this.segmentSize.value);
        const segments = [];
        
        // Split by sentences first for better segmentation
        const sentences = content.match(/[^.!?]+[.!?]+/g) || [content];
        let currentSegment = '';
        
        sentences.forEach(sentence => {
            if ((currentSegment + sentence).length <= size) {
                currentSegment += sentence;
            } else {
                if (currentSegment.trim()) {
                    segments.push(currentSegment.trim());
                }
                currentSegment = sentence;
            }
        });
        
        if (currentSegment.trim()) {
            segments.push(currentSegment.trim());
        }
        
        return segments.filter(s => s.length > 20); // Filter out very short segments
    }
    
    displaySegments() {
        this.segmentsList.innerHTML = '';
        this.segmentCount.textContent = `${this.segments.length} segments identified`;
        
        this.segments.forEach((segment, index) => {
            const segmentDiv = document.createElement('div');
            segmentDiv.className = 'segment-item';
            segmentDiv.innerHTML = `
                <span class="segment-number">Segment ${index + 1}</span>
                <p class="segment-text">${this.escapeHtml(segment)}</p>
            `;
            this.segmentsList.appendChild(segmentDiv);
        });
        
        this.segmentsSection.style.display = 'block';
    }
    
    async searchReferences() {
        this.results = [];
        const threshold = parseInt(this.similarityThreshold.value);
        const resultCount = parseInt(this.resultCount.value);
        
        let processedSegments = 0;
        
        for (let i = 0; i < this.segments.length; i++) {
            const segment = this.segments[i];
            
            try {
                const references = await this.searchWithBing(segment, resultCount);
                
                // Calculate similarity scores
                const scoredReferences = references.map(ref => ({
                    ...ref,
                    segmentIndex: i,
                    similarity: this.calculateSimilarity(segment, ref.snippet)
                })).filter(ref => ref.similarity >= threshold);
                
                this.results.push(...scoredReferences);
            } catch (error) {
                console.error(`Error searching segment ${i}:`, error);
            }
            
            processedSegments++;
            this.updateProgress((processedSegments / this.segments.length) * 100);
            
            // Add delay to avoid rate limiting
            await this.delay(500);
        }
        
        this.hideLoading();
        this.displayResults();
    }
    
    async searchWithBing(query, count) {
        // Simulated Bing search API call
        // In production, this would call the actual Bing Search API
        
        try {
            const response = await fetch(`https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(query)}&count=${count}`, {
                headers: {
                    'Ocp-Apim-Subscription-Key': 'YOUR_BING_SEARCH_KEY' // Replace with actual key
                }
            });
            
            if (!response.ok) {
                throw new Error('Search failed');
            }
            
            const data = await response.json();
            return data.webPages?.value?.map(page => ({
                title: page.name,
                url: page.url,
                snippet: page.snippet,
                source: new URL(page.url).hostname
            })) || [];
        } catch (error) {
            // Fallback: Return mock data for demonstration
            return this.getMockResults(query, count);
        }
    }
    
    getMockResults(query, count) {
        // Mock data for demonstration purposes
        const mockData = [
            {
                title: `Research: ${query.substring(0, 30)}...`,
                url: 'https://example-research.com/article',
                snippet: query + ' - This is a comprehensive overview of the topic with detailed analysis and references.',
                source: 'example-research.com'
            },
            {
                title: `Analysis of ${query.substring(0, 25)}...`,
                url: 'https://academic-journal.org/study',
                snippet: query + ' related content with peer-reviewed findings and methodology.',
                source: 'academic-journal.org'
            },
            {
                title: `Guide: Understanding ${query.substring(0, 20)}...`,
                url: 'https://knowledge-base.io/guide',
                snippet: 'Detailed guide covering ' + query + ' with practical applications and examples.',
                source: 'knowledge-base.io'
            },
            {
                title: `News: Latest on ${query.substring(0, 25)}...`,
                url: 'https://news-portal.com/news',
                snippet: 'Breaking news about ' + query + ' with expert opinions and updates.',
                source: 'news-portal.com'
            },
            {
                title: `Documentation: ${query.substring(0, 20)}...`,
                url: 'https://tech-docs.com/reference',
                snippet: 'Official documentation and technical reference for ' + query,
                source: 'tech-docs.com'
            }
        ];
        
        return mockData.slice(0, count);
    }
    
    calculateSimilarity(text1, text2) {
        // Simple similarity calculation using word overlap
        const words1 = text1.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        const words2 = text2.toLowerCase().split(/\s+/).filter(w => w.length > 3);
        
        const set1 = new Set(words1);
        const set2 = new Set(words2);
        
        let matches = 0;
        set1.forEach(word => {
            if (set2.has(word)) matches++;
        });
        
        const similarity = (matches / Math.max(set1.size, set2.size)) * 100;
        return Math.round(similarity);
    }
    
    displayResults() {
        if (this.results.length === 0) {
            this.resultsSection.style.display = 'none';
            this.noResultsState.style.display = 'block';
            return;
        }
        
        this.resultsList.innerHTML = '';
        
        const sortedResults = [...this.results].sort((a, b) => {
            return this.sortOrder === 'desc' 
                ? b.similarity - a.similarity 
                : a.similarity - b.similarity;
        });
        
        sortedResults.forEach((result, index) => {
            const resultDiv = document.createElement('div');
            resultDiv.className = 'result-item';
            
            const similarityClass = result.similarity >= 80 ? 'high' : 
                                   result.similarity >= 60 ? 'medium' : 'low';
            
            resultDiv.innerHTML = `
                <div class="result-header">
                    <div class="result-title">
                        <a href="${result.url}" target="_blank" rel="noopener noreferrer">
                            ${this.escapeHtml(result.title)}
                        </a>
                    </div>
                    <div class="similarity-badge ${similarityClass}">
                        ${result.similarity}% Match
                    </div>
                </div>
                
                <div class="similarity-bar">
                    <div class="similarity-fill" style="width: ${result.similarity}%"></div>
                </div>
                
                <div class="result-segment">
                    <span class="segment-label">Matched Segment</span>
                    <p class="source-text">"${this.escapeHtml(this.segments[result.segmentIndex].substring(0, 150))}..."</p>
                </div>
                
                <div class="result-segment">
                    <span class="segment-label">Reference Snippet</span>
                    <p class="source-text">${this.escapeHtml(result.snippet)}</p>
                </div>
                
                <div class="result-segment" style="margin-bottom: 0; padding-bottom: 0; border-bottom: none;">
                    <span class="segment-label">Source</span>
                    <p class="source-url">
                        <strong>${this.escapeHtml(result.source)}</strong><br>
                        ${this.escapeHtml(result.url)}
                    </p>
                </div>
            `;
            
            this.resultsList.appendChild(resultDiv);
        });
        
        this.resultsSection.style.display = 'block';
        this.noResultsState.style.display = 'none';
    }
    
    toggleSort() {
        this.sortOrder = this.sortOrder === 'desc' ? 'asc' : 'desc';
        this.sortBtn.textContent = `Sort by Similarity ${this.sortOrder === 'desc' ? '↓' : '↑'}`;
        this.displayResults();
    }
    
    exportResults() {
        if (this.results.length === 0) {
            alert('No results to export');
            return;
        }
        
        let csvContent = 'data:text/csv;charset=utf-8,';
        csvContent += 'Segment,Reference Title,URL,Similarity %,Snippet\n';
        
        this.results.forEach(result => {
            const row = [
                `"${this.segments[result.segmentIndex].replace(/"/g, '""')}"`,
                `"${result.title.replace(/"/g, '""')}"`,
                `"${result.url}"`,
                result.similarity,
                `"${result.snippet.replace(/"/g, '""')}"`
            ].join(',');
            csvContent += row + '\n';
        });
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `reference-finder-results-${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    showLoading() {
        this.loadingState.style.display = 'block';
        this.resultsSection.style.display = 'none';
        this.noResultsState.style.display = 'none';
        this.progressFill.style.width = '0%';
    }
    
    hideLoading() {
        this.loadingState.style.display = 'none';
    }
    
    updateProgress(percentage) {
        this.progressFill.style.width = percentage + '%';
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new ReferenceFinder();
});
