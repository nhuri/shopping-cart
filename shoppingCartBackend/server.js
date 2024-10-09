const dotenv = require("dotenv");

const { connectDB } = require("./utils/connectDB");
dotenv.config();

const app = require("./app");

const connectionStr = process.env.MONGO_DB_ATLAS.replace(
  "<password>",
  process.env.MONGO_DB_ATLAS_PASSWORD
).replace("<username>", process.env.MONGO_DB_ATLAS_USERNAME);
console.log(connectionStr);

connectDB(connectionStr);

const port = 8000 || 8001;
app.listen(port, "127.0.0.1", () => {
  console.log(`Server is listening on port ${port}`);
});

//http://localhost:8000/api/shoppi/products/123?breakfast&10

// const fs = require('fs')

// fs.readFile('./sample-data/text1.txt', 'utf-8',(err, data)=>{
//     fs.writeFile('./sample-data/text2.txt', data + 'hello', ()=>{
//         fs.readFile('./sample-data/text2.txt', 'utf-8', (err, data1)=>{
//             fs.writeFile('./sample-data/text1.txt', data + '\n' + data1, ()=>{
//                 console.log('the data has been writen');
//             })
//         })
//     })
//     if (!err) console.log(data);
//     else console.log(err.message);
// })
// // fs.writeFile('./sample-data/text1.txt', 'hello', 'utf-8')
// // console.log(text1);
// console.log('Netanel');
