#!/bin/bash

# Study Tracker Application - Docker Management Tool

show_menu() {
    echo ""
    echo "===================================="
    echo "  Docker Management Tool"
    echo "===================================="
    echo "1. Start all services"
    echo "2. Stop all services"
    echo "3. Restart all services"
    echo "4. View logs (all services)"
    echo "5. View logs (backend only)"
    echo "6. View logs (frontend only)"
    echo "7. View logs (MongoDB only)"
    echo "8. Check service status"
    echo "9. View service details"
    echo "10. Clean up (remove containers & volumes)"
    echo "11. Exit"
    echo "===================================="
    echo ""
}

while true; do
    show_menu
    read -p "Enter your choice [1-11]: " choice
    
    case $choice in
        1)
            echo "Starting all services..."
            docker-compose up -d
            docker-compose ps
            ;;
        2)
            echo "Stopping all services..."
            docker-compose down
            ;;
        3)
            echo "Restarting all services..."
            docker-compose restart
            docker-compose ps
            ;;
        4)
            echo "Showing logs for all services..."
            docker-compose logs -f
            ;;
        5)
            echo "Showing logs for backend..."
            docker-compose logs -f backend
            ;;
        6)
            echo "Showing logs for frontend..."
            docker-compose logs -f frontend
            ;;
        7)
            echo "Showing logs for MongoDB..."
            docker-compose logs -f mongo
            ;;
        8)
            echo "Service status:"
            docker-compose ps
            ;;
        9)
            echo "Service details:"
            docker-compose ps -a
            echo ""
            echo "Network info:"
            docker network ls
            echo ""
            echo "Volume info:"
            docker volume ls
            ;;
        10)
            read -p "Are you sure you want to clean up? (y/n): " confirm
            if [ "$confirm" = "y" ]; then
                echo "Cleaning up..."
                docker-compose down -v
                echo "Cleanup complete!"
            fi
            ;;
        11)
            echo "Exiting..."
            exit 0
            ;;
        *)
            echo "Invalid choice. Please try again."
            ;;
    esac
done
