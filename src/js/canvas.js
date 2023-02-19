/* ------------------------------------------------------ */
import platform from '../img/platform.png'
import hills from '../img/hills.png'
import bg from '../img/background.png'
import platformSmallTall from '../img/platformSmallTall.png'
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
    this.width = 30
    this.height = 30
  }

  draw() {
    c.fillStyle = 'red'
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }

  update() {
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
        x: platformImage.width * 5 - 100,
        y: 300,
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
        x: platformImage.width * 4 + 900,
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

  if (keys.right.pressed && player.position.x < 600) {
    player.velocity.x = player.speed
  }
  else if (keys.left.pressed && player.position.x > 100) {
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
    else if (keys.left.pressed) {
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

  // Win Condition 
  if (scrolloffset > 2000) {
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

  // console.log(keyCode)
  switch (keyCode) {
    case 65:
      // console.log('left')
      keys.left.pressed = true
      break

    case 68:
      // player.velocity.x = 5
      keys.right.pressed = true
      break

    case 87:
    case 32:
      player.velocity.y = -15
      break

    case 83:
      break
  }
  // console.log(keys.right.pressed)
})

window.addEventListener('keyup', ({ keyCode }) => {

  switch (keyCode) {
    case 65:
      keys.left.pressed = false
      break

    case 68:
      // player.velocity.x = 0
      keys.right.pressed = false
      break

    case 87:
    case 32:
      break

    case 83:
      break
  }
})