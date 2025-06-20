const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const addBtn = $(".add-btn");
const closeModalBtn = $(".modal-close");
const cancelModalBtn = $(".btn-cancel");
const addTaskModal = $("#addTaskModal");
const todoForm = $(".todo-app-form");
const titleInput = $("#taskTitle");
const todoList = $("#todoList");

let editIndex = null;

// Hàm mở form & focus
function openFormModal() {
  addTaskModal.className = "modal-overlay show";
  setTimeout(() => {
    titleInput.focus();
  }, 100);
}

// Hàm reset form + đóng modal
function closeForm() {
  addTaskModal.className = "modal-overlay";

  const formTitle = addTaskModal.querySelector(".modal-title");
  if (formTitle) {
    formTitle.textContent = formTitle.dataset.original || formTitle.textContent;
    delete formTitle.dataset.original;
  }

  const submitBtn = addTaskModal.querySelector(".btn-submit");
  if (submitBtn) {
    submitBtn.textContent = submitBtn.dataset.original || submitBtn.textContent;
    delete submitBtn.dataset.original;
  }

  // Cuộn lên đầu form
  setTimeout(() => {
    addTaskModal.querySelector(".modal").scrollTop = 0;
  }, 300);

  // Reset form về giá trị mặc định
  todoForm.reset();

  // Xoá bỏ editIndex (Căn cứ để biết đã đóng form sửa)
  editIndex = null;
}

// Hiển thị modal thêm mới + focus input
addBtn.onclick = openFormModal;

// Xử lý đóng modal thêm mới
closeModalBtn.onclick = closeForm;
cancelModalBtn.onclick = closeForm;

const todoTasks = JSON.parse(localStorage.getItem("todoTasks")) ?? [];

// Xử lý khi form submit
todoForm.onsubmit = function (event) {
  event.preventDefault();

  // Lấy toàn bộ form data (dữ liệu từ các input, textarea,...)
  const formData = Object.fromEntries(new FormData(todoForm));

  // Nếu có editIndex tức đang mở modal sửa
  // Thực hiện logic sửa
  if (editIndex) {
    todoTasks[editIndex] = formData;
  }
  // Không editIndex, tức đang mở modal thêm mới
  // Thực hiện logic thêm mới
  else {
    // Mặc định task chưa được hoàn thành
    formData.isCompleted = false;

    //   Thêm task vào đầu danh sách
    todoTasks.unshift(formData);
  }

  //Lưu toàn bộ danh sách task vào localStorage
  saveTasks();

  // Đóng modal
  closeForm();

  // Cập nhật giao diện
  renderTasks();
};

function saveTasks() {
  localStorage.setItem("todoTasks", JSON.stringify(todoTasks));
}

todoList.onclick = function (event) {
  const editBtn = event.target.closest(".edit-btn");
  const deleteBtn = event.target.closest(".delete-btn");
  const completeBtn = event.target.closest(".complete-btn");

  //Edit
  if (editBtn) {
    const taskIndex = editBtn.dataset.index;
    const task = todoTasks[taskIndex];

    editIndex = taskIndex;

    for (const key in task) {
      const value = task[key];
      const input = $(`[name="${key}"]`);
      if (input) {
        input.value = value;
      }
    }

    const formTitle = addTaskModal.querySelector(".modal-title");
    if (formTitle) {
      formTitle.dataset.original = formTitle.textContent;
      formTitle.textContent = "Edit Task";
    }

    const submitBtn = addTaskModal.querySelector(".btn-submit");
    if (submitBtn) {
      submitBtn.dataset.original = submitBtn.textContent;
      submitBtn.textContent = "Save Task";
    }

    openFormModal();
  }

  if (deleteBtn) {
    const taskIndex = deleteBtn.dataset.index;
    const task = todoTasks[taskIndex];

    if (confirm(`Bạn chắc chắn muốn xoá công việc "${task.title}"?`)) {
      todoTasks.splice(taskIndex, 1);
      saveTasks();
      renderTasks();
    }
  }

  if (completeBtn) {
    const taskIndex = completeBtn.dataset.index;
    const task = todoTasks[taskIndex];
    task.isCompleted = !task.isCompleted;
    saveTasks();
    renderTasks();
  }
};

// Hàm render giao diện
function renderTasks() {
  if (!todoTasks.length) {
    todoList.innerHTML = "<p>Chưa có công việc nào.</p>";
    return;
  }

  const html = todoTasks
    .map(
      (task, index) => `
            <div class="task-card ${task.color} ${
        task.isCompleted ? "completed" : ""
      }">
          <div class="task-header">
            <h3 class="task-title">${task.title}</h3>
            <button class="task-menu">
              <i class="fa-solid fa-ellipsis fa-icon"></i>
              <div class="dropdown-menu">
                <div class="dropdown-item edit-btn" data-index="${index}">
                  <i class="fa-solid fa-pen-to-square fa-icon"></i>
                  Edit
                </div>
                <div class="dropdown-item complete-btn" data-index="${index}">
                  <i class="fa-solid fa-check fa-icon"></i>
                  ${task.isCompleted ? "Mark as Active" : "Mark as Complete"}
                </div>
                <div class="dropdown-item delete delete-btn" data-index="${index}">
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
  todoList.innerHTML = html;
}

//Render lần đầu để hiển thị được danh sách task lấy từ localStorage
renderTasks();
