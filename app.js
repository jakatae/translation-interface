// State management
const state = {
    history: [],
    currentTranslation: null
};

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    loadSettings();
    loadHistory();
    setupEventListeners();
    setupCharCounters();
}

function setupEventListeners() {
    // Tab navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const tabName = e.target.dataset.tab;
            switchTab(tabName);
        });
    });

    // Auto-save settings
    document.getElementById('apiKey').addEventListener('change', saveSettings);
    document.getElementById('model').addEventListener('change', saveSettings);
    document.getElementById('temperature').addEventListener('change', saveSettings);
    document.getElementById('targetLanguage').addEventListener('change', saveSettings);
    document.getElementById('autoSave').addEventListener('change', saveSettings);

    // Keyboard shortcuts
    document.getElementById('zoneB').addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            translateZoneB();
        }
    });
}

function setupCharCounters() {
    const zones = ['zoneA', 'zoneAp', 'zoneB', 'zoneBp'];
    zones.forEach(zoneId => {
        const textarea = document.getElementById(zoneId);
        textarea.addEventListener('input', () => {
            updateCharCount(zoneId);
        });
    });
}

function updateCharCount(zoneId) {
    const textarea = document.getElementById(zoneId);
    const countId = 'count' + zoneId.replace('zone', '');
    const countElement = document.getElementById(countId);
    countElement.textContent = textarea.value.length;
}

function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active from all buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    document.getElementById(tabName + '-tab').classList.add('active');

    // Mark button as active
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    // Refresh history if needed
    if (tabName === 'history') {
        displayHistory();
    }
}

function showStatus(message, type = 'info', duration = 5000) {
    const statusEl = document.getElementById('statusMessage');
    statusEl.textContent = message;
    statusEl.className = `status-message show ${type}`;

    if (type !== 'loading') {
        setTimeout(() => statusEl.classList.remove('show'), duration);
    }
}

function showLoadingStatus(message) {
    const statusEl = document.getElementById('statusMessage');
    statusEl.innerHTML = `<span class="spinner"></span>${message}`;
    statusEl.className = 'status-message show loading';
}

async function translateZoneB() {
    const apiKey = document.getElementById('apiKey').value.trim();
    const zoneA = document.getElementById('zoneA').value.trim();
    const zoneAp = document.getElementById('zoneAp').value.trim();
    const zoneB = document.getElementById('zoneB').value.trim();
    const model = document.getElementById('model').value;
    const targetLanguage = document.getElementById('targetLanguage').value;
    const temperature = parseFloat(document.getElementById('temperature').value);

    // Validation
    if (!apiKey) {
        showStatus('❌ Please enter your OpenAI API Key in Settings', 'error');
        switchTab('settings');
        return;
    }
    if (!zoneA || !zoneAp || !zoneB) {
        showStatus('❌ Please fill in Zones A, A\', and B', 'error');
        return;
    }

    if (zoneA.length < 5 || zoneAp.length < 5 || zoneB.length < 5) {
        showStatus('⚠️ Text should be at least 5 characters for better results', 'info');
    }

    const translateBtn = document.getElementById('translateBtn');
    translateBtn.disabled = true;

    showLoadingStatus('Analyzing reference translation and generating B\'...');

    try {
        const systemPrompt = `You are a professional translator specializing in consistent terminology management.

Your task:
1. Analyze the reference translation pair (A → A') to understand:
   - Terminology and technical terms
   - Writing style and tone (formal, casual, technical, etc.)
   - Punctuation and formatting conventions
   - Sentence structure patterns
   - Idioms and cultural adaptations

2. Apply these EXACT patterns to translate B:
   - Use identical terminology for matching concepts
   - Maintain the same register and tone
   - Follow the same structural patterns
   - Preserve punctuation style
   - Keep consistent formatting

3. Quality checks:
   - Ensure naturalness while maintaining consistency
   - Preserve all proper nouns and numbers
   - Maintain sentence structure when applicable
   - Keep similar length and complexity

REFERENCE TRANSLATION (for learning style):
SOURCE (A): "${zoneA}"
TRANSLATION (A'): "${zoneAp}"

Now translate this using the same style and terminology:
NEW TEXT (B): "${zoneB}"

⚠️ OUTPUT RULE: Return ONLY the translation in ${targetLanguage}. No explanations, no quotes, no meta-commentary.`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: 'system',
                        content: systemPrompt
                    }
                ],
                temperature: temperature,
                max_tokens: 2000,
                top_p: 0.95
            })
        });

        if (!response.ok) {
            const error = await response.json();
            const errorMsg = error.error?.message || 'Unknown API error';
            throw new Error(errorMsg);
        }

        const data = await response.json();
        const translation = data.choices[0].message.content.trim();

        document.getElementById('zoneBp').value = translation;
        updateCharCount('zoneBp');

        // Save to history if enabled
        if (document.getElementById('autoSave').checked) {
            saveTranslationToHistory({
                timestamp: new Date(),
                sourceA: zoneA,
                translationAp: zoneAp,
                sourceB: zoneB,
                translationBp: translation,
                language: targetLanguage,
                model: model
            });
        }

        showStatus('✨ Translation generated successfully!', 'success');

    } catch (error) {
        console.error('Translation error:', error);
        if (error.message.includes('401')) {
            showStatus('❌ Invalid API Key. Check your settings.', 'error');
        } else if (error.message.includes('429')) {
            showStatus('❌ Rate limited. Please wait a moment.', 'error');
        } else if (error.message.includes('exceeded')) {
            showStatus('❌ Exceeded token limit. Try shorter text.', 'error');
        } else {
            showStatus(`❌ Error: ${error.message}`, 'error');
        }
    } finally {
        translateBtn.disabled = false;
    }
}

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    if (!element.value.trim()) {
        showStatus('❌ Nothing to copy', 'error');
        return;
    }
    navigator.clipboard.writeText(element.value).then(() => {
        showStatus('✅ Copied to clipboard', 'success', 2000);
    }).catch(() => {
        showStatus('❌ Failed to copy', 'error');
    });
}

function clearAllZones() {
    if (confirm('Clear all zones? This cannot be undone.')) {
        document.getElementById('zoneA').value = '';
        document.getElementById('zoneAp').value = '';
        document.getElementById('zoneB').value = '';
        document.getElementById('zoneBp').value = '';
        ['zoneA', 'zoneAp', 'zoneB', 'zoneBp'].forEach(zoneId => updateCharCount(zoneId));
        showStatus('🗑️ All zones cleared', 'info', 2000);
    }
}

function toggleApiKeyVisibility() {
    const input = document.getElementById('apiKey');
    const btn = event.target;
    if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = '🙈';
    } else {
        input.type = 'password';
        btn.textContent = '👁️';
    }
}

// Settings Management
function saveSettings() {
    const settings = {
        apiKey: document.getElementById('apiKey').value,
        model: document.getElementById('model').value,
        temperature: document.getElementById('temperature').value,
        targetLanguage: document.getElementById('targetLanguage').value,
        autoSave: document.getElementById('autoSave').checked
    };
    localStorage.setItem('translationSettings', JSON.stringify(settings));
}

function loadSettings() {
    const saved = localStorage.getItem('translationSettings');
    if (saved) {
        const settings = JSON.parse(saved);
        if (settings.apiKey) document.getElementById('apiKey').value = settings.apiKey;
        if (settings.model) document.getElementById('model').value = settings.model;
        if (settings.temperature) document.getElementById('temperature').value = settings.temperature;
        if (settings.targetLanguage) document.getElementById('targetLanguage').value = settings.targetLanguage;
        if (settings.autoSave !== undefined) document.getElementById('autoSave').checked = settings.autoSave;
    }
}

// History Management
function saveTranslationToHistory(translation) {
    const history = JSON.parse(localStorage.getItem('translationHistory') || '[]');
    history.unshift(translation);
    history.splice(50); // Keep only last 50
    localStorage.setItem('translationHistory', JSON.stringify(history));
    state.history = history;
}

function loadHistory() {
    const saved = localStorage.getItem('translationHistory');
    state.history = saved ? JSON.parse(saved) : [];
}

function displayHistory() {
    const container = document.getElementById('historyContainer');
    
    if (state.history.length === 0) {
        container.innerHTML = '<p class="empty-state">No translations yet. Start translating to see history!</p>';
        return;
    }

    container.innerHTML = state.history.map((item, index) => {
        const date = new Date(item.timestamp);
        const timeStr = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        return `
            <div class="history-item">
                <div class="history-item-time">📅 ${timeStr}</div>
                <div class="history-item-text">
                    <strong>B':</strong> ${item.translationBp.substring(0, 100)}${item.translationBp.length > 100 ? '...' : ''}
                </div>
                <div class="history-item-text">
                    <strong>Language:</strong> ${item.language} | <strong>Model:</strong> ${item.model}
                </div>
                <div class="history-item-actions">
                    <button class="btn-secondary" onclick="loadHistoryItem(${index})">📖 Load</button>
                    <button class="btn-secondary" onclick="copyHistoryItem(${index})">📋 Copy B'</button>
                </div>
            </div>
        `;
    }).join('');
}

function loadHistoryItem(index) {
    const item = state.history[index];
    document.getElementById('zoneA').value = item.sourceA;
    document.getElementById('zoneAp').value = item.translationAp;
    document.getElementById('zoneB').value = item.sourceB;
    document.getElementById('zoneBp').value = item.translationBp;
    ['zoneA', 'zoneAp', 'zoneB', 'zoneBp'].forEach(zoneId => updateCharCount(zoneId));
    switchTab('editor');
    showStatus('📖 History item loaded', 'success');
}

function copyHistoryItem(index) {
    const item = state.history[index];
    navigator.clipboard.writeText(item.translationBp).then(() => {
        showStatus('✅ Translation copied to clipboard', 'success', 2000);
    });
}

function clearHistory() {
    if (confirm('Clear all translation history? This cannot be undone.')) {
        localStorage.removeItem('translationHistory');
        state.history = [];
        displayHistory();
        showStatus('🗑️ History cleared', 'info');
    }
}

function downloadHistory() {
    if (state.history.length === 0) {
        showStatus('❌ No history to download', 'error');
        return;
    }

    const dataStr = JSON.stringify(state.history, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `translation-history-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showStatus('✅ History downloaded', 'success');
}