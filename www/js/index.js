var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

        var notificationOpenedCallback = function(jsonData) {
            // alert("Notification opened:\n" + JSON.stringify(jsonData))
            $("#notif-text").text(jsonData.notification.payload.body)
            $("#notif-ID").text(jsonData.notification.payload.additionalData.transactionID)
            $("#job-alert-modal").modal('show');
            $("#BusName").text(jsonData.notification.payload.additionalData.BusName)
            $("#fitsIn").text(jsonData.notification.payload.additionalData.fitsIn)
            $("#BusAdd").text(jsonData.notification.payload.additionalData.BusAdd)
            $("#BusPhone").text(jsonData.notification.payload.additionalData.BusPhone)
            // $("#hidden-eta").text(jsonData.notification.payload.additionalData.hidden-eta)
            $("#custPhone").text(jsonData.notification.payload.additionalData.custPhone)
            // $("#custName").text(jsonData.notification.payload.additionalData.custName)
            $("#full-dest").text(jsonData.notification.payload.additionalData.Dest)
            $("#transaction-price").text(jsonData.notification.payload.additionalData.transactionPrice)

        };

        // .getPermissionSubscriptionState(function(status) {
        //     status.permissionStatus.hasPrompted; // Bool
        //     status.permissionStatus.status; // iOS only: Integer: 0 = Not Determined, 1 = Denied, 2 = Authorized
        //     status.permissionStatus.state; //Android only: Integer: 1 = Authorized, 2 = Denied
        
        //     status.subscriptionStatus.subscribed; // Bool
        //     status.subscriptionStatus.userSubscriptionSetting; // Bool
        //     status.subscriptionStatus.userId; // String: OneSignal Player ID
        //     status.subscriptionStatus.pushToken; // String: Device Identifier from FCM/APNs
        // });
    
        window.plugins.OneSignal
            .startInit("e8f76cf0-88f2-4765-99c4-6b292c180cbb")
            .inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.InAppAlert)
            .handleNotificationOpened(notificationOpenedCallback)
            .endInit();

            window.plugins.OneSignal.getPermissionSubscriptionState(function(){
                console.log(status.subscriptionStatus.userId + "The Player ID")
                $("#check").text(status.subscriptionStatus.userId + "The Player ID")
            })
        
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        // var listeningElement = parentElement.querySelector('.listening');
        // var receivedElement = parentElement.querySelector('.received');

        // listeningElement.setAttribute('style', 'display:none;');
        // receivedElement.setAttribute('style', 'display:block;');

        // console.log('Received Event: ' + id);
    }
};


function driverInit(){
    $.mobile.loading("show");
    $.ajax({
        type: "post",
        url: "http://teraraveweb.herokuapp.com/mobile/driverInit",
        headers: {
            "x-access-token": localStorage.getItem("token")
        },
        data: {
            TransactionID: $("#notif-ID").text(),
            DriverID: localStorage.getItem("id"),
        },
        success: function(data) {
            if (data.status == true) {
                $("#job-alert-modal").modal('hide');
                localStorage.setItem("transactionID", $("#notif-ID").text());
                localStorage.setItem("fitsIn", $("#fitsIn").text());
                localStorage.setItem("BusName", $("#BusName").text());
                localStorage.setItem("BusAdd", $("#BusAdd").text());
                localStorage.setItem("BusPhone", $("#BusPhone").text());
                localStorage.setItem("hidden-eta", $("#hidden-eta").text());
                localStorage.setItem("custPhone", $("#custPhone").text());
                localStorage.setItem("custName", $("#custName").text());
                localStorage.setItem("full-dest", $("#full-dest").text());
                localStorage.setItem("transaction-price", $("#transaction-price").text());

                $.mobile.loading("hide");
                $.mobile.navigate("#transaction-page");

            } else if (data.status == false) {
                $.mobile.loading("hide");
                $("#notif-error").text(data.message)

            }
        },
        error: function(error){
            $.mobile.loading("hide");
            $("#notif-error").text("Error while accepting Job Offer")
        }
    })
}

function jobProgress(status){
    if(status == "arrived"){

        $.ajax({
            type: "post",
            url: "http://teraraveweb.herokuapp.com/mobile/jobProgress/"+status,
            headers: {
                "x-access-token": localStorage.getItem("token")
            },
            data: {
                TransactionID: localStorage.getItem("transactionID"),
            },
            success: function(data) {
                if (data.status == true) {

                    $("#job-instruction1").hide()
                    $("#job-instruction2").text(data.message)
                    $("#job-header").text("Arrived and Picking");
                    $("#eta").empty();
                    $("#job-stage-no").text("2")
                    $("#job-button").text("Item Picked").attr("onclick", "jobProgress('picked')")
                    $("#job-progress").css('width', '40%').text("40%")
                    $("#job-instruction2").fadeIn(1000)
    
                } else if (data.status == false) {

                    $("#job-instruction1").hide()
                    $("#job-instruction2").html('<span class="text-danger"> ' + data.message + '</span>')
                    $("#job-instruction2").fadeIn(1000)

                }
            },
            error: function(error){
                $("#job-instruction1").hide()
                $("#job-instruction2").html('<span class="text-danger"> Error occur connecting to server </span>')
                $("#job-instruction2").fadeIn(1000)
            }
        })

    }else if(status == "picked"){

        $.ajax({
            type: "post",
            url: "http://teraraveweb.herokuapp.com/mobile/jobProgress/"+status,
            headers: {
                "x-access-token": localStorage.getItem("token")
            },
            data: {
                TransactionID: localStorage.getItem("transactionID"),
            },
            success: function(data) {
                if (data.status == true) {

                    $("#job-instruction2").hide()
                    $("#bus-phone").hide();
                    $("#job-instruction3").text(data.message)
                    $("#job-header").text("Cross-checking");
                    $("#job-stage-no").text("3")
                    $("#job-button").text("Set out").attr("onclick", "jobProgress('setOut')")
                    $("#job-progress").css('width', '60%').text("60%")
                    $("#job-instruction3").fadeIn(1000)
                    $("#cust-phone").fadeIn(1000);
    
                } else if (data.status == false) {

                    $("#job-instruction2").hide()
                    $("#job-instruction3").html('<span class="text-danger"> ' + data.message + '</span>')
                    $("#job-instruction3").fadeIn(1000)

                }
            },
            error: function(error){
                $("#job-instruction2").hide()
                $("#job-instruction3").html('<span class="text-danger"> Error occur connecting to server </span>')
                $("#job-instruction3").fadeIn(1000)
            }
        })

    }else if(status == "setOut"){

        $.ajax({
            type: "post",
            url: "http://teraraveweb.herokuapp.com/mobile/jobProgress/"+status,
            headers: {
                "x-access-token": localStorage.getItem("token")
            },
            data: {
                TransactionID: localStorage.getItem("transactionID"),
            },
            success: function(data) {
                if (data.status == true) {

                    $("#job-instruction3").hide()
                    initPubNub();
                    $("#job-instruction4").text(data.message)
                    $("#job-header").text("Goods In Transit");
                    $("#job-stage-no").text("4")
                    $("#job-button").text("Delivered").attr("onclick", "jobProgress('delivered')")
                    $("#job-progress").css('width', '80%').text("80%")
                    $("#job-instruction4").fadeIn(1000)
    
                } else if (data.status == false) {

                    $("#job-instruction3").hide()
                    $("#job-instruction4").html('<span class="text-danger"> ' + data.message + '</span>')
                    $("#job-instruction4").fadeIn(1000)

                }
            },
            error: function(error){
                $("#job-instruction3").hide()
                $("#job-instruction4").html('<span class="text-danger"> Error occur connecting to server </span>')
                $("#job-instruction4").fadeIn(1000)
            }
        })
        
    }else if(status == "delivered"){

        $.ajax({
            type: "post",
            url: "http://teraraveweb.herokuapp.com/mobile/jobProgress/"+status,
            headers: {
                "x-access-token": localStorage.getItem("token")
            },
            data: {
                TransactionID: localStorage.getItem("transactionID"),
            },
            success: function(data) {
                if (data.status == true) {

                    $("#job-instruction4").hide()
                    $("#job-instruction5").text(data.message)
                    $("#job-header").text("Item Delivered");
                    $("#job-stage-no").text("5")
                    $("#job-button").text("Finish").attr("onclick", "jobProgress('finish')")
                    $("#job-progress").css('width', '100%').text("100%")
                    $("#job-instruction5").fadeIn(1000)
    
                } else if (data.status == false) {

                    $("#job-instruction4").hide()
                    $("#job-instruction5").html('<span class="text-danger"> ' + data.message + '</span>')
                    $("#job-instruction5").fadeIn(1000)

                }
            },
            error: function(error){
                $("#job-instruction4").hide()
                $("#job-instruction5").html('<span class="text-danger"> Error occur connecting to server </span>')
                $("#job-instruction5").fadeIn(1000)
            }
        })

    }else if(status == "finish"){
        $.mobile.navigate("#main-page");
    }
}

function jobStatus(status){
    $.mobile.loading("show");
    $.ajax({
        type: "post",
        url: "http://teraraveweb.herokuapp.com/mobile/job/"+status,
        headers: {
            "x-access-token": localStorage.getItem("token")
        },
        data: {
            ID: localStorage.getItem("id"),
        },
        success: function(data) {
            if (data.status == true) {

                $.mobile.loading("hide");
                $("#statusMsg").text(data.message)

            } else if (data.status == false) {

                $.mobile.loading("hide");
                $("#err").text(data.message)
            }
        },
        error: function(error){
            $.mobile.loading("hide");
            $("#err").text("Error occur connecting to server")
        }
    })
}