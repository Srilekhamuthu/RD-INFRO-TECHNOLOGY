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
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                description: description,
                startTime: startTime,
                endTime: endTime
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Task saved:', data);
            alert('✅ Task saved successfully to backend!');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('❌ Failed to save task. Please check server.');
        });
    } else {
        alert('❌ Please fill all fields!');
    }
});
function fetchTasksFromBackend() {
    fetch('http://localhost:3000/tasks')
    .then(response => response.json())
    .then(tasks => {
        const taskList = document.getElementById('backend-task-list');
        taskList.innerHTML = ''; // Clear old list

        tasks.forEach(task => {
            const li = document.createElement('li');
            li.textContent = `${task.description} (From: ${task.startTime} To: ${task.endTime})`;
            taskList.appendChild(li);
        });
    })
    .catch(error => {
        console.error('Error fetching tasks from backend:', error);
    });
}

// ✅ Fetch backend tasks when page loads
window.onload = fetchTasksFromBackend;

