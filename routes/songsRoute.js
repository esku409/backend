import express, { response } from "express";
import { Song } from "../models/Songmodel.js";
import { Song } from "../models/Songmodel.js";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));  // Append timestamp to the file name
    }
});

const upload = multer({ storage: storage });


router.post('/', upload.single('audio'), async (req, res) => {
    try {
        const { title, artist, album, genre } = req.body;
        // let newSong = null

        if (!title || !artist || !album || !genre) {
            return res.status(400).send({ message: 'information incomplete' })
        }
        if (req.file) {
            newSong = {
                title,
                artist,
                album,
                genre,
                audioUrl: `/uploads/${req.file.filename}`,  // Store the file path in the database
                sourceType: 'file'
            };
        } else if (audioUrl) {  // If an audio URL is provided
            newSong = {
                title,
                artist,
                album,
                genre,
                audioUrl: audioUrl,  // Store the URL in the database
                sourceType: 'url'
            };
        } else {
            return res.status(400).send({ message: 'Either an audio file or a URL is required' });
        }

        const newSong = { title, artist, album, genre, audioUrl: `/uploads/${req.file.filename}` };
        const song = await Song.create(newSong);
        return res.status(200).send(book);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message })
    }
})

router.get('/', async (req, res) => {
    try {
        const songs = await Song.find({});
        return res.status(200).json({ count: songs.length, data: songs });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message })
    }
});
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: 'invalid ID' })
        }

        const song = await Song.findById(id);
        if (!song) {
            return res.status(404).send({ message: 'Song not found' })
        }
        return res.status(200).json(song);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message })
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, artist, album, genre, audioUrl } = req.body;
        if (!title || !artist || !album || !genre || !audioUrl) {
            return res.status(404).send({ message: 'information incomplete' })
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: 'Invalid Id' });
        }
        const song = await Song.findById(id);
        if (!song) {
            return res.status(404).send({ message: "song not found" });
        }
        song.title = title || song.title;
        song.artist = artist || song.artist;
        song.album = album || song.album;
        song.genre = genre || song.genre;

        // Update the audio source
        if (req.file) {  // If a new audio file is uploaded
            song.audioUrl = `/uploads/${req.file.filename}`;
            song.sourceType = 'file';
        } else if (audioUrl) {  // If a new audio URL is provided
            song.audioUrl = audioUrl;
            song.sourceType = 'url';
        }

        await song.save();
        return res.status(200).json(song);
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message });
    }
});
// Delete a song by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: 'Invalid ID' });
        }

        const song = await Song.findById(id);
        if (!song) {
            return res.status(404).send({ message: 'Song not found' });
        }

        // If the song is a file, delete it from the server
        if (song.sourceType === 'file') {
            const filePath = path.join(__dirname, '..', 'uploads', path.basename(song.audioUrl));
            // Delete the file from the server
            fs.unlink(filePath, (err) => {
                if (err) console.error("Error deleting file:", err.message);
            });
        }

        await song.remove();
        return res.status(200).send({ message: 'Song deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send({ message: err.message });
    }
});
