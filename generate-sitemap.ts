import { generateSitemap } from './server/generateSitemap.ts'

generateSitemap().catch((error) => {
    console.error(error)
})