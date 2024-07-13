import AcUnitIcon from "@mui/icons-material/AcUnit";
import AirIcon from "@mui/icons-material/Air";
import AutoModeIcon from "@mui/icons-material/AutoMode";
import DryIcon from "@mui/icons-material/Dry";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";
import LightbulbIcon from "@mui/icons-material/Lightbulb";
import LightbulbOutlinedIcon from "@mui/icons-material/LightbulbOutlined";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import {
  Grid,
  IconButton,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonProps,
  Tooltip,
  TooltipProps,
  Typography,
} from "@mui/material";
import { forwardRef } from "react";
import {
  ACDeviceFanSpeed,
  ACDeviceMode,
  ACDeviceStateBase,
  ACDeviceStatePatch,
  ACDeviceStatePut,
} from "../../api/schemas/aircon";
import { AuthenticatedComponent } from "../Authenticated";

type TooltipToggleButtonProps = ToggleButtonProps & {
  TooltipProps: Omit<TooltipProps, "children">;
};

export const TooltipToggleButton: React.FC<TooltipToggleButtonProps> =
  // eslint-disable-next-line react/display-name
  forwardRef(({ TooltipProps, ...props }, ref) => {
    return (
      <Tooltip {...TooltipProps}>
        <ToggleButton ref={ref} {...props} />
      </Tooltip>
    );
    // https://github.com/mui/material-ui/issues/32420
  }) as React.FC<TooltipToggleButtonProps>;

interface ACControllerProps {
  deviceState: ACDeviceStatePut;
  onChangeDeviceState: (deviceState: ACDeviceStatePut) => void;
  // When true this
  // - Turns the sound icon into a toggle for prompt_tone rather than always sending true to trigger a tone
  // - Makes the slider use the actual value given to it rather than just using a default and allowing changes
  //   (for an actual device using this approach would make it feel sluggish)
  // sets it back to false
  useInternalState?: boolean;
}

export const ACController = (props: ACControllerProps) => {
  const handleStateChange = (newData: ACDeviceStatePatch) => {
    props.onChangeDeviceState({
      ...(props.deviceState as ACDeviceStateBase),
      ...newData,
      prompt_tone:
        newData.prompt_tone !== undefined ? newData.prompt_tone : false,
    });
  };

  return (
    <Grid container direction="column" alignItems="center" spacing={2}>
      <Grid item sx={{ display: "inline-flex", alignItems: "center" }}>
        <Typography variant="h6">
          {props.deviceState.target_temperature}&deg;C
        </Typography>
        <AuthenticatedComponent adminOnly>
          <IconButton
            sx={{ position: "absolute", right: "8px" }}
            onClick={() =>
              handleStateChange({
                prompt_tone: props.useInternalState
                  ? !props.deviceState.prompt_tone
                  : true,
              })
            }
          >
            {!props.useInternalState || props.deviceState.prompt_tone ? (
              <VolumeUpIcon />
            ) : (
              <VolumeOffIcon />
            )}
          </IconButton>
        </AuthenticatedComponent>
      </Grid>
      <Grid item width="100%">
        <Slider
          min={16}
          max={30}
          step={1}
          {...(props.useInternalState
            ? {
                value: props.deviceState.target_temperature,
                onChange: (event, value) =>
                  handleStateChange({
                    target_temperature: Array.isArray(value) ? value[0] : value,
                  }),
              }
            : {
                defaultValue: props.deviceState.target_temperature,
                onChangeCommitted: (event, value) =>
                  handleStateChange({
                    target_temperature: Array.isArray(value) ? value[0] : value,
                  }),
              })}
          marks
          valueLabelDisplay="auto"
        />
      </Grid>
      <Grid item>
        <ToggleButtonGroup
          value={props.deviceState.operational_mode}
          exclusive
          onChange={(event, value: ACDeviceMode) => {
            handleStateChange({ operational_mode: value });
          }}
        >
          <TooltipToggleButton
            TooltipProps={{ title: "Auto" }}
            value={ACDeviceMode.AUTO}
          >
            <AutoModeIcon />
          </TooltipToggleButton>

          <TooltipToggleButton
            TooltipProps={{ title: "Cool" }}
            value={ACDeviceMode.COOL}
          >
            <AcUnitIcon />
          </TooltipToggleButton>
          <TooltipToggleButton
            TooltipProps={{ title: "Dry" }}
            value={ACDeviceMode.DRY}
          >
            <DryIcon />
          </TooltipToggleButton>
          <TooltipToggleButton
            TooltipProps={{ title: "Heat" }}
            value={ACDeviceMode.HEAT}
          >
            <WbSunnyIcon />
          </TooltipToggleButton>
          <TooltipToggleButton
            TooltipProps={{ title: "Fan" }}
            value={ACDeviceMode.FAN}
          >
            <AirIcon />
          </TooltipToggleButton>
        </ToggleButtonGroup>
      </Grid>
      <Grid item>
        <ToggleButtonGroup
          value={props.deviceState.fan_speed}
          exclusive
          onChange={(event, value: ACDeviceFanSpeed) => {
            handleStateChange({ fan_speed: value });
          }}
        >
          <TooltipToggleButton
            TooltipProps={{ title: "Auto" }}
            value={ACDeviceFanSpeed.AUTO}
          >
            Auto
          </TooltipToggleButton>
          <TooltipToggleButton
            TooltipProps={{ title: "Silent" }}
            value={ACDeviceFanSpeed.SILENT}
          >
            S
          </TooltipToggleButton>
          <TooltipToggleButton
            TooltipProps={{ title: "Low" }}
            value={ACDeviceFanSpeed.LOW}
          >
            L
          </TooltipToggleButton>
          <TooltipToggleButton
            TooltipProps={{ title: "Medium" }}
            value={ACDeviceFanSpeed.MEDIUM}
          >
            M
          </TooltipToggleButton>
          <TooltipToggleButton
            TooltipProps={{ title: "High" }}
            value={ACDeviceFanSpeed.HIGH}
          >
            H
          </TooltipToggleButton>
        </ToggleButtonGroup>
      </Grid>
      <Grid item>
        <ToggleButtonGroup
          value={
            props.deviceState.eco_mode
              ? "eco"
              : props.deviceState.turbo_mode
              ? "turbo"
              : "none"
          }
          exclusive
          onChange={(event, value: "eco" | "turbo") => {
            handleStateChange({
              eco_mode: value === "eco",
              turbo_mode: value === "turbo",
            });
          }}
        >
          <TooltipToggleButton TooltipProps={{ title: "Eco" }} value="eco">
            <EnergySavingsLeafIcon />
          </TooltipToggleButton>
          <TooltipToggleButton TooltipProps={{ title: "Turbo" }} value="turbo">
            <ElectricBoltIcon />
          </TooltipToggleButton>
        </ToggleButtonGroup>
      </Grid>
      <Grid item>
        <TooltipToggleButton
          value="check"
          TooltipProps={{ title: "Display On" }}
          selected={props.deviceState.display_on}
          onChange={(event, value) => {
            handleStateChange({
              display_on: !props.deviceState.display_on,
            });
          }}
        >
          {props.deviceState.display_on ? (
            <LightbulbIcon />
          ) : (
            <LightbulbOutlinedIcon />
          )}
        </TooltipToggleButton>
      </Grid>
      <Grid item>
        <Tooltip title={`Power ${props.deviceState.power ? "off" : "on"}`}>
          <IconButton
            color={props.deviceState.power ? "success" : "error"}
            onClick={() =>
              handleStateChange({
                power: !props.deviceState.power,
                display_on: props.deviceState.power
                  ? props.deviceState.display_on
                  : true,
              })
            }
          >
            <PowerSettingsNewIcon />
          </IconButton>
        </Tooltip>
      </Grid>
    </Grid>
  );
};
