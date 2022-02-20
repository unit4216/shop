$(document).ready(function($) {

    //input validation function for EDIT and ADD
    function validateInput(pN,pD,pP,pIU,nameSelector,descSelector,priceSelector,urlSelector){

        //checks for empty name field or presence of backslash
        if(pN == '' | pN.includes('\\')==true){

            if(pN==''){
                document.getElementById(nameSelector).style.visibility = "visible";
                document.getElementById(nameSelector).innerHTML = 'Name cannot be empty.';
            }

            else if(pN.includes('\\')==true){
                document.getElementById(nameSelector).style.visibility = "visible";
                document.getElementById(nameSelector).innerHTML = 'Invalid character: \\';
            }

            } else{
            //this resets the invalid message in case this field is fixed but there are other errors present on form
            document.getElementById(nameSelector).style.visibility = "hidden";  
            }  

        //checks for presence of backslash
        if(pD.includes('\\')==true){
            document.getElementById(descSelector).style.visibility = "visible";
            document.getElementById(descSelector).innerHTML = 'Invalid character: \\';
        } else{
            document.getElementById(descSelector).style.visibility = "hidden";
        }

        //checks if price can be parsed as number but not whether the field is populated (i.e. price can be empty)
        if(isNaN(parseFloat(pP)) && pP != ''){
            document.getElementById(priceSelector).style.visibility = "visible";
            document.getElementById(priceSelector).innerHTML = 'Price must be a number.';
        } else{
            document.getElementById(priceSelector).style.visibility = "hidden";
        }

        //checks for presence of single quote, double quote, or backslash in URL
        if(pIU.includes('\\')==true | pIU.includes("'")==true | pIU.includes('"')==true){
            document.getElementById(urlSelector).style.visibility = "visible";
            document.getElementById(urlSelector).innerHTML = 'Invalid character in URL.';
        } else {
            document.getElementById(urlSelector).style.visibility = "hidden";
        }
        
    }
    
    //listens for clicks on EDIT, ADD, or DELETE buttons which triggers respective functions
    document.body.addEventListener('click', e => {
        if (e.target.className === 'btn btn-primary editProductFormButton'){

            e.preventDefault();

            var id = e.target.id.replace('edit','');
            
            var pN = document.getElementById(`editProductName${id}`).value 
            var pD = document.getElementById(`editProductDescription${id}`).value 
            var pP = document.getElementById(`editProductPrice${id}`).value 
            var pIU = document.getElementById(`editProductImageURL${id}`).value 
            var productToEdit = {product_id: id,name: pN, description: pD, price: pP, photo_url: pIU}

            //if bad input detected, send inputs to validation function to be parsed to return exact errors to user
            if(pN == '' | (isNaN(parseFloat(pP)) && pP != '') | pN.includes('\\')==true | pD.includes('\\')==true | pIU.includes('\\')==true | pIU.includes("'")==true | pIU.includes('"')==true){
                validateInput(pN,pD,pP,pIU,`nameInvalid${id}`,`descInvalid${id}`,`priceInvalid${id}`,`urlInvalid${id}`)
                return;
            }

            //if input is good, continue
            else {
                //dismiss modal
                $(`#product${id}`).modal('hide'); 

                //convert price to float and round to 2 decimal places if necessary. 
                var modPrice = parseFloat(pP);
                modPrice = modPrice.toFixed(2);
                if(modPrice != 'NaN'){                  //only pushes modified price to object if price != null
                    productToEdit.price= modPrice;
                }

                $.ajax({
                    url: '/editProduct',
                    data: productToEdit,
                    type: 'POST',
                    success: function(data){
                        console.log('AJAX edit success');
                        displayAll('admin');
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        console.log("AJAX edit error");
                    }
                
                });
            }
        }

        if (e.target.id === 'addProductFormButton'){
            e.preventDefault();
            var pN = document.getElementById('productName').value 
            var pD = document.getElementById('productDescription').value 
            var pP = document.getElementById('productPrice').value 
            var pIU = document.getElementById('productImageURL').value 
            var productToAdd = {name: pN, description: pD, price: pP, photo_url: pIU}

            //input validation
            if(pN == '' | (isNaN(parseFloat(pP)) && pP != '') | pN.includes('\\')==true | pD.includes('\\')==true | pIU.includes('\\')==true | pIU.includes("'")==true | pIU.includes('"')==true){
                validateInput(pN,pD,pP,pIU,`nameInvalid`,`descInvalid`,`priceInvalid`,`urlInvalid`)
                return;
            }

            else{

                //dismiss modal
                $(`#addProductModal`).modal('hide'); 

                //convert price to float and round to 2 decimal places if necessary. 
                var modPrice = parseFloat(pP);
                modPrice = modPrice.toFixed(2);
                if(modPrice != 'NaN'){                  //only pushes modified price to object if price != null
                    productToAdd.price= modPrice;
                }

                $.ajax({
                    url: '/addProduct',
                    data: productToAdd,
                    type: 'POST',
                    success: function(data){
                        console.log('AJAX add success');
                        displayAll('admin');
                    },
                    error: function(XMLHttpRequest, textStatus, errorThrown) {
                        console.log("AJAX add error");
                    }
                });
            }
        }
        
        if (e.target.className === 'btn btn-danger deleteProductFormButton'){
            e.preventDefault();

            var productToDeleteID = {}

            //gets ID of product to delete
            productToDeleteID['ID'] = e.target.id.replace('delete','');

            $.ajax({
                url: '/deleteProduct',
                data: productToDeleteID,
                type: 'POST',
                success: function(data){
                    console.log('AJAX delete success');
                    displayAll('admin');
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                    console.log("AJAX delete error");
                }
            });
        }
    });
});            

//resets modals on close so that invalid messages and changed values don't persist
$(document).ready(function($) {
    $('.modal.fade').on('hidden.bs.modal', function () {
        $(this).find('form').trigger('reset');               //reset form values
        $(this).find('.invalid').css('visibility','hidden'); //reset invalid messages
        $(this).find('.invalid').html('');
    })
});

displayAll('admin');

/*
//runs on load and when called to pull data from server and display products
function displayAll(){

    var req = new XMLHttpRequest();
    var url = '/display';

    req.open('POST',url,true); // set this to POST if you would like
    req.addEventListener('load',onLoad);
    req.addEventListener('error',onError);

    req.send();

}

function onLoad() {

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

        productsHTML = productsHTML.concat(' ', `
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

        `);
    }

    document.getElementById('adminProducts').innerHTML = '';
    document.getElementById('adminProducts').innerHTML = productsHTML;

}

function onError() {
    console.log('error receiving display AJAX call');
}

*/