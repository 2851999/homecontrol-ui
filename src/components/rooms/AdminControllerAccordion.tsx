import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import { useACDevice } from "../../api/aircon";
import {
  useBroadlinkActionsByIds,
  useBroadlinkDevice,
} from "../../api/broadlink";
import { useHueBridge, useHueRoom } from "../../api/hue";
import {
  ControlType,
  ControllerAC,
  ControllerBroadlink,
  ControllerHueRoom,
  RoomController,
} from "../../api/schemas/rooms";
import React from "react";

interface AdminControllerPropertyProps {
  label: string;
  children: React.ReactNode;
}

const AdminControllerProperty = (props: AdminControllerPropertyProps) => {
  return (
    <Grid container>
      <Grid item>
        <Typography>{props.label}:</Typography>
      </Grid>
      <Grid item>
        <Typography color="text.secondary" sx={{ pl: 1 }}>
          {props.children}
        </Typography>
      </Grid>
    </Grid>
  );
};

interface AdminControllerAccordionACProps {
  controller: ControllerAC;
}

const AdminControllerAccordionAC = (props: AdminControllerAccordionACProps) => {
  const deviceQuery = useACDevice(props.controller.id);
  return deviceQuery.isLoading || deviceQuery.data === undefined ? (
    <LinearProgress />
  ) : (
    <Accordion elevation={2}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        Air Conditioning - {deviceQuery.data.name}
      </AccordionSummary>
      <AccordionDetails>
        <AdminControllerProperty label="ID">
          {deviceQuery.data.id}
        </AdminControllerProperty>
        <AdminControllerProperty label="Name">
          {deviceQuery.data.name}
        </AdminControllerProperty>
      </AccordionDetails>
    </Accordion>
  );
};

interface AdminControllerAccordionBroadlinkProps {
  controller: ControllerBroadlink;
}

const AdminControllerAccordionBroadlink = (
  props: AdminControllerAccordionBroadlinkProps
) => {
  const deviceQuery = useBroadlinkDevice(props.controller.id);
  const actionsQueries = useBroadlinkActionsByIds(props.controller.actions);

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
        <AdminControllerProperty label="ID">
          {deviceQuery.data.id}
        </AdminControllerProperty>
        <AdminControllerProperty label="Name">
          {deviceQuery.data.name}
        </AdminControllerProperty>
        <Typography variant="h5" sx={{ paddingTop: 2 }}>
          Actions
        </Typography>
        <List disablePadding>
          {actionsQueries.map((actionQuery) => (
            <ListItem key={actionQuery.data?.id} disableGutters disablePadding>
              <ListItemText
                primary={actionQuery.data?.name}
                secondary={actionQuery.data?.id}
              />
            </ListItem>
          ))}
        </List>
      </AccordionDetails>
    </Accordion>
  );
};

interface AdminControllerAccordionHueRoomProps {
  controller: ControllerHueRoom;
}

const AdminControllerAccordionHueRoom = (
  props: AdminControllerAccordionHueRoomProps
) => {
  const bridgeQuery = useHueBridge(props.controller.bridge_id);
  const roomQuery = useHueRoom(props.controller.bridge_id, props.controller.id);

  return bridgeQuery.isLoading ||
    roomQuery.isLoading ||
    bridgeQuery.data === undefined ||
    roomQuery.data === undefined ? (
    <LinearProgress />
  ) : (
    <Accordion elevation={2}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        Hue Room - {roomQuery.data.name}
      </AccordionSummary>
      <AccordionDetails>
        <AdminControllerProperty label="ID">
          {props.controller.id}
        </AdminControllerProperty>
        <AdminControllerProperty label="Bridge ID">
          {bridgeQuery.data.id}
        </AdminControllerProperty>
        <AdminControllerProperty label="Bridge Name">
          {bridgeQuery.data.name}
        </AdminControllerProperty>
        <AdminControllerProperty label="Room ID">
          {roomQuery.data.id}
        </AdminControllerProperty>
        <AdminControllerProperty label="Room Name">
          {roomQuery.data.name}
        </AdminControllerProperty>
      </AccordionDetails>
    </Accordion>
  );
};

export interface AdminControllerAccordionProps {
  controller: RoomController;
}

export const AdminControllerAccordion = (
  props: AdminControllerAccordionProps
) => {
  const { controller } = props;

  switch (controller.control_type) {
    case ControlType.AC:
      return (
        <AdminControllerAccordionAC
          key={`${controller.control_type}-${controller.id}`}
          controller={controller}
        />
      );
    case ControlType.BROADLINK:
      return (
        <AdminControllerAccordionBroadlink
          key={`${controller.control_type}-${controller.id}`}
          controller={controller}
        />
      );
    case ControlType.HUE_ROOM:
      return (
        <AdminControllerAccordionHueRoom
          key={`${controller.control_type}-${controller.id}-${controller.bridge_id}`}
          controller={controller}
        />
      );
  }
};
