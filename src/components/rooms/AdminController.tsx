import { ControlType, RoomController } from "../../api/schemas/rooms";
import { AdminControllerAC } from "./AdminControllerAC";
import { AdminControllerBroadlink } from "./AdminControllerBroadlink";
import { AdminControllerHueRoom } from "./AdminControllerHueRoom";

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
