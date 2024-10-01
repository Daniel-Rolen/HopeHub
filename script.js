document.addEventListener('DOMContentLoaded', () => {
    const videoPlayer = document.getElementById('videoPlayer');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const volumeSlider = document.getElementById('volumeSlider');
    const playlistSelector = document.getElementById('playlistSelector');
    const errorMessage = document.getElementById('errorMessage');

    let videoFiles = [];

    async function loadMediaFiles() {
        console.log('Starting loadMediaFiles function');
        try {
            console.log('Fetching video directory contents');
            const videoResponse = await fetch('/video/');
            if (!videoResponse.ok) {
                throw new Error(`HTTP error! status: ${videoResponse.status}`);
            }
            const videoText = await videoResponse.text();
            console.log('Video directory contents:', videoText);
            
            const foundVideos = videoText.match(/href="([^"]+\.mp4)"/g);
            if (foundVideos && foundVideos.length > 0) {
                videoFiles = foundVideos.map(match => match.match(/href="([^"]+)"/)[1]);
                console.log('Found video files:', videoFiles);
                updatePlaylist();
            } else {
                throw new Error('No video files found');
            }
        } catch (error) {
            console.error('Error loading video files:', error);
            displayErrorMessage('Error loading video files. Please try again later.');
        }
    }

    function updatePlaylist() {
        console.log('Updating playlist');
        playlistSelector.innerHTML = '<option value="">Select a video</option>';
        videoFiles.forEach(file => {
            const option = document.createElement('option');
            option.value = file;
            option.textContent = file;
            playlistSelector.appendChild(option);
        });
        console.log('Playlist updated');
    }

    function playVideo(src) {
        console.log('Attempting to play video:', src);
        videoPlayer.src = `/video/${src}`;
        videoPlayer.load();
        videoPlayer.play().catch(error => {
            console.error('Error playing video:', error);
            console.log('Attempting fallback: direct video load');
            videoPlayer.src = src;
            videoPlayer.load();
            videoPlayer.play().catch(fallbackError => {
                console.error('Fallback failed:', fallbackError);
                displayErrorMessage('Error playing video. Please try again.');
            });
        });
    }

    function displayErrorMessage(message) {
        console.error('Error:', message);
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    playPauseBtn.addEventListener('click', () => {
        if (videoPlayer.paused) {
            videoPlayer.play();
        } else {
            videoPlayer.pause();
        }
    });

    volumeSlider.addEventListener('input', () => {
        videoPlayer.volume = volumeSlider.value;
    });

    playlistSelector.addEventListener('change', () => {
        const selectedVideo = playlistSelector.value;
        if (selectedVideo) {
            playVideo(selectedVideo);
        }
    });

    videoPlayer.addEventListener('ended', () => {
        const currentIndex = videoFiles.indexOf(playlistSelector.value);
        const nextIndex = (currentIndex + 1) % videoFiles.length;
        playlistSelector.value = videoFiles[nextIndex];
        playVideo(videoFiles[nextIndex]);
    });

    videoPlayer.addEventListener('error', (e) => {
        console.error('Video playback error:', e);
        console.log('Video error details:', videoPlayer.error);
        displayErrorMessage('Error during video playback. Please try again.');
    });

    loadMediaFiles();
});
