let token = localStorage.getItem("token");
let currentUser = null;
const API_URL = "http://localhost:3000/api";
const PAGE_SIZE = 10;

let currentView = "kanban";
let currentMonth = new Date();
let currentProjectFilter = "";

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
    calendar: "Calendario",
  };
  document.getElementById("page-title").textContent =
    titles[section] || section;
  loadSectionData(section);
}

function loadSectionData(section) {
  if (section === "dashboard") loadDashboard();
  if (section === "projects") {
    loadProjectsAll();
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
  if (section === "calendar") loadCalendar();
}

function refreshData() {
  const activeSection =
    document.querySelector(".nav-item.active")?.dataset.section || "dashboard";
  loadSectionData(activeSection);
}

async function loadDashboard() {
  try {
    const [projectsRes, tasksRes] = await Promise.all([
      fetch(`${API_URL}/projects`),
      fetch(`${API_URL}/tasks`),
    ]);
    const projects = await projectsRes.json();
    const tasks = await tasksRes.json();

    document.getElementById("stat-projects").textContent = projects.length;
    document.getElementById("stat-completed").textContent = tasks.filter(
      (t) => t.status === "completed",
    ).length;
    document.getElementById("stat-pending").textContent = tasks.filter(
      (t) => t.status === "pending" || t.status === "in_progress",
    ).length;
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("stat-overdue").textContent = tasks.filter(
      (t) => t.due_date && t.due_date < today && t.status !== "completed",
    ).length;

    renderProjectsList(projects.slice(0, 5));
  } catch (err) {
    console.error(err);
  }
}

function renderProjectsList(projects) {
  if (!projects.length) {
    document.getElementById("projects-list").innerHTML =
      '<div class="empty-state"><i class="fas fa-folder-open empty-icon"></i><p>Nessun progetto trovato</p></div>';
    return;
  }
  document.getElementById("projects-list").innerHTML = `
    <table class="table">
      <thead><tr><th>Nome</th><th>Stato</th><th>Progresso</th><th>Data Fine</th></tr></thead>
      <tbody>${projects
        .map(
          (p) => `
        <tr>
          <td><strong>${p.name}</strong><br><small class="text-muted">${p.description || ""}</small></td>
          <td><span class="badge badge-${p.status || "planning"}">${p.status === "planning" ? "Pianificazione" : p.status === "active" ? "Attivo" : p.status === "on_hold" ? "In Pausa" : "Completato"}</span></td>
          <td><div class="progress-bar" style="width: 100px;"><div class="progress-fill" style="width: ${p.progress || 0}%"></div></div></td>
          <td>${p.end_date || "-"}</td>
        </tr>
      `,
        )
        .join("")}</tbody>
    </table>`;
}

if (token) {
  showMainApp();
}

document.querySelectorAll(".nav-item").forEach((el) =>
  el.addEventListener("click", (e) => {
    e.preventDefault();
    showSection(el.dataset.section);
  }),
);

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value,
    password = document.getElementById("password").value;
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

async function loadProjectsAll() {
  try {
    const res = await fetch(`${API_URL}/projects`);
    const projects = await res.json();
    renderProjectsAllList(projects);
  } catch (err) {
    console.error(err);
  }
}

function renderProjectsAllList(projects) {
  if (!projects.length) {
    document.getElementById("projects-all-list").innerHTML =
      '<div class="empty-state">Nessun progetto</div>';
    return;
  }
  document.getElementById("projects-all-list").innerHTML = `
    <table class="table">
      <thead><tr><th>Nome</th><th>Descrizione</th><th>Stato</th><th>Progresso</th><th>Inizio</th><th>Fine</th></tr></thead>
      <tbody>${projects
        .map(
          (p) => `
        <tr><td><strong>${p.name}</strong></td><td>${p.description || "-"}</td><td><span class="badge badge-${p.status || "planning"}">${p.status || "planning"}</span></td><td><div class="progress-bar" style="width: 60px;"><div class="progress-fill" style="width: ${p.progress || 0}%"></div></div></td><td>${p.start_date || "-"}</td><td>${p.end_date || "-"}</td></tr>
      `,
        )
        .join("")}</tbody>
    </table>`;
}

document
  .getElementById("project-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("project-name").value,
      description = document.getElementById("project-desc").value,
      start_date = document.getElementById("project-start").value,
      end_date = document.getElementById("project-end").value,
      status = document.getElementById("project-status").value,
      color = document.getElementById("project-color").value;
    try {
      const res = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          start_date,
          end_date,
          status,
          color,
        }),
      });
      if (res.ok) {
        document.getElementById("project-form").reset();
        loadProjectsAll();
        loadDashboard();
      } else {
        alert("Errore");
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
    document.getElementById("task-project-filter").innerHTML =
      `<option value="">Tutti i Progetti</option>${options}`;
    document.getElementById("dwg-project").innerHTML = options;
  } catch (err) {
    console.error(err);
  }
}

function switchTaskView(view) {
  currentView = view;
  document
    .querySelectorAll(".view-tab")
    .forEach((t) => t.classList.remove("active"));
  document.querySelector(`[data-view="${view}"]`).classList.add("active");
  document
    .getElementById("tasks-kanban")
    .classList.toggle("hidden", view !== "kanban");
  document
    .getElementById("tasks-list")
    .classList.toggle("hidden", view !== "list");
  document
    .getElementById("tasks-gantt")
    .classList.toggle("hidden", view !== "gantt");
  loadTasks();
}

async function loadTasks() {
  currentProjectFilter = document.getElementById("task-project-filter").value;
  const statusFilter = document.getElementById("task-status-filter").value;
  try {
    let url = `${API_URL}/tasks`;
    if (currentProjectFilter) url += `?project_id=${currentProjectFilter}`;
    const res = await fetch(url);
    let tasks = await res.json();
    if (statusFilter) tasks = tasks.filter((t) => t.status === statusFilter);

    if (currentView === "kanban") renderKanban(tasks);
    else if (currentView === "list") renderTaskList(tasks);
    else if (currentView === "gantt") renderGantt(tasks);
  } catch (err) {
    console.error(err);
  }
}

function renderKanban(tasks) {
  const columns = {
    pending: [],
    in_progress: [],
    in_review: [],
    completed: [],
  };
  tasks.forEach((t) => {
    if (columns[t.status]) columns[t.status].push(t);
    else columns.pending.push(t);
  });

  document.getElementById("count-pending").textContent = columns.pending.length;
  document.getElementById("count-in_progress").textContent =
    columns.in_progress.length;
  document.getElementById("count-in_review").textContent =
    columns.in_review.length;
  document.getElementById("count-completed").textContent =
    columns.completed.length;

  ["pending", "in_progress", "in_review", "completed"].forEach((status) => {
    document.getElementById(`kanban-${status}`).innerHTML = columns[status]
      .map(
        (t) => `
      <div class="kanban-card priority-${t.priority}" onclick="openTaskModal('${t.id}')">
        <div class="kanban-card-title">${t.title}</div>
        <div class="kanban-card-meta">
          <span class="badge badge-${t.priority}">${t.priority}</span>
          <span>${t.due_date || ""}</span>
        </div>
        ${t.progress > 0 ? `<div class="progress-bar"><div class="progress-fill" style="width: ${t.progress}%"></div></div>` : ""}
      </div>
    `,
      )
      .join("");
  });
}

function renderTaskList(tasks) {
  if (!tasks.length) {
    document.getElementById("tasks-list").innerHTML =
      '<div class="empty-state">Nessun task</div>';
    return;
  }
  document.getElementById("tasks-list").innerHTML = `
    <table class="table">
      <thead><tr><th>Task</th><th>Progetto</th><th>Stato</th><th>Priorità</th><th>Progresso</th><th>Data Fine</th></tr></thead>
      <tbody>${tasks
        .map(
          (t) => `
        <tr>
          <td><strong>${t.title}</strong><br><small class="text-muted">${t.description || ""}</small></td>
          <td>${t.project_name || t.project_id || "-"}</td>
          <td><span class="badge badge-${t.status}">${t.status}</span></td>
          <td><span class="badge badge-${t.priority}">${t.priority}</span></td>
          <td><div class="progress-bar" style="width: 60px;"><div class="progress-fill" style="width: ${t.progress || 0}%"></div></div></td>
          <td>${t.due_date || "-"}</td>
        </tr>
      `,
        )
        .join("")}</tbody>
    </table>`;
}

function renderGantt(tasks) {
  const tasksWithDates = tasks.filter((t) => t.start_date && t.due_date);
  if (!tasksWithDates.length) {
    document.getElementById("tasks-gantt").innerHTML =
      '<div class="empty-state">Nessun task con date</div>';
    return;
  }

  const startDate = new Date(
    Math.min(...tasksWithDates.map((t) => new Date(t.start_date))),
  );
  const endDate = new Date(
    Math.max(...tasksWithDates.map((t) => new Date(t.due_date))),
  );
  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;

  let html =
    '<div class="gantt-header"><div class="gantt-task-name">Task</div><div class="gantt-timeline">';
  for (let i = 0; i < Math.min(days, 60); i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    html += `<div class="gantt-day">${d.getDate()}</div>`;
  }
  html += "</div></div>";

  tasksWithDates.forEach((t) => {
    const start = Math.ceil(
      (new Date(t.start_date) - startDate) / (1000 * 60 * 60 * 24),
    );
    const duration =
      Math.ceil(
        (new Date(t.due_date) - new Date(t.start_date)) / (1000 * 60 * 60 * 24),
      ) + 1;
    const left = start * 40;
    const width = Math.max(duration * 40, 20);
    html += `<div class="gantt-row"><div class="gantt-task-name">${t.title}</div><div class="gantt-timeline"><div class="gantt-bar" style="left: ${left}px; width: ${width}px; background: var(--${t.status === "completed" ? "success" : t.status === "in_progress" ? "primary" : "warning"})"></div></div></div>`;
  });

  document.getElementById("tasks-gantt").innerHTML = html;
}

document.getElementById("task-form")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const project_id = document.getElementById("task-project").value,
    title = document.getElementById("task-title").value,
    description = document.getElementById("task-desc").value,
    priority = document.getElementById("task-priority").value;
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
    }
  } catch (err) {
    alert("Errore");
  }
});

async function loadDwgFiles() {
  try {
    const res = await fetch(`${API_URL}/dwg`);
    const files = await res.json();
    renderDwgList(files);
  } catch (err) {
    console.error(err);
  }
}

function renderDwgList(files) {
  if (!files.length) {
    document.getElementById("dwg-list").innerHTML =
      '<div class="empty-state">Nessun file</div>';
    return;
  }
  document.getElementById("dwg-list").innerHTML = `
    <table class="table">
      <thead><tr><th>Nome</th><th>Versione</th><th>Progetto</th><th>Data</th></tr></thead>
      <tbody>${files.map((f) => `<tr><td><i class="fas fa-file-alt"></i> ${f.name}</td><td>${f.version || "1.0"}</td><td>${f.project_id || "-"}</td><td>${f.uploaded_at ? new Date(f.uploaded_at).toLocaleDateString() : "-"}</td></tr>`).join("")}</tbody>
    </table>`;
}

document.getElementById("dwg-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const project_id = document.getElementById("dwg-project").value,
    name = document.getElementById("dwg-name").value,
    version = document.getElementById("dwg-version").value;
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
    }
  } catch (err) {
    alert("Errore");
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
    renderMappingsList(mappings);
  } catch (err) {
    console.error(err);
  }
}

function renderMappingsList(mappings) {
  if (!mappings.length) {
    document.getElementById("mappings-list").innerHTML =
      '<div class="empty-state">Nessun mapping</div>';
    return;
  }
  document.getElementById("mappings-list").innerHTML = `
    <table class="table">
      <thead><tr><th>Layer</th><th>Handle</th><th>Campo Task</th><th>Campo Planning</th></tr></thead>
      <tbody>${mappings.map((m) => `<tr><td>${m.layer || "-"}</td><td>${m.handle || "-"}</td><td>${m.task_field}</td><td>${m.planning_field || "-"}</td></tr>`).join("")}</tbody>
    </table>`;
}

document
  .getElementById("mapping-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const dwg_file_id = document.getElementById("mapping-dwg").value,
      layer = document.getElementById("mapping-layer").value,
      handle = document.getElementById("mapping-handle").value,
      task_field = document.getElementById("mapping-task-field").value,
      planning_field = document.getElementById("mapping-planning-field").value;
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
      }
    } catch (err) {
      alert("Errore");
    }
  });

function changeMonth(delta) {
  currentMonth.setMonth(currentMonth.getMonth() + delta);
  loadCalendar();
}

function loadCalendar() {
  const year = currentMonth.getFullYear(),
    month = currentMonth.getMonth();
  document.getElementById("calendar-title").textContent =
    currentMonth.toLocaleDateString("it-IT", {
      month: "long",
      year: "numeric",
    });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  let html = "";
  const days = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
  days.forEach((d) => (html += `<div class="calendar-header">${d}</div>`));

  for (let i = 0; i < firstDay; i++)
    html += `<div class="calendar-day other-month"></div>`;
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const isToday =
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year;
    html += `<div class="calendar-day ${isToday ? "today" : ""}"><div class="calendar-date">${day}</div></div>`;
  }

  document.getElementById("calendar-grid").innerHTML = html;
}
