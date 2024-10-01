document.addEventListener('DOMContentLoaded', () => {
    const videoPlayer = document.getElementById('videoPlayer');
    const audioPlayer = document.getElementById('audioPlayer');

    let videoFiles = [];
    let audioFiles = [];
    let currentVideoIndex = 0;
    let currentAudioIndex = 0;

    async function loadMediaFiles() {
        try {
            const audioResponse = await fetch('audio/');
            const videoResponse = await fetch('video/');
            
            const audioText = await audioResponse.text();
            const videoText = await videoResponse.text();
            
            audioFiles = (audioText.match(/href="([^"]+\.mp3)"/g) || []).map(match => match.match(/href="([^"]+)"/)[1]);
            videoFiles = (videoText.match(/href="([^"]+\.mp4)"/g) || []).map(match => match.match(/href="([^"]+)"/)[1]);

            console.log('Audio files:', audioFiles);
            console.log('Video files:', videoFiles);

            if (videoFiles.length > 0) playNextVideo();
            if (audioFiles.length > 0) playNextAudio();
        } catch (error) {
            console.error('Error loading media files:', error);
        }
    }

    function playNextVideo() {
        if (videoFiles.length === 0) {
            console.log('No video files available');
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
            console.log('No audio files available');
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

    videoPlayer.addEventListener('error', (e) => console.error('Video error:', e));
    audioPlayer.addEventListener('error', (e) => console.error('Audio error:', e));

    loadMediaFiles();
});
