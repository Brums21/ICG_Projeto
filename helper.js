

//  Adapted from Daniel Rohmer tutorial
//
// 		https://imagecomputing.net/damien.rohmer/teaching/2019_2020/semester_1/MPRI_2-39/practice/threejs/content/000_threejs_tutorial/index.html
//
// 		J. Madeira - April 2021

export const helper = {
    initEmptyScene: function (sceneElements) {
        sceneElements.sceneGraph = new THREE.Scene();

        const width = window.innerWidth;
        const height = window.innerHeight;
        const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 500);
        sceneElements.camera = camera;
        camera.position.set(10, 20, 20);
        camera.lookAt(0, 0, 0);

        const ambientLight = new THREE.AmbientLight('rgb(255, 255, 255)', 1); //mudar esta propriedade para ajustar a luz do dia!!
        sceneElements.sceneGraph.add(ambientLight);

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        sceneElements.renderer = renderer;
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setClearColor('rgb(134, 206, 240)', 1.0);
        renderer.setSize(width, height);

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        sceneElements.orbitControl = new THREE.OrbitControls(camera, renderer.domElement);
        sceneElements.orbitControl.screenSpacePanning = true;
        sceneElements.orbitControl.maxPolarAngle = Math.PI / 2;

        const htmlElement = document.querySelector("#Tag3DScene");
        htmlElement.appendChild(renderer.domElement);

        sceneElements.AxesHelper = new THREE.AxesHelper(5);

        return ambientLight;
    },

    render: function(sceneElements) {
        sceneElements.renderer.render(sceneElements.sceneGraph, sceneElements.camera);
        sceneElements.orbitControl.target.copy(sceneElements.car.position);
        //console.log("Number of Triangles :", sceneElements.renderer.info.render.triangles);
        console.log("Number of calls: ",  sceneElements.renderer.info.render.calls)
    },
};