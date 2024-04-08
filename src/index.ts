import { web } from "./app/web"
import { logger } from "./app/logger"

web.listen(3000, () => {
  logger.info("Listening on port 3000")
})
