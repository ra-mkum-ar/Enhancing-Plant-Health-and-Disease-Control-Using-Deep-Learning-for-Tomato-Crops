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

Place image here:

```
/screenshots/home.png
```

Shows the landing interface introducing the system and its purpose.

---

### 🔹 Features Section

Place image here:

```
/screenshots/features.png
```

Displays key system capabilities:

* Instant analysis
* Treatment plans
* Scan history tracking

---

### 🔹 User Dashboard

Place image here:

```
/screenshots/dashboard.png
```

Allows users to:

* Upload plant images
* Access history
* Browse disease library

---

### 🔹 Scan History

Place image here:

```
/screenshots/history.png
```

Shows previous scans with:

* Disease name
* Severity
* Confidence
* Scan date and time

---

### 🔹 Disease Library

Place image here:

```
/screenshots/disease_library.png
```

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

```
/screenshots/result.png
```

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
