(function() {
   function SongPlayer($rootScope, Fixtures) {

     /**
     * @desc The current album object
     * @type {Object}
     */
      var currentAlbum = Fixtures.getAlbum();

      /**
      * @desc Song Player external interface
      * @type {Object}
      */
      var SongPlayer = {};

      /**
      * @function getSongIndex
      * @desc Get the index of the passed song
      * @param {Object} song
      */
      var getSongIndex = function(song) {
        return currentAlbum.songs.indexOf(song);
      };

      /**
      * @desc Buzz object audio file
      * @type {Object}
      */
      var currentBuzzObject = null;

     /**
     * @function setCurrentTime
     * @desc Set current time (in seconds) of currently playing song
     * @param {Number} time
     */
     SongPlayer.setCurrentTime = function(time) {
         if (currentBuzzObject) {
             currentBuzzObject.setTime(time);
         }
      };

      SongPlayer.currentSong = null;

      /**
      * @desc Current playback time (in seconds) of currently playing song
      * @type {Number}
      */
      SongPlayer.currentTime = null;

      /**
      * @desc Current volume
      * @type {Number}
      */
      SongPlayer.volume = 50;

      /**
      * @function setVolume
      * @desc Set volume level of current song
      * @param {Number} level
      */
      SongPlayer.setVolume = function(level) {
        SongPlayer.volume = level;
        if (currentBuzzObject) {
            currentBuzzObject.setVolume(level);
        }
      }

      /**
      * @function setSong
      * @desc Stops currently playing song and loads new audio file as currentBuzzObject
      * @param {Object} song
      */
      var setSong = function(song) {
        if (currentBuzzObject) {
          stopSong(SongPlayer.currentSong);
        }

        currentBuzzObject = new buzz.sound(song.audioUrl, {
          formats: ['mp3'],
          preload: true
        });

        currentBuzzObject.bind('timeupdate', function() {
          $rootScope.$apply(function() {
              SongPlayer.currentTime = currentBuzzObject.getTime();
          });
        });

        SongPlayer.currentSong = song;
      };

      /**
      * @function stopSong
      * @desc Stops the currently playing song
      * @param {Object} song
      */
      var stopSong = function(song) {
        currentBuzzObject.stop()
        song.playing = null;
      }

      /**
      * @function playSong
      * @desc Plays the current song
      * @param {Object} song
      */
      var playSong = function(song) {
        currentBuzzObject.play()
        song.playing = true;
      }

      /**
      * @function previous
      * @desc Publically accessible function to go to previous song
      */
      SongPlayer.previous = function() {
       var currentSongIndex = getSongIndex(SongPlayer.currentSong);
       currentSongIndex--;
       if (currentSongIndex < 0) {
         stopSong(song);
       } else {
         var song = currentAlbum.songs[currentSongIndex];
         setSong(song);
         playSong(song);
       }
     };

     /**
     * @function next
     * @desc Publically accessible function to go to next song
     */
     SongPlayer.next = function() {
      var currentSongIndex = getSongIndex(SongPlayer.currentSong);
      currentSongIndex++
      if (currentSongIndex >= currentAlbum.songs.length) {
        stopSong(SongPlayer.currentSong)
      } else {
        var song = currentAlbum.songs[currentSongIndex];
        setSong(song);
        playSong(song);
      }
    };

      /**
      * @function play
      * @desc publically accessible interfaction to play a song
      * @param {Object} the song to play
      */
      SongPlayer.play = function(song) {
        song = song || SongPlayer.currentSong;
        if (SongPlayer.currentSong !== song) {
          setSong(song);
          playSong(song);
        } else if (SongPlayer.currentSong === song) {
          if (currentBuzzObject.isPaused()) {
             currentBuzzObject.play();
          }
        }
     };

     /**
     * @function pause
     * @desc publically accessible interfaction to pause a song
     * @param {Object} the song to pause
     */
     SongPlayer.pause = function(song) {
       song = song || SongPlayer.currentSong;
       currentBuzzObject.pause();
       song.playing = false;
     };
     return SongPlayer;
   }

   angular
     .module('blocJams')
     .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
 })();
