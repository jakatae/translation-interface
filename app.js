// CORS Proxy for handling cross-origin requests
const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';

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
        endpoint: 'https://api.cohere.ai/v1/generate',
        model: 'command',
        header: 'Authorization',
        prefix: 'Bearer '
    },
    huggingface: {
        name: 'HuggingFace',
        endpoint: 'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2',
        model: 'mistralai/Mistral-7B-Instruct-v0.2',
        header: 'Authorization',
        prefix: 'Bearer '
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const modeSelect = document.getElementById('mode');
    if (modeSelect) {
        modeSelect.addEventListener('change', toggleReferenceMode);
        toggleReferenceMode();
    }
});

function toggleReferenceMode() {
    const mode = document.getElementById('mode')?.value;
    const refSection = document.getElementById('referenceSection');
    if (refSection) {
        if (mode === 'reference') {
            refSection.classList.remove('hidden');
        } else {
            refSection.classList.add('hidden');
        }
    }
}

function showStatus(message, type) {
    const status = document.getElementById('status');
    if (!status) return;
    
    status.textContent = message;
    status.className = 'status show ' + type;
    
    if (type !== 'loading') {
        setTimeout(() => {
            status.classList.remove('show');
        }, 4000);
    }
}

async function doTranslate() {
    const provider = document.getElementById('provider')?.value;
    const apiKey = document.getElementById('apiKey')?.value?.trim();
    const sourceText = document.getElementById('sourceText')?.value?.trim();
    const language = document.getElementById('language')?.value;
    const mode = document.getElementById('mode')?.value;

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
        const refOriginal = document.getElementById('refOriginal')?.value?.trim();
        const refTranslation = document.getElementById('refTranslation')?.value?.trim();
        if (!refOriginal || !refTranslation) {
            showStatus('❌ Please provide both reference texts', 'error');
            return;
        }
    }

    const btn = document.getElementById('translateBtn');
    if (btn) btn.disabled = true;
    showStatus('⏳ Translating...', 'loading');

    try {
        let result;

        if (mode === 'reference') {
            const refOriginal = document.getElementById('refOriginal')?.value?.trim();
            const refTranslation = document.getElementById('refTranslation')?.value?.trim();
            result = await translateWithReference(provider, apiKey, sourceText, language, refOriginal, refTranslation);
        } else {
            result = await translateDirect(provider, apiKey, sourceText, language);
        }

        if (!result) {
            throw new Error('No translation received from API. Please check your API key and try again.');
        }

        const resultText = document.getElementById('resultText');
        if (resultText) resultText.value = result;
        
        showStatus('✅ Translation complete!', 'success');
    } catch (error) {
        console.error('Translation error:', error);
        showStatus('❌ Error: ' + (error.message || 'Unknown error occurred'), 'error');
    } finally {
        if (btn) btn.disabled = false;
    }
}

async function translateDirect(provider, apiKey, text, language) {
    const config = PROVIDERS[provider];
    if (!config) {
        throw new Error(`Provider ${provider} not found`);
    }

    const prompt = `You are a professional translator. Translate the following text to ${language}. Return ONLY the translated text, nothing else.\n\nText to translate:\n${text}`;

    if (provider === 'cohere') {
        return await callCohere(apiKey, prompt);
    } else if (provider === 'huggingface') {
        return await callHuggingFace(apiKey, prompt);
    } else {
        return await callOpenAICompatible(config, apiKey, prompt);
    }
}

async function translateWithReference(provider, apiKey, text, language, refOriginal, refTranslation) {
    const config = PROVIDERS[provider];
    if (!config) {
        throw new Error(`Provider ${provider} not found`);
    }

    const prompt = `You are a professional translator. Study this translation reference:

Original: "${refOriginal}"
Translation: "${refTranslation}"

Now apply the same style and terminology to translate this text to ${language}:
"${text}"

Return ONLY the translated text, nothing else.`;

    if (provider === 'cohere') {
        return await callCohere(apiKey, prompt);
    } else if (provider === 'huggingface') {
        return await callHuggingFace(apiKey, prompt);
    } else {
        return await callOpenAICompatible(config, apiKey, prompt);
    }
}

async function callOpenAICompatible(config, apiKey, prompt) {
    try {
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
                        role: 'system',
                        content: 'You are a professional translator. Respond with only the translated text.'
                    },
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
            let errorMessage = `API Error: ${response.status}`;
            try {
                const error = await response.json();
                errorMessage = error.error?.message || error.message || errorMessage;
            } catch (e) {
                const text = await response.text();
                if (text) errorMessage = text;
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        const result = data.choices?.[0]?.message?.content?.trim();
        
        if (!result) {
            throw new Error('Empty response from API');
        }
        
        return result;
    } catch (error) {
        throw new Error(`${config.name} Error: ${error.message}`);
    }
}

async function callCohere(apiKey, prompt) {
    try {
        const response = await fetch('https://api.cohere.ai/v1/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKey
            },
            body: JSON.stringify({
                model: 'command',
                prompt: prompt,
                max_tokens: 2000,
                temperature: 0.3
            })
        });

        if (!response.ok) {
            let errorMessage = `API Error: ${response.status}`;
            try {
                const error = await response.json();
                errorMessage = error.message || errorMessage;
            } catch (e) {
                const text = await response.text();
                if (text) errorMessage = text;
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        const result = data.generations?.[0]?.text?.trim();
        
        if (!result) {
            throw new Error('Empty response from Cohere API');
        }
        
        return result;
    } catch (error) {
        throw new Error(`Cohere Error: ${error.message}`);
    }
}

async function callHuggingFace(apiKey, prompt) {
    try {
        const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKey
            },
            body: JSON.stringify({
                inputs: prompt,
                parameters: {
                    max_length: 2000,
                    temperature: 0.3
                }
            })
        });

        if (!response.ok) {
            let errorMessage = `API Error: ${response.status}`;
            try {
                const error = await response.json();
                errorMessage = error.error || error.message || errorMessage;
            } catch (e) {
                const text = await response.text();
                if (text) errorMessage = text;
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        const result = Array.isArray(data) 
            ? data[0]?.generated_text?.trim() 
            : data.generated_text?.trim();
        
        if (!result) {
            throw new Error('Empty response from HuggingFace API');
        }
        
        return result;
    } catch (error) {
        throw new Error(`HuggingFace Error: ${error.message}`);
    }
}

function copyResult() {
    const resultText = document.getElementById('resultText')?.value;
    if (!resultText) {
        showStatus('❌ No translation to copy', 'error');
        return;
    }
    navigator.clipboard.writeText(resultText).then(() => {
        showStatus('✅ Copied to clipboard!', 'success');
    }).catch(err => {
        showStatus('❌ Failed to copy: ' + err.message, 'error');
    });
}

function clearAll() {
    const fields = ['sourceText', 'resultText', 'refOriginal', 'refTranslation'];
    fields.forEach(id => {
        const field = document.getElementById(id);
        if (field) field.value = '';
    });
    showStatus('🗑️ Cleared all fields', 'success');
}
