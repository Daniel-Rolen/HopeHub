document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded');
    const videoPlayer = document.getElementById('videoPlayer');

    let videoFiles = [];
    let currentVideoIndex = 0;

    async function loadMediaFiles() {
        try {
            console.log('Attempting to load video files');
            const videoResponse = await fetch('video/');
            
            const videoText = await videoResponse.text();
            
            console.log('Video directory content:', videoText);
            
            videoFiles = (videoText.match(/href="([^"]+\.mp4)"/g) || []).map(match => match.match(/href="([^"]+)"/)[1]);

            console.log('Video files found:', videoFiles);

            if (videoFiles.length > 0) {
                console.log('Starting video playback');
                playNextVideo();
            } else {
                console.log('No video files found');
            }
        } catch (error) {
            console.error('Error loading video files:', error);
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

    videoPlayer.addEventListener('ended', playNextVideo);

    loadMediaFiles();
});
