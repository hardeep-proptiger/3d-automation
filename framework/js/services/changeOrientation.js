function changeOrientation() {
    if( ( g_cSystemSpecs.strDevType == 'Mobile' ) && ( g_cSystemSpecs.strOSName == 'iOS' ) ) {
        var controls = new DeviceOrientationController( g_cRenderer.m_cCamera, g_htmlCanvas );
        controls.connect();
        g_cRenderer.m_cPanowalk.m_cPanoverse.m_gui.destroy();
    }
};