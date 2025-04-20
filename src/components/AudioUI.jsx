import React, { useEffect, useRef, useState } from "react";
import { PlayIcon, PauseIcon } from "lucide-react";
import WaveSurfer from "wavesurfer.js";

const AudioUI = ({ name, file = null, audioUrl = null }) => {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayback = () => {
    if (!wavesurfer.current) return;

    wavesurfer.current.playPause();
    setIsPlaying(wavesurfer.current.isPlaying());
  };

  useEffect(() => {
    let audioSrc = null;
    if (wavesurfer.current) {
      wavesurfer.current.destroy();
      wavesurfer.current = null;
    }

    if (file instanceof Blob) {
      audioSrc = URL.createObjectURL(file);
    } else if (audioUrl) {
      audioSrc = audioUrl;
    } else {
      return;
    }

    console.log(audioSrc);

    if (!waveformRef.current || !audioSrc) return;

    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#ccc",
      progressColor: "#6366f1",
      height: 80,
      responsive: true,
      barWidth: 2,
      cursorWidth: 1,
    });

    wavesurfer.current.load(audioSrc);

    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
        wavesurfer.current = null;
      }
      if (file instanceof Blob && audioSrc) {
        URL.revokeObjectURL(audioSrc);
      }
    };
  }, [file, audioUrl]);

  return (
    <>
      <div ref={waveformRef} className="w-full mb-4" />
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={togglePlayback}
          className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition"
        >
          {isPlaying ? <PauseIcon size={20} /> : <PlayIcon size={20} />}
        </button>
        <div className="text-sm text-gray-500 px-2">{name}</div>
      </div>
    </>
  );
};

export default AudioUI;
