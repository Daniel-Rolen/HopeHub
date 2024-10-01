document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded');
    const videoPlayer = document.getElementById('videoPlayer');
    const audioPlayer = document.getElementById('audioPlayer');

    let videoFiles = [];
    let audioFiles = [];
    let currentVideoIndex = 0;
    let currentAudioIndex = 0;

    async function loadMediaFiles() {
        try {
            console.log('Attempting to load media files');
            const audioResponse = await fetch('audio/');
            const videoResponse = await fetch('video/');
            
            const audioText = await audioResponse.text();
            const videoText = await videoResponse.text();
            
            console.log('Audio directory content:', audioText);
            console.log('Video directory content:', videoText);
            
            audioFiles = (audioText.match(/href="([^"]+\.mp3)"/g) || []).map(match => match.match(/href="([^"]+)"/)[1]);
            videoFiles = (videoText.match(/href="([^"]+\.mp4)"/g) || []).map(match => match.match(/href="([^"]+)"/)[1]);

            console.log('Audio files found:', audioFiles);
            console.log('Video files found:', videoFiles);

            if (videoFiles.length > 0) {
                console.log('Starting video playback');
                playNextVideo();
            } else {
                console.log('No video files found');
            }
            if (audioFiles.length > 0) {
                console.log('Starting audio playback');
                playNextAudio();
            } else {
                console.log('No audio files found');
            }
        } catch (error) {
            console.error('Error loading media files:', error);
        }
    }

    function playNextVideo() {
        if (videoFiles.length === 0) {
            console.log('No video files to play');
            return;
        }
        const videoSrc = `video/${videoFiles[currentVideoIndex]}`;
        console.log('Playing video:', videoSrc);
        videoPlayer.src = videoSrc;
        videoPlayer.play().catch(error => console.error('Error playing video:', error));
        currentVideoIndex = (currentVideoIndex + 1) % videoFiles.length;
    }

    function playNextAudio() {
        if (audioFiles.length === 0) {
            console.log('No audio files to play');
            return;
        }
        const audioSrc = `audio/${audioFiles[currentAudioIndex]}`;
        console.log('Playing audio:', audioSrc);
        audioPlayer.src = audioSrc;
        audioPlayer.play().catch(error => console.error('Error playing audio:', error));
        currentAudioIndex = (currentAudioIndex + 1) % audioFiles.length;
    }

    videoPlayer.addEventListener('ended', playNextVideo);
    audioPlayer.addEventListener('ended', playNextAudio);

    loadMediaFiles();
});
