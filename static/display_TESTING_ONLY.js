function generateDisplayHTML(productName,productNameNoQuotes,productPrice,productPriceNoQuotes,productDesc,hoverDesc,productPhoto,productID){

    var userDisplayHTML = `
    <button type='button' style='background: url(${productPhoto}) no-repeat;' class='btn btn-light shadow product' data-bs-toggle='modal' data-bs-target='#product${productID}'><span>${productNameNoQuotes}<br><br><div class='hoverContent'><div class='hoverInnerDesc'>${productDesc}</div><br>$${productPriceNoQuotes}</div></span></button>

    <div class="modal fade" id='product${productID}' tabindex="-1" role="dialog" aria-labelledby="viewProduct${productID}" aria-hidden="true">
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">   
                <div class="modal-body User">
                    <div class="container col-md-12 userModalContainer">
                        <div class="row">
                            <div class="col-md-6">
                                <img src=${productPhoto} class='modalPhoto'>
                            </div>
                            <div class="col-md-6">
                                <button type="button" class="btn-close userBtnClose" data-bs-dismiss="modal" aria-label="Close"></button>
                                <div>
                                    <div class='modalProductName'>${productNameNoQuotes}</div>
                                    <div class='modalProductDesc'>${productDesc}</div>
                                    <div class='modalProductPrice'>$${productPriceNoQuotes}</div>
                                    <form method='post' class='addProductToCart' id='addProductToCart${productID}'>
                                        <button type="button" onclick=addToCart(${productID}) class="btn btn-primary btnAddToCart" data-bs-dismiss="modal">Add to Cart</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `

    var adminDisplayHTML = `
    <button type='button' style='background: url(${productPhoto}) no-repeat;' class='btn btn-light shadow product' data-bs-toggle='modal' data-bs-target='#product${productID}'><span>#${productID} - ${productNameNoQuotes}<br><br><div class='hoverContent'><div class='hoverInnerDesc'>${hoverDesc}</div><br>$${productPriceNoQuotes}</div></span></button>

    <div class="modal fade" id='product${productID}' tabindex="-1" role="dialog" aria-labelledby="editProductLabel${productID}" aria-hidden="true">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="editProductLabel${productID}">Edit Product</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                    </button>
                </div>
                <div class="modal-body">
                    <form method='post' id='editProductForm${productID}'>
                        <label for="editProductName">Product Name</label>
                            <input type='text' class='form-control' id='editProductName${productID}' value=${productName} maxlength='25'></input>
                            <div id='nameInvalid${productID}' class='invalid'></div>
                            <br>
                        <label for="editProductDescription">Product Description</label>
                            <textarea class='form-control' id='editProductDescription${productID}' rows='3' maxlength='200'>${productDesc}</textarea>
                            <div id='descInvalid${productID}' class='invalid'></div>
                            <br>
                        <label for="editProductPrice">Product Price</label>
                            <input type='text' class='form-control' id='editProductPrice${productID}' value=${productPrice} maxlength='10'></input>
                            <div id='priceInvalid${productID}' class='invalid'></div>
                            <br>
                        <label for="editProductImageURL">Product Image URL</label>
                            <input type='text' class='form-control' id='editProductImageURL${productID}' value=${productPhoto} maxlength='200'></input>
                            <div id='urlInvalid${productID}' class='invalid'></div>
                            <br>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-danger deleteProductFormButton" id='delete${productID}' data-bs-dismiss="modal">Delete Product</button>
                    
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    
                    <button type="button" class="btn btn-primary editProductFormButton" id='edit${productID}'>Edit Product</button>
                </div>
            </div>
        </div>
    </div>
    `
    /*
    if(page=='user'){
        return userDisplayHTML;
    }
    else if(page=='admin'){
        return adminDisplayHTML;
    }*/

    return adminDisplayHTML;

}


//runs on load and when called to pull data from server and display products
function displayAll(){

    var req = new XMLHttpRequest();
    var url = '/display';

    req.open('POST',url,true); 
    //req.addEventListener('load',onLoad());
    //req.addEventListener('error',onError);

    req.onreadystatechange = function () {
        if(req.readyState === XMLHttpRequest.DONE) {
          onLoad();
        }
    }
    
    req.send();


}

function onLoad() {
    console.log(this.responseText)

    //parses object to create HTML to send to div
    productsObject = JSON.parse(this.responseText)
    productsHTML = ''
    for (let i = 0; i < productsObject.length; i++) {
        var productName = JSON.stringify(productsObject[i].name);
            var productNameNoQuotes = productName.substring(1, productName.length-1); //removes first and last char (dbl quotes)
            productNameNoQuotes= productNameNoQuotes.replaceAll('\\"', '&quot;');  //replaces dbl quote with HTML dbl quote code
            productName = '"'+productNameNoQuotes+'"';
        var productPrice = JSON.stringify(productsObject[i].price);
            var productPriceNoQuotes = productPrice.substring(1, productPrice.length-1); 
        var productDesc = JSON.stringify(productsObject[i].description);
            productDesc = productDesc.substring(1, productDesc.length-1); 
            productDesc = productDesc.replaceAll('\\n', '&#13;'); //replace newlines with HTML newline code for textarea
            productDesc = productDesc.replaceAll('\\"', '&quot;');  
        var hoverDesc = productDesc.replaceAll('&#13;','<br/>') //newline code doesn't work on hover so it must be replaced with <br/>
        var productPhoto = JSON.stringify(productsObject[i].photo_url);
        var productID = JSON.stringify(productsObject[i].product_id)

        productsHTML = productsHTML.concat(' ', generateDisplayHTML(productName,productNameNoQuotes,productPrice,productPriceNoQuotes,productDesc,hoverDesc,productPhoto,productID));
    }   

    document.getElementById('adminProducts').innerHTML = '';
    document.getElementById('adminProducts').innerHTML = productsHTML;

}

function onError() {
    console.log('error receiving display AJAX call');
}