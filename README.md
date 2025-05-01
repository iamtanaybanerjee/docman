# Docman

Docman is an API-based Document Management System that enables users to create folders with specific restrictions (e.g., file type and maximum file limit), upload files with metadata, and manage files and folders through operations like create, read, update, and delete.

## Features
- **Folder Management**:
  - Create folders with specified file type and maximum file limit.
  - Update folder details (e.g., max file limit).
  - Delete folders and all associated files.
  - Retrieve all folders with their files.

- **File Management**:
  - Upload files with metadata (description, max size 10MB) to folders, ensuring file type and limit compliance.
  - Update file descriptions.
  - Delete files.
  - Retrieve all files in a folder or filter by type across folders.
  - Sort files by size or upload timestamp.
  - Access file metadata.

- **File Storage**:
  - Uses Cloudinary for secure file storage.
  - Multer middleware for efficient file uploads.

## API Endpoints
Below is a summary of the available API endpoints.

| Method | Endpoint                                    | Description                              | Body (if applicable)                              |
|--------|---------------------------------------------|------------------------------------------|--------------------------------------------------|
| POST   | `/folder/create`                            | Create a new folder                      | `{"name": "Docs 3", "type": "pdf", "maxFileLimit": 5}` |
| PUT    | `/folders/:folderId`                        | Update a folder's details                | `{"maxFileLimit": 10}`                           |
| DELETE | `/folders/:folderId`                        | Delete a folder and its files            | None                                             |
| POST   | `/folders/:folderId/files`                  | Upload a file to a folder                | `multipart/form-data: {file: <file>, description: "abc"}` |
| PUT    | `/folders/:folderId/files/:fileId`          | Update a file's description              | `{"description": "Updated description for the file"}` |
| DELETE | `/folders/:folderId/files/:fileId`          | Delete a file                            | None                                             |
| GET    | `/folders`                                  | Get all folders with their files         | None                                             |
| GET    | `/folders/:folderId/files`                  | Get all files in a folder                | None                                             |
| GET    | `/folders/:folderId/filesBySort?sort=<type>`| Sort files by size or uploadedAt         | None                                             |
| GET    | `/files?type=<type>`                        | Get files by type across all folders     | None                                             |
| GET    | `/folders/:folderId/files/metadata`         | Get metadata of all files in a folder    | None                                             |
## Tech Stack
- **Language**: JavaScript
- **Framework**: Node.js, Express
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **File Storage**: Cloudinary
- **File Upload**: Multer middleware

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/docman.git
   cd docman
2. Install dependencies:
   ```bash
   npm install
3. Set up environment variables in a .env file:
  ```bash
  DB_HOST= your_db_host
  DB_USER=your_db_user
  DB_PASSWORD=your_db_password
  DB_NAME=postgres
  DB_PORT = 5432
  PORT = 3000

  CLOUDINARY_CLOUD_NAME= your_cloud_name
  CLOUDINARY_API_KEY= your_api_key
  CLOUDINARY_API_SECRET= your_api_secret
  ```
4. Initialize the database:
   ```bash
   npx sequelize-cli db:migrate
   ```
5. Start the server:
   ```bash
   npm start
   ```
The API will be available at http://localhost:3000
