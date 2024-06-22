import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  IconButton,
  Typography,
} from "@mui/material";
import { useDeleteRoomAction, useRoomActions } from "../../api/actions";
import { Room } from "../../api/schemas/rooms";
import { CircularLoadingIndicator } from "../CircularLoadingIndicator";
import { ICONS } from "./Actions";
import { RoomActionDialog } from "./RoomActionDialog";
import EditIcon from "@mui/icons-material/Edit";

interface AdminRoomActionsAccordionProps {
  room: Room;
}

export const AdminRoomActionsAccordion = (
  props: AdminRoomActionsAccordionProps
) => {
  // Obtain all the registered actions for this room
  const actionsQuery = useRoomActions(props.room.id);

  // Mutations
  const actionDeleteMutation = useDeleteRoomAction();

  const handleDeleteClicked = async (actionId: string) => {
    await actionDeleteMutation.mutate(actionId);
  };

  return (
    <Accordion elevation={2}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        Room Actions
      </AccordionSummary>
      <AccordionDetails>
        {actionsQuery.isLoading || actionsQuery.data === undefined ? (
          <CircularLoadingIndicator />
        ) : (
          <>
            <RoomActionDialog
              renderButton={(onClick) => (
                <Button startIcon={<AddIcon />} onClick={onClick}>
                  Add action
                </Button>
              )}
              room={props.room}
            />
            {actionsQuery.data.map((action) => (
              <Card
                key={action.id}
                sx={{
                  display: "flex",
                  paddingX: 1,
                  paddingY: 0.5,
                  alignItems: "center",
                  marginY: 0.5,
                }}
              >
                {ICONS[action.icon]}
                <Typography sx={{ marginLeft: 0.5 }}>{action.name}</Typography>
                <RoomActionDialog
                  renderButton={(onClick) => (
                    <IconButton sx={{ marginLeft: "auto" }} onClick={onClick}>
                      <EditIcon />
                    </IconButton>
                  )}
                  room={props.room}
                  existingData={action}
                />
                <IconButton onClick={() => handleDeleteClicked(action.id)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </Card>
            ))}
          </>
        )}
      </AccordionDetails>
    </Accordion>
  );
};
