const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middleware to parse JSON
app.use(bodyParser.json());

const cors = require("cors");
app.use(cors());


// MongoDB connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};
connectDB();

// Define a schema and model
const itemSchema = new mongoose.Schema({
    url: { type: String, required: true },
    id: { type: Number, required: true },
});
const Item = mongoose.model('Item', itemSchema);

// API endpoint: Get all items
app.get('/api/items', async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// API endpoint: Add a new item
app.post('/api/items', async (req, res) => {
    const newItem = new Item({ url: req.body.url, id: req.body.id });
    try {
        const item = await newItem.save();
        res.json(item);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// API endpoint: Delete an item
app.delete('/api/items/:id', async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item) return res.status(404).json({ message: 'Item not found' });
        res.json({ message: 'Item deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
