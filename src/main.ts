import './style.css'
// import img from '../public/template.jpg'

const imageLoader = document.querySelector('[image]') as HTMLInputElement
// const croperCanvas = document.querySelector('[croper]') as HTMLCanvasElement
const fName = document.querySelector('#f-name') as HTMLInputElement
const lName = document.querySelector('#l-name') as HTMLInputElement
const download = document.querySelector('[download]') as HTMLButtonElement

const generated = document.querySelector('[generated]') as HTMLDivElement
const generator = document.querySelector('[generator]') as HTMLDivElement
const generatorBtn = document.querySelector('[generatorBtn]') as HTMLButtonElement
const template = document.querySelector('[template]') as HTMLImageElement
const result = document.querySelector('[result]')  as HTMLImageElement

let img = new Image()

let fullName = ''

let cropRect = {x: 0, y: 0, w: 196, h: 298}

// document.onload = initialize

initialize()
function initialize() {
  console.log('Initialization !')
  
  // Initialize Canvas
  
  imageLoader.onchange = (e: any) => {
    const reader = new FileReader();
    reader.onload = (o) => {
      const res = reader.result;
      if (typeof res == 'string') {
        img.src = res;
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  generatorBtn.onclick = generate
  download.onclick = downloadImage
}

function downloadImage(e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
  let url = result.src
  const link = document.createElement('a')
  link.href = url
  link.download = `${fullName}.png`
  link.click()
}

function generate() {
  let fname = fName.value.toLocaleUpperCase()
  let lname = lName.value
  fullName = fname + ' ' + lname
  const avatarCanvas = new OffscreenCanvas(196, 298)
  const canvas = new OffscreenCanvas(680, 680)

  const ctx = canvas.getContext('2d')
  const aCtx = avatarCanvas.getContext('2d')

  // Draw Background
  ctx?.drawImage(template, 0, 0, canvas.width, canvas.height)

  // Prepare Avatar
  aCtx?.drawImage(img, 0, 0, avatarCanvas.width, avatarCanvas.height)
  
  // Incrustate Avatar
  // ctx.globalAlpha = 0.5
  ctx?.drawImage(avatarCanvas, 49, 138)

  // Measure Name width
  let fontSize = 20
  if (ctx) ctx.font = `${fontSize}px Inter, system-ui, Avenir, Helvetica, Arial, sans-serif`
  let fMeasure = ctx?.measureText(fname)
  let lMeasure = ctx?.measureText(lname)
  let fw = fMeasure?.width || 100
  let lw = lMeasure?.width || 100

  // Write Full Name
  let rect = {x: 50, y: 440, w: 186, h: 54}
  ctx!.fillStyle = 'white'
  
  ctx?.fillText(fname, rect.x + (rect.w/2) - (fw/2), rect.y + fontSize * 1.3)
  ctx?.fillText(lname, rect.x + (rect.w/2) - (lw/2), rect.y + fontSize * 2 * 1.3)


  // Get Result
  canvas.convertToBlob().then((blob) => {
    let url = URL.createObjectURL(blob)
    result.src = url
    // URL.revokeObjectURL(url)
  })
  

  generator.style.display = "none"
  generated.style.display = "flex"

}
