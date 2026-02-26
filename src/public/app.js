let token = localStorage.getItem("token");
let currentUser = null;
const API_URL = "http://localhost:3000/api";
const PAGE_SIZE = 10;

const paginationState = {
  projects: { page: 1, total: 0 },
  tasks: { page: 1, total: 0 },
  dwg: { page: 1, total: 0 },
  mappings: { page: 1, total: 0 },
};

function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("collapsed");
}

function showSection(section) {
  document
    .querySelectorAll(".nav-item")
    .forEach((el) => el.classList.remove("active"));
  document
    .querySelector(`[data-section="${section}"]`)
    ?.classList.add("active");

  document
    .querySelectorAll("section")
    .forEach((el) => el.classList.add("hidden"));
  document.getElementById(`${section}-section`).classList.remove("hidden");

  const titles = {
    dashboard: "Dashboard",
    projects: "Progetti",
    tasks: "Task",
    dwg: "File DWG",
    mappings: "Mapping",
  };
  document.getElementById("page-title").textContent =
    titles[section] || section;

  loadSectionData(section);
}

function loadSectionData(section) {
  if (section === "dashboard") loadDashboard();
  if (section === "projects") {
    loadProjects();
    loadProjectsForSelect();
  }
  if (section === "tasks") {
    loadTasks();
    loadProjectsForSelect();
  }
  if (section === "dwg") {
    loadDwgFiles();
    loadProjectsForSelect();
  }
  if (section === "mappings") {
    loadMappings();
    loadDwgFilesForMapping();
  }
}

function refreshData() {
  const activeSection =
    document.querySelector(".nav-item.active")?.dataset.section || "dashboard";
  loadSectionData(activeSection);
}

async function loadDashboard() {
  try {
    const [projectsRes, tasksRes, dwgRes, mappingsRes] = await Promise.all([
      fetch(`${API_URL}/projects`),
      fetch(`${API_URL}/tasks`),
      fetch(`${API_URL}/dwg`),
      fetch(`${API_URL}/mappings`),
    ]);

    document.getElementById("stat-projects").textContent = (
      await projectsRes.json()
    ).length;
    document.getElementById("stat-tasks").textContent = (
      await tasksRes.json()
    ).length;
    document.getElementById("stat-dwg").textContent = (
      await dwgRes.json()
    ).length;
    document.getElementById("stat-mappings").textContent = (
      await mappingsRes.json()
    ).length;
  } catch (err) {
    console.error(err);
  }
}

if (token) {
  showMainApp();
}

document.querySelectorAll(".nav-item").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    showSection(el.dataset.section);
  });
});

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
      currentUser = data.user;
      localStorage.setItem("token", token);
      showMainApp();
    } else {
      document.getElementById("login-error").textContent =
        data.message || "Login fallito";
    }
  } catch (err) {
    document.getElementById("login-error").textContent =
      "Errore di connessione";
  }
});

function logout() {
  token = null;
  currentUser = null;
  localStorage.removeItem("token");
  document.getElementById("login-section").classList.remove("hidden");
  document.getElementById("app-section").classList.add("hidden");
}

function showMainApp() {
  document.getElementById("login-section").classList.add("hidden");
  document.getElementById("app-section").classList.remove("hidden");

  if (currentUser) {
    document.getElementById("user-name").textContent = currentUser.email;
    document.getElementById("user-role").textContent = currentUser.role;
    document.getElementById("user-avatar").textContent = currentUser.email
      .charAt(0)
      .toUpperCase();
  }

  loadDashboard();
}

async function loadProjects() {
  const { page } = paginationState.projects;
  try {
    const res = await fetch(
      `${API_URL}/projects?page=${page}&limit=${PAGE_SIZE}`,
    );
    const projects = await res.json();

    const totalRes = await fetch(`${API_URL}/projects`);
    const allProjects = await totalRes.json();
    paginationState.projects.total = allProjects.length;

    const list = document.getElementById("projects-list");
    if (projects.length === 0) {
      list.innerHTML = '<div class="empty-state">Nessun progetto trovato</div>';
    } else {
      list.innerHTML = `
        <table class="table">
          <thead><tr><th>Nome</th><th>Descrizione</th><th>Creato</th></tr></thead>
          <tbody>
            ${projects
              .map(
                (p) => `
              <tr>
                <td>${p.name}</td>
                <td>${p.description || "-"}</td>
                <td>${new Date(p.created_at).toLocaleDateString()}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      `;
    }

    renderPagination("projects", projects.length);
  } catch (err) {
    console.error(err);
  }
}

function renderPagination(type, count) {
  const { page, total } = paginationState[type];
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const container = document.getElementById(`${type}-pagination`);

  if (totalPages <= 1) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = `
    <button class="pagination-btn" onclick="changePage('${type}', ${page - 1})" ${page === 1 ? "disabled" : ""}>Precedente</button>
    <span class="pagination-info">Pagina ${page} di ${totalPages}</span>
    <button class="pagination-btn" onclick="changePage('${type}', ${page + 1})" ${page >= totalPages ? "disabled" : ""}>Successivo</button>
  `;
}

function changePage(type, page) {
  paginationState[type].page = page;
  if (type === "projects") loadProjects();
  else if (type === "tasks") loadTasks();
  else if (type === "dwg") loadDwgFiles();
  else if (type === "mappings") loadMappings();
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
  const { page } = paginationState.tasks;
  try {
    const res = await fetch(`${API_URL}/tasks?page=${page}&limit=${PAGE_SIZE}`);
    const tasks = await res.json();

    const totalRes = await fetch(`${API_URL}/tasks`);
    paginationState.tasks.total = (await totalRes.json()).length;

    const list = document.getElementById("tasks-list");
    if (tasks.length === 0) {
      list.innerHTML = '<div class="empty-state">Nessun task trovato</div>';
    } else {
      list.innerHTML = `
        <table class="table">
          <thead><tr><th>Titolo</th><th>Stato</th><th>Priorità</th><th>Progetto</th></tr></thead>
          <tbody>
            ${tasks
              .map(
                (t) => `
              <tr>
                <td>${t.title}</td>
                <td><span class="badge badge-${t.status}">${t.status}</span></td>
                <td><span class="badge badge-${t.priority}">${t.priority}</span></td>
                <td>${t.project_id || "-"}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      `;
    }

    renderPagination("tasks", tasks.length);
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
      body: JSON.stringify({ project_id, title, description, priority }),
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
  const { page } = paginationState.dwg;
  try {
    const res = await fetch(`${API_URL}/dwg?page=${page}&limit=${PAGE_SIZE}`);
    const files = await res.json();

    const totalRes = await fetch(`${API_URL}/dwg`);
    paginationState.dwg.total = (await totalRes.json()).length;

    const list = document.getElementById("dwg-list");
    if (files.length === 0) {
      list.innerHTML = '<div class="empty-state">Nessun file DWG trovato</div>';
    } else {
      list.innerHTML = `
        <table class="table">
          <thead><tr><th>Nome</th><th>Versione</th><th>Dimensione</th><th>Data</th></tr></thead>
          <tbody>
            ${files
              .map(
                (f) => `
              <tr>
                <td>${f.name}</td>
                <td>${f.version || "1.0"}</td>
                <td>${f.size || 0} bytes</td>
                <td>${new Date(f.uploaded_at).toLocaleDateString()}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      `;
    }

    renderPagination("dwg", files.length);
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
  const { page } = paginationState.mappings;
  try {
    const res = await fetch(
      `${API_URL}/mappings?page=${page}&limit=${PAGE_SIZE}`,
    );
    const mappings = await res.json();

    const totalRes = await fetch(`${API_URL}/mappings`);
    paginationState.mappings.total = (await totalRes.json()).length;

    const list = document.getElementById("mappings-list");
    if (mappings.length === 0) {
      list.innerHTML = '<div class="empty-state">Nessun mapping trovato</div>';
    } else {
      list.innerHTML = `
        <table class="table">
          <thead><tr><th>Layer</th><th>Handle</th><th>Campo Task</th><th>Campo Planning</th></tr></thead>
          <tbody>
            ${mappings
              .map(
                (m) => `
              <tr>
                <td>${m.layer || "-"}</td>
                <td>${m.handle || "-"}</td>
                <td>${m.task_field}</td>
                <td>${m.planning_field || "-"}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
      `;
    }

    renderPagination("mappings", mappings.length);
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
