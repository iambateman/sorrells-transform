//set up 3D scene parameters

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .1, 1000);
const renderer = new THREE.WebGLRenderer();
scene.background = new THREE.Color(0xfafafa); 
const width = window.innerWidth - 200;
const height = window.innerHeight - 200;
renderer.setSize(width, height);
document.body.appendChild(renderer.domElement);

//Create a cellphone outline

const geometry = new THREE.BoxGeometry(1, 2, .1);
const material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true});
const cellphone = new THREE.Mesh(geometry, material);
scene.add(cellphone);

//Position the camera
camera.position.z = 5;

//Animate the scene

function animate() {   
    requestAnimationFrame(animate);
    cellphone.rotation.x += 0.01;
    cellphone.rotation.y += 0.01;
    renderer.render(scene, camera);
}   
animate();

//Handle window resize
window.addEventListener('resize', () => {   
    camera.aspect = window.innerWidth/ window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth - 200, window.innerHeight -200);
});
//Add event listener for mouse click