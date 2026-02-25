const express = require('express')
const mysql = require('mysql2')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Myworld@123',
    database: 'wedding_db'
})

db.connect(err => {
    if (err) {
        console.error('DB connection failed:', err)
    } else {
        console.log('Connected to MySQL')
    }
})

app.listen(5000, () => {
    console.log('Server running on port 5000')
})

app.post('/expenses', (req, res) => {
    const { id, title, category, amount, paid, date, notes } = req.body

    const sql = `
    INSERT INTO expenses (id, title, category, amount, paid, date, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `

    db.query(sql, [id, title, category, amount, paid||0, date, notes], (err) => {
        if (err) return res.status(500).send(err)
        res.send('Expense saved')
    })
})

app.get('/expenses', (req, res) => {
    db.query('SELECT * FROM expenses', (err, results) => {
        if (err) return res.status(500).send(err)
        res.json(results)
    })
})


app.post('/budget', (req, res) => {
    const { total } = req.body

    db.query('DELETE FROM budget', () => {
        db.query(
            'INSERT INTO budget (total) VALUES (?)',
            [total],
            (err) => {
                if (err) return res.status(500).send(err)
                res.send('Budget saved')
            }
        )
    })
})

app.delete('/expenses/:id', (req, res) => {
    const { id } = req.params

    db.query('DELETE FROM expenses WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send(err)
        res.send('Deleted')
    })
})

app.put('/expenses/:id', (req, res) => {
  const { id } = req.params
  const { title, category, amount, paid, date, notes } = req.body

  const sql = `
    UPDATE expenses
    SET title=?, category=?, amount=?, paid=?, date=?, notes=?
    WHERE id=?
  `

  db.query(sql, [title, category, amount, paid, date, notes, id], (err) => {
    if (err) return res.status(500).send(err)
    res.send('Updated')
  })
})

app.get('/budget', (req, res) => {
  db.query('SELECT * FROM budget', (err, result) => {
    if (err) return res.status(500).send(err)
    res.json(result)
  })
})