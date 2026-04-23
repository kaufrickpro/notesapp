require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const Note = require('./models/note')
const middleware = require('./utils/middleware')

app.use(express.static('dist'))

morgan.token('body', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(express.json())
app.use(requestLogger)

app.get('/api/notes', (request, response, next) => {
  Note.find({}).then(notes => {
    response.json(notes)
  }).catch(error => next(error))
})

app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id).then(note => {
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  }).catch(error => next(error))
})

app.post('/api/notes', (request, response, next) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing',
    })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  }).catch(error => next(error))
})

app.put('/api/notes/:id', (request, response, next) => {
  const id = request.params.id
  const body = request.body

  const updatedNote = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(id, updatedNote, { new: true })
    .then(result => {
      if (!result) {
        return response.status(404).end()
      }
      response.json(result)
    })
    .catch(error => next(error))
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
