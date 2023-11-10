// const express = require('express');
// const { Pool } = require('pg');
// const cors = require('cors');
// const app = express();
// const port = 3001;
// const pool = new Pool({
//   user: 'postgres',
//   host: 'localhost',
//   database: 'spc_calculations',
//   password: 'admin',
//   port: 5432,
// });

// app.use(cors());
// app.use(express.json());

// // Define routes

// // Retrieve data
// app.get('/data', async (req, res) => {
//   try {
//     const client = await pool.connect();
//     const result = await client.query('SELECT * FROM values_measurement');
//     const results = { 'results': (result) ? result.rows : null };
//     res.json(results);
//     client.release();
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// // Add data
// app.post('/addData', async (req, res) => {
//   const client = await pool.connect();

//   try {
//     const { value, timestamp } = req.body;

//     // Start a transaction
//     await client.query('BEGIN');

//     // Insert the data into the values_measurement table
//     await client.query('INSERT INTO values_measurement (value, timestamp) VALUES ($1, $2)', [value, timestamp]);

//     // Calculate MR and update the mr column
//     if (timestamp > 1) {
//       const prevValueResult = await client.query('SELECT value FROM values_measurement WHERE timestamp = $1', [timestamp - 1]);
//       const prevValue = prevValueResult.rows[0].value;
//       const mr = Math.abs(value - prevValue);
//       await client.query('UPDATE values_measurement SET mr = $1 WHERE timestamp = $2', [mr, timestamp]);
//     }

//     // Commit the transaction to persist the changes
//     await client.query('COMMIT');

//     res.status(200).send('Data added and committed');
//   } catch (err) {
//     // If there's an error, roll back the transaction to avoid partial updates
//     await client.query('ROLLBACK');
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   } finally {
//     client.release();
//   }
// });

// // Calculate SPC results
// app.post('/calculate-spc', async (req, res) => {
//     try {
//         // Check if there's already a row in the spc_result table
//         const existingResult = await pool.query('SELECT COUNT(*) FROM spc_result');
//         const rowExists = existingResult.rows[0].count > 0;
//         // const sampleSize=1;
//         if (rowExists) {
//           // Update the existing row in spc_result
//           await pool.query(`
//             UPDATE spc_result
//             SET
//               xbar = (SELECT AVG(vm.value) FROM values_measurement vm),
//               sd = (SELECT STDDEV(vm.value)::numeric::decimal(10,2) FROM values_measurement vm),
//               USL = 525, 
//               LSL = 475, 
//               pp = ((525 - 475) / (6 * (SELECT STDDEV(vm.value)::numeric::decimal(10,2) FROM values_measurement vm)))::numeric::decimal(10,2),
//               PPU = ((525 - (SELECT AVG(vm.value) FROM values_measurement vm)) / (3 * (SELECT STDDEV(vm.value)::numeric::decimal(10,3) FROM values_measurement vm)))::numeric::decimal(10,2),
//               PPL = (((SELECT AVG(vm.value) FROM values_measurement vm) - 475) / (3 * (SELECT STDDEV(vm.value)::numeric::decimal(10,3) FROM values_measurement vm)))::numeric::decimal(10,2),
//               Ppk = LEAST(
//                 (525 - (SELECT AVG(vm.value) FROM values_measurement vm)) / (3 * (SELECT STDDEV(vm.value)::numeric::decimal(10,3) FROM values_measurement vm)),
//                 (((SELECT AVG(vm.value) FROM values_measurement vm) - 475) / (3 * (SELECT STDDEV(vm.value)::numeric::decimal(10,3) FROM values_measurement vm)))
//               )::numeric::decimal(10,2),
//               RBAR = (
//                 SELECT SUM(MR) / COUNT(CASE WHEN MR >= 0 THEN 1 ELSE NULL END) AS Rbar
//                 FROM values_measurement
//               )::numeric::decimal(10,3),
//               SDW = (
//                 (SELECT SUM(MR) / COUNT(CASE WHEN MR >= 0 THEN 1 ELSE NULL END) AS Rbar FROM values_measurement) / 1.128
//               )::numeric::decimal(10,2),
//               CP = ((525 - 475) / (6 * (SELECT STDDEV(vm.value)::numeric::decimal(10,2) FROM values_measurement vm)))::numeric::decimal(10,2),
//               CPU = (
//                 (525 - (SELECT AVG(vm.value) FROM values_measurement vm)) /
//                 (3 * (
//                   SELECT (
//                     (SELECT SUM(MR) / COUNT(CASE WHEN MR >= 0 THEN 1 ELSE NULL END) AS Rbar FROM values_measurement) / 1.128
//                   )::numeric::decimal(10,2)
//                 ))
//               )::numeric::decimal(10,2),
//               CPL = (
//                 ((SELECT AVG(vm.value) FROM values_measurement vm) - 475) /
//                 (3 * (
//                   SELECT (
//                     (SELECT SUM(MR) / COUNT(CASE WHEN MR >= 0 THEN 1 ELSE NULL END) AS Rbar FROM values_measurement) / 1.128
//                   )::numeric::decimal(10,2)
//                 ))
//               )::numeric::decimal(10,2),
//               CPK = LEAST(
//                 (
//                   (525 - (SELECT AVG(vm.value) FROM values_measurement vm)) /
//                   (3 * (
//                     SELECT (
//                       (SELECT SUM(MR) / COUNT(CASE WHEN MR >= 0 THEN 1 ELSE NULL END) AS Rbar FROM values_measurement) / 1.128
//                     )::numeric::decimal(10,2)
//                   ))
//                 )::numeric::decimal(10,2),
//                 (
//                   ((SELECT AVG(vm.value) FROM values_measurement vm) - 475) /
//                   (3 * (
//                     SELECT (
//                       (SELECT SUM(MR) / COUNT(CASE WHEN MR >= 0 THEN 1 ELSE NULL END) AS Rbar FROM values_measurement) / 1.128
//                     )::numeric::decimal(10,2)
//                   ))
//                 )::numeric::decimal(10,2)
//               ),
//               ucl = (
//                 (SELECT AVG(vm.value) FROM values_measurement vm) +
//                 (
//                   SELECT A2 FROM standardsample WHERE sample_size = 1
//                 ) *
//                 (
//                   SELECT SUM(MR) / COUNT(CASE WHEN MR >= 0 THEN 1 ELSE NULL END) AS Rbar
//                   FROM values_measurement
//                 )
//               )::numeric::decimal(10, 2),
//               lcl = (
//                 (SELECT AVG(vm.value) FROM values_measurement vm) -
//                 (
//                   SELECT A2 FROM standardsample WHERE sample_size = 1
//                 ) *
//                 (
//                   SELECT SUM(MR) / COUNT(CASE WHEN MR >= 0 THEN 1 ELSE NULL END) AS Rbar
//                   FROM values_measurement
//                 )
//               )::numeric::decimal(10, 2);
//           `);
//         } else {
//           // If no row exists, insert a new one
//           await pool.query(`
//             INSERT INTO spc_result (xbar, sd)
//             SELECT AVG(vm.value) AS xbar, STDDEV(vm.value)::numeric::decimal(10,2)
//             FROM values_measurement vm;
//           `);
//         }
    
//         // Select all data from spc_result
//         const result = await pool.query('SELECT * FROM spc_result');
    
//         res.json(result.rows);
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//       }
// });

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });



































const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();
const port = 3001;
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'spc_calculations',
  password: 'admin',
  port: 5432,
});

app.use(cors());
app.use(express.json());


// Define routes

// Retrieve data
app.get('/data', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM values_measurement');
    const results = { 'results': (result) ? result.rows : null };
    res.json(results);
    client.release();
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Add data
app.get('/addData', async (req, res) => {
  const client = await pool.connect();

  try {
    const { value, timestamp } = req.body;

    // Start a transaction
    await client.query('BEGIN');

    // Insert the data into the values_measurement table
    await client.query('INSERT INTO values_measurement (value, timestamp) VALUES ($1, $2)', [value, timestamp]);

    // Calculate MR and update the mr column
    if (timestamp > 1) {
      const prevValueResult = await client.query('SELECT value FROM values_measurement WHERE timestamp = $1', [timestamp - 1]);
      const prevValue = prevValueResult.rows[0].value;
      const mr = Math.abs(value - prevValue);
      await client.query('UPDATE values_measurement SET mr = $1 WHERE timestamp = $2', [mr, timestamp]);
    }

    // Commit the transaction to persist the changes
    await client.query('COMMIT');

    res.status(200).send('Data added and committed');
  } catch (err) {
    // If there's an error, roll back the transaction to avoid partial updates
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).send("Internal Server Error");
  } finally {
    client.release();
  }
});

// Calculate SPC results
app.all('/calculate', async (req, res) => 
  {

    try {
      const { selectedOption } = req.body;


        let tableName;
        if (selectedOption == '1') {
        tableName = 'spc_result';
// print("hello");
        // const existingResult = await pool.query('SELECT COUNT(*) FROM spc_result');
        // const rowExists = existingResult.rows[0].count > 0;
        // if (rowExists) {
          // Update the existing row in spc_result
          await pool.query(`
            UPDATE spc_result
            SET
              xbar = (SELECT AVG(vm.value) FROM values_measurement vm),
              sd = (SELECT STDDEV(vm.value)::numeric::decimal(10,2) FROM values_measurement vm),
              USL = 525, 
              LSL = 475, 
              pp = ((525 - 475) / (6 * (SELECT STDDEV(vm.value)::numeric::decimal(10,2) FROM values_measurement vm)))::numeric::decimal(10,2),
              PPU = ((525 - (SELECT AVG(vm.value) FROM values_measurement vm)) / (3 * (SELECT STDDEV(vm.value)::numeric::decimal(10,3) FROM values_measurement vm)))::numeric::decimal(10,2),
              PPL = (((SELECT AVG(vm.value) FROM values_measurement vm) - 475) / (3 * (SELECT STDDEV(vm.value)::numeric::decimal(10,3) FROM values_measurement vm)))::numeric::decimal(10,2),
              Ppk = LEAST(
                (525 - (SELECT AVG(vm.value) FROM values_measurement vm)) / (3 * (SELECT STDDEV(vm.value)::numeric::decimal(10,3) FROM values_measurement vm)),
                (((SELECT AVG(vm.value) FROM values_measurement vm) - 475) / (3 * (SELECT STDDEV(vm.value)::numeric::decimal(10,3) FROM values_measurement vm)))
              )::numeric::decimal(10,2),
              RBAR = (
                SELECT SUM(MR) / COUNT(CASE WHEN MR >= 0 THEN 1 ELSE NULL END) AS Rbar
                FROM values_measurement
              )::numeric::decimal(10,3),
              
              SDW = ((SELECT SUM(MR) / COUNT(CASE WHEN MR >= 0 THEN 1 ELSE NULL END) AS Rbar FROM values_measurement) / 1.128
              )::numeric::decimal(10,2),

              CP = ((525 - 475) / (6 * (SELECT STDDEV(vm.value)::numeric::decimal(10,2) FROM values_measurement vm)))::numeric::decimal(10,2),
              CPU = ((525 - (SELECT AVG(vm.value) FROM values_measurement vm)) /
                (3 * (SELECT ((SELECT SUM(MR) / COUNT(CASE WHEN MR >= 0 THEN 1 ELSE NULL 
                  END) AS Rbar FROM values_measurement) / 1.128
                  )::numeric::decimal(10,2))))::numeric::decimal(10,2),

              CPL = (((SELECT AVG(vm.value) FROM values_measurement vm) - 475) /
                (3 * (SELECT ((SELECT SUM(MR) / COUNT(CASE WHEN MR >= 0 THEN 1 ELSE NULL END) AS Rbar FROM values_measurement) / 1.128
                  )::numeric::decimal(10,2))))::numeric::decimal(10,2),

              CPK = LEAST(
                (
                  (525 - (SELECT AVG(vm.value) FROM values_measurement vm)) /
                  (3 * (
                    SELECT (
                      (SELECT SUM(MR) / COUNT(CASE WHEN MR >= 0 THEN 1 ELSE NULL END) AS Rbar FROM values_measurement) / 1.128
                    )::numeric::decimal(10,2)
                  ))
                )::numeric::decimal(10,2),
                (
                  ((SELECT AVG(vm.value) FROM values_measurement vm) - 475) /
                  (3 * (
                    SELECT (
                      (SELECT SUM(MR) / COUNT(CASE WHEN MR >= 0 THEN 1 ELSE NULL END) AS Rbar FROM values_measurement) / 1.128
                    )::numeric::decimal(10,2)
                  ))
                )::numeric::decimal(10,2)
              ),
              ucl = (
                (SELECT AVG(vm.value) FROM values_measurement vm) +
                (
                  SELECT A2 FROM standardsample WHERE sample_size = 1
                ) *
                (
                  SELECT SUM(MR) / COUNT(CASE WHEN MR >= 0 THEN 1 ELSE NULL END) AS Rbar
                  FROM values_measurement
                )
              )::numeric::decimal(10, 2),
              lcl = (
                (SELECT AVG(vm.value) FROM values_measurement vm) -
                (
                  SELECT A2 FROM standardsample WHERE sample_size = 1
                ) *
                (
                  SELECT SUM(MR) / COUNT(CASE WHEN MR >= 0 THEN 1 ELSE NULL END) AS Rbar
                  FROM values_measurement
                )
              )::numeric::decimal(10, 2);
          `);
                }
                else if (selectedOption == '2') {
                  // Option 2 queries
                  tableName = 'spc_result2';
                  await pool.query(`
                  UPDATE spc_result2
    SET
      xbar = (SELECT AVG(vm.value) FROM values_measurement vm),
      sd = (SELECT STDDEV(vm.value)::numeric::decimal(10,3) FROM values_measurement vm),
      USL = 525, LSL = 475, pp = ((USL - LSL) / (6 * sd))::numeric::decimal(10,2),
      PPU = ((USL - xbar) / (3 * sd))::numeric::decimal(10,2),
      PPL = ((xbar - LSL) / (3 * sd))::numeric::decimal(10,2),
      Ppk = LEAST((USL - xbar) / (3 * sd), (xbar - LSL) / (3 * sd))::numeric::decimal(10,2),
      rbar = (SELECT SUM(range) / COUNT(range)::numeric FROM range_chart2),
      SDW = (rbar / 1.128)::numeric::decimal(10,2),
      CP = ((USL - LSL) / (6 * sd))::numeric::decimal(10,2),
      CPU = ((USL - xbar) / (3 * SDW))::numeric::decimal(10,2),
      CPL = ((xbar - LSL) / (3 * SDW))::numeric::decimal(10,3),
      CPK = LEAST(CPU, CPL)::numeric::decimal(10,2),
      ucl = (xbar + (SELECT A2 FROM standardsample WHERE sample_size = 2) * rbar)::numeric::decimal(10, 2),
      lcl = (xbar - (SELECT A2 FROM standardsample WHERE sample_size = 2) * rbar)::numeric::decimal(10, 2);
                  
                  `);
        } else {
          // If no row exists, insert a new one
          res.status(400).json({ error: 'Invalid option selected' });
          return;
        }
    
        // Select all data from spc_result
        const result = await pool.query(`SELECT * FROM ${tableName}`);
    
        res.json(result.rows);
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});