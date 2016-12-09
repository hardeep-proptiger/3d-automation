/**
 * Used in CPanowalk class, for transitioning
 * @returns {*}
 */
function easingQadraticInOut(pos) {
    if ((pos/=0.5) < 1) return 0.5*Math.pow(pos,3);
    return 0.5 * (Math.pow((pos-2),3) + 2);
}