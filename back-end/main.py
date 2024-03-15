from flask import Flask, request
from pydub import AudioSegment
import io

app = Flask(__name__)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return 'No file part in the request', 400
    
    file = request.files['file']
    
    audio = AudioSegment.from_file(file)
    print(audio)
    duration = len(audio) / 1000  # Duration in seconds
    audio_chunks = []
    res = []
    for chunk in audio[::1000]:
        chunk_bytes = io.BytesIO()
        chunk.export(chunk_bytes, format='mp3')
        audio_chunks.append(chunk_bytes.getvalue())
        res.append([0.1,0.1,0.3,0.5])
            
    for i, chunk_data in enumerate(audio_chunks):
        print(f"Chunk {i+1}: {len(chunk_data)} bytes")
    
    return {"res" : res} , 200

if __name__ == '__main__':
    app.run(debug=True)
