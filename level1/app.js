// ✅ Handle form submit to save new task
document.getElementById('task-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const taskInput = document.getElementById('task-input');
    const description = taskInput.value.trim();

    const startTimeInput = document.getElementById('start-time');
    const startTime = startTimeInput.value;

    const endTimeInput = document.getElementById('task-time');
    const endTime = endTimeInput.value;

    if (description !== '' && startTime !== '' && endTime !== '') {
        fetch('http://localhost:3000/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description, startTime, endTime })
        })
        .then(response => response.json())
        .then(data => {
            console.log('✅ Task saved:', data);
            alert('✅ Task saved successfully to backend!');
            fetchTasksFromBackend();  // ✅ Reload task list after saving
        })
        .catch(error => {
            console.error('❌ Error:', error);
            alert('❌ Failed to save task. Please check server.');
        });

        // ✅ Clear form fields
        taskInput.value = '';
        startTimeInput.value = '';
        endTimeInput.value = '';
    } else {
        alert('❌ Please fill all fields!');
    }
});

// ✅ Fetch and display tasks from backend
function fetchTasksFromBackend() {
    fetch('http://localhost:3000/tasks')
    .then(response => response.json())
    .then(tasks => {
        const taskList = document.getElementById('backend-task-list');
        taskList.innerHTML = '';  // ✅ Clear existing tasks before loading new

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = `${task.description} (From: ${task.startTime} To: ${task.endTime})`;

            // ✅ Create Delete Button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.style.marginLeft = '10px';
            deleteButton.addEventListener('click', function () {
                deleteTaskFromBackend(task._id);
            });

            li.appendChild(deleteButton);
            taskList.appendChild(li);
        });
    })
    .catch(error => {
        console.error('❌ Error fetching tasks from backend:', error);
    });
}

// ✅ Delete a task from backend
function deleteTaskFromBackend(taskId) {
    fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        fetchTasksFromBackend();  // ✅ Refresh task list after deletion
    })
    .catch(error => {
        console.error('❌ Error deleting task:', error);
    });
}

// ✅ Fetch tasks on page load
window.onload = fetchTasksFromBackend;
