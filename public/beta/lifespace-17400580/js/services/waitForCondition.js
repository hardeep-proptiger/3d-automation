/**
 * Used in CPanowalk class, for waiting before the transition
 * Continuously reiterates the function till Tex is not loaded with low resolution
 */
function waitForCondition(func, bool, callback) {
    func() === bool ? callback() : setTimeout(function() {
        waitForCondition(func, bool, callback)
    }, 250)
}