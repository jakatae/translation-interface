# 🔄 TranslateSync - AI Translation Update Interface

A modern, intelligent translation interface that learns from reference translations to generate consistent, high-quality translations for new content.

## ✨ Features

### Core Translation Engine
- **4-Zone Layout**: Work with source text (A), reference translation (A'), new text (B), and AI-generated translation (B')
- **Smart Learning**: AI analyzes your reference translation to understand terminology, style, and tone
- **Consistent Output**: Applies learned patterns to ensure translations match your reference style
- **Real-time Feedback**: See character counts and immediate validation

### Advanced Capabilities
- **Multi-Model Support**: Choose between GPT-4, GPT-4 Turbo, or GPT-3.5 Turbo
- **Configurable Temperature**: Adjust creativity level (0.0 = consistent, 1.0 = creative)
- **20+ Languages**: Support for European, Asian, and other languages
- **Auto-Save**: Optionally save all translations to local history
- **One-Click Copy**: Copy any zone content to clipboard instantly

### Organization & History
- **Translation History**: Keep track of all your translations (up to 50 recent)
- **Load Previous Work**: Quickly restore past translations
- **Export History**: Download your translation history as JSON
- **Persistent Settings**: API key and preferences saved locally

## 🚀 Quick Start

### 1. Setup
1. Get an OpenAI API key from [platform.openai.com](https://platform.openai.com/api-keys)
2. Open the application in your browser
3. Go to Settings and enter your API key

### 2. Basic Workflow
1. **Zone A**: Paste your original text (source language)
2. **Zone A'**: Provide your reference translation (exemplar)
3. **Zone B**: Enter the new text you want to translate
4. **Click Generate**: The AI analyzes A→A' pattern and applies it to B
5. **Zone B'**: Receive your AI-generated translation

### 3. Keyboard Shortcut
Press `Ctrl+Enter` (or `Cmd+Enter` on Mac) in Zone B to generate translation immediately.

## 🎯 Use Cases

### Documentation Translation
- Maintain consistent technical terminology
- Preserve formatting and structure
- Update docs while keeping translation style consistent

### Software Localization
- Learn from existing translations
- Ensure UI consistency across versions
- Speed up translation updates

### Content Management
- Translate website content
- Update product descriptions
- Maintain brand voice in translations

### Academic Translation
- Maintain consistent terminology in papers
- Preserve academic tone and style
- Handle multiple related documents

## ⚙️ Configuration Options

### API Configuration
- **API Key**: Your OpenAI API key (stored locally, never sent elsewhere)
- **Model Selection**: 
  - GPT-4 Turbo: Best quality and speed (recommended)
  - GPT-4: Highest quality, slowest
  - GPT-3.5 Turbo: Fast and cost-effective

### Translation Settings
- **Temperature**: 0.0-1.0 (lower = more consistent, higher = more creative)
- **Target Language**: Choose from 20+ languages
- **Auto-Save**: Toggle to automatically save translations to history

## 💾 Data & Privacy

- **Local Storage**: All your translations and settings are stored in your browser
- **No Server Storage**: We don't store your data on any server
- **API Key Security**: Your API key is stored locally and only sent to OpenAI
- **Export Anytime**: Download your history as JSON for backup

## 🔧 Technical Details

### How It Works
1. **Analysis Phase**: AI reads the reference pair (A→A') to extract:
   - Terminology mappings
   - Style and tone characteristics
   - Structural patterns
   - Punctuation conventions

2. **Application Phase**: AI applies learned patterns to translate B:
   - Uses identical terminology for matching concepts
   - Maintains same register and tone
   - Follows same structural patterns
   - Preserves formatting style

3. **Quality Check**: Ensures output is:
   - Natural-sounding in target language
   - Consistent with reference
   - Properly formatted
   - Appropriate length

### Technology Stack
- **Frontend**: Pure HTML, CSS, JavaScript (no dependencies)
- **AI**: OpenAI GPT-4 / GPT-3.5
- **Storage**: Browser localStorage
- **Responsive**: Works on desktop, tablet, and mobile

## 📊 Tips for Best Results

### Choose Good Reference Translations
- Use high-quality, professionally translated examples
- Pick references that cover the terminology you'll use
- Ensure references represent your desired style

### Optimize Your Input
- Provide at least 5 characters of text for each zone
- Keep similar text length between A and B for better consistency
- Use clear, well-written source text
- Specify technical terms clearly

### Iterative Improvement
1. Generate a translation
2. Review and edit if needed
3. Save good results to history
4. Use successful translations as new references
5. Refine your reference for next iteration

### Cost Optimization
- Use GPT-3.5 Turbo for faster, cheaper translations
- Batch translations to reduce overhead
- Monitor your OpenAI API usage

## 🐛 Troubleshooting

### "Invalid API Key" Error
- Check your key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
- Ensure you have API access enabled
- Try regenerating your key

### "Rate Limited" Error
- Wait a moment before trying again
- Reduce request frequency
- Check OpenAI API status

### "Exceeded Token Limit" Error
- Use shorter text segments
- Split large translations into parts
- Consider using GPT-3.5 Turbo

### Translation Quality Issues
- Provide better reference examples
- Add more context to source text
- Adjust temperature (try 0.2-0.4 for consistency)
- Review and edit output as needed

## 🎨 UI Guide

### Zones
- **Zone A** (Blue): Original source text
- **Zone A'** (Purple): Your reference translation
- **Zone B** (Blue): New text to translate
- **Zone B'** (Green): AI-generated output

### Status Messages
- 🟢 **Green**: Success
- 🔴 **Red**: Error
- 🔵 **Blue**: Loading/Processing
- 🟠 **Orange**: Information

### Tabs
- **Editor**: Main translation interface
- **History**: Previous translations
- **Settings**: Configuration and API setup

## 📝 License

MIT License - Feel free to use and modify

## 🤝 Contributing

Feedback and suggestions welcome! Please open an issue or pull request.

## 📞 Support

For issues with:
- **OpenAI API**: Visit [platform.openai.com/help](https://platform.openai.com/help)
- **This Tool**: Check the troubleshooting section above

---

**Happy Translating! 🌍**