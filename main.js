const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const addBtn = $(".add-btn");
const closeModalBtn = $(".modal-close");
const cancelModalBtn = $(".btn-cancel");
const addTaskModal = $("#addTaskModal");
const todoForm = $(".todo-app-form");
const titleInput = $("#taskTitle");

// Hàm mở form & focus
function openForm() {
  addTaskModal.className = "modal-overlay show";
  setTimeout(() => {
    titleInput.focus();
  }, 100);
}

// Hàm đóng form
function closeForm() {
  addTaskModal.className = "modal-overlay";
}

// Hiển thị modal thêm mới + focus input
addBtn.onclick = openForm;

// Xử lý đóng modal thêm mới
closeModalBtn.onclick = closeForm;
cancelModalBtn.onclick = closeForm;

const todoTasks = [];

// Xử lý khi form submit
todoForm.onsubmit = function (event) {
  event.preventDefault();

  // Lấy toàn bộ form data (dữ liệu từ các input, textarea,...)
  const newTask = Object.fromEntries(new FormData(todoForm));
  newTask.isCompleted = false; // Mặc định task chưa được hoàn thành

  //   Thêm dữ liệu vào đầu mảng
  todoTasks.unshift(newTask);

  // Reset form & đóng modal
  todoForm.reset();
  closeForm();

  // Cập nhật giao diện
  renderTasks(todoTasks);
};

// Hàm render giao diện
function renderTasks(tasks) {
  const html = tasks
    .map(
      (task) => `
            <div class="task-card ${task.color} ${
        task.isCompleted ? "completed" : ""
      }">
          <div class="task-header">
            <h3 class="task-title">${task.title}</h3>
            <button class="task-menu">
              <i class="fa-solid fa-ellipsis fa-icon"></i>
              <div class="dropdown-menu">
                <div class="dropdown-item">
                  <i class="fa-solid fa-pen-to-square fa-icon"></i>
                  Edit
                </div>
                <div class="dropdown-item complete">
                  <i class="fa-solid fa-check fa-icon"></i>
                  ${task.isCompleted ? "Mark as Active" : "Mark as Complete"}
                </div>
                <div class="dropdown-item delete">
                  <i class="fa-solid fa-trash fa-icon"></i>
                  Delete
                </div>
              </div>
            </button>
          </div>
          <p class="task-description">${task.description}</p>
          <div class="task-time">${task.startTime} - ${task.endTime}</div>
        </div>
    `
    )
    .join("");
  const todoList = $("#todoList");
  todoList.innerHTML = html;
}
