const express = require('express');
const csvParser = require('csv-parser');
const multer = require('multer');
const { Readable } = require('stream');

const app = express();

app.use(express.json());

// Endpoint to handle CSV file upload
app.post('/upload', multer().single('csvFile'), (req, res) => {
    try {
        const fileBuffer = req.file.buffer; //Assuming the file is sent in the request body from the frontend.

        const results = [];
        //parse the csv data.
        const stream = Readable.from(fileBuffer).pipe(csvParser());
        stream.on('data', (data) => {
            results.push(data);
        });
        stream.on('end', () => {
            console.log(results);
            res.status(200).json({ message: 'CSV data saved successfully' }); // show the massage to frontend.
        });

    } catch (error) {
        console.error('Error handling file upload:', error);
        res.status(500).json({ error: 'Internal server error' });   // show the massage to frontend.
    }

});


const PORT = process.env.PORT || 3200;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
