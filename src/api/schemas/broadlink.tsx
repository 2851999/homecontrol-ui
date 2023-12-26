export interface BroadlinkDevice {
  id: string;
  name: string;
  ip_address: string;
}

export interface BroadlinkDevicePost {
  name: string;
  ip_address: string;
}

export interface BroadlinkAction {
  id: string;
  name: string;
}

export interface BroadlinkDeviceRecordPost {
  name: string;
}

export interface BroadlinkDevicePlaybackPost {
  action_id: string;
}
