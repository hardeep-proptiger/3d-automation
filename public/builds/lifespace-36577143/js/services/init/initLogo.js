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
    });

    $('#project-name').html('<a target="_blank" href="http://localhost:7000/beta/'+projectName+'">http://localhost:7000/beta/'+projectName+'</a>');

    $('#close-button').click(function(){
        $('.saved').fadeOut();
    });
}