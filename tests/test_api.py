#!/usr/bin/env python3
"""
Test script to verify the predict endpoint
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

response = None
try:
    response = requests.post(url, files=files)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
    # Only try to print response text if we have a response object
    if response is not None:
        print(f"Response text: {response.text}")
    else:
        print("No response received")