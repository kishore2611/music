import React, { useEffect, useRef, useState } from 'react';
import { OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import { Midi } from '@tonejs/midi'; 
import * as Tone from 'tone';

const MusicPlayer = () => {
  const osmdRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [tempo, setTempo] = useState(120);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initialize OpenSheetMusicDisplay
    osmdRef.current = new OpenSheetMusicDisplay('osmdContainer');

    // Load your MusicXML file
    osmdRef.current.load('/assets/files/music.musicxml')
      .then(() => {
        console.log("MusicXML file loaded successfully.");
        osmdRef.current.render();
        setIsLoaded(true);
      })
      .catch((error) => {
        console.error("Error loading MusicXML file:", error);
        setIsLoaded(false);
      });

    return () => {
      if (osmdRef.current) {
        if (typeof osmdRef.current.dispose === 'function') {
          osmdRef.current.dispose();
        }
        osmdRef.current = null;
      }
    };
  }, []);

  const handlePlayPause = () => {
    if (isPlaying) {
      Tone.Transport.pause();
      setIsPlaying(false);
    } else {
      // Here, you'll need a MIDI array to play notes
      // For example, generate a MIDI track manually
      const midi = new Midi();
      const track = midi.addTrack();

      // Example: Add some notes to the track
      track.addNote({
        midi: 60, // C4
        time: 0,
        duration: 1,
      });
      track.addNote({
        midi: 62, // D4
        time: 1,
        duration: 1,
      });

      const synth = new Tone.Synth().toDestination();
      
      // Play the MIDI notes
      track.notes.forEach((note) => {
        synth.triggerAttackRelease(note.name, note.duration, note.time + Tone.now());
      });

      Tone.Transport.bpm.value = tempo;
      Tone.Transport.start();
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    setVolume(newVolume);
    Tone.getDestination().volume.value = newVolume * 100; // Tone volume is in decibels
  };

  const handleTempoChange = (event) => {
    const newTempo = event.target.value;
    setTempo(newTempo);
    Tone.Transport.bpm.value = newTempo;
  };

  return (
    <div>
      <div>
        <button onClick={handlePlayPause} disabled={!isLoaded}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <label>
          Volume:
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            disabled={!isLoaded}
          />
        </label>
        <label>
          Tempo:
          <input
            type="number"
            value={tempo}
            onChange={handleTempoChange}
            disabled={!isLoaded}
          />
        </label>
      </div>
      <div id="osmdContainer" style={{ width: '100%', height: 'auto' }} />
    </div>
  );
};

export default MusicPlayer;
