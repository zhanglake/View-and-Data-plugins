///////////////////////////////////////////////////////////////////////////////
AutodeskNamespace("Autodesk.ADN.Viewing.Extension");

Autodesk.ADN.Viewing.Extension.AxisHelper = function (viewer, options) {

    Autodesk.Viewing.Extension.call(this, viewer, options);

    var _self = this;

    var _axisLines = [];

    _self.load = function () {
        console.log('Autodesk.ADN.Viewing.Extension.AxisHelper loaded');
        addAixsHelper();
        //workaround
        //have to call this to show up the axis
        viewer.restoreState(viewer.getState());

        /**
         * 创建环境光源 AmbientLight
         * 环境光源是漫反射，从各个方向而来的光源
         */
        var ambientLight = new THREE.AmbientLight(0xffffff);
        viewer.impl.scene.add(ambientLight);

        // 画球
        Autodesk.Viewing.Viewer3D.prototype.drawBallPoint = function (x, y, z, color) {
            var radius = 3, segemnt = 10, rings = 10;
            var sphereMaterial = new THREE.MeshLambertMaterial ({
                //color: 0xff0000,
                color: color
            });
            viewer.impl.matman().addMaterial('sphereMaterial', sphereMaterial, true);
            var geometry = new THREE.SphereGeometry(radius, segemnt, rings);
            var sphere = new THREE.Mesh(geometry, sphereMaterial);
            // 球心的x，y，z坐标
            sphere.position.x = x;
            sphere.position.y = y;
            sphere.position.z = z;
            viewer.impl.scene.add(sphere);
            viewer.impl.invalidate(true);
            return sphere;
        };

        Autodesk.Viewing.Viewer3D.prototype.clearBallPoint = function (sphere) {
            if (sphere) {
                viewer.impl.scene.remove(sphere);
                delete viewer.impl.matman().materials.sphereMaterial;
            }
        }

        return true;
    };

    _self.unload = function () {
        removeAixsHelper();
        console.log('Autodesk.ADN.Viewing.Extension.AxisHelper unloaded');
        return true;
    };

    var addAixsHelper = function () {
        _axisLines = [];
        //get bounding box of the model
        var boundingBox = viewer.model.getBoundingBox();
        var maxpt = boundingBox.max;
        var minpt = boundingBox.min;
        var xdiff = maxpt.x - minpt.x;
        var ydiff = maxpt.y - minpt.y;
        var zdiff = maxpt.z - minpt.z;
        //make the size is bigger than the max bounding box
        //so that it is visible
        var size = Math.max(xdiff, ydiff, zdiff) * 1.2;
        //console.log('axix size :' + size);

        // x-axis is red
        var material_X_Axis = new THREE.LineDashedMaterial({
            color: 0xff0000,  //red
            linewidth: 20
        });
        viewer.impl.matman().addMaterial('material_X_Axis', material_X_Axis, true);

        //draw the x-axix line
        var xLine = drawLine(
            {x: 0, y: 0, z: 0},
            {x: size, y: 0, z: 0},
            material_X_Axis);
        _axisLines.push(xLine);
        // y-axis is green
        var material_Y_Axis = new THREE.LineDashedMaterial({
            color: 0x00ff00,  //green
            linewidth: 20
        });
        viewer.impl.matman().addMaterial('material_Y_Axis', material_Y_Axis, true);

        //draw the y-axix line
        var yLine = drawLine(
            {x: 0, y: 0, z: 0},
            {x: 0, y: size, z: 0},
            material_Y_Axis);
        _axisLines.push(yLine);
        // z-axis is blue
        var material_Z_Axis = new THREE.LineDashedMaterial({
            color: 0x0000ff,  //blue
            linewidth: 20
        });
        viewer.impl.matman().addMaterial('material_Z_Axis', material_Z_Axis, true);

        //draw the z-axix line
        var zLine = drawLine(
            {x: 0, y: 0, z: 0},
            {x: 0, y: 0, z: size},
            material_Z_Axis);
        _axisLines.push(zLine);

        //描点
        //var m_point = new THREE.PointCloudMaterial({
        //    color: 0x00ff00,
        //    size: 2,
        //    sizeAttenuation: false,
        //    vertexColors: 0x00ff00,
        //    fog: false
        //});
        //viewer.impl.matman().addMaterial('m_point', m_point, true);
        //var point = drawPoint(
        //    {x: 50, y: 100, z: 150},
        //    m_point);
    }

    var drawPoint = function (position, material) {
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(
            position.x, position.y, position.z));
        var mypoint = new THREE.PointCloud(geometry, material);
        viewer.impl.scene.add(mypoint);
        viewer.impl.invalidate(true);
        return mypoint;
    }

    var drawLine = function (start, end, material) {
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(
            start.x, start.y, start.z));
        geometry.vertices.push(new THREE.Vector3(
            end.x, end.y, end.z));
        var line = new THREE.Line(geometry, material);
        viewer.impl.scene.add(line);
        //refresh viewer
        viewer.impl.invalidate(true);
        return line;
    }

    var removeAixsHelper = function () {
        _axisLines = [];
        _axisLines.forEach(function (line) {
            viewer.impl.scene.remove(line);
        });
        //remove materials
        delete viewer.impl.matman().materials.material_X_Axis;
        delete viewer.impl.matman().materials.material_Y_Axis;
        delete viewer.impl.matman().materials.material_Z_Axis;
    }
};

function addMaterial(color) {
    var material = new THREE.MeshPhongMaterial({
        color : color
    });
    //viewer.impl.matman().addMaterial(newGuid(), material);
    viewer.impl.createOverlayScene(overlayName, material, material);
    return material;
}

Autodesk.ADN.Viewing.Extension.AxisHelper.prototype =
    Object.create(Autodesk.Viewing.Extension.prototype);

Autodesk.ADN.Viewing.Extension.AxisHelper.prototype.constructor =
    Autodesk.ADN.Viewing.Extension.AxisHelper;

Autodesk.Viewing.theExtensionManager.registerExtension(
    'Autodesk.ADN.Viewing.Extension.AxisHelper',
    Autodesk.ADN.Viewing.Extension.AxisHelper);