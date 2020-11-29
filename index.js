const express = require('express');
const Joi = require('joi');

const app = express();
const port = process.env.PORT || 3000;
const courses = [
  { id: 1, name: 'JavaScript' },
  { id: 2, name: 'Python' },
  { id: 3, name: 'Ruby' },
  { id: 4, name: 'Dart' },
];

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/courses', (req, res) => {
  res.send(courses);
});

// READ operation
app.get('/courses/:id', (req, res) => {
  // Look up the course
  const course = courses.find(c => c.id === parseInt(req.params.id));

  // If not existing, return 404
  if (!course) return res.status(404).send('Course not found');
  // Return the updated courses
  return res.send(course);
});

// CREATE operation
app.post('/courses', (req, res) => {
  // Object destructuring
  const { error } = validateCourse(req.body); // equivalent to validation.error

  if (error) return res.status(400).send(error.details[0].message);

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };

  // Add new course
  courses.push(course);
  // Return the updated courses
  res.send(course);
});

// UPDATE operation
app.put('/courses/:id', (req, res) => {
  // Look up the course
  const course = courses.find(c => c.id === parseInt(req.params.id));

  // If not existing, return 404
  if (!course) return res.status(404).send('Course not found');

  // Object destructuring
  const { error } = validateCourse(req.body);

  if (error) return res.status(400).send(error.details[0].message);

  // Update course
  course.name = req.body.name;
  // Return the updated courses
  res.send(course);
});

// DELETE operation
app.delete('/courses/:id', (req, res) => {
  // Look up the course
  const course = courses.find(c => c.id === parseInt(req.params.id));

  // If not existing, return 404
  if (!course) return res.status(404).send('Course not found');

  // Delete course
  const index = courses.indexOf(course);
  courses.splice(index, 1);
  // Return the updated courses
  res.send(course);
})

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

function validateCourse(course) {
  const name = { name: course.name };
  const schema = Joi.object({ name: Joi.string().min(3).required() });
  return schema.validate(name);
}
