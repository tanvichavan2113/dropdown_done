////old code 
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


// // Retrieve data
// app.get('/data', async (req, res) => {
//   try {
//     const client = await pool.connect();
//     const result = await client.query('SELECT * FROM values_measurement');
//     const results = { 'results': (result) ? result.rows : null };
//     res.json(results);
//     client.release();
//   } 
  
//   catch (err) {
//     console.error(err);
//     res.status(500).send("Internal Server Error");
//   }
// });

// Calculate SPC results
// app.all('/calculate', async (req, res) => 
//   {
//     const { selectedOption } = req.body;
//     console.log(req.body);
//     console.log('Selected Option:', selectedOption);

//   if (selectedOption === undefined) {
//     res.status(400).json({ error: 'Invalid option selected' });
//     return;
//   }
//     try {
//       // const { selectedOption } = req.body;
//         let tableName;
//         if (selectedOption == '1') {
//         tableName = 'spc_result';
//         console.log('Calculating for spc_result 1 ');
//         const result = await pool.query('SELECT * FROM values_measurement');
//         console.log('Response:', result.rows); // Log the response
//         res.json(result.rows);

        // await pool.query(`
        //     UPDATE spc_result
        //     SET
        //       xbar = (SELECT AVG(vm.value) FROM values_measurement vm),
        //       sd = (SELECT STDDEV(vm.value)::numeric::decimal(10,2) FROM values_measurement vm),
        //       USL = 525, 
        //       LSL = 475, 
        //       pp = ((525 - 475) / (6 * (SELECT STDDEV(vm.value)::numeric::decimal(10,2) FROM values_measurement vm)))::numeric::decimal(10,2),
        //       PPU = ((525 - (SELECT AVG(vm.value) FROM values_measurement vm)) / (3 * (SELECT STDDEV(vm.value)::numeric::decimal(10,3) FROM values_measurement vm)))::numeric::decimal(10,2),
        //       PPL = (((SELECT AVG(vm.value) FROM values_measurement vm) - 475) / (3 * (SELECT STDDEV(vm.value)::numeric::decimal(10,3) FROM values_measurement vm)))::numeric::decimal(10,2),
        //       Ppk = LEAST(
        //         (525 - (SELECT AVG(vm.value) FROM values_measurement vm)) / (3 * (SELECT STDDEV(vm.value)::numeric::decimal(10,3) FROM values_measurement vm)),
        //         (((SELECT AVG(vm.value) FROM values_measurement vm) - 475) / (3 * (SELECT STDDEV(vm.value)::numeric::decimal(10,3) FROM values_measurement vm)))
        //       )::numeric::decimal(10,2),
        //       RBAR = (
        //         SELECT SUM(MR) / COUNT(CASE WHEN MR >= 0 THEN 1 ELSE NULL END) AS Rbar
        //         FROM values_measurement
        //       )::numeric::decimal(10,3),
              
        //       SDW = ((SELECT SUM(MR) / COUNT(CASE WHEN MR >= 0 THEN 1 ELSE NULL END) AS Rbar FROM values_measurement) / 1.128
        //       )::numeric::decimal(10,2),

        //       CP = ((525 - 475) / (6 * (SELECT STDDEV(vm.value)::numeric::decimal(10,2) FROM values_measurement vm)))::numeric::decimal(10,2),
        //       CPU = ((525 - (SELECT AVG(vm.value) FROM values_measurement vm)) /
        //         (3 * (SELECT ((SELECT SUM(MR) / COUNT(CASE WHEN MR >= 0 THEN 1 ELSE NULL 
        //           END) AS Rbar FROM values_measurement) / 1.128
        //           )::numeric::decimal(10,2))))::numeric::decimal(10,2),

        //       CPL = (((SELECT AVG(vm.value) FROM values_measurement vm) - 475) /
        //         (3 * (SELECT ((SELECT SUM(MR) / COUNT(CASE WHEN MR >= 0 THEN 1 ELSE NULL END) AS Rbar FROM values_measurement) / 1.128
        //           )::numeric::decimal(10,2))))::numeric::decimal(10,2),

        //       CPK = LEAST(
        //         (
        //           (525 - (SELECT AVG(vm.value) FROM values_measurement vm)) /
        //           (3 * (
        //             SELECT (
        //               (SELECT SUM(MR) / COUNT(CASE WHEN MR >= 0 THEN 1 ELSE NULL END) AS Rbar FROM values_measurement) / 1.128
        //             )::numeric::decimal(10,2)
        //           ))
        //         )::numeric::decimal(10,2),
        //         (
        //           ((SELECT AVG(vm.value) FROM values_measurement vm) - 475) /
        //           (3 * (
        //             SELECT (
        //               (SELECT SUM(MR) / COUNT(CASE WHEN MR >= 0 THEN 1 ELSE NULL END) AS Rbar FROM values_measurement) / 1.128
        //             )::numeric::decimal(10,2)
        //           ))
        //         )::numeric::decimal(10,2)
        //       ),
        //       ucl = (
        //         (SELECT AVG(vm.value) FROM values_measurement vm) +
        //         (
        //           SELECT A2 FROM standardsample WHERE sample_size = 1
        //         ) *
        //         (
        //           SELECT SUM(MR) / COUNT(CASE WHEN MR >= 0 THEN 1 ELSE NULL END) AS Rbar
        //           FROM values_measurement
        //         )
        //       )::numeric::decimal(10, 2),
        //       lcl = (
        //         (SELECT AVG(vm.value) FROM values_measurement vm) -
        //         (
        //           SELECT A2 FROM standardsample WHERE sample_size = 1
        //         ) *
        //         (
        //           SELECT SUM(MR) / COUNT(CASE WHEN MR >= 0 THEN 1 ELSE NULL END) AS Rbar
        //           FROM values_measurement
        //         )
        //       )::numeric::decimal(10, 2);
        //   `);
       
//                 }
//                 else if (selectedOption == '2') {
//                   tableName = 'spc_result2';
//                   await pool.query(`
//                   UPDATE spc_result2
//                   SET
//                     xbar = (SELECT AVG(vm.value) FROM values_measurement vm),
//                     sd = (SELECT STDDEV(vm.value)::numeric::decimal(10,3) FROM values_measurement vm),
//                     USL = 525, LSL = 475, pp = ((USL - LSL) / (6 * sd))::numeric::decimal(10,2),
//                     PPU = ((USL - xbar) / (3 * sd))::numeric::decimal(10,2),
//                     PPL = ((xbar - LSL) / (3 * sd))::numeric::decimal(10,2),
//                     Ppk = LEAST((USL - xbar) / (3 * sd), (xbar - LSL) / (3 * sd))::numeric::decimal(10,2),
//                     rbar = (SELECT SUM(range) / COUNT(range)::numeric FROM range_chart2),
//                     SDW = (rbar / 1.128)::numeric::decimal(10,2),
//                     CP = ((USL - LSL) / (6 * sd))::numeric::decimal(10,2),
//                     CPU = ((USL - xbar) / (3 * SDW))::numeric::decimal(10,2),
//                     CPL = ((xbar - LSL) / (3 * SDW))::numeric::decimal(10,3),
//                     CPK = LEAST(CPU, CPL)::numeric::decimal(10,2),
//                     ucl = (xbar + (SELECT A2 FROM standardsample WHERE sample_size = 2) * rbar)::numeric::decimal(10, 2),
//                     lcl = (xbar - (SELECT A2 FROM standardsample WHERE sample_size = 2) * rbar)::numeric::decimal(10, 2);
                                
//                     `);
//         } 
        
//         else {
//           // If no row exists, insert a new one
//           res.status(400).json({ error: 'Invalid option selected' });
//           return;
//         }
    
//       } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//       }
// });






///xbar and SD is getting on screen 
// app.all('/calculate', async (req, res) => {
//   try {
//     const { selectedOption } = req.body;
//     console.log(req.body);
//     console.log('Selected Option:', selectedOption);
    
//     if (selectedOption === '1') {
//       console.log('Calculating for option 1');

//       // Calculate xbar, sd for the 'value' column in values_measurement table
//       const result = await pool.query('SELECT AVG(value) AS xbar, STDDEV(value) AS sd FROM values_measurement');
//       console.log(result);
//       // Extract xbar, sd from the result
//       const { xbar, sd } = result.rows[0];

//       // Insert xbar, sd into the spc_result table
//       await pool.query('INSERT INTO spc_result (xbar, sd) VALUES ($1, $2)', [xbar, sd]);

//       // Send a response
//       res.json({ xbar, sd});
//     } else {
//       res.status(400).json({ error: 'Invalid option selected' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
// });


// app.all('/calculate', async (req, res) => {
//   try {
//     const { selectedOption } = req.body;
//     console.log(req.body);
//     console.log('Selected Option:', selectedOption);

//     if (selectedOption === '1') {
//       console.log('Calculating for option 1');

//       // Calculate xbar, sd, and pp for the 'value' column in values_measurement table
//       const result = await pool.query('SELECT AVG(value) AS xbar, STDDEV(value) AS sd FROM values_measurement');
//       console.log(result);
//       // Extract xbar, sd, and pp from the result
//       const { xbar, sd } = result.rows[0];

//       // Insert xbar, sd into the spc_result table
//       await pool.query('INSERT INTO spc_result (xbar, sd) VALUES ($1, $2)', [xbar, sd]);

//       // Update usl, lsl, and pp in the spc_result table
//       await pool.query('UPDATE spc_result SET usl = 525, lsl = 475, pp = (SELECT (usl - lsl) / (6 * sd)::numeric::decimal(10, 2) FROM spc_result)');

//       // Send a response
//       res.json({ xbar, sd });
//     } else {
//       res.status(400).json({ error: 'Invalid option selected' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Internal Server Error' });
//   }
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

app.all('/calculate', async (req, res) => {
  try {
    const { selectedOption } = req.body;
    console.log(req.body);
    console.log('Selected Option:', selectedOption);

    if (selectedOption === '1') {
      console.log('Calculating for option 1');

      // Calculate xbar, sd for the 'value' column in values_measurement table
      const result = await pool.query('SELECT AVG(value) AS xbar, STDDEV(value) AS sd FROM values_measurement');
      console.log(result);

      // Extract xbar, sd from the result
      const { xbar, sd } = result.rows[0];

      // Insert xbar, sd into the spc_result table
      await pool.query('INSERT INTO spc_result (xbar, sd) VALUES ($1, $2)', [xbar, sd]);

      await pool.query('UPDATE spc_result SET usl = 525, lsl = 475');
      // Calculate pp
      const ppResult = await pool.query('SELECT (usl - lsl) / (6 * sd)::numeric::decimal(10, 2) AS pp FROM spc_result');
      const pp = ppResult.rows[0].pp;

      // Update pp in the spc_result table
      await pool.query('UPDATE spc_result SET pp = $1', [pp]);

      // Calculate PPU
      const ppuResult = await pool.query('SELECT ((usl - xbar) / (3 * sd))::numeric::decimal(10, 2) AS ppu FROM spc_result');
      const ppu = ppuResult.rows[0].ppu;

      // Update PPU in the spc_result table
      await pool.query('UPDATE spc_result SET PPU = $1', [ppu]);

      // Calculate PPL
      const pplResult = await pool.query('SELECT ((xbar - lsl) / (3 * sd))::numeric::decimal(10, 2) AS ppl FROM spc_result');
      const ppl = pplResult.rows[0].ppl;

      // Update PPL in the spc_result table
      await pool.query('UPDATE spc_result SET PPL = $1', [ppl]);

      // Calculate Ppk
      const ppkResult = await pool.query('SELECT LEAST((usl - xbar) / (3 * sd), (xbar - lsl) / (3 * sd))::numeric::decimal(10, 2) AS ppk FROM spc_result');
      const ppk = ppkResult.rows[0].ppk;

      // Update Ppk in the spc_result table
      await pool.query('UPDATE spc_result SET Ppk = $1', [ppk]);

      // Calculate RBAR
      const rbarResult = await pool.query('SELECT SUM(MR) / COUNT(CASE WHEN MR >= 0 THEN 1 ELSE NULL END) AS Rbar FROM values_measurement');
      const rbar = rbarResult.rows[0].rbar;

      // Update RBAR in the spc_result table
      await pool.query('UPDATE spc_result SET RBAR = $1', [rbar]);

      // Calculate SDW
      const sdwResult = await pool.query('SELECT (RBAR / 1.128)::numeric::decimal(10, 2) AS SDW FROM spc_result');
      const sdw = sdwResult.rows[0].sdw;

      // Update SDW in the spc_result table
      await pool.query('UPDATE spc_result SET SDW = $1', [sdw]);

      // Calculate CP
      const cpResult = await pool.query('SELECT (usl - lsl) / (6 * sd)::numeric::decimal(10, 2) AS cp FROM spc_result');
      const cp = cpResult.rows[0].cp;

      // Update CP in the spc_result table
      await pool.query('UPDATE spc_result SET CP = $1', [cp]);

      // Calculate CPU
      const cpuResult = await pool.query('SELECT ((usl - xbar) / (3 * sdw))::numeric::decimal(10, 2) AS cpu FROM spc_result');
      const cpu = cpuResult.rows[0].cpu;

      // Update CPU in the spc_result table
      await pool.query('UPDATE spc_result SET CPU = $1', [cpu]);

      // Calculate CPL
      const cplResult = await pool.query('SELECT ((xbar - lsl) / (3 * sdw))::numeric::decimal(10, 3) AS cpl FROM spc_result');
      const cpl = cplResult.rows[0].cpl;

      // Update CPL in the spc_result table
      await pool.query('UPDATE spc_result SET CPL = $1', [cpl]);

      // Calculate CPK
      const cpkResult = await pool.query('SELECT LEAST(cpu, cpl)::numeric::decimal(10, 2) AS cpk FROM spc_result');
      const cpk = cpkResult.rows[0].cpk;

      // Update CPK in the spc_result table
      await pool.query('UPDATE spc_result SET CPK = $1', [cpk]);

      // Calculate UCL
      const uclResult = await pool.query('SELECT (xbar + ((SELECT A2 FROM standardsample WHERE sample_size = 1) * rbar))::numeric::decimal(10, 2) AS ucl FROM spc_result');
      const ucl = uclResult.rows[0].ucl;

      // Update UCL in the spc_result table
      await pool.query('UPDATE spc_result SET UCL = $1', [ucl]);

      // Calculate LCL
      const lclResult = await pool.query('SELECT (xbar - ((SELECT A2 FROM standardsample WHERE sample_size = 1) * rbar))::numeric::decimal(10, 2) AS lcl FROM spc_result');
      const lcl = lclResult.rows[0].lcl;

      // Update LCL in the spc_result table
      await pool.query('UPDATE spc_result SET LCL = $1', [lcl]);

      // Send a response
      res.json({ xbar, sd, pp, ppu, ppl, ppk, rbar, sdw, cp, cpu, cpl, cpk, ucl, lcl });
    } else {
      res.status(400).json({ error: 'Invalid option selected' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});







