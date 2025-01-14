/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  if (!(await knex.schema.hasTable("users"))) {
    await knex.schema.createTable("users", (table) => {
      table.increments("user_id").primary();
      table.string("username").unique().notNullable();
      table.string("email").unique().notNullable();
      table.string("password_hash").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
    });
  }

  if (!(await knex.schema.hasTable("habits"))) {
    await knex.schema.createTable("habits", (table) => {
      table.increments("habit_id").primary();
      table.string("habit_name").notNullable();
      table.text("description");
      table.integer("goal_frequency").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.integer("user_id");
      table
        .foreign("user_id")
        .references("user_id")
        .inTable("users")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    });
  }

  if (!(await knex.schema.hasTable("habit_logs"))) {
    await knex.schema.createTable("habit_logs", (table) => {
      table.increments("log_id").primary();
      table.date("log_date");
      table.boolean("completed");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.integer("habit_id");
      table
        .foreign("habit_id")
        .references("habit_id")
        .inTable("habits")
        .onDelete("CASCADE")
        .onUpdate("CASCADE");
    });
  }
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists("habit_logs");
  await knex.schema.dropTableIfExists("habits");
  await knex.schema.dropTableIfExists("users");
}
