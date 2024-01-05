$(document).ready(function() {
    //Set the locale for the localised demo
    if (window.location.href.indexOf("fr") > -1) {
        zE('messenger:set', 'locale', 'fr')
    }
    if (window.location.href.indexOf("es") > -1) {
        zE('messenger:set', 'locale', 'es')
    }

    //Logic for the contact page
    if (window.location.href.indexOf("contact") > -1) {
        runAuthFlow();
    } else {
        Logout();
    }
    window.onhashchange = function() {
        const hash = window.location.hash;
        runAuthFlow();
    };
    
    //Helper Functions
    function runAuthFlow(){
        Logout();
        var random = randomString(16); //this make sure every demo starts with a fresh user.
        if (window.location.href.indexOf("#vip") > -1) {
            Login({
                name: 'Vito Corleone',
                email:'vito+'+random+'@corleone.example',
                external_id: random
            });
            zE("messenger:set", "conversationTags", ["vip"])
            $('#vip').removeClass('hidden');
            $('#normal').addClass('hidden');
        } else {
            Login({
                name: 'Maximus Decimus Meridius',
                email:'maximus+'+random+'@example.com',
                external_id: random
            });
            zE("messenger:set", "conversationTags", [])
            $('#normal').removeClass('hidden');
            $('#vip').addClass('hidden');
        }
    }

    //JWT Messaging Code, see https://jwt.internalnote.com/messaging.html
    function Logout(){
        zE('messenger', 'logoutUser');
    }
    
    function Login(user){
        //get token for current user
        var jwttoken = '';
        $.ajax({
          type: "POST",
          url: 'https://jwt-demo.verschoren.workers.dev/messaging', //replace with your worker
          data: JSON.stringify({ "external_id": user.external_id, "user_email": user.email, "user_name": user.name }),
          dataType: 'text',
          async: false,
          success: function (json) {
            jwttoken = json;
          }
        });
        console.log(jwttoken)
    
        //authenticate messaging
        zE('messenger', 'loginUser', function (callback) {
          callback(jwttoken);
        });
      }

    function randomString(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
});