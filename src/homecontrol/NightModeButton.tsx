import { IconButton } from '@mui/material';
import BedIcon from '@mui/icons-material/Bed';

import {
	ACState,
	getModeFromString,
	usePutDeviceState,
} from '../homecontrol/AirconAPI';

import {
	useFetchRooms,
	useFetchScenes,
	usePutScene,
} from '../homecontrol/HueAPI';

export const NightModeButton = (props: {
	name: string;
	state: ACState | undefined;
	quietMode: boolean;
}) => {
	const { name, state, quietMode } = props;

	const setDeviceStateMutation = usePutDeviceState(name);
	const setSceneMutation = usePutScene();

	const {
		data: rooms,
		isFetching: fetchingRooms,
		isError: errorRooms,
	} = useFetchRooms({ 'name[eq]': name });

	let room_id = undefined;
	if (rooms && rooms[0] != undefined) room_id = rooms[0].identifier;

	const {
		data: scenes,
		isFetching: fetchingScenes,
		isError: errorScenes,
	} = useFetchScenes(
		{ 'room[eq]': room_id || '', 'name[eq]': 'Night' },
		room_id != undefined,
	);

	const handleClick = () => {
		if (state) {
			state.power = true;
			state.mode = getModeFromString('cool');
			state.eco = false;
			state.turbo = false;
			state.target = 18;
			state.prompt_tone = !quietMode;
			setDeviceStateMutation.mutate(state);

			if (
				!fetchingRooms &&
				!errorRooms &&
				rooms &&
				!fetchingScenes &&
				!errorScenes &&
				scenes
			) {
				console.log(scenes);
				if (scenes.length > 0)
					// Assume first is right
					setSceneMutation.mutate(scenes[0].identifier);
			}
		}
	};

	return (
		<IconButton onClick={handleClick}>
			<BedIcon />
		</IconButton>
	);
};
