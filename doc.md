# Sub-partner API

This API allows you to manage sub-partners, including adding, editing, and deleting sub-partners, as well as retrieving and updating their status.

## Endpoints

### POST /add 
- Add a new sub-partner.
- Request body should include email, _password, sub_partner_Name, and _status.
- The partner_id will be taken from the authenticated user's ID.
- Returns a JSON object with a message and the results of the query.

### GET /get_all 
- Retrieve all sub-partners for the authenticated user.
- Returns a JSON object with the partner's information.

### GET /get/:id 
- Retrieve a specific sub-partner by ID.
- Returns a JSON object with the sub-partner's information.

### PUT /edit 
- Edit an existing sub-partner.
- Request body should include id, email, sub_partner_Name, and _status.
- The partner_id will be taken from the authenticated user's ID.
- Returns a JSON object with a message and the results of the query.

### DELETE /remove/:id 
- Remove a specific sub-partner by ID.
- Returns a JSON object with a message and the results of the query.

### PUT /change_lock_status 
- Change the lock status of a specific sub-partner.
- Request body should include id and _status (true for unlocked, false for blocked).
- Returns a JSON object with a message and the results of the query.

### PUT /change_password 
- Change the password of a specific sub-partner.
- Request body should include id, old_password, and new_password.
- Returns a JSON object with a message and the results of the query.

**Note**:
- _status should be passed as boolean, where true equals to 'unlocked' and false equals to 'blocked'
- Encrypte and compare functions are used for encryption and comparison of passwords respectively, these functions are imported from ../Utils/Crypto
- SqlQuery function is used for executing the SQL query that connects to the database.
- connection.escape(value) is used for preventing SQL injection.
- req.user is expected to have the id property, It should be populated by the middleware that handles user authentication
