import { useState } from 'react';
import { motion } from 'framer-motion';
import FloatingHearts from '@/components/valentine/FloatingHearts';
import { useSound } from '@/hooks/useSound';

interface Song {
  id: string;
  title: string;
  artist: string;
  url?: string;
  lyrics?: string;
}

const MusicPlaylist = () => {
  const [playlist, setPlaylist] = useState<Song[]>(() => {
    const saved = localStorage.getItem('musicPlaylist');
    return saved ? JSON.parse(saved) : [];
  });
  const [newSong, setNewSong] = useState<Song>({ id: '', title: '', artist: '', url: '', lyrics: '' });
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const { playSound } = useSound();

  const presetSongs: Song[] = [
    { id: '1', title: 'Perfect', artist: 'Ed Sheeran', lyrics: 'I found a love for me...' },
    { id: '2', title: 'All of Me', artist: 'John Legend', lyrics: 'What would I do without your smart mouth...' },
    { id: '3', title: 'At Last', artist: 'Etta James', lyrics: 'At last, my love has come along...' },
  ];

  const addSong = () => {
    if (!newSong.title || !newSong.artist) {
      playSound('buttonClick');
      return;
    }

    const song: Song = {
      ...newSong,
      id: Date.now().toString(),
    };

    setPlaylist([...playlist, song]);
    localStorage.setItem('musicPlaylist', JSON.stringify([...playlist, song]));
    setNewSong({ id: '', title: '', artist: '', url: '', lyrics: '' });
    playSound('success');
  };

  const addPresetSong = (song: Song) => {
    setPlaylist([...playlist, song]);
    localStorage.setItem('musicPlaylist', JSON.stringify([...playlist, song]));
    playSound('sparkle');
  };

  const deleteSong = (id: string) => {
    const updated = playlist.filter((s) => s.id !== id);
    setPlaylist(updated);
    localStorage.setItem('musicPlaylist', JSON.stringify(updated));
    if (currentSong?.id === id) {
      setCurrentSong(null);
      setIsPlaying(false);
    }
    playSound('buttonClick');
  };

  const playSong = (song: Song) => {
    setCurrentSong(song);
    setIsPlaying(true);
    playSound('success');
    // In production, integrate with Spotify/Apple Music API
  };

  return (
    <div className="min-h-screen gradient-romantic relative">
      <FloatingHearts count={10} />
      
      <div className="container max-w-4xl mx-auto px-4 py-12">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl md:text-5xl font-heavy text-primary mb-4">
            Shared Music Playlist
          </h1>
          <p className="text-muted-foreground font-serif-italic">
            Create your romantic playlist together
          </p>
        </motion.div>

        {/* Add Song Form */}
        <motion.div
          className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-elevated mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-medium mb-4">Add Song</h2>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Song title..."
              value={newSong.title}
              onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
              className="px-4 py-2 rounded-lg border-2 border-primary/30 focus:border-primary focus:outline-none"
            />
            <input
              type="text"
              placeholder="Artist..."
              value={newSong.artist}
              onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
              className="px-4 py-2 rounded-lg border-2 border-primary/30 focus:border-primary focus:outline-none"
            />
          </div>
          <input
            type="url"
            placeholder="Song URL (optional)..."
            value={newSong.url}
            onChange={(e) => setNewSong({ ...newSong, url: e.target.value })}
            className="w-full px-4 py-2 mb-4 rounded-lg border-2 border-primary/30 focus:border-primary focus:outline-none"
          />
          <textarea
            placeholder="Lyrics (optional)..."
            value={newSong.lyrics}
            onChange={(e) => setNewSong({ ...newSong, lyrics: e.target.value })}
            className="w-full h-24 px-4 py-2 mb-4 rounded-lg border-2 border-primary/30 focus:border-primary focus:outline-none resize-none"
          />
          <button onClick={addSong} className="w-full btn-romantic py-3">
            Add to Playlist
          </button>
        </motion.div>

        {/* Preset Songs */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-medium mb-3">Quick Add:</h3>
          <div className="flex flex-wrap gap-2">
            {presetSongs.map((song) => (
              <button
                key={song.id}
                onClick={() => addPresetSong(song)}
                className="px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 text-sm"
              >
                {song.title} - {song.artist}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Playlist */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-medium mb-4">Your Playlist</h2>
          {playlist.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">
              Your playlist is empty. Add some songs to get started!
            </p>
          ) : (
            playlist.map((song, index) => (
              <motion.div
                key={song.id}
                className={`bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-elevated ${
                  currentSong?.id === song.id ? 'ring-2 ring-primary' : ''
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-muted-foreground w-8">{index + 1}</span>
                    <div className="flex-1">
                      <h3 className="font-medium">{song.title}</h3>
                      <p className="text-sm text-muted-foreground">{song.artist}</p>
                      {song.lyrics && currentSong?.id === song.id && (
                        <motion.p
                          className="text-sm text-muted-foreground mt-2 italic"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {song.lyrics}
                        </motion.p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => playSong(song)}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
                    >
                      {currentSong?.id === song.id && isPlaying ? 'Playing' : 'Play'}
                    </button>
                    <button
                      onClick={() => deleteSong(song.id)}
                      className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        <motion.p
          className="text-center text-muted-foreground mt-8 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          💡 Note: For full music integration, connect with Spotify or Apple Music API
        </motion.p>
      </div>
    </div>
  );
};

export default MusicPlaylist;
