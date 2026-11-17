const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

// Dark/Light Mode Switcher
function toggleTheme() {
  document.body.classList.toggle("dark-mode");
  const btn = document.getElementById("theme-toggle");
  btn.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
}

// Clickable Service Cards -> Scrolls to chat & asks question automatically
function triggerTopic(questionText) {
  document.getElementById("chat-section").scrollIntoView({ behavior: "smooth" });
  setTimeout(() => {
    sendQuickQuestion(questionText);
  }, 400);
}

// Allow pressing "Enter" to send
function handleKeyPress(event) {
  if (event.key === "Enter") {
    sendMessage();
  }
}

// Handle quick suggestion chips
function sendQuickQuestion(questionText) {
  userInput.value = questionText;
  sendMessage();
}

// Clear chat history
function clearChat() {
  chatBox.innerHTML = `
    <div class="message-row bot-row">
      <div class="message bot-message">
        Conversation reset! 🔄 Ask me anything about registration, exams, schedules, or campus services.
        <span class="timestamp">${getCurrentTime()}</span>
      </div>
    </div>
  `;
}

// Helper for message timestamps
function getCurrentTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Main function to send user message and display response
async function sendMessage() {
  const text = userInput.value.trim();
  if (text === "") return;

  // 1. Add user's message
  appendMessage(text, "user");
  userInput.value = "";

  // 2. Show animated typing indicator
  const typingBubble = appendMessage("UniBuddy is thinking...", "bot");

  try {
    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });
    const data = await response.json();
    typingBubble.innerHTML = `${data.reply}<span class="timestamp">${getCurrentTime()}</span>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (error) {
    typingBubble.innerHTML = `⚠️ Could not reach the Node.js server. Make sure backend is running on port 3000.<span class="timestamp">${getCurrentTime()}</span>`;
  }

 
}

// Helper function to add message bubbles with timestamps
function appendMessage(text, sender) {
  const rowDiv = document.createElement("div");
  rowDiv.classList.add("message-row", sender === "user" ? "user-row" : "bot-row");

  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", sender === "user" ? "user-message" : "bot-message");
  msgDiv.innerHTML = `${text}<span class="timestamp">${getCurrentTime()}</span>`;

  rowDiv.appendChild(msgDiv);
  chatBox.appendChild(rowDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msgDiv;
}

// Detailed university answers for testing & demo
function getSmartReply(input) {
  const lower = input.toLowerCase();

  if (lower.includes("exam")) {
    return "📅 <strong>Exam Schedule:</strong> Midterm exams run during Week 8, and Final Exams begin on <strong>January 10th</strong>. Log in to the Student Portal → <em>Exam Timetable</em> to view your exact hall and seat number.";
  } else if (lower.includes("register") || lower.includes("registration") || lower.includes("add")) {
    return "📝 <strong>Course Registration:</strong> Registration is open during Week 1 via the Academic Portal. You can register for <strong>12 to 18 credit hours</strong> once your academic advisor approves your course plan.";
  } else if (lower.includes("material") || lower.includes("syllabus") || lower.includes("lms")) {
    return "📚 <strong>Course Materials:</strong> All lecture slides, syllabi, and assignments are uploaded weekly on <strong>Moodle / LMS</strong> under your enrolled course codes.";
  } else if (lower.includes("library") || lower.includes("campus") || lower.includes("hours")) {
    return "🏛️ <strong>Library & Campus Hours:</strong> The Main Library is open <strong>Sunday–Thursday from 8:00 AM to 10:00 PM</strong>, and Saturdays from 10:00 AM to 6:00 PM. Quiet study rooms can be booked with your Student ID.";
  } else if (lower.includes("tuition") || lower.includes("finance") || lower.includes("scholarship") || lower.includes("pay")) {
    return "💳 <strong>Tuition & Financial Aid:</strong> Tuition fees can be paid online via the Student Finance Portal or in 3 installments. Merit scholarship applications close at the end of Week 3.";
  } else if (lower.includes("advisor") || lower.includes("support") || lower.includes("it")) {
    return "🎧 <strong>Advising & IT Helpdesk:</strong> You can book a 15-minute advising slot through the Student Portal, or visit the IT Desk (Building B, Ground Floor) for portal password resets.";
  } else if (lower.includes("hi") || lower.includes("hello") || lower.includes("hey")) {
    return "Hello! 👋 Ready to help! Try asking me about <strong>exams, registration, library hours, course materials, or tuition</strong>.";
  } else {
    return "🤖 I understood your question! When connected to our live <strong>Dialogflow Agent (Step 4)</strong>, I will trigger the exact intent for: <em>\"" + input + "\"</em>.";
  }
}