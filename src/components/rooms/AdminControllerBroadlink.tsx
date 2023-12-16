import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  LinearProgress,
  Typography,
} from "@mui/material";
import { useBroadlinkDevice } from "../../api/broadlink";
import { ControllerBroadlink } from "../../api/schemas/rooms";

export interface AdminControllerBroadlinkProps {
  controller: ControllerBroadlink;
}

export const AdminControllerBroadlink = (
  props: AdminControllerBroadlinkProps
) => {
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
