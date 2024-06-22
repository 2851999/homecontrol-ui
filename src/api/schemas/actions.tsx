import { ACDeviceStatePut } from "./aircon";

export enum TaskType {
  AC_STATE = "ac_state",
  BROADLINK_ACTION = "broadlink_action",
  HUE_SCENE = "hue_scene",
}

export interface TaskACState {
  task_type: TaskType.AC_STATE;
  device_id: string;
  state: ACDeviceStatePut;
}

export interface TaskBroadlinkAction {
  task_type: TaskType.BROADLINK_ACTION;
  device_id: string;
  action_id: string;
}

export interface TaskHueScene {
  task_type: TaskType.HUE_SCENE;
  bridge_id: string;
  scene_id: string;
}

export type Task = TaskACState | TaskBroadlinkAction | TaskHueScene;

export interface RoomAction {
  id: string;
  name: string;
  room_id: string;
  icon: string;
  tasks: Task[];
}

export interface TaskACStatePost {
  task_type: TaskType.AC_STATE;
  device_id: string;
  state: ACDeviceStatePut;
}

export type TaskPost = TaskACStatePost | TaskBroadlinkAction | TaskHueScene;

export interface RoomActionPost {
  name: string;
  room_id: string;
  icon: string;
  tasks: TaskPost[];
}

export interface RoomActionPatch {
  name?: string;
  room_id?: string;
  icon?: string;
  tasks?: TaskPost[];
}
