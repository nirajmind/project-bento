import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import Database from 'better-sqlite3'

// 1. Initialize Database
// We save the DB in the user's data directory so it persists after updates
const dbPath = join(app.getPath('userData'), 'bento.sqlite')
const db = new Database(dbPath)

// 2. Seed Data (Hackathon Setup)
// We create a table and add dummy data if it's empty
function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS loans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      borrower TEXT,
      sector TEXT,
      amount INTEGER,
      currency TEXT,
      dscr_current REAL,
      dscr_min REAL,
      status TEXT
    )
  `)

  const count = db.prepare('SELECT count(*) as count FROM loans').get()
  
  if (count.count === 0) {
    console.log('Seeding Database with Dummy Data...')
    const insert = db.prepare(`
      INSERT INTO loans (borrower, sector, amount, currency, dscr_current, dscr_min, status) 
      VALUES (@borrower, @sector, @amount, @currency, @dscr_current, @dscr_min, @status)
    `)

    const dummyData = [
      { borrower: 'Alpha Retail Ltd', sector: 'Retail', amount: 5000000, currency: 'EUR', dscr_current: 1.15, dscr_min: 1.20, status: 'Amber' },
      { borrower: 'Beta Energy Corp', sector: 'Energy', amount: 12000000, currency: 'USD', dscr_current: 1.50, dscr_min: 1.10, status: 'Green' },
      { borrower: 'Gamma Logistics', sector: 'Transport', amount: 3000000, currency: 'GBP', dscr_current: 0.95, dscr_min: 1.15, status: 'Red' }
    ]

    dummyData.forEach(loan => insert.run(loan))
  }
}

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  // Initialize DB on App Start
  initDB()

  // 3. IPC Handler
  // This listens for the frontend asking for data
  ipcMain.handle('get-portfolio', () => {
    const loans = db.prepare('SELECT * FROM loans').all()
    return loans
  })

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})