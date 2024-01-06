export interface HueBridgeDiscoverInfo {
  id: string;
  internalipaddress: string;
  port: number;
}

export interface HueBridgePost {
  name: string;
  discover_info: HueBridgeDiscoverInfo;
}

export interface HueBridge {
  id: string;
  name: string;
  ip_address: string;
  port: number;
}

export interface HueRoomLight {
  name: string;
}

export interface HueRoom {
  id: string;
  name: string;
  grouped_light_id: string;
  lights: { [key: string]: HueRoomLight };
}

export interface HueColour {
  r: number;
  g: number;
  b: number;
}

export interface HueRoomGroupedLightState {
  on: boolean | null;
  brightness: number | null;
}

export interface HueRoomLightState {
  name: string;
  on: boolean;

  brightness: number | null;
  colour_temperature: number | null;
  colour: HueColour | null;
}

export enum HueRoomSceneStatus {
  INACTIVE = "inactive",
  STATIC = "static",
  DYNAMIC_PALETTE = "dynamic_palette",
}

export interface HueRoomSceneState {
  name: string;
  status: HueRoomSceneStatus;
}

export interface HueRoomState {
  grouped_light: HueRoomGroupedLightState;
  lights: { [key: string]: HueRoomLightState };
  scenes: { [key: string]: HueRoomSceneState };
}

export interface HueRoomGroupedLightStatePatch {
  on?: boolean;
  brightness?: number;
}

export interface HueRoomLightStatePatch {
  name?: string;
  on?: boolean;

  brightness?: number;
  colour_temperature?: number;
  colour?: HueColour;
}

export interface HueRoomStatePatch {
  grouped_light?: HueRoomGroupedLightStatePatch;
  lights?: { [key: string]: HueRoomLightStatePatch };
  scene?: string;
}
