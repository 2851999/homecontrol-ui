"use client";

import axios, { AxiosError, isAxiosError } from "axios";

export interface Config {
  homecontrol_api_url: string
}

// Like authentication, only want a single request to get config to be sent and no more
// in this case also store the config once loaded as it wont change
let isFetchingConfig = false;
let configSubscribers: ((config?: Config, error?: AxiosError) => any)[] = [];
let config: Config | undefined = undefined;

/* Obtains config from the static files (or from client if already fetched) */
export const fetchConfig = async (): Promise<Config | undefined> => {
  // Return config if already loaded
  if (config)
    return config;

  // If not already fetching attempt to fetch
  if (!isFetchingConfig) {
    isFetchingConfig = true;
    
    try {
      config = await axios.get("/config.json").then((response) => response.data)
    } catch (error) {
      if (isAxiosError(error)) {
        configSubscribers.forEach((callback) =>
          callback(undefined, error as AxiosError)
        );
        configSubscribers = []
      }
    }

    isFetchingConfig = false;
    configSubscribers.forEach((callback) => callback(config, undefined))
    configSubscribers = []

    return Promise.resolve(config);
  } else {
    // Already fetching so add to subscribers to resolve once loading finished
    return new Promise((resolve, reject) => {
      configSubscribers.push((config?: Config, error?: AxiosError) => {
        if (error !== undefined) reject(error)
        else resolve(config)
      })
    })
  }
}