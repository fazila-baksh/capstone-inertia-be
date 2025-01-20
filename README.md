# inertia

## Overview

inertia is a lifestyle app that allows users to track their daily habits. It is designed to help individuals maintain consistency in building habits and stay motivated.

### Problem Space

Building and maintaining habits can be challenging, especially without a system to track progress and stay motivated. Inertia addresses this pain point by providing a user-friendly platform for habit tracking, enabling users to visualize their progress and build consistent routines.

### User Profile

Who will use your app?

- Individuals looking to develop and maintain positive habits.
- Individuals seeking a simple and effective tool to track their progress.

How will they use it?

- Users will add the habits they would like to track and check off completed habits daily and review their progress.

### Features

- As a user, I want to be able to create a list of habits I want to track (e.g., exercise, reading, hydration).
- As a user, I want to be able to set goals for my habits (e.g. 7 days a week).
- As a user, I want to be able to track my progress (how many times have I completed the habit in a week/month)
- As a user, I want to log my daily progress for each habit (e.g., mark that I exercised today).
- As a user, I want to view my progress over time for each habit.

## Implementation

### Tech Stack

- React
- Express
- React-router
- React-router-dom
- Axios
- Chart.js
- MySQL Database
- Knex
- CORS

### APIs

Daily affirmations API (https://www.affirmations.dev/)

### Sitemap

Home Page:
- A daily affirmations banner
- Overview of all habits
- Ability to add new habits
- A "Rate your day" section, where users can click the emoji that best describes their day and write one sentence summarizing their day.

Individual Habit Page:
- The description of the habit and the user's weekly goal for the habit ("x" times a week)
- Ability to edit the habit
- Ability to delete the habit
- A graph showing the yearly progress of that habit

Weekly Habit Page:

- Overview of all habits and the progress for that week

Add Page:

- Add a new habit for tracking

Edit Page:

- Edit a specific habit to make it more specific/aligned with personal goals

### Endpoints

## Get Endpoints

**GET /:userId**

- gives user name and user id
- gets user id from param and gives username and user id from users table

```
[
    {
        "id": 1,
        "username": "bob"
    },
...
]
```

**GET /:userId/habits/daily**

- gives list of habits for that user
- gets user id from params, uses that to get all habits from habits table, then looks at habit logs table to see if the habit was completed for today

```
[
    {
        "habit_id": 1,
        "habit_name": "exercise",
        "log_id": 160
    },
...
]
```

**GET /:userId/habits/weekly**

- gives list of habits for that user and a list of when each habit was completed that week
- gets user id from params, uses that to get all habits from habits table, then searches the habit logs table for each habit to find all logs for this current week

```
[
   {
        "habit_id": 1,
        "habit_name": "exercise",
        "goal_frequency": 4,
        "weeklyTracking": [
            {
                "day": "Sunday",
                "completed": 1
            }
        ]
    },
...
]
```

**GET /:userId/habits/:habitId**

- gets details for a specific habit
- gets habit id from params, then searches habits table to get details of the habit, then goes through habit logs table and counts how many times the habit was completed for each month

```
[
    {
    "habit_id": 1,
    "habit_name": "exercise",
    "description": "1 hour workout 4 times a week",
    "goal_frequency": 4,
    "graphYValues": [
        11,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        0
    ]
},
...
]
```

**GET /:userId/api/affirmations**

- gets affirmation from api

```
{
    "affirmation": "You're doing a great job"
}
```

## Post Endpoints

**POST /:userId/habits/add**

- adds new habit
- gets habit name, description and goal frequency from request body and adds new habit to the habits table

**POST /:userId/habits/:habitId**

- adds new log for specific habit
- gets log date, completed and log month from request body, then adds new log to habit logs table

## Delete Endpoints

**DELETE /:userId/habits/:habitId**

- deletes habit from habit table
- gets habit id from params and deletes habit fom habits table

**DELETE /:userId/habits/:logId**

- deletes log from habit logs table
- gets log id from params and deletes log from habit logs table

##Put Endpoint

**PUT /:userId/habits/:habitId/edit**

- updates habit in habits table
- gets habit id from params and gets updated habit name, description and goal frequency from request body, then updates that habit in habits table

## Roadmap

- Create client (front-end)

  - create react app and outline basic file structure

- Create server (back-end)

- Create migration

- Create seeds with sample habit data

- Feature: Homepage

  - build and style homepage
  - api call for affirmation banner
  - create GET/habits endpoint to get all habits and display in a list
  - create POST end point to store data when habit is completed
  - Add Page
    - build and style add page
    - create POST endpoint to add habit

- Feature: Weekly Page

  - build and style weekly page
  - create GET/weekly endpoint to get all habits and display in a chart

- Feature: Individual Habit

  - build and style indiviual habit page
  - create GET/habit endpioint to get the specific habit based on id and display information
  - create GET/habit endpoint to get the year data and display on line graph
  - Edit Page:
    - build and style edit habit pages
    - create PUT endpoint to edit a habit
  - build and style delete modal
  - create DELETE

- Debug

- DEMO!

## Future Implementations

- Authentication: user registration and login

- Rate your day: Currently the rate your day function is only stored in the database. I would like to add a component on the weekly page that shows all the entries for that week

- Journal: include a way for users to write daily journal entires

- Historical data: users have the abilitity to access weekly data from past weeks and not only the current week
