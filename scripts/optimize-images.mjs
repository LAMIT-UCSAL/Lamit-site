import sharp from 'sharp'
import { readdir, mkdir, rename, stat } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const ARCHIVE_DIR = path.join(ROOT, 'assets-src', 'gallery-originals')

const TARGETS = [
  {
    dir: path.join(ROOT, 'public/media/gallery/hackathons'),
    maxWidth: 1080,
  },
  {
    dir: path.join(ROOT, 'public/media/gallery/eventos'),
    maxWidth: 1600,
  },
]

const WEBP_OPTIONS = { quality: 78 }
const JPEG_OPTIONS = { quality: 80, mozjpeg: true }

async function optimizeFile(dir, file) {
  const ext = path.extname(file).toLowerCase()
  if (!['.png', '.jpg', '.jpeg'].includes(ext)) return null

  const srcPath = path.join(dir, file)
  const base = path.basename(file, path.extname(file))
  const webpPath = path.join(dir, `${base}.webp`)
  const jpgPath = path.join(dir, `${base}.jpg`)

  const alreadyArchived = (await readdir(ARCHIVE_DIR).catch(() => [])).some(
    (f) => path.basename(f, path.extname(f)) === base
  )
  if (alreadyArchived) return null

  const { size: srcSize } = await stat(srcPath)
  const meta = await sharp(srcPath).metadata()
  const target = TARGETS.find((t) => dir === t.dir)
  const resize = meta.width > target.maxWidth ? { width: target.maxWidth } : null

  await mkdir(ARCHIVE_DIR, { recursive: true })
  const archivePath = path.join(ARCHIVE_DIR, file)
  await rename(srcPath, archivePath)

  const pipeline = () => {
    let img = sharp(archivePath).rotate()
    if (resize) img = img.resize(resize)
    return img
  }

  await pipeline().webp(WEBP_OPTIONS).toFile(webpPath)
  await pipeline().jpeg(JPEG_OPTIONS).toFile(jpgPath)

  const webpSize = (await stat(webpPath)).size
  const jpgSize = (await stat(jpgPath)).size

  return { file, srcSize, webpSize, jpgSize }
}

async function main() {
  const results = []
  for (const target of TARGETS) {
    if (!existsSync(target.dir)) continue
    const files = await readdir(target.dir)
    for (const file of files) {
      const result = await optimizeFile(target.dir, file)
      if (result) results.push(result)
    }
  }

  let totalSrc = 0
  let totalOut = 0
  for (const r of results) {
    totalSrc += r.srcSize
    totalOut += r.webpSize + r.jpgSize
    console.log(
      `${r.file.padEnd(24)} ${(r.srcSize / 1024 / 1024).toFixed(2)}MB -> webp ${(r.webpSize / 1024).toFixed(0)}KB + jpg ${(r.jpgSize / 1024).toFixed(0)}KB`
    )
  }
  console.log(`\nTotal: ${(totalSrc / 1024 / 1024).toFixed(2)}MB -> ${(totalOut / 1024 / 1024).toFixed(2)}MB (both formats combined)`)
  console.log(`Originals archived to: ${path.relative(ROOT, ARCHIVE_DIR)}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
