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
`;

        taskContainer.appendChild(taskCard);

    });

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

    renderTasks();

});