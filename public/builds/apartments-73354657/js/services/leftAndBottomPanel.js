/**
 * This file contains everything related to the functionality of Left Panel and Bottom Tabs
 */

var g_cUIContent = null;

function initMetadataUILayer( canvas ) {
    g_nNUMDISPLAYTAGS = getNumDisplayTags( canvas );
    g_cRenderer.onUpdateGalaxy(updateMetadataInfo);
    g_cRenderer.updateGalaxyInfo();
    onLeftPane();
    onBottomTabs()
}

function updateMetadataInfo(a) {
    g_cUIContent = a;
    initLeftPane(a);
    initBottomTabs(a)
}
var g_fIsLeftPaneIn = !1,
    g_iPrimaryTag = 0,
    g_iSecondaryTag = 0;

function initLeftPane(a) {
    var b = null;
    $("#primary-title").html(a.strPrimaryTitle);
    b = document.createElement("div");
    b.innerHTML = "<div class='leftDesc'>" + a.strPrimaryDescr + "</div>";
    var c = a.strPrimarySpecs,
        d;
    for (d in c) b.innerHTML += "<div class='leftDesc'>" + d + " : " + c[d] + "</div>";
    $("#primary-content").html(b);
    $("#secondary-title").html(a.strSecondTitle);
    b = document.createElement("div");
    b.innerHTML = "<div class='leftDesc'>" + a.strSecondDescr + "</div>";
    c = a.strSecondSpecs;
    for (d in c) b.innerHTML += "<div class='leftDesc'>" +
        d + " : " + c[d] + "</div>";
    $("#secondary-content").html(b)
}

function animatePrimary() {
    var a = $("#primary-content").children();
    $(a[g_iPrimaryTag]).animate({
        opacity: 0
    }, 3E3, function() {
        $(this).css("display", "none");
        $(a[g_iPrimaryTag]).css("opacity", "1");
        g_iPrimaryTag = g_iPrimaryTag === g_nNUMDISPLAYTAGS - 1 ? 0 : g_iPrimaryTag + 1;
        $(a[g_iPrimaryTag]).css("display", "block");
        animatePrimary()
    })
}

function animateSecondary() {
    var a = $("#secondary-content").children();
    $(a[g_iSecondaryTag]).animate({
        opacity: 0
    }, 3E3, function() {
        $(this).css("display", "none");
        $(a[g_iSecondaryTag]).css("opacity", "1");
        g_iSecondaryTag = g_iSecondaryTag === g_nNUMDISPLAYTAGS - 1 ? 0 : g_iSecondaryTag + 1;
        $(a[g_iSecondaryTag]).css("display", "block");
        animateSecondary()
    })
}

function onLeftPane() {
    $("#left-img").attr("src", "./assets/texture/arrow_left.svg");
    $("#left-img").click(function() {
        g_fIsLeftPaneIn ? ($("#left-img").css("right", "0px"), $("#left-pane").animate({
            left: "0px"
        }, 500), $("#left-img").attr("src", "./assets/texture/arrow_left.svg"), g_fIsLeftPaneIn = !1) : ($("#left-img").css("right", "-16px"), $("#left-pane").animate({
            left: String(-$("#left-pane").width())
        }, 500), $("#left-img").attr("src", "./assets/texture/arrow_right.svg"), g_fIsLeftPaneIn = !0)
    })
}

var g_nNUMDISPLAYTAGS = 1,
    g_nGAPRATIO = 4,
    g_nTABWIDTH = 0,
    g_nTABGAP = 0,
    g_currentTabGroup = [],
    g_tabGroupInTransit = !1,
    g_nLongTimer = 500,
    g_nShortTimer = 200;

function getNumDisplayTags(a) {
    a = Math.floor((a.width - 200 - 120) / (120 * (g_nGAPRATIO + 1) / g_nGAPRATIO));
    return 0 < a ? Math.min(a, 8) : 1
}

function resizeBotomTab(a) {
    a = getNumDisplayTags(a);
    a !== g_nNUMDISPLAYTAGS && (g_nNUMDISPLAYTAGS = Math.min(a, g_cUIContent.aGalaxyRefs.length), initBottomTabs(g_cUIContent))
}

function initBottomTabs(a) {
    g_currentTabGroup = [];
    var b = $("#tab-holder");
    b.empty();
    var c = null,
        d = null;
    g_nTABWIDTH = 100 * g_nGAPRATIO / (g_nGAPRATIO * g_nNUMDISPLAYTAGS + g_nNUMDISPLAYTAGS - 1);
    g_nTABGAP = 1 < g_nNUMDISPLAYTAGS ? (100 - g_nNUMDISPLAYTAGS * g_nTABWIDTH) / (g_nNUMDISPLAYTAGS - 1) : 0;
    for (var e = a.aGalaxyRefs.length < g_nNUMDISPLAYTAGS ? 45 - 7.5 * (a.aGalaxyRefs.length - 1) : 0, g = 0, f = 0; f < a.aGalaxyRefs.length; f++) c = document.createElement("div"), d = document.createElement("div"), d.innerHTML = a.aGalaxyRefs[f].strTitle, d.setAttribute("class",
        "tabtext"), c.appendChild(d), c.setAttribute("class", "tab"), c.setAttribute("id", a.aGalaxyRefs[f].nGalaxyId), a.aGalaxyRefs[f].nGalaxyId === a.iCurrentGalaxy && (g = f - Math.floor((g_nNUMDISPLAYTAGS - 1) / 2), c.style.opacity = "1"), c.style.width = g_nTABWIDTH + "%", c.style.left = e + f * (g_nTABWIDTH + g_nTABGAP) + "%", g_currentTabGroup.push(c), b.append(c), c.addEventListener("click", function() {
        Number(this.id) !== a.iCurrentGalaxy && g_cRenderer.jumpToGalaxy(this.id)
    });
    0 > g ? animateTabs("forward", Math.abs(g)) : animateTabs("backward", Math.abs(g))
}

function animateTabs( a, b ) {
    void 0 === b && (b = 1);
    if (0 !== b) {
        var c = g_nTABWIDTH + g_nTABGAP;
        switch (a) {
            case "forward":
                if (g_currentTabGroup.length <= g_nNUMDISPLAYTAGS || g_tabGroupInTransit) break;
                g_tabGroupInTransit = !0;
                resetTabs("forward");
                for (var d = null, e = g_currentTabGroup.length - 1; 0 <= e; e--) d = $(g_currentTabGroup[e]), 0 === e ? d.animate({
                    left: "0%"
                }, 1 < b ? g_nShortTimer : g_nLongTimer, function() {
                    g_tabGroupInTransit = !1;
                    1 < b && animateTabs(a, --b)
                }) : d.animate({
                    left: e * c + "%"
                }, 1 < b ? g_nShortTimer : g_nLongTimer);
                break;
            case "backward":
                if (g_currentTabGroup.length <=
                    g_nNUMDISPLAYTAGS || g_tabGroupInTransit) break;
                g_tabGroupInTransit = !0;
                d = null;
                for (e = 0; e < g_currentTabGroup.length; e++) d = $(g_currentTabGroup[e]), e === g_currentTabGroup.length - 1 ? d.animate({
                    left: (e - 1) * c + "%"
                }, 1 < b ? g_nShortTimer : g_nLongTimer, function() {
                    resetTabs("backward");
                    g_tabGroupInTransit = !1;
                    1 < b && animateTabs(a, --b)
                }) : d.animate({
                    left: (e - 1) * c + "%"
                }, 1 < b ? g_nShortTimer : g_nLongTimer)
        }
    }
}

function resetTabs(a) {
    switch (a) {
        case "forward":
            g_currentTabGroup[g_currentTabGroup.length - 1].style.left = parseInt(g_currentTabGroup[0].style.left.split("%")[0]) - 100 + "%";
            a = g_currentTabGroup.splice(g_currentTabGroup.length - 1, 1);
            g_currentTabGroup.unshift(a[0]);
            break;
        case "backward":
            g_currentTabGroup[0].style.left = parseInt(g_currentTabGroup[g_currentTabGroup.length - 1].style.left.split("%")[0]) + 100 + "%", a = g_currentTabGroup.splice(0, 1), g_currentTabGroup[g_currentTabGroup.length] = a[0]
    }
}

function onBottomTabs() {

    $("#left-scroll").attr("src", "./assets/texture/scroll_left.svg");
    $("#right-scroll").attr("src", "./assets/texture/scroll_right.svg");
    $("#left-scroll").click(function() {
        animateTabs("forward")
    });
    $("#right-scroll").click(function() {
        animateTabs("backward")
    });
    $("#tab-holder").bind("mousewheel", function(a) {
        a.preventDefault();
        var b = 0;
        a.wheelDelta ? b = a.wheelDelta : a.detail && (b = -a.detail);
        0 < b / 120 ? animateTabs("forward") : animateTabs("backward")
    });
    var a = new Hammer.Manager($("#tab-holder")[0]),
        b = new Hammer.Pan({
            direction: Hammer.DIRECTION_HORIZONTAL
        });
    a.add(b);
    a.on("panleft panright", function(a) {
        a.preventDefault();
        "panleft" === a.type && animateTabs("backward");
        "panright" === a.type && animateTabs("forward")
    })
};