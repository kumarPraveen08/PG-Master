type SqlValue = string | number | boolean | null;
type SqlRow = Record<string, SqlValue>;

export type ExerciseContext = {
  schema: string;
  mockData: SqlRow[];
};

type User = {
  id: number;
  full_name: string;
  email: string;
  age: number;
  department_id: number | null;
  is_active: boolean;
  created_at: string;
};

type Order = {
  id: number;
  user_id: number;
  status: string;
  total: number;
  created_at: string;
};

const USER_COLUMNS = [
  "id              INTEGER PRIMARY KEY",
  "full_name       VARCHAR(100) NOT NULL",
  "email           VARCHAR(150) UNIQUE",
  "age             INTEGER CHECK (age >= 18)",
  "department_id   INTEGER REFERENCES departments(id)",
  "is_active       BOOLEAN DEFAULT TRUE",
  "created_at      TIMESTAMPTZ DEFAULT NOW()",
];

const USERS: User[] = [
  { id: 1, full_name: "Alice Anderson", email: "alice@example.com", age: 28, department_id: 1, is_active: true, created_at: "2026-01-12 09:00+00" },
  { id: 2, full_name: "Bob Martinez", email: "bob@example.com", age: 34, department_id: 2, is_active: true, created_at: "2026-01-14 09:00+00" },
  { id: 3, full_name: "Carol Chen", email: "carol@example.com", age: 22, department_id: 1, is_active: false, created_at: "2026-02-01 09:00+00" },
  { id: 4, full_name: "David Kim", email: "david@example.com", age: 26, department_id: null, is_active: true, created_at: "2026-02-03 09:00+00" },
  { id: 5, full_name: "Eve Ali", email: "eve.ali@example.com", age: 31, department_id: 3, is_active: true, created_at: "2026-02-10 09:00+00" },
  { id: 6, full_name: "Frank Ali", email: "frank.ali@example.com", age: 41, department_id: 1, is_active: true, created_at: "2026-02-11 09:00+00" },
  { id: 7, full_name: "Grace Hopper", email: "grace@company.org", age: 29, department_id: 2, is_active: true, created_at: "2026-03-01 09:00+00" },
  { id: 8, full_name: "Henry Ford", email: "henry@example.com", age: 45, department_id: null, is_active: false, created_at: "2026-03-02 09:00+00" },
  { id: 9, full_name: "Iris West", email: "iris@example.com", age: 23, department_id: 3, is_active: true, created_at: "2026-03-04 09:00+00" },
  { id: 10, full_name: "Jack Ryan", email: "jack@example.com", age: 37, department_id: 1, is_active: true, created_at: "2026-03-08 09:00+00" },
  { id: 11, full_name: "Kate Bishop", email: "kate@example.com", age: 27, department_id: 2, is_active: true, created_at: "2026-03-12 09:00+00" },
  { id: 12, full_name: "Leo Messi", email: "leo@example.com", age: 33, department_id: 1, is_active: true, created_at: "2026-04-01 09:00+00" },
  { id: 13, full_name: "Mia Wong", email: "mia@example.com", age: 19, department_id: 3, is_active: false, created_at: "2026-04-02 09:00+00" },
  { id: 14, full_name: "Nina Patel", email: "nina@company.org", age: 52, department_id: 2, is_active: true, created_at: "2026-04-06 09:00+00" },
  { id: 15, full_name: "Omar Hassan", email: "omar@example.com", age: 24, department_id: null, is_active: true, created_at: "2026-04-09 09:00+00" },
];

const STARTER_USERS = USERS.filter((user) => user.id <= 3);

const DEPARTMENTS = [
  { id: 1, name: "Engineering" },
  { id: 2, name: "Sales" },
  { id: 3, name: "Marketing" },
];

const ORDERS: Order[] = [
  { id: 101, user_id: 1, status: "completed", total: 120, created_at: "2026-09-01 10:00+00" },
  { id: 102, user_id: 1, status: "completed", total: 80.5, created_at: "2026-09-20 10:00+00" },
  { id: 103, user_id: 1, status: "pending", total: 5400, created_at: "2026-09-28 10:00+00" },
  { id: 104, user_id: 2, status: "completed", total: 45, created_at: "2026-08-15 10:00+00" },
  { id: 105, user_id: 2, status: "cancelled", total: 15, created_at: "2026-09-12 10:00+00" },
  { id: 106, user_id: 5, status: "pending", total: 6100, created_at: "2026-09-25 10:00+00" },
  { id: 107, user_id: 6, status: "completed", total: 200, created_at: "2026-09-05 10:00+00" },
  { id: 108, user_id: 1, status: "completed", total: 30, created_at: "2026-06-01 10:00+00" },
];

const CATEGORIES = [
  { id: 1, name: "Electronics", parent_id: null },
  { id: 2, name: "Computers", parent_id: 1 },
  { id: 3, name: "Laptops", parent_id: 2 },
  { id: 4, name: "Phones", parent_id: 1 },
  { id: 5, name: "Accessories", parent_id: null },
];

const JOBS = [
  { id: 1, status: "pending", payload: '{"task":"send-email"}', created_at: "2026-10-01 08:00+00" },
  { id: 2, status: "pending", payload: '{"task":"resize-image"}', created_at: "2026-10-01 08:05+00" },
  { id: 3, status: "done", payload: '{"task":"archive"}', created_at: "2026-09-30 08:00+00" },
];

const PREFERENCES: Record<number, string | null> = {
  1: '{"theme":"dark","language":"en"}',
  2: '{"theme":"light","language":"en"}',
  5: '{"theme":"dark","language":"fr"}',
};

const INTERESTS: Record<number, string | null> = {
  1: "{music,travel,technology}",
  2: "{travel}",
  5: "{technology,cooking}",
};

const DEPT_NAME = new Map(DEPARTMENTS.map((department) => [department.id, department.name]));

function cell(value: SqlValue) {
  return value === null ? "NULL" : String(value);
}

function formatRows(rows: SqlRow[]) {
  if (rows.length === 0) return "(no rows yet)";
  const keys = Object.keys(rows[0]);
  return [keys.join(" | "), ...rows.map((row) => keys.map((key) => cell(row[key])).join(" | "))].join("\n");
}

function project<T extends SqlRow>(rows: T[], keys?: (keyof T)[]): SqlRow[] {
  if (!keys) return rows.map((row) => ({ ...row }));
  return rows.map((row) => {
    const next: SqlRow = {};
    for (const key of keys) next[String(key)] = row[key];
    return next;
  });
}

function table(name: string, columns: string[], rows: SqlRow[], note?: string) {
  return [
    name,
    ...columns.map((column) => `  ${column}`),
    "",
    "Sample rows",
    formatRows(rows),
    note ? `\n${note}` : "",
  ].join("\n");
}

function columns(defs: [string, string, string][]): SqlRow[] {
  return defs.map(([column_name, data_type, details]) => ({
    column_name,
    data_type,
    details,
  }));
}

function usersSchema(rows: User[] = USERS, note?: string) {
  return table("users", USER_COLUMNS, project(rows), note);
}

function departmentsSchema(rows = DEPARTMENTS, note?: string) {
  return table(
    "departments",
    ["id    INTEGER PRIMARY KEY", "name  VARCHAR(100) UNIQUE NOT NULL"],
    rows,
    note,
  );
}

function ordersSchema(note?: string) {
  return table(
    "orders",
    [
      "id          INTEGER PRIMARY KEY",
      "user_id     INTEGER REFERENCES users(id)",
      "status      VARCHAR(30)",
      "total       NUMERIC(10,2)",
      "created_at  TIMESTAMPTZ DEFAULT NOW()",
    ],
    project(ORDERS),
    note,
  );
}

function usersAndDepartments(note?: string) {
  return `${usersSchema(USERS, note)}\n\n${departmentsSchema()}`;
}

function practiceWorld(note?: string) {
  return `${usersAndDepartments(note)}\n\n${ordersSchema()}`;
}

const byAge = [...USERS].sort((a, b) => a.age - b.age || a.id - b.id);
const over30 = USERS.filter((user) => user.age > 30);
const adultsActive = USERS.filter((user) => user.age >= 25 && user.is_active);
const deptOneOrTwo = USERS.filter((user) => user.department_id === 1 || user.department_id === 2);
const withDept = USERS.filter((user) => user.department_id !== null);
const ageBand = USERS.filter((user) => user.age >= 25 && user.age <= 35);
const startsWithA = USERS.filter((user) => user.full_name.startsWith("A"));
const containsAli = USERS.filter((user) => user.full_name.toLowerCase().includes("ali"));
const missingDept = USERS.filter((user) => user.department_id === null);
const recentOrders = ORDERS.filter((order) => order.created_at >= "2026-09-03");
const highValue = ORDERS.filter((order) => order.total > 5000);
const buyers = new Set(ORDERS.map((order) => order.user_id));
const withOrders = USERS.filter((user) => buyers.has(user.id));
const withoutOrders = USERS.filter((user) => !buyers.has(user.id));

const innerJoin = USERS.filter((user) => user.department_id !== null).map((user) => ({
  full_name: user.full_name,
  name: DEPT_NAME.get(user.department_id as number) ?? null,
}));

const leftJoin = USERS.map((user) => ({
  full_name: user.full_name,
  name: user.department_id === null ? null : DEPT_NAME.get(user.department_id) ?? null,
}));

const threeJoin = ORDERS.map((order) => {
  const user = USERS.find((item) => item.id === order.user_id);
  return {
    full_name: user?.full_name ?? null,
    name: user?.department_id ? DEPT_NAME.get(user.department_id) ?? null : null,
    total: order.total,
  };
});

const userSpend = [1, 2, 5, 6].map((userId) => ({
  full_name: USERS.find((user) => user.id === userId)?.full_name ?? "",
  sum: ORDERS.filter((order) => order.user_id === userId).reduce((sum, order) => sum + order.total, 0),
}));

const orderCount = (userId: number) => ORDERS.filter((order) => order.user_id === userId).length;

const completedSpend = [1, 2, 6].map((userId) => ({
  user_id: userId,
  total: ORDERS.filter((order) => order.user_id === userId && order.status === "completed").reduce(
    (sum, order) => sum + order.total,
    0,
  ),
}));

function plan(lines: string[]): SqlRow[] {
  return lines.map((line) => ({ "QUERY PLAN": line }));
}

function tagged(command: string, detail: string): SqlRow[] {
  return [{ command, detail }];
}

const earlyUsers = `users
  id      INTEGER
  name    VARCHAR(100)
  email   VARCHAR(150)
  age     INTEGER

Sample rows
(no rows yet)`;

const usersBeforeRename = `users
  id            INTEGER
  name          VARCHAR(100)
  email         VARCHAR(150)
  age           INTEGER
  is_active     BOOLEAN
  created_at    TIMESTAMPTZ DEFAULT NOW()

The name column still exists. This exercise renames it to full_name.`;

const usersAfterRename = `users
  id              INTEGER
  full_name       VARCHAR(100)
  email           VARCHAR(150)
  age             INTEGER
  is_active       BOOLEAN DEFAULT TRUE
  created_at      TIMESTAMPTZ DEFAULT NOW()
  department_id   INTEGER

No rows have been inserted yet.`;

const c = (schema: string, mockData: SqlRow[]): ExerciseContext => ({ schema, mockData });

export const EXERCISE_CONTEXT: Record<string, ExerciseContext> = {
  "1-1": c("No tables. version() reads the server, not a table.", [{ version: "PostgreSQL 16.4 on x86_64-pc-linux-gnu" }]),
  "1-2": c("No tables. current_database() is the database this session is connected to.", [{ current_database: "postgres_learning" }]),
  "1-3": c("No tables. CURRENT_USER is the role running this session.", [{ current_user: "postgres" }]),
  "1-4": c("No tables. The default schema for new tables in this app is public.", [{ current_schema: "public" }]),

  "2-1": c(
    "The database is empty.\n\nCreate this table:\n  id     INTEGER\n  name   VARCHAR(100)\n  email  VARCHAR(150)\n  age    INTEGER",
    columns([
      ["id", "integer", ""],
      ["name", "varchar(100)", ""],
      ["email", "varchar(150)", ""],
      ["age", "integer", ""],
    ]),
  ),
  "2-2": c(earlyUsers, columns([
    ["id", "integer", ""],
    ["name", "varchar(100)", ""],
    ["email", "varchar(150)", ""],
    ["age", "integer", ""],
    ["is_active", "boolean", "added by this statement"],
  ])),
  "2-3": c(
    `${earlyUsers}\n  is_active  BOOLEAN`,
    columns([
      ["id", "integer", ""],
      ["name", "varchar(100)", ""],
      ["email", "varchar(150)", ""],
      ["age", "integer", ""],
      ["is_active", "boolean", ""],
      ["created_at", "timestamptz", "DEFAULT NOW()"],
    ]),
  ),
  "2-4": c(
    "users\n  id          INTEGER\n  name        VARCHAR(100)\n  email       VARCHAR(150)\n  age         INTEGER\n  is_active   BOOLEAN          -- no default yet\n  created_at  TIMESTAMPTZ DEFAULT NOW()",
    [{ column_name: "is_active", data_type: "boolean", details: "DEFAULT TRUE" }],
  ),
  "2-5": c(usersBeforeRename, columns([
    ["id", "integer", ""],
    ["full_name", "varchar(100)", "renamed from name"],
    ["email", "varchar(150)", ""],
    ["age", "integer", ""],
    ["is_active", "boolean", "DEFAULT TRUE"],
    ["created_at", "timestamptz", "DEFAULT NOW()"],
  ])),

  "3-1": c(`${usersAfterRename}\n\nid is not a primary key yet.`, [{ column_name: "id", data_type: "integer", details: "PRIMARY KEY" }]),
  "3-2": c(usersSchema(STARTER_USERS, "full_name can still be NULL. This exercise forbids that. Sample rows are already valid."), [{ column_name: "full_name", data_type: "varchar(100)", details: "SET NOT NULL" }]),
  "3-3": c(usersSchema(STARTER_USERS, "email is not unique yet. Alice, Bob, and Carol already have different addresses."), [{ column_name: "email", data_type: "varchar(150)", details: "UNIQUE" }]),
  "3-4": c(usersSchema(STARTER_USERS, "age has no check yet. Every sample age is already 18 or older."), [{ column_name: "age", data_type: "integer", details: "CHECK (age >= 18)" }]),
  "3-5": c(usersSchema(STARTER_USERS, "departments does not exist yet."), columns([
    ["id", "integer", "PRIMARY KEY"],
    ["name", "varchar(100)", "UNIQUE NOT NULL"],
  ])),
  "3-6": c(
    `${usersSchema(STARTER_USERS, "users has no department_id yet.")}\n\n${departmentsSchema([{ id: 1, name: "Engineering" }])}`,
    columns([
      ["department_id", "integer", "REFERENCES departments(id)"],
    ]),
  ),

  "4-1": c(departmentsSchema([], "departments is empty. Insert the Engineering row."), [{ id: 1, name: "Engineering" }]),
  "4-2": c(
    `${usersSchema([], "users is empty. Insert Alice and link her to department 1.")}\n\n${departmentsSchema([{ id: 1, name: "Engineering" }])}`,
    [{ id: 1, full_name: "Alice Anderson", email: "alice@example.com", age: 28, department_id: 1, is_active: true }],
  ),
  "4-3": c(departmentsSchema([{ id: 1, name: "Engineering" }], "Add Sales and Marketing in the same INSERT."), [
    { id: 2, name: "Sales" },
    { id: 3, name: "Marketing" },
  ]),
  "4-4": c(usersSchema(STARTER_USERS, "SELECT * returns every column of these rows."), project(STARTER_USERS)),
  "4-5": c(usersSchema(STARTER_USERS, "The query asks only for full_name and email."), project(STARTER_USERS, ["full_name", "email"])),
  "4-6": c(usersSchema(STARTER_USERS, "David is not in the table yet. id 4 is free. RETURNING * includes defaulted columns."), [
    { id: 4, full_name: "David Kim", email: "david@example.com", age: 26, department_id: null, is_active: true, created_at: "2026-10-03 09:30+00" },
  ]),

  "5-1": c(usersSchema(USERS, "Ages above 30 are Bob, Eve, Frank, Jack, Leo, and Nina."), project(over30)),
  "5-2": c(usersSchema(USERS, "Keep rows where age >= 25 and is_active is true. Carol, Henry, and Mia are inactive."), project(adultsActive)),
  "5-3": c(usersSchema(USERS, "department_id 1 is Engineering and 2 is Sales. NULL and 3 are excluded."), project(deptOneOrTwo)),
  "5-4": c(`${usersAndDepartments("IN (1, 2, 3) matches every user who has a department.")}`, project(withDept)),
  "5-5": c(usersSchema(USERS, "BETWEEN 25 AND 35 includes both ends."), project(ageBand)),
  "5-6": c(usersSchema(USERS, "LIKE 'A%' is case-sensitive. Only Alice Anderson matches."), project(startsWithA)),
  "5-7": c(usersSchema(USERS, "ILIKE '%ali%' matches Alice Anderson, Eve Ali, and Frank Ali."), project(containsAli)),
  "5-8": c(usersSchema(USERS, "David, Henry, and Omar have no department. Their department_id is NULL."), project(missingDept)),
  "5-9": c(usersSchema(USERS, "IS NOT NULL drops the three users whose department_id is NULL."), project(withDept)),

  "6-1": c(usersSchema(USERS, "ORDER BY age ASC. Mia is 19 and Nina is 52."), project(byAge)),
  "6-2": c(usersSchema(USERS), project([...byAge].reverse())),
  "6-3": c(usersSchema(USERS, "Without ORDER BY, LIMIT 5 returns the first five rows by id."), project(USERS.slice(0, 5))),
  "6-4": c(usersSchema(USERS, "Skip ids 1 through 10, then take the next five."), project(USERS.slice(10, 15))),
  "6-5": c(usersSchema(USERS, "department_id values in the table are 1, 2, 3, and NULL."), [
    { department_id: 1 },
    { department_id: 2 },
    { department_id: 3 },
    { department_id: null },
  ]),

  "7-1": c(usersSchema(USERS, "Alice is id 1 and her age is currently 28."), [{ id: 1, full_name: "Alice Anderson", age: 29 }]),
  "7-2": c(usersSchema(USERS, "Update two columns on Alice only."), [{ id: 1, full_name: "Alice Anderson", age: 30, is_active: true }]),
  "7-3": c(usersSchema(USERS, "Bob is id 2 and is currently active."), [{ ...USERS[1], is_active: false }]),
  "7-4": c(usersSchema(USERS, "David is id 4 and has no department."), [USERS[3]]),
  "7-5": c(departmentsSchema(DEPARTMENTS, "id 1 already exists, so ON CONFLICT updates the name."), [{ id: 1, name: "Software Engineering" }]),
  "7-6": c(departmentsSchema(DEPARTMENTS, "id 1 already exists. DO NOTHING leaves Engineering in place."), [{ id: 1, name: "Engineering", result: "INSERT 0 0" }]),

  "8-1": c(usersAndDepartments("INNER JOIN keeps only users whose department_id matches departments.id."), innerJoin),
  "8-2": c(usersAndDepartments("Same join as the previous exercise. Aliases u and d do not change the result columns."), innerJoin),
  "8-3": c(usersAndDepartments("LEFT JOIN keeps David, Henry, and Omar. Their department name is NULL."), leftJoin),
  "8-4": c(usersSchema(USERS, "orders does not exist yet. It will point at users.id."), columns([
    ["id", "integer", "PRIMARY KEY"],
    ["user_id", "integer", "REFERENCES users(id)"],
    ["status", "varchar(30)", ""],
    ["total", "numeric(10,2)", ""],
    ["created_at", "timestamptz", "DEFAULT NOW()"],
  ])),
  "8-5": c(practiceWorld("One result row per order. Alice has four orders, so she appears four times."), threeJoin),

  "9-1": c(usersSchema(), [{ count: USERS.length }]),
  "9-2": c(ordersSchema("SUM adds every total, including cancelled orders."), [{ sum: 11990.5 }]),
  "9-3": c(ordersSchema("Eight orders. 11990.50 / 8 = 1498.8125."), [{ avg: 1498.8125 }]),
  "9-4": c(ordersSchema("The smallest total is the cancelled 15. The largest is Eve's pending 6100."), [{ min: 15, max: 6100 }]),
  "9-5": c(ordersSchema("completed appears 5 times, pending 2 times, cancelled 1 time."), [
    { status: "cancelled", count: 1 },
    { status: "completed", count: 5 },
    { status: "pending", count: 2 },
  ]),
  "9-6": c(ordersSchema("Alice (user 1) has 4 orders. Bob has 2. Eve and Frank have 1."), [{ user_id: 1, count: 4 }]),
  "9-7": c(practiceWorld("SUM is per user, and only users who have orders appear."), userSpend),

  "10-1": c(usersSchema(USERS, "COALESCE turns NULL department_id into 0. David, Henry, and Omar are the NULL cases."), USERS.map((user) => ({ full_name: user.full_name, coalesce: user.department_id ?? 0 }))),
  "10-2": c(usersSchema(USERS, "Every sample age is 18 or older, so every row is Adult."), USERS.map((user) => ({ full_name: user.full_name, case: user.age >= 18 ? "Adult" : "Minor" }))),
  "10-3": c(usersSchema(), [{ total_users: USERS.length }]),

  "11-1": c(ordersSchema("Average total is 1498.8125. Only 5400 and 6100 are above it."), project(highValue)),
  "11-2": c(practiceWorld("Orders belong to users 1, 2, 5, and 6."), project(withOrders)),
  "11-3": c(practiceWorld("EXISTS keeps the same four users who have at least one order."), project(withOrders)),
  "11-4": c(practiceWorld("NOT EXISTS returns the eleven users who never ordered."), project(withoutOrders)),
  "11-5": c(practiceWorld("The correlated count is 0 for users who never ordered."), USERS.map((user) => ({ full_name: user.full_name, order_count: orderCount(user.id) }))),

  "12-1": c(ordersSchema("high_value_orders keeps totals above 5000."), project(highValue)),
  "12-2": c(ordersSchema(), [
    { user_id: 1, total_spent: 5630.5 },
    { user_id: 2, total_spent: 60 },
    { user_id: 5, total_spent: 6100 },
    { user_id: 6, total_spent: 200 },
  ]),
  "12-3": c(ordersSchema("completed_orders drops the pending and cancelled rows before the sum."), completedSpend),
  "12-4": c("No categories table yet.\n\nCreate:\n  id         INTEGER PRIMARY KEY\n  name       VARCHAR(100)\n  parent_id  INTEGER REFERENCES categories(id)", columns([
    ["id", "integer", "PRIMARY KEY"],
    ["name", "varchar(100)", ""],
    ["parent_id", "integer", "REFERENCES categories(id)"],
  ])),
  "12-5": c(table("categories", ["id INTEGER PRIMARY KEY", "name VARCHAR(100)", "parent_id INTEGER REFERENCES categories(id)"], CATEGORIES, "Roots are Electronics and Accessories. Computers and Phones sit under Electronics. Laptops sits under Computers."), [
    { id: 1, name: "Electronics", parent_id: null },
    { id: 2, name: "Computers", parent_id: 1 },
    { id: 3, name: "Laptops", parent_id: 2 },
    { id: 4, name: "Phones", parent_id: 1 },
    { id: 5, name: "Accessories", parent_id: null },
  ]),

  "13-1": c("No table. NOW() is the current transaction timestamp.", [{ now: "2026-10-03 09:30:00+00" }]),
  "13-2": c("No table. CURRENT_DATE has no time component.", [{ current_date: "2026-10-03" }]),
  "13-3": c("No table. Subtracting 7 days from 2026-10-03 lands on 2026-09-26.", [{ "?column?": "2026-09-26 09:30:00+00" }]),
  "13-4": c(ordersSchema("Today in this exercise is 2026-10-03. The last 30 days start at 2026-09-03. Orders on Sep 1, Aug 15, and Jun 1 are older."), project(recentOrders)),
  "13-5": c(ordersSchema("June has 1 order, August has 1, September has 6."), [
    { month: "2026-06-01 00:00+00", count: 1 },
    { month: "2026-08-01 00:00+00", count: 1 },
    { month: "2026-09-01 00:00+00", count: 6 },
  ]),
  "13-6": c(ordersSchema("Every sample order was created in 2026, so EXTRACT returns 2026 eight times."), ORDERS.map(() => ({ extract: 2026 }))),

  "14-1": c(usersSchema(USERS, "The stored emails are already lowercase. LOWER still returns one row per user."), USERS.map((user) => ({ lower: user.email.toLowerCase() }))),
  "14-2": c(usersSchema(), USERS.map((user) => ({ concat: `${user.full_name} - ${user.email}` }))),
  "14-3": c(usersSchema(USERS, "Grace and Nina use company.org. Everyone else uses example.com."), USERS.map((user) => ({ split_part: user.email.split("@")[1] }))),
  "14-4": c(ordersSchema("80.50 stays 80.5. Whole numbers gain a trailing zero when rounded to 1 decimal."), ORDERS.map((order) => ({ round: Math.round(order.total * 10) / 10 }))),
  "14-5": c("No table. ABS removes the sign from -250.", [{ abs: 250 }]),

  "15-1": c(usersSchema(USERS, "Inside the transaction Alice's age becomes 31. COMMIT keeps that change."), [{ id: 1, full_name: "Alice Anderson", age: 31, transaction: "COMMIT" }]),
  "15-2": c(usersSchema(USERS, "DELETE would remove Bob, but ROLLBACK puts the row back."), [{ id: 2, full_name: "Bob Martinez", transaction: "ROLLBACK", still_present: true }]),
  "15-3": c(usersSchema(USERS, "A savepoint is a named bookmark. No row changes in this statement."), tagged("SAVEPOINT", "before_update")),
  "15-4": c(usersSchema(USERS, "The update to age 40 is undone. Alice stays 28 after the rollback to the savepoint."), [{ id: 1, full_name: "Alice Anderson", age: 28, transaction: "ROLLBACK TO before_update" }]),
  "15-5": c("No row changes. The transaction runs at SERIALIZABLE isolation.", tagged("BEGIN", "ISOLATION LEVEL SERIALIZABLE")),

  "16-1": c(usersSchema(USERS, "FOR UPDATE locks Alice's row until the transaction ends. The SELECT still returns that row."), project(USERS.filter((user) => user.id === 1))),
  "16-2": c(usersSchema(USERS, "NOWAIT returns Alice immediately when the row is free. It errors instead of waiting if another transaction holds the lock."), project(USERS.filter((user) => user.id === 1))),
  "16-3": c("jobs does not exist yet.", columns([
    ["id", "bigint", "BIGSERIAL PRIMARY KEY"],
    ["status", "varchar(20)", "DEFAULT 'pending'"],
    ["payload", "jsonb", ""],
    ["created_at", "timestamptz", "DEFAULT NOW()"],
  ])),
  "16-4": c(table("jobs", ["id BIGSERIAL PRIMARY KEY", "status VARCHAR(20) DEFAULT 'pending'", "payload JSONB", "created_at TIMESTAMPTZ"], JOBS, "Two jobs are pending. SKIP LOCKED claims the lowest id that is not locked: job 1."), [JOBS[0]]),
  "16-5": c(usersSchema(USERS, "Lock users 1 and 2 in id order so two sessions cannot lock them in opposite orders."), project(USERS.filter((user) => user.id === 1 || user.id === 2))),

  "17-1": c(usersSchema(USERS, "email is already UNIQUE, but this exercise adds a named index idx_users_email."), tagged("CREATE INDEX", "idx_users_email ON users(email)")),
  "17-2": c(ordersSchema("A composite index on (user_id, created_at) serves filters on user_id and user_id plus created_at."), tagged("CREATE INDEX", "idx_orders_user_created ON orders(user_id, created_at)")),
  "17-3": c(departmentsSchema(DEPARTMENTS, "name is already UNIQUE. This creates an explicit unique index with a name."), tagged("CREATE UNIQUE INDEX", "idx_departments_name_unique ON departments(name)")),
  "17-4": c(table("jobs", ["id BIGSERIAL PRIMARY KEY", "status VARCHAR(20)", "payload JSONB"], JOBS, "The partial index includes only status = 'pending', so job 3 is left out."), tagged("CREATE INDEX", "idx_jobs_pending ON jobs(id) WHERE status = 'pending'")),
  "17-5": c(usersSchema(USERS, "An expression index stores LOWER(email), which matches searches written the same way."), tagged("CREATE INDEX", "idx_users_lower_email ON users(LOWER(email))")),
  "17-6": c(ordersSchema("CONCURRENTLY builds the index without blocking writes. It cannot run inside a transaction."), tagged("CREATE INDEX CONCURRENTLY", "idx_orders_status ON orders(status)")),
  "17-7": c("Index idx_users_email exists on users(email).\n\nThe users table and its rows stay. Only the index is removed.", tagged("DROP INDEX", "idx_users_email")),

  "18-1": c(usersSchema(USERS, "email is unique, so the planner can expect one row for alice@example.com."), plan([
    "Index Scan using idx_users_email on users  (cost=0.29..8.30 rows=1 width=180)",
    "  Index Cond: ((email)::text = 'alice@example.com'::text)",
  ])),
  "18-2": c(usersSchema(USERS, "Six users are older than 30. ANALYZE adds actual time and actual rows."), plan([
    "Seq Scan on users  (cost=0.00..1.19 rows=6 width=180) (actual time=0.012..0.020 rows=6 loops=1)",
    "  Filter: (age > 30)",
    "  Rows Removed by Filter: 9",
    "Planning Time: 0.045 ms",
    "Execution Time: 0.041 ms",
  ])),
  "18-3": c(ordersSchema("Alice has four orders: 101, 102, 103, and 108."), plan([
    "Bitmap Heap Scan on orders  (cost=4.16..13.62 rows=4 width=48) (actual time=0.020..0.024 rows=4 loops=1)",
    "  Recheck Cond: (user_id = 1)",
    "  Buffers: shared hit=3",
    "  ->  Bitmap Index Scan on idx_orders_user_created  (actual rows=4 loops=1)",
    "        Index Cond: (user_id = 1)",
    "        Buffers: shared hit=1",
    "Planning Time: 0.080 ms",
    "Execution Time: 0.055 ms",
  ])),
  "18-4": c(practiceWorld("The join matches every order to its user. Eight orders produce eight output rows."), plan([
    "Hash Join  (cost=1.34..3.48 rows=8 width=40) (actual time=0.030..0.048 rows=8 loops=1)",
    "  Hash Cond: (o.user_id = u.id)",
    "  ->  Seq Scan on orders o  (actual rows=8 loops=1)",
    "  ->  Hash  (actual rows=15 loops=1)",
    "        ->  Seq Scan on users u  (actual rows=15 loops=1)",
    "Planning Time: 0.120 ms",
    "Execution Time: 0.070 ms",
  ])),

  "19-1": c(usersSchema(USERS, "ANALYZE refreshes planner statistics. It does not change the rows."), tagged("ANALYZE", "users")),
  "19-2": c("pg_stats stores one row per column of users.\n\nn_distinct near -1 means every value is unique. A positive number is an estimate of distinct values.", [
    { attname: "id", n_distinct: -1 },
    { attname: "full_name", n_distinct: -1 },
    { attname: "email", n_distinct: -1 },
    { attname: "age", n_distinct: 15 },
    { attname: "department_id", n_distinct: 3 },
    { attname: "is_active", n_distinct: 2 },
  ]),
  "19-3": c(usersSchema(USERS, "Reading every row does not benefit from an index, so the plan is a sequential scan."), plan([
    "Seq Scan on users  (cost=0.00..1.15 rows=15 width=180)",
  ])),
  "19-4": c(usersSchema(USERS, "A unique email lookup is selective, so the planner chooses an index scan."), plan([
    "Index Scan using idx_users_email on users  (cost=0.29..8.30 rows=1 width=180)",
    "  Index Cond: (email = 'alice@example.com')",
  ])),
  "19-5": c(`${ordersSchema()}\n\nIndex idx_orders_user_created (user_id, created_at) can find user_id 1.`, plan([
    "Bitmap Heap Scan on orders  (cost=4.16..13.62 rows=4 width=48)",
    "  Recheck Cond: (user_id = 1)",
    "  ->  Bitmap Index Scan on idx_orders_user_created",
    "        Index Cond: (user_id = 1)",
  ])),
  "19-6": c(ordersSchema("Two orders are pending. Compare the planner's rows estimate with the actual rows."), plan([
    "Seq Scan on orders  (cost=0.00..1.10 rows=2 width=48) (actual time=0.010..0.014 rows=2 loops=1)",
    "  Filter: ((status)::text = 'pending'::text)",
    "  Rows Removed by Filter: 6",
    "Planning Time: 0.040 ms",
    "Execution Time: 0.030 ms",
  ])),

  "20-1": c(usersSchema(USERS, "preferences does not exist yet."), [{ column_name: "preferences", data_type: "jsonb", details: "added, currently NULL for every user" }]),
  "20-2": c(`${usersSchema(USERS)}\n\npreferences JSONB is NULL for every user until this update.`, [{ id: 1, preferences: '{"theme":"dark","language":"en"}' }]),
  "20-3": c(`${usersSchema()}\n\nStored preferences:\n  1 Alice  {"theme":"dark","language":"en"}\n  2 Bob    {"theme":"light","language":"en"}\n  5 Eve    {"theme":"dark","language":"fr"}\n  everyone else  NULL\n\n-> returns JSON, so text values keep quotes.`, USERS.map((user) => ({ "?column?": user.id === 1 || user.id === 5 ? '"dark"' : user.id === 2 ? '"light"' : null }))),
  "20-4": c(`${usersSchema()}\n\n->> returns plain text, without JSON quotes.`, USERS.map((user) => ({ "?column?": user.id === 1 || user.id === 5 ? "dark" : user.id === 2 ? "light" : null }))),
  "20-5": c(`${usersSchema()}\n\nAlice and Eve have theme dark. Bob is light. Other preferences are NULL.`, [
    { ...USERS[0], preferences: PREFERENCES[1] },
    { ...USERS[4], preferences: PREFERENCES[5] },
  ]),
  "20-6": c(`${usersSchema()}\n\n@> '{"theme":"dark"}' matches Alice and Eve because their objects contain that pair.`, [
    { ...USERS[0], preferences: PREFERENCES[1] },
    { ...USERS[4], preferences: PREFERENCES[5] },
  ]),
  "20-7": c(`${usersSchema()}\n\nAlice's current preferences are {"theme":"dark","language":"en"}.`, [{ id: 1, preferences: '{"theme":"light","language":"en"}' }]),
  "20-8": c(`${usersSchema()}\n\npreferences is JSONB. A GIN index supports @> containment.`, tagged("CREATE INDEX", "idx_users_preferences ON users USING GIN (preferences)")),
  "20-9": c("Index idx_users_preferences is a GIN index on users(preferences).", plan([
    "Bitmap Heap Scan on users  (cost=8.00..12.15 rows=2 width=180) (actual time=0.018..0.022 rows=2 loops=1)",
    "  Recheck Cond: (preferences @> '{\"theme\": \"dark\"}'::jsonb)",
    "  ->  Bitmap Index Scan on idx_users_preferences",
    "        Index Cond: (preferences @> '{\"theme\": \"dark\"}'::jsonb)",
    "Planning Time: 0.090 ms",
    "Execution Time: 0.040 ms",
  ])),

  "21-1": c(usersSchema(USERS, "interests does not exist yet."), [{ column_name: "interests", data_type: "text[]", details: "added, currently NULL" }]),
  "21-2": c(`${usersSchema()}\n\ninterests is NULL until this update.`, [{ id: 1, interests: "{music,travel,technology}" }]),
  "21-3": c(`${usersSchema()}\n\nStored interests:\n  1 Alice  {music,travel,technology}\n  2 Bob    {travel}\n  5 Eve    {technology,cooking}\n  everyone else  NULL\n\nPostgreSQL arrays are 1-based, so [1] is the first value.`, USERS.map((user) => ({ interests: INTERESTS[user.id]?.split(",")[0]?.replace("{", "") ?? null }))),
  "21-4": c(`${usersSchema()}\n\ntravel is in Alice's array and Bob's array.`, [
    { ...USERS[0], interests: INTERESTS[1] },
    { ...USERS[1], interests: INTERESTS[2] },
  ]),
  "21-5": c(`${usersSchema()}\n\ntechnology is in Alice's array and Eve's array.`, [
    { ...USERS[0], interests: INTERESTS[1] },
    { ...USERS[4], interests: INTERESTS[5] },
  ]),
  "21-6": c(`${usersSchema()}\n\nAlice currently has {music,travel,technology}.`, [{ id: 1, interests: "{music,travel,technology,sports}" }]),
  "21-7": c(`${usersSchema()}\n\nUNNEST turns Alice's three interests into three rows.`, [
    { unnest: "music" },
    { unnest: "travel" },
    { unnest: "technology" },
  ]),

  "22-1": c(usersSchema(USERS, "active_users will contain every column of users where is_active is true."), tagged("CREATE VIEW", "active_users AS SELECT * FROM users WHERE is_active = TRUE")),
  "22-2": c(`View active_users\n  same columns as users\n  WHERE is_active = TRUE\n\nCarol, Henry, and Mia are inactive, so they are absent.`, project(USERS.filter((user) => user.is_active))),
  "22-3": c("View active_users currently returns every column. This exercise narrows it to id, full_name, and email.", [{ id: "integer", full_name: "varchar(100)", email: "varchar(150)" }]),
  "22-4": c(ordersSchema("The view stores one row per user_id that has orders."), [
    { user_id: 1, order_count: 4, total_spent: 5630.5 },
    { user_id: 2, order_count: 2, total_spent: 60 },
    { user_id: 5, order_count: 1, total_spent: 6100 },
    { user_id: 6, order_count: 1, total_spent: 200 },
  ]),
  "22-5": c("Materialized view user_order_summary\n  user_id      INTEGER\n  order_count  BIGINT\n  total_spent  NUMERIC\n\nREFRESH replaces the stored rows with a new calculation.", tagged("REFRESH MATERIALIZED VIEW", "user_order_summary")),
  "22-6": c("Materialized view user_order_summary(user_id, order_count, total_spent).\n\nConcurrent refresh requires a unique index.", tagged("CREATE UNIQUE INDEX", "idx_user_order_summary_user ON user_order_summary(user_id)")),
  "22-7": c("Materialized view user_order_summary has unique index idx_user_order_summary_user(user_id).", tagged("REFRESH MATERIALIZED VIEW CONCURRENTLY", "user_order_summary")),

  "23-1": c(ordersSchema("The function should add Alice's four totals: 120 + 80.50 + 5400 + 30 = 5630.50, and return 0 when a user has no orders."), tagged("CREATE FUNCTION", "get_user_order_total(integer) RETURNS numeric")),
  "23-2": c("Function get_user_order_total(integer) returns NUMERIC.\n\nUser 1 is Alice. Her order totals are 120, 80.50, 5400, and 30.", [{ get_user_order_total: 5630.5 }]),
  "23-3": c("No table. The function reads only the integer argument.", tagged("CREATE FUNCTION", "get_user_category(integer) RETURNS text")),
  "23-4": c(ordersSchema("order_count for user 1 is 4."), tagged("CREATE FUNCTION", "count_user_orders(integer) RETURNS integer")),
  "23-5": c(usersSchema(USERS, "The procedure sets is_active to false for one user id."), tagged("CREATE PROCEDURE", "deactivate_user(integer)")),
  "23-6": c(usersSchema(USERS, "Bob is id 2 and is currently active."), [{ id: 2, full_name: "Bob Martinez", is_active: false }]),

  "24-1": c(usersSchema(USERS, "updated_at does not exist yet."), [{ column_name: "updated_at", data_type: "timestamptz", details: "DEFAULT NOW()" }]),
  "24-2": c(`${usersSchema()}\n\nupdated_at TIMESTAMPTZ DEFAULT NOW() exists. The function assigns NEW.updated_at before the row is written.`, tagged("CREATE FUNCTION", "set_updated_at() RETURNS trigger")),
  "24-3": c("Function set_updated_at() returns trigger and sets NEW.updated_at = NOW().", tagged("CREATE TRIGGER", "users_set_updated_at BEFORE UPDATE ON users")),
  "24-4": c(usersSchema(USERS, "user_audit does not exist yet. It will store the email before and after a change."), columns([
    ["id", "bigint", "BIGSERIAL PRIMARY KEY"],
    ["user_id", "integer", ""],
    ["old_email", "varchar(150)", ""],
    ["new_email", "varchar(150)", ""],
    ["changed_at", "timestamptz", "DEFAULT NOW()"],
  ])),
  "24-5": c(`${usersSchema()}\n\nuser_audit(id, user_id, old_email, new_email, changed_at) is empty.`, tagged("CREATE FUNCTION", "audit_user_email() RETURNS trigger")),
  "24-6": c("Function audit_user_email() inserts OLD.email and NEW.email into user_audit.", tagged("CREATE TRIGGER", "users_email_audit AFTER UPDATE OF email ON users")),
  "24-7": c("Trigger users_email_audit runs AFTER UPDATE OF email on users.", tagged("DROP TRIGGER", "users_email_audit ON users")),

  "25-1": c("No table change. A login role can open a connection.", [{ role_name: "app_user", can_login: true }]),
  "25-2": c("Database postgres_learning\n\napp_user exists but cannot connect until CONNECT is granted.", [{ database: "postgres_learning", privilege: "CONNECT", grantee: "app_user" }]),
  "25-3": c("Schema public\n\nCONNECT is not enough. The role also needs USAGE on the schema that holds the tables.", [{ schema: "public", privilege: "USAGE", grantee: "app_user" }]),
  "25-4": c(usersSchema(USERS, "Grant read access to this table only."), [{ table: "users", privilege: "SELECT", grantee: "app_user" }]),
  "25-5": c(ordersSchema(), [{ table: "orders", privilege: "SELECT, INSERT, UPDATE, DELETE", grantee: "app_user" }]),
  "25-6": c("Sequence jobs_id_seq\n  owned by jobs.id\n\nINSERT into jobs fails if the role cannot use the id sequence.", [{ sequence: "jobs_id_seq", privilege: "USAGE, SELECT", grantee: "app_user" }]),
  "25-7": c("readonly_role is a group role. It cannot log in by itself.", [{ role_name: "readonly_role", can_login: false }]),
  "25-8": c("Schema public contains users, departments, orders, categories, and jobs.", [{ schema: "public", privilege: "SELECT", grantee: "readonly_role", scope: "ALL TABLES" }]),
  "25-9": c("Roles\n  app_user       LOGIN\n  readonly_role  NOLOGIN, has SELECT on all current public tables", [{ role: "app_user", member_of: "readonly_role" }]),
  "25-10": c(`${ordersSchema()}\n\napp_user currently has SELECT, INSERT, UPDATE, and DELETE on orders.`, [{ table: "orders", revoked: "DELETE", grantee: "app_user" }]),
  "25-11": c("Schema public\n\nThis does not change existing tables. Tables created later grant SELECT to readonly_role.", [{ schema: "public", future_object: "tables", privilege: "SELECT", grantee: "readonly_role" }]),
};
