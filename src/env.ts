import dotenv from "dotenv"
import path from "path"

/**
 * Load environment variables from .env file
 */
dotenv.config({ path: path.resolve(__dirname, "../.env") })

/**
 * Raw environment variables
 */
const APP_URL = process.env.APP_URL
const BASELINE_UI_DESIGN_APP_URL = process.env.BASELINE_UI_DESIGN_APP_URL
const GENERATE_BASELINE_SCREENSHOTS_ONLY =
  process.env.GENERATE_BASELINE_SCREENSHOTS_ONLY

/**
 * Derived configuration values
 */
const isGenerationMode = GENERATE_BASELINE_SCREENSHOTS_ONLY === "true"
const _targetAppUrl = isGenerationMode ? BASELINE_UI_DESIGN_APP_URL : APP_URL

/**
 * Validation
 */
if (!_targetAppUrl) {
  const varName = isGenerationMode ? "BASELINE_UI_DESIGN_APP_URL" : "APP_URL"
  throw new Error(
    `Missing required environment variable: ${varName}\n` +
      `Mode: GENERATE_BASELINE_SCREENSHOTS_ONLY=${GENERATE_BASELINE_SCREENSHOTS_ONLY || "undefined"}\n` +
      `Please set ${varName} in .env or as an environment variable.`
  )
}

const targetAppUrl: string = _targetAppUrl

/**
 * Exports (only after validation)
 */
export {
  APP_URL,
  BASELINE_UI_DESIGN_APP_URL,
  GENERATE_BASELINE_SCREENSHOTS_ONLY
}

export { isGenerationMode, targetAppUrl }
