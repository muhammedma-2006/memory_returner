# memory_returner

loop chat 🎯
Basic Details
Team Name: Malabar Techies
Team Members
Team Lead: Muhammed Ramzin- School of engineering ,CUSAT
Member 2: Muhammed M A- School of engineering ,CUSAT

Project Description
 The AI-powered chat app where you talk to your past self.
 LoopChat is a unique self-reflection and journaling tool disguised as a chat application

The Problem (that doesn't exist)

Our most brilliant, fleeting thoughts are homeless. An idea for a novel, a sudden moment of self-awareness, or a profound question about the universe pops into our head, only to vanish moments later, lost to the relentless forward march of time.

The Solution (that nobody asked for)
Traditional note-taking apps are merely cemeteries for these thoughts—static, lifeless records of a moment that has passed. You can read what you wrote, but you can't talk back. You can't challenge, question, or comfort the person who had that thought.

Technical Details
Technologies/Components Used
For Software:

Languages used : HTML5,CSS3,JAVASCRIPT
Tools used :GIT,GITHUB

Implementation
For Software:

Installation
git clone https://github.com/muhammedma-2006/BubblePop.git

Run


Project Documentation
For Software:

Screenshots (Add at least 3)
https://github.com/muhammedma-2006/memory_returner/blob/main/screenshot/cover%20page.jpg

https://github.com/muhammedma-2006/memory_returner/blob/main/screenshot/content%20page.jpg

https://github.com/muhammedma-2006/memory_returner/blob/main/screenshot/AI%20input.jpg

### Workflow

This diagram illustrates the complete client-side workflow of the LoopChat application.

#### Core Loop
When a user sends a message, the JavaScript immediately displays it and simulates a 5-minute delay using `setTimeout`. After the delay, the message is redisplayed to the user, creating a conversational loop with their "past self."

#### Gemini AI Integration
The application leverages the Gemini API for several key features:

* **AI Suggestions**: Clicking the "✨" button sends a prompt to the Gemini Text API to generate a thought-provoking question for the user.
* **AI Reflection & Summarization**: The "Reflect" and "Summarize" features send the conversation history to the Gemini Text API for analysis. The API returns insightful questions, mood analysis, or a full summary with actionable steps.
* **Text-to-Speech (TTS)**: The "Listen" button on AI-generated messages uses the Gemini TTS API to convert the text into speech, which is then played back in the browser.

All API communication is handled securely between the client and the Google Cloud backend, with results rendered dynamically in the chat interface.


Project Demo
Video
[Add your demo video link here] Explain what the video demonstrates

Additional Demos
[Add any extra demo materials/links]

Team Contributions
[Name 1]: [Specific contributions]
[Name 2]: [Specific contributions]
[Name 3]: [Specific contributions]
