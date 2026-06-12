// Translation endpoints configuration
const PROVIDERS = {
    groq: {
        name: 'Groq',
        endpoint: 'https://api.groq.com/openai/v1/chat/completions',
        model: 'mixtral-8x7b-32768',
        header: 'Authorization',
        prefix: 'Bearer '
    },
    openai: {
        name: 'OpenAI',
        endpoint: 'https://api.openai.com/v1/chat/completions',
        model: 'gpt-3.5-turbo',
        header: 'Authorization',
        prefix: 'Bearer '
    },
    cohere: {
        name: 'Cohere',
        endpoint: 'https://api.cohere.ai/v1/chat',
        model: 'command',
        header: 'Authorization',
        prefix: 'Bearer '
    },
    huggingface: {
        name: 'HuggingFace',
        endpoint: 'https://api-inference.huggingface.co/v1/chat/completions',
        model: 'mistralai/Mistral-7B-Instruct-v0.2',
        header: 'Authorization',
        prefix: 'Bearer '
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('mode').addEventListener('change', toggleReferenceMode);
    toggleReferenceMode();
});

function toggleReferenceMode() {
    const mode = document.getElementById('mode').value;
    const refSection = document.getElementById('referenceSection');
    if (mode === 'reference') {
        refSection.classList.remove('hidden');
    } else {
        refSection.classList.add('hidden');
    }
}

function showStatus(message, type) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = 'status show ' + type;
    
    if (type !== 'loading') {
        setTimeout(() => {
            status.classList.remove('show');
        }, 4000);
    }
}

async function doTranslate() {
    const provider = document.getElementById('provider').value;
    const apiKey = document.getElementById('apiKey').value.trim();
    const sourceText = document.getElementById('sourceText').value.trim();
    const language = document.getElementById('language').value;
    const mode = document.getElementById('mode').value;

    // Validation
    if (!apiKey) {
        showStatus('❌ Please enter your API key', 'error');
        return;
    }

    if (!sourceText) {
        showStatus('❌ Please enter text to translate', 'error');
        return;
    }

    if (mode === 'reference') {
        const refOriginal = document.getElementById('refOriginal').value.trim();
        const refTranslation = document.getElementById('refTranslation').value.trim();
        if (!refOriginal || !refTranslation) {
            showStatus('❌ Please provide both reference texts', 'error');
            return;
        }
    }

    const btn = document.getElementById('translateBtn');
    btn.disabled = true;
    showStatus('⏳ Translating...', 'loading');

    try {
        let result;

        if (mode === 'reference') {
            const refOriginal = document.getElementById('refOriginal').value.trim();
            const refTranslation = document.getElementById('refTranslation').value.trim();
            result = await translateWithReference(provider, apiKey, sourceText, language, refOriginal, refTranslation);
        } else {
            result = await translateDirect(provider, apiKey, sourceText, language);
        }

        document.getElementById('resultText').value = result;
        showStatus('✅ Translation complete!', 'success');
    } catch (error) {
        console.error('Translation error:', error);
        showStatus('❌ Error: ' + error.message, 'error');
    } finally {
        btn.disabled = false;
    }
}

async function translateDirect(provider, apiKey, text, language) {
    const config = PROVIDERS[provider];
    const prompt = `You are a professional translator. Translate the following text to ${language}. Return ONLY the translated text, nothing else.\n\nText to translate:\n${text}`;

    if (provider === 'cohere') {
        return await callCohere(apiKey, prompt);
    } else {
        return await callOpenAICompatible(config, apiKey, prompt);
    }
}

async function translateWithReference(provider, apiKey, text, language, refOriginal, refTranslation) {
    const config = PROVIDERS[provider];
    const prompt = `You are a professional translator. Study this translation reference:

Original: "${refOriginal}"
Translation: "${refTranslation}"

Now apply the same style and terminology to translate this text to ${language}:
"${text}"

Return ONLY the translated text, nothing else.`;

    if (provider === 'cohere') {
        return await callCohere(apiKey, prompt);
    } else {
        return await callOpenAICompatible(config, apiKey, prompt);
    }
}

async function callOpenAICompatible(config, apiKey, prompt) {
    const response = await fetch(config.endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            [config.header]: config.prefix + apiKey
        },
        body: JSON.stringify({
            model: config.model,
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.3,
            max_tokens: 2000
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content?.trim() || '';
}

async function callCohere(apiKey, prompt) {
    const response = await fetch('https://api.cohere.ai/v1/chat', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey
        },
        body: JSON.stringify({
            message: prompt,
            model: 'command',
            temperature: 0.3
        })
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.text?.trim() || '';
}

function copyResult() {
    const resultText = document.getElementById('resultText').value;
    if (!resultText) {
        showStatus('❌ No translation to copy', 'error');
        return;
    }
    navigator.clipboard.writeText(resultText);
    showStatus('✅ Copied to clipboard!', 'success');
}

function clearAll() {
    document.getElementById('sourceText').value = '';
    document.getElementById('resultText').value = '';
    document.getElementById('refOriginal').value = '';
    document.getElementById('refTranslation').value = '';
    showStatus('🗑️ Cleared all fields', 'success');
}