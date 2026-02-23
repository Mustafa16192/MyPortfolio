import { useContext } from "react";
import { InteractionSoundContext } from "./InteractionSoundProvider";

export const useInteractionSound = () => useContext(InteractionSoundContext);

