document.addEventListener('DOMContentLoaded', () => {
    const videoPlayer = document.getElementById('videoPlayer');
    const audioPlayer = document.getElementById('audioPlayer');
    const loadingIndicator = document.getElementById('loadingIndicator');
    let mediaFiles = [];
    let currentIndex = 0;

    async function loadMediaFiles() {
        try {
            const videoResponse = await fetch('/video/');
            const audioResponse = await fetch('/audio/');
            
            if (!videoResponse.ok || !audioResponse.ok) {
                throw new Error(`HTTP error! status: ${videoResponse.status} ${audioResponse.status}`);
            }
            
            const videoText = await videoResponse.text();
            const audioText = await audioResponse.text();
            
            const foundVideos = videoText.match(/href="([^"]+\.(mp4|webm))"/g) || [];
            const foundAudios = audioText.match(/href="([^"]+\.(mp3|ogg|wav))"/g) || [];
            
            console.log('Found Videos:', foundVideos);
            console.log('Found Audios:', foundAudios);
            
            mediaFiles = [
                ...foundVideos.map(match => ({ type: 'video', file: match.match(/href="([^"]+)"/)[1] })),
                ...foundAudios.map(match => ({ type: 'audio', file: match.match(/href="([^"]+)"/)[1] }))
            ];
            
            console.log('Media Files:', mediaFiles);
            
            if (mediaFiles.length > 0) {
                console.log('Checking if video file exists:', '/video/' + mediaFiles[0].file);
                fetch('/video/' + mediaFiles[0].file)
                    .then(response => {
                        if (response.ok) {
                            console.log('Video file exists and is accessible');
                        } else {
                            console.error('Video file not found or inaccessible');
                        }
                    })
                    .catch(error => console.error('Error checking video file:', error));
                
                playNextMedia();
            } else {
                console.error('No media files found');
                loadingIndicator.textContent = 'No media files found';
            }
        } catch (error) {
            console.error('Error loading media files:', error);
            loadingIndicator.textContent = 'Error loading media files';
        }
    }

    function playNextMedia() {
        const media = mediaFiles[currentIndex];
        console.log('Attempting to play media:', media);
        
        const player = media.type === 'video' ? videoPlayer : audioPlayer;
        const otherPlayer = media.type === 'video' ? audioPlayer : videoPlayer;
        
        try {
            console.log('Video player dimensions:', player.clientWidth, 'x', player.clientHeight);
            
            const sourceUrl = `/${media.type}/${media.file}`;
            console.log('Setting source URL:', sourceUrl);
            player.src = sourceUrl;
            player.style.display = 'block';
            otherPlayer.style.display = 'none';
            
            player.load(); // Explicitly load the media before playing
            
            setTimeout(() => {
                if (player.readyState === 0) {
                    console.error('Video failed to load after 5 seconds');
                } else {
                    console.log('Video loaded successfully, readyState:', player.readyState);
                }
            }, 5000);
            
            player.play().then(() => {
                console.log('Media playback started successfully');
                loadingIndicator.style.display = 'none';
            }).catch(error => {
                console.error('Error playing media:', error);
                console.log('Player error object:', player.error);
                loadingIndicator.textContent = 'Error playing media';
            });
            
            player.onended = () => {
                console.log('Media ended, playing next');
                currentIndex = (currentIndex + 1) % mediaFiles.length;
                playNextMedia();
            };
        } catch (error) {
            console.error('Error setting up media:', error);
            loadingIndicator.textContent = 'Error setting up media';
        }
    }

    videoPlayer.addEventListener('error', (e) => {
        console.error('Video playback error:', e);
        console.log('Video error details:', videoPlayer.error);
    });

    audioPlayer.addEventListener('error', (e) => {
        console.error('Audio playback error:', e);
        console.log('Audio error details:', audioPlayer.error);
    });

    loadMediaFiles();
});
