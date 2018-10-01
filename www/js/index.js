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
            $("#notif-line").append('<div id="notif-box"><p style="text-align: center;"><i>'+jsonData.notification.payload.body+'</i></p><button onclick="driverInit()">Pick up</button></div>')
            // alert("This is the notif:" + jsonData.notification.payload.body + "\n Transaction ID: "+ jsonData.notification.payload.additionalData.transactionID)
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
            TransactionID: localStorage.getItem("TransactionID"),
            DriverID: localStorage.getItem("DriverID"),
        },
        success: function(data) {
            if (data.status == true) {

                $.mobile.loading("hide");
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