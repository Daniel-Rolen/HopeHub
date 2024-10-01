document.addEventListener('DOMContentLoaded', () => {
    const mediaSelector = document.getElementById('mediaSelector');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const playPauseIcon = document.getElementById('playPauseIcon');
    const audioPlayer = document.getElementById('audioPlayer');
    const videoPlayer = document.getElementById('videoPlayer');

    let currentPlayer = null;

    // Function to load media files
    async function loadMediaFiles() {
        try {
            const audioResponse = await fetch('audio/');
            const videoResponse = await fetch('video/');
            
            const audioFiles = await audioResponse.text();
            const videoFiles = await videoResponse.text();
            
            let filesAdded = false;

            if (audioFiles.trim() !== '') {
                const audioMatches = audioFiles.match(/href="([^"]+\.mp3)"/g) || [];
                audioMatches.forEach(match => {
                    const fileName = match.match(/href="([^"]+)"/)[1];
                    addOption(fileName, 'audio');
                    filesAdded = true;
                });
            }
            
            if (videoFiles.trim() !== '') {
                const videoMatches = videoFiles.match(/href="([^"]+\.mp4)"/g) || [];
                videoMatches.forEach(match => {
                    const fileName = match.match(/href="([^"]+)"/)[1];
                    addOption(fileName, 'video');
                    filesAdded = true;
                });
            }

            if (!filesAdded) {
                const option = document.createElement('option');
                option.textContent = 'No media files found';
                mediaSelector.appendChild(option);
                console.log('No media files found, added option to selector');
            } else {
                console.log('Media files found and added to selector');
            }
        } catch (error) {
            console.error('Error loading media files:', error);
        }
    }

    // Function to add option to select element
    function addOption(fileName, type) {
        const option = document.createElement('option');
        option.value = `${type}/${fileName}`;
        option.textContent = fileName;
        mediaSelector.appendChild(option);
    }

    // Load media files when the page loads
    loadMediaFiles();

    // Event listener for media selection
    mediaSelector.addEventListener('change', (e) => {
        const selectedFile = e.target.value;
        if (selectedFile) {
            const [type, file] = selectedFile.split('/');
            if (type === 'audio') {
                setupPlayer(audioPlayer, file);
                videoPlayer.style.display = 'none';
            } else if (type === 'video') {
                setupPlayer(videoPlayer, file);
                videoPlayer.style.display = 'block';
            }
        }
    });

    // Function to setup player
    function setupPlayer(player, file) {
        player.src = `${player.id.replace('Player', '')}/${file}`;
        player.style.display = 'block';
        currentPlayer = player;
        playPauseIcon.src = 'assets/play-button.svg';
    }

    // Event listener for play/pause button
    playPauseBtn.addEventListener('click', () => {
        if (currentPlayer) {
            if (currentPlayer.paused) {
                currentPlayer.play();
                playPauseIcon.src = 'assets/pause-button.svg';
            } else {
                currentPlayer.pause();
                playPauseIcon.src = 'assets/play-button.svg';
            }
        }
    });
});
