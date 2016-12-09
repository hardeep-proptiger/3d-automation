function CPanogalaxy() {
    this.m_nParentId = this.m_nGalaxyId = 0;
    this.m_aiSpheres = this.m_aiChildren = null;
    this.m_rStartOrientation = this.m_nStartSphere = this.m_nStartGalaxy = 0;
    this.m_strDescription = this.m_strTitle = null;
    this.m_nTagValueCount = 0;
    this.m_aTags = null
}
CPanogalaxy.prototype = {
    constructor: CPanogalaxy,
    initialize: function(a) {
        this.m_nGalaxyId = a.nGalaxyId;
        this.m_nParentId = a.nParentId;
        this.m_aiChildren = a.aiChildren;
        this.m_aiSpheres = a.aiSpheres;
        this.m_nStartGalaxy = a.nStartGalaxy;
        this.m_nStartSphere = a.nStartSphere;
        this.m_rStartOrientation = a.rStartOrientation;
        this.m_strTitle = a.strTitle;
        this.m_strDescription = a.strDescription;
        this.m_nTagValueCount = a.nTagValueCount;
        this.m_aTags = a.aTags
    },
    getStartSphereId: function() {
        return this.m_nStartSphere
    },
    concatTags: function() {
        var a =
                "",
            b;
        for (b in this.m_aTags) a += b + ": " + this.m_aTags[b] + "\n";
        return a
    }
};