export enum ControlType {
  AC = "ac",
  BROADLINK = "broadlink",
  HUE_ROOM = "hue_room",
}

export interface ControllerAC {
  control_type: ControlType.AC;
  id: string;
}

export interface ControllerBroadlink {
  control_type: ControlType.BROADLINK;
  id: string;
}

export interface ControllerHueRoom {
  control_type: ControlType.HUE_ROOM;
  id: string;
  bridge_id: string;
}

export type RoomController =
  | ControllerAC
  | ControllerBroadlink
  | ControllerHueRoom;

export interface Room {
  id: string;
  name: string;
  controllers: RoomController[];
}

export interface RoomPost {
  name: string;
  controllers: RoomController[];
}

export interface RoomPatch {
  name?: string;
  controllers?: RoomController[];
}
