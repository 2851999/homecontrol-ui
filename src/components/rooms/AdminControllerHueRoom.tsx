import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  LinearProgress,
  Typography,
} from "@mui/material";
import { useHueBridge } from "../../api/hue";
import { ControllerHueRoom } from "../../api/schemas/rooms";

export interface AdminControllerHueRoomProps {
  controller: ControllerHueRoom;
}

export const AdminControllerHueRoom = (props: AdminControllerHueRoomProps) => {
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
