document.addEventListener('DOMContentLoaded', () => {
    const videoPlayer = document.getElementById('videoPlayer');
    const audioPlayer = document.getElementById('audioPlayer');
    let mediaFiles = [];
    let currentIndex = 0;

    async function loadMediaFiles() {
        console.log('Current working directory:', window.location.href);
        console.log('Attempting to load media files...');
        try {
            const videoResponse = await fetch('video/');
            const audioResponse = await fetch('audio/');
            
            if (!videoResponse.ok || !audioResponse.ok) {
                throw new Error(`HTTP error! status: ${videoResponse.status} ${audioResponse.status}`);
            }
            
            const videoText = await videoResponse.text();
            const audioText = await audioResponse.text();
            
            const foundVideos = videoText.match(/href="([^"]+\.(mp4|webm))"/g) || [];
            const foundAudios = audioText.match(/href="([^"]+\.(mp3|ogg|wav))"/g) || [];
            
            mediaFiles = [
                ...foundVideos.map(match => ({ type: 'video', file: match.match(/href="([^"]+)"/)[1] })),
                ...foundAudios.map(match => ({ type: 'audio', file: match.match(/href="([^"]+)"/)[1] }))
            ];
            
            console.log('Media files loaded:', mediaFiles);
        } catch (error) {
            console.error('Error loading media files:', error);
            console.log('Falling back to config.js...');
            mediaFiles = window.mediaConfig || [];
        }

        if (mediaFiles.length > 0) {
            console.log('Starting playback...');
            playNextMedia();
        } else {
            console.error('No media files found');
            displayError('No media files found');
        }
    }

    function playNextMedia() {
        const media = mediaFiles[currentIndex];
        console.log('Playing next media:', media);

        if (media.type === 'video') {
            videoPlayer.src = `video/${media.file}`;
            videoPlayer.style.display = 'block';
            videoPlayer.play().catch(error => {
                console.error('Error playing video:', error);
                displayError('Error playing video');
            });
        } else if (media.type === 'audio') {
            audioPlayer.src = `audio/${media.file}`;
            audioPlayer.play().catch(error => {
                console.error('Error playing audio:', error);
                displayError('Error playing audio');
            });
        }

        console.log('Video source URL:', videoPlayer.src);
        console.log('Audio source URL:', audioPlayer.src);

        videoPlayer.onended = audioPlayer.onended = () => {
            console.log('Media ended, playing next...');
            currentIndex = (currentIndex + 1) % mediaFiles.length;
            playNextMedia();
        };

        videoPlayer.onerror = (e) => {
            console.error('Error loading video:', e);
            displayError('Error loading video');
        };

        audioPlayer.onerror = (e) => {
            console.error('Error loading audio:', e);
            displayError('Error loading audio');
        };
    }

    function displayError(message) {
        const errorDisplay = document.getElementById('errorDisplay');
        errorDisplay.textContent = message;
    }

    loadMediaFiles();
});
