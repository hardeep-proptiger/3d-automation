/**
 * getViewport() returns the workable width and height of your system
 * First element in the array returns the innerWidth
 * Second element in the array returns the innerHeight
 * @returns {*[]}
 */

function getViewport() {
    var a, b;
    void 0 !== typeof window.innerWidth ? (a = window.innerWidth, b = window.innerHeight) : void 0 !== typeof document.documentElement && void 0 !== typeof document.documentElement.clientWidth && 0 !== document.documentElement.clientWidth ? (a = document.documentElement.clientWidth, b = document.documentElement.clientHeight) : (a = document.getElementsByTagName("body")[0].clientWidth, b = document.getElementsByTagName("body")[0].clientHeight);
    return [a, b]
}