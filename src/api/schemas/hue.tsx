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
  lights: { [key: string]: HueRoomLight[] };
}
