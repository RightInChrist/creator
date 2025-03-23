FROM node:18-alpine

WORKDIR /app

# Install a simple static file server
RUN npm install -g http-server

# Create directory for web files
RUN mkdir -p /app/public

# Create a simple index.html file with React loaded from CDN
RUN echo '<!DOCTYPE html>\
<html lang="en">\
<head>\
  <meta charset="UTF-8">\
  <meta name="viewport" content="width=device-width, initial-scale=1.0">\
  <title>Task Manager</title>\
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>\
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>\
  <script src="https://unpkg.com/babel-standalone@6/babel.min.js"></script>\
  <style>\
    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }\
    h1 { color: #333; }\
    .container { max-width: 800px; margin: 0 auto; }\
    .btn { background: #4CAF50; color: white; border: none; padding: 10px 15px; margin: 5px; cursor: pointer; border-radius: 4px; }\
    .btn:hover { background: #45a049; }\
    .task-list { margin-top: 20px; }\
    .task-item { background: #f9f9f9; margin-bottom: 10px; padding: 10px; border-radius: 4px; }\
  </style>\
</head>\
<body>\
  <div id="root"></div>\
  <script type="text/babel">\
    const { useState, useEffect } = React;\
\
    function App() {\
      const [screen, setScreen] = useState("home");\
      const [tasks, setTasks] = useState([]);\
      const [newTask, setNewTask] = useState({ title: "", description: "" });\
\
      useEffect(() => {\
        if (screen === "list") {\
          fetchTasks();\
        }\
      }, [screen]);\
\
      const fetchTasks = async () => {\
        try {\
          const response = await fetch("http://localhost:4000/api/tasks");\
          const data = await response.json();\
          setTasks(data);\
        } catch (error) {\
          console.error("Error fetching tasks:", error);\
        }\
      };\
\
      const createTask = async () => {\
        try {\
          const response = await fetch("http://localhost:4000/api/tasks", {\
            method: "POST",\
            headers: {\
              "Content-Type": "application/json",\
            },\
            body: JSON.stringify(newTask),\
          });\
          const data = await response.json();\
          setNewTask({ title: "", description: "" });\
          setScreen("list");\
        } catch (error) {\
          console.error("Error creating task:", error);\
        }\
      };\
\
      const renderHome = () => (\
        <div className="container">\
          <h1>Task Manager</h1>\
          <p>Manage your tasks efficiently</p>\
          <button className="btn" onClick={() => setScreen("list")}>View Tasks</button>\
          <button className="btn" onClick={() => setScreen("create")}>Create Task</button>\
        </div>\
      );\
\
      const renderTaskList = () => (\
        <div className="container">\
          <h1>Tasks</h1>\
          <button className="btn" onClick={() => setScreen("home")}>Back to Home</button>\
          <button className="btn" onClick={() => setScreen("create")}>Create New Task</button>\
          <div className="task-list">\
            {tasks.length === 0 ? (\
              <p>No tasks found</p>\
            ) : (\
              tasks.map((task) => (\
                <div className="task-item" key={task.id}>\
                  <h3>{task.title}</h3>\
                  <p>{task.description}</p>\
                  <p>Status: {task.status}</p>\
                </div>\
              ))\
            )}\
          </div>\
        </div>\
      );\
\
      const renderCreateTask = () => (\
        <div className="container">\
          <h1>Create New Task</h1>\
          <button className="btn" onClick={() => setScreen("home")}>Back to Home</button>\
          <div>\
            <div style={{ marginBottom: "10px" }}>\
              <label>Title: </label>\
              <input\
                value={newTask.title}\
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}\
                style={{ padding: "5px", width: "100%" }}\
              />\
            </div>\
            <div style={{ marginBottom: "10px" }}>\
              <label>Description: </label>\
              <textarea\
                value={newTask.description}\
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}\
                style={{ padding: "5px", width: "100%", height: "100px" }}\
              />\
            </div>\
            <button className="btn" onClick={createTask}>Create Task</button>\
          </div>\
        </div>\
      );\
\
      const renderScreen = () => {\
        switch (screen) {\
          case "home":\
            return renderHome();\
          case "list":\
            return renderTaskList();\
          case "create":\
            return renderCreateTask();\
          default:\
            return renderHome();\
        }\
      };\
\
      return renderScreen();\
    }\
\
    ReactDOM.render(<App />, document.getElementById("root"));\
  </script>\
</body>\
</html>' > /app/public/index.html

# Expose port
EXPOSE 19006

# Start http-server on the specified port
CMD ["http-server", "/app/public", "-p", "19006", "--cors", "-a", "0.0.0.0"] 