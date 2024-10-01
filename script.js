document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded');
    const videoPlayer = document.getElementById('videoPlayer');
    console.log('Video player element:', videoPlayer);

    let videoFiles = ['moar___ab8f80.mp4']; // Fallback video file
    let currentVideoIndex = 0;

    async function loadMediaFiles() {
        try {
            console.log('Attempting to load video files');
            const videoResponse = await fetch('video/');
            
            if (!videoResponse.ok) {
                throw new Error(`HTTP error! status: ${videoResponse.status}`);
            }
            
            const videoText = await videoResponse.text();
            
            console.log('Video directory content:', videoText);
            
            const foundVideos = videoText.match(/href="([^"]+\.mp4)"/g);
            if (foundVideos && foundVideos.length > 0) {
                videoFiles = foundVideos.map(match => match.match(/href="([^"]+)"/)[1]);
            } else {
                console.log('No video files found in directory listing, using fallback');
            }

            console.log('Video files to play:', videoFiles);

            if (videoFiles.length > 0) {
                console.log('Starting video playback');
                playNextVideo();
            } else {
                console.error('No video files available to play');
            }
        } catch (error) {
            console.error('Error loading video files:', error);
            console.log('Using fallback video file');
            playNextVideo();
        }
    }

    function playNextVideo() {
        if (videoFiles.length === 0) {
            console.error('No video files to play');
            return;
        }
        const videoSrc = `video/${videoFiles[currentVideoIndex]}`;
        console.log('Attempting to play video:', videoSrc);
        videoPlayer.src = videoSrc;
        videoPlayer.play().catch(error => {
            console.error('Error playing video:', error);
            console.log('Video player error event:', videoPlayer.error);
        });
        currentVideoIndex = (currentVideoIndex + 1) % videoFiles.length;
    }

    videoPlayer.addEventListener('ended', playNextVideo);
    videoPlayer.addEventListener('error', (e) => {
        console.error('Video player error:', e);
        playNextVideo(); // Try to play the next video if there's an error
    });
    console.log('Added event listeners to video player');

    loadMediaFiles();
});
