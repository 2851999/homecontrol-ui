export interface ACDevice {
  id: string;
  name: string;
  ip_address: string;
}

export interface ACDevicePost {
  name: string;
  ip_address: string;
}

export enum ACDeviceMode {
  AUTO = 1,
  COOL = 2,
  DRY = 3,
  HEAT = 4,
  FAN = 5,
}

export enum ACDeviceFanSpeed {
  AUTO = 102,
  HIGH = 100,
  MEDIUM = 80,
  LOW = 40,
  SILENT = 20,
}

export enum ACDeviceSwingMode {
  OFF = 0x0,
  VERTICAL = 0xc,
  HORIZONTAL = 0x3,
  BOTH = 0xf,
}

export interface ACDeviceStateBase {
  // Read and write
  power: boolean;
  target_temperature: number;
  operational_mode: ACDeviceMode;
  fan_speed: ACDeviceFanSpeed;
  swing_mode: ACDeviceSwingMode;
  eco_mode: boolean;
  turbo_mode: boolean;
  fahrenheit: boolean;
}

export interface ACDeviceState extends ACDeviceStateBase {
  // Read only
  indoor_temperature: number;
  outdoor_temperature: number;
  display_on: boolean;
}

export interface ACDeviceStatePut extends ACDeviceStateBase {
  // Write only
  prompt_tone: boolean;
}

export interface ACDeviceStatePatch extends Partial<ACDeviceStatePut> {}
