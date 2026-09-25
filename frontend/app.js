const API_URL = "http://127.0.0.1:8000";

const boardEl = document.getElementById("board");
const carInput = document.getElementById("carInput");
const stepsInput = document.getElementById("stepsInput");
const moveBtn = document.getElementById("moveBtn");
const resetBtn = document.getElementById("resetBtn");
const statusEl = document.getElementById("status");

async function fetchState() {
  try {
    const res = await fetch(`${API_URL}/api/state`);
    const data = await res.json();
    render(data);
  } catch (err) {
    statusEl.innerText = "❌ Cannot connect to backend server!";
    statusEl.style.color = "#e84118";
  }
}

function render(data) {
  boardEl.innerHTML = "";

  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 6; c++) {
      const val = data.board[r][c];
      const cell = document.createElement("div");
      cell.classList.add("cell");

      if (val !== ".") {
        cell.innerText = val;
        cell.classList.add(`car-${val}`);
      }
      boardEl.appendChild(cell);
    }
  }

  if (data.is_won) {
    statusEl.innerText = "🎉 Victory! Exit reached!";
    statusEl.style.color = "#44bd32";
  } else if (data.message && data.message !== "OK") {
    statusEl.innerText = "⚠️ " + data.message;
    statusEl.style.color = "#e84118";
  } else {
    statusEl.innerText = "";
  }
}

async function sendMove() {
  const carId = carInput.value.trim().toUpperCase();
  const steps = parseInt(stepsInput.value);

  if (!carId || isNaN(steps)) {
    statusEl.innerText = "⚠️ Enter Car ID and Steps (+ / -)!";
    statusEl.style.color = "#fbc531";
    return;
  }

  try {
    const res = await fetch(`${API_URL}/api/move`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ car_id: carId, steps: steps })
    });
    const data = await res.json();
    render(data);
    stepsInput.value = "";
  } catch (err) {
    statusEl.innerText = "❌ Move failed!";
  }
}

async function resetGame() {
  try {
    const res = await fetch(`${API_URL}/api/reset`, { method: "POST" });
    const data = await res.json();
    render(data);
  } catch (err) {
    statusEl.innerText = "❌ Reset failed!";
  }
}

moveBtn.addEventListener("click", sendMove);
resetBtn.addEventListener("click", resetGame);

// Initial load
fetchState();