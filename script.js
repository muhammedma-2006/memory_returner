 document.addEventListener('DOMContentLoaded', () => {
            const chatForm = document.getElementById('chat-form');
            const messageInput = document.getElementById('message-input');
            const chatWindow = document.getElementById('chat-window');

            // The actual delay would be 5 minutes (300,000 ms).
            // For this demo, we use a 5-second delay to show the concept.
            const DELAY_MS = 5000; 

            chatForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const messageText = messageInput.value.trim();

                if (messageText) {
                    // 1. Display the user's sent message immediately.
                    addMessage(messageText, 'user-message', 'You (Now)');
                    
                    // 2. Schedule the echo from the "past self".
                    // In a real app, this would be handled by a backend queue.
                    setTimeout(() => {
                        addMessage(messageText, 'past-self-message', 'You (5 mins ago)');
                    }, DELAY_MS);
                    
                    // 3. Clear the input field.
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
                bubbleDiv.textContent = text;
                
                messageContainer.appendChild(metaDiv);
                messageContainer.appendChild(bubbleDiv);
                
                chatWindow.appendChild(messageContainer);
                
                // Scroll to the bottom to show the latest message.
                chatWindow.scrollTop = chatWindow.scrollHeight;
            }
        });