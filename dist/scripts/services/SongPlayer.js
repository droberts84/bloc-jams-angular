(function() {
   function SongPlayer() {
      /**
      * @desc Song Player external interface
      * @type {Object}
      */
      var SongPlayer = {};

      /**
      * @desc Buzz object audio file
      * @type {Object}
      */
      var currentBuzzObject = null;

      SongPlayer.currentSong = null;

      /**
      * @function setSong
      * @desc Stops currently playing song and loads new audio file as currentBuzzObject
      * @param {Object} song
      */
      var setSong = function(song) {
        if (currentBuzzObject) {
          currentBuzzObject.stop();
          SongPlayer.currentSong.playing = null;
        }

        currentBuzzObject = new buzz.sound(song.audioUrl, {
          formats: ['mp3'],
          preload: true
        });

        SongPlayer.currentSong = song;
      };

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
     .factory('SongPlayer', SongPlayer);
 })();
