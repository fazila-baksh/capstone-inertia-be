import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);
import express from "express";
const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    const { habit_name, description, goal_frequency } = req.body;

    const newHabit = await knex("habits")
      .insert({
        habit_name,
        description,
        goal_frequency,
      })
      .returning("*");

    res.status(201).json(newHabit[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating habit" });
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
    const data = await knex("habits")
      .where({ user_id: userId })
      .select("habit_id", "habit_name");

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
    const curr = new Date("2025-01-07T01:49:11.335Z"); // get current date
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
  try {
    const userId = req.params.userId;
    const habitId = req.params.habitId;
    const habit = await knex("habits")
      .where({ habit_id: habitId, user_id: userId })
      .select(
        "habits.habit_name",
        "habits.description",
        "habits.goal_frequency"
      );

    if (!habit) {
      return res.status(404).send("Habit not found");
    }

    // const data = await Promise.all({
    //   habit_id: habit.habit_id,
    //   habit_name: habit.habit_name,
    //   description: habit.description,
    //   dailyTracking: await knex("habit_logs")
    //     .where({ habit_id: habit.habit_id })
    //     .whereBetween("log_date", [startOfWeek, endOfWeek])
    //     .select("log_date", "completed"),
    // });

    res.status(200).json(habit);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
