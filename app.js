// Translation endpoints configuration - 15 AI providers
const PROVIDERS = {
    deepseek: {
        name: 'DeepSeek',
        endpoint: 'https://api.deepseek.com/chat/completions',
        model: 'deepseek-chat',
        header: 'Authorization',
        prefix: 'Bearer '
    },
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
    },
    anthropic: {
        name: 'Claude (Anthropic)',
        endpoint: 'https://api.anthropic.com/v1/messages',
        model: 'claude-3-5-sonnet-20241022',
        header: 'x-api-key',
        prefix: ''
    },
    mistral: {
        name: 'Mistral',
        endpoint: 'https://api.mistral.ai/v1/chat/completions',
        model: 'mistral-small-latest',
        header: 'Authorization',
        prefix: 'Bearer '
    },
    together: {
        name: 'Together AI',
        endpoint: 'https://api.together.xyz/v1/chat/completions',
        model: 'meta-llama/Llama-3-70b-chat-hf',
        header: 'Authorization',
        prefix: 'Bearer '
    },
    perplexity: {
        name: 'Perplexity',
        endpoint: 'https://api.perplexity.ai/chat/completions',
        model: 'llama-3.1-sonar-small-128k-online',
        header: 'Authorization',
        prefix: 'Bearer '
    },
    aliyun: {
        name: 'Aliyun Qwen',
        endpoint: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
        model: 'qwen-turbo',
        header: 'Authorization',
        prefix: 'Bearer '
    },
    baidu: {
        name: 'Baidu Ernie',
        endpoint: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions',
        model: 'ernie-4.0-turbo-8k',
        header: 'Authorization',
        prefix: 'Bearer '
    },
    google: {
        name: 'Google Gemini',
        endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
        model: 'gemini-pro',
        header: 'x-goog-api-key',
        prefix: ''
    },
    ollama: {
        name: 'Ollama (Local)',
        endpoint: 'http://localhost:11434/api/chat',
        model: 'neural-chat',
        header: 'Authorization',
        prefix: 'Bearer '
    },
    replicate: {
        name: 'Replicate',
        endpoint: 'https://api.replicate.com/v1/predictions',
        model: 'meta/llama-2-70b-chat',
        header: 'Authorization',
        prefix: 'Token '
    },
    fireworks: {
        name: 'Fireworks AI',
        endpoint: 'https://api.fireworks.ai/inference/v1/chat/completions',
        model: 'accounts/fireworks/models/llama-v2-70b-chat',
        header: 'Authorization',
        prefix: 'Bearer '
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCharCounts();
    
    // Add real-time char count updates
    const zones = ['zoneA', 'zoneAp', 'zoneB', 'zoneBp'];
    zones.forEach(id => {
        const elem = document.getElementById(id);
        if (elem) {
            elem.addEventListener('input', updateCharCounts);
        }
    });

    // Keyboard shortcut: Ctrl+Enter to translate
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            doTranslate();
        }
    });
});

function updateCharCounts() {
    const zones = ['zoneA', 'zoneAp', 'zoneB', 'zoneBp'];
    zones.forEach(id => {
        const elem = document.getElementById(id);
        const countElem = document.getElementById('count' + id.substring(4).toUpperCase());
        if (elem && countElem) {
            const length = elem.value.length;
            countElem.textContent = length + ' ' + (length === 1 ? 'char' : 'chars');
        }
    });
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
    console.log('Translate button clicked');
    
    const provider = document.getElementById('provider')?.value;
    const apiKey = document.getElementById('apiKey')?.value?.trim();
    const zoneA = document.getElementById('zoneA')?.value?.trim();
    const zoneAp = document.getElementById('zoneAp')?.value?.trim();
    const zoneB = document.getElementById('zoneB')?.value?.trim();
    const language = document.getElementById('language')?.value;

    // Validation
    if (!apiKey) {
        showStatus('❌ Please enter your API key', 'error');
        return;
    }

    if (!zoneB) {
        showStatus('❌ Please enter text to translate in Zone B', 'error');
        return;
    }

    if (!provider || !language) {
        showStatus('❌ Please select provider and language', 'error');
        return;
    }

    const btn = document.getElementById('translateBtn');
    if (btn) btn.disabled = true;
    showStatus('⏳ Translating...', 'loading');

    try {
        let result;

        // Auto-detect if reference texts are provided
        if (zoneA && zoneAp) {
            console.log('Using reference mode');
            result = await translateWithReference(provider, apiKey, zoneB, language, zoneA, zoneAp);
        } else {
            console.log('Using direct mode');
            result = await translateDirect(provider, apiKey, zoneB, language);
        }

        if (!result) {
            throw new Error('No translation received from API. Please check your API key and try again.');
        }

        const resultZone = document.getElementById('zoneBp');
        if (resultZone) {
            resultZone.value = result;
            updateCharCounts();
        }
        
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
    } else if (provider === 'anthropic') {
        return await callAnthropic(apiKey, prompt);
    } else if (provider === 'google') {
        return await callGoogle(apiKey, prompt);
    } else if (provider === 'aliyun') {
        return await callAliyun(apiKey, prompt);
    } else if (provider === 'baidu') {
        return await callBaidu(apiKey, prompt);
    } else if (provider === 'ollama') {
        return await callOllama(apiKey, prompt);
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
    } else if (provider === 'anthropic') {
        return await callAnthropic(apiKey, prompt);
    } else if (provider === 'google') {
        return await callGoogle(apiKey, prompt);
    } else if (provider === 'aliyun') {
        return await callAliyun(apiKey, prompt);
    } else if (provider === 'baidu') {
        return await callBaidu(apiKey, prompt);
    } else if (provider === 'ollama') {
        return await callOllama(apiKey, prompt);
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

async function callAnthropic(apiKey, prompt) {
    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-3-5-sonnet-20241022',
                max_tokens: 2000,
                messages: [
                    { role: 'user', content: prompt }
                ]
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
        const result = data.content?.[0]?.text?.trim();
        
        if (!result) {
            throw new Error('Empty response from Anthropic API');
        }
        
        return result;
    } catch (error) {
        throw new Error(`Claude Error: ${error.message}`);
    }
}

async function callGoogle(apiKey, prompt) {
    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
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
        const result = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        
        if (!result) {
            throw new Error('Empty response from Google API');
        }
        
        return result;
    } catch (error) {
        throw new Error(`Google Error: ${error.message}`);
    }
}

async function callAliyun(apiKey, prompt) {
    try {
        const response = await fetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + apiKey
            },
            body: JSON.stringify({
                model: 'qwen-turbo',
                input: { messages: [{ role: 'user', content: prompt }] },
                parameters: { temperature: 0.3 }
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
        const result = data.output?.text?.trim();
        
        if (!result) {
            throw new Error('Empty response from Aliyun API');
        }
        
        return result;
    } catch (error) {
        throw new Error(`Aliyun Error: ${error.message}`);
    }
}

async function callBaidu(apiKey, prompt) {
    try {
        const response = await fetch('https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop/chat/completions?access_token=' + apiKey, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.3
            })
        });

        if (!response.ok) {
            let errorMessage = `API Error: ${response.status}`;
            try {
                const error = await response.json();
                errorMessage = error.error_description || error.message || errorMessage;
            } catch (e) {
                const text = await response.text();
                if (text) errorMessage = text;
            }
            throw new Error(errorMessage);
        }

        const data = await response.json();
        const result = data.result?.message?.trim();
        
        if (!result) {
            throw new Error('Empty response from Baidu API');
        }
        
        return result;
    } catch (error) {
        throw new Error(`Baidu Error: ${error.message}`);
    }
}

async function callOllama(apiKey, prompt) {
    try {
        const response = await fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'neural-chat',
                messages: [
                    { role: 'user', content: prompt }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`Ollama API Error: ${response.status}`);
        }

        const data = await response.json();
        const result = data.message?.content?.trim();
        
        if (!result) {
            throw new Error('Empty response from Ollama API');
        }
        
        return result;
    } catch (error) {
        throw new Error(`Ollama Error: ${error.message}`);
    }
}

function copyZone(zoneId) {
    const zone = document.getElementById(zoneId);
    if (!zone || !zone.value) {
        showStatus('❌ Nothing to copy', 'error');
        return;
    }
    navigator.clipboard.writeText(zone.value).then(() => {
        showStatus('✅ Copied to clipboard!', 'success');
    }).catch(err => {
        showStatus('❌ Failed to copy: ' + err.message, 'error');
    });
}

function clearAll() {
    const zones = ['zoneA', 'zoneAp', 'zoneB', 'zoneBp'];
    zones.forEach(id => {
        const zone = document.getElementById(id);
        if (zone) zone.value = '';
    });
    updateCharCounts();
    showStatus('🗑️ Cleared all fields', 'success');
}