import { build } from 'vite'
import { build as electronBuild } from 'electron-builder'
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.join(__dirname, '..')

async function buildElectron() {
  try {
    console.log('🔨 Building Electron main process...')
    
    // Copiar archivos de main a dist-electron
    await fs.ensureDir(path.join(rootDir, 'dist-electron'))
    await fs.copy(
      path.join(rootDir, 'src/main'),
      path.join(rootDir, 'dist-electron'),
      { overwrite: true }
    )
    
    console.log('✅ Main process built successfully')
  } catch (error) {
    console.error('❌ Error building Electron:', error)
    process.exit(1)
  }
}

async function buildRenderer() {
  try {
    console.log('🔨 Building Renderer process (React)...')
    
    await build({
      configFile: path.join(rootDir, 'vite.config.js'),
    })
    
    console.log('✅ Renderer process built successfully')
  } catch (error) {
    console.error('❌ Error building Renderer:', error)
    process.exit(1)
  }
}

async function packageApp() {
  try {
    console.log('📦 Packaging application...')
    
    await electronBuild({
      config: {
        extends: path.join(rootDir, 'electron-builder.json5'),
      },
    })
    
    console.log('✅ Application packaged successfully')
  } catch (error) {
    console.error('❌ Error packaging app:', error)
    process.exit(1)
  }
}

// Ejecutar builds
async function main() {
  await buildElectron()
  await buildRenderer()
  await packageApp()
  console.log('🎉 Build completed!')
}

main()