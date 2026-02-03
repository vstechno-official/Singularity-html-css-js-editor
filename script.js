let editor;

require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs' } });

require(['vs/editor/editor.main'], function() {
	const container = document.getElementById('monaco-container');

	editor = monaco.editor.create(container, {
		value: `<!DOCTYPE html>
<html lang="en">
<head>
	<style>
		body { 
			background: #000; 
			color: #00f2ff; 
			display: flex;
			align-items: center;
			justify-content: center;
			height: 100vh;
			font-family: 'Share Tech', sans-serif;
			margin: 0;
			overflow: hidden;
		}
		.container {
			border: 2px solid #00f2ff;
			padding: 3rem;
			box-shadow: 0 0 30px rgba(0, 242, 255, 0.2);
			text-align: center;
		}
	</style>
</head>
<body>
	<div class="container">
		<h1>SINGULARITY v2.0</h1>
		<p>SYSTEM STATUS: OPTIMAL</p>
	</div>
</body>
</html>`,
		language: 'html',
		theme: 'vs-dark',
		automaticLayout: true,
		fontSize: 16,
		fontFamily: 'Victor Mono, monospace',
		fontLigatures: true,
		minimap: { enabled: false },
		scrollbar: {
			vertical: 'visible',
			horizontal: 'visible',
			useShadows: false,
			verticalHasArrows: false,
			horizontalHasArrows: false
		},
		padding: { top: 20 }
	});

	window.addEventListener('resize', () => {
		editor.layout();
	});

	editor.onDidChangeModelContent(() => {
		updatePreview();
	});

	// Register keyboard shortcuts
	editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
		deployToSingularity();
	});

	editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK, () => {
		toggleTheme();
	});

	updatePreview();
	document.getElementById('status').innerText = 'SYSTEM: ONLINE';
});

function updatePreview() {
	const frame = document.getElementById('render-frame');
	const content = editor.getValue();
	frame.srcdoc = content;
}

function deployToSingularity() {
	const status = document.getElementById('status');
	const urlDisplay = document.getElementById('url-preview');
	const content = editor.getValue();

	status.innerText = 'GENERATING_ENCRYPTED_PACKET...';

	try {
		const base64Data = btoa(unescape(encodeURIComponent(content)));
		const dataUrl = `data:text/html;base64,${base64Data}`;

		navigator.clipboard.writeText(dataUrl).then(() => {
			status.innerText = 'PACKET_COPIED_TO_CLIPBOARD';
			urlDisplay.innerText = `DATA_URL: ${dataUrl.substring(0, 25)}...`;
			status.style.color = '#00f2ff';

			const btn = document.querySelector('.launch-btn');
			const originalText = btn.innerText;
			btn.innerText = 'COPIED!';
			setTimeout(() => btn.innerText = originalText, 2000);
		}).catch(err => {
			console.error('Clipboard failed:', err);
			status.innerText = 'CLIPBOARD_ERROR';
			status.style.color = '#ffaa00';
		});

	} catch (e) {
		status.innerText = 'CORE_PACKAGING_ERROR';
		status.style.color = '#ff4444';
	}
}

let currentTheme = 'vs-dark';

function toggleTheme() {
	currentTheme = currentTheme === 'vs-dark' ? 'vs-light' : 'vs-dark';
	monaco.editor.setTheme(currentTheme);
}