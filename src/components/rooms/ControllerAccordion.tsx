import AcUnitIcon from "@mui/icons-material/AcUnit";
import AirIcon from "@mui/icons-material/Air";
import AutoModeIcon from "@mui/icons-material/AutoMode";
import DryIcon from "@mui/icons-material/Dry";
import ElectricBoltIcon from "@mui/icons-material/ElectricBolt";
import EnergySavingsLeafIcon from "@mui/icons-material/EnergySavingsLeaf";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Card,
  CardActionArea,
  CardContent,
  Divider,
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
import React, { forwardRef, useEffect, useState } from "react";
import { useACDeviceState, useEditACDeviceState } from "../../api/aircon";
import {
  useBroadlinkActionsByIds,
  useBroadlinkDevice,
  usePlaybackBroadlinkAction,
} from "../../api/broadlink";
import { useEditRoomState, useHueRoomState } from "../../api/hue";
import {
  ACDeviceFanSpeed,
  ACDeviceMode,
  ACDeviceStateBase,
  ACDeviceStatePatch,
} from "../../api/schemas/aircon";
import { HueRoomSceneStatus, HueRoomStatePatch } from "../../api/schemas/hue";
import {
  ControlType,
  ControllerAC,
  ControllerBroadlink,
  ControllerHueRoom,
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

interface ControllerAccordionBroadlinkProps {
  controller: ControllerBroadlink;
}

const ControllerAccordionBroadlink = (
  props: ControllerAccordionBroadlinkProps
) => {
  const deviceQuery = useBroadlinkDevice(props.controller.id);
  const actionsQueries = useBroadlinkActionsByIds(props.controller.actions);

  const playbackMutation = usePlaybackBroadlinkAction(props.controller.id);

  return deviceQuery.isLoading ||
    deviceQuery.data === undefined ||
    actionsQueries.some(
      (actionQuery) => actionQuery.isLoading || actionQuery.data === undefined
    ) ? (
    <LinearProgress />
  ) : (
    <Accordion elevation={2}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        Broadlink - {deviceQuery.data.name}
      </AccordionSummary>
      <AccordionDetails>
        {actionsQueries.map((actionQuery) => (
          <Card
            key={actionQuery.data?.id}
            sx={{
              display: "flex",
              paddingX: 1,
              paddingY: 0.5,
              alignItems: "center",
            }}
          >
            <Typography>{actionQuery.data?.name}</Typography>
            <IconButton
              sx={{ marginLeft: "auto" }}
              onClick={() =>
                playbackMutation.mutate({
                  action_id: actionQuery.data?.id || "",
                })
              }
            >
              <PlayArrowIcon color="success" />
            </IconButton>
          </Card>
        ))}
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

  // Mutations
  const roomStateMutation = useEditRoomState(
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

  const [sliderValue, setSliderValue] = useState<number | null>(null);
  useEffect(() => {
    if (!roomStateQuery.isLoading && roomStateQuery.data !== undefined) {
      setSliderValue(roomStateQuery.data.grouped_light.brightness);
    }
  }, [roomStateQuery.data, roomStateQuery.isLoading]);

  const handleStateChange = (patchData: HueRoomStatePatch) => {
    roomStateMutation.mutate(patchData);
  };

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
        {roomStateQuery.data.grouped_light.on !== null && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography>Power: </Typography>
            <Switch
              sx={{ marginLeft: "auto" }}
              checked={roomStateQuery.data.grouped_light.on}
              onClick={(event) => event.stopPropagation()}
              onChange={(event) => {
                handleStateChange({
                  grouped_light: { on: event.target.checked },
                });
              }}
            />
          </Box>
        )}
        {sliderValue !== null && (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography>Brightness:</Typography>
            <Slider
              min={0}
              max={100}
              step={1}
              valueLabelDisplay="auto"
              value={Math.round(sliderValue)}
              sx={{ marginLeft: 2 }}
              onChange={(event, value) =>
                setSliderValue(Array.isArray(value) ? value[0] : value)
              }
              componentsProps={{
                track: { onClick: (event) => event.preventDefault() },
              }}
              onChangeCommitted={(event, value) => {
                handleStateChange({
                  grouped_light: {
                    brightness: Array.isArray(value) ? value[0] : value,
                  },
                });
              }}
            />
          </Box>
        )}
        <Divider sx={{ my: 1 }} />
        <Grid container spacing={1}>
          {Object.keys(roomStateQuery.data.scenes).map((sceneId) => {
            const scene = roomStateQuery.data.scenes[sceneId];

            return (
              <Grid item key={sceneId} xs={4}>
                <Card>
                  <CardActionArea
                    onClick={() => handleStateChange({ scene: sceneId })}
                  >
                    <CardContent
                      sx={{
                        textAlign: "center",
                        backgroundColor:
                          scene.status !== HueRoomSceneStatus.INACTIVE
                            ? "success.main"
                            : undefined,
                        color:
                          scene.status !== HueRoomSceneStatus.INACTIVE
                            ? "success.contrastText"
                            : undefined,
                      }}
                    >
                      <Typography>{scene.name}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
        <Divider sx={{ my: 1 }} />
        <FormGroup>
          {Object.keys(roomStateQuery.data.lights).map((lightId) => {
            const light = roomStateQuery.data.lights[lightId];
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
                key={lightId}
                label={light.name}
                control={
                  <Switch
                    checked={light.on}
                    onChange={(event) => {
                      handleStateChange({
                        lights: { [lightId]: { on: event.target.checked } },
                      });
                    }}
                  />
                }
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
      return (
        <ControllerAccordionBroadlink
          key={`${controller.control_type}-${
            controller.id
          }-${controller.actions.join("-")}`}
          controller={controller}
        />
      );
    case ControlType.HUE_ROOM:
      return (
        <ControllerAccordionHueRoom
          key={`${controller.control_type}-${controller.bridge_id}-${controller.id}`}
          controller={controller}
        />
      );
  }
};
