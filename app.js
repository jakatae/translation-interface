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
        authPrefix: ''
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
    history: []
};

document.addEventListener('DOMContentLoaded', init);

function init() {
    loadState();
    setupProviders();
    setupCounters();
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

function setupCounters() {
    ['zoneA', 'zoneAp', 'zoneB', 'zoneBp'].forEach(id => {
        document.getElementById(id).addEventListener('input', () => {
            const count = document.getElementById(id).value.length;
            document.getElementById('count' + id.replace('zone', '')).textContent = count;
        });
    });
}

function copy(id) {
    const text = document.getElementById(id).value;
    navigator.clipboard.writeText(text);
    showStatus('Copied', 'success', 1500);
}

function clear() {
    document.getElementById('zoneA').value = '';
    document.getElementById('zoneAp').value = '';
    document.getElementById('zoneB').value = '';
    document.getElementById('zoneBp').value = '';
    ['A', 'Ap', 'B', 'Bp'].forEach(x => document.getElementById('count' + x).textContent = '0');
}

async function translate() {
    const a = document.getElementById('zoneA').value.trim();
    const ap = document.getElementById('zoneAp').value.trim();
    const b = document.getElementById('zoneB').value.trim();
    const apiKey = document.getElementById('apiKey').value.trim();
    const lang = document.getElementById('language').value;
    const temp = parseFloat(document.getElementById('temperature').value);
    const provider = state.provider;

    if (!a || !ap || !b) {
        showStatus('Fill all zones', 'error');
        return;
    }

    if (!apiKey && !PROVIDERS[provider].local) {
        showStatus('Enter API key', 'error');
        return;
    }

    const translateBtn = document.querySelector('.btn-primary');
    translateBtn.disabled = true;
    showStatus('Translating...', 'loading');

    try {
        const prompt = `Analyze this translation style:
SOURCE: "${a}"
TRANSLATION: "${ap}"

Apply the same style and terminology to translate:
"${b}"

Return ONLY the translation in ${lang}. Nothing else.`;

        let result;
        const providerConfig = PROVIDERS[provider];

        if (provider === 'anthropic') {
            result = await callAnthropic(prompt, temp, apiKey);
        } else if (provider === 'ollama') {
            result = await callOllama(prompt, temp);
        } else {
            result = await callOpenAICompatible(prompt, temp, apiKey, providerConfig);
        }

        document.getElementById('zoneBp').value = result;
        document.getElementById('countBp').textContent = result.length;
        showStatus('Done', 'success', 2000);

        if (document.getElementById('autoSave').checked) {
            saveToHistory({ a, ap, b, result, lang, provider });
        }
    } catch (e) {
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

    if (!res.ok) throw new Error(await res.text());
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

    if (!res.ok) throw new Error(await res.text());
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
    if (saved) state = { ...state, ...JSON.parse(saved) };
}

function saveToHistory(item) {
    state.history.unshift({ ...item, time: new Date().toISOString() });
    state.history.splice(50);
    saveState();
}

function loadHistory() {
    // History loaded from state
}