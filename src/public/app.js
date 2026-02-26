let token = localStorage.getItem("token");
const API_URL = "http://localhost:3000/api";

if (token) {
  showMainApp();
}

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      token = data.token;
      localStorage.setItem("token", token);
      showMainApp();
    } else {
      alert(data.message || "Login fallito");
    }
  } catch (err) {
    alert("Errore di connessione");
  }
});

async function register() {
  const email = prompt("Email:");
  const password = prompt("Password:");
  if (!email || !password) return;

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("Registrazione completata! Effettua il login.");
    } else {
      alert(data.message || "Registrazione fallita");
    }
  } catch (err) {
    alert("Errore di connessione");
  }
}

function logout() {
  token = null;
  localStorage.removeItem("token");
  document.getElementById("auth-section").classList.remove("hidden");
  document.getElementById("main-app").classList.add("hidden");
}

function showMainApp() {
  document.getElementById("auth-section").classList.add("hidden");
  document.getElementById("main-app").classList.remove("hidden");
  loadProjects();
  loadProjectsForSelect();
}

function showSection(section) {
  ["projects", "tasks", "dwg", "mappings"].forEach((s) => {
    document.getElementById(`${s}-section`).classList.add("hidden");
  });
  document.getElementById(`${section}-section`).classList.remove("hidden");

  if (section === "projects") loadProjects();
  if (section === "tasks") loadTasks();
  if (section === "dwg") loadDwgFiles();
  if (section === "mappings") {
    loadDwgFilesForMapping();
    loadMappings();
  }
}

async function loadProjects() {
  try {
    const res = await fetch(`${API_URL}/projects`);
    const projects = await res.json();
    const list = document.getElementById("projects-list");
    list.innerHTML = projects
      .map(
        (p) => `
      <div class="card">
        <h3>${p.name}</h3>
        <p>${p.description || ""}</p>
        <p style="color: #7f8c8d; font-size: 12px;">Creato: ${new Date(p.created_at).toLocaleDateString()}</p>
      </div>
    `,
      )
      .join("");
  } catch (err) {
    console.error(err);
  }
}

document
  .getElementById("project-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("project-name").value;
    const description = document.getElementById("project-desc").value;

    try {
      const res = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description }),
      });
      if (res.ok) {
        document.getElementById("project-form").reset();
        loadProjects();
      } else {
        alert("Errore nella creazione del progetto");
      }
    } catch (err) {
      alert("Errore di connessione");
    }
  });

async function loadProjectsForSelect() {
  try {
    const res = await fetch(`${API_URL}/projects`);
    const projects = await res.json();
    const options = projects
      .map((p) => `<option value="${p.id}">${p.name}</option>`)
      .join("");
    document.getElementById("task-project").innerHTML = options;
    document.getElementById("dwg-project").innerHTML = options;
  } catch (err) {
    console.error(err);
  }
}

async function loadTasks() {
  try {
    const res = await fetch(`${API_URL}/tasks`);
    const tasks = await res.json();
    const list = document.getElementById("tasks-list");
    list.innerHTML = `
    <table>
      <thead><tr><th>Titolo</th><th>Stato</th><th>Priorità</th><th>Progetto</th></tr></thead>
      <tbody>
        ${tasks
          .map(
            (t) => `
          <tr>
            <td>${t.title}</td>
            <td><span class="badge badge-${t.status}">${t.status}</span></td>
            <td><span class="badge badge-${t.priority}">${t.priority}</span></td>
            <td>${t.project_id}</td>
          </tr>
        `,
          )
          .join("")}
      </tbody>
    </table>
  `;
  } catch (err) {
    console.error(err);
  }
}

document.getElementById("task-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const project_id = document.getElementById("task-project").value;
  const title = document.getElementById("task-title").value;
  const description = document.getElementById("task-desc").value;
  const priority = document.getElementById("task-priority").value;

  try {
    const res = await fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        project_id,
        title,
        description,
        priority,
      }),
    });
    if (res.ok) {
      document.getElementById("task-form").reset();
      loadTasks();
    } else {
      alert("Errore nella creazione del task");
    }
  } catch (err) {
    alert("Errore di connessione");
  }
});

async function loadDwgFiles() {
  try {
    const res = await fetch(`${API_URL}/dwg`);
    const files = await res.json();
    const list = document.getElementById("dwg-list");
    list.innerHTML = files
      .map(
        (f) => `
      <div class="card">
        <h3>${f.name}</h3>
        <p>Versione: ${f.version} | Size: ${f.size || 0} bytes</p>
        <p style="color: #7f8c8d; font-size: 12px;">Caricato: ${new Date(f.uploaded_at).toLocaleDateString()}</p>
      </div>
    `,
      )
      .join("");
  } catch (err) {
    console.error(err);
  }
}

document.getElementById("dwg-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const project_id = document.getElementById("dwg-project").value;
  const name = document.getElementById("dwg-name").value;
  const version = document.getElementById("dwg-version").value;

  try {
    const res = await fetch(`${API_URL}/dwg`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ project_id, name, version }),
    });
    if (res.ok) {
      document.getElementById("dwg-form").reset();
      loadDwgFiles();
    } else {
      alert("Errore nel caricamento del file");
    }
  } catch (err) {
    alert("Errore di connessione");
  }
});

async function loadDwgFilesForMapping() {
  try {
    const res = await fetch(`${API_URL}/dwg`);
    const files = await res.json();
    document.getElementById("mapping-dwg").innerHTML = files
      .map((f) => `<option value="${f.id}">${f.name}</option>`)
      .join("");
  } catch (err) {
    console.error(err);
  }
}

async function loadMappings() {
  try {
    const res = await fetch(`${API_URL}/mappings`);
    const mappings = await res.json();
    const list = document.getElementById("mappings-list");
    list.innerHTML = mappings
      .map(
        (m) => `
      <div class="card">
        <h3>DWG: ${m.dwg_file_id}</h3>
        <p>Layer: ${m.layer || "-"} | Handle: ${m.handle || "-"} | Tag: ${m.tag || "-"}</p>
        <p>Campo Task: ${m.task_field} | Campo Planning: ${m.planning_field || "-"}</p>
      </div>
    `,
      )
      .join("");
  } catch (err) {
    console.error(err);
  }
}

document
  .getElementById("mapping-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const dwg_file_id = document.getElementById("mapping-dwg").value;
    const layer = document.getElementById("mapping-layer").value;
    const handle = document.getElementById("mapping-handle").value;
    const tag = document.getElementById("mapping-tag").value;
    const task_field = document.getElementById("mapping-task-field").value;
    const planning_field = document.getElementById(
      "mapping-planning-field",
    ).value;

    try {
      const res = await fetch(`${API_URL}/mappings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          dwg_file_id,
          layer,
          handle,
          tag,
          task_field,
          planning_field,
        }),
      });
      if (res.ok) {
        document.getElementById("mapping-form").reset();
        loadMappings();
      } else {
        alert("Errore nella creazione del mapping");
      }
    } catch (err) {
      alert("Errore di connessione");
    }
  });
