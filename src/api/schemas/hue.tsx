interface HueBridgeDiscoverInfo {
  id: string;
  internalipaddress: string;
  port: number;
}

interface HueBridgePost {
  name: string;
  discover_info: HueBridgeDiscoverInfo;
}

interface HueBridge {
  id: string;
  name: string;
  ip_address: string;
  port: number;
}

interface HueRoomLight {
  name: string;
}

interface HueRoom {
  id: string;
  name: string;
  grouped_light_id: string;
  lights: { [key: string]: HueRoomLight };
}

interface HueColour {
  r: number;
  g: number;
  b: number;
}

interface HueRoomGroupedLightState {
  on: boolean | null;
  brightness: number | null;
}

interface HueRoomLightState {
  name: string;
  on: boolean;

  brightness: number | null;
  colour_temperature: number | null;
  colour: HueColour | null;
}

interface HueRoomState {
  grouped_light: HueRoomGroupedLightState;
  lights: { [key: string]: HueRoomLightState };
}

interface HueRoomGroupedLightStatePatch {
  on?: boolean;
  brightness?: number;
}

interface HueRoomLightStatePatch {
  name?: string;
  on?: boolean;

  brightness?: number;
  colour_temperature?: number;
  colour?: HueColour;
}

interface HueRoomStatePatch {
  grouped_light?: HueRoomGroupedLightStatePatch;
  lights?: { [key: string]: HueRoomLightStatePatch };
}
