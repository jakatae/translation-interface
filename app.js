const PROVIDERS = {
    groq: {
        name: '⚡ Groq (Free)',
        models: [
            { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B' },
            { id: 'llama-3-70b-8192', name: 'Llama 3 70B' },
            { id: 'llama-3-8b-8192', name: 'Llama 3 8B' }
        ],
        endpoint: 'https://api.groq.com/openai/v1/chat/completions',
        authHeader: 'Authorization',
        authPrefix: 'Bearer '
    },
    together: {
        name: '🔥 Together AI (Free)',
        models: [
            { id: 'meta-llama/Llama-3-70b-chat-hf', name: 'Llama 3 70B' },
            { id: 'mistralai/Mistral-7B-Instruct-v0.2', name: 'Mistral 7B' },
            { id: 'mistralai/Mixtral-8x7B-Instruct-v0.1', name: 'Mixtral 8x7B' }
        ],
        endpoint: 'https://api.together.xyz/v1/chat/completions',
        authHeader: 'Authorization',
        authPrefix: 'Bearer '
    },
    openai: {
        name: '🤖 OpenAI',
        models: [
            { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
            { id: 'gpt-4', name: 'GPT-4' },
            { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' }
        ],
        endpoint: 'https://api.openai.com/v1/chat/completions',
        authHeader: 'Authorization',
        authPrefix: 'Bearer '
    },
    anthropic: {
        name: '🧠 Claude',
        models: [
            { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' },
            { id: 'claude-3-opus-20250219', name: 'Claude 3 Opus' },
            { id: 'claude-3-haiku-20250307', name: 'Claude 3 Haiku' }
        ],
        endpoint: 'https://api.anthropic.com/v1/messages',
        authHeader: 'x-api-key',
        authPrefix: '',
        anthropic: true
    },
    cohere: {
        name: '✨ Cohere',
        models: [
            { id: 'command-r-plus', name: 'Command R+' },
            { id: 'command-r', name: 'Command R' }
        ],
        endpoint: 'https://api.cohere.ai/v1/chat',
        authHeader: 'Authorization',
        authPrefix: 'Bearer '
    },
    mistral: {
        name: '🌟 Mistral AI',
        models: [
            { id: 'mistral-large-latest', name: 'Mistral Large' },
            { id: 'mistral-medium-latest', name: 'Mistral Medium' }
        ],
        endpoint: 'https://api.mistral.ai/v1/chat/completions',
        authHeader: 'Authorization',
        authPrefix: 'Bearer '
    },
    deepseek: {
        name: '🧠 DeepSeek (Free)',
        models: [
            { id: 'deepseek-chat', name: 'DeepSeek Chat' },
            { id: 'deepseek-coder', name: 'DeepSeek Coder' }
        ],
        endpoint: 'https://api.deepseek.com/chat/completions',
        authHeader: 'Authorization',
        authPrefix: 'Bearer '
    },
    xai: {
        name: '🚀 xAI Grok (Free)',
        models: [
            { id: 'grok-beta', name: 'Grok Beta' }
        ],
        endpoint: 'https://api.x.ai/v1/chat/completions',
        authHeader: 'Authorization',
        authPrefix: 'Bearer '
    },
    perplexity: {
        name: '🔍 Perplexity (Free)',
        models: [
            { id: 'pplx-70b-online', name: 'Perplexity 70B' },
            { id: 'pplx-7b-online', name: 'Perplexity 7B' }
        ],
        endpoint: 'https://api.perplexity.ai/chat/completions',
        authHeader: 'Authorization',
        authPrefix: 'Bearer '
    },
    huggingface: {
        name: '🤗 Hugging Face (Free)',
        models: [
            { id: 'mistralai/Mixtral-8x7B-Instruct-v0.1', name: 'Mixtral 8x7B' },
            { id: 'meta-llama/Llama-2-7b-chat-hf', name: 'Llama 2 7B' }
        ],
        endpoint: 'https://api-inference.huggingface.co/v1/chat/completions',
        authHeader: 'Authorization',
        authPrefix: 'Bearer '
    },
    replicate: {
        name: '🎬 Replicate (Free)',
        models: [
            { id: 'meta/llama-2-70b-chat', name: 'Llama 2 70B' }
        ],
        endpoint: 'https://api.replicate.com/v1/predictions',
        authHeader: 'Authorization',
        authPrefix: 'Bearer '
    },
    ollama: {
        name: '🦙 Ollama (Local)',
        models: [
            { id: 'llama2', name: 'Llama 2' },
            { id: 'mistral', name: 'Mistral' }
        ],
        endpoint: 'http://localhost:11434/api/generate',
        local: true
    }
};

let state = {
    provider: 'groq',
    model: 'mixtral-8x7b-32768',
    mode: 'reference',
    history: []
};

document.addEventListener('DOMContentLoaded', init);

function init() {
    loadState();
    setupProviders();
    setupCounters();
    setupModeToggle();
    loadHistory();
}

function setupProviders() {
    const providerSelect = document.getElementById('provider');
    Object.entries(PROVIDERS).forEach(([key, provider]) => {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = provider.name;
        providerSelect.appendChild(opt);
    });
    providerSelect.value = state.provider;
    providerSelect.addEventListener('change', onProviderChange);
    updateModels();
}

function onProviderChange() {
    state.provider = document.getElementById('provider').value;
    updateModels();
    saveState();
}

function updateModels() {
    const provider = PROVIDERS[state.provider];
    if (!provider) return;
    const modelSelect = document.getElementById('model');
    modelSelect.innerHTML = '';
    provider.models.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.id;
        opt.textContent = m.name;
        modelSelect.appendChild(opt);
    });
    state.model = provider.models[0].id;
    modelSelect.value = state.model;
}

function setupModeToggle() {
    const modeSelect = document.getElementById('mode');
    if (!modeSelect) return;
    modeSelect.addEventListener('change', (e) => {
        state.mode = e.target.value;
        updateUIForMode();
        saveState();
    });
    updateUIForMode();
}

function updateUIForMode() {
    const refContainer = document.getElementById('zoneA-container');
    const refContainer2 = document.getElementById('zoneAp-container');
    if (state.mode === 'direct') {
        if (refContainer) refContainer.style.display = 'none';
        if (refContainer2) refContainer2.style.display = 'none';
    } else {
        if (refContainer) refContainer.style.display = 'block';
        if (refContainer2) refContainer2.style.display = 'block';
    }
}

function setupCounters() {
    ['zoneA', 'zoneAp', 'zoneB', 'zoneBp'].forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', () => {
                const count = el.value.length;
                const countEl = document.getElementById('count' + id.replace('zone', ''));
                if (countEl) countEl.textContent = count;
            });
        }
    });
}

function copy(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const text = el.value;
    if (!text) return;
    navigator.clipboard.writeText(text);
    showStatus('Copied', 'success', 1500);
}

function clearAll() {
    const zones = ['zoneA', 'zoneAp', 'zoneB', 'zoneBp'];
    zones.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    ['A', 'Ap', 'B', 'Bp'].forEach(x => {
        const countEl = document.getElementById('count' + x);
        if (countEl) countEl.textContent = '0';
    });
}

async function translate() {
    const aEl = document.getElementById('zoneA');
    const apEl = document.getElementById('zoneAp');
    const bEl = document.getElementById('zoneB');
    const apiKeyEl = document.getElementById('apiKey');
    const langEl = document.getElementById('language');
    const tempEl = document.getElementById('temperature');
    const modeEl = document.getElementById('mode');

    if (!aEl || !apEl || !bEl || !apiKeyEl || !langEl || !tempEl) {
        console.error('Missing HTML elements');
        showStatus('UI Error', 'error');
        return;
    }

    const a = aEl.value.trim();
    const ap = apEl.value.trim();
    const b = bEl.value.trim();
    const apiKey = apiKeyEl.value.trim();
    const lang = langEl.value;
    const temp = parseFloat(tempEl.value);
    const provider = state.provider;
    const mode = modeEl ? modeEl.value : 'reference';

    if (mode === 'reference' && (!a || !ap || !b)) {
        showStatus('Fill all zones', 'error');
        return;
    }

    if (mode === 'direct' && !b) {
        showStatus('Fill Zone B', 'error');
        return;
    }

    if (!apiKey && !PROVIDERS[provider].local) {
        showStatus('Enter API key', 'error');
        return;
    }

    const translateBtn = document.getElementById('translateBtn');
    if (!translateBtn) {
        console.error('Missing translate button');
        return;
    }
    
    translateBtn.disabled = true;
    showStatus('Translating...', 'loading');

    try {
        let prompt;
        if (mode === 'reference') {
            prompt = `Analyze this translation style:\nSOURCE: "${a}"\nTRANSLATION: "${ap}"\n\nApply the same style and terminology to translate:\n"${b}"\n\nReturn ONLY the translation in ${lang}. Nothing else.`;
        } else {
            prompt = `Translate to ${lang}:\n"${b}"\n\nReturn ONLY the translation. Nothing else.`;
        }

        let result;
        const providerConfig = PROVIDERS[provider];

        if (!providerConfig) {
            throw new Error('Provider not found');
        }

        if (provider === 'anthropic') {
            result = await callAnthropic(prompt, temp, apiKey);
        } else if (provider === 'ollama') {
            result = await callOllama(prompt, temp);
        } else {
            result = await callOpenAICompatible(prompt, temp, apiKey, providerConfig);
        }

        const zoneBpEl = document.getElementById('zoneBp');
        if (zoneBpEl) {
            zoneBpEl.value = result;
            const countBpEl = document.getElementById('countBp');
            if (countBpEl) countBpEl.textContent = result.length;
        }
        
        showStatus('Done', 'success', 2000);

        if (document.getElementById('autoSave').checked) {
            saveToHistory({ a, ap, b, result, lang, provider, mode });
        }
    } catch (e) {
        console.error('Translation error:', e);
        showStatus('Error: ' + e.message, 'error');
    } finally {
        translateBtn.disabled = false;
    }
}

async function callOpenAICompatible(prompt, temp, key, config) {
    const res = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            [config.authHeader]: config.authPrefix + key
        },
        body: JSON.stringify({
            model: state.model,
            messages: [{ role: 'user', content: prompt }],
            temperature: temp,
            max_tokens: 2000
        })
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
    }
    const data = await res.json();
    return data.choices?.[0]?.message?.content?.trim() || data.text?.trim() || '';
}

async function callAnthropic(prompt, temp, key) {
    const res = await fetch(PROVIDERS.anthropic.endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': key,
            'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
            model: state.model,
            max_tokens: 2000,
            messages: [{ role: 'user', content: prompt }],
            temperature: temp
        })
    });

    if (!res.ok) {
        const err = await res.text();
        throw new Error(err);
    }
    const data = await res.json();
    return data.content?.[0]?.text?.trim() || '';
}

async function callOllama(prompt, temp) {
    const res = await fetch(PROVIDERS.ollama.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: state.model,
            prompt: prompt,
            temperature: temp,
            stream: false
        })
    });

    if (!res.ok) throw new Error('Ollama not running on localhost:11434');
    const data = await res.json();
    return data.response?.trim() || '';
}

function showStatus(msg, type, duration = 4000) {
    const el = document.getElementById('status');
    if (!el) return;
    el.textContent = msg;
    el.className = 'status show ' + type;
    if (type !== 'loading') {
        setTimeout(() => el.classList.remove('show'), duration);
    }
}

function saveState() {
    localStorage.setItem('tstate', JSON.stringify(state));
}

function loadState() {
    const saved = localStorage.getItem('tstate');
    if (saved) {
        try {
            state = { ...state, ...JSON.parse(saved) };
        } catch (e) {
            console.error('Error loading state:', e);
        }
    }
}

function saveToHistory(item) {
    state.history.unshift({ ...item, time: new Date().toISOString() });
    state.history.splice(50);
    saveState();
}

function loadHistory() {
    // History loaded from state
}