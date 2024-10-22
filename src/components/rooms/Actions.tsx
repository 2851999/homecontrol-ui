import BedIcon from "@mui/icons-material/Bed";
import ChairIcon from "@mui/icons-material/Chair";
import TvIcon from "@mui/icons-material/Tv";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import LightModeIcon from "@mui/icons-material/LightMode";
import CelebrationIcon from "@mui/icons-material/Celebration";
import { JSX } from "react";

export const ICONS: { [key: string]: JSX.Element } = {
  bed: <BedIcon />,
  night_time: <BedtimeIcon />,
  daytime: <LightModeIcon />,
  chair: <ChairIcon />,
  tv: <TvIcon />,
  celebration: <CelebrationIcon />,
};
