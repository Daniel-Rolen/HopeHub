# Minimalist Web-based Media Player

This project is a simple, minimalist web-based media player that loops through video and audio files using vanilla JavaScript.

## Features

- Automatically plays video and audio files in a loop
- Supports multiple video and audio formats (mp4, webm, mp3, ogg, wav)
- Minimalist design with a full-screen video player
- Fallback to audio-only playback when no video is available

## Setup

1. Clone this repository
2. Ensure you have Node.js installed
3. Run `npm install` to install the required dependencies
4. Place your video files in the `video` directory
5. Place your audio files in the `audio` directory
6. Update the `config.js` file with your media file information if needed

## Usage

1. Run `npx http-server -p 8000` to start the local server
2. Open a web browser and navigate to `http://localhost:8000`
3. The media player will automatically start playing the first video or audio file

## File Structure

- `index.html`: Main HTML file
- `styles.css`: CSS styles for the player
- `script.js`: JavaScript code for the media player functionality
- `config.js`: Configuration file for media files (fallback if directory listing fails)
- `video/`: Directory for video files
- `audio/`: Directory for audio files

## Contributing

Feel free to fork this repository and submit pull requests for any improvements or bug fixes.

## License

This project is open source and available under the [MIT License](LICENSE).
