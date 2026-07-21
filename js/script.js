const taskForm = document.getElementById("task-form");
const taskNameInput = document.getElementById("task-name");
const prioritySelect = document.getElementById("priority");
const dueDateInput = document.getElementById("due-date");
const taskContainer = document.getElementById("task-container");

const totalTasks = document.getElementById("total-tasks");
const pendingTasks = document.getElementById("pending-tasks");
const completedTasks = document.getElementById("completed-tasks");
const progress = document.getElementById("progress");

console.log(taskForm);
console.log(taskNameInput);
console.log(prioritySelect);
console.log(dueDateInput);

let tasks=[];
function renderTasks() {

    taskContainer.innerHTML = "";

    tasks.forEach(function(task){

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

        refreshUI();
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


    refreshUI();

    });

});

}
function updateDashboard(){
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
}

function refreshUI() {

    renderTasks();

    updateDashboard();

}
taskForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const taskName = taskNameInput.value;
    const priority = prioritySelect.value;
    const dueDate = dueDateInput.value;

    
    const task = {

        id: Date.now(),

        name: taskName,

        priority: priority,

        dueDate: dueDate,

        completed: false

    };

    tasks.push(task);
    refreshUI();

});