import AcUnitIcon from "@mui/icons-material/AcUnit";
import AirIcon from "@mui/icons-material/Air";
import AutoModeIcon from "@mui/icons-material/AutoMode";
import DryIcon from "@mui/icons-material/Dry";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  LinearProgress,
  Slider,
  Switch,
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonProps,
  Tooltip,
  TooltipProps,
  Typography,
  useTheme,
} from "@mui/material";
import React, { forwardRef } from "react";
import { useACDeviceState, useEditACDeviceState } from "../../api/aircon";
import {
  ACDeviceFanSpeed,
  ACDeviceMode,
  ACDeviceStateBase,
  ACDeviceStatePatch,
} from "../../api/schemas/aircon";
import {
  ControlType,
  ControllerAC,
  ControllerHueRoom,
  RoomController,
} from "../../api/schemas/rooms";
import { useHueRoomState } from "../../api/hue";

type TooltipToggleButtonProps = ToggleButtonProps & {
  TooltipProps: Omit<TooltipProps, "children">;
};

// eslint-disable-next-line react/display-name
const TooltipToggleButton: React.FC<TooltipToggleButtonProps> = forwardRef(
  ({ TooltipProps, ...props }, ref) => {
    return (
      <Tooltip {...TooltipProps}>
        <ToggleButton ref={ref} {...props} />
      </Tooltip>
    );
  }
);

export default TooltipToggleButton;

interface ControllerAccordionACProps {
  controller: ControllerAC;
}

const ControllerAccordionAC = (props: ControllerAccordionACProps) => {
  // Current device state
  const deviceStateQuery = useACDeviceState(props.controller.id);

  // Mutations
  const deviceStateMutation = useEditACDeviceState(props.controller.id);

  const backgroundColor = deviceStateQuery.data?.power
    ? "success.main"
    : undefined;
  const textColour = deviceStateQuery.data?.power
    ? "success.contrastText"
    : "text.primary";

  const handleStateChange = (newData: ACDeviceStatePatch) => {
    deviceStateMutation.mutate({
      ...(deviceStateQuery.data as ACDeviceStateBase),
      ...newData,
      prompt_tone: false,
    });
  };

  return deviceStateQuery.isLoading || deviceStateQuery.data === undefined ? (
    <LinearProgress />
  ) : (
    <Accordion elevation={2}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: textColour }} />}
        sx={{
          backgroundColor: backgroundColor,
        }}
      >
        <Typography color={textColour}>Air Conditioning</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container direction="column" alignItems="center" spacing={2}>
          <Grid item>
            <Typography variant="h6">
              {deviceStateQuery.data.target_temperature}&deg;C
            </Typography>
          </Grid>
          <Grid item width="100%">
            <Slider
              min={16}
              max={30}
              step={1}
              defaultValue={deviceStateQuery.data.target_temperature}
              marks
              valueLabelDisplay="auto"
              onChangeCommitted={(event, value) =>
                handleStateChange({
                  target_temperature: Array.isArray(value) ? value[0] : value,
                })
              }
            />
          </Grid>
          <Grid item>
            <ToggleButtonGroup
              value={deviceStateQuery.data.operational_mode}
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
              value={deviceStateQuery.data.fan_speed}
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
                deviceStateQuery.data.eco_mode
                  ? "eco"
                  : deviceStateQuery.data.turbo_mode
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
              <TooltipToggleButton
                TooltipProps={{ title: "Turbo" }}
                value="turbo"
              >
                <ElectricBoltIcon />
              </TooltipToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid item>
            <Tooltip
              title={`Power ${deviceStateQuery.data.power ? "off" : "on"}`}
            >
              <IconButton
                color={deviceStateQuery.data.power ? "success" : "error"}
                onClick={() =>
                  handleStateChange({ power: !deviceStateQuery.data.power })
                }
              >
                <PowerSettingsNewIcon />
              </IconButton>
            </Tooltip>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

interface ControllerAccordionHueRoomProps {
  controller: ControllerHueRoom;
}

const ControllerAccordionHueRoom = (props: ControllerAccordionHueRoomProps) => {
  // Current room state
  const roomStateQuery = useHueRoomState(
    props.controller.bridge_id,
    props.controller.id
  );

  const backgroundColor = roomStateQuery.data?.grouped_light.on
    ? "success.main"
    : undefined;
  const textColour = roomStateQuery.data?.grouped_light.on
    ? "success.contrastText"
    : "text.primary";

  const theme = useTheme();

  return roomStateQuery.isLoading || roomStateQuery.data === undefined ? (
    <LinearProgress />
  ) : (
    <Accordion elevation={2}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon sx={{ color: textColour }} />}
        sx={{
          backgroundColor: backgroundColor,
        }}
      >
        <Typography color={textColour}>Lighting</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <FormGroup>
          {Object.keys(roomStateQuery.data.lights).map((key) => {
            const light = roomStateQuery.data.lights[key];
            const lightColour =
              light.colour !== null
                ? `rgb(${light.colour.r * 255}, ${light.colour.g * 255}, ${
                    light.colour.b * 255
                  })`
                : "rgb(255, 206.27926686508354, 118.91753298906583)";
            const lightThemeColour = theme.palette.augmentColor({
              color: { main: lightColour },
            });
            return (
              <FormControlLabel
                key={key}
                label={light.name}
                control={<Switch checked={light.on} />}
                sx={{
                  backgroundColor: light.on
                    ? lightThemeColour?.main
                    : undefined,
                  color: light.on ? lightThemeColour?.contrastText : undefined,
                }}
              />
            );
          })}
        </FormGroup>
      </AccordionDetails>
    </Accordion>
  );
};

export interface ControllerAccordionProps {
  controller: RoomController;
}

export const ControllerAccordion = (props: ControllerAccordionProps) => {
  const { controller } = props;

  switch (controller.control_type) {
    case ControlType.AC:
      return (
        <ControllerAccordionAC
          key={`${controller.control_type}-${controller.id}`}
          controller={controller}
        />
      );
    case ControlType.BROADLINK:
      return null;
    case ControlType.HUE_ROOM:
      return (
        <ControllerAccordionHueRoom
          key={`${controller.control_type}-${controller.bridge_id}-${controller.id}`}
          controller={controller}
        />
      );
  }
};
