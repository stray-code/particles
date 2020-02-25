// 初期化
const canvas = document.createElement('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight
document.body.appendChild(canvas)
document.body.style.margin = 0
document.body.style.overflow = 'hidden'
const ctx = canvas.getContext('2d')
//////////////////////////////////////////////////////////////

// ドットクラス
class Dot {
  constructor({ x, y, z, vx, vy }) {
    this.x = x
    this.y = y
    this.z = z
    this.vx = vx
    this.vy = vy
  }

  // 移動
  update() {
    this.x += this.vx
    this.y += this.vy

    if (this.x + this.z > canvas.width) this.vx *= -1
    if (this.y + this.z > canvas.height) this.vy *= -1
    if (this.x - this.z < 0) this.vx *= -1
    if (this.y - this.z < 0) this.vy *= -1
  }

  // ドットの描画
  render() {
    ctx.beginPath()
    ctx.fillStyle = '#888'
    ctx.arc(this.x, this.y, this.z, 0, Math.PI * 2)
    ctx.closePath()
    ctx.fill()
  }

  // ドット間の線の描画
  renderStroke() {
    dotList.forEach((dot) => {
      const diffX = Math.abs(dot.x - this.x)
      const diffY = Math.abs(dot.y - this.y)
      // 平方根
      // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Math/sqrt
      const sqrt = Math.sqrt(diffX * diffX + diffY * diffY)
      if (sqrt < maxDistance) {
        ctx.lineWidth = lineWidth
        ctx.beginPath()
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(dot.x, dot.y)
        ctx.closePath()
        ctx.stroke()
      }
    })
  }
}
//////////////////////////////////////////////////////////////

const dotRadius = 5 // 半径
const maxVector = 5 // 移動スピード
const maxDots = 10 // ドットの数
const maxDistance = 100 // 線の距離
const lineWidth = 0.05 // 線の幅
const arr = new Array(maxDots).fill(null)

// ドットの初期値を作成
const createDot = () => {
  const dot = {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    z: dotRadius,
    vx: Math.random() * maxVector - (maxVector / 2),
    vy: Math.random() * maxVector - (maxVector / 2)
  }
  return dot
}

// ドットリスト
const dotList = arr.map((a) => new Dot(createDot()))

// ループの処理
const loop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  dotList.forEach((dot) => dot.update())
  dotList.forEach((dot) => dot.render())
  dotList.forEach((dot) => dot.renderStroke())

  requestAnimationFrame(loop)
}

loop()

//////////////////////////////////////////////////////////////
// ドットを追加する処理
const addCreateDot = (event) => {
  const dot = {
    x: event.clientX,
    y: event.clientY,
    z: dotRadius,
    vx: Math.random() * maxVector - (maxVector / 2),
    vy: Math.random() * maxVector - (maxVector / 2)
  }
  return dot
}

const addDot = (event) => {
  dotList.push(new Dot(addCreateDot(event)))
}

window.addEventListener('click', addDot)