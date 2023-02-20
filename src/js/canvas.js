/* ------------------------------------------------------ */
import platform from '../img/platform.png'
import hills from '../img/hills.png'
import bg from '../img/background.png'
import platformSmallTall from '../img/platformSmallTall.png'
import spriteRunLeft from '../img/spriteRunLeft.png'
import spriteRunRight from '../img/spriteRunRight.png'
import spriteStandLeft from '../img/spriteStandLeft.png'
import spriteStandRight from '../img/spriteStandRight.png'
/* ------------------------------------------------------ */


const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1480
canvas.height = 690

const gravity = 0.4
class Player {
  constructor() {
    this.speed = 8
    this.position = {
      x: 100,
      y: 100
    }
    this.velocity = {
      x: 0,
      y: 0
    }
    this.width = 66
    this.height = 150

    this.frames = 0
    this.sprites = {
      stand: {
        cropWidth: 177,
        width: 66,
        right: createImage(spriteStandRight),
        left: createImage(spriteStandLeft)
      },
      run: {
        cropWidth: 341,
        width: 127.875,
        right: createImage(spriteRunRight),
        left: createImage(spriteRunLeft)
      }
    }
    this.currentSprite = this.sprites.stand.right
    this.currentCropWidth = 177
  }

  draw() {
    c.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frames, 0, this.currentCropWidth, 400,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    )
  }

  update() {
    this.frames++
    if (this.frames > 59 && (this.currentSprite === this.sprites.stand.right || this.currentSprite === this.sprites.stand.left)) this.frames = 0
    else if (this.frames > 29 && (this.currentSprite === this.sprites.run.right || this.currentSprite === this.sprites.run.left)) this.frames = 0

    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.position.y + this.height + this.velocity.y <= canvas.height)
      this.velocity.y += gravity
    // else this.velocity.y = 0
  }
}

class Platform {
  constructor({ x, y, image }) {
    this.position = { x, y }
    this.image = image
    this.width = image.width
    this.height = image.height
  }

  draw() {
    // c.fillStyle = 'blue'
    // c.fillRect(this.position.x, this.position.y, this.width, this.height)

    c.drawImage(this.image, this.position.x, this.position.y)
  }
}

class GenericObject {
  constructor({ x, y, image }) {
    this.position = { x, y }
    this.image = image
    this.width = image.width
    this.height = image.height
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y)
  }
}


function createImage(imageSrc) {
  const image = new Image()
  image.src = imageSrc
  return image
}

let platformImage = createImage(platform)
let platformImageSmall = createImage(platformSmallTall)

let player = new Player()
let platforms = []
let genericObjects = []

let lastKey
const keys = {
  right: {
    pressed: false
  },
  left: {
    pressed: false
  }
}

let scrolloffset = 0
function init() {

  player = new Player()
  platforms = [
    new Platform(
      {
        x: platformImage.width * 4 + 8,
        y: 570 - platformImageSmall.height + 3,
        image: platformImageSmall
      }
    ),
    new Platform(
      {
        x: -1,
        y: 570,
        image: platformImage
      }
    ),
    new Platform(
      {
        x: platformImage.width - 4,
        y: 570,
        image: platformImage
      }
    ),
    new Platform(
      {
        x: platformImage.width * 2 + 100,
        y: 570,
        image: platformImage
      }
    ),
    new Platform(
      {
        x: platformImage.width * 3 + 300,
        y: 570,
        image: platformImage
      }
    ),
    new Platform(
      {
        x: platformImage.width * 4 + 700,
        y: 570,
        image: platformImage
      }
    )
  ]
  genericObjects = [
    new GenericObject(
      {
        x: -1,
        y: -1,
        image: createImage(bg)
      }
    ),
    new GenericObject(
      {
        x: -1,
        y: -1,
        image: createImage(hills)
      }
    )
  ]

  scrolloffset = 0
}

function animate() {
  requestAnimationFrame(animate)

  c.fillStyle = 'white'
  c.fillRect(0, 0, canvas.width, canvas.height)


  genericObjects.forEach((genericObject) => {
    genericObject.draw()
  })
  platforms.forEach((platform) => {
    platform.draw()
  })
  player.update()

  if (keys.right.pressed && player.position.x < 450) {
    player.velocity.x = player.speed
  }
  else if ((keys.left.pressed && player.position.x > 100) || (keys.left.pressed && scrolloffset === 0 && player.position.x > 0)) {
    player.velocity.x = -player.speed
  }
  else {
    player.velocity.x = 0

    if (keys.right.pressed) {
      scrolloffset += player.speed
      platforms.forEach(platform => {
        platform.position.x -= player.speed
      })
      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= player.speed * .66
      })
    }
    else if (keys.left.pressed && scrolloffset > 0) {
      scrolloffset -= player.speed
      platforms.forEach(platform => {
        platform.position.x += player.speed
      })
      genericObjects.forEach((genericObject) => {
        genericObject.position.x += player.speed * .66
      })
    }
  }


  platforms.forEach((platform) => {
    if (player.position.y + player.height <= platform.position.y
      && player.position.y + player.height + player.velocity.y >= platform.position.y && player.position.x + player.width >= platform.position.x
      && player.position.x <= platform.position.x + platform.width) {
      player.velocity.y = 0
    }
  })


  // Sprite switching condition
  if (keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.run.right) {
    player.frames = 1
    player.currentSprite = player.sprites.run.right
    player.currentCropWidth = player.sprites.run.cropWidth
    player.width = player.sprites.run.width
  }
  else if (keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.run.left) {
    player.currentSprite = player.sprites.run.left
    player.currentCropWidth = player.sprites.run.cropWidth
    player.width = player.sprites.run.width
  }
  else if (!keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.stand.left) {
    player.currentSprite = player.sprites.stand.left
    player.currentCropWidth = player.sprites.stand.cropWidth
    player.width = player.sprites.stand.width
  }
  else if (!keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.stand.right) {
    player.currentSprite = player.sprites.stand.right
    player.currentCropWidth = player.sprites.stand.cropWidth
    player.width = player.sprites.stand.width
  }

  // Win Condition 
  if (scrolloffset > platformImage.width * 4 + 300) {
    console.log('You Win')
  }

  // Lose Condition
  if (player.position.y > canvas.height) {
    init()
  }
}
init()
animate()

window.addEventListener('keydown', ({ keyCode }) => {

  switch (keyCode) {
    case 65:
      keys.left.pressed = true
      lastKey = 'left'
      break

    case 68:
      keys.right.pressed = true
      lastKey = 'right'
      break

    case 87:
    case 32:
      if (player.velocity.y === 0) player.velocity.y -= 15
      break

    case 83:
      break
  }
})

window.addEventListener('keyup', ({ keyCode }) => {

  switch (keyCode) {
    case 65:
      keys.left.pressed = false
      break

    case 68:
      keys.right.pressed = false
      break

    case 87:
    case 32:
      break

    case 83:
      break
  }
})