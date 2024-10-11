import { useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import aws from 'aws-sdk';
// import Please from "pleasejs";

import { WaveSurfer, WaveForm, Region } from "wavesurfer-react";
import RegionsPlugin from "wavesurfer.js/dist/plugin/wavesurfer.regions.min";

const factor = 40 / 685;

export default function AudioTrack(props) {
  const containerRef = useRef(null);

  const [audioUrl] = useSelector((state) => [
    state.audio_url,
  ]);

  const [volume, setVolume] = useState(40);
  // const [playPosition, setPlayPosition] = useState(0);
  // const [average, setAverage] = useState(0);
  // const [duration, setDuration] = useState(0);
  // const [songName, setSongName] = useState("");
  // const [loopingEnabled, setLoopingEnabled] = useState(true);

  // const soundFileRef = useRef(null);
  // const [soundFileLoaded, setSoundFileLoaded] = useState(false);

  // const handleShiftKeyMemo = useCallback((e) => {
  //   setDraggingDisabled(e.shiftKey);
  // }, []);

  const plugins = useMemo(() => {
    return [
      {
        plugin: RegionsPlugin,
        options: { dragSelection: false }
      }
    ].filter(Boolean);
  }, []);

  const [regions, setRegions] = useState([
    {
      id: "region-1",
      start: 0.5,
      end: 10,
      color: "rgba(0, 0, 0, 0)",
      data: {
        systemRegionId: 31
      },
      drag: false,
      resize: false,
      loop: true
    },
    {
      id: "region-2",
      start: 5,
      end: 25,
      color: "rgba(225, 195, 100, 0)",
      data: {
        systemRegionId: 32
      },
      drag: false,
      resize: false,
      loop: true
    }
  ]);

  const regionsRef = useRef(regions);

  useEffect(() => {
    regionsRef.current = regions;
  }, [regions]);

  const regionCreatedHandler = useCallback(
    (region) => {
      if (region.data.systemRegionId) return;

      setRegions([
        ...regionsRef.current,
        { ...region, data: { ...region.data, systemRegionId: -1 } }
      ]);
    },
    [regionsRef]
  );

  const wavesurferRef = useRef();
  const handleWSMount = useCallback(
    (waveSurfer) => {
      wavesurferRef.current = waveSurfer;
      if (wavesurferRef.current) {

        wavesurferRef.current.on("region-created", regionCreatedHandler);

        wavesurferRef.current.on("ready", () => {
          wavesurferRef.current.toggleInteraction();
          wavesurferRef.current.setVolume(volume / 100);
          //wavesurferRef.current.setPlaybackRate(0.75);

          setDuration(wavesurferRef.current.getDuration());

          setPlayPosition(0);
        });

        wavesurferRef.current.on("seek", () => {
          setPlayPosition(wavesurferRef.current.getCurrentTime());
        });

        wavesurferRef.current.on("audioprocess", () => {
          setPlayPosition(wavesurferRef.current.getCurrentTime());
        });

        wavesurferRef.current.on("region-removed", (region) => {
          //console.log("region-removed --> ", region);
        });

        wavesurferRef.current.on("loading", (data) => {
          //console.log("loading --> ", data);
        });

        if (window) {
          window.surferidze = wavesurferRef.current;
        }
      }
    },
    [regionCreatedHandler]
  );

  // useEffect(() => {
  //   window.addEventListener("keydown", handleShiftKeyMemo, true);
  //   window.addEventListener("keyup", handleShiftKeyMemo, true);

  //   return () => {
  //     window.removeEventListener("keydown", handleShiftKeyMemo);
  //     window.removeEventListener("keyup", handleShiftKeyMemo);
  //   };
  // }, [handleShiftKeyMemo]);

  useEffect(() => {
    if (wavesurferRef.current) wavesurferRef.current.setVolume(volume / 100);
  }, [volume]);

  // useEffect(() => {
  //   fetch(audioUrl)
  //     .then(res => res.blob())
  //     .then(blob => {
  //       wavesurferRef.current.loadBlob(blob);
  //   });
  // }, [])

  useEffect(() => {
    fetch(audioUrl)
      .then(res => res.blob())
      .then(blob => {
        wavesurferRef.current.loadBlob(blob);
    });
  }, [props.scale, audioUrl])

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: `${100*props.scale/5}%`,
        height: "20px",
        background: "#13ab71"
      }}
    >
      <WaveSurfer plugins={plugins} onMount={handleWSMount}>
        <WaveForm
          id="waveform"
          height={20}
          waveColor="#013d16"
          progressColor="#013d16"
          responsive={true}
        >
        </WaveForm>
      </WaveSurfer>
    </div>
  );
}

