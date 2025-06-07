package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
)

func main() {
	// Configuration would typically come from environment variables
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	// Create a new router
	r := mux.NewRouter()

	// Health check endpoint - keep both versions to handle with/without the api prefix
	r.HandleFunc("/health", healthHandler).Methods("GET")
	r.HandleFunc("/api/health", healthHandler).Methods("GET")

	// Contact form endpoint
	r.HandleFunc("/contact", contactHandler).Methods("POST")
	r.HandleFunc("/api/contact", contactHandler).Methods("POST")

	// CORS middleware
	corsMiddleware := func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			w.Header().Set("Access-Control-Allow-Origin", "*")
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

			if r.Method == "OPTIONS" {
				w.WriteHeader(http.StatusOK)
				return
			}

			next.ServeHTTP(w, r)
		})
	}

	// Apply CORS middleware
	handler := corsMiddleware(r)

	// Start the server
	fmt.Printf("Server running on port %s\n", port)
	if err := http.ListenAndServe(":"+port, handler); err != nil {
		log.Fatalf("Error starting server: %v", err)
	}
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"status":"ok"}`))
}

func contactHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Here you would process the contact form submission
	// This is just a placeholder that returns a success response

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"success":true,"message":"Your message has been received successfully!"}`))
}
