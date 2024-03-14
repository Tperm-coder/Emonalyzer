import { assetsPathes } from './statics.js';

const musiPlayerDiv = document.getElementById('musiPlayer');
const setMusicPlayerVisibilityState = (state) => {
	if ((state && musiPlayerDiv.style.display === '') || (!state && musiPlayerDiv.style.display === 'none')) {
		return;
	}
	musiPlayerDiv.style.display = state ? '' : 'none';
};
setMusicPlayerVisibilityState(false);

var wavesurfer = WaveSurfer.create({
	container: '#waveform',
	waveColor: '#006587',
	progressColor: '#7cdeff',
	barWidth: 3,
	responsive: true,
	hideScrollbar: false,
	barRadius: 3,
});

const playBtn = document.getElementById('playBtn');
playBtn.onclick = function () {
	wavesurfer.playPause();
	playBtn.src = wavesurfer.isPlaying() ? assetsPathes.pauseBtnSrc : assetsPathes.playBtnSrc;
};

const audioUploadDiv = document.getElementById('audioUpload');
const audioUploadInput = document.getElementById('audioUploadInput');
const audioTitleDiv = document.getElementById('audioTitle');
audioUploadDiv.addEventListener('click', () => {
	console.log('click');
	audioUploadInput.click();
});

audioUploadInput.addEventListener('change', function () {
	const fileInput = this;
	if (fileInput.files.length == 0) {
		return;
	}

	setMusicPlayerVisibilityState(true);
	const audioName = fileInput.files[0].name;
	audioTitleDiv.innerText = audioName;

	const audioURL = URL.createObjectURL(fileInput.files[0]);
	wavesurfer.load(audioURL);
});

const voiceInputDiv = document.getElementById('voiceInput');
navigator.mediaDevices
	.getUserMedia({ audio: true })
	.then(function (stream) {
		let recordedChunks = [];
		const mediaRecorder = new MediaRecorder(stream);
		mediaRecorder.addEventListener('dataavailable', function (e) {
			recordedChunks.push(e.data);
		});
		mediaRecorder.addEventListener('error', function (e) {
			console.log(e);
		});
		console.log({ mediaRecorder, stream });

		voiceInputDiv.addEventListener('click', function () {
			if (voiceInputDiv.dataset.info == 'off') {
				console.log('resetting');
				voiceInputDiv.dataset.info = 'on';
				recordedChunks = [];
				mediaRecorder.start(100);
			} else {
				console.log('merging');
				voiceInputDiv.dataset.info = 'off';
				mediaRecorder.stop();

				setMusicPlayerVisibilityState('true');
				audioTitleDiv.innerText = 'Audio';
				const blob = new Blob(recordedChunks, { type: 'audio/ogg; codecs=opus' });
				const audioURL = URL.createObjectURL(blob);
				console.log({ blob });
				wavesurfer.load(audioURL);
			}
		});
	})
	.catch(function (err) {
		console.error('Error accessing microphone:', err);
	});
