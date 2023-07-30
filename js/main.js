const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 2.5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a plane geometry
let segments = 2;
let geometry = new THREE.PlaneGeometry(2, 2, segments, segments);
const material = new THREE.MeshBasicMaterial({color: 0x00ff00, side: THREE.DoubleSide, wireframe: true});
let mesh = new THREE.Mesh(geometry, material);

let k = 1; // Wave number
let sigma = 1; // Width of the Gaussian wave packet
let omega = 1; // Frequency


const hudData = {
    "k (# of waves)": 1,
    "Sigma (Width of the Gaussian wave packet)": 1,
    "Omega (Frequency)": 1,
    Segments: segments
};


// Create a GUI and add properties for the cubes' rotation and velocity
const gui = new dat.GUI({width: window.innerWidth/2});
// gui.width = 500;

gui.add(hudData, 'k (# of waves)', 1, 50, 1).listen().onChange(value => {
    k = value;
})
gui.add(hudData, 'Sigma (Width of the Gaussian wave packet)', 1, 10).listen().onChange(value => {
    sigma = value;
})

gui.add(hudData, "Omega (Frequency)", 1, 50).listen().onChange(value => {
    omega = value;
})
gui.add(hudData, "Segments", 1, 100, 1).listen().onChange(value => {
    scene.remove(mesh);  // Remove the old mesh from the scene
    geometry.dispose();  // Dispose of the old geometry
    geometry = new THREE.PlaneGeometry(2, 2, value, value);  // Create a new geometry with more segments
    mesh = new THREE.Mesh(geometry, material);  // Create a new mesh with the new geometry
    scene.add(mesh);
})

// Get the position attribute
const positions = geometry.attributes.position;

for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    positions.setZ(i, waveFunction(x, y, 0));
}


scene.add(mesh);

function waveFunction(x, y, t) {
    const x0 = 0; // Initial position
    const envelope = Math.exp(-0.5 * Math.pow((x - x0) / sigma, 2));
    const wave = Math.cos(k * x - omega * t);

    return envelope * wave;
}

function animate(t) {
    requestAnimationFrame(animate);

    // Get the position attribute
    const positions = geometry.attributes.position.array;

    for (let i = 0; i < positions.length; i += 3) {
        // Modify the z-coordinate (positions[i + 2]) based on the wave function
        const x = positions[i];
        const y = positions[i + 1];
        positions[i + 2] = waveFunction(x, y, t / 1000);
    }

    // Tell Three.js to update the geometry
    geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}


animate(0);
