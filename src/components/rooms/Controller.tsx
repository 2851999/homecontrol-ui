import AcUnitIcon from "@mui/icons-material/AcUnit";
import AirIcon from "@mui/icons-material/Air";
import AutoModeIcon from "@mui/icons-material/AutoMode";
import DryIcon from "@mui/icons-material/Dry";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Grid,
  LinearProgress,
  Slider,
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonProps,
  Tooltip,
  TooltipProps,
  Typography,
} from "@mui/material";
import React, { forwardRef } from "react";
import { useACDeviceState } from "../../api/aircon";
import { ACDeviceFanSpeed, ACDeviceMode } from "../../api/schemas/aircon";
import {
  ControlType,
  ControllerAC,
  RoomController,
} from "../../api/schemas/rooms";

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

interface ControllerACProps {
  controller: ControllerAC;
}

const ControllerAC = (props: ControllerACProps) => {
  // Current device state
  const deviceStateQuery = useACDeviceState(props.controller.id);

  const backgroundColor = deviceStateQuery.data?.power
    ? "success.main"
    : undefined;
  const textColour = deviceStateQuery.data?.power
    ? "success.contrastText"
    : "text.primary";

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
            />
          </Grid>
          <Grid item>
            <ToggleButtonGroup value={deviceStateQuery.data.operational_mode}>
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
            <ToggleButtonGroup value={deviceStateQuery.data.fan_speed}>
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
                TooltipProps={{ title: "H" }}
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
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};

export interface ControllerProps {
  controller: RoomController;
}

export const Controller = (props: ControllerProps) => {
  const { controller } = props;

  switch (controller.control_type) {
    case ControlType.AC:
      return (
        <ControllerAC
          key={`${controller.control_type}-${controller.id}`}
          controller={controller}
        />
      );
    case ControlType.BROADLINK:
      return null;
    case ControlType.HUE_ROOM:
      return null;
  }
};
