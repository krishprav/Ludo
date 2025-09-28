#!/bin/bash

# Enhanced Multiplayer Ludo - Development Setup Script
# This script sets up the development environment for the project

echo "🎯 Setting up Enhanced Multiplayer Ludo Development Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node --version)
        print_status "Node.js is installed: $NODE_VERSION"
        
        # Check if version is >= 16
        NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
        if [ "$NODE_MAJOR" -ge 16 ]; then
            print_status "Node.js version is compatible (>=16)"
        else
            print_error "Node.js version must be 16 or higher"
            exit 1
        fi
    else
        print_error "Node.js is not installed. Please install Node.js 16+ from https://nodejs.org/"
        exit 1
    fi
}

# Check if npm is installed
check_npm() {
    if command -v npm &> /dev/null; then
        NPM_VERSION=$(npm --version)
        print_status "npm is installed: $NPM_VERSION"
    else
        print_error "npm is not installed"
        exit 1
    fi
}

# Install frontend dependencies
install_frontend() {
    print_info "Installing frontend dependencies..."
    if npm install; then
        print_status "Frontend dependencies installed successfully"
    else
        print_error "Failed to install frontend dependencies"
        exit 1
    fi
}

# Install backend dependencies
install_backend() {
    print_info "Installing backend dependencies..."
    cd backend
    if npm install; then
        print_status "Backend dependencies installed successfully"
        cd ..
    else
        print_error "Failed to install backend dependencies"
        exit 1
    fi
}

# Setup environment files
setup_env() {
    print_info "Setting up environment files..."
    
    # Backend .env
    if [ ! -f "backend/.env" ]; then
        cat > backend/.env << EOF
CONNECTION_URI=mongodb+srv://username:password@cluster.mongodb.net/database
PORT=8080
NODE_ENV=development
EOF
        print_warning "Created backend/.env file. Please update with your MongoDB connection string"
    else
        print_status "Backend .env file already exists"
    fi
    
    # Frontend .env
    if [ ! -f ".env" ]; then
        cat > .env << EOF
REACT_APP_API_URL=http://localhost:8080
GENERATE_SOURCEMAP=false
EOF
        print_status "Created frontend .env file"
    else
        print_status "Frontend .env file already exists"
    fi
}

# Verify Tailwind CSS setup
verify_tailwind() {
    print_info "Verifying Tailwind CSS setup..."
    
    if [ -f "tailwind.config.js" ] && [ -f "postcss.config.js" ]; then
        print_status "Tailwind CSS configuration files found"
    else
        print_error "Tailwind CSS configuration files missing"
        exit 1
    fi
    
    # Check if Tailwind directives are in index.css
    if grep -q "@tailwind base" src/index.css; then
        print_status "Tailwind directives found in index.css"
    else
        print_error "Tailwind directives missing in src/index.css"
        exit 1
    fi
}

# Run linting
run_linting() {
    print_info "Running ESLint..."
    if npm run lint 2>/dev/null || npx eslint src/ --ext .js,.jsx; then
        print_status "Linting completed"
    else
        print_warning "Linting found some issues (non-blocking)"
    fi
}

# Run tests
run_tests() {
    print_info "Running tests..."
    if npm test -- --watchAll=false --passWithNoTests; then
        print_status "All tests passed"
    else
        print_warning "Some tests failed (non-blocking)"
    fi
}

# Build project
build_project() {
    print_info "Building project..."
    if npm run build; then
        print_status "Project built successfully"
    else
        print_error "Build failed"
        exit 1
    fi
}

# Main setup function
main() {
    echo "🚀 Starting development environment setup..."
    echo ""
    
    # Check prerequisites
    print_info "Checking prerequisites..."
    check_node
    check_npm
    echo ""
    
    # Install dependencies
    print_info "Installing dependencies..."
    install_frontend
    install_backend
    echo ""
    
    # Setup environment
    setup_env
    echo ""
    
    # Verify setup
    verify_tailwind
    echo ""
    
    # Run checks
    run_linting
    echo ""
    
    run_tests
    echo ""
    
    build_project
    echo ""
    
    # Success message
    echo "🎉 Development environment setup completed successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Update backend/.env with your MongoDB connection string"
    echo "2. Start the backend: cd backend && npm start"
    echo "3. Start the frontend: npm start"
    echo "4. Open http://localhost:3000 in your browser"
    echo ""
    echo "🔧 Available commands:"
    echo "- npm start          # Start frontend development server"
    echo "- npm test           # Run tests"
    echo "- npm run build      # Build for production"
    echo "- npm run lint       # Run ESLint"
    echo ""
    echo "📚 Documentation:"
    echo "- README.md          # Project overview and documentation"
    echo ""
    echo "Happy coding! 🎯"
}

# Run main function
main "$@"

