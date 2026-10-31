# QuickNotes API Design

## Endpoints

1. **List notes**
   * **Method:** GET
   * **Path:** `/notes`
   * **Description:** Retrieves a list of all notes for the authenticated user.
   * **Success Status:** 200 OK

2. **Get one note**
   * **Method:** GET
   * **Path:** `/notes/:id`
   * **Description:** Retrieves details of a specific note by ID.
   * **Success Status:** 200 OK

3. **Create a note**
   * **Method:** POST
   * **Path:** `/notes`
   * **Description:** Creates a new note for the authenticated user.
   * **Success Status:** 201 Created

4. **Update a note**
   * **Method:** PUT
   * **Path:** `/notes/:id`
   * **Description:** Completely replaces the title and body of an existing note.
   * **Success Status:** 200 OK

5. **Delete a note**
   * **Method:** DELETE
   * **Path:** `/notes/:id`
   * **Description:** Deletes a specific note.
   * **Success Status:** 204 No Content

6. **List notes by tag**
   * **Method:** GET
   * **Path:** `/notes?tag={tagName}`
   * **Description:** Retrieves notes filtered by a specific tag.
   * **Success Status:** 200 OK

## JSON Examples

### POST /notes (Create)
**Request Body:**

    {
      "title": "Grocery List",
      "body": "Milk, Eggs, Bread, Coffee"
    }

**Response Body (201 Created):**

    {
      "id": 101,
      "title": "Grocery List",
      "body": "Milk, Eggs, Bread, Coffee",
      "createdAt": "2026-10-31T20:00:00Z"
    }


### GET /notes (List)
**Response Body (200 OK):**

    [
      {
        "id": 101,
        "title": "Grocery List",
        "body": "Milk, Eggs, Bread, Coffee",
        "createdAt": "2026-10-31T20:00:00Z"
      }
    ]


## Error Codes
* **400 Bad Request:** Missing required fields or validation failure (e.g., title > 100 characters).
* **401 Unauthorized:** User is not logged in or missing auth token.
* **403 Forbidden:** User is logged in but attempting to access/delete a note owned by someone else.
* **404 Not Found:** Note ID does not exist.
* **500 Internal Server Error:** Database crash or unexpected server failure.

**Example Error Body (400 Bad Request):**

    {
      "error": "Validation Failed",
      "message": "Title cannot exceed 100 characters."
    }