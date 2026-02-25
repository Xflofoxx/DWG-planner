const express = require('express')
const bodyParser = require('body-parser')
const { v4: uuidv4 } = require('uuid')
const sqlite3 = require('sqlite3').verbose()
const path = require('path')

// Initialize SQLite DB (file-based for MVP)
const dbFile = path.join(__dirname, 'dwg_planner.db')
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) console.error('DB error', err)
})

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) return reject(err)
      resolve(this)
    })
  })
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) return reject(err)
      resolve(row)
    })
  })
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) return reject(err)
      resolve(rows)
    })
  })
}

function initDB(){
  // Create tables if not exist
  const statements = [
    `CREATE TABLE IF NOT EXISTS dwg_file (id TEXT PRIMARY KEY, project_id TEXT, name TEXT, version TEXT, uploaded_at TEXT, size INTEGER, mime_type TEXT)`,
    `CREATE TABLE IF NOT EXISTS dwg_object (id TEXT PRIMARY KEY, dwg_id TEXT, object_id TEXT, type TEXT, properties TEXT)`,
    `CREATE TABLE IF NOT EXISTS task (id TEXT PRIMARY KEY, project_id TEXT, title TEXT, description TEXT, start_at TEXT, end_at TEXT, status TEXT, dwg_object_ids TEXT, assigned_resource_ids TEXT, notes TEXT)`,
    `CREATE TABLE IF NOT EXISTS resource (id TEXT PRIMARY KEY, user_id TEXT, role TEXT, availability TEXT)`,
    `CREATE TABLE IF NOT EXISTS assignment (id TEXT PRIMARY KEY, task_id TEXT, resource_id TEXT, allocation_start TEXT, allocation_end TEXT)`,
    `CREATE TABLE IF NOT EXISTS client (id TEXT PRIMARY KEY, user_id TEXT, email TEXT, passwordless_enabled INTEGER)`,
    `CREATE TABLE IF NOT EXISTS audit (id TEXT PRIMARY KEY, timestamp TEXT, user_id TEXT, action TEXT, details TEXT, project_id TEXT)`
  ]
  return Promise.all(statements.map(s => run(s)))
}

const app = express()
const PORT = process.env.PORT || 3002
app.use(bodyParser.json())

// In-memory token store for passwordless (simple MVP)
const tokens = {}

app.post('/login/passwordless', (req, res) => {
  const { email } = req.body
  if(!email) return res.status(400).json({ error: 'email required' })
  const token = uuidv4()
  tokens[token] = { email, expires: Date.now() + 15*60*1000 }
  res.json({ login_token: token, expiry: 15 * 60 })
})

app.post('/login/passwordless/verify', (req, res) => {
  const { login_token } = req.body
  const t = tokens[login_token]
  if(!t || t.expires < Date.now()) return res.status(400).json({ error: 'invalid or expired token' })
  delete tokens[login_token]
  res.json({ access_token: 'mock-client-token', expires_in: 3600 })
})

// DWG ingestion
app.post('/projects/:project_id/dwg', async (req, res) => {
  const { project_id } = req.params
  const { name, version } = req.body
  if(!name) return res.status(400).json({ error: 'name required' })
  const id = uuidv4()
  const uploaded_at = new Date().toISOString()
  await run('INSERT INTO dwg_file (id, project_id, name, version, uploaded_at, size, mime_type) VALUES (?,?,?,?,?,?,?)', [id, project_id, name, version || '1.0', uploaded_at, 0, 'application/dwg'])
  res.json({ dwg_id: id, project_id, name, version: version || '1.0', uploaded_at })
})

app.get('/projects/:project_id/dwg', async (req, res) => {
  const { project_id } = req.params
  const rows = await all('SELECT * FROM dwg_file WHERE project_id = ?', [project_id])
  res.json(rows)
})

// DWG Object mapping
app.post('/dwg/:dwg_id/objects/map', async (req, res) => {
  const { dwg_id } = req.params
  const { object_id, type, properties, task_id } = req.body
  if(!object_id || !type) return res.status(400).json({ error: 'object_id and type required' })
  const id = uuidv4()
  await run('INSERT INTO dwg_object (id, dwg_id, object_id, type, properties) VALUES (?,?,?,?,?)', [id, dwg_id, object_id, type, JSON.stringify(properties || {})])
  // Optional: attach to task if provided
  if (task_id){
    const t = await get('SELECT * FROM task WHERE id = ?', [task_id])
    if (t){
      const curr = JSON.parse(t.dwg_object_ids || '[]')
      curr.push(id)
      await run('UPDATE task SET dwg_object_ids = ? WHERE id = ?', [JSON.stringify(curr), task_id])
    }
  }
  res.json({ mapping_id: id, dwg_id, object_id })
})

app.get('/dwg/:dwg_id/objects', async (req, res) => {
  const { dwg_id } = req.params
  const rows = await all('SELECT * FROM dwg_object WHERE dwg_id = ?', [dwg_id])
  res.json(rows)
})

// Tasks
app.post('/tasks', async (req, res) => {
  const { project_id, title, start_at, end_at, dwg_object_ids, assigned_resource_ids, description } = req.body
  if(!project_id || !title) return res.status(400).json({ error: 'project_id and title required' })
  const id = uuidv4()
  const status = 'planned'
  await run('INSERT INTO task (id, project_id, title, description, start_at, end_at, status, dwg_object_ids, assigned_resource_ids, notes) VALUES (?,?,?,?,?,?,?,?,?,?)', [id, project_id, title, description || '', start_at, end_at, status, JSON.stringify(dwg_object_ids || []), JSON.stringify(assigned_resource_ids || []), ''])
  res.json({ task_id: id, status })
})

app.patch('/tasks/:task_id', async (req, res) => {
  const { task_id } = req.params
  const { status, start_at, end_at, notes } = req.body
  if (status){ await run('UPDATE task SET status = ? WHERE id = ?', [status, task_id]) }
  if (start_at){ await run('UPDATE task SET start_at = ? WHERE id = ?', [start_at, task_id]) }
  if (end_at){ await run('UPDATE task SET end_at = ? WHERE id = ?', [end_at, task_id]) }
  if (notes !== undefined){ await run('UPDATE task SET notes = ? WHERE id = ?', [notes, task_id]) }
  res.json({ task_id, status })
})

// Resources
app.post('/resources', async (req, res) => {
  const { user_id, role, availability } = req.body
  const id = uuidv4()
  await run('INSERT INTO resource (id, user_id, role, availability) VALUES (?,?,?,?)', [id, user_id, role, JSON.stringify(availability || [])])
  res.json({ resource_id: id })
})

app.post('/tasks/:task_id/assignments', async (req, res) => {
  const { task_id } = req.params
  const { resource_id, allocation_start, allocation_end } = req.body
  const id = uuidv4()
  await run('INSERT INTO assignment (id, task_id, resource_id, allocation_start, allocation_end) VALUES (?,?,?,?,?)', [id, task_id, resource_id, allocation_start, allocation_end])
  res.json({ assignment_id: id })
})

// Health
app.get('/health', (req, res) => res.json({ ok: true }))

// Init DB and start server
initDB().then(()=>{
  app.listen(PORT, () => console.log('DWG Planner MVP server running at http://localhost:' + PORT))
})
.catch(err => {
  console.error('DB init error', err)
})
