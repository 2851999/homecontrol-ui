import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  LinearProgress,
  Typography,
} from "@mui/material";
import { useACDevice } from "../../api/aircon";
import { useBroadlinkDevice } from "../../api/broadlink";
import { useHueBridge } from "../../api/hue";
import {
  ControlType,
  ControllerAC,
  ControllerBroadlink,
  ControllerHueRoom,
  RoomController,
} from "../../api/schemas/rooms";

interface AdminControllerACProps {
  controller: ControllerAC;
}

const AdminControllerAC = (props: AdminControllerACProps) => {
  const deviceQuery = useACDevice(props.controller.id);
  return deviceQuery.isLoading || deviceQuery.data === undefined ? (
    <LinearProgress />
  ) : (
    <Accordion elevation={2}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        Air Conditioning - {deviceQuery.data.name}
      </AccordionSummary>
      <AccordionDetails>
        <Typography>ID: {deviceQuery.data.id}</Typography>
        <Typography>Name: {deviceQuery.data.name}</Typography>
      </AccordionDetails>
    </Accordion>
  );
};

interface AdminControllerBroadlinkProps {
  controller: ControllerBroadlink;
}

const AdminControllerBroadlink = (props: AdminControllerBroadlinkProps) => {
  const deviceQuery = useBroadlinkDevice(props.controller.id);
  return deviceQuery.isLoading || deviceQuery.data === undefined ? (
    <LinearProgress />
  ) : (
    <Accordion elevation={2}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        Broadlink - {deviceQuery.data.name}
      </AccordionSummary>
      <AccordionDetails>
        <Typography>ID: {deviceQuery.data.id}</Typography>
        <Typography>Name: {deviceQuery.data.name}</Typography>
      </AccordionDetails>
    </Accordion>
  );
};

interface AdminControllerHueRoomProps {
  controller: ControllerHueRoom;
}

const AdminControllerHueRoom = (props: AdminControllerHueRoomProps) => {
  const bridgeQuery = useHueBridge(props.controller.bridge_id);
  return bridgeQuery.isLoading || bridgeQuery.data === undefined ? (
    <LinearProgress />
  ) : (
    <Accordion elevation={2}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        Hue Room
      </AccordionSummary>
      <AccordionDetails>
        <Typography>ID: {props.controller.id}</Typography>
        <Typography>Bridge ID: {bridgeQuery.data.id}</Typography>
        <Typography>Bridge Name: {bridgeQuery.data.name}</Typography>
      </AccordionDetails>
    </Accordion>
  );
};

export interface AdminControllerProps {
  controller: RoomController;
}

export const AdminController = (props: AdminControllerProps) => {
  const { controller } = props;

  switch (controller.control_type) {
    case ControlType.AC:
      return (
        <AdminControllerAC
          key={`${controller.control_type}-${controller.id}`}
          controller={controller}
        />
      );
    case ControlType.BROADLINK:
      return (
        <AdminControllerBroadlink
          key={`${controller.control_type}-${controller.id}`}
          controller={controller}
        />
      );
    case ControlType.HUE_ROOM:
      return (
        <AdminControllerHueRoom
          key={`${controller.control_type}-${controller.id}-${controller.bridge_id}`}
          controller={controller}
        />
      );
  }
};
