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
        console.log('Current index:', currentIndex);
        console.log('Total media files:', mediaFiles);

        let videoFile = mediaFiles.find(media => media.type === 'video');
        let audioFile = mediaFiles.find(media => media.type === 'audio');

        if (videoFile) {
            videoPlayer.src = `video/${videoFile.file}`;
            videoPlayer.style.display = 'block';
            videoPlayer.loop = true; // Make the video loop
        }

        if (audioFile) {
            audioPlayer.src = `audio/${audioFile.file}`;
            audioPlayer.style.display = 'none'; // Hide audio player
        }

        // Play both video and audio simultaneously
        Promise.all([videoPlayer.play(), audioPlayer.play()]).catch(error => {
            console.error('Error playing media:', error);
            displayError('Error playing media');
        });

        console.log('Video source URL:', videoPlayer.src);
        console.log('Audio source URL:', audioPlayer.src);
    }

    // Update the audio ended event to play the next audio file
    audioPlayer.onended = () => {
        console.log('Audio ended, playing next...');
        currentIndex = (currentIndex + 1) % mediaFiles.filter(media => media.type === 'audio').length;
        let nextAudioFile = mediaFiles.filter(media => media.type === 'audio')[currentIndex];
        if (nextAudioFile) {
            audioPlayer.src = `audio/${nextAudioFile.file}`;
            audioPlayer.play().catch(error => {
                console.error('Error playing next audio:', error);
                displayError('Error playing next audio');
            });
        }
    };

    function displayError(message) {
        const errorDisplay = document.getElementById('errorDisplay');
        errorDisplay.textContent = message;
    }

    loadMediaFiles();
});
