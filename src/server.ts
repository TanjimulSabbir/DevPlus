import app from "./app"
import { config } from "./config"
import { intiDB } from "./database"


const main = () => {
    intiDB()
    app.listen(config.port, () => {
        console.log(`Server is running on port ${config.port}`);
    })
}

main()