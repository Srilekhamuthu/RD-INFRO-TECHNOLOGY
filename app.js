document.getElementById('task-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const taskInput = document.getElementById('task-input');
    const taskDescription = taskInput.value.trim();

    const startTimeInput = document.getElementById('start-time');
    const startTime = startTimeInput.value;

    const endTimeInput = document.getElementById('task-time');
    const endTime = endTimeInput.value;

    // Check if all fields are filled
    if (taskDescription !== '' && startTime !== '' && endTime !== '') {
        addTask(taskDescription, startTime, endTime);

        // Clear input fields after adding the task
        taskInput.value = '';
        startTimeInput.value = '';
        endTimeInput.value = '';
    }
});

function addTask(description, startTime, endTime) {
    const taskList = document.getElementById('task-list');

    const li = document.createElement('li');

    li.textContent = `Task: ${description} | Achieving Line: ${startTime} to ${endTime}`;

    // Click to mark as completed
    li.addEventListener('click', function () {
        li.classList.toggle('completed');
    });

    // Right-click to delete
    li.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        li.remove();
    });

    taskList.appendChild(li);
}
