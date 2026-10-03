type ExcerciseLevel = {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | string; // Adjust options as needed
  theory: string[];
  task: string;
  schema: string;
  regex: RegExp;
  successMessage: string;
  hint: string;
  resultType: "data" | "schema" | string; // Adjust options based on your valid result types
  mockData: Record<string, any>[]; // Array of objects with dynamic keys
};

type ExcerciseModule = {
  id: string;
  title: string;
  levels: ExcerciseLevel[];
};

export const EXERCISE_MODULES: ExcerciseModule[] = [
  // =========================================================
  // MODULE 1 — BASICS & ENVIRONMENT
  // =========================================================
  {
    id: "mod-1",
    title: "1. Basics & Environment",
    levels: [
      {
        id: "1-1",
        title: "Check PostgreSQL Version",
        difficulty: "Beginner",
        theory: [
          "SELECT is used to retrieve information from PostgreSQL.",
          "PostgreSQL provides built-in functions that can be called without querying a table.",
          "The version() function returns information about the PostgreSQL server.",
        ],
        task: "Retrieve the PostgreSQL server version.",
        schema: "No tables needed.",
        regex: /select\s+version\s*\(\s*\)/i,
        successMessage: "You retrieved the PostgreSQL version.",
        hint: "SELECT version();",
        resultType: "data",
        mockData: [
          {
            version: "PostgreSQL 16.4",
          },
        ],
      },

      {
        id: "1-2",
        title: "Check Current Database",
        difficulty: "Beginner",
        theory: [
          "A PostgreSQL server can contain multiple databases.",
          "current_database() returns the database your current session is connected to.",
        ],
        task: "Retrieve the name of the current database.",
        schema: "No tables needed.",
        regex: /select\s+current_database\s*\(\s*\)/i,
        successMessage: "You retrieved the current database.",
        hint: "SELECT current_database();",
        resultType: "data",
        mockData: [
          {
            current_database: "postgres_learning",
          },
        ],
      },

      {
        id: "1-3",
        title: "Check Current User",
        difficulty: "Beginner",
        theory: [
          "Every PostgreSQL connection runs under a database role.",
          "CURRENT_USER returns the role currently executing the query.",
        ],
        task: "Retrieve the currently connected PostgreSQL user.",
        schema: "No tables needed.",
        regex: /select\s+current_user/i,
        successMessage: "You retrieved the current database user.",
        hint: "SELECT CURRENT_USER;",
        resultType: "data",
        mockData: [
          {
            current_user: "postgres",
          },
        ],
      },

      {
        id: "1-4",
        title: "Check Current Schema",
        difficulty: "Beginner",
        theory: [
          "Schemas organize database objects such as tables and views.",
          "The default PostgreSQL schema is commonly named public.",
        ],
        task: "Retrieve the current schema.",
        schema: "No tables needed.",
        regex: /select\s+current_schema\s*\(\s*\)/i,
        successMessage: "You retrieved the current schema.",
        hint: "SELECT current_schema();",
        resultType: "data",
        mockData: [
          {
            current_schema: "public",
          },
        ],
      },
    ],
  },

  // =========================================================
  // MODULE 2 — TABLES & DATA TYPES
  // =========================================================
  {
    id: "mod-2",
    title: "2. Tables & Data Types",
    levels: [
      {
        id: "2-1",
        title: "Create Your First Table",
        difficulty: "Beginner",
        theory: [
          "CREATE TABLE creates a new relational table.",
          "Each column has a name and a data type.",
          "INTEGER stores whole numbers and VARCHAR stores variable-length text.",
        ],
        task: "Create a table named `users` with `id` INTEGER, `name` VARCHAR(100), `email` VARCHAR(150), and `age` INTEGER.",
        schema: "Current Database: Empty",
        regex:
          /create\s+table\s+users\s*\([\s\S]*id\s+(integer|int)[\s\S]*name\s+varchar\s*\(\s*100\s*\)[\s\S]*email\s+varchar\s*\(\s*150\s*\)[\s\S]*age\s+(integer|int)[\s\S]*\)/i,
        successMessage: "The users table was created.",
        hint: "CREATE TABLE users (id INTEGER, name VARCHAR(100), email VARCHAR(150), age INTEGER);",
        resultType: "command",
        mockData: [],
      },

      {
        id: "2-2",
        title: "Add a Boolean Column",
        difficulty: "Beginner",
        theory: [
          "ALTER TABLE changes an existing table.",
          "ADD COLUMN adds a new column without recreating the table.",
          "BOOLEAN stores TRUE, FALSE, or NULL.",
        ],
        task: "Add an `is_active` BOOLEAN column to `users`.",
        schema:
          "Table: users\n- id INTEGER\n- name VARCHAR(100)\n- email VARCHAR(150)\n- age INTEGER",
        regex: /alter\s+table\s+users\s+add\s+(column\s+)?is_active\s+boolean/i,
        successMessage: "The is_active column was added.",
        hint: "ALTER TABLE users ADD COLUMN is_active BOOLEAN;",
        resultType: "command",
        mockData: [],
      },

      {
        id: "2-3",
        title: "Add a Timestamp Column",
        difficulty: "Beginner",
        theory: [
          "TIMESTAMPTZ stores a timestamp together with timezone-aware behavior.",
          "NOW() returns the current transaction timestamp.",
          "DEFAULT automatically supplies a value when INSERT does not specify one.",
        ],
        task: "Add a `created_at` TIMESTAMPTZ column with DEFAULT NOW() to `users`.",
        schema: "Table: users",
        regex:
          /alter\s+table\s+users\s+add\s+(column\s+)?created_at\s+(timestamptz|timestamp\s+with\s+time\s+zone)\s+default\s+now\s*\(\s*\)/i,
        successMessage: "The created_at column was added.",
        hint: "ALTER TABLE users ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();",
        resultType: "command",
        mockData: [],
      },

      {
        id: "2-4",
        title: "Set a Default Value",
        difficulty: "Beginner",
        theory: [
          "A DEFAULT value is used when an INSERT omits a column.",
          "Defaults help keep application behavior consistent.",
        ],
        task: "Set the default value of `is_active` to TRUE.",
        schema: "Table: users\n- is_active BOOLEAN",
        regex:
          /alter\s+table\s+users\s+alter\s+column\s+is_active\s+set\s+default\s+true/i,
        successMessage: "Default value configured.",
        hint: "ALTER TABLE users ALTER COLUMN is_active SET DEFAULT TRUE;",
        resultType: "command",
        mockData: [],
      },

      {
        id: "2-5",
        title: "Rename a Column",
        difficulty: "Beginner",
        theory: [
          "Columns can be renamed using ALTER TABLE.",
          "Renaming a column preserves the existing data.",
        ],
        task: "Rename the `name` column in `users` to `full_name`.",
        schema: "Table: users\n- name VARCHAR(100)",
        regex:
          /alter\s+table\s+users\s+rename\s+column\s+name\s+to\s+full_name/i,
        successMessage: "Column renamed successfully.",
        hint: "ALTER TABLE users RENAME COLUMN name TO full_name;",
        resultType: "command",
        mockData: [],
      },
    ],
  },

  // =========================================================
  // MODULE 3 — CONSTRAINTS & RELATIONSHIPS
  // =========================================================
  {
    id: "mod-3",
    title: "3. Constraints & Relationships",
    levels: [
      {
        id: "3-1",
        title: "Add a Primary Key",
        difficulty: "Beginner",
        theory: [
          "A PRIMARY KEY uniquely identifies every row.",
          "Primary key values cannot be NULL.",
          "A table normally has one primary key.",
        ],
        task: "Make `users.id` the primary key.",
        schema: "Table: users\n- id INTEGER",
        regex:
          /alter\s+table\s+users\s+add\s+(constraint\s+\w+\s+)?primary\s+key\s*\(\s*id\s*\)/i,
        successMessage: "Primary key created.",
        hint: "ALTER TABLE users ADD PRIMARY KEY (id);",
        resultType: "command",
        mockData: [],
      },

      {
        id: "3-2",
        title: "Require a Value",
        difficulty: "Beginner",
        theory: [
          "NOT NULL prevents a column from containing NULL.",
          "Use it for values that must always exist.",
        ],
        task: "Make `users.full_name` NOT NULL.",
        schema: "Table: users\n- full_name VARCHAR(100)",
        regex:
          /alter\s+table\s+users\s+alter\s+column\s+full_name\s+set\s+not\s+null/i,
        successMessage: "full_name is now required.",
        hint: "ALTER TABLE users ALTER COLUMN full_name SET NOT NULL;",
        resultType: "command",
        mockData: [],
      },

      {
        id: "3-3",
        title: "Add a Unique Constraint",
        difficulty: "Beginner",
        theory: [
          "UNIQUE prevents duplicate values.",
          "Email addresses are a common example of data that should be unique.",
        ],
        task: "Add a UNIQUE constraint to `users.email`.",
        schema: "Table: users\n- email VARCHAR(150)",
        regex:
          /alter\s+table\s+users\s+add\s+(constraint\s+\w+\s+)?unique\s*\(\s*email\s*\)/i,
        successMessage: "Duplicate email addresses are now prevented.",
        hint: "ALTER TABLE users ADD UNIQUE (email);",
        resultType: "command",
        mockData: [],
      },

      {
        id: "3-4",
        title: "Add a Check Constraint",
        difficulty: "Beginner",
        theory: [
          "CHECK constraints enforce rules directly inside PostgreSQL.",
          "They protect data even when different applications write to the database.",
        ],
        task: "Add a CHECK constraint requiring `age` to be at least 18.",
        schema: "Table: users\n- age INTEGER",
        regex:
          /alter\s+table\s+users\s+add\s+(constraint\s+\w+\s+)?check\s*\(\s*age\s*>=\s*18\s*\)/i,
        successMessage: "The age rule is now enforced.",
        hint: "ALTER TABLE users ADD CHECK (age >= 18);",
        resultType: "command",
        mockData: [],
      },

      {
        id: "3-5",
        title: "Create Departments",
        difficulty: "Beginner",
        theory: [
          "Related information is normally stored in separate tables.",
          "Departments will later be connected to users using a foreign key.",
        ],
        task: "Create `departments` with `id` INTEGER PRIMARY KEY and `name` VARCHAR(100) UNIQUE NOT NULL.",
        schema: "Existing Table: users",
        regex:
          /create\s+table\s+departments\s*\([\s\S]*id\s+(integer|int)\s+primary\s+key[\s\S]*name\s+varchar\s*\(\s*100\s*\)[\s\S]*(unique[\s\S]*not\s+null|not\s+null[\s\S]*unique)[\s\S]*\)/i,
        successMessage: "Departments table created.",
        hint: "CREATE TABLE departments (id INTEGER PRIMARY KEY, name VARCHAR(100) UNIQUE NOT NULL);",
        resultType: "command",
        mockData: [],
      },

      {
        id: "3-6",
        title: "Add a Foreign Key",
        difficulty: "Intermediate",
        theory: [
          "A FOREIGN KEY creates a relationship between tables.",
          "REFERENCES identifies the table and column being referenced.",
          "PostgreSQL prevents invalid references.",
        ],
        task: "Add `department_id` INTEGER to `users` and make it reference `departments(id)`.",
        schema:
          "Tables:\nusers\n- id\n- full_name\n\ndepartments\n- id\n- name",
        regex:
          /alter\s+table\s+users\s+add\s+(column\s+)?department_id\s+(integer|int)\s+references\s+departments\s*\(\s*id\s*\)/i,
        successMessage: "Users can now reference departments.",
        hint: "ALTER TABLE users ADD COLUMN department_id INTEGER REFERENCES departments(id);",
        resultType: "command",
        mockData: [],
      },
    ],
  },

  // =========================================================
  // MODULE 4 — INSERT & SELECT
  // =========================================================
  {
    id: "mod-4",
    title: "4. Insert & Select Data",
    levels: [
      {
        id: "4-1",
        title: "Insert a Department",
        difficulty: "Beginner",
        theory: [
          "INSERT INTO adds new rows.",
          "Providing column names makes INSERT statements easier to understand and safer to maintain.",
        ],
        task: "Insert department id `1` with the name `Engineering`.",
        schema: "Table: departments\n- id INTEGER\n- name VARCHAR(100)",
        regex:
          /insert\s+into\s+departments\s*\(\s*id\s*,\s*name\s*\)\s*values\s*\(\s*1\s*,\s*'engineering'\s*\)/i,
        successMessage: "Department inserted.",
        hint: "INSERT INTO departments (id, name) VALUES (1, 'Engineering');",
        resultType: "command",
        mockData: [],
      },

      {
        id: "4-2",
        title: "Insert a User",
        difficulty: "Beginner",
        theory: [
          "VALUES contains the values for the row being inserted.",
          "Values must correspond with their listed columns.",
        ],
        task: "Insert user id `1`, full_name `Alice`, email `alice@example.com`, age `28`, department_id `1`.",
        schema: "Table: users",
        regex:
          /insert\s+into\s+users\s*\(\s*id\s*,\s*full_name\s*,\s*email\s*,\s*age\s*,\s*department_id\s*\)\s*values\s*\(\s*1\s*,\s*'alice'\s*,\s*'alice@example\.com'\s*,\s*28\s*,\s*1\s*\)/i,
        successMessage: "Alice was inserted.",
        hint: "INSERT INTO users (id, full_name, email, age, department_id) VALUES (1, 'Alice', 'alice@example.com', 28, 1);",
        resultType: "command",
        mockData: [],
      },

      {
        id: "4-3",
        title: "Insert Multiple Rows",
        difficulty: "Beginner",
        theory: [
          "A single INSERT statement can add multiple rows.",
          "Bulk inserts usually require fewer database round trips than separate INSERT statements.",
        ],
        task: "Insert departments `(2, 'Sales')` and `(3, 'Marketing')` in one INSERT.",
        schema: "Table: departments",
        regex:
          /insert\s+into\s+departments\s*\(\s*id\s*,\s*name\s*\)\s*values\s*\(\s*2\s*,\s*'sales'\s*\)\s*,\s*\(\s*3\s*,\s*'marketing'\s*\)/i,
        successMessage: "Multiple rows inserted.",
        hint: "INSERT INTO departments (id, name) VALUES (2, 'Sales'), (3, 'Marketing');",
        resultType: "command",
        mockData: [],
      },

      {
        id: "4-4",
        title: "Select Everything",
        difficulty: "Beginner",
        theory: [
          "SELECT retrieves data.",
          "The * wildcard selects every column.",
        ],
        task: "Retrieve every column and every row from `users`.",
        schema: "Table: users",
        regex: /select\s+\*\s+from\s+users/i,
        successMessage: "All users retrieved.",
        hint: "SELECT * FROM users;",
        resultType: "data",
        mockData: [
          {
            id: 1,
            full_name: "Alice",
            email: "alice@example.com",
            age: 28,
            department_id: 1,
            is_active: true,
          },
          {
            id: 2,
            full_name: "Bob",
            email: "bob@example.com",
            age: 34,
            department_id: 2,
            is_active: true,
          },
        ],
      },

      {
        id: "4-5",
        title: "Select Specific Columns",
        difficulty: "Beginner",
        theory: [
          "You normally should select only the columns your application needs.",
          "Selecting fewer columns reduces unnecessary data transfer.",
        ],
        task: "Retrieve only `full_name` and `email` from `users`.",
        schema: "Table: users",
        regex: /select\s+full_name\s*,\s*email\s+from\s+users/i,
        successMessage: "Specific columns retrieved.",
        hint: "SELECT full_name, email FROM users;",
        resultType: "data",
        mockData: [
          {
            full_name: "Alice",
            email: "alice@example.com",
          },
          {
            full_name: "Bob",
            email: "bob@example.com",
          },
        ],
      },

      {
        id: "4-6",
        title: "Return Inserted Data",
        difficulty: "Beginner",
        theory: [
          "PostgreSQL supports RETURNING on INSERT, UPDATE, and DELETE.",
          "RETURNING avoids running another SELECT just to retrieve the affected row.",
        ],
        task: "Insert user id `4`, name `David`, email `david@example.com`, age `26`, and return the inserted row.",
        schema: "Table: users",
        regex: /insert\s+into\s+users[\s\S]*values[\s\S]*returning\s+\*/i,
        successMessage: "The inserted row was returned.",
        hint: "INSERT INTO users (id, full_name, email, age) VALUES (4, 'David', 'david@example.com', 26) RETURNING *;",
        resultType: "data",
        mockData: [
          {
            id: 4,
            full_name: "David",
            email: "david@example.com",
            age: 26,
          },
        ],
      },
    ],
  },

  // =========================================================
  // MODULE 5 — FILTERING
  // =========================================================
  {
    id: "mod-5",
    title: "5. Filtering Data",
    levels: [
      {
        id: "5-1",
        title: "Filter with WHERE",
        difficulty: "Beginner",
        theory: [
          "WHERE determines which rows are returned.",
          "Only rows where the condition evaluates to TRUE are included.",
        ],
        task: "Select users where age is greater than 30.",
        schema: "Table: users",
        regex: /select\s+\*\s+from\s+users\s+where\s+age\s*>\s*30/i,
        successMessage: "Users older than 30 retrieved.",
        hint: "SELECT * FROM users WHERE age > 30;",
        resultType: "data",
        mockData: [
          {
            id: 2,
            full_name: "Bob",
            age: 34,
          },
        ],
      },

      {
        id: "5-2",
        title: "Combine Conditions with AND",
        difficulty: "Beginner",
        theory: [
          "AND requires both conditions to be TRUE.",
          "It is commonly used to narrow query results.",
        ],
        task: "Select active users whose age is greater than or equal to 25.",
        schema: "Table: users",
        regex:
          /select\s+\*\s+from\s+users\s+where\s+age\s*>=\s*25\s+and\s+is_active\s*=\s*true/i,
        successMessage: "Both conditions were applied.",
        hint: "SELECT * FROM users WHERE age >= 25 AND is_active = TRUE;",
        resultType: "data",
        mockData: [
          {
            id: 1,
            full_name: "Alice",
            age: 28,
            is_active: true,
          },
          {
            id: 2,
            full_name: "Bob",
            age: 34,
            is_active: true,
          },
        ],
      },

      {
        id: "5-3",
        title: "Combine Conditions with OR",
        difficulty: "Beginner",
        theory: [
          "OR succeeds when at least one condition is TRUE.",
          "Parentheses become important when AND and OR are mixed.",
        ],
        task: "Select users whose department_id is 1 or 2.",
        schema: "Table: users",
        regex:
          /select\s+\*\s+from\s+users\s+where\s+department_id\s*=\s*1\s+or\s+department_id\s*=\s*2/i,
        successMessage: "OR condition applied.",
        hint: "SELECT * FROM users WHERE department_id = 1 OR department_id = 2;",
        resultType: "data",
        mockData: [
          {
            id: 1,
            full_name: "Alice",
            department_id: 1,
          },
          {
            id: 2,
            full_name: "Bob",
            department_id: 2,
          },
        ],
      },

      {
        id: "5-4",
        title: "Filter with IN",
        difficulty: "Beginner",
        theory: [
          "IN checks whether a value matches one of several possible values.",
          "It is usually cleaner than writing many OR conditions.",
        ],
        task: "Select users where department_id is 1, 2, or 3.",
        schema: "Table: users",
        regex:
          /select\s+\*\s+from\s+users\s+where\s+department_id\s+in\s*\(\s*1\s*,\s*2\s*,\s*3\s*\)/i,
        successMessage: "IN successfully matched several values.",
        hint: "SELECT * FROM users WHERE department_id IN (1, 2, 3);",
        resultType: "data",
        mockData: [],
      },

      {
        id: "5-5",
        title: "Filter with BETWEEN",
        difficulty: "Beginner",
        theory: [
          "BETWEEN checks whether a value falls inside an inclusive range.",
          "Both boundary values are included.",
        ],
        task: "Select users whose age is between 25 and 35.",
        schema: "Table: users",
        regex:
          /select\s+\*\s+from\s+users\s+where\s+age\s+between\s+25\s+and\s+35/i,
        successMessage: "Age range applied.",
        hint: "SELECT * FROM users WHERE age BETWEEN 25 AND 35;",
        resultType: "data",
        mockData: [
          {
            full_name: "Alice",
            age: 28,
          },
          {
            full_name: "Bob",
            age: 34,
          },
        ],
      },

      {
        id: "5-6",
        title: "Pattern Matching with LIKE",
        difficulty: "Beginner",
        theory: [
          "LIKE performs pattern matching.",
          "% matches zero or more characters.",
          "_ matches exactly one character.",
        ],
        task: "Find users whose full_name starts with `A`.",
        schema: "Table: users",
        regex: /select\s+\*\s+from\s+users\s+where\s+full_name\s+like\s+'a%'/i,
        successMessage: "LIKE pattern matched successfully.",
        hint: "SELECT * FROM users WHERE full_name LIKE 'A%';",
        resultType: "data",
        mockData: [
          {
            id: 1,
            full_name: "Alice",
          },
        ],
      },

      {
        id: "5-7",
        title: "Case-Insensitive Search",
        difficulty: "Beginner",
        theory: [
          "ILIKE is PostgreSQL's case-insensitive version of LIKE.",
          "It is useful for simple user-facing text searches.",
        ],
        task: "Find users whose full_name contains `ali`, ignoring letter case.",
        schema: "Table: users",
        regex:
          /select\s+\*\s+from\s+users\s+where\s+full_name\s+ilike\s+'%ali%'/i,
        successMessage: "Case-insensitive search completed.",
        hint: "SELECT * FROM users WHERE full_name ILIKE '%ali%';",
        resultType: "data",
        mockData: [
          {
            id: 1,
            full_name: "Alice",
          },
        ],
      },

      {
        id: "5-8",
        title: "Find NULL Values",
        difficulty: "Beginner",
        theory: [
          "NULL represents an unknown or missing value.",
          "NULL cannot be correctly compared using =.",
          "Use IS NULL or IS NOT NULL.",
        ],
        task: "Select users that do not have a department.",
        schema: "Table: users\n- department_id INTEGER nullable",
        regex:
          /select\s+\*\s+from\s+users\s+where\s+department_id\s+is\s+null/i,
        successMessage: "Users with NULL department_id retrieved.",
        hint: "SELECT * FROM users WHERE department_id IS NULL;",
        resultType: "data",
        mockData: [
          {
            id: 4,
            full_name: "David",
            department_id: null,
          },
        ],
      },

      {
        id: "5-9",
        title: "Find Non-NULL Values",
        difficulty: "Beginner",
        theory: ["IS NOT NULL finds rows where a value exists."],
        task: "Select users that have a department assigned.",
        schema: "Table: users",
        regex:
          /select\s+\*\s+from\s+users\s+where\s+department_id\s+is\s+not\s+null/i,
        successMessage: "Users with departments retrieved.",
        hint: "SELECT * FROM users WHERE department_id IS NOT NULL;",
        resultType: "data",
        mockData: [],
      },
    ],
  },

  // =========================================================
  // MODULE 6 — SORTING, DISTINCT & PAGINATION
  // =========================================================
  {
    id: "mod-6",
    title: "6. Sorting & Pagination",
    levels: [
      {
        id: "6-1",
        title: "Sort Ascending",
        difficulty: "Beginner",
        theory: [
          "ORDER BY controls the order of result rows.",
          "ASC means ascending order and is the default.",
        ],
        task: "Select all users ordered by age from youngest to oldest.",
        schema: "Table: users",
        regex: /select\s+\*\s+from\s+users\s+order\s+by\s+age(\s+asc)?/i,
        successMessage: "Users sorted in ascending order.",
        hint: "SELECT * FROM users ORDER BY age ASC;",
        resultType: "data",
        mockData: [
          {
            full_name: "David",
            age: 26,
          },
          {
            full_name: "Alice",
            age: 28,
          },
          {
            full_name: "Bob",
            age: 34,
          },
        ],
      },

      {
        id: "6-2",
        title: "Sort Descending",
        difficulty: "Beginner",
        theory: ["DESC reverses the sort order."],
        task: "Select all users ordered from oldest to youngest.",
        schema: "Table: users",
        regex: /select\s+\*\s+from\s+users\s+order\s+by\s+age\s+desc/i,
        successMessage: "Descending sort applied.",
        hint: "SELECT * FROM users ORDER BY age DESC;",
        resultType: "data",
        mockData: [],
      },

      {
        id: "6-3",
        title: "Limit Results",
        difficulty: "Beginner",
        theory: [
          "LIMIT restricts how many rows PostgreSQL returns.",
          "It is heavily used in APIs and pagination.",
        ],
        task: "Retrieve only the first 5 users.",
        schema: "Table: users",
        regex: /select\s+\*\s+from\s+users\s+limit\s+5/i,
        successMessage: "Results limited to 5 rows.",
        hint: "SELECT * FROM users LIMIT 5;",
        resultType: "data",
        mockData: [],
      },

      {
        id: "6-4",
        title: "Offset Results",
        difficulty: "Beginner",
        theory: [
          "OFFSET skips rows before returning results.",
          "LIMIT and OFFSET are commonly used for simple page-number pagination.",
        ],
        task: "Retrieve 5 users after skipping the first 10.",
        schema: "Table: users",
        regex: /select\s+\*\s+from\s+users\s+limit\s+5\s+offset\s+10/i,
        successMessage: "Pagination applied.",
        hint: "SELECT * FROM users LIMIT 5 OFFSET 10;",
        resultType: "data",
        mockData: [],
      },

      {
        id: "6-5",
        title: "Remove Duplicate Results",
        difficulty: "Beginner",
        theory: [
          "DISTINCT removes duplicate result values.",
          "It applies to the complete selected column combination.",
        ],
        task: "Retrieve the unique department_id values from users.",
        schema: "Table: users",
        regex: /select\s+distinct\s+department_id\s+from\s+users/i,
        successMessage: "Duplicate department IDs removed.",
        hint: "SELECT DISTINCT department_id FROM users;",
        resultType: "data",
        mockData: [
          {
            department_id: 1,
          },
          {
            department_id: 2,
          },
          {
            department_id: 3,
          },
        ],
      },
    ],
  },

  // =========================================================
  // MODULE 7 — UPDATE, DELETE & UPSERT
  // =========================================================
  {
    id: "mod-7",
    title: "7. Update, Delete & Upsert",
    levels: [
      {
        id: "7-1",
        title: "Update a Row",
        difficulty: "Beginner",
        theory: [
          "UPDATE modifies existing rows.",
          "SET specifies the new values.",
          "WHERE controls which rows are changed.",
        ],
        task: "Change the age of user id `1` to `29`.",
        schema: "Table: users",
        regex: /update\s+users\s+set\s+age\s*=\s*29\s+where\s+id\s*=\s*1/i,
        successMessage: "User updated.",
        hint: "UPDATE users SET age = 29 WHERE id = 1;",
        resultType: "command",
        mockData: [],
      },

      {
        id: "7-2",
        title: "Update Multiple Columns",
        difficulty: "Beginner",
        theory: ["One UPDATE statement can modify several columns."],
        task: "For user id `1`, set age to `30` and is_active to TRUE.",
        schema: "Table: users",
        regex:
          /update\s+users\s+set\s+age\s*=\s*30\s*,\s*is_active\s*=\s*true\s+where\s+id\s*=\s*1/i,
        successMessage: "Multiple columns updated.",
        hint: "UPDATE users SET age = 30, is_active = TRUE WHERE id = 1;",
        resultType: "command",
        mockData: [],
      },

      {
        id: "7-3",
        title: "Update and Return",
        difficulty: "Beginner",
        theory: [
          "RETURNING can immediately return the rows affected by UPDATE.",
        ],
        task: "Set user id `2` to inactive and return the updated row.",
        schema: "Table: users",
        regex:
          /update\s+users\s+set\s+is_active\s*=\s*false\s+where\s+id\s*=\s*2\s+returning\s+\*/i,
        successMessage: "Updated row returned.",
        hint: "UPDATE users SET is_active = FALSE WHERE id = 2 RETURNING *;",
        resultType: "data",
        mockData: [
          {
            id: 2,
            full_name: "Bob",
            is_active: false,
          },
        ],
      },

      {
        id: "7-4",
        title: "Delete a Row",
        difficulty: "Beginner",
        theory: [
          "DELETE removes rows from a table.",
          "Without WHERE, DELETE removes every row.",
        ],
        task: "Delete the user whose id is `4`.",
        schema: "Table: users",
        regex: /delete\s+from\s+users\s+where\s+id\s*=\s*4/i,
        successMessage: "User deleted.",
        hint: "DELETE FROM users WHERE id = 4;",
        resultType: "command",
        mockData: [],
      },

      {
        id: "7-5",
        title: "Upsert with ON CONFLICT",
        difficulty: "Intermediate",
        theory: [
          "UPSERT means insert a row or update it if a conflict occurs.",
          "PostgreSQL implements this using ON CONFLICT.",
          "EXCLUDED represents the row that PostgreSQL attempted to insert.",
        ],
        task: "Insert department `(1, 'Software Engineering')`. If id 1 already exists, update its name using EXCLUDED.name.",
        schema: "Table: departments\n- id PRIMARY KEY\n- name",
        regex:
          /insert\s+into\s+departments[\s\S]*on\s+conflict\s*\(\s*id\s*\)\s+do\s+update\s+set\s+name\s*=\s*excluded\.name/i,
        successMessage: "Upsert executed.",
        hint: "INSERT INTO departments (id, name) VALUES (1, 'Software Engineering') ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;",
        resultType: "command",
        mockData: [],
      },

      {
        id: "7-6",
        title: "Ignore a Conflict",
        difficulty: "Intermediate",
        theory: [
          "DO NOTHING tells PostgreSQL to skip an insert when the specified conflict occurs.",
        ],
        task: "Insert department `(1, 'Engineering')`, but do nothing if id 1 already exists.",
        schema: "Table: departments",
        regex:
          /insert\s+into\s+departments[\s\S]*on\s+conflict\s*\(\s*id\s*\)\s+do\s+nothing/i,
        successMessage: "Conflict safely ignored.",
        hint: "INSERT INTO departments (id, name) VALUES (1, 'Engineering') ON CONFLICT (id) DO NOTHING;",
        resultType: "command",
        mockData: [],
      },
    ],
  },

  // =========================================================
  // MODULE 8 — JOINS
  // =========================================================
  {
    id: "mod-8",
    title: "8. Joins & Relationships",
    levels: [
      {
        id: "8-1",
        title: "Basic INNER JOIN",
        difficulty: "Intermediate",
        theory: [
          "JOIN combines rows from related tables.",
          "INNER JOIN returns only rows having matches on both sides.",
        ],
        task: "Return each user's full_name together with their department name.",
        schema: "users.department_id → departments.id",
        regex:
          /select[\s\S]*from\s+users[\s\S]*(inner\s+)?join\s+departments[\s\S]*on\s+users\.department_id\s*=\s*departments\.id/i,
        successMessage: "Users successfully joined with departments.",
        hint: "SELECT users.full_name, departments.name FROM users INNER JOIN departments ON users.department_id = departments.id;",
        resultType: "data",
        mockData: [
          {
            full_name: "Alice",
            name: "Engineering",
          },
          {
            full_name: "Bob",
            name: "Sales",
          },
        ],
      },

      {
        id: "8-2",
        title: "Use Table Aliases",
        difficulty: "Intermediate",
        theory: [
          "Aliases shorten table names inside queries.",
          "They make large JOIN queries easier to read.",
        ],
        task: "Join users as `u` with departments as `d`, returning `u.full_name` and `d.name`.",
        schema: "users.department_id → departments.id",
        regex:
          /select\s+u\.full_name\s*,\s*d\.name\s+from\s+users\s+(as\s+)?u\s+(inner\s+)?join\s+departments\s+(as\s+)?d\s+on\s+u\.department_id\s*=\s*d\.id/i,
        successMessage: "Aliases used correctly.",
        hint: "SELECT u.full_name, d.name FROM users u JOIN departments d ON u.department_id = d.id;",
        resultType: "data",
        mockData: [],
      },

      {
        id: "8-3",
        title: "LEFT JOIN",
        difficulty: "Intermediate",
        theory: [
          "LEFT JOIN keeps every row from the left table.",
          "When no matching right-side row exists, right-side columns become NULL.",
        ],
        task: "Return every user even if they don't have a department.",
        schema: "users.department_id → departments.id",
        regex:
          /select[\s\S]*from\s+users\s+(as\s+)?u\s+left(\s+outer)?\s+join\s+departments\s+(as\s+)?d\s+on\s+u\.department_id\s*=\s*d\.id/i,
        successMessage: "LEFT JOIN completed.",
        hint: "SELECT u.full_name, d.name FROM users u LEFT JOIN departments d ON u.department_id = d.id;",
        resultType: "data",
        mockData: [
          {
            full_name: "Alice",
            name: "Engineering",
          },
          {
            full_name: "David",
            name: null,
          },
        ],
      },

      {
        id: "8-4",
        title: "Create an Orders Table",
        difficulty: "Intermediate",
        theory: [
          "Orders create a one-to-many relationship.",
          "One user can have many orders.",
        ],
        task: "Create `orders` with id INTEGER PRIMARY KEY, user_id INTEGER REFERENCES users(id), status VARCHAR(30), total NUMERIC(10,2), and created_at TIMESTAMPTZ DEFAULT NOW().",
        schema: "Existing Table: users",
        regex:
          /create\s+table\s+orders\s*\([\s\S]*id\s+(integer|int)\s+primary\s+key[\s\S]*user_id\s+(integer|int)\s+references\s+users\s*\(\s*id\s*\)[\s\S]*status\s+varchar\s*\(\s*30\s*\)[\s\S]*total\s+numeric\s*\(\s*10\s*,\s*2\s*\)[\s\S]*created_at\s+(timestamptz|timestamp\s+with\s+time\s+zone)\s+default\s+now\s*\(\s*\)[\s\S]*\)/i,
        successMessage: "Orders table created.",
        hint: "CREATE TABLE orders (id INTEGER PRIMARY KEY, user_id INTEGER REFERENCES users(id), status VARCHAR(30), total NUMERIC(10,2), created_at TIMESTAMPTZ DEFAULT NOW());",
        resultType: "command",
        mockData: [],
      },

      {
        id: "8-5",
        title: "Join Three Tables",
        difficulty: "Intermediate",
        theory: [
          "A query can join multiple tables.",
          "This allows PostgreSQL to reconstruct related relational data.",
        ],
        task: "Return user name, department name, and order total by joining users, departments, and orders.",
        schema:
          "orders.user_id → users.id\nusers.department_id → departments.id",
        regex:
          /select[\s\S]*from\s+users\s+(as\s+)?u[\s\S]*join\s+departments\s+(as\s+)?d\s+on\s+u\.department_id\s*=\s*d\.id[\s\S]*join\s+orders\s+(as\s+)?o\s+on\s+o\.user_id\s*=\s*u\.id/i,
        successMessage: "Three tables joined successfully.",
        hint: "SELECT u.full_name, d.name, o.total FROM users u JOIN departments d ON u.department_id = d.id JOIN orders o ON o.user_id = u.id;",
        resultType: "data",
        mockData: [
          {
            full_name: "Alice",
            name: "Engineering",
            total: 4999.0,
          },
        ],
      },
    ],
  },

  // =========================================================
  // MODULE 9 — AGGREGATION & GROUPING
  // =========================================================
  {
    id: "mod-9",
    title: "9. Aggregation & Grouping",
    levels: [
      {
        id: "9-1",
        title: "Count Rows",
        difficulty: "Beginner",
        theory: ["COUNT calculates how many rows match a query."],
        task: "Count all users.",
        schema: "Table: users",
        regex: /select\s+count\s*\(\s*\*\s*\)\s+from\s+users/i,
        successMessage: "Users counted.",
        hint: "SELECT COUNT(*) FROM users;",
        resultType: "data",
        mockData: [
          {
            count: 25,
          },
        ],
      },

      {
        id: "9-2",
        title: "Calculate Total",
        difficulty: "Beginner",
        theory: ["SUM adds numeric values together."],
        task: "Calculate the total value of all orders.",
        schema: "Table: orders\n- total NUMERIC",
        regex: /select\s+sum\s*\(\s*total\s*\)\s+from\s+orders/i,
        successMessage: "Order revenue calculated.",
        hint: "SELECT SUM(total) FROM orders;",
        resultType: "data",
        mockData: [
          {
            sum: 154230.5,
          },
        ],
      },

      {
        id: "9-3",
        title: "Calculate Average",
        difficulty: "Beginner",
        theory: ["AVG calculates the arithmetic mean."],
        task: "Calculate the average order total.",
        schema: "Table: orders",
        regex: /select\s+avg\s*\(\s*total\s*\)\s+from\s+orders/i,
        successMessage: "Average calculated.",
        hint: "SELECT AVG(total) FROM orders;",
        resultType: "data",
        mockData: [
          {
            avg: 3084.61,
          },
        ],
      },

      {
        id: "9-4",
        title: "Minimum and Maximum",
        difficulty: "Beginner",
        theory: [
          "MIN returns the smallest value.",
          "MAX returns the largest value.",
        ],
        task: "Return the smallest and largest order total.",
        schema: "Table: orders",
        regex:
          /select\s+min\s*\(\s*total\s*\)\s*,\s*max\s*\(\s*total\s*\)\s+from\s+orders/i,
        successMessage: "Minimum and maximum calculated.",
        hint: "SELECT MIN(total), MAX(total) FROM orders;",
        resultType: "data",
        mockData: [
          {
            min: 199.0,
            max: 25000.0,
          },
        ],
      },

      {
        id: "9-5",
        title: "Group Rows",
        difficulty: "Intermediate",
        theory: [
          "GROUP BY combines rows with the same grouping value.",
          "Aggregate functions can then calculate values for each group.",
        ],
        task: "Count how many orders exist for each status.",
        schema: "Table: orders\n- status\n- id",
        regex:
          /select\s+status\s*,\s*count\s*\(\s*\*\s*\)\s+from\s+orders\s+group\s+by\s+status/i,
        successMessage: "Orders grouped by status.",
        hint: "SELECT status, COUNT(*) FROM orders GROUP BY status;",
        resultType: "data",
        mockData: [
          {
            status: "pending",
            count: 5,
          },
          {
            status: "completed",
            count: 20,
          },
        ],
      },

      {
        id: "9-6",
        title: "Filter Groups with HAVING",
        difficulty: "Intermediate",
        theory: [
          "WHERE filters individual rows before grouping.",
          "HAVING filters groups after GROUP BY.",
        ],
        task: "Return users who have more than 3 orders.",
        schema: "Table: orders\n- user_id\n- id",
        regex:
          /select\s+user_id\s*,\s*count\s*\(\s*\*\s*\)\s+from\s+orders\s+group\s+by\s+user_id\s+having\s+count\s*\(\s*\*\s*\)\s*>\s*3/i,
        successMessage: "Groups filtered using HAVING.",
        hint: "SELECT user_id, COUNT(*) FROM orders GROUP BY user_id HAVING COUNT(*) > 3;",
        resultType: "data",
        mockData: [
          {
            user_id: 1,
            count: 8,
          },
          {
            user_id: 2,
            count: 5,
          },
        ],
      },

      {
        id: "9-7",
        title: "Aggregate After JOIN",
        difficulty: "Intermediate",
        theory: [
          "JOIN and GROUP BY are frequently combined in reporting queries.",
          "You can group child records using information from their parent records.",
        ],
        task: "Return each user's full_name and their total order amount.",
        schema: "users.id ← orders.user_id",
        regex:
          /select\s+u\.full_name\s*,\s*sum\s*\(\s*o\.total\s*\)[\s\S]*from\s+users\s+(as\s+)?u\s+join\s+orders\s+(as\s+)?o\s+on\s+o\.user_id\s*=\s*u\.id\s+group\s+by\s+u\.full_name/i,
        successMessage: "User order totals calculated.",
        hint: "SELECT u.full_name, SUM(o.total) FROM users u JOIN orders o ON o.user_id = u.id GROUP BY u.full_name;",
        resultType: "data",
        mockData: [
          {
            full_name: "Alice",
            sum: 18450.0,
          },
          {
            full_name: "Bob",
            sum: 9200.0,
          },
        ],
      },
    ],
  },

  // =========================================================
  // MODULE 10 — NULLS, EXPRESSIONS & CASE
  // =========================================================
  {
    id: "mod-10",
    title: "10. NULLs, Expressions & Conditional Logic",
    levels: [
      {
        id: "10-1",
        title: "Replace NULL with COALESCE",
        difficulty: "Intermediate",
        theory: [
          "COALESCE returns the first non-NULL value.",
          "It is frequently used to provide fallback values.",
        ],
        task: "Return each user's full_name and department_id, showing 0 when department_id is NULL.",
        schema: "Table: users",
        regex:
          /select\s+full_name\s*,\s*coalesce\s*\(\s*department_id\s*,\s*0\s*\)\s+from\s+users/i,
        successMessage: "NULL values replaced.",
        hint: "SELECT full_name, COALESCE(department_id, 0) FROM users;",
        resultType: "data",
        mockData: [
          {
            full_name: "Alice",
            coalesce: 1,
          },
          {
            full_name: "David",
            coalesce: 0,
          },
        ],
      },

      {
        id: "10-2",
        title: "Conditional Output with CASE",
        difficulty: "Intermediate",
        theory: [
          "CASE adds conditional logic inside SQL.",
          "It works similarly to if/else logic in programming languages.",
        ],
        task: "Return full_name and a value `Adult` when age >= 18, otherwise `Minor`.",
        schema: "Table: users",
        regex:
          /select\s+full_name\s*,\s*case\s+when\s+age\s*>=\s*18\s+then\s+'adult'\s+else\s+'minor'\s+end[\s\S]*from\s+users/i,
        successMessage: "CASE expression executed.",
        hint: "SELECT full_name, CASE WHEN age >= 18 THEN 'Adult' ELSE 'Minor' END FROM users;",
        resultType: "data",
        mockData: [
          {
            full_name: "Alice",
            case: "Adult",
          },
        ],
      },

      {
        id: "10-3",
        title: "Create a Computed Alias",
        difficulty: "Beginner",
        theory: [
          "AS gives a readable name to a query expression.",
          "Aliases are especially useful for aggregates and calculated values.",
        ],
        task: "Return COUNT(*) from users using the alias `total_users`.",
        schema: "Table: users",
        regex:
          /select\s+count\s*\(\s*\*\s*\)\s+(as\s+)?total_users\s+from\s+users/i,
        successMessage: "Column alias created.",
        hint: "SELECT COUNT(*) AS total_users FROM users;",
        resultType: "data",
        mockData: [
          {
            total_users: 25,
          },
        ],
      },
    ],
  },

  // =========================================================
  // MODULE 11 — SUBQUERIES & EXISTS
  // =========================================================
  {
    id: "mod-11",
    title: "11. Subqueries & EXISTS",
    levels: [
      {
        id: "11-1",
        title: "Scalar Subquery",
        difficulty: "Intermediate",
        theory: [
          "A subquery is a query nested inside another query.",
          "A scalar subquery returns exactly one value.",
          "Scalar subqueries are useful when a condition depends on an aggregate or calculated value.",
        ],
        task: "Select all orders whose total is greater than the average order total.",
        schema: "Table: orders\n- id\n- user_id\n- total\n- status",
        regex:
          /select\s+\*\s+from\s+orders\s+where\s+total\s*>\s*\(\s*select\s+avg\s*\(\s*total\s*\)\s+from\s+orders\s*\)/i,
        successMessage: "You used a scalar subquery.",
        hint: "SELECT * FROM orders WHERE total > (SELECT AVG(total) FROM orders);",
        resultType: "data",
        mockData: [
          { id: 7, user_id: 1, total: 8500 },
          { id: 12, user_id: 3, total: 12000 },
        ],
      },

      {
        id: "11-2",
        title: "Subquery with IN",
        difficulty: "Intermediate",
        theory: [
          "IN can compare a value against multiple values returned by a subquery.",
          "The inner query runs logically as part of the outer query.",
          "The PostgreSQL planner may internally transform the query into a more efficient execution strategy.",
        ],
        task: "Select users whose id appears in the orders table.",
        schema: "users.id ← orders.user_id",
        regex:
          /select\s+\*\s+from\s+users\s+where\s+id\s+in\s*\(\s*select\s+user_id\s+from\s+orders\s*\)/i,
        successMessage: "Users with orders were found using a subquery.",
        hint: "SELECT * FROM users WHERE id IN (SELECT user_id FROM orders);",
        resultType: "data",
        mockData: [
          { id: 1, full_name: "Alice" },
          { id: 2, full_name: "Bob" },
        ],
      },

      {
        id: "11-3",
        title: "Check Existence with EXISTS",
        difficulty: "Intermediate",
        theory: [
          "EXISTS checks whether a subquery returns at least one row.",
          "PostgreSQL can stop checking once a matching row is found.",
          "EXISTS is especially useful for correlated relationship checks.",
        ],
        task: "Select users that have at least one order.",
        schema: "users.id ← orders.user_id",
        regex:
          /select\s+\*\s+from\s+users\s+(as\s+)?u\s+where\s+exists\s*\(\s*select\s+1\s+from\s+orders\s+(as\s+)?o\s+where\s+o\.user_id\s*=\s*u\.id\s*\)/i,
        successMessage: "EXISTS successfully checked related rows.",
        hint: "SELECT * FROM users u WHERE EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);",
        resultType: "data",
        mockData: [
          { id: 1, full_name: "Alice" },
          { id: 2, full_name: "Bob" },
        ],
      },

      {
        id: "11-4",
        title: "Find Missing Relationships",
        difficulty: "Intermediate",
        theory: [
          "NOT EXISTS finds rows for which no related record exists.",
          "It is commonly used for missing relationships and anti-joins.",
        ],
        task: "Find users that have never placed an order.",
        schema: "users.id ← orders.user_id",
        regex:
          /select\s+\*\s+from\s+users\s+(as\s+)?u\s+where\s+not\s+exists\s*\(\s*select\s+1\s+from\s+orders\s+(as\s+)?o\s+where\s+o\.user_id\s*=\s*u\.id\s*\)/i,
        successMessage: "Users without orders were found.",
        hint: "SELECT * FROM users u WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.user_id = u.id);",
        resultType: "data",
        mockData: [{ id: 8, full_name: "Emma" }],
      },

      {
        id: "11-5",
        title: "Correlated Subquery",
        difficulty: "Advanced",
        theory: [
          "A correlated subquery references values from the outer query.",
          "Conceptually, the inner query depends on each outer row.",
          "The PostgreSQL planner may rewrite or optimize correlated subqueries.",
        ],
        task: "Return each user's name and the number of orders they have.",
        schema: "users.id ← orders.user_id",
        regex:
          /select\s+u\.full_name\s*,\s*\(\s*select\s+count\s*\(\s*\*\s*\)\s+from\s+orders\s+(as\s+)?o\s+where\s+o\.user_id\s*=\s*u\.id\s*\)[\s\S]*from\s+users\s+(as\s+)?u/i,
        successMessage: "You executed a correlated subquery.",
        hint: "SELECT u.full_name, (SELECT COUNT(*) FROM orders o WHERE o.user_id = u.id) AS order_count FROM users u;",
        resultType: "data",
        mockData: [
          { full_name: "Alice", order_count: 8 },
          { full_name: "Bob", order_count: 5 },
        ],
      },
    ],
  },

  // =========================================================
  // MODULE 12 — CTEs
  // =========================================================
  {
    id: "mod-12",
    title: "12. Common Table Expressions",
    levels: [
      {
        id: "12-1",
        title: "Your First CTE",
        difficulty: "Intermediate",
        theory: [
          "A Common Table Expression is created using WITH.",
          "A CTE gives a temporary name to a query result for the duration of one statement.",
          "CTEs can make complex SQL easier to read and compose.",
        ],
        task: "Create a CTE named `high_value_orders` containing orders above 5000, then select everything from it.",
        schema: "Table: orders",
        regex:
          /with\s+high_value_orders\s+as\s*\(\s*select\s+\*\s+from\s+orders\s+where\s+total\s*>\s*5000\s*\)\s*select\s+\*\s+from\s+high_value_orders/i,
        successMessage: "Your first CTE executed successfully.",
        hint: "WITH high_value_orders AS (SELECT * FROM orders WHERE total > 5000) SELECT * FROM high_value_orders;",
        resultType: "data",
        mockData: [
          { id: 7, total: 8500 },
          { id: 12, total: 12000 },
        ],
      },

      {
        id: "12-2",
        title: "Aggregate Inside a CTE",
        difficulty: "Intermediate",
        theory: [
          "CTEs can contain aggregation, joins, filtering, or almost any SELECT query.",
          "The outer query can then operate on the prepared result.",
        ],
        task: "Create a CTE named `user_totals` that groups orders by user_id and calculates SUM(total), then select from it.",
        schema: "Table: orders",
        regex:
          /with\s+user_totals\s+as\s*\(\s*select\s+user_id\s*,\s*sum\s*\(\s*total\s*\)[\s\S]*from\s+orders\s+group\s+by\s+user_id\s*\)\s*select\s+\*\s+from\s+user_totals/i,
        successMessage: "Aggregated CTE created.",
        hint: "WITH user_totals AS (SELECT user_id, SUM(total) AS total_spent FROM orders GROUP BY user_id) SELECT * FROM user_totals;",
        resultType: "data",
        mockData: [
          { user_id: 1, total_spent: 18450 },
          { user_id: 2, total_spent: 9200 },
        ],
      },

      {
        id: "12-3",
        title: "Multiple CTEs",
        difficulty: "Advanced",
        theory: [
          "One WITH clause can define multiple CTEs.",
          "Later CTEs can reference earlier CTEs.",
          "This is useful for breaking a complicated transformation into understandable steps.",
        ],
        task: "Create `completed_orders` for completed orders and `user_totals` that sums those orders by user_id, then select from user_totals.",
        schema: "Table: orders\n- user_id\n- status\n- total",
        regex:
          /with\s+completed_orders\s+as\s*\([\s\S]*status\s*=\s*'completed'[\s\S]*\)\s*,\s*user_totals\s+as\s*\([\s\S]*sum\s*\(\s*total\s*\)[\s\S]*from\s+completed_orders[\s\S]*group\s+by\s+user_id[\s\S]*\)\s*select\s+\*\s+from\s+user_totals/i,
        successMessage: "Multiple CTEs executed in sequence.",
        hint: "WITH completed_orders AS (SELECT * FROM orders WHERE status = 'completed'), user_totals AS (SELECT user_id, SUM(total) AS total FROM completed_orders GROUP BY user_id) SELECT * FROM user_totals;",
        resultType: "data",
        mockData: [
          { user_id: 1, total: 16000 },
          { user_id: 2, total: 7500 },
        ],
      },

      {
        id: "12-4",
        title: "Create Hierarchical Categories",
        difficulty: "Intermediate",
        theory: [
          "Recursive CTEs are commonly used for hierarchical data.",
          "First, we need a self-referencing table where a category can have a parent category.",
        ],
        task: "Create `categories` with id INTEGER PRIMARY KEY, name VARCHAR(100), and parent_id INTEGER referencing categories(id).",
        schema: "Current tables remain unchanged.",
        regex:
          /create\s+table\s+categories\s*\([\s\S]*id\s+(integer|int)\s+primary\s+key[\s\S]*name\s+varchar\s*\(\s*100\s*\)[\s\S]*parent_id\s+(integer|int)\s+references\s+categories\s*\(\s*id\s*\)[\s\S]*\)/i,
        successMessage: "Hierarchical categories table created.",
        hint: "CREATE TABLE categories (id INTEGER PRIMARY KEY, name VARCHAR(100), parent_id INTEGER REFERENCES categories(id));",
        resultType: "command",
        mockData: [],
      },

      {
        id: "12-5",
        title: "Recursive CTE",
        difficulty: "Advanced",
        theory: [
          "WITH RECURSIVE allows a CTE to reference itself.",
          "A recursive CTE normally has an anchor query and a recursive query joined with UNION ALL.",
          "It is useful for trees, organizational structures, categories, and graph-like traversal.",
        ],
        task: "Starting from categories where parent_id IS NULL, recursively retrieve child categories.",
        schema: "Table: categories\n- id\n- name\n- parent_id",
        regex:
          /with\s+recursive\s+\w+\s+as\s*\([\s\S]*parent_id\s+is\s+null[\s\S]*union\s+all[\s\S]*join[\s\S]*parent_id\s*=[\s\S]*id[\s\S]*\)\s*select/i,
        successMessage: "Recursive hierarchy traversed.",
        hint: "WITH RECURSIVE tree AS (SELECT id, name, parent_id FROM categories WHERE parent_id IS NULL UNION ALL SELECT c.id, c.name, c.parent_id FROM categories c JOIN tree t ON c.parent_id = t.id) SELECT * FROM tree;",
        resultType: "data",
        mockData: [
          { id: 1, name: "Electronics", parent_id: null },
          { id: 2, name: "Mobiles", parent_id: 1 },
          { id: 3, name: "Laptops", parent_id: 1 },
        ],
      },
    ],
  },

  // =========================================================
  // MODULE 13 — DATE & TIME
  // =========================================================
  {
    id: "mod-13",
    title: "13. Date & Time",
    levels: [
      {
        id: "13-1",
        title: "Current Timestamp",
        difficulty: "Beginner",
        theory: [
          "NOW() returns the timestamp associated with the current transaction.",
          "TIMESTAMPTZ is generally preferred for timestamps representing real moments in time.",
        ],
        task: "Return the current PostgreSQL timestamp.",
        schema: "No table needed.",
        regex: /select\s+now\s*\(\s*\)/i,
        successMessage: "Current timestamp retrieved.",
        hint: "SELECT NOW();",
        resultType: "data",
        mockData: [{ now: "2026-10-02T16:30:00Z" }],
      },

      {
        id: "13-2",
        title: "Current Date",
        difficulty: "Beginner",
        theory: ["CURRENT_DATE returns today's date without a time component."],
        task: "Retrieve the current date.",
        schema: "No table needed.",
        regex: /select\s+current_date/i,
        successMessage: "Current date retrieved.",
        hint: "SELECT CURRENT_DATE;",
        resultType: "data",
        mockData: [{ current_date: "2026-10-02" }],
      },

      {
        id: "13-3",
        title: "Date Arithmetic with INTERVAL",
        difficulty: "Beginner",
        theory: [
          "INTERVAL represents a duration such as hours, days, or months.",
          "Intervals can be added to or subtracted from timestamps.",
        ],
        task: "Return the timestamp from 7 days ago.",
        schema: "No table needed.",
        regex: /select\s+now\s*\(\s*\)\s*-\s*interval\s+'7\s+days?'/i,
        successMessage: "Timestamp arithmetic completed.",
        hint: "SELECT NOW() - INTERVAL '7 days';",
        resultType: "data",
        mockData: [{ timestamp: "2026-09-25T16:30:00Z" }],
      },

      {
        id: "13-4",
        title: "Filter Recent Orders",
        difficulty: "Intermediate",
        theory: [
          "Timestamp arithmetic is commonly used for rolling time windows.",
          "This pattern is frequently used for recent activity, analytics, cleanup, and monitoring.",
        ],
        task: "Select orders created during the last 30 days.",
        schema: "Table: orders\n- created_at TIMESTAMPTZ",
        regex:
          /select\s+\*\s+from\s+orders\s+where\s+created_at\s*>=\s*now\s*\(\s*\)\s*-\s*interval\s+'30\s+days?'/i,
        successMessage: "Recent orders retrieved.",
        hint: "SELECT * FROM orders WHERE created_at >= NOW() - INTERVAL '30 days';",
        resultType: "data",
        mockData: [],
      },

      {
        id: "13-5",
        title: "Group by Month",
        difficulty: "Intermediate",
        theory: [
          "DATE_TRUNC reduces timestamps to a chosen precision.",
          "It is frequently used for hourly, daily, weekly, and monthly analytics.",
        ],
        task: "Return each order month and COUNT(*) grouped by month.",
        schema: "Table: orders\n- created_at",
        regex:
          /select\s+date_trunc\s*\(\s*'month'\s*,\s*created_at\s*\)[\s\S]*count\s*\(\s*\*\s*\)[\s\S]*from\s+orders[\s\S]*group\s+by\s+date_trunc\s*\(\s*'month'\s*,\s*created_at\s*\)/i,
        successMessage: "Orders grouped by month.",
        hint: "SELECT DATE_TRUNC('month', created_at) AS month, COUNT(*) FROM orders GROUP BY DATE_TRUNC('month', created_at);",
        resultType: "data",
        mockData: [
          { month: "2026-09-01", count: 42 },
          { month: "2026-10-01", count: 13 },
        ],
      },

      {
        id: "13-6",
        title: "Extract Date Components",
        difficulty: "Beginner",
        theory: [
          "EXTRACT pulls an individual component such as year, month, hour, or day from a date or timestamp.",
        ],
        task: "Extract the year from orders.created_at.",
        schema: "Table: orders",
        regex:
          /select\s+extract\s*\(\s*year\s+from\s+created_at\s*\)\s+from\s+orders/i,
        successMessage: "Year extracted from timestamp.",
        hint: "SELECT EXTRACT(YEAR FROM created_at) FROM orders;",
        resultType: "data",
        mockData: [{ extract: 2026 }],
      },
    ],
  },

  // =========================================================
  // MODULE 14 — STRING & NUMERIC FUNCTIONS
  // =========================================================
  {
    id: "mod-14",
    title: "14. String & Numeric Functions",
    levels: [
      {
        id: "14-1",
        title: "Convert Text to Lowercase",
        difficulty: "Beginner",
        theory: [
          "LOWER converts text to lowercase.",
          "String functions can transform values directly inside SQL.",
        ],
        task: "Return every user email in lowercase.",
        schema: "Table: users\n- email",
        regex: /select\s+lower\s*\(\s*email\s*\)\s+from\s+users/i,
        successMessage: "Email addresses converted to lowercase.",
        hint: "SELECT LOWER(email) FROM users;",
        resultType: "data",
        mockData: [{ lower: "alice@example.com" }],
      },

      {
        id: "14-2",
        title: "Concatenate Text",
        difficulty: "Beginner",
        theory: [
          "CONCAT combines multiple values into a single text value.",
          "PostgreSQL also supports the || concatenation operator.",
        ],
        task: "Return a string containing each user's full_name followed by their email separated by ' - '.",
        schema: "Table: users",
        regex:
          /select\s+concat\s*\(\s*full_name\s*,\s*'\s*-\s*'\s*,\s*email\s*\)\s+from\s+users/i,
        successMessage: "Text values concatenated.",
        hint: "SELECT CONCAT(full_name, ' - ', email) FROM users;",
        resultType: "data",
        mockData: [{ concat: "Alice - alice@example.com" }],
      },

      {
        id: "14-3",
        title: "Extract Email Domain",
        difficulty: "Intermediate",
        theory: [
          "SPLIT_PART splits text using a delimiter and returns one section.",
          "It is useful for simple structured strings such as email addresses.",
        ],
        task: "Return the domain portion of every email address.",
        schema: "Table: users\n- email",
        regex:
          /select\s+split_part\s*\(\s*email\s*,\s*'@'\s*,\s*2\s*\)\s+from\s+users/i,
        successMessage: "Email domains extracted.",
        hint: "SELECT SPLIT_PART(email, '@', 2) FROM users;",
        resultType: "data",
        mockData: [{ split_part: "example.com" }],
      },

      {
        id: "14-4",
        title: "Round Numeric Values",
        difficulty: "Beginner",
        theory: [
          "ROUND controls the number of decimal places returned for numeric values.",
        ],
        task: "Return order totals rounded to one decimal place.",
        schema: "Table: orders\n- total NUMERIC",
        regex: /select\s+round\s*\(\s*total\s*,\s*1\s*\)\s+from\s+orders/i,
        successMessage: "Numeric values rounded.",
        hint: "SELECT ROUND(total, 1) FROM orders;",
        resultType: "data",
        mockData: [{ round: 4999.5 }],
      },

      {
        id: "14-5",
        title: "Calculate an Absolute Value",
        difficulty: "Beginner",
        theory: [
          "ABS returns the absolute value of a number.",
          "It removes the negative sign from negative values.",
        ],
        task: "Return the absolute value of -250.",
        schema: "No table needed.",
        regex: /select\s+abs\s*\(\s*-250\s*\)/i,
        successMessage: "Absolute value calculated.",
        hint: "SELECT ABS(-250);",
        resultType: "data",
        mockData: [{ abs: 250 }],
      },
    ],
  },

  // =========================================================
  // MODULE 15 — TRANSACTIONS
  // =========================================================
  {
    id: "mod-15",
    title: "15. Transactions & ACID",
    levels: [
      {
        id: "15-1",
        title: "Begin and Commit a Transaction",
        difficulty: "Intermediate",
        theory: [
          "A transaction groups multiple database operations into one logical unit.",
          "BEGIN starts a transaction.",
          "COMMIT makes its changes permanent.",
          "Atomicity means either the complete transaction succeeds or its changes can be discarded.",
        ],
        task: "Start a transaction, update user id 1 to age 31, and commit the transaction.",
        schema: "Table: users",
        regex:
          /begin\s*;[\s\S]*update\s+users\s+set\s+age\s*=\s*31\s+where\s+id\s*=\s*1\s*;[\s\S]*commit\s*;?/i,
        successMessage: "Transaction committed successfully.",
        hint: "BEGIN; UPDATE users SET age = 31 WHERE id = 1; COMMIT;",
        resultType: "command",
        mockData: [],
      },

      {
        id: "15-2",
        title: "Rollback a Transaction",
        difficulty: "Intermediate",
        theory: [
          "ROLLBACK discards changes made since the transaction began.",
          "Transactions protect the database from partially completed operations.",
        ],
        task: "Start a transaction, delete user id 2, then roll back the transaction.",
        schema: "Table: users",
        regex:
          /begin\s*;[\s\S]*delete\s+from\s+users\s+where\s+id\s*=\s*2\s*;[\s\S]*rollback\s*;?/i,
        successMessage: "The delete was rolled back.",
        hint: "BEGIN; DELETE FROM users WHERE id = 2; ROLLBACK;",
        resultType: "command",
        mockData: [],
      },

      {
        id: "15-3",
        title: "Create a Savepoint",
        difficulty: "Intermediate",
        theory: [
          "SAVEPOINT creates a checkpoint inside a transaction.",
          "You can roll back part of a transaction without discarding everything.",
        ],
        task: "Begin a transaction and create a savepoint named `before_update`.",
        schema: "No table operation required.",
        regex: /begin\s*;[\s\S]*savepoint\s+before_update\s*;?/i,
        successMessage: "Savepoint created.",
        hint: "BEGIN; SAVEPOINT before_update;",
        resultType: "command",
        mockData: [],
      },

      {
        id: "15-4",
        title: "Rollback to Savepoint",
        difficulty: "Intermediate",
        theory: [
          "ROLLBACK TO SAVEPOINT reverses changes made after a savepoint while keeping the transaction active.",
        ],
        task: "Begin a transaction, create savepoint `before_update`, update user 1, then rollback to the savepoint.",
        schema: "Table: users",
        regex:
          /begin\s*;[\s\S]*savepoint\s+before_update\s*;[\s\S]*update\s+users[\s\S]*where\s+id\s*=\s*1\s*;[\s\S]*rollback\s+to(\s+savepoint)?\s+before_update/i,
        successMessage: "Partial transaction rollback completed.",
        hint: "BEGIN; SAVEPOINT before_update; UPDATE users SET age = 40 WHERE id = 1; ROLLBACK TO SAVEPOINT before_update;",
        resultType: "command",
        mockData: [],
      },

      {
        id: "15-5",
        title: "Set Transaction Isolation",
        difficulty: "Advanced",
        theory: [
          "Isolation controls how concurrent transactions see each other's changes.",
          "PostgreSQL commonly uses READ COMMITTED by default.",
          "SERIALIZABLE provides the strongest isolation and may require retrying transactions after serialization failures.",
        ],
        task: "Start a transaction using SERIALIZABLE isolation.",
        schema: "No table needed.",
        regex:
          /(begin|start\s+transaction)[\s\S]*(isolation\s+level\s+serializable|set\s+transaction\s+isolation\s+level\s+serializable)/i,
        successMessage: "Serializable transaction started.",
        hint: "BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;",
        resultType: "command",
        mockData: [],
      },
    ],
  },

  // =========================================================
  // MODULE 16 — LOCKING & CONCURRENCY
  // =========================================================
  {
    id: "mod-16",
    title: "16. Row Locks & Concurrency",
    levels: [
      {
        id: "16-1",
        title: "Lock a Row for Update",
        difficulty: "Advanced",
        theory: [
          "SELECT ... FOR UPDATE locks selected rows against conflicting modifications.",
          "The lock normally remains until the current transaction ends.",
          "This is useful when reading data that you are about to modify.",
        ],
        task: "Select user id 1 and lock that row using FOR UPDATE.",
        schema: "Table: users",
        regex:
          /select\s+\*\s+from\s+users\s+where\s+id\s*=\s*1\s+for\s+update/i,
        successMessage: "Row locked for update.",
        hint: "SELECT * FROM users WHERE id = 1 FOR UPDATE;",
        resultType: "data",
        mockData: [{ id: 1, full_name: "Alice" }],
      },

      {
        id: "16-2",
        title: "Fail Immediately with NOWAIT",
        difficulty: "Advanced",
        theory: [
          "Normally PostgreSQL waits if another transaction holds a conflicting row lock.",
          "NOWAIT tells PostgreSQL to return an error immediately instead of waiting.",
        ],
        task: "Lock user id 1 using FOR UPDATE NOWAIT.",
        schema: "Table: users",
        regex:
          /select\s+\*\s+from\s+users\s+where\s+id\s*=\s*1\s+for\s+update\s+nowait/i,
        successMessage: "NOWAIT locking strategy used.",
        hint: "SELECT * FROM users WHERE id = 1 FOR UPDATE NOWAIT;",
        resultType: "data",
        mockData: [{ id: 1, full_name: "Alice" }],
      },

      {
        id: "16-3",
        title: "Create a Worker Queue Table",
        difficulty: "Intermediate",
        theory: [
          "SKIP LOCKED is especially useful for database-backed worker queues.",
          "Multiple workers can safely claim different rows without waiting on each other.",
        ],
        task: "Create `jobs` with id BIGSERIAL PRIMARY KEY, status VARCHAR(20) DEFAULT 'pending', payload JSONB, and created_at TIMESTAMPTZ DEFAULT NOW().",
        schema: "Create a new worker queue table.",
        regex:
          /create\s+table\s+jobs\s*\([\s\S]*id\s+bigserial\s+primary\s+key[\s\S]*status\s+varchar\s*\(\s*20\s*\)\s+default\s+'pending'[\s\S]*payload\s+jsonb[\s\S]*created_at\s+(timestamptz|timestamp\s+with\s+time\s+zone)\s+default\s+now\s*\(\s*\)[\s\S]*\)/i,
        successMessage: "Jobs table created.",
        hint: "CREATE TABLE jobs (id BIGSERIAL PRIMARY KEY, status VARCHAR(20) DEFAULT 'pending', payload JSONB, created_at TIMESTAMPTZ DEFAULT NOW());",
        resultType: "command",
        mockData: [],
      },

      {
        id: "16-4",
        title: "Claim Work with SKIP LOCKED",
        difficulty: "Advanced",
        theory: [
          "SKIP LOCKED skips rows currently locked by other transactions.",
          "It is useful when many workers compete for pending jobs.",
          "Each worker can claim available work without waiting behind another worker.",
        ],
        task: "Select one pending job ordered by id and lock it using FOR UPDATE SKIP LOCKED.",
        schema: "Table: jobs\n- id\n- status\n- payload",
        regex:
          /select\s+\*\s+from\s+jobs\s+where\s+status\s*=\s*'pending'\s+order\s+by\s+id[\s\S]*limit\s+1[\s\S]*for\s+update\s+skip\s+locked/i,
        successMessage: "A worker-safe job claim query was created.",
        hint: "SELECT * FROM jobs WHERE status = 'pending' ORDER BY id LIMIT 1 FOR UPDATE SKIP LOCKED;",
        resultType: "data",
        mockData: [
          { id: 7, status: "pending", payload: { type: "SEND_EMAIL" } },
        ],
      },

      {
        id: "16-5",
        title: "Understand Deadlock Prevention",
        difficulty: "Advanced",
        theory: [
          "A deadlock occurs when transactions wait on each other in a cycle.",
          "PostgreSQL detects deadlocks and aborts one transaction.",
          "A common prevention strategy is locking resources in a consistent order.",
        ],
        task: "Lock users 1 and 2 in deterministic id order using one FOR UPDATE query.",
        schema: "Table: users",
        regex:
          /select\s+\*\s+from\s+users\s+where\s+id\s+in\s*\(\s*1\s*,\s*2\s*\)\s+order\s+by\s+id\s+for\s+update/i,
        successMessage: "Rows are locked in deterministic order.",
        hint: "SELECT * FROM users WHERE id IN (1, 2) ORDER BY id FOR UPDATE;",
        resultType: "data",
        mockData: [
          { id: 1, full_name: "Alice" },
          { id: 2, full_name: "Bob" },
        ],
      },
    ],
  },

  // =========================================================
  // MODULE 17 — INDEXES
  // =========================================================
  {
    id: "mod-17",
    title: "17. Indexes",
    levels: [
      {
        id: "17-1",
        title: "Create a Basic Index",
        difficulty: "Intermediate",
        theory: [
          "An index is an additional data structure PostgreSQL can use to find rows efficiently.",
          "B-tree is PostgreSQL's default index type.",
          "Indexes improve many reads but consume disk space and add write overhead.",
        ],
        task: "Create an index named `idx_users_email` on users(email).",
        schema: "Table: users\n- email",
        regex:
          /create\s+index\s+idx_users_email\s+on\s+users\s*\(\s*email\s*\)/i,
        successMessage: "Email index created.",
        hint: "CREATE INDEX idx_users_email ON users(email);",
        resultType: "command",
        mockData: [],
      },

      {
        id: "17-2",
        title: "Create a Composite Index",
        difficulty: "Intermediate",
        theory: [
          "A composite index contains multiple columns.",
          "Column order matters.",
          "An index on (user_id, created_at) is especially useful when filtering by user_id and then using created_at.",
        ],
        task: "Create `idx_orders_user_created` on orders(user_id, created_at).",
        schema: "Table: orders",
        regex:
          /create\s+index\s+idx_orders_user_created\s+on\s+orders\s*\(\s*user_id\s*,\s*created_at\s*\)/i,
        successMessage: "Composite index created.",
        hint: "CREATE INDEX idx_orders_user_created ON orders(user_id, created_at);",
        resultType: "command",
        mockData: [],
      },

      {
        id: "17-3",
        title: "Create a Unique Index",
        difficulty: "Intermediate",
        theory: [
          "A UNIQUE index both accelerates lookups and enforces uniqueness.",
          "Unique constraints are normally preferred when uniqueness is a business rule, but understanding unique indexes is important.",
        ],
        task: "Create a unique index named `idx_departments_name_unique` on departments(name).",
        schema: "Table: departments",
        regex:
          /create\s+unique\s+index\s+idx_departments_name_unique\s+on\s+departments\s*\(\s*name\s*\)/i,
        successMessage: "Unique index created.",
        hint: "CREATE UNIQUE INDEX idx_departments_name_unique ON departments(name);",
        resultType: "command",
        mockData: [],
      },

      {
        id: "17-4",
        title: "Create a Partial Index",
        difficulty: "Advanced",
        theory: [
          "A partial index stores entries only for rows matching a condition.",
          "It can be much smaller when queries repeatedly target a small subset of a table.",
          "Pending jobs are a common real-world example.",
        ],
        task: "Create `idx_jobs_pending` on jobs(id) only for rows where status = 'pending'.",
        schema: "Table: jobs",
        regex:
          /create\s+index\s+idx_jobs_pending\s+on\s+jobs\s*\(\s*id\s*\)\s+where\s+status\s*=\s*'pending'/i,
        successMessage: "Partial index created.",
        hint: "CREATE INDEX idx_jobs_pending ON jobs(id) WHERE status = 'pending';",
        resultType: "command",
        mockData: [],
      },

      {
        id: "17-5",
        title: "Create an Expression Index",
        difficulty: "Advanced",
        theory: [
          "Expression indexes store the result of an expression rather than the raw column value.",
          "They are useful when queries repeatedly apply the same function.",
        ],
        task: "Create `idx_users_lower_email` on LOWER(email).",
        schema: "Table: users",
        regex:
          /create\s+index\s+idx_users_lower_email\s+on\s+users\s*\(\s*lower\s*\(\s*email\s*\)\s*\)/i,
        successMessage: "Expression index created.",
        hint: "CREATE INDEX idx_users_lower_email ON users(LOWER(email));",
        resultType: "command",
        mockData: [],
      },

      {
        id: "17-6",
        title: "Create an Index Concurrently",
        difficulty: "Advanced",
        theory: [
          "Normal index creation can block writes while parts of the operation are performed.",
          "CREATE INDEX CONCURRENTLY reduces blocking for production tables.",
          "It takes longer and has transactional restrictions, but is important for production migrations.",
        ],
        task: "Create `idx_orders_status` on orders(status) using CONCURRENTLY.",
        schema: "Table: orders",
        regex:
          /create\s+index\s+concurrently\s+idx_orders_status\s+on\s+orders\s*\(\s*status\s*\)/i,
        successMessage: "Concurrent index creation requested.",
        hint: "CREATE INDEX CONCURRENTLY idx_orders_status ON orders(status);",
        resultType: "command",
        mockData: [],
      },

      {
        id: "17-7",
        title: "Drop an Index",
        difficulty: "Beginner",
        theory: [
          "Unused indexes consume disk space and slow INSERT, UPDATE, and DELETE operations.",
          "DROP INDEX removes an index without deleting table data.",
        ],
        task: "Drop the index `idx_users_email`.",
        schema: "Existing Index: idx_users_email",
        regex: /drop\s+index\s+idx_users_email/i,
        successMessage: "Index dropped.",
        hint: "DROP INDEX idx_users_email;",
        resultType: "command",
        mockData: [],
      },
    ],
  },

  // =========================================================
  // MODULE 18 — EXPLAIN & EXECUTION PLANS
  // =========================================================
  {
    id: "mod-18",
    title: "18. EXPLAIN & Execution Plans",
    levels: [
      {
        id: "18-1",
        title: "Inspect a Query Plan",
        difficulty: "Intermediate",
        theory: [
          "EXPLAIN shows the execution plan PostgreSQL intends to use.",
          "It does not execute a normal SELECT query.",
          "The plan shows operations such as scans, joins, sorts, and aggregates.",
        ],
        task: "Use EXPLAIN on a query selecting users where email = 'alice@example.com'.",
        schema: "Table: users",
        regex:
          /explain\s+select\s+\*\s+from\s+users\s+where\s+email\s*=\s*'alice@example\.com'/i,
        successMessage: "Execution plan generated.",
        hint: "EXPLAIN SELECT * FROM users WHERE email = 'alice@example.com';",
        resultType: "data",
        mockData: [
          {
            plan: "Index Scan using users_email_key on users",
          },
        ],
      },

      {
        id: "18-2",
        title: "Measure Actual Execution",
        difficulty: "Intermediate",
        theory: [
          "EXPLAIN ANALYZE actually executes the query.",
          "It reports estimated costs together with actual timing and row counts.",
          "Be careful using it with UPDATE, DELETE, or INSERT because those statements really execute.",
        ],
        task: "Use EXPLAIN ANALYZE to inspect users with age > 30.",
        schema: "Table: users",
        regex:
          /explain\s+analyze\s+select\s+\*\s+from\s+users\s+where\s+age\s*>\s*30/i,
        successMessage: "Actual execution statistics generated.",
        hint: "EXPLAIN ANALYZE SELECT * FROM users WHERE age > 30;",
        resultType: "data",
        mockData: [
          {
            plan: "Seq Scan on users (actual time=0.020..0.041 rows=8 loops=1)",
          },
        ],
      },

      {
        id: "18-3",
        title: "Inspect Buffer Usage",
        difficulty: "Advanced",
        theory: [
          "BUFFERS shows how many data blocks were accessed.",
          "Shared hit means PostgreSQL found a page in shared buffers.",
          "Shared read means PostgreSQL requested a page that was not already present in shared buffers.",
          "This information is extremely useful when investigating I/O-heavy queries.",
        ],
        task: "Run EXPLAIN with ANALYZE and BUFFERS for selecting all orders belonging to user_id 1.",
        schema: "Table: orders",
        regex:
          /explain\s*\(\s*analyze\s*,\s*buffers\s*\)\s+select\s+\*\s+from\s+orders\s+where\s+user_id\s*=\s*1/i,
        successMessage: "Execution and buffer statistics generated.",
        hint: "EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders WHERE user_id = 1;",
        resultType: "data",
        mockData: [
          {
            plan: "Bitmap Heap Scan on orders",
          },
          {
            plan: "Buffers: shared hit=18 read=2",
          },
        ],
      },

      {
        id: "18-4",
        title: "Analyze a Join",
        difficulty: "Advanced",
        theory: [
          "Execution plans reveal which join algorithm PostgreSQL selected.",
          "Common algorithms include Nested Loop, Hash Join, and Merge Join.",
          "There is no universally best join algorithm; the planner chooses based on estimated cost.",
        ],
        task: "Use EXPLAIN ANALYZE on a join between users and orders using users.id = orders.user_id.",
        schema: "users.id ← orders.user_id",
        regex:
          /explain\s+analyze\s+select[\s\S]*from\s+users\s+(as\s+)?u\s+join\s+orders\s+(as\s+)?o\s+on\s+u\.id\s*=\s*o\.user_id/i,
        successMessage: "Join execution plan generated.",
        hint: "EXPLAIN ANALYZE SELECT u.full_name, o.total FROM users u JOIN orders o ON u.id = o.user_id;",
        resultType: "data",
        mockData: [
          {
            plan: "Hash Join",
          },
        ],
      },
    ],
  },

  // =========================================================
  // MODULE 19 — QUERY PLANNER & STATISTICS
  // =========================================================
  {
    id: "mod-19",
    title: "19. Query Planner & Statistics",
    levels: [
      {
        id: "19-1",
        title: "Refresh Table Statistics",
        difficulty: "Intermediate",
        theory: [
          "PostgreSQL's planner estimates how many rows each operation will produce.",
          "ANALYZE collects statistics about table contents.",
          "Accurate statistics help PostgreSQL choose efficient execution plans.",
        ],
        task: "Run ANALYZE on the users table.",
        schema: "Table: users",
        regex: /analyze\s+users/i,
        successMessage: "Planner statistics refreshed.",
        hint: "ANALYZE users;",
        resultType: "command",
        mockData: [],
      },

      {
        id: "19-2",
        title: "Inspect Planner Statistics",
        difficulty: "Advanced",
        theory: [
          "The pg_stats system view exposes statistics collected by ANALYZE.",
          "Useful fields include n_distinct, most_common_vals, most_common_freqs, and histogram_bounds.",
          "These statistics help the planner estimate selectivity.",
        ],
        task: "Select attname and n_distinct from pg_stats for the users table.",
        schema: "System View: pg_stats",
        regex:
          /select\s+attname\s*,\s*n_distinct\s+from\s+pg_stats\s+where\s+tablename\s*=\s*'users'/i,
        successMessage: "Column statistics inspected.",
        hint: "SELECT attname, n_distinct FROM pg_stats WHERE tablename = 'users';",
        resultType: "data",
        mockData: [
          { attname: "id", n_distinct: -1 },
          { attname: "department_id", n_distinct: 3 },
          { attname: "is_active", n_distinct: 2 },
        ],
      },

      {
        id: "19-3",
        title: "Understand Sequential Scan",
        difficulty: "Intermediate",
        theory: [
          "A Sequential Scan reads table pages and evaluates rows.",
          "Sequential scans are not inherently bad.",
          "If a query needs a large percentage of a table, a sequential scan can be cheaper than many index lookups.",
        ],
        task: "Use EXPLAIN on a query selecting every row from users.",
        schema: "Table: users",
        regex: /explain\s+select\s+\*\s+from\s+users/i,
        successMessage: "Sequential scan plan inspected.",
        hint: "EXPLAIN SELECT * FROM users;",
        resultType: "data",
        mockData: [
          {
            plan: "Seq Scan on users",
          },
        ],
      },

      {
        id: "19-4",
        title: "Understand Index Scan",
        difficulty: "Intermediate",
        theory: [
          "An Index Scan uses an index to locate matching rows.",
          "It is typically useful when the predicate is selective.",
          "PostgreSQL still decides whether using an available index is actually cheaper.",
        ],
        task: "Use EXPLAIN on a selective query searching users by email.",
        schema: "Table: users\nUnique index exists on email.",
        regex:
          /explain\s+select\s+\*\s+from\s+users\s+where\s+email\s*=\s*'alice@example\.com'/i,
        successMessage: "Index-based lookup inspected.",
        hint: "EXPLAIN SELECT * FROM users WHERE email = 'alice@example.com';",
        resultType: "data",
        mockData: [
          {
            plan: "Index Scan using users_email_key on users",
          },
        ],
      },

      {
        id: "19-5",
        title: "Understand Bitmap Scan",
        difficulty: "Advanced",
        theory: [
          "A Bitmap Index Scan first finds matching tuple locations.",
          "A Bitmap Heap Scan then groups heap page accesses efficiently.",
          "Bitmap scans are often useful when more rows match than would make a simple Index Scan ideal, but not enough to justify scanning the entire table.",
        ],
        task: "Use EXPLAIN on orders where user_id = 1.",
        schema: "Index: idx_orders_user_created(user_id, created_at)",
        regex:
          /explain\s+select\s+\*\s+from\s+orders\s+where\s+user_id\s*=\s*1/i,
        successMessage: "Planner scan strategy inspected.",
        hint: "EXPLAIN SELECT * FROM orders WHERE user_id = 1;",
        resultType: "data",
        mockData: [
          {
            plan: "Bitmap Heap Scan on orders",
          },
          {
            plan: "Bitmap Index Scan on idx_orders_user_created",
          },
        ],
      },

      {
        id: "19-6",
        title: "Compare Estimated and Actual Rows",
        difficulty: "Advanced",
        theory: [
          "A major optimization skill is comparing estimated rows with actual rows.",
          "Large differences may indicate poor statistics, correlated columns, or unusual data distribution.",
          "Bad cardinality estimates can cause PostgreSQL to choose the wrong join or scan strategy.",
        ],
        task: "Run EXPLAIN ANALYZE on orders where status = 'pending'.",
        schema: "Table: orders",
        regex:
          /explain\s+analyze\s+select\s+\*\s+from\s+orders\s+where\s+status\s*=\s*'pending'/i,
        successMessage: "Estimated and actual row counts are now visible.",
        hint: "EXPLAIN ANALYZE SELECT * FROM orders WHERE status = 'pending';",
        resultType: "data",
        mockData: [
          {
            plan: "Seq Scan on orders (cost=0.00..120.00 rows=450) (actual rows=430)",
          },
        ],
      },
    ],
  },

  // =========================================================
  // MODULE 20 — JSONB
  // =========================================================
  {
    id: "mod-20",
    title: "20. JSONB",
    levels: [
      {
        id: "20-1",
        title: "Add a JSONB Column",
        difficulty: "Intermediate",
        theory: [
          "JSONB stores JSON in PostgreSQL's binary JSON representation.",
          "It supports indexing and powerful operators.",
          "JSONB is useful for flexible attributes, but strongly structured frequently queried data often belongs in normal relational columns.",
        ],
        task: "Add a JSONB column named `preferences` to users.",
        schema: "Table: users",
        regex: /alter\s+table\s+users\s+add\s+(column\s+)?preferences\s+jsonb/i,
        successMessage: "JSONB column added.",
        hint: "ALTER TABLE users ADD COLUMN preferences JSONB;",
        resultType: "command",
        mockData: [],
      },

      {
        id: "20-2",
        title: "Store JSONB Data",
        difficulty: "Intermediate",
        theory: [
          "Valid JSON can be stored directly in a JSONB column.",
          "Objects, arrays, strings, numbers, booleans, and null values are supported.",
        ],
        task: "Set user id 1 preferences to JSON containing theme = dark and language = en.",
        schema: "Table: users\n- preferences JSONB",
        regex:
          /update\s+users\s+set\s+preferences\s*=\s*'\s*\{\s*"theme"\s*:\s*"dark"\s*,\s*"language"\s*:\s*"en"\s*\}\s*'\s*(::\s*jsonb)?\s+where\s+id\s*=\s*1/i,
        successMessage: "JSONB data stored.",
        hint: `UPDATE users SET preferences = '{"theme":"dark","language":"en"}'::jsonb WHERE id = 1;`,
        resultType: "command",
        mockData: [],
      },

      {
        id: "20-3",
        title: "Extract a JSONB Object",
        difficulty: "Intermediate",
        theory: [
          "The -> operator extracts a JSON value and keeps it as JSON/JSONB.",
          "The ->> operator extracts the value as text.",
        ],
        task: "Select the `theme` value from preferences as JSONB using ->.",
        schema: "Table: users\n- preferences JSONB",
        regex: /select\s+preferences\s*->\s*'theme'\s+from\s+users/i,
        successMessage: "JSONB value extracted.",
        hint: "SELECT preferences -> 'theme' FROM users;",
        resultType: "data",
        mockData: [{ theme: "dark" }],
      },

      {
        id: "20-4",
        title: "Extract JSONB as Text",
        difficulty: "Intermediate",
        theory: [
          "->> returns a JSON field as SQL text.",
          "It is commonly used when comparing JSON values against text.",
        ],
        task: "Select the theme from preferences as text.",
        schema: "Table: users",
        regex: /select\s+preferences\s*->>\s*'theme'\s+from\s+users/i,
        successMessage: "JSONB value extracted as text.",
        hint: "SELECT preferences ->> 'theme' FROM users;",
        resultType: "data",
        mockData: [{ theme: "dark" }],
      },

      {
        id: "20-5",
        title: "Filter JSONB Values",
        difficulty: "Intermediate",
        theory: [
          "JSONB values can participate in WHERE conditions.",
          "When using ->>, the extracted value behaves like text.",
        ],
        task: "Select users whose preferences theme is `dark`.",
        schema: "Table: users",
        regex:
          /select\s+\*\s+from\s+users\s+where\s+preferences\s*->>\s*'theme'\s*=\s*'dark'/i,
        successMessage: "Users filtered using JSONB data.",
        hint: "SELECT * FROM users WHERE preferences ->> 'theme' = 'dark';",
        resultType: "data",
        mockData: [
          {
            id: 1,
            full_name: "Alice",
            preferences: {
              theme: "dark",
              language: "en",
            },
          },
        ],
      },

      {
        id: "20-6",
        title: "JSONB Containment",
        difficulty: "Advanced",
        theory: [
          "The @> operator checks whether one JSONB value contains another.",
          "Containment queries can work efficiently with an appropriate GIN index.",
        ],
        task: "Find users whose preferences contain theme = dark using @>.",
        schema: "Table: users",
        regex:
          /select\s+\*\s+from\s+users\s+where\s+preferences\s*@>\s*'\s*\{\s*"theme"\s*:\s*"dark"\s*\}\s*'\s*(::\s*jsonb)?/i,
        successMessage: "JSONB containment query executed.",
        hint: `SELECT * FROM users WHERE preferences @> '{"theme":"dark"}'::jsonb;`,
        resultType: "data",
        mockData: [
          {
            id: 1,
            full_name: "Alice",
          },
        ],
      },

      {
        id: "20-7",
        title: "Update One JSONB Field",
        difficulty: "Advanced",
        theory: [
          "jsonb_set can replace or add a value at a JSON path.",
          "Updating part of a JSONB document still creates a new PostgreSQL row version because PostgreSQL uses MVCC.",
        ],
        task: "Change user id 1 preference theme to `light` using jsonb_set.",
        schema: "Table: users",
        regex:
          /update\s+users\s+set\s+preferences\s*=\s*jsonb_set\s*\(\s*preferences\s*,\s*'\{theme\}'\s*,\s*'"light"'\s*(::\s*jsonb)?\s*\)\s+where\s+id\s*=\s*1/i,
        successMessage: "Nested JSONB value updated.",
        hint: `UPDATE users SET preferences = jsonb_set(preferences, '{theme}', '"light"'::jsonb) WHERE id = 1;`,
        resultType: "command",
        mockData: [],
      },

      {
        id: "20-8",
        title: "Create a GIN Index",
        difficulty: "Advanced",
        theory: [
          "GIN indexes are commonly used for JSONB containment and key searches.",
          "A B-tree index and a GIN index solve different problems.",
          "GIN indexes can make JSONB searches fast but increase storage and write cost.",
        ],
        task: "Create a GIN index named `idx_users_preferences` on users(preferences).",
        schema: "Table: users\n- preferences JSONB",
        regex:
          /create\s+index\s+idx_users_preferences\s+on\s+users\s+using\s+gin\s*\(\s*preferences\s*\)/i,
        successMessage: "GIN index created for JSONB.",
        hint: "CREATE INDEX idx_users_preferences ON users USING GIN(preferences);",
        resultType: "command",
        mockData: [],
      },

      {
        id: "20-9",
        title: "Inspect JSONB Query Performance",
        difficulty: "Advanced",
        theory: [
          "After creating an index, use EXPLAIN ANALYZE rather than assuming PostgreSQL will use it.",
          "The planner may still prefer a sequential scan for small tables or low-selectivity predicates.",
        ],
        task: "Use EXPLAIN ANALYZE on the JSONB containment query for theme = dark.",
        schema: "Index: idx_users_preferences",
        regex:
          /explain\s+analyze\s+select\s+\*\s+from\s+users\s+where\s+preferences\s*@>\s*'\s*\{\s*"theme"\s*:\s*"dark"\s*\}\s*'\s*(::\s*jsonb)?/i,
        successMessage: "JSONB execution plan inspected.",
        hint: `EXPLAIN ANALYZE SELECT * FROM users WHERE preferences @> '{"theme":"dark"}'::jsonb;`,
        resultType: "data",
        mockData: [
          {
            plan: "Bitmap Heap Scan on users",
          },
          {
            plan: "Bitmap Index Scan on idx_users_preferences",
          },
        ],
      },
    ],
  },

  // =========================================================
  // MODULE 21 — ARRAYS
  // =========================================================
  {
    id: "mod-21",
    title: "21. PostgreSQL Arrays",
    levels: [
      {
        id: "21-1",
        title: "Add an Array Column",
        difficulty: "Intermediate",
        theory: [
          "PostgreSQL allows a column to store an array of values of the same data type.",
          "TEXT[] represents an array of text values.",
          "Arrays are useful for small collections that naturally belong to one row.",
        ],
        task: "Add a TEXT[] column named `interests` to the users table.",
        schema: "Table: users",
        regex:
          /alter\s+table\s+users\s+add\s+(column\s+)?interests\s+text\s*\[\s*\]/i,
        successMessage: "Array column added successfully.",
        hint: "ALTER TABLE users ADD COLUMN interests TEXT[];",
        resultType: "command",
        mockData: [],
      },

      {
        id: "21-2",
        title: "Store an Array",
        difficulty: "Intermediate",
        theory: [
          "ARRAY[...] creates an array value.",
          "All elements normally need to be compatible with the array's element type.",
        ],
        task: "Set user id 1 interests to `music`, `travel`, and `technology`.",
        schema: "Table: users\n- interests TEXT[]",
        regex:
          /update\s+users\s+set\s+interests\s*=\s*array\s*\[\s*'music'\s*,\s*'travel'\s*,\s*'technology'\s*\]\s+where\s+id\s*=\s*1/i,
        successMessage: "Array data stored.",
        hint: "UPDATE users SET interests = ARRAY['music', 'travel', 'technology'] WHERE id = 1;",
        resultType: "command",
        mockData: [],
      },

      {
        id: "21-3",
        title: "Access an Array Element",
        difficulty: "Intermediate",
        theory: [
          "PostgreSQL arrays use 1-based indexing by default.",
          "The first element is accessed with [1], not [0].",
        ],
        task: "Return the first interest of every user.",
        schema: "Table: users\n- interests TEXT[]",
        regex: /select\s+interests\s*\[\s*1\s*\]\s+from\s+users/i,
        successMessage: "Array element retrieved.",
        hint: "SELECT interests[1] FROM users;",
        resultType: "data",
        mockData: [{ interests: "music" }],
      },

      {
        id: "21-4",
        title: "Search with ANY",
        difficulty: "Intermediate",
        theory: [
          "ANY can compare a scalar value against every element of an array.",
          "This is useful for finding rows where an array contains a specific value.",
        ],
        task: "Find users whose interests contain `travel` using ANY.",
        schema: "Table: users\n- interests TEXT[]",
        regex:
          /select\s+\*\s+from\s+users\s+where\s+'travel'\s*=\s*any\s*\(\s*interests\s*\)/i,
        successMessage: "Array searched using ANY.",
        hint: "SELECT * FROM users WHERE 'travel' = ANY(interests);",
        resultType: "data",
        mockData: [
          {
            id: 1,
            full_name: "Alice",
            interests: ["music", "travel", "technology"],
          },
        ],
      },

      {
        id: "21-5",
        title: "Array Containment",
        difficulty: "Advanced",
        theory: [
          "The @> operator means contains.",
          "For arrays, it checks whether the left array contains the values from the right array.",
        ],
        task: "Find users whose interests contain `technology` using @>.",
        schema: "Table: users",
        regex:
          /select\s+\*\s+from\s+users\s+where\s+interests\s*@>\s*array\s*\[\s*'technology'\s*\]/i,
        successMessage: "Array containment query executed.",
        hint: "SELECT * FROM users WHERE interests @> ARRAY['technology'];",
        resultType: "data",
        mockData: [
          {
            id: 1,
            full_name: "Alice",
          },
        ],
      },

      {
        id: "21-6",
        title: "Append an Array Value",
        difficulty: "Intermediate",
        theory: [
          "array_append adds a value to the end of an array.",
          "PostgreSQL returns a new array value that can be stored back into the column.",
        ],
        task: "Append `sports` to the interests of user id 1.",
        schema: "Table: users",
        regex:
          /update\s+users\s+set\s+interests\s*=\s*array_append\s*\(\s*interests\s*,\s*'sports'\s*\)\s+where\s+id\s*=\s*1/i,
        successMessage: "New array value appended.",
        hint: "UPDATE users SET interests = array_append(interests, 'sports') WHERE id = 1;",
        resultType: "command",
        mockData: [],
      },

      {
        id: "21-7",
        title: "Expand an Array with UNNEST",
        difficulty: "Intermediate",
        theory: [
          "UNNEST converts array elements into rows.",
          "It is useful when individual elements need to be processed relationally.",
        ],
        task: "Expand the interests of user id 1 into separate rows.",
        schema: "Table: users",
        regex:
          /select\s+unnest\s*\(\s*interests\s*\)\s+from\s+users\s+where\s+id\s*=\s*1/i,
        successMessage: "Array expanded into rows.",
        hint: "SELECT UNNEST(interests) FROM users WHERE id = 1;",
        resultType: "data",
        mockData: [
          { unnest: "music" },
          { unnest: "travel" },
          { unnest: "technology" },
          { unnest: "sports" },
        ],
      },
    ],
  },

  // =========================================================
  // MODULE 22 — VIEWS & MATERIALIZED VIEWS
  // =========================================================
  {
    id: "mod-22",
    title: "22. Views & Materialized Views",
    levels: [
      {
        id: "22-1",
        title: "Create a View",
        difficulty: "Intermediate",
        theory: [
          "A view stores a query definition rather than storing its result.",
          "When you query a normal view, PostgreSQL executes the underlying query.",
          "Views can simplify frequently used queries.",
        ],
        task: "Create a view named `active_users` containing users where is_active is TRUE.",
        schema: "Table: users",
        regex:
          /create\s+view\s+active_users\s+as\s+select\s+\*\s+from\s+users\s+where\s+is_active\s*=\s*true/i,
        successMessage: "View created.",
        hint: "CREATE VIEW active_users AS SELECT * FROM users WHERE is_active = TRUE;",
        resultType: "command",
        mockData: [],
      },

      {
        id: "22-2",
        title: "Query a View",
        difficulty: "Beginner",
        theory: ["A view can normally be queried just like a table."],
        task: "Select all rows from the active_users view.",
        schema: "View: active_users",
        regex: /select\s+\*\s+from\s+active_users/i,
        successMessage: "View queried successfully.",
        hint: "SELECT * FROM active_users;",
        resultType: "data",
        mockData: [
          {
            id: 1,
            full_name: "Alice",
            is_active: true,
          },
        ],
      },

      {
        id: "22-3",
        title: "Replace a View",
        difficulty: "Intermediate",
        theory: [
          "CREATE OR REPLACE VIEW changes a view definition without manually dropping the view first.",
          "There are restrictions on changing the existing output columns of a view.",
        ],
        task: "Replace active_users so it returns only id, full_name, and email for active users.",
        schema: "View: active_users",
        regex:
          /create\s+or\s+replace\s+view\s+active_users\s+as\s+select\s+id\s*,\s*full_name\s*,\s*email\s+from\s+users\s+where\s+is_active\s*=\s*true/i,
        successMessage: "View definition replaced.",
        hint: "CREATE OR REPLACE VIEW active_users AS SELECT id, full_name, email FROM users WHERE is_active = TRUE;",
        resultType: "command",
        mockData: [],
      },

      {
        id: "22-4",
        title: "Create a Materialized View",
        difficulty: "Intermediate",
        theory: [
          "A materialized view physically stores the result of its query.",
          "Reading a materialized view can be faster than repeatedly running an expensive aggregation.",
          "Unlike a normal view, its stored data can become stale.",
        ],
        task: "Create a materialized view named `user_order_summary` containing user_id, COUNT(*) as order_count, and SUM(total) as total_spent grouped by user_id.",
        schema: "Table: orders",
        regex:
          /create\s+materialized\s+view\s+user_order_summary\s+as\s+select\s+user_id\s*,\s*count\s*\(\s*\*\s*\)\s+as\s+order_count\s*,\s*sum\s*\(\s*total\s*\)\s+as\s+total_spent\s+from\s+orders\s+group\s+by\s+user_id/i,
        successMessage: "Materialized view created.",
        hint: "CREATE MATERIALIZED VIEW user_order_summary AS SELECT user_id, COUNT(*) AS order_count, SUM(total) AS total_spent FROM orders GROUP BY user_id;",
        resultType: "command",
        mockData: [],
      },

      {
        id: "22-5",
        title: "Refresh a Materialized View",
        difficulty: "Intermediate",
        theory: [
          "Materialized views do not automatically reflect changes in their source tables.",
          "REFRESH MATERIALIZED VIEW rebuilds the stored result.",
        ],
        task: "Refresh the user_order_summary materialized view.",
        schema: "Materialized View: user_order_summary",
        regex: /refresh\s+materialized\s+view\s+user_order_summary/i,
        successMessage: "Materialized view refreshed.",
        hint: "REFRESH MATERIALIZED VIEW user_order_summary;",
        resultType: "command",
        mockData: [],
      },

      {
        id: "22-6",
        title: "Prepare Concurrent Refresh",
        difficulty: "Advanced",
        theory: [
          "REFRESH MATERIALIZED VIEW CONCURRENTLY allows reads to continue while the view is refreshed.",
          "PostgreSQL requires a qualifying UNIQUE index on the materialized view for concurrent refresh.",
        ],
        task: "Create a unique index named `idx_user_order_summary_user` on user_order_summary(user_id).",
        schema: "Materialized View: user_order_summary",
        regex:
          /create\s+unique\s+index\s+idx_user_order_summary_user\s+on\s+user_order_summary\s*\(\s*user_id\s*\)/i,
        successMessage: "Materialized view prepared for concurrent refresh.",
        hint: "CREATE UNIQUE INDEX idx_user_order_summary_user ON user_order_summary(user_id);",
        resultType: "command",
        mockData: [],
      },

      {
        id: "22-7",
        title: "Refresh Concurrently",
        difficulty: "Advanced",
        theory: [
          "A concurrent refresh reduces blocking for readers.",
          "It usually performs more work than a normal refresh.",
        ],
        task: "Refresh user_order_summary concurrently.",
        schema: "Materialized View: user_order_summary",
        regex:
          /refresh\s+materialized\s+view\s+concurrently\s+user_order_summary/i,
        successMessage: "Concurrent materialized view refresh executed.",
        hint: "REFRESH MATERIALIZED VIEW CONCURRENTLY user_order_summary;",
        resultType: "command",
        mockData: [],
      },
    ],
  },

  // =========================================================
  // MODULE 23 — FUNCTIONS, PROCEDURES & PL/pgSQL
  // =========================================================
  {
    id: "mod-23",
    title: "23. Functions, Procedures & PL/pgSQL",
    levels: [
      {
        id: "23-1",
        title: "Create a SQL Function",
        difficulty: "Advanced",
        theory: [
          "PostgreSQL functions package reusable database logic.",
          "Functions can accept parameters and return values.",
          "LANGUAGE SQL functions are useful when the body is primarily SQL.",
        ],
        task: "Create a function `get_user_order_total(p_user_id INTEGER)` that returns NUMERIC and returns COALESCE(SUM(total), 0) from orders for that user.",
        schema: "Table: orders\n- user_id\n- total",
        regex:
          /create\s+(or\s+replace\s+)?function\s+get_user_order_total\s*\(\s*p_user_id\s+(integer|int)\s*\)[\s\S]*returns\s+numeric[\s\S]*language\s+sql[\s\S]*select\s+coalesce\s*\(\s*sum\s*\(\s*total\s*\)\s*,\s*0\s*\)[\s\S]*where\s+user_id\s*=\s*p_user_id/i,
        successMessage: "SQL function created.",
        hint: `CREATE FUNCTION get_user_order_total(p_user_id INTEGER)
  RETURNS NUMERIC
  LANGUAGE SQL
  AS $$
    SELECT COALESCE(SUM(total), 0)
    FROM orders
    WHERE user_id = p_user_id;
  $$;`,
        resultType: "command",
        mockData: [],
      },

      {
        id: "23-2",
        title: "Call a Function",
        difficulty: "Intermediate",
        theory: [
          "Functions returning values can be called from SELECT statements.",
        ],
        task: "Call get_user_order_total for user id 1.",
        schema: "Function: get_user_order_total(integer)",
        regex: /select\s+get_user_order_total\s*\(\s*1\s*\)/i,
        successMessage: "Function executed.",
        hint: "SELECT get_user_order_total(1);",
        resultType: "data",
        mockData: [
          {
            get_user_order_total: 18450,
          },
        ],
      },

      {
        id: "23-3",
        title: "Create a PL/pgSQL Function",
        difficulty: "Advanced",
        theory: [
          "PL/pgSQL is PostgreSQL's procedural language.",
          "It supports variables, IF statements, loops, exceptions, and procedural control flow.",
        ],
        task: "Create `get_user_category(p_age INTEGER)` returning TEXT. Return `adult` when age >= 18, otherwise return `minor`.",
        schema: "No table required.",
        regex:
          /create\s+(or\s+replace\s+)?function\s+get_user_category\s*\(\s*p_age\s+(integer|int)\s*\)[\s\S]*returns\s+text[\s\S]*language\s+plpgsql[\s\S]*begin[\s\S]*if\s+p_age\s*>=\s*18\s+then[\s\S]*return\s+'adult'[\s\S]*else[\s\S]*return\s+'minor'[\s\S]*end\s+if/i,
        successMessage: "PL/pgSQL function created.",
        hint: `CREATE FUNCTION get_user_category(p_age INTEGER)
  RETURNS TEXT
  LANGUAGE plpgsql
  AS $$
  BEGIN
    IF p_age >= 18 THEN
      RETURN 'adult';
    ELSE
      RETURN 'minor';
    END IF;
  END;
  $$;`,
        resultType: "command",
        mockData: [],
      },

      {
        id: "23-4",
        title: "Declare a Variable",
        difficulty: "Advanced",
        theory: [
          "PL/pgSQL supports local variables using DECLARE.",
          "SELECT ... INTO can assign query results to variables.",
        ],
        task: "Create `count_user_orders(p_user_id INTEGER)` returning INTEGER. Declare `order_count INTEGER`, assign COUNT(*) from orders using SELECT INTO, then return order_count.",
        schema: "Table: orders",
        regex:
          /create\s+(or\s+replace\s+)?function\s+count_user_orders[\s\S]*declare[\s\S]*order_count\s+integer[\s\S]*select\s+count\s*\(\s*\*\s*\)\s+into\s+order_count[\s\S]*from\s+orders[\s\S]*where\s+user_id\s*=\s*p_user_id[\s\S]*return\s+order_count/i,
        successMessage: "PL/pgSQL variable used successfully.",
        hint: `CREATE FUNCTION count_user_orders(p_user_id INTEGER)
  RETURNS INTEGER
  LANGUAGE plpgsql
  AS $$
  DECLARE
    order_count INTEGER;
  BEGIN
    SELECT COUNT(*) INTO order_count
    FROM orders
    WHERE user_id = p_user_id;
  
    RETURN order_count;
  END;
  $$;`,
        resultType: "command",
        mockData: [],
      },

      {
        id: "23-5",
        title: "Create a Procedure",
        difficulty: "Advanced",
        theory: [
          "Procedures are invoked using CALL.",
          "Unlike ordinary functions, procedures are designed primarily to perform actions rather than being embedded inside SELECT expressions.",
        ],
        task: "Create a procedure `deactivate_user(p_user_id INTEGER)` that sets is_active to FALSE for the given user.",
        schema: "Table: users",
        regex:
          /create\s+(or\s+replace\s+)?procedure\s+deactivate_user\s*\(\s*p_user_id\s+(integer|int)\s*\)[\s\S]*language\s+plpgsql[\s\S]*update\s+users\s+set\s+is_active\s*=\s*false\s+where\s+id\s*=\s*p_user_id/i,
        successMessage: "Procedure created.",
        hint: `CREATE PROCEDURE deactivate_user(p_user_id INTEGER)
  LANGUAGE plpgsql
  AS $$
  BEGIN
    UPDATE users
    SET is_active = FALSE
    WHERE id = p_user_id;
  END;
  $$;`,
        resultType: "command",
        mockData: [],
      },

      {
        id: "23-6",
        title: "Call a Procedure",
        difficulty: "Intermediate",
        theory: ["CALL executes a stored procedure."],
        task: "Call deactivate_user for user id 2.",
        schema: "Procedure: deactivate_user(integer)",
        regex: /call\s+deactivate_user\s*\(\s*2\s*\)/i,
        successMessage: "Procedure executed.",
        hint: "CALL deactivate_user(2);",
        resultType: "command",
        mockData: [],
      },
    ],
  },

  // =========================================================
  // MODULE 24 — TRIGGERS
  // =========================================================
  {
    id: "mod-24",
    title: "24. Triggers",
    levels: [
      {
        id: "24-1",
        title: "Add an Updated Timestamp",
        difficulty: "Intermediate",
        theory: [
          "Triggers automatically execute database logic when specified events occur.",
          "A common use case is automatically maintaining updated_at timestamps.",
        ],
        task: "Add an `updated_at` TIMESTAMPTZ column to users with DEFAULT NOW().",
        schema: "Table: users",
        regex:
          /alter\s+table\s+users\s+add\s+(column\s+)?updated_at\s+(timestamptz|timestamp\s+with\s+time\s+zone)\s+default\s+now\s*\(\s*\)/i,
        successMessage: "updated_at column added.",
        hint: "ALTER TABLE users ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();",
        resultType: "command",
        mockData: [],
      },

      {
        id: "24-2",
        title: "Create a Trigger Function",
        difficulty: "Advanced",
        theory: [
          "A PostgreSQL trigger commonly calls a trigger function.",
          "NEW represents the new row for INSERT or UPDATE row-level triggers.",
          "A BEFORE UPDATE trigger can modify NEW before PostgreSQL stores the row.",
        ],
        task: "Create a trigger function `set_updated_at()` that sets NEW.updated_at = NOW() and returns NEW.",
        schema: "Table: users\n- updated_at TIMESTAMPTZ",
        regex:
          /create\s+(or\s+replace\s+)?function\s+set_updated_at\s*\(\s*\)[\s\S]*returns\s+trigger[\s\S]*language\s+plpgsql[\s\S]*new\.updated_at\s*=\s*now\s*\(\s*\)[\s\S]*return\s+new/i,
        successMessage: "Trigger function created.",
        hint: `CREATE FUNCTION set_updated_at()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$;`,
        resultType: "command",
        mockData: [],
      },

      {
        id: "24-3",
        title: "Create a BEFORE UPDATE Trigger",
        difficulty: "Advanced",
        theory: [
          "BEFORE triggers run before PostgreSQL applies the row change.",
          "FOR EACH ROW executes the trigger once for every affected row.",
        ],
        task: "Create `users_set_updated_at` before UPDATE on users, for each row, executing set_updated_at().",
        schema: "Function: set_updated_at()",
        regex:
          /create\s+trigger\s+users_set_updated_at\s+before\s+update\s+on\s+users\s+for\s+each\s+row\s+execute\s+function\s+set_updated_at\s*\(\s*\)/i,
        successMessage: "Update trigger created.",
        hint: "CREATE TRIGGER users_set_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION set_updated_at();",
        resultType: "command",
        mockData: [],
      },

      {
        id: "24-4",
        title: "Understand OLD and NEW",
        difficulty: "Advanced",
        theory: [
          "OLD represents the existing row before a change.",
          "NEW represents the row after the proposed change.",
          "These variables make audit logs and validation triggers possible.",
        ],
        task: "Create an `user_audit` table containing id BIGSERIAL PRIMARY KEY, user_id INTEGER, old_email VARCHAR(150), new_email VARCHAR(150), and changed_at TIMESTAMPTZ DEFAULT NOW().",
        schema: "Create audit storage for user changes.",
        regex:
          /create\s+table\s+user_audit\s*\([\s\S]*id\s+bigserial\s+primary\s+key[\s\S]*user_id\s+(integer|int)[\s\S]*old_email\s+varchar\s*\(\s*150\s*\)[\s\S]*new_email\s+varchar\s*\(\s*150\s*\)[\s\S]*changed_at\s+(timestamptz|timestamp\s+with\s+time\s+zone)\s+default\s+now\s*\(\s*\)[\s\S]*\)/i,
        successMessage: "Audit table created.",
        hint: "CREATE TABLE user_audit (id BIGSERIAL PRIMARY KEY, user_id INTEGER, old_email VARCHAR(150), new_email VARCHAR(150), changed_at TIMESTAMPTZ DEFAULT NOW());",
        resultType: "command",
        mockData: [],
      },

      {
        id: "24-5",
        title: "Create an Audit Trigger Function",
        difficulty: "Advanced",
        theory: [
          "Audit triggers can record old and new values automatically.",
          "AFTER triggers are useful when the original modification should complete before the secondary action runs.",
        ],
        task: "Create `audit_user_email()` that inserts OLD.id, OLD.email, and NEW.email into user_audit and returns NEW.",
        schema: "Tables: users, user_audit",
        regex:
          /create\s+(or\s+replace\s+)?function\s+audit_user_email\s*\(\s*\)[\s\S]*returns\s+trigger[\s\S]*insert\s+into\s+user_audit\s*\(\s*user_id\s*,\s*old_email\s*,\s*new_email\s*\)[\s\S]*values\s*\(\s*old\.id\s*,\s*old\.email\s*,\s*new\.email\s*\)[\s\S]*return\s+new/i,
        successMessage: "Audit trigger function created.",
        hint: `CREATE FUNCTION audit_user_email()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  AS $$
  BEGIN
    INSERT INTO user_audit (user_id, old_email, new_email)
    VALUES (OLD.id, OLD.email, NEW.email);
  
    RETURN NEW;
  END;
  $$;`,
        resultType: "command",
        mockData: [],
      },

      {
        id: "24-6",
        title: "Trigger Only When a Column Changes",
        difficulty: "Advanced",
        theory: [
          "Triggers can be limited to updates of specific columns.",
          "This avoids unnecessary trigger execution for unrelated changes.",
        ],
        task: "Create `users_email_audit` after UPDATE OF email on users, for each row, executing audit_user_email().",
        schema: "Function: audit_user_email()",
        regex:
          /create\s+trigger\s+users_email_audit\s+after\s+update\s+of\s+email\s+on\s+users\s+for\s+each\s+row\s+execute\s+function\s+audit_user_email\s*\(\s*\)/i,
        successMessage: "Email audit trigger created.",
        hint: "CREATE TRIGGER users_email_audit AFTER UPDATE OF email ON users FOR EACH ROW EXECUTE FUNCTION audit_user_email();",
        resultType: "command",
        mockData: [],
      },

      {
        id: "24-7",
        title: "Remove a Trigger",
        difficulty: "Intermediate",
        theory: [
          "DROP TRIGGER removes a trigger from a table.",
          "Dropping the trigger does not automatically remove its trigger function.",
        ],
        task: "Drop `users_email_audit` from the users table.",
        schema: "Trigger: users_email_audit",
        regex: /drop\s+trigger\s+users_email_audit\s+on\s+users/i,
        successMessage: "Trigger removed.",
        hint: "DROP TRIGGER users_email_audit ON users;",
        resultType: "command",
        mockData: [],
      },
    ],
  },

  // =========================================================
  // MODULE 25 — ROLES, USERS & PERMISSIONS
  // =========================================================
  {
    id: "mod-25",
    title: "25. Roles, Users & Permissions",
    levels: [
      {
        id: "25-1",
        title: "Create a Login Role",
        difficulty: "Intermediate",
        theory: [
          "PostgreSQL uses roles for authentication and authorization.",
          "A role with LOGIN can connect to PostgreSQL.",
          "CREATE USER is essentially shorthand for creating a role with LOGIN.",
        ],
        task: "Create a login role named `app_user` with password `learning123`.",
        schema: "No application tables required.",
        regex:
          /create\s+role\s+app_user\s+(with\s+)?login\s+password\s+'learning123'/i,
        successMessage: "Application role created.",
        hint: "CREATE ROLE app_user LOGIN PASSWORD 'learning123';",
        resultType: "command",
        mockData: [],
      },

      {
        id: "25-2",
        title: "Grant Database Connection",
        difficulty: "Intermediate",
        theory: [
          "CONNECT controls whether a role can connect to a database.",
          "Permissions should follow the principle of least privilege.",
        ],
        task: "Grant CONNECT on database postgres_learning to app_user.",
        schema: "Database: postgres_learning",
        regex:
          /grant\s+connect\s+on\s+database\s+postgres_learning\s+to\s+app_user/i,
        successMessage: "Database connection permission granted.",
        hint: "GRANT CONNECT ON DATABASE postgres_learning TO app_user;",
        resultType: "command",
        mockData: [],
      },

      {
        id: "25-3",
        title: "Grant Schema Usage",
        difficulty: "Intermediate",
        theory: [
          "Database access and schema access are separate concepts.",
          "USAGE on a schema allows a role to reference objects inside that schema, assuming it also has permissions on those objects.",
        ],
        task: "Grant USAGE on schema public to app_user.",
        schema: "Schema: public",
        regex: /grant\s+usage\s+on\s+schema\s+public\s+to\s+app_user/i,
        successMessage: "Schema usage granted.",
        hint: "GRANT USAGE ON SCHEMA public TO app_user;",
        resultType: "command",
        mockData: [],
      },

      {
        id: "25-4",
        title: "Grant Read Permission",
        difficulty: "Intermediate",
        theory: [
          "SELECT permission controls whether a role can read table data.",
          "Privileges can be granted individually instead of giving broad access.",
        ],
        task: "Grant SELECT on users to app_user.",
        schema: "Table: users",
        regex: /grant\s+select\s+on\s+(table\s+)?users\s+to\s+app_user/i,
        successMessage: "Read permission granted.",
        hint: "GRANT SELECT ON users TO app_user;",
        resultType: "command",
        mockData: [],
      },

      {
        id: "25-5",
        title: "Grant CRUD Permissions",
        difficulty: "Intermediate",
        theory: [
          "Applications commonly need SELECT, INSERT, UPDATE, and DELETE.",
          "Grant only the operations the application actually needs.",
        ],
        task: "Grant SELECT, INSERT, UPDATE, and DELETE on orders to app_user.",
        schema: "Table: orders",
        regex:
          /grant\s+select\s*,\s*insert\s*,\s*update\s*,\s*delete\s+on\s+(table\s+)?orders\s+to\s+app_user/i,
        successMessage: "CRUD permissions granted.",
        hint: "GRANT SELECT, INSERT, UPDATE, DELETE ON orders TO app_user;",
        resultType: "command",
        mockData: [],
      },

      {
        id: "25-6",
        title: "Grant Sequence Permission",
        difficulty: "Intermediate",
        theory: [
          "SERIAL and BIGSERIAL commonly use sequences behind the scenes.",
          "A role inserting rows may also need sequence privileges.",
        ],
        task: "Grant USAGE and SELECT on sequence jobs_id_seq to app_user.",
        schema: "Sequence: jobs_id_seq",
        regex:
          /grant\s+usage\s*,\s*select\s+on\s+sequence\s+jobs_id_seq\s+to\s+app_user/i,
        successMessage: "Sequence permissions granted.",
        hint: "GRANT USAGE, SELECT ON SEQUENCE jobs_id_seq TO app_user;",
        resultType: "command",
        mockData: [],
      },

      {
        id: "25-7",
        title: "Create a Read-Only Role",
        difficulty: "Intermediate",
        theory: [
          "Privileges can be grouped into roles.",
          "Users can then inherit permissions by being members of those roles.",
          "This is usually easier to manage than granting every privilege directly to every login.",
        ],
        task: "Create a role named `readonly_role` without LOGIN.",
        schema: "No table changes.",
        regex: /create\s+role\s+readonly_role(\s+no\s*login)?/i,
        successMessage: "Read-only group role created.",
        hint: "CREATE ROLE readonly_role NOLOGIN;",
        resultType: "command",
        mockData: [],
      },

      {
        id: "25-8",
        title: "Grant Table Access to a Role",
        difficulty: "Intermediate",
        theory: [
          "Privileges can be granted to a group role and inherited by its members.",
        ],
        task: "Grant SELECT on all tables in schema public to readonly_role.",
        schema: "Schema: public",
        regex:
          /grant\s+select\s+on\s+all\s+tables\s+in\s+schema\s+public\s+to\s+readonly_role/i,
        successMessage: "Read-only table access granted.",
        hint: "GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly_role;",
        resultType: "command",
        mockData: [],
      },

      {
        id: "25-9",
        title: "Assign a Role",
        difficulty: "Intermediate",
        theory: [
          "GRANT can also make one role a member of another role.",
          "The member can inherit privileges from the granted role when role inheritance applies.",
        ],
        task: "Grant readonly_role to app_user.",
        schema: "Roles: readonly_role, app_user",
        regex: /grant\s+readonly_role\s+to\s+app_user/i,
        successMessage: "Role membership granted.",
        hint: "GRANT readonly_role TO app_user;",
        resultType: "command",
        mockData: [],
      },

      {
        id: "25-10",
        title: "Revoke a Permission",
        difficulty: "Intermediate",
        theory: [
          "REVOKE removes previously granted privileges.",
          "Permission management is an ongoing operational task, not just initial setup.",
        ],
        task: "Revoke DELETE permission on orders from app_user.",
        schema: "Table: orders\nRole: app_user",
        regex: /revoke\s+delete\s+on\s+(table\s+)?orders\s+from\s+app_user/i,
        successMessage: "DELETE permission revoked.",
        hint: "REVOKE DELETE ON orders FROM app_user;",
        resultType: "command",
        mockData: [],
      },

      {
        id: "25-11",
        title: "Configure Default Privileges",
        difficulty: "Advanced",
        theory: [
          "Privileges granted on existing tables do not automatically apply to future tables.",
          "ALTER DEFAULT PRIVILEGES defines permissions for objects created in the future.",
          "This is especially important in applications that continuously add tables through migrations.",
        ],
        task: "Configure future tables in the public schema to grant SELECT to readonly_role.",
        schema: "Schema: public",
        regex:
          /alter\s+default\s+privileges\s+in\s+schema\s+public\s+grant\s+select\s+on\s+tables\s+to\s+readonly_role/i,
        successMessage: "Default table privileges configured.",
        hint: "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO readonly_role;",
        resultType: "command",
        mockData: [],
      },
    ],
  },
];
