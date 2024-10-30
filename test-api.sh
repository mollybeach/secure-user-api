#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Server URL (read from .env or use default)
SERVER_PORT=3000  # Hardcode the port for testing
SERVER_URL="http://localhost:${SERVER_PORT}/api"

# Function to print with color
print_color() {
    color=$1
    message=$2
    echo -e "${color}${message}${NC}"
}

# Store the token
TOKEN_FILE=".token"

# Function to pretty print JSON if possible
print_json() {
    if command -v json_pp >/dev/null 2>&1; then
        echo "$1" | json_pp
    else
        echo "$1"
    fi
}

# Function to test registration
test_register() {
    print_color $BLUE "\nTesting Registration..."
    
    response=$(curl -s -X POST \
        "${SERVER_URL}/register" \
        -H "Content-Type: application/json" \
        -d '{"email": "user@example.com", "password": "Password123"}' \
        2>&1)
    
    print_color $BLUE "Response:"
    print_json "$response"
}

# Function to test login
test_login() {
    print_color $BLUE "\nTesting Login..."
    print_color $BLUE "Sending request to: ${SERVER_URL}/login"
    
    response=$(curl -s -X POST \
        "${SERVER_URL}/login" \
        -H "Content-Type: application/json" \
        -d '{"email": "user@example.com", "password": "Password123"}' \
        2>&1)
    
    print_color $BLUE "Response:"
    print_json "$response"
    
    if echo "$response" | grep -q "token"; then
        token=$(echo "$response" | grep -o '"token":"[^"]*' | grep -o '[^"]*$')
        echo "$token" > "$TOKEN_FILE"
        print_color $GREEN "Login successful! Token saved."
    else
        print_color $RED "Login failed! No token in response."
    fi
}

# Function to test getting users
test_get_users() {
    print_color $BLUE "\nTesting Get Users..."
    if [ ! -f $TOKEN_FILE ]; then
        print_color $RED "No token found. Please login first."
        exit 1
    fi
    
    token=$(cat $TOKEN_FILE)
    response=$(curl -H "Authorization: Bearer $token" "${SERVER_URL}/users" 2>/dev/null)
    print_color $BLUE "Response:"
    print_json "$response"
}

# Function to verify token
verify_token() {
    print_color $BLUE "\nVerifying Token..."
    if [ ! -f $TOKEN_FILE ]; then
        print_color $RED "No token found. Please login first."
        exit 1
    fi
    
    token=$(cat $TOKEN_FILE)
    response=$(curl -s -H "Authorization: Bearer $token" "${SERVER_URL}/verify-token")
    print_color $BLUE "Response:"
    echo $response | json_pp
}

# Main menu
show_menu() {
    echo -e "\n${GREEN}API Testing Menu${NC}"
    echo "1) Register"
    echo "2) Login"
    echo "3) Get Users"
    echo "4) Verify Token"
    echo "5) Run All Tests"
    echo "6) Clear Token"
    echo "q) Quit"
    echo -n "Select an option: "
}

# Make the script executable
chmod +x test-api.sh

# Main loop
while true; do
    show_menu
    read option
    case $option in
        1) test_register ;;
        2) test_login ;;
        3) test_get_users ;;
        4) verify_token ;;
        5)
            test_register
            test_login
            test_get_users
            verify_token
            ;;
        6)
            rm -f $TOKEN_FILE
            print_color $GREEN "Token cleared!"
            ;;
        q) 
            print_color $GREEN "Goodbye!"
            exit 0
            ;;
        *)
            print_color $RED "Invalid option"
            ;;
    esac
done
