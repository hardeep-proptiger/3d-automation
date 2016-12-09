/**
 * Binding (?) button with the splashMessage-box
 */
function initInfoButton() {
    var a = document.createElement("IMG");
    a.src = "./assets/texture/info.svg";
    a.width = "32";
    a.height = "32";
    document.getElementById("info-button").appendChild(a);
    $("#info-button").click(function() {
        g_fSplashMsg = !0;
        $("#splashMessage-box").css({"opacity": "1", "display": "block"});
    })
}