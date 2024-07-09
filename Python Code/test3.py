import cv2
import numpy as np
import cvzone
import pickle
import os  
from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['Parking_Project']
parking_collection = db['parkings']
i = 1

def save_annotations(file_path, polylines, area_names, video_index):
    with open(file_path, "wb") as f:
        data = {'polylines': polylines, 'area_names': area_names}
        pickle.dump(data, f)
    # Update parkingSpaces and noOfParkingSpaces in database
    parking_name = f"Parking Name {video_index}"
    parking = parking_collection.find_one({"name": parking_name})
    
    if parking:
        parking_spaces = parking.get("parkingSpaces", [])
        for name in area_names:
            parking_spaces.append({"name": name, "status": "available"})
        parking_collection.update_one({"name": parking_name}, {"$set": {"parkingSpaces": parking_spaces}})
        # Update noOfParkingSpaces
        no_of_spaces = len(parking_spaces)
        parking_collection.update_one({"name": parking_name}, {"$set": {"noOfParkingSpaces": no_of_spaces}})


def load_annotations(file_path):
    if os.path.exists(file_path):  
        with open(file_path, "rb") as f:
            data = pickle.load(f)
            return data.get('polylines', []), data.get('area_names', [])
    else:
        return [], []

# Initialize video files
video_files = ["easy.mp4", "easy1.mp4"]

# Find the latest parking name index from the database
latest_parking = parking_collection.find_one(sort=[("_id", -1)])
latest_parking_index = 1 if not latest_parking else int(latest_parking["name"].split()[-1])

# Adjust the latest_parking_index to start from 1 if the database is empty
if latest_parking_index > 1:
    latest_parking_index = 1

for video_index, video_file in enumerate(video_files, start=latest_parking_index):
    polylines, area_names = load_annotations(f"recorded_polylines_{video_index}")
    cap = cv2.VideoCapture(video_file)
    window_name = f'Video_{video_index}'
    cv2.namedWindow(window_name)

    points = []
    current_name = ""

    def draw(event, x, y, flags, param):
        global points, drawing
        drawing = True
        if event == cv2.EVENT_LBUTTONDOWN:
            points = [(x, y)]
        elif event == cv2.EVENT_MOUSEMOVE:
            if drawing:
                points.append((x, y))
        elif event == cv2.EVENT_LBUTTONUP:
            drawing = False
            current_name = input('Area name: ')
            if current_name:
                area_names.append(current_name)
                polylines.append(np.array(points, np.int32))

    while True:
        ret, frame = cap.read()
        if not ret:
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            continue
        frame = cv2.resize(frame, (1020, 500))
        for i, polyline in enumerate(polylines):
            cv2.polylines(frame, [polyline], True, (0, 0, 255), 2)
            cvzone.putTextRect(frame, f'{area_names[i]}', tuple(polyline[0]), 1, 1)

        cv2.imshow(window_name, frame)
        cv2.setMouseCallback(window_name, draw)

        key = cv2.waitKey(100) & 0xFF
        if key == ord('s'):
            save_annotations(f"recorded_polylines_{video_index}", polylines, area_names, video_index)
            break
        elif key == 27:
            break

    cap.release()
    cv2.destroyWindow(window_name)

cv2.destroyAllWindows()
