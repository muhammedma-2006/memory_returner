 document.addEventListener('DOMContentLoaded', () => {
            const coverPage = document.getElementById('cover-page');
            const enterChatBtn = document.getElementById('enter-chat-btn');
            const chatApp = document.getElementById('chat-app');
            
            const chatForm = document.getElementById('chat-form');
            const messageInput = document.getElementById('message-input');
            const chatWindow = document.getElementById('chat-window');
            const suggestionBtn = document.getElementById('suggestion-btn');

            const API_KEY = ""; // Leave blank, will be handled by the environment
            const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${API_KEY}`;

            // --- Cover Page Logic ---
            enterChatBtn.addEventListener('click', () => {
                coverPage.classList.add('opening');
                chatApp.classList.add('visible');
                setTimeout(() => {
                    coverPage.classList.add('hidden');
                }, 1500);
            });

            // --- Gemini API Caller ---
            async function callGemini(prompt, buttonToDisable = null) {
                if (buttonToDisable) {
                    buttonToDisable.disabled = true;
                    buttonToDisable.innerHTML = '<div class="loading-spinner"></div>';
                }

                try {
                    const payload = { contents: [{ parts: [{ text: prompt }] }] };
                    const response = await fetch(API_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    if (!response.ok) {
                        throw new Error(`API Error: ${response.statusText}`);
                    }

                    const result = await response.json();
                    if (result.candidates && result.candidates.length > 0) {
                        return result.candidates[0].content.parts[0].text;
                    }
                    return "Sorry, I couldn't generate a response.";
                } catch (error) {
                    console.error("Gemini API call failed:", error);
                    return "An error occurred. Please check the console.";
                } finally {
                    if (buttonToDisable) {
                        buttonToDisable.disabled = false;
                        // Restore original button content
                        if (buttonToDisable.id === 'suggestion-btn') {
                             buttonToDisable.innerHTML = '✨';
                        } else {
                             buttonToDisable.innerHTML = '✨ Reflect';
                        }
                    }
                }
            }

            // --- AI Feature: Get a suggestion ---
            suggestionBtn.addEventListener('click', async () => {
                const prompt = "Give me a single, thought-provoking question to journal about. Make it personal and introspective. For example: 'What is a belief I hold that I haven't questioned in a while?' or 'What am I avoiding right now and why?'.";
                const suggestion = await callGemini(prompt, suggestionBtn);
                messageInput.value = suggestion.replace(/"/g, ''); // Remove quotes from response
                messageInput.focus();
            });

            // --- AI Feature: Reflect on a past message ---
            async function handleReflection(event) {
                const button = event.target;
                const messageBubble = button.closest('.message-bubble');
                const messageText = messageBubble.querySelector('.message-text').textContent;
                
                const prompt = `My past self wrote this: "${messageText}". What are some insightful questions I could ask myself to explore this thought further? Or what's a different perspective I could consider? Keep the response concise and helpful.`;
                
                const reflection = await callGemini(prompt, button);
                addMessage(reflection, 'gemini-message', '✨ Gemini Reflection');
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

                const metaDiv = document.createElement('div');
                metaDiv.classList.add('meta');
                metaDiv.textContent = author;

                const bubbleDiv = document.createElement('div');
                bubbleDiv.classList.add('message-bubble');
                
                const textSpan = document.createElement('span');
                textSpan.classList.add('message-text');
                textSpan.textContent = text;
                bubbleDiv.appendChild(textSpan);

                // Add reflection button for past-self messages
                if (type === 'past-self-message') {
                    const reflectBtn = document.createElement('button');
                    reflectBtn.classList.add('reflect-button');
                    reflectBtn.innerHTML = '✨ Reflect';
                    reflectBtn.addEventListener('click', handleReflection);
                    bubbleDiv.appendChild(reflectBtn);
                }
                
                messageContainer.appendChild(metaDiv);
                messageContainer.appendChild(bubbleDiv);
                
                chatWindow.appendChild(messageContainer);
                chatWindow.scrollTop = chatWindow.scrollHeight;
            }
        });