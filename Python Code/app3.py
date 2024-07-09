from flask import Flask, render_template, Response, request
import cv2
import numpy as np
import pickle
import pandas as pd
from ultralytics import YOLO
import cvzone
from pymongo import MongoClient

app = Flask(__name__)

# MongoDB setup
client = MongoClient('mongodb://localhost:27017/')
db = client['Parking_Project']
parking_collection = db['parkings']

# Load annotations from file
def load_annotations(file_path):
    with open(file_path, "rb") as f:
        data = pickle.load(f)
        return data['polylines'], data['area_names']

# Load class list for YOLO
with open("coco.txt", "r") as my_file:
    class_list = my_file.read().split("\n")

# Initialize YOLO model
model = YOLO('yolov8s.pt')

# Define video files and their associated recorded_polylines files
video_files = ["easy.mp4", "easy1.mp4"]  # Add more video files as needed
recorded_polylines_files = ["recorded_polylines_1", "recorded_polylines_2"]  # Ensure this list matches video_files

# Dictionary to store the current frame for each video feed
current_frames = {}

# Dictionary to store the current frame position for each video feed
frame_positions = {}

def update_parking_space_status(parking_name, space_name, status):
    parking = parking_collection.find_one({"name": parking_name})
    if parking:
        parking_spaces = parking.get("parkingSpaces", [])
        for space in parking_spaces:
            if space["name"] == space_name:
                # Check if the current status is "parked" or the previous status was "parked"
                if space["status"] == "parked" or status == "parked":
                    space["status"] = status
                break
        parking_collection.update_one({"name": parking_name}, {"$set": {"parkingSpaces": parking_spaces}})



def generate_frames(video_file, recorded_polylines_file):
    cap = cv2.VideoCapture(video_file)
    polylines, area_names = load_annotations(recorded_polylines_file)

    if video_file not in frame_positions:
        frame_positions[video_file] = 0

    cap.set(cv2.CAP_PROP_POS_FRAMES, frame_positions[video_file])

    while True:
        ret, frame = cap.read()
        if not ret:
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            continue

        frame = cv2.resize(frame, (1020, 500))
        frame_copy = frame.copy()
        results = model.predict(frame)
        a = results[0].boxes.data
        px = pd.DataFrame(a).astype("float")
        list1 = []
        for index, row in px.iterrows():
            x1 = int(row[0])
            y1 = int(row[1])
            x2 = int(row[2])
            y2 = int(row[3])
            d = int(row[5])

            c = class_list[d]
            cx = int(x1 + x2) // 2
            cy = int(y1 + y2) // 2
            if 'car' in c:
                list1.append([cx, cy])

        counter1 = []
        for i, polyline in enumerate(polylines):
            occupied = False
            for i1 in list1:
                cx1 = i1[0]
                cy1 = i1[1]
                result = cv2.pointPolygonTest(polyline, ((cx1, cy1)), False)
                if result >= 0:
                    cv2.circle(frame_copy, (cx1, cy1), 5, (255, 0, 0), -1)
                    cv2.polylines(frame_copy, [polyline], True, (0, 0, 255), 2)
                    counter1.append(cx1)
                    occupied = True
                    break
            
            if not occupied:
                cv2.polylines(frame_copy, [polyline], True, (0, 255, 0), 2)

            # Update database status
            if occupied:
                update_parking_space_status(f"Parking Name {video_files.index(video_file) + 1}", area_names[i], "parked")
            else:
                update_parking_space_status(f"Parking Name {video_files.index(video_file) + 1}", area_names[i], "available")

        car_count = len(counter1)
        free_space = len(polylines) - car_count

        for i, polyline in enumerate(polylines):
            cvzone.putTextRect(frame_copy, f'{area_names[i]}', tuple(polyline[0]), 1, 1)

        cvzone.putTextRect(frame_copy, f'CAR Counter:-{car_count}', (50, 60), 2, 2)
        cvzone.putTextRect(frame_copy, f'Free Space:-{free_space}', (50, 160), 2, 2)

        _, buffer = cv2.imencode('.jpg', frame_copy)
        frame = buffer.tobytes()

        # Store the current frame for this video feed
        current_frames[video_file] = frame

        # Update frame position
        frame_positions[video_file] = int(cap.get(cv2.CAP_PROP_POS_FRAMES))

        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/video_feed1')
def video_feed1():
    return Response(generate_frames(video_files[0], recorded_polylines_files[0]), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/video_feed2')
def video_feed2():
    return Response(generate_frames(video_files[1], recorded_polylines_files[1]), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == "__main__":
    app.run(debug=True)
