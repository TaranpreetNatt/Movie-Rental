
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/mongo-exercises')
  .then(() => console.log('Connected to database...'))
  .catch( (err) => console.log('Error', err));

const courseSchema = new mongoose.Schema({
  tags: [ String ],
  date: { type: Date, default: Date.now},
  name: String,
  author: String,
  isPublished: Boolean,
  price: Number,
});

const Course = mongoose.model('Course', courseSchema);

async function getCourses(){
  return await Course
  .find({ isPublished: true, tags: 'backend'})
  .sort({ name: 1 })
  .select({ name: 1, author: 1});
}

async function displayCourses(){
  const courses = await getCourses();
  console.log(courses);
}
displayCourses();
