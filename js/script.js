// Ambil elemen-elemen penting
const addBtn = document.getElementById("add-btn");
const newTaskInput = document.getElementById("new-task");
const taskDateInput = document.getElementById("task-date");
const taskList = document.getElementById("task-list");
const deleteAllBtn = document.getElementById("delete-all-btn");
const filterBtn = document.getElementById("filter-btn");
const dropdown = document.querySelector(".dropdown");
const filterOptions = document.querySelectorAll(".option");

let todos = [];

// Tambah tugas baru
addBtn.addEventListener("click", () => {
  const taskText = newTaskInput.value.trim();
  const taskDate = taskDateInput.value;

  if (taskText === "") return;

  const todo = {
    id: Date.now(),
    text: taskText,
    date: taskDate,
    completed: false,
  };

  todos.push(todo);
  renderTodos();
  newTaskInput.value = "";
  taskDateInput.value = "";
});

const dateWrapper = document.querySelector(".date-wrapper");
const dateInput = document.getElementById("task-date");

dateWrapper.addEventListener("click", () => {
  dateInput.focus(); // trigger popup kalender
  // Trik tambahan untuk beberapa browser:
  dateInput.showPicker && dateInput.showPicker();
});

// Render semua tugas
function renderTodos(filter = "All") {
  taskList.innerHTML = "";

  const filteredTodos = todos.filter((todo) => {
    if (filter === "All") return true;
    if (filter === "Pending") return !todo.completed;
    if (filter === "Completed") return todo.completed;
  });

  filteredTodos.forEach((todo) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
    <td data-label="Task">${todo.text}</td>
    <td data-label="Date">${todo.date || "-"}</td>
    <td data-label="Status" class="status">${
      todo.completed ? "Completed" : "Pending"
    }</td>
    <td data-label="Actions">
        <button class="action-btn edit-btn">✏️</button>
        <button class="action-btn complete-btn">✅</button>
        <button class="action-btn delete-btn">🗑️</button>
    </td>
    `;

    // Aksi: edit
    tr.querySelector(".edit-btn").addEventListener("click", () => {
      const newText = prompt("Edit todo:", todo.text);
      if (newText) {
        todo.text = newText.trim();
        renderTodos(filter);
      }
    });

    // Aksi: selesai
    tr.querySelector(".complete-btn").addEventListener("click", () => {
      todo.completed = !todo.completed;
      renderTodos(filter);
    });

    // Aksi: hapus
    tr.querySelector(".delete-btn").addEventListener("click", () => {
      todos = todos.filter((t) => t.id !== todo.id);
      renderTodos(filter);
    });

    taskList.appendChild(tr);
  });
}

// Delete semua
deleteAllBtn.addEventListener("click", () => {
  if (todos.length === 0) return;

  todos = [];
  renderTodos();
  showNotif("Semua tugas berhasil dihapus!");
});

function showNotif(message) {
  const notif = document.getElementById("notif");
  notif.textContent = message;
  notif.classList.remove("hidden");
  notif.classList.add("show");

  // Sembunyikan setelah 3 detik
  setTimeout(() => {
    notif.classList.remove("show");
    notif.classList.add("hidden");
  }, 3000);
}

// Dropdown filter

filterBtn.addEventListener("click", () => {
  dropdown.style.display = dropdown.style.display === "flex" ? "none" : "flex";
});

// ... (Kode Anda yang sudah ada di atas)

// Tambahkan "click outside listener"
document.addEventListener("click", (event) => {
  const isClickInsideDropdown = dropdown.contains(event.target);
  const isClickOnFilterBtn = filterBtn.contains(event.target);

  if (
    dropdown.style.display === "flex" &&
    !isClickInsideDropdown &&
    !isClickOnFilterBtn
  ) {
    // Sembunyikan dropdown
    dropdown.style.display = "none";
  }
});

// Pilih filter
filterOptions.forEach((opt) => {
  opt.addEventListener("click", () => {
    const filter = opt.textContent.trim();
    renderTodos(filter);
    dropdown.style.display = "none";
  });
});
