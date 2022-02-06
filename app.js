// Express server set up and routing

var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

//define folder for static files (JS/CSS/etc)
app.use(express.static('static'));  

//this must be included to properly parse JSON data from AJAX requests
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
  //console.log('display successful');

  //displayProducts(); 

  //response.send(products); //send response

  //iterates over SQL database to copy data to new object
  db.all('SELECT * FROM shop_table',[],(err, rows ) => {
    var products = [];
      if (err) {
          throw err;
        }
        rows.forEach((row) => {products.push(row);}); 
        //console.log(products)
        response.send(products); //have to send callback response inside this function or else it doesn't work properly and you have to reload page for updated Products JSON    
  });

  //console.log('this is whats getting sent');
  //console.log(products);

  //console.log(request.body);

  //response.redirect('/admin.html'); //redirects back to same page so that there is no redirect - possibly unnecessary and prevents sending of more data
  //console.log('this is whats getting sent')
  //console.log(products);
  
});

//Add Product route
app.post('/addProduct', (request, response) => {
  console.log('add prod successful');
  response.send('add prod test successful'); //send response

  var productToAdd = request.body;

  addProduct(productToAdd);

  //response.redirect('/admin.html'); //redirects back to same page so that there is no redirect - possibly unnecessary and prevents sending of more data
  //console.log(request.body);
  
});


//Delete Product route
app.post('/deleteProduct', (request, response) => {
  console.log('delete prod successful');
  response.send('delete prod test successful'); //send response

  var productToDelete = request.body;
  var productToDeleteID = productToDelete['ID'];

  deleteProduct(productToDeleteID);

  //response.redirect('/admin.html'); //redirects back to same page so that there is no redirect - possibly unnecessary and prevents sending of more data
  //console.log(productToDeleteID);
  
});

//Edit Product route
app.post('/editProduct', (request, response) => {
  console.log('edit prod successful');
  response.send('edit prod test successful'); //send response

  var productToEdit = request.body;

  editProduct(productToEdit);

  //response.redirect('/admin.html'); //redirects back to same page so that there is no redirect - possibly unnecessary and prevents sending of more data
  //console.log('output of edit route')
  //console.log(productToEdit);

  //displayProducts();
  
});




//Sqlite module init
const sqlite3 = require('sqlite3').verbose();

//open connection to db
let db= new sqlite3.Database('shop.db')

console.log(db)

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

  /*
  add_product = `INSERT INTO shop_table (name,description,price,photo_url) VALUES (${prodName},${prodDesc},${prodPrice},${prodPhoto})`
    
  db.all(add_product,[],(err, rows ) => {
      if (err) {
          throw err;
        }
        rows.forEach((row) => {
          //console.log(row);
        });
  });*/

}

//generates the 'products' object which is basically the variable containing the database
displayProducts();

//updates the 'products' object with current state of db
function displayProducts(){
  //makes SQL request for all data from table
  display = 'SELECT * FROM shop_table'

  //iterates over SQL database to copy data to new object
  db.all(display,[],(err, rows ) => {
    products = [];
      if (err) {
          throw err;
        }
        rows.forEach((row) => {
          //console.log(row);
          products.push(row);
        });      
    //console.log('output of display func');
    //console.log(products);
  });
  //return db.all();
}

function deleteProduct(id){
  
  //delete product
  const deleteProduct = `DELETE FROM shop_table WHERE product_id = ${id}`

  db.all(deleteProduct,[],(err, rows ) => {
      if (err) {
          throw err;
        }
        rows.forEach((row) => {
          //console.log(row);
        });
      });        

}

function editProduct(product){
  
  //edit product
  var name = product.name;
  var price = product.price;
  var url = product.photo_url;
  var desc = product.description; 
  var id = product.product_id;

  //sanitize inputs
  
  db.run(`UPDATE shop_table SET name = ?,price = ?,photo_url = ?,description = ? WHERE product_id = ${id}`, name, price, url, desc);

  /*
  const editProduct = `UPDATE shop_table SET name = "${name}",price = "${price}",photo_url = "${url}",description = "${desc}" WHERE product_id = ${id};`

  db.all(editProduct,[],(err, rows ) => {
      if (err) {
          throw err;
        }
        rows.forEach((row) => {
          //console.log('edit func output');
          //console.log(row);
        });
      });     
      
  */

}

/*
var productsHTML = ''

for (let i = 0; i < products.length; i++) {
  var product = products[i];
  productsHTML.concat(' ', `<a href='#'>${product}</a>`);
}

console.log(productsHTML);
*/



/*
//close db connection
db.close((err) => {
    if (err) {
      return console.error(err.message);
    }
    console.log('Closed the database connection.');
  });

*/



/*
//Function call via form post, works but refreshes page
app.post('/function', (request, response) => {
  console.log('test successful');
  response.redirect('/admin.html'); //redirects back to same page so that there is no redirect
  //addItem();
});
*/
