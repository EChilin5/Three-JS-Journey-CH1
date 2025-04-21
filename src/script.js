import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/Addons.js'
import helvetic from "./fonts/helvetiker_regular.typeface.json"
import { TextGeometry } from 'three/examples/jsm/Addons.js'

/**
 * Base
 */
// Debug
const gui = new GUI()

gui.hide()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// axes helper
// const axesHelper = new THREE.AxesHelper()
// scene.add(axesHelper)

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()

const matcapTexture = textureLoader.load('/textures/matcaps/3.png')
const matcapTexture2 = textureLoader.load('/textures/matcaps/2.png')
const doorMetalTexture = textureLoader.load("./textures/door/metalness.jpg")
const doorColorTexture = textureLoader.load("./textures/door/dragonball.jpg")

const doorNormalTexture = textureLoader.load("./textures/door/donut.png")


doorColorTexture.colorSpace = THREE.SRGBColorSpace
// Optional: control texture offset and repeat if needed
doorColorTexture.center.set(0.5, 0.5) // center pivot
doorColorTexture.rotation = 0         // no rotation
doorColorTexture.wrapS = THREE.RepeatWrapping
doorColorTexture.wrapT = THREE.RepeatWrapping
doorColorTexture.offset.set(0, 0) 


console.log(matcapTexture)
matcapTexture.colorSpace = THREE.SRGBColorSpace

const donutsArray = [] // array to store donut meshes
const spereArray = [] // array to store donut meshes


const fontLoader = new  FontLoader()

fontLoader.load('./fonts/helvetiker_regular.typeface.json', (fonts)=>{
    console.log(fonts)
    const textGeometry = new TextGeometry(
        'One Step At A Time',
        {
            font: fonts,
            size:0.5,
            depth: 0.2,
            // depth is an alternate for height
            curveSegments: 5,
            bevelEnabled: true,
            bevelThickness: 0.03,
            bevelSize: 0.02,
            bevelOffset: 0,
            bevelSegments:4
        }
    )

    // textGeometry.computeBoundingBox()
    // textGeometry.translate(
    //     - (textGeometry.boundingBox.max.x - 0.02)* 0.5,
    //     - (textGeometry.boundingBox.max.y -0.02) * 0.5,
    //     - (textGeometry.boundingBox.max.z - 0.03)* 0.5,
    // )

    textGeometry.center()

    const material = new THREE.MeshMatcapMaterial()
    // textMaterial.wireframe = true
    material.matcap = matcapTexture
    
    const text = new THREE.Mesh(textGeometry, material)
    scene.add(text)

    const donutGeometry = new THREE.TorusGeometry(0.3,0.2,20,45)
    const donutMaterial = new THREE.MeshMatcapMaterial({matcap: matcapTexture2})
    donutMaterial.map = doorNormalTexture
    donutMaterial.iridescence = 1
    donutMaterial.iridescenceIOR = 1
    donutMaterial.iridescenceThicknessRange = [100, 800]

    const SphereGeometry =  new THREE.SphereGeometry(0.5,64, 64)
    const sphereMaterial = new THREE.MeshPhysicalMaterial()
    sphereMaterial.map = doorColorTexture
    sphereMaterial.metalness =1;
    sphereMaterial.roughness = 1;
    sphereMaterial.metalnessMap = doorMetalTexture


    for(let i = 0; i< 50; i++){

        const donut = new THREE.Mesh(donutGeometry, donutMaterial)

        donut.position.x = (Math.random() -0.5 )* 10;
        donut.position.y = (Math.random() -0.5 )* 10;
        donut.position.z = (Math.random() -0.5) * 10;
        
        donut.rotation.x = Math.random() * Math.PI
        donut.rotation.y = Math.random() * Math.PI

        const scale  = Math.random()
        donut.scale.set(scale, scale, scale)


        scene.add(donut)
        donutsArray.push(donut)
    }
    for(let i = 0; i< 80; i++){

        const circle = new THREE.Mesh(SphereGeometry, sphereMaterial)

        circle.position.x = (Math.random() -0.5 )* 10;
        circle.position.y = (Math.random() -0.5 )* 10;
        circle.position.z = (Math.random() -0.5) * 10;
        
        circle.rotation.x = Math.random() * Math.PI
        circle.rotation.y = Math.random() * Math.PI

        const scale  = Math.random()
        circle.scale.set(scale, scale, scale)


        scene.add(circle)
        spereArray.push(circle)
    }
    console.log(donutsArray.length)
    console.log(spereArray.length)

})


// LIGHTS
const ambientLight = new THREE.AmbientLight(0xffffff,1)
scene.add(ambientLight)
const pointLight = new THREE.PointLight(0xffffff, 30)
// pointLight.center()
scene.add(pointLight)


/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    // console.log(donutsArray.length)

      // Rotate all donuts
      donutsArray.forEach(donut => {
        donut.rotation.y = 0.15* elapsedTime
        donut.rotation.x = -0.15 * elapsedTime
    })

    spereArray.forEach(sphere => {
        sphere.rotation.y = 0.15* elapsedTime
        sphere.rotation.x = -0.15 * elapsedTime
    })


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()