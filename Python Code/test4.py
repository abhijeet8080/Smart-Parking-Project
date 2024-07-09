import cv2
import numpy as np
import pickle
import pandas as pd
from ultralytics import YOLO
import cvzone
import threading
from pymongo import MongoClient

client = MongoClient('mongodb://localhost:27017/')
db = client['Parking_Project']
parking_collection = db['parkings']

def update_parking_space_status(parking_name, space_name, status):
    parking = parking_collection.find_one({"name": parking_name})
    if parking:
        parking_spaces = parking.get("parkingSpaces", [])
        for space in parking_spaces:
            if space["name"] == space_name:
                space["status"] = status
                break
        parking_collection.update_one({"name": parking_name}, {"$set": {"parkingSpaces": parking_spaces}})

def load_annotations(file_path):
    with open(file_path, "rb") as f:
        data = pickle.load(f)
        return data['polylines'], data['area_names']

my_file = open("coco.txt", "r")
data = my_file.read()
class_list = data.split("\n")

model = YOLO('yolov8s.pt')

video_files = ["easy.mp4", "easy1.mp4"]  # Add more video files as needed

def process_video(video_file, recorded_polylines_file, video_index):
    polylines, area_names = load_annotations(recorded_polylines_file)
    cap = cv2.VideoCapture(video_file)
    count = 0
    parking_status = {}  # Dictionary to store parking space status

    while True:
        ret, frame = cap.read()
        if not ret:
            cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
            continue

        count += 1
        if count % 3 != 0:
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
            cx = (x1 + x2) // 2
            cy = (y1 + y2) // 2
            if 'car' in c:
                list1.append([cx, cy])

        counter1 = []
        list2 = []
        for j, polyline in enumerate(polylines):
            list2.append(j)
            cv2.polylines(frame, [polyline], True, (0, 255, 0), 2)
            cvzone.putTextRect(frame, f'{area_names[j]}', tuple(polyline[0]), 1, 1)
            space_status = "available"  # Initialize space status to available
            for i1 in list1:
                cx1 = i1[0]
                cy1 = i1[1]
                result = cv2.pointPolygonTest(polyline, ((cx1, cy1)), False)
                if result >= 0:
                    cv2.circle(frame, (cx1, cy1), 5, (255, 0, 0), -1)
                    cv2.polylines(frame, [polyline], True, (0, 0, 255), 2)
                    counter1.append(cx1)
                    space_status = "booked"  # Update space status to booked if car detected
                    break  # Exit loop if car detected in space
            parking_status[area_names[j]] = space_status  # Update parking space status

        for space_name, status in parking_status.items():
            update_parking_space_status(f"Parking Name {video_index}", space_name, status)

        car_count = len(counter1)
        free_space = len(list2) - car_count
        cvzone.putTextRect(frame, f'CAR Counter:-{car_count}', (50, 60), 2, 2)
        cvzone.putTextRect(frame, f'Free Space:-{free_space}', (50, 160), 2, 2)
        cv2.imshow(video_file, frame)
        key = cv2.waitKey(1) & 0xFF

        if key == 27:
            break

    cap.release()

# Create and start threads for each video file
threads = []
for video_file, recorded_polylines_file in zip(video_files, [f"recorded_polylines_{i}" for i in range(1, len(video_files) + 1)]):
    video_index = int(recorded_polylines_file.split("_")[-1])
    thread = threading.Thread(target=process_video, args=(video_file, recorded_polylines_file, video_index))
    threads.append(thread)
    thread.start()

# Wait for all threads to finish
for thread in threads:
    thread.join()

cv2.destroyAllWindows()
