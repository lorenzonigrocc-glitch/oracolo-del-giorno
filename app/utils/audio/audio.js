import { useEffect, useRef, useCallback } from "react";
import { Howl } from "howler";

function useSoundControl(src, volume = 1) {
    const soundRef = useRef(null);

    useEffect(() => {
        if (!src) return;

        soundRef.current = new Howl({
            src: [src],
            volume: volume,
        });

        return () => {
            soundRef.current?.unload();
        };
    }, [src, volume]);

    const play = useCallback(() => {
        soundRef.current?.play();
    }, []);

    return play;
}

// funzione per creare un suono di background

export function useBackgroundSound() {
    const soundRef = useRef(null);
    const isStart = true;

    useEffect(() => {
        soundRef.current = new Howl({
            src: "/AMBTech_Machine_Room_Background_Loop_15.wav",
            loop: true,
            volume: 0.5,
        });

        if (isStart) soundRef.current.play();

        return () => {
            soundRef.current?.stop();
            soundRef.current?.unload();
        };
    }, [isStart]);
}

// Suoni singoli da duplicare

export const useHoverSound = () => useSoundControl('/UIBeep_Tiny_Beep_02.wav');

export const useClickSound = () => useSoundControl('/UIBeep_Tiny_Beep_21.wav');

