/**
 * initLogo() function initializes the logo and attaches a click handler with it
 */

function initLogo() {
    var a = document.createElement("IMG");
    a.src = "./assets/texture/logo.png";
    a.height = "37";
    document.getElementById("logo").appendChild(a);
    $("#logo").click(function() {
        $("#prompt-box").css({
            "opacity": "1",
            "display": "block"
        });
    })
}