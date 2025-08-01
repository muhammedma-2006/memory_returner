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

**Caption:**

This diagram illustrates the complete workflow of the LoopChat application, which operates entirely on the client-side for this demonstration.

1.  **User Interaction**: The user interacts with the UI built with **HTML and CSS**. All actions, like sending a message or clicking a button, are captured by the **Frontend JavaScript**.
2.  **The Loop**: When a user sends a message, the JavaScript displays it immediately and simulates the 5-minute delay using a `setTimeout` function. After the delay, the same message is displayed back to the user as if it's from their "past self."
3.  **Gemini AI Features**:
    * **Suggestion**: Clicking the "✨" button sends a predefined prompt to the **Gemini Text API** to generate a thought-provoking question.
    * **Reflection & Summary**: Clicking "Reflect" on a message or "Summarize" in the header sends the relevant conversation text to the **Gemini Text API** for analysis, mood detection, and actionable insights.
    * **Text-to-Speech (TTS)**: Clicking the "Listen" button on an AI-generated message sends the text content to the **Gemini TTS API**, which returns an audio file that is played directly in the browser.

All API communication happens securely from the client to the Google Cloud backend, with the results rendered dynamically back into the chat window.


Project Demo
Video
[Add your demo video link here] Explain what the video demonstrates

Additional Demos
[Add any extra demo materials/links]

Team Contributions
[Name 1]: [Specific contributions]
[Name 2]: [Specific contributions]
[Name 3]: [Specific contributions]
