import path from 'path'
import crypto from 'crypto'
import multer from 'multer'

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp')

export default {
  directory: tmpFolder,
  /* armazenamento: em disco */
  storage: multer.diskStorage({
    // Local onde a imagem será salva
    destination: tmpFolder,

    // Generate unique file name
    filename (req, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('hex')
      const filename = `${fileHash}-${file.originalname}`

      return callback(null, filename)
    }
  })
}

