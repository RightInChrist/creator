# MongoDB Collections for Agent Collaboration System

This directory contains JSON files that serve as seed data for the MongoDB collections used by the agent collaboration system. These files can be imported into MongoDB to set up the necessary data structures for the system to function.

## Collections Overview

### agents.json
Contains definitions for the specialized agents used in the collaboration system:
- **Product Manager Agent**: Leads requirements gathering and customer interactions
- **Technical Leader Agent**: Provides technical guidance and assessment
- **Designer Agent**: Ensures design and UX considerations are addressed

### workflows.json
Defines the product discovery workflow with its sequence of steps:
1. Initial Customer Interview
2. Requirements Refinement
3. Requirements Document Creation
4. Technical Review
5. Design Review
6. Finalize Requirements
7. Requirements Import to Task Management

### conversations.json
Contains a sample conversation demonstrating how the specialized agents interact with customers during the requirements gathering process. This serves as an example of the conversation data structure stored in MongoDB.

### requirements-import-example.json
Provides an example of the structured data that would be sent to the task management system's API endpoint for importing requirements. This shows how the agent collaboration output is transformed into actionable tasks.

## How to Use These Files

These files can be imported into MongoDB using the following methods:

### Using mongoimport

```bash
# Import agents collection
mongoimport --db work-manager --collection agents --file agents.json --jsonArray

# Import workflows collection
mongoimport --db work-manager --collection workflows --file workflows.json --jsonArray

# Import conversations collection
mongoimport --db work-manager --collection conversations --file conversations.json --jsonArray
```

### Using MongoDB Compass

1. Connect to your MongoDB instance using MongoDB Compass
2. Navigate to the work-manager database
3. Select the collection you want to import data into
4. Click on "Add Data" and select "Import File"
5. Select the corresponding JSON file and choose "JSON" as the file type
6. Click "Import"

## Integration with Task Management System

The output of the agent collaboration process is structured according to the RequirementsImport schema defined in the task management API. The requirements-import-example.json file demonstrates how this data is formatted.

To import requirements into the task management system:

1. Send a POST request to `/api/v1/requirements/import` endpoint
2. Include the JSON data from requirements-import-example.json in the request body
3. The task management system will process this data and create the corresponding epics, jobs-to-be-done, user stories, and tasks

## Data Structure Relationships

- **Agents** participate in **Workflows**
- **Workflows** consist of multiple **Steps**
- **Conversations** occur during workflow **Steps**
- **Conversations** involve **Agents** and humans
- **Conversations** produce structured requirements data
- Requirements data is imported into the task management system 