export enum TriggerType {
  DATETIME = "datetime",
  INTERVAL = "interval",
  CRON = "cron",
}

export interface TriggerDatetime {
  trigger_type: TriggerType.DATETIME;
  value: Date;
}

export interface TimeDelta {
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface TriggerInterval {
  trigger_type: TriggerType.INTERVAL;
  value: TimeDelta;
}

export interface TriggerCron {
  trigger_type: TriggerType.CRON;
  value: string;
}

export type Trigger = TriggerDatetime | TriggerInterval | TriggerCron;

export enum TaskType {
  RECORD_ALL_TEMPERATURES = "record_all_temperature",
  EXECUTE_ROOM_ACTION = "execute_room_action",
}

export interface TaskRecordAllTemperatures {
  task_type: TaskType.RECORD_ALL_TEMPERATURES;
}

export interface TaskExecuteRoomAction {
  task_type: TaskType.EXECUTE_ROOM_ACTION;
  room_id: string;
  action_id: string;
}

export type Task = TaskRecordAllTemperatures | TaskExecuteRoomAction;

export enum JobStatus {
  ACTIVE = "active",
  PAUSED = "paused",
}

export interface Job {
  id: string;
  name: string;
  task: Task;
  trigger: Trigger;
  status: JobStatus;
}

export interface JobPost {
  name: string;
  task: Task;
  trigger: Trigger;
}

export interface JobPatch {
  name?: string;
  task?: Task;
  trigger?: Trigger;
  status?: JobStatus;
}
