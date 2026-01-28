# 🌱 Enhancing Plant Health and Disease Control Using Deep Learning for Tomato Crops

## 📌 Project Overview

This project focuses on **early detection and effective management of tomato plant diseases** using **Deep Learning and Computer Vision**. Farmers and agricultural practitioners often face heavy crop losses due to late identification of plant diseases. This system aims to solve that problem by providing **instant disease diagnosis, treatment guidance, and historical tracking** using uploaded leaf images.

The application allows users to:

* Upload or capture tomato leaf images
* Automatically detect plant diseases
* View disease severity and confidence level
* Receive treatment and prevention recommendations
* Maintain a complete scan history
* Learn from a built-in disease knowledge library

---

## 🎯 Objectives

* Detect tomato plant diseases at an early stage
* Reduce crop yield loss
* Assist farmers with instant decision-making
* Provide AI-based treatment guidance
* Maintain long-term plant health history

---

## 🧠 How the Project Works

### Step-by-Step Flow

1. **User Authentication**

   * User registers or logs in
   * Secure authentication token is generated

2. **Image Upload / Camera Capture**

   * User uploads tomato leaf image
   * Supported formats: JPG, PNG, WEBP (up to 10MB)

3. **Image Processing**

   * Image is converted to Base64 format
   * Sent securely to backend API

4. **Deep Learning Analysis**

   * CNN-based deep learning model analyzes leaf patterns
   * Features extracted:

     * Spots
     * Discoloration
     * Shape distortions
     * Texture variations

5. **Disease Prediction**

   * Disease name identified
   * Confidence level calculated
   * Severity classified (Low / Moderate / High)

6. **Treatment Recommendation**

   * Disease-specific treatment steps
   * Prevention guidelines
   * Best agricultural practices

7. **History Storage**

   * Each scan stored with timestamp
   * Enables long-term monitoring

---

## 🖥️ Application Screens

### 🔹 Home Page


<img width="1869" height="869" alt="1" src="https://github.com/user-attachments/assets/e507f926-ab12-471e-9ecd-9aebb63bf7d6" />


Shows the landing interface introducing the system and its purpose.

---

### 🔹 Features Section

<img width="1865" height="883" alt="2" src="https://github.com/user-attachments/assets/8cc2cbc5-2827-4374-8a09-a94ae7d3a0f5" />


Displays key system capabilities:

* Instant analysis
* Treatment plans
* Scan history tracking

---

### 🔹 User Dashboard

<img width="1923" height="896" alt="3" src="https://github.com/user-attachments/assets/021d8280-3040-49b0-b2ed-1d6a0c3d828f" />

Allows users to:

* Upload plant images
* Access history
* Browse disease library

---

### 🔹 Scan History


<img width="1923" height="829" alt="4" src="https://github.com/user-attachments/assets/e8a99ac5-7822-472b-8473-1ed2d643b31d" />

Shows previous scans with:

* Disease name
* Severity
* Confidence
* Scan date and time

---

### 🔹 Disease Library

Place image here:



<img width="831" height="973" alt="8" src="https://github.com/user-attachments/assets/236912cc-2cce-432d-97cc-4de8201364e1" />

<img width="1633" height="683" alt="Screenshot 2026-01-28 130205" src="https://github.com/user-attachments/assets/4a56c12e-2fa7-4ccd-8fe8-3d04fed6eaaf" />

<img width="1557" height="676" alt="Screenshot 2026-01-28 130211" src="https://github.com/user-attachments/assets/d55cb616-5f74-44ba-b76b-99bd45ee6f25" />

<img width="1535" height="586" alt="Screenshot 2026-01-28 130217" src="https://github.com/user-attachments/assets/a4cf201a-5ad3-4278-b4d4-1288e9ff315d" />

<img width="1563" height="693" alt="Screenshot 2026-01-28 130222" src="https://github.com/user-attachments/assets/4097ac91-3ba8-4645-9762-93ca90896124" />


<img width="798" height="847" alt="9" src="https://github.com/user-attachments/assets/6554cc06-89e6-4211-8042-492583f2c0ab" />



Contains detailed information about common tomato diseases:

* Early Blight
* Late Blight
* Leaf Mold
* Septoria Leaf Spot
* Bacterial Spot
* Tomato Mosaic Virus

Each disease includes:

* Symptoms
* Causes
* Treatment
* Prevention

---

### 🔹 Disease Result Page

Place image here:


<img width="1923" height="918" alt="7" src="https://github.com/user-attachments/assets/643671cd-8b4f-41de-a3e2-a169016fb328" />



Displays:

* Detected disease
* Severity level
* Confidence score
* Treatment steps
* Prevention recommendations

---

## 🧪 Backend System Explanation

The backend is developed using **Python** and exposes REST APIs for communication between frontend and deep learning model.

### Major Backend Responsibilities

* User authentication
* Image decoding and preprocessing
* Disease prediction
* Scan data storage
* History retrieval
* Disease information management

### Backend Testing Module

A Python-based automated API testing script is included.

It validates:

* User registration
* Login authentication
* Token verification
* Disease library API
* Image scanning
* Scan history
* Error handling

The testing script:

* Generates test leaf images
* Encodes them in Base64
* Sends API requests
* Validates responses
* Stores test results as JSON

This ensures backend reliability and correctness.

---

## 🛠️ Tools & Technologies Used

### 🔹 Frontend

* HTML5
* CSS3
* JavaScript
* Responsive UI design

### 🔹 Backend

* Python
* REST API architecture
* JSON-based communication

### 🔹 Deep Learning

* Convolutional Neural Networks (CNN)
* Image preprocessing
* Pattern recognition

### 🔹 Image Processing

* Pillow (PIL)
* Base64 encoding

### 🔹 Database

* Stores:

  * User details
  * Scan records
  * Disease metadata

### 🔹 Testing

* Python Requests library
* Automated API testing
* JSON test reports

---


## 🚀 Project Outcomes

* Accurate tomato disease detection
* Faster diagnosis compared to manual inspection
* Improved crop management
* Reduced financial losses
* User-friendly agricultural decision support system

---

## 🔮 Future Enhancements

* Mobile application support
* Multi-crop disease detection
* Weather-based disease prediction
* Multilingual farmer support
* Offline image analysis

---

## 👨‍💻 Developed By

**Ram Kumar N**
Department of Artificial Intelligence and Data Science

Deep Learning & AI-based Agricultural Solution

---

⭐ *If you find this project useful, give it a star on GitHub!*
