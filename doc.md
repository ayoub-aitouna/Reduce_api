GET /get_all

Description: Retrieves all sub_partner data
Response:
200: An array of sub_partner objects
GET /:id

Description: Retrieves a specific sub_partner by id
Parameters:
id: The id of the sub_partner to retrieve
Response:
200: A sub_partner object
404: The sub_partner with the specified id does not exist
POST /add

Description: Add a new sub_partner
Request Body: A JSON object containing the sub_partner data
Response:
201: The new sub_partner object
400: Invalid sub_partner data provided
POST /edit

Description: Edit an existing sub_partner
Request Body: A JSON object containing the sub_partner data
Response:
200: The updated sub_partner object
400: Invalid sub_partner data provided
PUT /change_lock_status

Description: Change the lock status of a sub_partner
Request Body: A JSON object containing the sub_partner id and the new lock status
Response:
200: The updated sub_partner object
400: Invalid sub_partner id or lock status provided
PUT /change_password

Description: Change the password of a sub_partner
Request Body: A JSON object containing the sub_partner id and the new password
Response:
200: Success message
400: Invalid sub_partner id or password provided
DELETE /remove/:id

Description: Remove a sub_partner by id
Parameters:
id: The id of the sub_partner to remove
Response:
200: Success message
400: Invalid sub_partner id provided
This is the documentation for the sub_partner API, it's allow you to :

Retrieve all sub_partners or a specific sub_partner by id
Add a new sub_partner
Edit an existing sub_partner
Change the lock status of a sub_partner
Change the password of a sub_partner
Remove a sub_partner by id.