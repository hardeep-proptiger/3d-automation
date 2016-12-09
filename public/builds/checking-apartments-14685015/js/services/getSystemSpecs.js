/**
 * This function is used to get your system's specifications
 * Array's first element tells you whether it is a 'PC' or a 'Mobile'
 * Array's second element tells you the operating system
 * @returns {*[]}
 */
function getSystemSpecs() {
    var b = "",
        a = window.navigator.platform.toLowerCase();
    a.match(/ipad/i) || a.match(/iphone/i) || a.match(/ipod/i) || a.match(/pike/i) ? (a = "Mobile", b = "iOS") : a.match(/android/i) || a.match(/linux/i) && (a.match(/arm/i) || a.match(/msm/i)) ? (a = "Mobile", b = "Android") : a.match(/mac/i) ? (a = "PC", b = "MacOS") : a.match(/linux/i) || a.match(/bsd/i) ? (a = "PC", b = "Unix") : a.match(/win/i) ? (a = "PC", b = "Windows") : b = "";
    console.log("Your are running " + b + " on " + a + ".");
    return [a, b]
}