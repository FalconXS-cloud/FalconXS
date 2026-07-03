const form = document.querySelector("#chatForm");
const input = document.querySelector("#messageInput");
const messagesEl = document.querySelector("#messages");
const sendBtn = document.querySelector("#sendBtn");
const statusText = document.querySelector("#statusText");
const sideStatusText = document.querySelector("#sideStatusText");
const modelName = document.querySelector("#modelName");
const sideModelName = document.querySelector("#sideModelName");
const newChatBtn = document.querySelector("#newChatBtn");
const settingsBtn = document.querySelector("#settingsBtn");
const settingsModal = document.querySelector("#settingsModal");
const menuBtn = document.querySelector("#menuBtn");
const sidebar = document.querySelector("#sidebar");
const homeBtn = document.querySelector("#homeBtn");
const chatBtn = document.querySelector("#chatBtn");
const brandBtn = document.querySelector("#brandBtn");
const profileBtn = document.querySelector("#profileBtn");
const imageBtn = document.querySelector("#imageBtn");
const attachBtn = document.querySelector("#attachBtn");
const enhanceBtn = document.querySelector("#enhanceBtn");
const toast = document.querySelector("#toast");
const navItems = [...document.querySelectorAll(".nav-item")];

let history = [];
let toastTimer;

checkHealth();

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) return;

  input.value = "";
  resizeInput();
  addMessage("user", text);
  history.push({ role: "user", content: text });

  sendBtn.disabled = true;
  const thinking = addMessage("assistant", "Thinking at light speed...");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: history })
    });
    const data = await response.json();

    if (!response.ok) throw new Error(data.error || "Failed to get response.");

    updateBubble(thinking, data.reply);
    history.push({ role: "assistant", content: data.reply });
  } catch (error) {
    thinking.classList.add("error");
    updateBubble(thinking, `Failed to get response.\n\n${error.message}`);
  } finally {
    sendBtn.disabled = false;
    input.focus();
    scrollToBottom();
  }
});

input.addEventListener("input", resizeInput);
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});

newChatBtn.addEventListener("click", () => startNewChat());
brandBtn.addEventListener("click", () => startNewChat());

menuBtn.addEventListener("click", () => {
  sidebar.classList.toggle("compact");
  showToast(sidebar.classList.contains("compact") ? "Sidebar collapsed" : "Sidebar expanded");
});

homeBtn.addEventListener("click", () => {
  startNewChat("Welcome home. What should FalconXS help with?", homeBtn);
});

chatBtn.addEventListener("click", () => {
  setActiveNav(chatBtn);
  input.focus();
  showToast("Chat ready");
});

settingsBtn.addEventListener("click", () => {
  settingsModal.showModal();
});

profileBtn.addEventListener("click", () => {
  settingsModal.showModal();
});

imageBtn.addEventListener("click", () => showToast("Image upload UI is ready to connect."));
attachBtn.addEventListener("click", () => showToast("File attachment UI is ready to connect."));
enhanceBtn.addEventListener("click", () => {
  const text = input.value.trim();
  input.value = text
    ? `Improve and expand this request clearly:\n\n${text}`
    : "Help me write a clear, detailed prompt for FalconXS.";
  resizeInput();
  input.focus();
  showToast("Prompt enhanced");
});

async function checkHealth() {
  try {
    const response = await fetch("/api/health");
    const data = await response.json();
    const status = data.configured ? "API key connected" : "Add API key in .env";
    const statusClass = data.configured ? "ready" : "missing";

    modelName.textContent = data.model || "Model";
    sideModelName.textContent = data.model || "Model";
    statusText.textContent = status;
    sideStatusText.textContent = status;
    statusText.className = statusClass;
    sideStatusText.className = statusClass;
  } catch {
    statusText.textContent = "Server offline";
    sideStatusText.textContent = "Server offline";
    statusText.className = "missing";
    sideStatusText.className = "missing";
  }
}

function startNewChat(message = "New chat ready. Ask FalconXS anything.", activeNav = chatBtn) {
  history = [];
  messagesEl.innerHTML = "";
  addMessage("assistant", message);
  setActiveNav(activeNav);
  input.focus();
  showToast("New chat started");
}

function setActiveNav(activeButton) {
  navItems.forEach((button) => button.classList.toggle("active", button === activeButton));
}

function addMessage(role, content) {
  const article = document.createElement("article");
  article.className = `message ${role}`;

  const avatar = document.createElement("div");
  avatar.className = `avatar ${role === "assistant" ? "bot" : "user"}`;
  avatar.textContent = role === "assistant" ? "FX" : "You";

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.append(...bubbleParts(role, content));

  article.append(avatar, bubble);
  messagesEl.append(article);
  scrollToBottom();
  return article;
}

function bubbleParts(role, content) {
  const parts = [];
  if (role === "assistant") {
    const title = document.createElement("strong");
    title.textContent = content.startsWith("Failed") ? "FalconXS warning" : "FalconXS";
    parts.push(title);
  }

  const body = document.createElement("p");
  body.textContent = content;

  const time = document.createElement("time");
  time.textContent = new Intl.DateTimeFormat([], {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date());

  parts.push(body, time);
  return parts;
}

function updateBubble(messageEl, content) {
  const role = messageEl.classList.contains("assistant") ? "assistant" : "user";
  const bubble = messageEl.querySelector(".bubble");
  bubble.replaceChildren(...bubbleParts(role, content));
}

function resizeInput() {
  input.style.height = "auto";
  input.style.height = `${input.scrollHeight}px`;
}

function scrollToBottom() {
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 1800);
}
