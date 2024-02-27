const express = require('express');
const csvParser = require('csv-parser');
const multer = require('multer');
const { Readable } = require('stream');
const { Client } = require('pg');

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

            results.shift(); //removing the first row from the array.

            //connecting to the database and save the data.
            const client = new Client({
                host: 'localhost',
                user: 'postgres',
                database: 'AMS',
                password: 'N@sre123',
                port: 4200
            });

            const query = 'INSERT INTO dataOfCustomer (index, customer, firstName, lastName, company, city, country, phone1, phone2, email, subscription, website) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)';
            client.connect((err, client, done) => {
                if (err) throw err;
                try {
                    results.forEach(row => {
                        let values = Object.values(row);
                        client.query(query, values, (err, res) => {
                            if (err) {
                                console.log(err.stack);
                            } else {
                                console.log("inserted" + res.rowCount + "row", row);
                            }
                        });
                    });
                } finally {
                    console.log("closing the connection")
                }
            });

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
