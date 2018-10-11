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
            // localStorage.setItem("TransactionID", jsonData.notification.payload.additionalData.transactionID)
            $("#notif-text").text(jsonData.notification.payload.body)
            $("#notif-ID").text(jsonData.notification.payload.additionalData.transactionID)
            $("#job-alert-modal").modal('show');
        };
    
        window.plugins.OneSignal
            .startInit("e8f76cf0-88f2-4765-99c4-6b292c180cbb")
            .inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.InAppAlert)
            .handleNotificationOpened(notificationOpenedCallback)
            .endInit();
        
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

                $.mobile.loading("hide");
                $("#job-alert-modal").modal('hide');
                $("#notif-box").empty()
                $("#notif-box").html('<p style="text-align: center; color: green;><i>'+data.message+'</i></p><p style="text-align: center;><i>Please click the set out button when you have picked item from the shop.</i></p><button onclick="goTrack()">Set Out </button>')

            } else if (data.status == false) {

                $.mobile.loading("hide");
                $("#notif-box").empty()
                $("#notif-box").html("<h5 style='text-align:center;color: red;'>" + data.message + " </h5>")

            }
        },
        error: function(error){
            $.mobile.loading("hide");
            $("#notif-box").prepend("<h5 style='text-align:center;color: red;'>" + "Error while picking up item, please try again" + " </h5>")
        }
    })
}

function goTrack(){
    $.mobile.loading("show");
    $.ajax({
        type: "post",
        url: "http://teraraveweb.herokuapp.com/mobile/pickedUp",
        headers: {
            "x-access-token": localStorage.getItem("token")
        },
        data: {
            TransactionID: localStorage.getItem("TransactionID"),
        },
        success: function(data) {
            if (data.status == true) {

                $.mobile.loading("hide");
                $.mobile.navigate("#track-page");

            } else if (data.status == false) {

                $.mobile.loading("hide");
                $("#err").text(data.message)

            }
        },
        error: function(error){
            $.mobile.loading("hide");
            $("#err").text("Error occur somehow while trying to set out")
        }
    })
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

function transaction(){
    $.mobile.navigate("#transaction-page");
}

function jobProgress(status){
    if(status == "arrived"){
        $("#job-header").text("Arrived and Picking");
        $("#eta").empty();
        $("#job-stage-no").text("2")
        $("#job-button").text("Item Picked").attr("onclick", "jobProgress('picked')")
        $("#job-progress").css('width', '50%').text("50%")
        $("#job-instruction1").hide()
        $("#job-instruction2").fadeIn(1000)
    }else if(status == "picked"){
        $("#job-header").text("Cross-checking");
        $("#job-stage-no").text("3")
        $("#job-button").text("Set out").attr("onclick", "jobProgress('setOut')")
        $("#job-progress").css('width', '75%').text("75%")
        $("#job-instruction2").hide()
        $("#job-instruction3").fadeIn(1000)
    }else if(status == "setOut"){
        $("#job-header").text("Goods In Transit");
        $("#job-stage-no").text("4")
        $("#job-button").text("Delivered").attr("onclick", "jobProgress('delivered')")
        $("#job-progress").css('width', '87%').text("87%")
        $("#job-instruction3").hide()
        $("#job-instruction4").fadeIn(1000)
    }else if(status == "delivered"){
        $("#job-header").text("Item Delivered");
        $("#job-button").hide()
        $("#job-progress").css('width', '100%').text("100%")
        $("#job-instruction4").hide()
        $("#job-instruction5").fadeIn(1000)
    }
}

function complain(){
    $("#comment-modal").modal('show');
}