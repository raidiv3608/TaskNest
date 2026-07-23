const taskForm = document.getElementById("task-form");
const taskNameInput = document.getElementById("task-name");
const prioritySelect = document.getElementById("priority");
const dueDateInput = document.getElementById("due-date");
const taskContainer = document.getElementById("task-container");
const searchInput = document.getElementById("searchInput");

const totalTasks = document.getElementById("total-tasks");
const pendingTasks = document.getElementById("pending-tasks");
const completedTasks = document.getElementById("completed-tasks");
const progress = document.getElementById("progress");
const statusFilter = document.getElementById("status-filter");
const priorityFilter = document.getElementById("priority-filter");
const sortTask = document.getElementById("sort-task");
const errorMessage = document.getElementById("error-message");
const toast = document.getElementById("toast");
const themeToggle = document.getElementById("theme-toggle");
const progressFill = document.getElementById("progress-fill");


function showError(message) {

    errorMessage.textContent = message;
    errorMessage.style.display = "block";

}

function clearError() {

    errorMessage.textContent = "";
    errorMessage.style.display = "none";

}

function resetTaskForm() {

    taskNameInput.value = "";
    prioritySelect.value = "";
    dueDateInput.value = "";

    taskNameInput.focus();

}
function validateTask(taskName, priority, dueDate) {

    if (taskName.trim() === "") {

        return {
            valid: false,
            message: "Task name cannot be empty."
        };

    }

    if (priority === "") {

        return {
            valid: false,
            message: "Please select a priority."
        };

    }

    if (dueDate === "") {

        return {
            valid: false,
            message: "Please select a due date."
        };

    }

    return {

        valid: true,
        message: ""

    };

}

function showToast(message, type) {

    toast.textContent = message;

    toast.classList.remove("success", "error");

    toast.classList.add(type);

    toast.classList.add("show");

    setTimeout(function () {

        toast.classList.remove("show");

        toast.classList.remove("success", "error");

    }, 3000);

}

let tasks=[];
let currentSearchText = "";

let currentStatusFilter = "all";

let currentPriorityFilter = "all";

let currentSort = "newest";


function renderTasks(tasksToDisplay) {

    taskContainer.innerHTML = "";

    if (tasksToDisplay.length === 0) {

    taskContainer.innerHTML = `
        <div class="empty-state">
            <h3>📋 No tasks found</h3>
            <p>Add a task or change your search/filter.</p>
        </div>
    `;

    return;

}

    tasksToDisplay.forEach(function(task){

        const taskCard = document.createElement("div");

        taskCard.classList.add("task-card");

        taskCard.innerHTML = `
    <h3>${task.name}</h3>

    <p><strong>Priority:</strong> ${task.priority}</p>

    <p><strong>Due Date:</strong> ${task.dueDate}</p>

    <p><strong>Status:</strong> ${
        task.completed ? "Completed ✅" : "Pending ⏳"
    }</p>
    <div class="task-actions">

    <button
    class="complete-btn"
    data-id="${task.id}">
    ${task.completed ? "Undo" : "Complete"}
</button>

<button
    class="delete-btn"
    data-id="${task.id}">
    Delete
</button>
    </div>
`;

        taskContainer.appendChild(taskCard);

    });
    const deleteButtons = document.querySelectorAll(".delete-btn");

deleteButtons.forEach(function(button) {

    button.addEventListener("click", function () {

        const taskId = Number(button.dataset.id);

        tasks = tasks.filter(function(task) {
            return task.id !== taskId;
        });
        saveTasks();
        refreshUI();
        showToast("Task deleted successfully!", "success");
    });
});

const completeButtons = document.querySelectorAll(".complete-btn");

completeButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const taskId = Number(button.dataset.id);

        const task = tasks.find(function(task) {

            return task.id === taskId;

        });

        task.completed = !task.completed;

        saveTasks();

        refreshUI();

        if (task.completed) {

            showToast("Task marked as completed!", "success");

        } else {

            showToast("Task marked as pending!", "success");

        }

    });

});

}
function updateDisplayedTasks() {

    let displayedTasks = [...tasks];

    // ---------------- SEARCH ----------------

    if (currentSearchText !== "") {

        displayedTasks = displayedTasks.filter(function (task) {

            return task.name
                .toLowerCase()
                .includes(currentSearchText);

        });

    }

    // ---------------- STATUS FILTER ----------------

    if (currentStatusFilter === "active") {

        displayedTasks = displayedTasks.filter(function (task) {

            return !task.completed;

        });

    }

    else if (currentStatusFilter === "completed") {

        displayedTasks = displayedTasks.filter(function (task) {

            return task.completed;

        });

    }

    // ---------------- PRIORITY FILTER ----------------

    if (currentPriorityFilter === "High") {

        displayedTasks = displayedTasks.filter(function (task) {

            return task.priority === "High";

        });

    }

    else if (currentPriorityFilter === "Medium") {

        displayedTasks = displayedTasks.filter(function (task) {

            return task.priority === "Medium";

        });

    }

    else if (currentPriorityFilter === "Low") {

        displayedTasks = displayedTasks.filter(function (task) {

            return task.priority === "Low";

        });

    }

    // ---------------- SORT ----------------

    if (currentSort === "newest") {

        displayedTasks.sort(function (a, b) {

            return b.id - a.id;

        });

    }

    else if (currentSort === "oldest") {

        displayedTasks.sort(function (a, b) {

            return a.id - b.id;

        });

    }

    else if (currentSort === "alphabetical") {

        displayedTasks.sort(function (a, b) {

            return a.name.localeCompare(b.name);

        });

    }

    else if (currentSort === "duedate") {

        displayedTasks.sort(function (a, b) {

            return a.dueDate.localeCompare(b.dueDate);

        });

    }

    renderTasks(displayedTasks);

}


function updateDashboard() {

    totalTasks.textContent = tasks.length;

    const completedCount = tasks.filter(function(task) {
        return task.completed;
    }).length;

    completedTasks.textContent = completedCount;

    const pendingCount = tasks.length - completedCount;

    pendingTasks.textContent = pendingCount;

    const progressPercentage =
        tasks.length === 0
            ? 0
            : (completedCount / tasks.length) * 100;

    progress.textContent = `${progressPercentage.toFixed(0)}%`;

    progressFill.style.width = `${progressPercentage}%`;

}
function saveTasks() {

    localStorage.setItem("tasks", JSON.stringify(tasks));

}
function loadTasks() {

    const storedTasks = localStorage.getItem("tasks");

    if (storedTasks === null) {

        tasks = [];

    } else {

        tasks = JSON.parse(storedTasks);

    }

    refreshUI();

}

function refreshUI() {

     updateDisplayedTasks();

    updateDashboard();

}


taskForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const taskName = taskNameInput.value.trim();
    const priority = prioritySelect.value;
    const dueDate = dueDateInput.value;

    const validation = validateTask(taskName, priority, dueDate);

if (!validation.valid) {

    showError(validation.message);

    return;

}

clearError();

    
    const task = {

        id: Date.now(),

        name: taskName,

        priority: priority,

        dueDate: dueDate,

        completed: false

    };

    tasks.push(task);
    saveTasks();
    refreshUI();
    resetTaskForm();
    showToast("Task added successfully!", "success");

});
searchInput.addEventListener("input", function (event) {

    currentSearchText = event.target.value
        .trim()
        .toLowerCase();

    updateDisplayedTasks();

});
statusFilter.addEventListener("change", function (event) {

    currentStatusFilter = event.target.value;

    updateDisplayedTasks();

});
priorityFilter.addEventListener("change", function (event) {

    currentPriorityFilter = event.target.value;

    updateDisplayedTasks();

});

sortTask.addEventListener("change", function (event) {

    currentSort = event.target.value;

    updateDisplayedTasks();

});

themeToggle.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {

        themeToggle.textContent = "☀️ Light Mode";

    } else {

        themeToggle.textContent = "🌙 Dark Mode";

    }
    if (document.body.classList.contains("dark-mode")) {

    localStorage.setItem("theme", "dark");

} else {

    localStorage.setItem("theme", "light");

}

});

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {

    document.body.classList.add("dark-mode");

    themeToggle.textContent = "☀️ Light Mode";

} else {

    themeToggle.textContent = "🌙 Dark Mode";

}

loadTasks();