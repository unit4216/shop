// Express server set up and routing
var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var cors = require('cors');

const app = express();
const PORT = 5000;

//set up CORS (cross-origin) to get around CORS warnings/errors
app.use(cors());

//define folder for static files (JS/CSS/etc)
app.use(express.static('static'));  

//bodyParser used to properly parse JSON data from AJAX requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//define pages
var html = fs.readFileSync('index.html');
var admin = fs.readFileSync('admin.html');

app.use(express.json());

//CLI confirmation of server init
app.listen(PORT, () => console.log(`Express server currently running on port ${PORT}`));

//Express page routing
app.get('/', (request, response) => {
    response.end(html);
});

app.get('/admin.html', (request, response) => {
   response.end(admin);
});

//Display Products route
app.post('/display', (request, response) => {

  //iterates over SQL database to copy data to new object
  db.all('SELECT * FROM shop_table',[],(err, rows ) => {
    var products = [];
      if (err) {
          throw err;
        }
        rows.forEach((row) => {products.push(row);}); 
        response.send(products); //have to send callback response inside this function or else it doesn't wait for SQL operation to conclude  
  });

});

//Add Product route
app.post('/addProduct', (request, response) => {
  response.send('add prod successful'); //send response

  var productToAdd = request.body;

  addProduct(productToAdd);
  
});


//Delete Product route
app.post('/deleteProduct', (request, response) => {
  response.send('delete prod successful'); //send response

  var productToDelete = request.body;
  var productToDeleteID = productToDelete['ID'];

  deleteProduct(productToDeleteID);
  
});

//Edit Product route
app.post('/editProduct', (request, response) => {
  response.send('edit prod successful'); //send response

  var productToEdit = request.body;

  editProduct(productToEdit);
  
});

//Sqlite module init
const sqlite3 = require('sqlite3').verbose();

//open connection to db
let db= new sqlite3.Database('shop.db')

//create table if it doesn't exist
create_table = 'CREATE TABLE IF NOT EXISTS shop_table (product_id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, description TEXT, price TEXT, photo_url TEXT);'

db.all(create_table,[],(err, rows ) => {
    if (err) {
        throw err;
      }
      rows.forEach((row) => {
        console.log(row.name);
      });
});

function addProduct(p){

  prodName = p.name;
  prodPrice = p.price;
  prodDesc = p.description;
  prodPhoto = p.photo_url;

  db.run(`INSERT INTO shop_table (name,description,price,photo_url) VALUES (?,?,?,?)`,prodName,prodDesc,prodPrice,prodPhoto);

}

//generates the object containing all products
displayProducts();

//updates the products object with current state of db
function displayProducts(){

  display = 'SELECT * FROM shop_table'

  //iterates over SQL database to copy data to new object
  db.all(display,[],(err, rows ) => {
    products = [];
      if (err) {
          throw err;
        }
        rows.forEach((row) => {
          products.push(row);
        });      
  });

}

function deleteProduct(id){

  db.run(`DELETE FROM shop_table WHERE product_id=?`, id);

}

function editProduct(product){
  
  var name = product.name;
  var price = product.price;
  var url = product.photo_url;
  var desc = product.description; 
  var id = product.product_id;
  
  db.run(`UPDATE shop_table SET name = ?,price = ?,photo_url = ?,description = ? WHERE product_id = ${id}`, name, price, url, desc);

}