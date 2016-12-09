/**
 * initPromptMessage() attaches the click function with the logo on your bottom left
 * It also introduces the div containing the required data inside the #prompt-box
 */

var g_strPromptMessage = "<div id='prompt-close'><img src='../assets/texture/close_round.svg' /></div><div id='prompt-title'>ABOUT</div><table style='margin-left: 20px; margin-top: 20px; margin-right: 20px;'><td style='width: 64px;'><figure><img src= '../assets/texture/logo-small.jpg' /></figure></td><td style='padding-left: 10px; text-align: left;'><a target='_blank' href=https://www.proptiger.com>www.Proptiger.com</a><br>&copy; 2015 Aarde Technosoft Private Limited.</td></table>";

function initPromptMessage() {
    var prompt = $("#prompt-box");
    prompt.css("display", "none");
    prompt.html(g_strPromptMessage);
    $("#prompt-close").click(function() {
        prompt.animate({
            opacity: "0"
        }, 500, function() {
            prompt.effect("transfer", {
                to: "#logo",
                className: "ui-effects-transfer"
            }, 500, function() {
                prompt.css("display", "none")
            })
        });
    })
};