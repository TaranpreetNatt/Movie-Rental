const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validateObjectId = require('../middleware/validateObjectId');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const { Genre, validate} = require('../models/genre');

router.get('/', async (req, res) => {
  const genres = await Genre
    .find()
    .sort('name');
  res.send(genres);
});

router.get('/:id', validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id)
  
  if(!genre) return res.status(404).send('The genre with the given ID was not found.');

  res.send(genre);
});

router.put('/:id', [auth, validateObjectId], async (req, res) => {
  const { error } = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true});
  if(!genre) return res.status(404).send('The genre with the given ID was not found.');
  res.send(genre);
});

router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body);
  if(error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({ name: req.body.name });
  const result = await genre.save()
  
  res.send(result);
});

router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id)
  if(!genre) return res.status(404).send("The genre with the given ID does not exist");
  res.send(genre);
});

module.exports = router;