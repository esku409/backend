import mongoose from "mongoose";
const songSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        artist: { type: String, required: true },
        album: { type: String, required: true },
        genre: { type: String, required: true },
        audioUrl: { type: String, required: true }, 
        sourceType: { type: String, enum: ['file', 'url'], required: true }

    },
    {
        timestamps: true,

    }
)
const Song = mongoose.model('song', songSchema);

export default Song;