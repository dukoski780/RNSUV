var express = require('express');
var router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Path to the JSON database files
const DB_PATH = path.join(__dirname, 'database', 'jokes.json');
const INDEX_PATH = path.join(__dirname, 'database', 'jokes_index.json');

// Helper function to read jokes from file
async function readJokes() {
  try {
    const file = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(file || '[]');
  } catch (err) {
    console.error('Failed to read jokes database:', err);
    return [];
  }
}

// Helper function to write jokes to file
async function writeJokes(jokes) {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(jokes, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write jokes database:', err);
    throw err;
  }
}

// Helper function to read the index
async function readIndex() {
  try {
    const file = await fs.readFile(INDEX_PATH, 'utf8');
    const idxObj = JSON.parse(file || '{}');
    return Number(idxObj.jokes_index) || 0;
  } catch (err) {
    console.error('Failed to read jokes index:', err);
    return 0;
  }
}

// Helper function to write the index
async function writeIndex(index) {
  try {
    await fs.writeFile(INDEX_PATH, JSON.stringify({ jokes_index: index }, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write jokes index:', err);
    throw err;
  }
}

// GET all jokes
router.get('/', async (req, res) => {
  try {
    const jokes = await readJokes();
    // Sort by ID descending (newest first)
    jokes.sort((a, b) => b.id - a.id);
    return res.status(200).json(jokes);
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to retrieve jokes' });
  }
});

// GET joke by ID
router.get('/:id', async (req, res) => {
  try {
    let jokeId = parseInt(req.params.id);
    const jokes = await readJokes();
    let foundJoke = jokes.find(each => each.id === jokeId);

    if (foundJoke) {
      return res.status(200).json(foundJoke);
    }
    return res.status(404).json({ msg: 'Joke with id ' + jokeId + ' not found!' });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to retrieve joke' });
  }
});

// POST create new joke
router.post('/', async (req, res) => {
  try {
    const jokes = await readJokes();
    const lastIndex = await readIndex();
    const newId = lastIndex + 1;

    let joke = req.body;
    joke.id = newId;
    joke.favorite = false;
    joke.views = 0;
    joke.createdAt = new Date().toISOString();

    jokes.push(joke);

    await writeIndex(newId);
    await writeJokes(jokes);

    return res.status(200).json({ msg: 'Joke successfully created', id: joke.id });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to create joke' });
  }
});

// PUT edit joke (admin can edit any, user can edit own)
router.put('/:id', async (req, res) => {
  try {
    let jokeId = parseInt(req.params.id);
    const jokes = await readJokes();
    let foundJoke = jokes.find(each => each.id === jokeId);

    if (!foundJoke) {
      return res.status(404).json({ msg: 'Joke with id ' + jokeId + ' not found!' });
    }

    // Authorization: admin can edit any joke, user can only edit their own
    const isAdmin = req.user && req.user.role === 'admin';
    const isOwner = req.user && foundJoke.author === req.user.user;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({ msg: 'You do not have permission to edit this joke' });
    }

    // Update joke fields
    if (req.body.type) foundJoke.type = req.body.type;
    if (req.body.setup) foundJoke.setup = req.body.setup;
    if (req.body.punchline) foundJoke.punchline = req.body.punchline;

    await writeJokes(jokes);

    return res.status(200).json({ msg: 'Joke successfully updated', joke: foundJoke });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to update joke' });
  }
});

// PATCH toggle favorite
router.patch('/:id', async (req, res) => {
  try {
    let jokeId = parseInt(req.params.id);
    const jokes = await readJokes();
    let foundJoke = jokes.find(each => each.id === jokeId);

    if (foundJoke) {
      foundJoke.favorite = req.body.favorite;
      await writeJokes(jokes);

      let msg = 'Joke with id ' + jokeId + ' is now ';
      msg += foundJoke.favorite ? ' favorited.' : ' unfavorited';
      return res.status(200).json({ msg: msg });
    }
    return res.status(404).json({ msg: 'Joke with id ' + jokeId + ' not found!' });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to update joke' });
  }
});

// POST import jokes (bulk create)
router.post('/import', async (req, res) => {
  try {
    let importedJokes = req.body.jokes;

    if (!Array.isArray(importedJokes)) {
      return res.status(400).json({ msg: 'Invalid import data' });
    }

    const jokes = await readJokes();
    let lastIndex = await readIndex();
    let addedCount = 0;
    let skippedCount = 0;

    importedJokes.forEach(joke => {
      // Check if joke already exists (by setup and punchline)
      const isDuplicate = jokes.some(existingJoke =>
        existingJoke.setup.toLowerCase().trim() === joke.setup.toLowerCase().trim() &&
        existingJoke.punchline.toLowerCase().trim() === joke.punchline.toLowerCase().trim()
      );

      if (!isDuplicate) {
        lastIndex++;
        joke.id = lastIndex;
        joke.favorite = false;
        joke.views = 0;
        joke.createdAt = new Date().toISOString();
        jokes.push(joke);
        addedCount++;
      } else {
        skippedCount++;
      }
    });

    await writeIndex(lastIndex);
    await writeJokes(jokes);

    let msg = `Successfully imported ${addedCount} jokes`;
    if (skippedCount > 0) {
      msg += ` (${skippedCount} duplicates skipped)`;
    }

    return res.status(200).json({
      msg: msg,
      count: addedCount,
      skipped: skippedCount
    });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to import jokes' });
  }
});

// PATCH increment view count (public endpoint)
router.patch('/:id/view', async (req, res) => {
  try {
    let jokeId = parseInt(req.params.id);
    const jokes = await readJokes();
    let foundJoke = jokes.find(each => each.id === jokeId);

    if (foundJoke) {
      foundJoke.views = (foundJoke.views || 0) + 1;
      await writeJokes(jokes);

      return res.status(200).json({ msg: 'View counted', views: foundJoke.views });
    }
    return res.status(404).json({ msg: 'Joke with id ' + jokeId + ' not found!' });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to update view count' });
  }
});

// DELETE joke (admin only)
router.delete('/:id', async (req, res) => {
  try {
    let jokeId = parseInt(req.params.id);
    const jokes = await readJokes();
    const jokeIndex = jokes.findIndex(each => each.id === jokeId);

    if (jokeIndex === -1) {
      return res.status(404).json({ msg: 'Joke with id ' + jokeId + ' not found!' });
    }

    // Check if user is admin
    if (!req.user || req.user.role !== 'admin') {
      return res.status(403).json({ msg: 'Only admins can delete jokes' });
    }

    // Remove the joke
    jokes.splice(jokeIndex, 1);
    await writeJokes(jokes);

    return res.status(200).json({ msg: 'Joke successfully deleted', id: jokeId });
  } catch (err) {
    return res.status(500).json({ msg: 'Failed to delete joke' });
  }
});

module.exports = router;
