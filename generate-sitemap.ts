import { generateSitemap } from './api/generateSitemap.ts'

generateSitemap().catch((error) => {
    console.error(error)
})