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

    function getCorrespondingAudio(videoFile) {
        const audioFile = videoFile.replace(/\.(mp4|webm)$/, '.mp3');
        const correspondingAudio = mediaFiles.find(media => media.type === 'audio' && media.file === audioFile);
        return correspondingAudio ? `audio/${correspondingAudio.file}` : '';
    }

    function playNextMedia() {
        const media = mediaFiles[currentIndex];
        console.log('Playing next media:', media);

        if (media.type === 'video') {
            videoPlayer.src = `video/${media.file}`;
            videoPlayer.style.display = 'block';
            const correspondingAudio = getCorrespondingAudio(media.file);
            audioPlayer.src = correspondingAudio;
            
            // Play video and audio together
            Promise.all([
                videoPlayer.play(),
                correspondingAudio ? audioPlayer.play() : Promise.resolve()
            ]).catch(error => {
                console.error('Error playing media:', error);
                displayError('Error playing media');
            });

            // Ensure video keeps playing even if audio ends
            audioPlayer.onended = () => {
                if (videoPlayer.currentTime < videoPlayer.duration) {
                    audioPlayer.currentTime = 0;
                    audioPlayer.play().catch(console.error);
                }
            };
        } else if (media.type === 'audio') {
            videoPlayer.src = '';
            videoPlayer.style.display = 'none';
            audioPlayer.src = `audio/${media.file}`;
            audioPlayer.play().catch(error => {
                console.error('Error playing audio:', error);
                displayError('Error playing audio');
            });
        }

        console.log('Video source URL:', videoPlayer.src);
        console.log('Audio source URL:', audioPlayer.src);
    }

    // Modify the video onended event to handle looping
    videoPlayer.onended = () => {
        console.log('Video ended, looping or playing next...');
        if (audioPlayer.src && audioPlayer.currentTime < audioPlayer.duration) {
            // If audio is still playing, loop the video
            videoPlayer.currentTime = 0;
            videoPlayer.play().catch(console.error);
        } else {
            // Move to the next media
            currentIndex = (currentIndex + 1) % mediaFiles.length;
            playNextMedia();
        }
    };

    function syncAudioVideo() {
        if (Math.abs(videoPlayer.currentTime - audioPlayer.currentTime) > 0.3) {
            audioPlayer.currentTime = videoPlayer.currentTime;
        }
    }

    // Call this function periodically
    setInterval(syncAudioVideo, 1000);

    function displayError(message) {
        const errorDisplay = document.getElementById('errorDisplay');
        errorDisplay.textContent = message;
    }

    loadMediaFiles();
});
