import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);
import express from "express";
import axios from "axios";
const router = express.Router();

router.post("/:userId/habits/add", async (req, res) => {
  const userId = req.params.userId;
  const { habit_name, description, goal_frequency } = req.body;

  try {
    if (!habit_name || !description || !goal_frequency) {
      return res.status(400).json({
        message: `Request body has missing properties`,
      });
    }

    const userIdExists = await knex("users").where("user_id", userId).first();
    if (!userIdExists) {
      return res.status(404).json({
        message: `User with user ID ${userId} not found`,
      });
    }

    if (typeof goal_frequency !== "number") {
      return res.status(404).json({
        message: `Goal frequency is not a number`,
      });
    }

    const data = {
      habit_name: habit_name,
      description: description,
      goal_frequency: goal_frequency,
      user_id: userId,
    };

    const result = await knex("habits").insert(data);
    const newHabitId = result[0];
    const newHabitItem = await knex("habits").where({
      habit_id: newHabitId,
    });

    res.status(201).json(newHabitItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `Error creating new habit`,
    });
  }
});

router.put("/:userId/habits/:habitId/edit", async (req, res) => {
  const habitId = req.params.habitId;
  const { habit_name, description, goal_frequency } = req.body;

  try {
    if (!habit_name || !description || !goal_frequency) {
      return res.status(400).json({
        message: `Request body has missing properties`,
      });
    }

    const habitIdExists = await knex("habits")
      .where("habit_id", habitId)
      .first();
    if (!habitIdExists) {
      return res.status(404).json({
        message: `Habit with habit ID ${habitId} not found`,
      });
    }

    if (typeof goal_frequency !== "number") {
      return res.status(404).json({
        message: `Goal frequency is not a number`,
      });
    }

    const result = await knex("habits")
      .where({ habit_id: habitId })
      .update(req.body);

    const updatedHabit = await knex("habits").where({ habit_id: habitId });

    res.status(200).json(updatedHabit);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `Error updating habit`,
    });
  }
});

router.delete("/:userId/habits/:habitId", async (req, res) => {
  const habitId = req.params.habitId;

  try {
    const deleteHabit = await knex("habits").where({ habit_id: habitId }).del();

    if (deleteHabit === 0) {
      return res.status(404).json({
        message: `Habit with habit ID ${habitId} not found`,
      });
    }

    res.status(200).json({ message: "Habit deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `Error deleting habit`,
    });
  }
});

router.delete("/:userId/logs/:logId", async (req, res) => {
  const logId = req.params.logId;

  try {
    const deleteLog = await knex("habit_logs").where({ log_id: logId }).del();

    if (deleteLog === 0) {
      return res.status(404).json({
        message: `Log with log ID ${logId} not found`,
      });
    }

    res.status(200).json({ message: "Log deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `Error deleting log`,
    });
  }
});

router.post("/:userId/habits/:habitId", async (req, res) => {
  const habitId = req.params.habitId;
  const { log_date, completed, log_month } = req.body;

  try {
    if (!log_date || !completed || !log_month) {
      return res.status(400).json({
        message: `Request body has missing properties`,
      });
    }

    const habitIdExists = await knex("habits")
      .where("habit_id", habitId)
      .first();

    if (!habitIdExists) {
      return res.status(404).json({
        message: `Habit with habit ID ${habitId} not found`,
      });
    }

    if (typeof completed !== "boolean") {
      return res.status(404).json({
        message: `Completed is not a boolean`,
      });
    }

    const data = {
      log_date: log_date,
      log_month: log_month,
      completed: completed,
      habit_id: habitId,
    };

    const result = await knex("habit_logs").insert(data);
    const newLogId = result[0];
    const newLogItem = await knex("habit_logs").where({
      log_id: newLogId,
    });

    res.status(201).json(newLogItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: `Error creating new log`,
    });
  }
});

router.get("/:userId/api/affirmations", async (req, res) => {
  try {
    const response = await axios.get("https://www.affirmations.dev");
    res.json({ affirmation: response.data.affirmation });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch affirmation" });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await knex("users").where({ user_id: userId }).first();

    if (!user) {
      return res.status(404).send("User not found");
    }

    res.status(200).json({
      id: user.user_id,
      username: user.username,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Failed to fetch user id" });
  }
});

router.get("/:userId/habits/daily", async (req, res) => {
  try {
    const userId = req.params.userId;
    const currDate = new Date().toLocaleDateString("en-CA");

    const habits = await knex("habits")
      .where({ user_id: userId })
      .select("habit_id", "habit_name");

    const data = await Promise.all(
      habits.map(async (habit) => ({
        habit_id: habit.habit_id,
        habit_name: habit.habit_name,
        log_id:
          (
            await knex("habit_logs")
              .where({ habit_id: habit.habit_id, log_date: currDate })
              .select("log_id")
              .first()
          )?.log_id || 0,
      }))
    );

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).send("error fetching data");
  }
});

router.get("/:userId/habits/weekly", async (req, res) => {
  try {
    const userId = req.params.userId;

    // Code to get the start and end of the week
    const curr = new Date(); // get current date
    const first = curr.getDate() - curr.getDay(); // first day = day of month - day of week
    const last = first + 6;
    const startOfWeek = new Date(curr.setDate(first)).toLocaleDateString(
      "en-CA"
    );
    const endOfWeek = new Date(curr.setDate(last)).toLocaleDateString("en-CA");

    const habits = await knex("habits")
      .where({ user_id: userId })
      .select("habits.habit_id", "habits.habit_name", "habits.goal_frequency");

    const data = await Promise.all(
      habits.map(async (habit) => ({
        habit_id: habit.habit_id,
        habit_name: habit.habit_name,
        goal_frequency: habit.goal_frequency,
        weeklyTracking: await knex("habit_logs")
          .where({ habit_id: habit.habit_id })
          .whereBetween("log_date", [startOfWeek, endOfWeek])
          .select(knex.raw("DAYNAME(habit_logs.log_date) as day"), "completed"),
      }))
    );

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:userId/habits/:habitId", async (req, res) => {
  const habitId = req.params.habitId;
  try {
    const habit = await knex("habits")
      .where({ habit_id: habitId })
      .select(
        "habits.habit_id",
        "habits.habit_name",
        "habits.description",
        "habits.goal_frequency"
      );

    const data = await knex("habit_logs")
      .where({ habit_id: habitId })
      .select(
        "habit_logs.log_month",
        "habit_logs.log_date",
        "habit_logs.completed"
      );

    const monthObjs = [
      { January: 0 },
      { February: 0 },
      { March: 0 },
      { April: 0 },
      { May: 0 },
      { June: 0 },
      { July: 0 },
      { August: 0 },
      { September: 0 },
      { October: 0 },
      { November: 0 },
      { December: 0 },
    ];

    const graphYValues = await Promise.all(
      monthObjs.map((monthObj) => {
        const monthName = Object.keys(monthObj)[0];
        const count = data.filter((log) => log.log_month === monthName).length;
        return count;
      })
    );

    const updatedData = { ...habit[0], graphYValues: graphYValues };

    res.status(200).json(updatedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
