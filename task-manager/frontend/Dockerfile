FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies with legacy peer deps to resolve conflicts
RUN npm install --legacy-peer-deps

# Copy the rest of the app
COPY . .

# Create a directory for the web app
RUN mkdir -p /app/web-build

# Create a simple index.html file that can load the app info
RUN echo '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Task Manager</title><style>body{font-family:sans-serif;margin:20px;} h1{color:#6200ee;} .tasks{margin-top:20px;} .task{background:#f5f5f5;padding:10px;margin-bottom:10px;border-radius:4px;}</style></head><body><h1>Task Manager</h1><p>Loading tasks...</p><div id="tasks" class="tasks"></div><script>fetch("http://localhost:4000/api/tasks").then(r=>r.json()).then(data=>{const tasksDiv=document.getElementById("tasks");tasksDiv.innerHTML="";data.forEach(task=>{const div=document.createElement("div");div.className="task";div.innerHTML=`<h3>${task.title}</h3><p>${task.description || ""}</p><p>Status: ${task.status}</p>`;tasksDiv.appendChild(div);});document.querySelector("p").remove();}).catch(err=>{document.querySelector("p").textContent="Error loading tasks. Backend might not be running.";console.error(err);});</script></body></html>' > /app/web-build/index.html

# Expose port
EXPOSE 19006

# Install a simple HTTP server to serve the static content
RUN npm install -g http-server

# Start the HTTP server
CMD ["http-server", "web-build", "-p", "19006", "--cors", "-a", "0.0.0.0"] 