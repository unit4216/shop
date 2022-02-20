displayAll('admin');

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