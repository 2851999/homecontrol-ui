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

export enum JobStatus {
  ACTIVE = "active",
  PAUSED = "paused",
}

export interface Job {
  id: string;
  name: string;
  task: string;
  trigger: Trigger;
  status: JobStatus;
}

export interface JobPost {
  name: string;
  task: string;
  trigger: Trigger;
}

export interface JobPatch {
  name?: string;
  task?: string;
  trigger?: Trigger;
  status?: JobStatus;
}
