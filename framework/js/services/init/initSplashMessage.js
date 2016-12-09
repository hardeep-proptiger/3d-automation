/**
 * initSplashMessage() gets the initial splash message to the user to get him used to the controls he is bound to perform
 * This function attaches the click handler to the close button and automatically fades out after 5 seconds
 */

var g_strHelpMessage = "",
    g_fSplashMsg = !1;

function initSplashMessage() {
    g_strHelpMessage = "Mobile" === g_cSystemSpecs.strDevType ? "<div id='splash-close'><img src='../assets/texture/close_round.svg' /></div><div id='splashMessage-title'>Navigation Hints</div><table><tr><td><figure><img src= './assets/texture/swipe.svg' /><figcaption>Pan/Swipe to Look Around</figcaption></figure></td><td><figure><img src= './assets/texture/singletap.svg' /><figcaption>Tap to Move to Location</figcaption></figure></td></tr><tr><td><figure><img src= '../assets/texture/arrowkeys.svg' /><figcaption>Use Arrow Keys to Navigate</figcaption></figure></td><td><figure><img src= '../assets/texture/marker1.svg' /><figcaption>Click on Marker to Jump to Location</figcaption></figure></td></tr></table>" : "<div id='splash-close'><img src='../assets/texture/close_round.svg' /></div><div id='splashMessage-title'>Navigation Hints</div><table><tr><td><figure><img src= '../assets/texture/clickdrag.svg' /><figcaption>Left Click and Drag to Look Around</figcaption></figure></td><td><figure><img src= '../assets/texture/leftclick.svg' /><figcaption>Left Click to Move to Location</figcaption></figure></td></tr><tr><td><figure><img src= '../assets/texture/arrowkeys.svg' /><figcaption>Use Arrow Keys to Navigate</figcaption></figure></td><td><figure><img src= '../assets/texture/marker1.svg' /><figcaption>Click on Marker to Jump to Location</figcaption></figure></td></tr></table>";
    g_fSplashMsg = !0;
    $("#splashMessage-box").html(g_strHelpMessage);
    $("#splash-close").click(onCloseSplashMsg);
    setTimeout(onCloseSplashMsg, 5E3)
}

function onCloseSplashMsg() {

    var splashBox = $("#splashMessage-box");

    g_fSplashMsg && (g_fSplashMsg = !1, splashBox.animate({
        opacity: "0"
    }, 500, function() {}), splashBox.effect("transfer", {
        to: "#info-button",
        className: "ui-effects-transfer"
    }, 500, function() {
        $("#splashMessage-box").css("display", "none")
    }))
}