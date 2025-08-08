//Visual Coordinates Code
//global Variables
 cellphoneColor = 0x909090;
//set 3D world window size relative to the browser window
const windowWidthOffset = 400;
const windowHeightOffset = 400;

//set up 3D scene parameters
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
const renderer = new THREE.WebGLRenderer();
scene.background = new THREE.Color(0xfafafa); 
const width = window.innerWidth - windowWidthOffset;
const height = window.innerHeight - windowHeightOffset;
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

//Position the camera and set the view
camera.position .set(2, 2, 3);
camera.lookAt(0, 0, 0);

//Handle Window resize (changes scene dimensions)
/*window.addEventListener('resize', () => {   
    //camera.aspect = window.innerWidth/ window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth - windowWidthOffset, window.innerHeight - windowHeightOffset);
});*/

//    Mouse drag Code
const raycaster = new THREE.Raycaster();
const clickMouse= new THREE.Vector2();
const moveMouse = new THREE.Vector2();
let draggable;

window.addEventListener('click', (event) => {
    if (draggable) {
        draggable.material.color.setHex(cellphoneColor);
        console.log(`Dropping draggable object`);
        draggable = null;
        return;
        }
    clickMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    clickMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(clickMouse, camera);
    const found = raycaster.intersectObjects(scene.children);
    if (found.length > 0 && found[0].object.userData.draggable) {
        draggable = found[0].object;
        console.log(`Clicked on: ${draggable.userData.name}`)
        if (draggable.userData.name === 'cellphone') {
            console.log('you are here')
            draggable.material.color.setHex(0x00ff00);
        }
    }
});
window.addEventListener('mousemove', (event) => {
    moveMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    moveMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});
function dragObject() {
    if (draggable != null) {
        raycaster.setFromCamera(moveMouse, camera);
        const found = raycaster.intersectObjects(scene.children);
        if (found.length > 0) {
            for(const o of found) {
                if (o.point.x > 1.5) {o.point.x = 1.5;}
                if (o.point.x < -1.5) {o.point.x = -1.5;}
                if (o.point.y > 2) {o.point.y = 2;}
                if (o.point.y < -2) {o.point.y = -2;}
            
                draggable.position.x = o.point.x;
                draggable.position.y = o.point.y;
            }
        }
    }};

// Add and Render Objectss
yAxisLines();
xAxisLines();
zAxisLines();
createCellphoneOutline();
animate();


//Functions
function animate() { 
    dragObject();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth - windowWidthOffset, window.innerHeight - windowHeightOffset);
    renderer.render(scene, camera);
    requestAnimationFrame(animate);


}   
// Add World Origin Y Axis lines
function yAxisLines() {
    const yPoints = [];
    yPoints.push(new THREE.Vector3(0, -2, 0));
    yPoints.push(new THREE.Vector3(0, 2, 0));
    const geometryYLines = new MeshLine();
    geometryYLines.setPoints(yPoints);
    const materialYLines = new MeshLineMaterial({ color: 0x00ff00, lineWidth: .025});
    const Ylines = new THREE.Mesh(geometryYLines, materialYLines);
    scene.add(Ylines);
}

// Add World Origin X Axis lines
function xAxisLines() {
    const xPoints = [];
    xPoints.push(new THREE.Vector3(-2, 0, 0));
    xPoints.push(new THREE.Vector3(2, 0, 0));
    const geometryXLines = new MeshLine();
    geometryXLines.setPoints(xPoints);
    const materialXLines = new MeshLineMaterial({ color: 0x0000ff, lineWidth: .025});
    const Xlines = new THREE.Mesh(geometryXLines, materialXLines);
    scene.add(Xlines);
}


// Add World Origin Z Axis lines
function zAxisLines() {
const zPoints = [];
zPoints.push(new THREE.Vector3(0, 0, -2));
zPoints.push(new THREE.Vector3(0, 0, 2));
const geometryZLines = new MeshLine();
geometryZLines.setPoints(zPoints);
const materialZLines = new MeshLineMaterial({ color: 0xff0000, lineWidth: .025});
const Zlines = new THREE.Mesh(geometryZLines, materialZLines);
scene.add(Zlines);
}

//Create a cellphone outline
function createCellphoneOutline() {
const cellphonegeometry = new createBoxWithRoundedEdges( 1, 3, .1, .1, 10 );
const cellphonematerial = new THREE.MeshBasicMaterial({ color: 0x909090, wireframe: false});
const cellphone = new THREE.Mesh(cellphonegeometry, cellphonematerial);
cellphone.position.set(0, 0, 0);
scene.add(cellphone);

cellphone.userData.draggable = true;
cellphone.userData.name='cellphone' 
}

//native function to create a box with rounded edges

function createBoxWithRoundedEdges( width, height, depth, radius0, smoothness ) {
  let shape = new THREE.Shape();
  let eps = 0.00001;
  let radius = radius0 - eps;
  shape.absarc( eps, eps, eps, -Math.PI / 2, -Math.PI, true );
  shape.absarc( eps, height -  radius * 2, eps, Math.PI, Math.PI / 2, true );
  shape.absarc( width - radius * 2, height -  radius * 2, eps, Math.PI / 2, 0, true );
  shape.absarc( width - radius * 2, eps, eps, 0, -Math.PI / 2, true );
  let geometry = new THREE.ExtrudeBufferGeometry( shape, {
    depth: depth - radius0 * 2,
    bevelEnabled: true,
    bevelSegments: smoothness * 2,
    steps: 1,
    bevelSize: radius,
    bevelThickness: radius0,
    curveSegments: smoothness
  });
  
  geometry.center();
  
  return geometry;
}

