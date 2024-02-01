# use official Golang image
FROM golang:latest

WORKDIR /app

# Copy the local code to the container
COPY go.mod ./
COPY go.sum ./
COPY . .

# Download dependencies
RUN go mod download

# Build the Go application
RUN go build -o main ./cmd/api

# Expose the port your application will run on
EXPOSE 8000

# Command to run the executable
CMD ["./main"]
