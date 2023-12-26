import config_dev from "../../config-dev.json";
import config_prod from "../../config-prod.json";

let config = config_prod;
if (process.env.NEXT_PUBLIC_CONFIG_ENV == "dev") config = config_dev;

export const BASE_URL = config.API_BASE_URL;
