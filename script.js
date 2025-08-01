document.addEventListener('DOMContentLoaded', () => {
            const coverPage = document.getElementById('cover-page');
            const enterChatBtn = document.getElementById('enter-chat-btn');
            const chatApp = document.getElementById('chat-app');
            
            const chatForm = document.getElementById('chat-form');
            const messageInput = document.getElementById('message-input');
            const chatWindow = document.getElementById('chat-window');
            const suggestionBtn = document.getElementById('suggestion-btn');
            const summarizeBtn = document.getElementById('summarize-btn');
            const audioPlayer = document.getElementById('tts-audio-player');

            const API_KEY = ""; // Leave blank, will be handled by the environment
            const TEXT_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;
            const TTS_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${API_KEY}`;

            // --- Cover Page Logic ---
            enterChatBtn.addEventListener('click', () => {
                coverPage.classList.add('opening');
                chatApp.classList.add('visible');
                setTimeout(() => {
                    coverPage.classList.add('hidden');
                }, 500);
            });

            // --- Gemini API Callers ---
            async function callGeminiText(prompt, buttonToDisable = null) {
                const originalButtonContent = buttonToDisable ? buttonToDisable.innerHTML : '';
                if (buttonToDisable) {
                    buttonToDisable.disabled = true;
                    buttonToDisable.innerHTML = '<div class="loading-spinner"></div>';
                }

                try {
                    const payload = { contents: [{ parts: [{ text: prompt }] }] };
                    const response = await fetch(TEXT_API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
                    const result = await response.json();
                    if (result.candidates && result.candidates[0].content.parts) {
                        return result.candidates[0].content.parts[0].text;
                    }
                    return "Sorry, I couldn't generate a response.";
                } catch (error) {
                    console.error("Gemini Text API call failed:", error);
                    return "An error occurred. Please check the console.";
                } finally {
                    if (buttonToDisable) {
                        buttonToDisable.disabled = false;
                        buttonToDisable.innerHTML = originalButtonContent;
                    }
                }
            }

            async function callGeminiTTS(text, buttonToDisable = null) {
                const originalButtonContent = buttonToDisable ? buttonToDisable.innerHTML : '';
                 if (buttonToDisable) {
                    buttonToDisable.disabled = true;
                    buttonToDisable.innerHTML = '<div class="loading-spinner"></div>';
                }
                try {
                     const payload = {
                        contents: [{ parts: [{ text: `Say this in a calm, thoughtful voice: ${text}` }] }],
                        generationConfig: { responseModalities: ["AUDIO"] },
                        model: "gemini-2.5-flash-preview-tts"
                    };
                    const response = await fetch(TTS_API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });
                    if (!response.ok) throw new Error(`TTS API Error: ${response.statusText}`);
                    const result = await response.json();
                    const audioData = result?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
                    if (audioData) {
                        const pcmData = base64ToArrayBuffer(audioData);
                        const pcm16 = new Int16Array(pcmData);
                        const wavBlob = pcmToWav(pcm16, 24000); // Gemini TTS uses 24kHz sample rate
                        const audioUrl = URL.createObjectURL(wavBlob);
                        audioPlayer.src = audioUrl;
                        audioPlayer.play();
                    } else {
                        throw new Error("No audio data in response.");
                    }
                } catch (error) {
                    console.error("Gemini TTS call failed:", error);
                    addMessage("Sorry, I couldn't generate the audio for that.", "gemini-message", "System");
                } finally {
                    if (buttonToDisable) {
                        buttonToDisable.disabled = false;
                        buttonToDisable.innerHTML = '🔊 Listen';
                    }
                }
            }
            
            // --- AI Feature: Summarize Conversation ---
            summarizeBtn.addEventListener('click', async () => {
                const messages = Array.from(chatWindow.querySelectorAll('.message'));
                if (messages.length < 2) {
                    addMessage("Not enough conversation to summarize yet.", "gemini-message", "✨ Gemini Summary");
                    return;
                }
                const chatLog = messages.map(msg => `${msg.dataset.author}: ${msg.querySelector('.message-text').textContent}`).join('\n');
                const prompt = `The following is a chat log of a user talking to their past self. First, summarize the key themes and shifts in tone in a section starting with "Summary:". Then, on a new line, provide one single, concrete, actionable step the user could take based on the conversation, starting with "Actionable Step:".\n\nChat Log:\n${chatLog}`;
                const summary = await callGeminiText(prompt, summarizeBtn);
                addMessage(summary, 'gemini-message', '✨ Gemini Summary');
            });

            // --- AI Feature: Get a suggestion ---
            suggestionBtn.addEventListener('click', async () => {
                const prompt = "Give me a single, thought-provoking question to journal about. Make it personal and introspective.";
                const suggestion = await callGeminiText(prompt, suggestionBtn);
                messageInput.value = suggestion.replace(/"/g, '');
                messageInput.focus();
            });

            // --- AI Feature: Reflect on a past message ---
            async function handleReflection(event) {
                const button = event.target;
                const messageText = button.closest('.message-bubble').querySelector('.message-text').textContent;
                const prompt = `My past self wrote this: "${messageText}". First, analyze the potential mood in one short sentence starting with "Mood:". Then, on a new line, provide insightful questions to explore this thought, starting with "Reflection:".`;
                const reflection = await callGeminiText(prompt, button);
                addMessage(reflection, 'gemini-message', '✨ Gemini Reflection');
            }
            
            // --- AI Feature: Listen to a message ---
            function handleListen(event) {
                const button = event.target;
                const messageBubble = button.closest('.message-bubble');
                // Reconstruct the full text content from the bubble
                const textToSpeak = Array.from(messageBubble.childNodes)
                    .map(node => node.textContent)
                    .join(' ')
                    .replace('✨ Reflect', '') // Don't speak the button text
                    .replace('🔊 Listen', '');
                callGeminiTTS(textToSpeak, button);
            }

            // --- Chat Logic ---
            const DELAY_MS = 5000; 

            chatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const messageText = messageInput.value.trim();
                if (messageText) {
                    addMessage(messageText, 'user-message', 'You (Now)');
                    setTimeout(() => {
                        addMessage(messageText, 'past-self-message', 'You (5 mins ago)');
                    }, DELAY_MS);
                    messageInput.value = '';
                    messageInput.focus();
                }
            });

            function addMessage(text, type, author) {
                const messageContainer = document.createElement('div');
                messageContainer.classList.add('message', type);
                messageContainer.dataset.author = author;

                const metaDiv = document.createElement('div');
                metaDiv.classList.add('meta');
                metaDiv.textContent = author;

                const bubbleDiv = document.createElement('div');
                bubbleDiv.classList.add('message-bubble');
                
                // Parse complex Gemini responses
                if (text.includes("Mood:") && text.includes("Reflection:")) {
                    const [moodPart, reflectionPart] = text.split("Reflection:").map(s => s.trim());
                    const moodEl = document.createElement('div');
                    moodEl.classList.add('gemini-mood');
                    moodEl.textContent = moodPart.replace("Mood:", "").trim();
                    bubbleDiv.appendChild(moodEl);
                    
                    const reflectionEl = document.createElement('span');
                    reflectionEl.classList.add('message-text');
                    reflectionEl.textContent = reflectionPart;
                    bubbleDiv.appendChild(reflectionEl);

                } else if (text.includes("Summary:") && text.includes("Actionable Step:")) {
                    const [summaryPart, actionPart] = text.split("Actionable Step:").map(s => s.trim());
                    const summaryEl = document.createElement('span');
                    summaryEl.classList.add('message-text');
                    summaryEl.textContent = summaryPart.replace("Summary:", "").trim();
                    bubbleDiv.appendChild(summaryEl);
                    
                    const actionEl = document.createElement('div');
                    actionEl.classList.add('gemini-actionable-step');
                    actionEl.textContent = `Actionable Step: ${actionPart}`;
                    bubbleDiv.appendChild(actionEl);

                } else {
                    const textSpan = document.createElement('span');
                    textSpan.classList.add('message-text');
                    textSpan.textContent = text;
                    bubbleDiv.appendChild(textSpan);
                }

                const actionsDiv = document.createElement('div');
                actionsDiv.classList.add('message-actions');

                if (type === 'past-self-message') {
                    const reflectBtn = document.createElement('button');
                    reflectBtn.classList.add('reflect-button');
                    reflectBtn.innerHTML = '✨ Reflect';
                    reflectBtn.addEventListener('click', handleReflection);
                    actionsDiv.appendChild(reflectBtn);
                }
                
                if (type === 'gemini-message') {
                    const listenBtn = document.createElement('button');
                    listenBtn.classList.add('listen-button');
                    listenBtn.innerHTML = '🔊 Listen';
                    listenBtn.addEventListener('click', handleListen);
                    actionsDiv.appendChild(listenBtn);
                }

                if (actionsDiv.hasChildNodes()) {
                    bubbleDiv.appendChild(actionsDiv);
                }
                
                messageContainer.appendChild(metaDiv);
                messageContainer.appendChild(bubbleDiv);
                
                chatWindow.appendChild(messageContainer);
                chatWindow.scrollTop = chatWindow.scrollHeight;
            }

            // --- Audio Utility Functions ---
            function base64ToArrayBuffer(base64) {
                const binaryString = window.atob(base64);
                const len = binaryString.length;
                const bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                return bytes.buffer;
            }

            function pcmToWav(pcmData, sampleRate) {
                const header = new ArrayBuffer(44);
                const view = new DataView(header);
                const pcmLength = pcmData.length * 2;
                const totalLength = pcmLength + 36;
                // RIFF identifier
                view.setUint32(0, 0x46464952, false);
                // file length
                view.setUint32(4, totalLength, true);
                // WAVE identifier
                view.setUint32(8, 0x45564157, false);
                // FMT chunk identifier
                view.setUint32(12, 0x20746d66, false);
                // chunk length
                view.setUint32(16, 16, true);
                // audio format (1 for PCM)
                view.setUint16(20, 1, true);
                // number of channels
                view.setUint16(22, 1, true);
                // sample rate
                view.setUint32(24, sampleRate, true);
                // byte rate
                view.setUint32(28, sampleRate * 2, true);
                // block align
                view.setUint16(32, 2, true);
                // bits per sample
                view.setUint16(34, 16, true);
                // data chunk identifier
                view.setUint32(36, 0x61746164, false);
                // data chunk length
                view.setUint32(40, pcmLength, true);

                return new Blob([header, pcmData], { type: 'audio/wav' });
            }
        });