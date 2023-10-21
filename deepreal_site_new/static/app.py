from flask import Flask, render_template, Response
import cv2
fnum = 0
fmax = 100
app = Flask(__name__)

camera = cv2.VideoCapture(0) # use 0 for web camera

def gen_frames():
    #generate frame by frame from camera
    global fnum
    global fmax
    while fnum < fmax:
        print(fnum)
        fnum += 1
        #Capture frame-by-frame
        success, frame = camera.read()
        filename = 'pics/frame' +str(fnum) + '.jpg'
        cv2.imwrite(filename, frame)
        #read the camera frame
        if not success:
            break
        else:
            ret, buffer = cv2.imencode('.jpg, frame')
            frame = buffer.tobytes()
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n')

@app.route('/video_feed')
def video_feed():
    #Video streaming route. Put this in the src attribute of an img tag
    return Response(gen_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/')
def index():
    """Video streaming home page."""
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)