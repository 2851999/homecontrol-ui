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
