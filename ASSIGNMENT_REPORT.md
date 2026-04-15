# Full-Stack Integration Report: MongoDB & Express Backend

## 1. Objective
The objective of this integration process was to connect the previously developed frontend forms to a MongoDB database using a Node.js/Express backend server. This ensures data persistence, allowing form submissions to be stored, retrieved, and managed dynamically rather than relying on local storage.

## 2. Technology Stack
- **Frontend**: React.js (Vite) / Tailwind CSS
- **Backend**: Node.js, Express.js (Version 5.0)
- **Database**: MongoDB Atlas (Cloud)
- **ODM**: Mongoose (for schema modeling)
- **Middleware**: CORS (Cross-Origin Resource Sharing), Dotenv (Environment variables), Express.json()

## 3. Implementation Details

### A. Backend Architecture
The backend was built using **Express 5.0**. A centralized `server.js` file handles the database connection, schema definition, and API routes.

- **Database Connection**: Utilized a secure `mongodb+srv` connection string stored in an `.env` file for security. Mongoose was used to establish a stable connection to the `canva_user` database.
- **Mongoose Schema**: A structured schema was defined to match the form fields:
  ```javascript
  const jobSchema = new mongoose.Schema({
      company: { type: String, required: true },
      role: { type: String, required: true },
      location: String,
      salary: String,
      status: { type: String, enum: ['wishlist', 'applied', 'interview', 'offer', 'rejected'] },
      url: String,
      appliedDate: String,
      id: String
  }, { timestamps: true });
  ```

### B. API Route Design
Appropriate endpoints were created to handle CRUD (Create, Read, Update, Delete) operations:
- **POST `/api/save`**: Receives JSON data from the form, validates it against the schema, and persists it to MongoDB using `await newJob.save()`.
- **GET `/api/jobs`**: Retrieves all stored entries to display on the dashboard.
- **PUT `/api/jobs/:id`**: Handles status updates and edits.
- **DELETE `/api/jobs/:id`**: Removes records from the database.

### C. Frontend Integration
The frontend was updated to communicate with the backend via the `fetch` API:
1. **Form Interception**: The job submission form was assigned `id="myForm"`. A script intercepts the `onSubmit` event.
2. **Data Transformation**: `FormData` was converted into a clean JSON object before transmission.
3. **Hardcoded Endpoint Binding**: The fetch URL was set to `http://localhost:5000/api/save` to ensure connectivity across different local development ports (e.g., Live Server on 5500).

## 4. Error Handling and Validation
- **Schema Validation**: Mongoose enforces 'required' fields and 'enum' constraints at the database level.
- **Asynchronous Try-Catch Blocks**: All API routes use `try-catch` blocks to handle runtime errors (e.g., database connection timeouts) and return appropriate HTTP status codes (404, 500).
- **Frontend Fallbacks**: Implemented error logging in the console to alert the developer if the backend is unreachable.

## 5. Verification Process
A dedicated verification script `check.js` was used to confirm successful integration:
- **Querying the DB**: The script connects to the live MongoDB Atlas cluster.
- **Proof of Work**: It fetches and logs the last 3 entries added to the database, proving that data sent from the dashboard successfully reached the cloud storage.

### Sample Verification Output:
```text
Connected to MongoDB.
Last 3 entries in "jobs" collection:
1. [Apple] Product Designer - Status: interview (Created: 2026-04-16)
2. [Linear] Frontend Engineer - Status: applied (Created: 2026-04-16)
3. [Test Co] Software Engineer - Status: applied (Created: 2026-04-16)
```

## 6. Conclusion
The integration successfully bridges the gap between the static frontend and a persistent cloud database. The use of Express 5.0 and Mongoose provides a modern, scalable foundation for the application while ensuring data integrity through strict schema validation.
