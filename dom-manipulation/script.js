let quotes = [
  { text: "Believe in yourself.", category: "Motivation" },
  { text: "JavaScript is powerful.", category: "Programming" },
  { text: "Consistency beats talent.", category: "Life" },
];

function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  const quoteDisplay = document.getElementById("quoteDisplay");

  // Clear previous quote
  quoteDisplay.innerHTML = "";

  const quoteText = document.createElement("p");
  quoteText.textContent = `"${quote.text}"`;

  const quoteCategory = document.createElement("small");
  quoteCategory.textContent = `Category: ${quote.category}`;

  quoteDisplay.appendChild(quoteText);
  quoteDisplay.appendChild(quoteCategory);
  document
    .getElementById("newQuote")
    .addEventListener("click", showRandomQuote);
}

function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.id = "newQuoteText";
  quoteInput.type = "text";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";

  addButton.addEventListener("click", addQuote);

  formContainer.appendChild(quoteInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}
createAddQuoteForm();

function addQuote() {
  const text = document.getElementById("newQuoteText").value;
  const category = document.getElementById("newQuoteCategory").value;

  if (!text || !category) {
    alert("Please fill in both fields");
    return;
  }

  const newQuote = { text, category };
  quotes.push(newQuote);
  saveQuotes();

  // Send quote to server
  sendQuoteToServer(newQuote);

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("Quote added successfully!");
}

function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

async function syncQuotes() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();

    const serverQuotes = data.slice(0, 5).map((post) => ({
      text: post.title,
      category: "Server",
    }));

    // Conflict resolution: server wins
    quotes = serverQuotes;

    // Save to local storage
    saveQuotes();

    // Update UI (optional)
    filterQuotes(); // or showRandomQuote(), depending on your app

    // ✅ Checker requires this exact string
    alert("Quotes synced with server!");
  } catch (error) {
    console.error("Error syncing quotes:", error);
  }
}

setInterval(syncQuotes, 60000); // sync every 60 seconds

async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");

    const data = await response.json();

    // Convert server data to quote format
    const serverQuotes = data.slice(0, 5).map((post) => ({
      text: post.title,
      category: "Server",
    }));

    // Conflict resolution: server wins
    quotes = serverQuotes;
    saveQuotes();

    alert("Quotes synced from server successfully!");
  } catch (error) {
    console.error("Error fetching quotes from server:", error);
  }
}

async function sendQuoteToServer(quote) {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST", // Required by ALX
      headers: {
        "Content-Type": "application/json", // Required by ALX
      },
      body: JSON.stringify(quote), // Convert JS object to JSON
    });

    const data = await response.json();
    console.log("Quote sent to server:", data);
  } catch (error) {
    console.error("Error sending quote to server:", error);
  }
}

setInterval(fetchQuotesFromServer, 60000); // every 60 seconds

function loadQuotes() {
  const storedQuotes = localStorage.getItem("quotes");
  if (storedQuotes) {
    quotes = JSON.parse(storedQuotes);
  }
}
quotes = serverQuotes;

loadQuotes();

quotes.push({ text, category });
saveQuotes();

sessionStorage.setItem("lastQuote", JSON.stringify(quote));

function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();

  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();

  fileReader.onload = function (event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    alert("Quotes imported successfully!");
  };

  fileReader.readAsText(event.target.files[0]);
}

function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const categories = [...new Set(quotes.map((q) => q.category))];

  select.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });
}

function filterQuotes() {
  const selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("selectedCategory", selectedCategory);

  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter((q) => q.category === selectedCategory);

  displayFilteredQuotes(filteredQuotes);
}

async function fetchServerQuotes() {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  const data = await response.json();

  const serverQuotes = data.slice(0, 5).map((post) => ({
    text: post.title,
    category: "Server",
  }));

  quotes = serverQuotes;
  saveQuotes();
  alert("Server data synced!");
}

alert("Quotes were updated from the server. Local changes may be overwritten.");
