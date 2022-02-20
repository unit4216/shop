class productGridItem {

    constructor(productName, productNameNoQuotes, productPrice, productPriceNoQuotes, inputDesc, productPhoto, productID, productDesc) {

        this.name = productName;
        this.nameNQ = productNameNoQuotes;
        this.price = productPrice;
        this.priceNQ = productPriceNoQuotes;
        this.inputDesc = inputDesc;
        this.photo = productPhoto;
        this.id = productID;
        this.desc = productDesc;

    }

    get userHTML() {
        return this.generateUserHTML();
    }

    get adminHTML() {
        return this.generateAdminHTML();
    }

    generateUserHTML(){

        var userHTML = `
        <button type='button' style='background: url(${this.photo}) no-repeat;' class='btn btn-light shadow product' data-bs-toggle='modal' data-bs-target='#product${this.id}'><span>${this.nameNQ}<br><br><div class='hoverContent'><div class='hoverInnerDesc'>${this.desc}</div><br>$${this.priceNQ}</div></span></button>

        <div class="modal fade" id='product${this.id}' tabindex="-1" role="dialog" aria-labelledby="viewProduct${this.id}" aria-hidden="true">
            <div class="modal-dialog modal-lg" role="document">
                <div class="modal-content">   
                    <div class="modal-body User">
                        <div class="container col-md-12 userModalContainer">
                            <div class="row">
                                <div class="col-md-6">
                                    <img src=${this.photo} class='modalPhoto'>
                                </div>
                                <div class="col-md-6">
                                    <button type="button" class="btn-close userBtnClose" data-bs-dismiss="modal" aria-label="Close"></button>
                                    <div>
                                        <div class='modalProductName'>${this.nameNQ}</div>
                                        <div class='modalProductDesc'>${this.desc}</div>
                                        <div class='modalProductPrice'>$${this.priceNQ}</div>
                                        <form method='post' class='addProductToCart' id='addProductToCart${this.id}'>
                                            <button type="button" onclick=addToCart(${this.id}) class="btn btn-primary btnAddToCart" data-bs-dismiss="modal">Add to Cart</button>
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
        return userHTML;
    }

    generateAdminHTML(){

        var adminHTML = `
        <button type='button' style='background: url(${this.photo}) no-repeat;' class='btn btn-light shadow product' data-bs-toggle='modal' data-bs-target='#product${this.id}'><span>#${this.id} - ${this.nameNQ}<br><br><div class='hoverContent'><div class='hoverInnerDesc'>${this.desc}</div><br>$${this.priceNQ}</div></span></button>

        <div class="modal fade" id='product${this.id}' tabindex="-1" role="dialog" aria-labelledby="editProductLabel${this.id}" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editProductLabel${this.id}">Edit Product</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                        </button>
                    </div>
                    <div class="modal-body">
                        <form method='post' id='editProductForm${this.id}'>
                            <label for="editProductName">Product Name</label>
                                <input type='text' class='form-control' id='editProductName${this.id}' value=${this.name} maxlength='25'></input>
                                <div id='nameInvalid${this.id}' class='invalid'></div>
                                <br>
                            <label for="editProductDescription">Product Description</label>
                                <textarea class='form-control' id='editProductDescription${this.id}' rows='3' maxlength='200'>${this.inputDesc}</textarea>
                                <div id='descInvalid${this.id}' class='invalid'></div>
                                <br>
                            <label for="editProductPrice">Product Price</label>
                                <input type='text' class='form-control' id='editProductPrice${this.id}' value=${this.price} maxlength='10'></input>
                                <div id='priceInvalid${this.id}' class='invalid'></div>
                                <br>
                            <label for="editProductImageURL">Product Image URL</label>
                                <input type='text' class='form-control' id='editProductImageURL${this.id}' value=${this.photo} maxlength='200'></input>
                                <div id='urlInvalid${this.id}' class='invalid'></div>
                                <br>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger deleteProductFormButton" id='delete${this.id}' data-bs-dismiss="modal">Delete Product</button>
                        
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        
                        <button type="button" class="btn btn-primary editProductFormButton" id='edit${this.id}'>Edit Product</button>
                    </div>
                </div>
            </div>
        </div>
        `

        return adminHTML;
    }

}

//runs on load and when called to pull data from server and display products
function displayAll(page, sort){
    
    $.ajax({
        url: '/display',
        type: 'POST',
        success: function(data){
            onLoad(data, page, sort);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("AJAX display error");
            onError();
        }
    });

}

function onLoad(data, page, sort) {

    productsObject = data;

    //user page sort selector
    if(sort == 1){
        productsObject.sort((a, b) => {
            return b.price - a.price;
        });
    }
    else if(sort == 2){
        productsObject.sort((a, b) => {
            return a.price - b.price;
        });
    }

    //parses object to create HTML to send to div
    productsHTML = '';
    for (let i = 0; i < productsObject.length; i++) {
        var productName = JSON.stringify(productsObject[i].name);
            var productNameNoQuotes = productName.substring(1, productName.length-1); //removes first and last char (dbl quotes)
            productNameNoQuotes= productNameNoQuotes.replaceAll('\\"', '&quot;');  //replaces dbl quote with HTML dbl quote code
            productName = '"'+productNameNoQuotes+'"';
        var productPrice = JSON.stringify(productsObject[i].price);
            var productPriceNoQuotes = productPrice.substring(1, productPrice.length-1); 
        var inputDesc = JSON.stringify(productsObject[i].description);
            inputDesc = inputDesc.substring(1, inputDesc.length-1); 
            inputDesc = inputDesc.replaceAll('\\n', '&#13;'); //replace newlines with HTML newline code for textarea
            inputDesc = inputDesc.replaceAll('\\"', '&quot;');  
        var productDesc = inputDesc.replaceAll('&#13;','<br/>') //newline code doesn't work on hover so it must be replaced with <br/>
        var productPhoto = JSON.stringify(productsObject[i].photo_url);
        var productID = JSON.stringify(productsObject[i].product_id)

        const item = new productGridItem(productName, productNameNoQuotes, productPrice, productPriceNoQuotes, inputDesc, productPhoto, productID, productDesc)

        if(page == 'admin'){
            productsHTML = productsHTML.concat(' ', item.adminHTML);
        } else if(page == 'user'){
            productsHTML = productsHTML.concat(' ', item.userHTML);
        }
    }   

    if(page == 'admin'){
        document.getElementById('adminProducts').innerHTML = '';
        document.getElementById('adminProducts').innerHTML = productsHTML;
    } else if(page == 'user'){
        document.getElementById('shopProducts').innerHTML = '';
        document.getElementById('shopProducts').innerHTML = productsHTML;
    }
}

function onError() {
    console.log('error receiving display AJAX call');
}