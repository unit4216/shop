displayAll('user');

//checks if myCart item exists in localStorage, if not it initializes it
if (localStorage.getItem("myCart") === null) {
    myCart=[];
}
else if (localStorage.getItem("myCart") != null){
    myCart = JSON.parse(localStorage.getItem("myCart"));
}

function addToCart(id){

    //filters products array by product_id to extract item (have to do parse/stringify to make deep copy of filtered result from array)
    var productToAdd = JSON.parse(JSON.stringify((productsObject.filter(obj => {
        return obj.product_id === id
        }))));

    //removes object from single-object array
    productToAdd=productToAdd[0];

    //init quantity property for item
    productToAdd.quantity = 1;

    //generate list of PIDs to check against
    var pidList = myCart.map(a => a.product_id);

    //checks if product ID exists in cart, if so it finds and increments the quantity of existing entry
    if (pidList.includes(productToAdd.product_id)){
        for (let i = 0; i < myCart.length; i++) {
            if (productToAdd.product_id == myCart[i].product_id){
                myCart[i].quantity++;
            }
        }
    }

    //if PID is not already in cart, it adds object to cart
    else if (pidList.includes(productToAdd.product_id)==false){
        myCart.push(productToAdd);
    }

    //set updated myCart object to localStorage
    localStorage.setItem("myCart", JSON.stringify(myCart));

}

//populates myCart onclick of My Cart link
function populateCart(){

    //check if myCart exists in localStorage
    if (localStorage.getItem("myCart") === null) {
        document.getElementById('myCartModalBody').innerHTML = 'No items added to cart.';
    }
    else if (localStorage.getItem("myCart") != null){                

        //get sum of cart
        cartSum=0;
        for (let i = 0; i < myCart.length; i++) {
            var lineSum = parseFloat(myCart[i].price) * myCart[i].quantity;
            cartSum = cartSum + lineSum;
        }
        
        //round to 2 decimal points
        cartSum = cartSum.toFixed(2);

        //generate HTML
        myCartHTML='<div id="myCartHeader">Product <div id="cartQtyTitle">Qty</div><div id="cartPriceTitle">Price</div></div><br>'
        for (let i = 0; i < myCart.length; i++) {
            var myCartProdName = myCart[i].name;
            var myCartProdPrice = myCart[i].price;
            var myCartProdQuantity = myCart[i].quantity;
            var myCartProdID = myCart[i].product_id;
            var myCartHTML = myCartHTML.concat(' ', `
            <div class='cartProdContainer'>
                <div class='cartProdName'>${myCartProdName}</div> 
                <div class='btnUpdateQty'><a href='#' onclick=updateQty(${myCartProdID})>Update</a></div>
                <div class='inputUpdateQty'>
                    <input type='number' class='form-control qty' value='${myCartProdQuantity}' id='changeQty${myCartProdID}' min='1' max='99'></input>
                </div> 
                <div class='cartProdPrice'> x $${myCartProdPrice}</div>
                <a href='#' onclick=deleteProduct(${myCartProdID})><img id='trashIcon' src='trash.svg' height=18 width=18></a>
            </div><br>
            `)
        }

        //add sum to HTML
        myCartHTML = myCartHTML.concat(' ',`<div id='cartSumContainer'><div id='cartSumTitle'>Total</div> <div id='cartSum'>$${cartSum}</div></div>`)

        //send HTML to modal
        document.getElementById('myCartModalBody').innerHTML = myCartHTML;

    }
}

function populateMyOrders(){

    //check if myOrders array exists in localStorage
    if (localStorage.getItem("myOrders") === null) {
        document.getElementById('myOrdersModalBody').innerHTML = 'No orders to show.';
    }
    else if (localStorage.getItem("myOrders") != null){

        //retrieve myOrders from localStorage
        myOrders = JSON.parse(localStorage.getItem("myOrders"));

        //init myOrdersHTML
        myOrdersHTML='<div id="accordion">'

        //populate myOrdersHTML by generating accordion HTML for each order/item-in-order
        //iterate through orders
        for (let i = 0; i < myOrders.length; i++) {
            frontendHTML = `
            <div class="card">
                <div class="card-header" id='heading${i}'>
                    <h5 class="mb-0">
                        <button class="btn btn-link collapsed myOrder" data-bs-toggle="collapse" data-bs-target="#collapse${i}" aria-expanded="false" aria-controls="collapse${i}">
                            Order ${myOrders[i][0].datetime} <img src='dropdown_arrow.png' height=10 width=10>
                        </button>
                    </h5>
                </div>

                <div id="collapse${i}" class="collapse" aria-labelledby="heading${i}" data-parent="#accordion">
                    <div class="card-body">
                        <ul class='list-group'>
            `;
            bookendHTML=`</ul></div></div></div>`;
            innerProductsHTML='';

            //init Sum variable to add totals
            orderSum=0;
            //iterate through items in each order
            for (let x = 0; x < myOrders[i].length; x++) {
                listProductHTML=`
                <li class='list-group-item'>
                <div class='orderItemName'>${myOrders[i][x].name}</div>
                <div class='orderItemQty'>x${myOrders[i][x].quantity}</div>
                <div class='orderItemPrice'>$${myOrders[i][x].price}</div>
                </li>
                `
                orderSum = orderSum + (myOrders[i][x].quantity * myOrders[i][x].price);
                innerProductsHTML=innerProductsHTML.concat(' ',listProductHTML);
            }

            //round total to 2 decimal points
            orderSum=orderSum.toFixed(2);
            
            //add HTML for sum
            sumHTML=`<li class='list-group-item orderSumTitle'>Total<div class='orderSum'>$${orderSum}</div></li>`;

            //concat all HTML together
            myOrdersHTML=myOrdersHTML.concat(' ',frontendHTML);
            myOrdersHTML=myOrdersHTML.concat(' ',innerProductsHTML);
            myOrdersHTML=myOrdersHTML.concat(' ',sumHTML);
            myOrdersHTML=myOrdersHTML.concat(' ',bookendHTML);

        }

        //close accordion div
        myOrdersHTML=myOrdersHTML.concat(' ','</div>');

        //send HTML to modal
        document.getElementById('myOrdersModalBody').innerHTML = myOrdersHTML;
    }
}

function updateQty(id){

    //gets new qty from input box
    var qtyToChange = document.getElementById(`changeQty${id}`).value;

    //update quantity of product in myCart object
    for (let i = 0; i < myCart.length; i++) {
        if (id == myCart[i].product_id){
            myCart[i].quantity = qtyToChange;
        }
    }

    //re-populates myCart modal (and recalculates new sum)
    populateCart();

    //set updated myCart object to localStorage
    localStorage.setItem("myCart", JSON.stringify(myCart));
    

}

function deleteProduct(id){

    //deletes product from myCart
    for (let i = 0; i < myCart.length; i++) {
        if (id == myCart[i].product_id){
            myCart.splice(i,1); 
        }
    }

    //re-populates myCart modal
    populateCart();

    //set updated myCart object to localStorage
    localStorage.setItem("myCart", JSON.stringify(myCart));

}

function checkout(){

    //check if myOrders is in localStorage/whether it needs to be initialized
    if (localStorage.getItem("myOrders") === null) {
        myOrders=[];
    }
    else if (localStorage.getItem("myOrders") != null){
        myOrders = JSON.parse(localStorage.getItem("myOrders"));
    }

    //add timestamp to order
    var currentDate = new Date();
    var datetime = "@ " + currentDate.toTimeString().substr(0,8) +" "+ (currentDate.getMonth()+1) +"/"+ currentDate.getDate() +"/"+ currentDate.getFullYear();
    myCart.forEach((x) => { x.datetime = datetime })

    //push current cart to myOrders
    myOrders.push(myCart);

    //set myOrders in localstorage and remove cart
    localStorage.setItem("myOrders",JSON.stringify(myOrders));
    localStorage.removeItem("myCart");

    //reset cart to empty after checkout
    myCart = [];
}