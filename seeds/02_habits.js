import data from "../seed-data/habits_data.js";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
  await knex("habits").del();
  await knex("habits").insert(data);
}
