import { Buffer } from 'buffer';
import process from 'process';
import { Readable, Writable } from 'stream-browserify';
import MusicPlayer from "./pages/musicPlayer";

// Set these globally if needed
window.Buffer = Buffer;
window.process = process;
window.Readable = Readable;
window.Writable = Writable;

function App() {
  return (
    <>
      <MusicPlayer />
    </>
  );
}

export default App;
