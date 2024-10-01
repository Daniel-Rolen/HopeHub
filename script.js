document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded');
    const videoPlayer = document.getElementById('videoPlayer');
    console.log('Video player element:', videoPlayer);

    let videoFiles = ['moar___ab8f80.mp4']; // Fallback video file
    let currentVideoIndex = 0;

    async function loadMediaFiles() {
        try {
            console.log('Attempting to load video files');
            const videoResponse = await fetch('/video/');
            
            if (!videoResponse.ok) {
                throw new Error(`HTTP error! status: ${videoResponse.status}`);
            }
            
            const videoText = await videoResponse.text();
            
            console.log('Video directory content:', videoText);
            
            const foundVideos = videoText.match(/href="([^"]+\.mp4)"/g);
            if (foundVideos && foundVideos.length > 0) {
                videoFiles = foundVideos.map(match => match.match(/href="([^"]+)"/)[1]);
                console.log('Found video files:', videoFiles);
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
        const videoSrc = `/video/${videoFiles[currentVideoIndex]}`;
        console.log('Attempting to play video:', videoSrc);
        videoPlayer.src = videoSrc;
        console.log('Video player source set to:', videoPlayer.src);
        videoPlayer.load(); // Explicitly load the video
        console.log('Video loaded, attempting to play');
        videoPlayer.play().then(() => {
            console.log('Video playback started successfully');
        }).catch(error => {
            console.error('Error playing video:', error);
            console.log('Video player error event:', videoPlayer.error);
            displayErrorMessage('Error loading video. Please check your connection and try again.');
        });
        currentVideoIndex = (currentVideoIndex + 1) % videoFiles.length;
    }

    function displayErrorMessage(message) {
        const errorMessageElement = document.getElementById('errorMessage');
        errorMessageElement.textContent = message;
        errorMessageElement.style.display = 'block';
        console.log('Error message displayed:', message);
    }

    videoPlayer.addEventListener('ended', () => {
        console.log('Video ended, playing next video');
        playNextVideo();
    });
    videoPlayer.addEventListener('error', (e) => {
        console.error('Video player error:', e);
        console.log('Video player error details:', videoPlayer.error);
        displayErrorMessage('Error loading video. Please check your connection and try again.');
        console.log('Attempting to play next video due to error');
        playNextVideo();
    });
    console.log('Added event listeners to video player');

    loadMediaFiles();
});
