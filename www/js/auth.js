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
            url: "https://teraraveweb.herokuapp.com/mobile/login",
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
                    // localStorage.setItem("vehicleName", data.vehicleName);
                    // localStorage.setItem("vehicleModel", data.vehicleModel);
                    // localStorage.setItem("vehicleType", data.vehicleType);
                    // localStorage.setItem("numberPlate", data.numberPlate);
                    // localStorage.setItem("regNumber", data.regNumber);
                    localStorage.setItem("completedJobs", data.completedJobs);

                    window.plugins.OneSignal.setSubscription(true)

                    $.mobile.navigate("#updatePage");
    
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

function updateDriver(){
    $.ajax({
        type: "post",
        url: "https://teraraveweb.herokuapp.com/mobile/updateDriver",
        headers: {
            "x-access-token": localStorage.getItem("token")
        },
        data: {
            id: localStorage.getItem("id"),
            LicenceNo: $("#LicenceNo").val(),
            RoadWorthinessN0: $("#RoadWorthinessN0").val(),
            BVN: $("#BVN").val(),
            PlateNo: $("#PlateNo").val(),
            vehicleName: $("#vehicleName").val(),
            vehicleType: $("#vehicleType").val()
        },
        success: function(data) {
            if (data.status == true) {
                console.log(data.message)

                $.mobile.loading("hide");
                $("#error").empty()

                localStorage.setItem("vehicleName", data.vehicleName);
                localStorage.setItem("vehicleType", data.vehicleType);
                localStorage.setItem("numberPlate", data.numberPlate);

                $.mobile.navigate("#main-page");

            } else if (data.status == false) {
                console.log(data.message)

                $.mobile.loading("hide");
                $("#err").html(data.message)

            }
        },
        error: function(error){
            $.mobile.loading("hide");
            $("#error").html("Error while saving update, plese check your internet")
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
        var params = {
            fullname : localStorage.getItem("fullname"),
            id : localStorage.getItem("id"),
            vehicleName : localStorage.getItem("vehicleName"),
            vehicleModel : localStorage.getItem("vehicleModel"),
            vehicleType : localStorage.getItem("vehicleType"),
            numberPlate : localStorage.getItem("numberPlate"),
            regNumber : localStorage.getItem("regNumber"),
            completedJobs : localStorage.getItem("completedJobs"),
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
                $("#completedJobs").text(params.completedJobs);

                
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
