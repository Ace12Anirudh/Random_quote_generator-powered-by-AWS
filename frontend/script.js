document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const quoteTextElem = document.getElementById('quote-text');
    const quoteAuthorElem = document.getElementById('quote-author');
    const newQuoteBtn = document.getElementById('new-quote-btn');
    const addQuoteForm = document.getElementById('add-quote-form');
    const quoteInput = document.getElementById('quote-input');
    const authorInput = document.getElementById('author-input');
    const statusMessage = document.getElementById('status-message');

    // --- API Configuration ---
    // IMPORTANT: Replace this with the API Gateway URL from your SAM deployment output
    const API_BASE_URL = 'https://kv5yope8cb.execute-api.us-east-1.amazonaws.com/prod'; 

    // --- Functions ---

    async function fetchRandomQuote() {
        if (API_BASE_URL === 'YOUR_API_GATEWAY_URL_HERE') {
            quoteTextElem.textContent = "Please update API_BASE_URL in script.js";
            return;
        }
        try {
            // The path is now simply /quotes for both GET and POST
            const response = await fetch(`${API_BASE_URL}/quotes`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            quoteTextElem.textContent = `"${data.text}"`;
            quoteAuthorElem.textContent = `- ${data.author}`;
        } catch (error) {
            console.error("Failed to fetch quote:", error);
            quoteTextElem.textContent = "Could not fetch a quote. Is the backend deployed?";
            quoteAuthorElem.textContent = "";
        }
    }

    async function handleAddQuote(event) {
        event.preventDefault(); 
        const text = quoteInput.value.trim();
        const author = authorInput.value.trim();

        if (!text || !author) {
            showStatusMessage("Both fields are required.", "error");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/quotes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text, author }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add quote');
            }
            
            showStatusMessage("Quote added successfully!", "success");
            addQuoteForm.reset(); 
        } catch (error) {
            console.error("Error adding quote:", error);
            showStatusMessage(error.message, "error");
        }
    }
    
    function showStatusMessage(message, type) {
        statusMessage.textContent = message;
        statusMessage.className = type;
        setTimeout(() => {
            statusMessage.textContent = '';
            statusMessage.className = '';
        }, 3000);
    }

    // --- Event Listeners ---
    newQuoteBtn.addEventListener('click', fetchRandomQuote);
    addQuoteForm.addEventListener('submit', handleAddQuote);

    // --- Initial Load ---
    fetchRandomQuote();
});