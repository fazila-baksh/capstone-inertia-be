import data from "../seed-data/habit_logs_data.js";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex("habit_logs").del();
  await knex("habit_logs").insert(data);
}
