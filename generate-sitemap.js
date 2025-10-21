import { generateSitemap } from './dist/api/generateSitemap.js'

generateSitemap().catch((error) => {
    console.error(error)
})