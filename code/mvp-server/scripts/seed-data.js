const sqlite3 = require('sqlite3').verbose()
const path = require('path')

const dbPath = path.join(__dirname, 'dwg_planner.db')
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) { console.error('DB error', err); process.exit(1) }
})

const now = new Date().toISOString()

const run = (sql, params) => new Promise((resolve, reject) => {
  db.run(sql, params, function(err){ if (err) reject(err); else resolve(this) })
})
const all = (sql, params) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => { if (err) reject(err); else resolve(rows) })
})

;(async () => {
  try {
    // seed sample data on top of existing schema
    await run('INSERT OR IGNORE INTO dwg_file (id, project_id, name, version, uploaded_at, size, mime_type) VALUES (?,?,?,?,?,?,?)', ['dwg1','proj-01','site.dwg','1.0', now, 2048, 'application/dwg'])
    await run('INSERT OR IGNORE INTO dwg_object (id, dwg_id, object_id, type, properties) VALUES (?,?,?,?,?)', ['obj1','dwg1','A1','LINE', JSON.stringify({ layer: 'L1', handle: '0x1' })])
    await run('INSERT OR IGNORE INTO task (id, project_id, title, description, start_at, end_at, status, dwg_object_ids, assigned_resource_ids, notes) VALUES (?,?,?,?,?,?,?,?,?,?)', ['t1','proj-01','Setup base','Initial setup', now, null, 'planned', JSON.stringify(['obj1']), JSON.stringify(['r1']), ''])
    await run('INSERT OR IGNORE INTO resource (id, user_id, role, availability) VALUES (?,?,?,?)', ['r1','u1','engineer', JSON.stringify([])])
    await run('INSERT OR IGNORE INTO assignment (id, task_id, resource_id, allocation_start, allocation_end) VALUES (?,?,?,?,?)', ['a1','t1','r1', now, null])
    await run('INSERT OR IGNORE INTO client (id, user_id, email, passwordless_enabled) VALUES (?,?,?,?)', ['c1','u2','cliente@example.com', 1])

    console.log('Seed data inserted (if not present).')
  } catch (e) {
    console.error('Seed error', e)
  } finally {
    db.close()
  }
})()
