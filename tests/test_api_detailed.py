#!/usr/bin/env python3
"""
Detailed test script to verify the predict endpoint and understand the response
"""

import requests
import os

# Create a simple test image
from PIL import Image
import io

# Create a simple red square image for testing
image = Image.new('RGB', (300, 300), color='red')
img_byte_arr = io.BytesIO()
image.save(img_byte_arr, format='JPEG')
img_byte_arr.seek(0)

# Send request to the predict endpoint
url = 'http://localhost:8000/predict'
files = {'file': ('test.jpg', img_byte_arr, 'image/jpeg')}

try:
    response = requests.post(url, files=files)
    print(f"Status Code: {response.status_code}")
    print(f"Response Headers: {response.headers}")
    print(f"Response Text: {response.text}")
    if response.status_code == 200:
        print(f"Response JSON: {response.json()}")
    else:
        print(f"Error Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()