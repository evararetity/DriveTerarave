// =======================Log the Driver into the app after signup from web====================================
function login(){
    $("#login").attr("onClick", "doNothing()");
    $.mobile.loading("show");

    authDriver();
}

function authDriver(){

    window.plugins.OneSignal.getIds(function(userDetails) {
     
        $.ajax({
            type: "post",
            url: "http://teraraveweb.herokuapp.com/mobile/login",
            data: {
                email: $("#email").val(),
                password: $("#password").val(),
                notifID: userDetails.userId
            },
            success: function(data) {
                if (data.status == true) {
                    console.log(data.message)
    
                    $.mobile.loading("hide");
                    $("#error").empty()
                    $("#success").html(data.message)
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("fullname", data.fullname);
                    localStorage.setItem("id", data.id);
                    localStorage.setItem("vehicleName", data.vehicleName);
                    localStorage.setItem("vehicleModel", data.vehicleModel);
                    localStorage.setItem("vehicleType", data.vehicleType);
                    localStorage.setItem("numberPlate", data.numberPlate);
                    localStorage.setItem("regNumber", data.regNumber);
                    window.plugins.OneSignal.setSubscription(true)
                    $.mobile.navigate("#main-page");
    
                } else if (data.status == false) {
                    console.log(data.message)
    
                    $.mobile.loading("hide");
                    $("#error").html(data.message)
                    $("#login").attr("onClick", "login()")
    
                }
            },
            error: function(error){
                $.mobile.loading("hide");
                $("#error").html("Error while Logging in")
                $("#login").attr("onClick", "login()")
            }
        })
    })

}

//================================Check if Logged in and direct to main page/login page =============================
$(document).on("pagecontainerbeforechange", function (event, ui) {
    if (typeof ui.toPage !== "object") return;
    switch (ui.toPage.attr("id")) {
        case "login-page":
            var token = localStorage.getItem("token")

            if (!ui.prevPage && token) {            // Check for token and redirect to main page.
                ui.toPage = $("#main-page");  

                $.extend( ui.options, {
                    transition: "pop",
                });
            }else if(ui.prevPage && !token){        // Check if logged out already
                ui.toPage = $("#login-page");  

                $.extend( ui.options, {
                    transition: "slidefade",
                });
            }else if(!ui.prevPage && !token){        // Check if first time to open the app
                ui.toPage = $("#login-page");  

                $.extend( ui.options, {
                    transition: "pop",
                });
            }else if(ui.prevPage && token){        // Check if 
                ui.toPage = $("#main-page");  

                $.extend( ui.options, {
                    transition: "slidefade",
                });
            }
    }

});

$(document).on("pagecontainerbeforeshow", function (event, ui) {
    if (typeof ui.toPage == "object") {
        var params = {
            fullname : localStorage.getItem("fullname"),
            id : localStorage.getItem("id"),
            vehicleName : localStorage.getItem("vehicleName"),
            vehicleModel : localStorage.getItem("vehicleModel"),
            vehicleType : localStorage.getItem("vehicleType"),
            numberPlate : localStorage.getItem("numberPlate"),
            regNumber : localStorage.getItem("regNumber"),
            fitsIn : localStorage.getItem("fitsIn"),
            BusName : localStorage.getItem("BusName"),
            BusAdd : localStorage.getItem("BusAdd"),
            BusPhone : localStorage.getItem("BusPhone"),
            hiddenETA : localStorage.getItem("hidden-eta"),
            custPhone : localStorage.getItem("custPhone"),
            custName : localStorage.getItem("custName"),
            fullDest : localStorage.getItem("full-dest"),
            price : localStorage.getItem("transaction-price") 
        }

        switch (ui.toPage.prop("id")) {
            case "main-page":
                $(".fullname").text(params.fullname);
                $("#id").text(params.id);
                $("#vehicleName").text(params.vehicleName);
                $("#vehicleModel").text(params.vehicleModel);
                $("#vehicleType").text(params.vehicleType);
                $("#numberPlate").text(params.numberPlate);
                $("#regNumber").text(params.regNumber);
                break;
            case "transaction-page":
                if(params.fitsIn == "truck" || params.fitsIn == "van"){
                    $("#vehicle-type").text("local_shipping")
                }else if(params.fitsIn == "car"){
                    $("#vehicle-type").text("local_taxi")
                }
                $("#bus-phone").text(params.BusPhone)
                $("#cust-phone").text(params.custPhone)
                $("#Tprice").text(parseInt(params.price))
                $("#BName").text(params.BusName)
                $("#BLocate").text(params.BusAdd)
                $("#CName").text(params.custName)
                $("#CLocate").text(params.fullDest)
                $("#DPrice").text(parseInt(params.price)*(80/100))
                break;
            default:
                break;
        }
    }
});

//handle the back button and then populate the parameters here with what is in the database. to be done before tonight

// function onBackKeyDown(e) {
//     e.preventDefault();  
//     goBack(); 
// }

// $(document).on( "pagecontainershow", function( event, ui ) {
//     navigator.notification.alert( "The page being shown is: " + ui.toPage.prop("id") );
// });

// $(document).delegate("#login-page", "pagebeforecreate", function () {
//     var token = localStorage.getItem(token);
//     if(token){
//         $.mobile.navigate("#main-page");
//     }
// });

//=============================Log the driver out=================================================
function logout(){
    $("#logout").attr("onClick", "doNothing()")
    $.mobile.loading("show");
    localStorage.removeItem("token")
    localStorage.removeItem("fullname")
    localStorage.removeItem("id")
    setTimeout(function(){
        $.mobile.navigate("#login-page");
    }, 2000)
}

// =============================to turn the button to unclickable================================= 
function doNothing(){
    return false
}






































/*// =======================Log the Driver into the app after signup from web====================================
function login(){
    $("#login").attr("onClick", "doNothing()")
    $.mobile.loading("show");

    authDriver();
}

function authDriver(){
    $.ajax({
        type: "post",
        url: "http://teraraveweb.herokuapp.com/mobile/login",
        data: {
            email: $("#email").val(),
            password: $("#password").val(),
        },
        success: function(data) {
            if (data.status == true) {

                $.mobile.loading("hide");
                $("#error").html("<h5 style='text-align:center;color: red;'>" + " " + " </h5>")
                $("#success").html("<h5 style='text-align:center;color: green'>"+ data.message +"</h5>")
                localStorage.setItem("token", data.token);
                localStorage.setItem("fullname", data.fullname);
                localStorage.setItem("id", data.id);
                $.mobile.navigate("#main-page");

            } else if (data.status == false) {

                $.mobile.loading("hide");
                $("#error").html("<h5 style='text-align:center;color: red;'>" + data.message + " </h5>")
                $("#login").attr("onClick", "login()")

            }
        },
        error: function(error){
            $.mobile.loading("hide");
            $("#error").html("<h5 style='text-align:center;color: red;'>" + "Error while Logging in" + " </h5>")
            $("#login").attr("onClick", "login()")
        }
    })
}

//================================Check if Logged in and direct to main page/login page =============================
$(document).on("pagecontainerbeforechange", function (event, ui) {
    if (typeof ui.toPage !== "object") return;
    switch (ui.toPage.attr("id")) {
        case "login-page":
            var token = localStorage.getItem("token")

            if (!ui.prevPage && token) {            // Check for token and redirect to main page.
                ui.toPage = $("#main-page");  

                $.extend( ui.options, {
                    transition: "pop",
                });
            }else if(ui.prevPage && !token){        // Check if logged out already
                ui.toPage = $("#login-page");  

                $.extend( ui.options, {
                    transition: "slidefade",
                });
            }else if(!ui.prevPage && !token){        // Check if first time to open the app
                ui.toPage = $("#login-page");  

                $.extend( ui.options, {
                    transition: "pop",
                });
            }else if(ui.prevPage && token){        // Check if 
                ui.toPage = $("#main-page");  

                $.extend( ui.options, {
                    transition: "slidefade",
                });
            }
    }

});

$(document).on("pagecontainerbeforeshow", function (event, ui) {
    if (typeof ui.toPage == "object") {
        var fullname = localStorage.getItem("fullname"),
            id = localStorage.getItem("id");

        switch (ui.toPage.prop("id")) {
            case "main-page":
                $("#fullname").text(fullname);
                $("#id").text(id);
                break;
            case "track-page":
                $("#driveId").text(id);
                break;
            default:
                break;
        }
    }
});

//handle the back button and then populate the parameters here with what is in the database. to be done before tonight

// function onBackKeyDown(e) {
//     e.preventDefault();  
//     goBack(); 
// }

// $(document).on( "pagecontainershow", function( event, ui ) {
//     navigator.notification.alert( "The page being shown is: " + ui.toPage.prop("id") );
// });

// $(document).delegate("#login-page", "pagebeforecreate", function () {
//     var token = localStorage.getItem(token);
//     if(token){
//         $.mobile.navigate("#main-page");
//     }
// });

//=============================Log the driver out=================================================
function logout(){
    $("#logout").attr("onClick", "doNothing()")
    $.mobile.loading("show");
    localStorage.removeItem("token")
    localStorage.removeItem("fullname")
    localStorage.removeItem("id")
    setTimeout(function(){
        $.mobile.navigate("#login-page");
    }, 2000)
}

// =============================to turn the button to unclickable================================= 
function doNothing(){
    return false
}*/