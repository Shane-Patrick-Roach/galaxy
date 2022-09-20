import './style.css'
import gsap from 'gsap'
import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'

import { GUI } from 'dat.gui'
import { Float32BufferAttribute } from 'three';


const gui = new GUI();

const canvasContainer = document.querySelector('#canvasContainer')

const scene = new THREE.Scene()


const camera = new THREE.PerspectiveCamera(
  75, 
  canvasContainer.offsetWidth / canvasContainer.offsetHeight, 
  0.1, 
  1000
  );




camera.position.z = 10
camera.position.y = 0
camera.position.x = 0


const parameters = {
  count: 3000,
  size: 0.03,
  radius: 5,
  branches: 3,
  spin: 3,
  randomness: 0.1,
  randomnessPower: 3,
  insideColor: "#ff6030",
  outsideColor: "#1b3984"
}



let galaxyGeometry = null
let material = null
let points = null

const generateGalaxy = () => {

  if (points !== null) {
    galaxyGeometry.dispose()
    material.dispose()
    scene.remove(points)
  }

  galaxyGeometry = new THREE.BufferGeometry()

  const positions = new Float32Array(parameters.count * 3)
  const colors = new Float32Array(parameters.count * 3)

  const colorInside = new THREE.Color(parameters.insideColor)
  const colorOutside = new THREE.Color(parameters.outsideColor)

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3

    const radius = Math.random() * parameters.radius
    const spinAngle = radius * parameters.spin
    const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2

    const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
    const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
    const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius

    positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX
    positions[i3 + 1] = randomY
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ

    const mixedColor = colorInside.clone()
    mixedColor.lerp(colorOutside, radius / parameters.radius)

    colors[i3 + 0] = mixedColor.r
    colors[i3 + 1] = mixedColor.g
    colors[i3 + 2] = mixedColor.b
  }
  console.log(positions);

  galaxyGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  galaxyGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  /**
     * Material
     */
  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true
  })

  points = new THREE.Points(galaxyGeometry, material)
  scene.add(points)
}

generateGalaxy()

const renderer = new THREE.WebGLRenderer(
  {
    canvas: document.querySelector('canvas'),
    alpha: true
  }
);

gui.add(parameters, 'count').min(0).max(10000).step(100).onFinishChange(generateGalaxy)
gui.add(parameters, 'size').min(0.01).max(.10).step(.01).onFinishChange(generateGalaxy)
gui.add(parameters, 'spin').min(1).max(5).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, 'radius').min(1).max(50).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, 'branches').min(2).max(20).step(1).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomness').min(.1).max(1).step(.2).onFinishChange(generateGalaxy)
gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001).onFinishChange(generateGalaxy)
gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy)
gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy)



// background stars
const starVertices = []
for (let i = 0; i < 10000; i++)
{
  const x = (Math.random() - 0.5) * 2000
  const y = (Math.random() - 0.5) * 2000
  const z = -Math.random() * 5000
  starVertices.push(x,y,z)
}
const starGeometry = new THREE.BufferGeometry()
starGeometry.setAttribute('position', new Float32BufferAttribute(starVertices, 3))

const starMaterial = new THREE.PointsMaterial({
  color: 0xffffff
})

const stars = new THREE.Points(starGeometry, starMaterial)
scene.add(stars)


renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);


function animate() {
  requestAnimationFrame(animate);

  if (points !== null){
    points.rotation.y += 0.001
    points.rotation.x += 0.0005
  }
  
  renderer.render(scene, camera);
};

animate();


addEventListener('resize', ()=> {
  renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight)


  camera = new THREE.PerspectiveCamera(
    75,
    canvasContainer.offsetWidth/offsetHeight,
    0.1,
    1000
  )
})



