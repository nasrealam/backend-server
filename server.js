const express = require('express');
const fs = require('fs');
const csvParser = require('csv-parser');
const multer = require('multer');
const { Readable } = require('stream');

//file path I have set to the current directory.
// const csvFilepath = './SampleCSVFile_11kb.csv';

//create a new database
// const db = new sqlite3.Database(':memory:');
const app = express();

app.use(express.json());

// const storage = multer.memoryStorage(); // Store the file in memory
// const upload = multer({ storage: storage });

// Endpoint to handle CSV file upload
app.post('/upload', multer().single('csvFile'), (req, res) => {
    try {
        const fileBuffer = req.file.buffer; //Assuming the file is sent in the request body from the frontend.
        // const file = fileBuffer.toString('utf8');
        //parse the csv data.
        const results = [];
        const stream = Readable.from(fileBuffer).pipe(csvParser());
        stream.on('data', (data) => {
            results.push(data);
        });
        stream.on('end', () => {
            console.log(results);
            res.status(200).json({ message: 'CSV data saved successfully' });
        });
        // csvParser(fileBuffer, { columns: true }, (err, data) => {
        //     if (err) {
        //         console.error('Error parsing CSV:', err);
        //         res.status(500).json({ error: 'Error parsing CSV' });
        //         return;
        //     }
        //     console.log(data);
        //     res.sent('CSV data saved successfully');
        // });
    } catch (error) {
        console.error('Error handling file upload:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});

// const stream = fs.createReadStream(file).pipe(csvParser());
// const displayedResults = (results, (req, res) => {
//     res.send(results);
//     console.log('data has displayed on server.')
// });
// start the server.



const PORT = process.env.PORT || 3200;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
