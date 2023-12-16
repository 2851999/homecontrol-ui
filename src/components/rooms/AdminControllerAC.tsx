import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  LinearProgress,
  Typography,
} from "@mui/material";
import { useACDevice } from "../../api/aircon";
import { ControllerAC } from "../../api/schemas/rooms";

export interface AdminControllerACProps {
  controller: ControllerAC;
}

export const AdminControllerAC = (props: AdminControllerACProps) => {
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
