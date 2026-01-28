#!/usr/bin/env python3

import requests
import sys
import json
import base64
from datetime import datetime
from io import BytesIO
from PIL import Image
import time

class PlantDefenderAPITester:
    def __init__(self, base_url="https://plant-defender-11.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=30)

            print(f"   Status: {response.status_code}")
            
            success = response.status_code == expected_status
            
            if success:
                try:
                    response_data = response.json()
                    self.log_test(name, True)
                    return True, response_data
                except:
                    self.log_test(name, True, "No JSON response")
                    return True, {}
            else:
                try:
                    error_data = response.json()
                    self.log_test(name, False, f"Expected {expected_status}, got {response.status_code}. Error: {error_data}")
                except:
                    self.log_test(name, False, f"Expected {expected_status}, got {response.status_code}. Response: {response.text}")
                return False, {}

        except Exception as e:
            self.log_test(name, False, f"Exception: {str(e)}")
            return False, {}

    def create_test_image(self):
        """Create a test tomato leaf image in base64 format"""
        # Create a simple test image with some visual features
        img = Image.new('RGB', (400, 300), color=(34, 139, 34))  # Forest green
        
        # Add some visual features to make it look like a leaf
        from PIL import ImageDraw
        draw = ImageDraw.Draw(img)
        
        # Draw some leaf-like patterns
        draw.ellipse([50, 50, 350, 250], fill=(0, 100, 0), outline=(0, 0, 0))  # Dark green with black outline
        draw.ellipse([100, 80, 300, 220], fill=(144, 238, 144))  # Light green
        
        # Add some spots to simulate disease
        draw.ellipse([150, 120, 180, 150], fill=(165, 42, 42))  # Brown
        draw.ellipse([200, 160, 230, 190], fill=(101, 67, 33))  # Dark brown
        
        # Convert to base64
        buffer = BytesIO()
        img.save(buffer, format='JPEG')
        img_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        
        return img_base64

    def test_user_registration(self):
        """Test user registration"""
        timestamp = datetime.now().strftime('%H%M%S')
        test_data = {
            "email": f"test_user_{timestamp}@example.com",
            "password": "TestPass123!",
            "name": f"Test User {timestamp}"
        }
        
        success, response = self.run_test(
            "User Registration",
            "POST",
            "auth/register",
            200,
            data=test_data
        )
        
        if success and 'token' in response and 'user' in response:
            self.token = response['token']
            self.user_id = response['user']['id']
            print(f"   Registered user: {response['user']['email']}")
            return True
        return False

    def test_user_login(self):
        """Test user login with existing credentials"""
        # First register a user
        timestamp = datetime.now().strftime('%H%M%S')
        register_data = {
            "email": f"login_test_{timestamp}@example.com",
            "password": "TestPass123!",
            "name": f"Login Test {timestamp}"
        }
        
        # Register first
        reg_success, reg_response = self.run_test(
            "User Registration for Login Test",
            "POST",
            "auth/register",
            200,
            data=register_data
        )
        
        if not reg_success:
            return False
        
        # Now test login
        login_data = {
            "email": register_data["email"],
            "password": register_data["password"]
        }
        
        success, response = self.run_test(
            "User Login",
            "POST",
            "auth/login",
            200,
            data=login_data
        )
        
        if success and 'token' in response:
            # Update token for subsequent tests
            self.token = response['token']
            self.user_id = response['user']['id']
            print(f"   Logged in user: {response['user']['email']}")
            return True
        return False

    def test_auth_me(self):
        """Test getting current user info"""
        if not self.token:
            self.log_test("Get Current User", False, "No token available")
            return False
        
        success, response = self.run_test(
            "Get Current User",
            "GET",
            "auth/me",
            200
        )
        
        if success and 'email' in response:
            print(f"   Current user: {response['email']}")
            return True
        return False

    def test_diseases_endpoint(self):
        """Test diseases library endpoint"""
        success, response = self.run_test(
            "Get Diseases Library",
            "GET",
            "diseases",
            200
        )
        
        if success and isinstance(response, list) and len(response) > 0:
            print(f"   Found {len(response)} diseases")
            # Check if diseases have required fields
            first_disease = response[0]
            required_fields = ['id', 'name', 'description', 'symptoms', 'causes', 'treatment', 'prevention']
            
            for field in required_fields:
                if field not in first_disease:
                    self.log_test("Diseases Structure Validation", False, f"Missing field: {field}")
                    return False
            
            self.log_test("Diseases Structure Validation", True)
            return True
        return False

    def test_scan_creation(self):
        """Test creating a scan with image analysis"""
        if not self.token:
            self.log_test("Create Scan", False, "No token available")
            return False
        
        print("   Creating test image...")
        test_image = self.create_test_image()
        
        scan_data = {
            "image_base64": test_image
        }
        
        print("   Sending scan request (this may take 10-15 seconds for AI analysis)...")
        success, response = self.run_test(
            "Create Scan with AI Analysis",
            "POST",
            "scans",
            200,
            data=scan_data
        )
        
        if success and 'id' in response:
            self.scan_id = response['id']
            print(f"   Scan created with ID: {self.scan_id}")
            print(f"   Disease detected: {response.get('disease_detected', 'Unknown')}")
            print(f"   Confidence: {response.get('confidence', 'Unknown')}")
            print(f"   Severity: {response.get('severity', 'Unknown')}")
            return True
        return False

    def test_get_scan(self):
        """Test retrieving a specific scan"""
        if not hasattr(self, 'scan_id') or not self.scan_id:
            self.log_test("Get Specific Scan", False, "No scan ID available")
            return False
        
        success, response = self.run_test(
            "Get Specific Scan",
            "GET",
            f"scans/{self.scan_id}",
            200
        )
        
        if success and 'id' in response:
            print(f"   Retrieved scan: {response['id']}")
            return True
        return False

    def test_get_scans_history(self):
        """Test getting user's scan history"""
        if not self.token:
            self.log_test("Get Scan History", False, "No token available")
            return False
        
        success, response = self.run_test(
            "Get Scan History",
            "GET",
            "scans",
            200
        )
        
        if success and isinstance(response, list):
            print(f"   Found {len(response)} scans in history")
            return True
        return False

    def test_invalid_login(self):
        """Test login with invalid credentials"""
        invalid_data = {
            "email": "nonexistent@example.com",
            "password": "wrongpassword"
        }
        
        success, response = self.run_test(
            "Invalid Login Test",
            "POST",
            "auth/login",
            401,
            data=invalid_data
        )
        
        return success  # Success means we got the expected 401 status

    def run_all_tests(self):
        """Run all API tests"""
        print("🚀 Starting Plant Defender API Tests")
        print(f"   Base URL: {self.base_url}")
        print("=" * 60)
        
        # Test authentication flow
        if not self.test_user_registration():
            print("❌ Registration failed, stopping tests")
            return False
        
        if not self.test_user_login():
            print("❌ Login failed, continuing with registration token")
        
        if not self.test_auth_me():
            print("❌ Auth verification failed")
        
        # Test invalid login
        self.test_invalid_login()
        
        # Test diseases endpoint (no auth required)
        if not self.test_diseases_endpoint():
            print("❌ Diseases endpoint failed")
        
        # Test scan functionality
        if not self.test_scan_creation():
            print("❌ Scan creation failed")
        else:
            # Only test scan retrieval if creation succeeded
            self.test_get_scan()
        
        # Test scan history
        self.test_get_scans_history()
        
        # Print final results
        print("\n" + "=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return True
        else:
            print("⚠️  Some tests failed. Check details above.")
            return False

def main():
    tester = PlantDefenderAPITester()
    success = tester.run_all_tests()
    
    # Save detailed results
    results = {
        "timestamp": datetime.now().isoformat(),
        "total_tests": tester.tests_run,
        "passed_tests": tester.tests_passed,
        "success_rate": f"{(tester.tests_passed/tester.tests_run)*100:.1f}%" if tester.tests_run > 0 else "0%",
        "test_details": tester.test_results
    }
    
    with open('/app/backend_test_results.json', 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n📄 Detailed results saved to: /app/backend_test_results.json")
    
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())