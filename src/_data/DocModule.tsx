type DocChapter = {
  id: string;
  title: string;
  content?: string;
  keyPoints?: string[];
  importantTerms?: string[];
  diagram?: string;
  commands?: string[];
  warning?: string | null;
};

type DocModule = {
  id: string;
  title: string;
  description?: string;
  chapters: DocChapter[];
};

export const DOCS_DATA: DocModule[] = [
  {
    id: "doc-1",

    title: "1. Getting Started",

    chapters: [
      {
        id: "1-1",

        title: "1.1. What is PostgreSQL?",

        content: `PostgreSQL is an object-relational database management system (ORDBMS) based on POSTGRES, Version 4.2, developed at the University of California at Berkeley Computer Science Department. 
  
  PostgreSQL is an open-source descendant of this original Berkeley code. It supports a large part of the SQL standard and offers many modern features: complex queries, foreign keys, triggers, updatable views, transactional integrity, and multiversion concurrency control.`,
      },

      {
        id: "1-2",

        title: "1.2. Architectural Fundamentals",

        content: `Before we proceed, you should understand the basic PostgreSQL system architecture. Understanding how the parts of PostgreSQL interact will make this chapter somewhat clearer.
  
  
  
  In database jargon, PostgreSQL uses a client/server model. A PostgreSQL session consists of the following cooperating processes (programs):
  
  - A server process, which manages the database files, accepts connections to the database from client applications, and performs database actions on behalf of the clients.
  
  - The user's client (frontend) application that wants to perform database operations.`,
      },
    ],
  },

  {
    id: "doc-2",

    title: "2. The SQL Language",

    chapters: [
      {
        id: "2-1",

        title: "2.1. Introduction",

        content: `This chapter provides an overview of how to use SQL to perform simple operations. This tutorial is only intended to give you an introduction and is in no way a complete tutorial on SQL.
  
  
  
  SQL stands for Structured Query Language. It is the standard language for relational database management systems.`,
      },

      {
        id: "2-2",

        title: "2.2. Concepts",

        content: `A database contains one or more named tables. Each table contains rows and columns. 
  
  You can think of a table like a spreadsheet. Every column has a specific data type (like integer, text, date), and every row represents a single record containing values for those columns.`,
      },
    ],
  },

  {
    id: "doc-3",
    title: "3. Storage: Heap, Pages & Tuples",
    // description:
    //   "Understand how PostgreSQL physically stores tables, rows, pages, large values, and the metadata PostgreSQL uses to manage storage efficiently.",

    chapters: [
      {
        id: "3-1",
        title: "3.1. From Table to Physical Storage",

        content: `Until now, we have treated a PostgreSQL table as rows and columns.
  
  Internally, PostgreSQL must store those rows somewhere on disk.
  
  A normal PostgreSQL table is stored as a relation. The main table data uses a structure commonly called a heap.
  
  A heap does not mean the same thing as the heap data structure you may know from algorithms.
  
  In PostgreSQL, heap means that table rows are stored without maintaining a particular physical ordering such as primary-key order.
  
  This is an important distinction:
  
  A PRIMARY KEY defines uniqueness and creates or uses an index, but it does not mean PostgreSQL physically stores the table rows in primary-key order.
  
  For example, logically you may see:
  
  id | name
  1  | Alice
  2  | Bob
  3  | David
  
  But physically those rows may exist on different pages and in a different order.
  
  Indexes are separate structures that help PostgreSQL locate rows inside the heap.`,

        keyPoints: [
          "PostgreSQL calls database objects such as tables and indexes relations.",
          "Normal table data is stored using heap storage.",
          "Heap does not mean rows are sorted.",
          "A primary key does not physically order the table.",
          "Indexes are separate structures from the table heap.",
        ],

        importantTerms: [
          "Relation",
          "Heap",
          "Heap Table",
          "Physical Storage",
          "Index",
        ],

        diagram: `
  Application View
  
  users
  ┌────┬─────────┬─────────────────────┐
  │ id │ name    │ email               │
  ├────┼─────────┼─────────────────────┤
  │ 1  │ Alice   │ alice@example.com   │
  │ 2  │ Bob     │ bob@example.com     │
  │ 3  │ David   │ david@example.com   │
  └────┴─────────┴─────────────────────┘
  
  
  Physical PostgreSQL View
  
  users relation
          │
          ▼
        HEAP
          │
          ├── Page 0
          │
          ├── Page 1
          │
          ├── Page 2
          │
          └── ...
        `,

        commands: [
          "SELECT pg_relation_size('users');",
          "SELECT pg_total_relation_size('users');",
        ],

        warning:
          "Do not assume the physical order of table rows. Without ORDER BY, PostgreSQL does not guarantee result ordering.",
      },

      {
        id: "3-2",
        title: "3.2. Pages and Blocks",

        content: `PostgreSQL does not normally read individual rows directly from disk.
  
  Storage is divided into fixed-size units called pages, also commonly called blocks.
  
  In a standard PostgreSQL build, a page is 8 KB.
  
  This means PostgreSQL generally moves data between storage and memory one page at a time.
  
  A single page can contain many rows.
  
  For example, if the users table contains small rows, PostgreSQL may store many users inside one 8 KB page.
  
  When PostgreSQL needs one of those rows, the relevant page is loaded into memory.
  
  This page-based design becomes extremely important later when learning about:
  
  - shared_buffers
  - cache hits
  - sequential scans
  - index scans
  - VACUUM
  - WAL
  - checkpoints
  - disk I/O`,

        keyPoints: [
          "PostgreSQL stores relations as a collection of pages.",
          "Page and block are commonly used interchangeably.",
          "The standard PostgreSQL page size is 8 KB.",
          "Many tuples can exist inside one page.",
          "PostgreSQL caching and I/O operate heavily around pages.",
        ],

        importantTerms: ["Page", "Block", "8 KB", "Disk I/O", "Buffer"],

        diagram: `
  users relation
  
  ┌──────────────────────┐
  │ Page 0 — 8 KB        │
  │                      │
  │ Alice                │
  │ Bob                  │
  │ David                │
  │ Emma                 │
  └──────────────────────┘
  
  ┌──────────────────────┐
  │ Page 1 — 8 KB        │
  │                      │
  │ John                 │
  │ Sarah                │
  │ ...                  │
  └──────────────────────┘
  
  ┌──────────────────────┐
  │ Page 2 — 8 KB        │
  │ ...                  │
  └──────────────────────┘
        `,

        commands: ["SHOW block_size;", "SELECT current_setting('block_size');"],

        warning: null,
      },

      {
        id: "3-3",
        title: "3.3. Inside a PostgreSQL Page",

        content: `A PostgreSQL heap page contains more than just row data.
  
  Conceptually, a page contains:
  
  1. A page header
  2. Item identifiers, also called line pointers
  3. Free space
  4. Tuples
  
  The page header stores metadata about the page.
  
  Item identifiers point to the location of tuples inside the page.
  
  Tuple data is generally stored from the end of the page backward, while item identifiers grow from the beginning of the page forward.
  
  The unused area between them is free space.
  
  As rows are inserted, this free space gets smaller.
  
  This internal organization allows PostgreSQL to manage rows and row versions efficiently without requiring every reference to a row to contain an exact byte position.`,

        keyPoints: [
          "A page contains metadata as well as row data.",
          "Item identifiers point to tuples.",
          "Item identifiers are also called line pointers.",
          "Free space exists between line pointers and tuple data.",
          "Page layout matters for UPDATE, VACUUM, HOT updates, and storage efficiency.",
        ],

        importantTerms: [
          "Page Header",
          "Item Identifier",
          "Line Pointer",
          "Tuple",
          "Free Space",
        ],

        diagram: `
  8 KB Heap Page
  
  ┌───────────────────────────────┐
  │ Page Header                   │
  ├───────────────────────────────┤
  │ Line Pointer 1 ───────────┐   │
  │ Line Pointer 2 ────────┐  │   │
  │ Line Pointer 3 ─────┐  │  │   │
  │                     │  │  │   │
  │       FREE SPACE    │  │  │   │
  │                     │  │  │   │
  │                     ▼  ▼  ▼   │
  │                   Tuple 3     │
  │                   Tuple 2     │
  │                   Tuple 1     │
  └───────────────────────────────┘
        `,

        commands: [],

        warning:
          "The diagram is conceptual and simplified. PostgreSQL pages contain additional metadata and implementation details.",
      },

      {
        id: "3-4",
        title: "3.4. Tuples: PostgreSQL's Physical Rows",

        content: `A physical row stored inside PostgreSQL is commonly called a tuple.
  
  A tuple contains the column values you created, but PostgreSQL also stores internal metadata with it.
  
  This internal metadata is important for PostgreSQL's MVCC system.
  
  Examples of information associated with a tuple include transaction visibility information such as xmin and xmax.
  
  Later, when we study MVCC, you will see why an UPDATE often creates a new tuple instead of modifying the existing tuple directly.
  
  For now, remember:
  
  Logical row = what your application sees.
  
  Heap tuple = a physical version of that row stored by PostgreSQL.
  
  One logical row may have multiple physical row versions over its lifetime.`,

        keyPoints: [
          "A stored PostgreSQL row is commonly called a tuple.",
          "Tuples contain application values plus internal metadata.",
          "Tuple metadata participates in MVCC visibility.",
          "One logical row may have multiple physical versions.",
          "UPDATE behavior is closely related to tuple versions.",
        ],

        importantTerms: [
          "Tuple",
          "Tuple Header",
          "Row Version",
          "xmin",
          "xmax",
          "MVCC",
        ],

        diagram: `
  Logical Row
  
  users
  id = 1
  name = Alice
  age = 30
  
  
  Physical Heap Tuple
  
  ┌──────────────────────────┐
  │ Internal Tuple Metadata  │
  │ xmin                     │
  │ xmax                     │
  │ flags                    │
  │ ...                      │
  ├──────────────────────────┤
  │ id = 1                   │
  │ name = Alice             │
  │ age = 30                 │
  └──────────────────────────┘
        `,

        commands: ["SELECT xmin, xmax, * FROM users;"],

        warning:
          "xmin and xmax are PostgreSQL system columns. They are valuable for learning and diagnostics, but application business logic should not normally depend on them.",
      },

      {
        id: "3-5",
        title: "3.5. CTID: Physical Row Location",

        content: `Every heap tuple has a system column named ctid.
  
  The ctid represents the tuple's physical location inside the table.
  
  Conceptually it contains:
  
  (page number, item position)
  
  For example:
  
  (0,1)
  
  means approximately:
  
  page 0
  item 1
  
  Another row might have:
  
  (12,4)
  
  meaning:
  
  page 12
  item 4
  
  CTID can therefore help us understand how PostgreSQL physically organizes rows.
  
  However, CTID is not a permanent row identifier.
  
  When a row is updated, PostgreSQL may create a new tuple at another location.
  
  Its CTID can therefore change.
  
  VACUUM FULL and other operations that rewrite tables can also change physical locations.
  
  Use primary keys or another stable business identifier when your application needs to identify a row.`,

        keyPoints: [
          "ctid identifies the physical location of a tuple.",
          "It contains a block/page number and item position.",
          "ctid can change after UPDATE.",
          "ctid can change when a table is rewritten.",
          "ctid should not replace a primary key.",
        ],

        importantTerms: [
          "ctid",
          "Block Number",
          "Tuple Position",
          "Physical Address",
        ],

        diagram: `
  Heap
  
  Page 0
  ├── Item 1 → Alice    CTID (0,1)
  ├── Item 2 → Bob      CTID (0,2)
  └── Item 3 → David    CTID (0,3)
  
  Page 1
  ├── Item 1 → Emma     CTID (1,1)
  └── Item 2 → John     CTID (1,2)
        `,

        commands: [
          "SELECT ctid, id, full_name FROM users;",
          "SELECT ctid, xmin, xmax, id, full_name FROM users;",
        ],

        warning:
          "Never use CTID as a permanent application identifier. Its value can change.",
      },

      {
        id: "3-6",
        title: "3.6. Relation Forks",

        content: `A PostgreSQL table is not necessarily represented by only one physical storage file.
  
  PostgreSQL relations can have multiple forks.
  
  The most important are:
  
  main
  fsm
  vm
  
  The main fork contains the actual table or index data.
  
  The Free Space Map fork, called fsm, helps PostgreSQL find pages that have available space.
  
  The Visibility Map fork, called vm, stores visibility information used by operations such as VACUUM and index-only scans.
  
  Unlogged relations can additionally have an initialization fork called init.
  
  You can think of these as supporting storage structures attached to the main relation.`,

        keyPoints: [
          "The main fork contains relation data.",
          "The fsm fork tracks available free space.",
          "The vm fork tracks page visibility information.",
          "Unlogged relations can have an init fork.",
          "These structures help PostgreSQL avoid repeatedly scanning entire relations for metadata.",
        ],

        importantTerms: [
          "Main Fork",
          "FSM",
          "VM",
          "Init Fork",
          "Relation Fork",
        ],

        diagram: `
  users relation
       │
       ├── main
       │     └── Actual heap pages
       │
       ├── fsm
       │     └── Free Space Map
       │
       └── vm
             └── Visibility Map
  
  
  Unlogged Relation
  
       ├── main
       ├── fsm
       ├── vm
       └── init
        `,

        commands: ["SELECT pg_relation_filepath('users');"],

        warning: null,
      },

      {
        id: "3-7",
        title: "3.7. Free Space Map (FSM)",

        content: `When PostgreSQL wants to insert or update a row, it often needs to find a page with enough free space.
  
  Scanning every page of a large table would be expensive.
  
  The Free Space Map helps solve this problem.
  
  The FSM keeps information about approximately how much free space is available in heap pages.
  
  PostgreSQL can consult the FSM and locate candidate pages where a new tuple may fit.
  
  This is particularly important after rows have been deleted or old row versions have been cleaned by VACUUM.
  
  The physical disk file may not become smaller, but the free space inside existing pages can be reused by future rows.`,

        keyPoints: [
          "FSM stands for Free Space Map.",
          "It helps PostgreSQL locate pages containing reusable space.",
          "It avoids scanning every heap page to find available room.",
          "VACUUM can make dead tuple space reusable.",
          "Reusable internal space does not necessarily mean the operating-system file becomes smaller.",
        ],

        importantTerms: ["FSM", "Free Space", "Reusable Space", "Heap Page"],

        diagram: `
  Heap Pages
  
  Page 0   ██████████   almost full
  Page 1   ████░░░░░░   lots of free space
  Page 2   ███████░░░   some free space
  Page 3   ██████████   full
  
  
  Free Space Map
  
  Page 0 → Low
  Page 1 → High
  Page 2 → Medium
  Page 3 → None
  
  INSERT
     │
     ▼
  Check FSM
     │
     ▼
  Page 1 selected
        `,

        commands: [],

        warning: null,
      },

      {
        id: "3-8",
        title: "3.8. Visibility Map (VM)",

        content: `The Visibility Map stores visibility information about heap pages.
  
  It tracks two important properties:
  
  all-visible
  all-frozen
  
  An all-visible page means every tuple on that page is visible to all current transactions.
  
  An all-frozen page means tuples on the page no longer require future transaction-ID freezing work.
  
  The Visibility Map is important for VACUUM.
  
  It is also important for Index Only Scans.
  
  Normally, an index contains enough information to locate a heap tuple, but PostgreSQL may still need to check the heap to determine whether the tuple is visible to the current transaction.
  
  If the Visibility Map shows that a page is all-visible, PostgreSQL may be able to return data using the index without visiting the heap page.
  
  That is one reason the Visibility Map can directly affect query performance.`,

        keyPoints: [
          "VM stands for Visibility Map.",
          "It tracks all-visible pages.",
          "It tracks all-frozen pages.",
          "VACUUM uses visibility information.",
          "Visibility Map information helps enable efficient Index Only Scans.",
        ],

        importantTerms: [
          "Visibility Map",
          "All-visible",
          "All-frozen",
          "Index Only Scan",
          "VACUUM",
        ],

        diagram: `
  Index
    │
    │ lookup
    ▼
  Index Entry
    │
    ├───────────────┐
    │               │
    ▼               ▼
  Visibility Map   Heap Page
    │
    │ all-visible?
    │
    ├── YES → Heap visit may be avoided
    │
    └── NO  → Check heap tuple visibility
        `,

        commands: [
          "EXPLAIN (ANALYZE, BUFFERS) SELECT id FROM users WHERE id = 1;",
        ],

        warning:
          "Having an index does not guarantee an Index Only Scan. The planner considers cost, requested columns, visibility information, and other factors.",
      },

      {
        id: "3-9",
        title: "3.9. TOAST and Large Values",

        content: `A PostgreSQL page has limited space.
  
  But columns such as TEXT, JSONB, BYTEA, and large VARCHAR values can contain data that is too large to fit conveniently inside a normal heap tuple.
  
  PostgreSQL uses a mechanism called TOAST:
  
  The Oversized-Attribute Storage Technique.
  
  When a row becomes large, PostgreSQL can compress large column values and/or move them into a separate TOAST relation.
  
  The main heap tuple then stores information that allows PostgreSQL to retrieve the external value when required.
  
  This is why a table containing large JSONB or TEXT values may have significant storage outside the visible main heap.
  
  TOAST behavior is especially relevant when designing tables containing:
  
  - large JSON documents
  - long text
  - binary data
  - large arrays`,

        keyPoints: [
          "TOAST handles oversized column values.",
          "Large values can be compressed.",
          "Large values can be stored outside the main heap tuple.",
          "A table can have an associated TOAST relation.",
          "TEXT, JSONB, BYTEA, and other variable-length values can use TOAST.",
        ],

        importantTerms: [
          "TOAST",
          "TOAST Table",
          "Compression",
          "Out-of-line Storage",
          "Oversized Attribute",
        ],

        diagram: `
  users heap
  
  ┌─────────────────────────────┐
  │ id = 1                      │
  │ name = Alice                │
  │ profile_data ───────────────┼─────────┐
  └─────────────────────────────┘         │
                                        ▼
                                TOAST relation
                           ┌────────────────────┐
                           │ Large JSON chunk   │
                           │ Large JSON chunk   │
                           │ Large JSON chunk   │
                           └────────────────────┘
        `,

        commands: [
          "SELECT reltoastrelid FROM pg_class WHERE relname = 'users';",
          "SELECT pg_column_size(preferences) FROM users;",
        ],

        warning:
          "Do not store every application attribute inside JSONB simply because PostgreSQL supports large JSON values. Frequently queried structured fields often work better as relational columns.",
      },

      {
        id: "3-10",
        title: "3.10. Table Size vs Total Relation Size",

        content: `A PostgreSQL table consumes more space than just its visible rows.
  
  When measuring storage, distinguish between:
  
  table heap
  indexes
  TOAST
  supporting relation storage
  
  pg_relation_size() measures the disk space used by the specified relation's main fork.
  
  pg_table_size() measures the table including additional table storage such as TOAST, but excludes indexes.
  
  pg_indexes_size() measures the indexes associated with the table.
  
  pg_total_relation_size() includes the table and its indexes.
  
  This distinction becomes important when diagnosing storage growth and bloat.
  
  For example, a logical table might contain 4 GB of heap data while indexes consume another 6 GB.`,

        keyPoints: [
          "Heap size and total table footprint are different.",
          "Indexes can consume substantial storage.",
          "TOAST can consume additional storage.",
          "pg_relation_size and pg_total_relation_size answer different questions.",
          "Always inspect indexes when investigating unexpectedly large tables.",
        ],

        importantTerms: [
          "Relation Size",
          "Table Size",
          "Index Size",
          "Total Relation Size",
          "TOAST Size",
        ],

        diagram: `
  users
  
  Total Relation Size
  │
  ├── Heap
  │     4 GB
  │
  ├── TOAST
  │     1 GB
  │
  └── Indexes
        6 GB
  
  Total ≈ 11 GB
        `,

        commands: [
          "SELECT pg_size_pretty(pg_relation_size('users'));",
          "SELECT pg_size_pretty(pg_table_size('users'));",
          "SELECT pg_size_pretty(pg_indexes_size('users'));",
          "SELECT pg_size_pretty(pg_total_relation_size('users'));",
        ],

        warning: null,
      },

      {
        id: "3-11",
        title: "3.11. Storage Mental Model",

        content: `Before moving into PostgreSQL caching, keep this mental model in mind.
  
  Your application thinks in rows.
  
  PostgreSQL physically stores tuple versions.
  
  Tuples live inside pages.
  
  Pages belong to relations.
  
  Indexes are separate relations that point toward heap tuples.
  
  Large values may be stored through TOAST.
  
  Supporting structures such as the Free Space Map and Visibility Map help PostgreSQL efficiently manage those pages.
  
  This storage model becomes the foundation for understanding almost every PostgreSQL internal topic that follows.
  
  In the next module, Shared Buffers will answer the next important question:
  
  If the table pages are stored on disk, how does PostgreSQL avoid reading them from disk for every query?`,

        keyPoints: [
          "Application → rows",
          "PostgreSQL → tuples",
          "Tuples → pages",
          "Pages → relations",
          "Indexes → separate structures",
          "Large values → TOAST",
          "Free space → FSM",
          "Visibility information → VM",
          "Frequently accessed pages → PostgreSQL cache in the next module",
        ],

        importantTerms: [
          "Relation",
          "Heap",
          "Page",
          "Tuple",
          "CTID",
          "FSM",
          "VM",
          "TOAST",
        ],

        diagram: `
  Application
      │
      ▼
   SQL Table
      │
      ▼
   Relation
      │
      ├───────────────┬───────────────┐
      ▼               ▼               ▼
    Heap            Indexes          TOAST
      │
      ▼
    Pages
      │
      ▼
   Tuples
  
  
  Supporting metadata
  
  Heap
   ├── FSM → Where is free space?
   └── VM  → Which pages are visible/frozen?
  
  
  Next:
  
  Disk Pages
      │
      ▼
  Shared Buffers / Cache
        `,

        commands: [
          "SELECT ctid, xmin, xmax, * FROM users LIMIT 10;",
          "SELECT pg_size_pretty(pg_relation_size('users'));",
          "SELECT pg_size_pretty(pg_total_relation_size('users'));",
          "SHOW block_size;",
        ],

        warning: null,
      },
    ],
  },

  {
    id: "doc-4",
    title: "4. Cache: Shared Buffers",
    description:
      "Understand how PostgreSQL caches table and index pages in memory, how shared_buffers works, what cache hits and misses mean, and how PostgreSQL decides which pages stay in memory.",

    chapters: [
      {
        id: "4-1",
        title: "4.1. Why PostgreSQL Needs a Cache",

        content: `In the previous module, we learned that PostgreSQL stores table and index data inside pages.
  
  Those pages ultimately live on persistent storage such as SSD or disk.
  
  Reading from storage is much slower than reading from memory.
  
  If PostgreSQL had to read the same page from disk every time a query needed it, database performance would be poor.
  
  To avoid this, PostgreSQL keeps frequently accessed pages in memory.
  
  The main PostgreSQL-managed cache is called shared buffers.
  
  The basic flow is:
  
  1. A query needs a table or index page.
  2. PostgreSQL checks whether that page is already in shared buffers.
  3. If it exists there, PostgreSQL can use the cached copy.
  4. If it does not exist there, PostgreSQL must request the page from storage or the operating system cache.
  5. PostgreSQL then places that page into shared buffers.
  
  This is the foundation of PostgreSQL caching.`,

        keyPoints: [
          "Disk access is much slower than memory access.",
          "PostgreSQL caches frequently accessed pages.",
          "The main PostgreSQL-managed cache is shared buffers.",
          "Queries operate heavily on pages rather than individual rows.",
          "A cached page can be reused by many queries and database sessions.",
        ],

        importantTerms: [
          "Cache",
          "Shared Buffers",
          "Page",
          "Cache Hit",
          "Cache Miss",
        ],

        diagram: `
  Query
    │
    ▼
  Needs Page 42
    │
    ▼
  Shared Buffers
    │
    ├── Page exists
    │      │
    │      └── Use cached page
    │
    └── Page missing
           │
           ▼
     Storage / OS Cache
           │
           ▼
     Load Page 42
           │
           ▼
     Shared Buffers
        `,

        commands: ["SHOW shared_buffers;"],

        warning: null,
      },

      {
        id: "4-2",
        title: "4.2. What is shared_buffers?",

        content: `shared_buffers is a region of memory managed directly by PostgreSQL.
  
  It contains copies of database pages currently being used or recently used.
  
  These pages can belong to:
  
  - tables
  - indexes
  - materialized views
  - system catalogs
  - other PostgreSQL relations
  
  shared_buffers is shared between database backend processes.
  
  This means that if one PostgreSQL connection loads a page into shared buffers, another connection can potentially reuse the same cached page.
  
  For example:
  
  Connection A queries user id 100.
  
  PostgreSQL loads the heap page containing that user.
  
  Later, Connection B queries another user stored on the same page.
  
  If that page is still present in shared buffers, PostgreSQL does not need to load it into shared buffers again.
  
  This sharing is one reason PostgreSQL calls it shared_buffers.`,

        keyPoints: [
          "shared_buffers is PostgreSQL-controlled memory.",
          "It stores database pages.",
          "It is shared between PostgreSQL backend processes.",
          "Table pages and index pages can both be cached.",
          "Cached pages can be reused by other database connections.",
        ],

        importantTerms: [
          "shared_buffers",
          "Backend Process",
          "Shared Memory",
          "Heap Page",
          "Index Page",
        ],

        diagram: `
                  PostgreSQL
  
         ┌──────────────────────┐
         │    Shared Buffers    │
         │                      │
         │ Page 10 - users      │
         │ Page 11 - users      │
         │ Page 3  - index      │
         │ Page 52 - orders     │
         │ ...                  │
         └──────────────────────┘
              ▲           ▲
              │           │
         Connection A  Connection B
        `,

        commands: [
          "SHOW shared_buffers;",
          "SELECT current_setting('shared_buffers');",
        ],

        warning:
          "shared_buffers is not the total amount of memory PostgreSQL can use. PostgreSQL also uses memory for sorts, hashes, maintenance operations, connections, WAL, temporary buffers, and other work.",
      },

      {
        id: "4-3",
        title: "4.3. Cache Hit",

        content: `A cache hit occurs when PostgreSQL needs a page and finds that page already available in shared buffers.
  
  For example:
  
  A query needs Page 10 from the users table.
  
  If Page 10 is already present in shared buffers, PostgreSQL uses it directly.
  
  This avoids the need to load that page into PostgreSQL's cache again.
  
  Cache hits are normally much cheaper than reads that require obtaining a page from outside shared buffers.
  
  If the same data is queried repeatedly, you will often see more shared buffer hits after the first execution.`,

        keyPoints: [
          "A cache hit means the required page was already in shared buffers.",
          "Cache hits avoid bringing the page into shared buffers again.",
          "Frequently accessed data tends to produce more cache hits.",
          "Repeated queries often benefit from already-cached pages.",
        ],

        importantTerms: ["Cache Hit", "Shared Hit", "Buffer Hit"],

        diagram: `
  Query
    │
    ▼
  Need users Page 10
    │
    ▼
  Shared Buffers
  
  ┌─────────────────────────┐
  │ Page 7                  │
  │ Page 8                  │
  │ Page 10  ← FOUND        │
  │ Page 20                 │
  └─────────────────────────┘
  
            │
            ▼
         CACHE HIT
        `,

        commands: [
          "EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM users WHERE id = 1;",
        ],

        warning:
          "A shared buffer hit means PostgreSQL found the page in shared buffers. It does not mean the query itself is automatically efficient.",
      },

      {
        id: "4-4",
        title: "4.4. Cache Miss and Page Read",

        content: `A cache miss occurs conceptually when the required page is not already available in PostgreSQL shared buffers.
  
  PostgreSQL then needs to obtain that page.
  
  The request may be satisfied by the operating system's filesystem cache or may require actual storage I/O.
  
  From PostgreSQL's perspective, EXPLAIN with BUFFERS can report this as a shared read.
  
  After PostgreSQL obtains the page, it can place the page into shared buffers.
  
  Future queries may then access that page as a shared hit.
  
  This distinction is important:
  
  shared read does not necessarily mean the physical SSD was accessed.
  
  The operating system may already have the page cached in RAM.
  
  We will study this second caching layer in the next module.`,

        keyPoints: [
          "A missing shared-buffer page must be obtained from outside shared buffers.",
          "EXPLAIN BUFFERS can report shared reads.",
          "A shared read is not proof of physical disk I/O.",
          "The operating system may satisfy the read from its own page cache.",
          "Once loaded, the page can become available for later shared hits.",
        ],

        importantTerms: [
          "Cache Miss",
          "Shared Read",
          "Disk Read",
          "OS Page Cache",
        ],

        diagram: `
  Query
    │
    ▼
  Need Page 50
    │
    ▼
  Shared Buffers
    │
    └── NOT FOUND
           │
           ▼
   Operating System
      Page Cache
           │
      ┌────┴────┐
      │         │
   Found     Not Found
      │         │
      │         ▼
      │       SSD/Disk
      │         │
      └────┬────┘
           ▼
   Shared Buffers
           │
           ▼
        Query
        `,

        commands: [
          "EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders WHERE user_id = 1;",
        ],

        warning:
          "Do not interpret every `shared read` as a physical disk read. PostgreSQL's buffer statistics and operating-system caching are separate layers.",
      },

      {
        id: "4-5",
        title: "4.5. Clean and Dirty Buffers",

        content: `A page inside shared buffers can be clean or dirty.
  
  A clean buffer contains a page that matches the current persistent version of that page.
  
  A dirty buffer contains changes that have been made in memory but have not yet been written to the table's data file.
  
  For example:
  
  An UPDATE modifies a row.
  
  The heap page containing that row is changed in shared buffers.
  
  That page is now dirty.
  
  PostgreSQL does not necessarily write the modified table page to disk immediately when the transaction commits.
  
  Instead, PostgreSQL relies on WAL for durability.
  
  The dirty data page can be written later by the checkpointer, background writer, or a backend process.
  
  This separation allows PostgreSQL to avoid synchronous random table-page writes for every change.`,

        keyPoints: [
          "Clean pages match their persistent data-file version.",
          "Dirty pages contain changes not yet written to the relation data file.",
          "UPDATE, INSERT, and DELETE can dirty pages.",
          "Dirty pages do not necessarily need to be written immediately at COMMIT.",
          "WAL protects durability before dirty pages are eventually flushed.",
        ],

        importantTerms: [
          "Clean Buffer",
          "Dirty Buffer",
          "WAL",
          "Flush",
          "Checkpoint",
        ],

        diagram: `
  UPDATE users
        │
        ▼
  Shared Buffers
  
  Before
  ┌──────────────────┐
  │ Page 10 - CLEAN  │
  └──────────────────┘
  
        │ UPDATE
        ▼
  
  After
  ┌──────────────────┐
  │ Page 10 - DIRTY  │
  └──────────────────┘
  
        │
        │ eventually
        ▼
  
  Persistent Data File
        `,

        commands: [],

        warning:
          "A committed transaction can be durable even while its modified table pages are still dirty in shared buffers because PostgreSQL uses Write-Ahead Logging.",
      },

      {
        id: "4-6",
        title: "4.6. Buffer Eviction",

        content: `shared_buffers has a fixed configured size.
  
  Eventually, it becomes full.
  
  When PostgreSQL needs space for another page, it may need to reuse an existing buffer.
  
  This means some cached page must effectively be evicted.
  
  PostgreSQL does not use a simple Least Recently Used cache.
  
  Instead, PostgreSQL uses a clock-sweep style buffer replacement strategy.
  
  Each buffer has information that helps PostgreSQL estimate whether the page has been useful recently.
  
  Frequently reused pages receive higher usage counts.
  
  When PostgreSQL searches for a reusable buffer, it scans buffers and decreases usage counts until it finds a suitable candidate.
  
  This prevents every cache access from requiring expensive exact LRU bookkeeping.`,

        keyPoints: [
          "shared_buffers has a limited size.",
          "Old or less useful cached pages eventually need to be replaced.",
          "PostgreSQL does not use a strict LRU implementation.",
          "PostgreSQL uses a clock-sweep style replacement strategy.",
          "Usage counts help PostgreSQL decide which buffers to reuse.",
        ],

        importantTerms: [
          "Eviction",
          "Clock Sweep",
          "usage_count",
          "Buffer Replacement",
        ],

        diagram: `
  Shared Buffers
  
  [Page A usage=5]
  [Page B usage=3]
  [Page C usage=0]  ← possible candidate
  [Page D usage=2]
  [Page E usage=0]  ← possible candidate
  
                 ▲
                 │
            Clock Sweep
                 │
       checks usage counts
        `,

        commands: [],

        warning:
          "The actual buffer replacement implementation contains more detail than this simplified model, but the clock-sweep mental model is sufficient for understanding normal PostgreSQL behavior.",
      },

      {
        id: "4-7",
        title: "4.7. Buffer Pins",

        content: `While PostgreSQL is actively using a page, the corresponding buffer can be pinned.
  
  A buffer pin tells PostgreSQL that a backend is currently using the buffer and that it cannot simply be replaced at that moment.
  
  Conceptually:
  
  1. A backend needs a page.
  2. The backend acquires access to the buffer containing the page.
  3. The buffer is pinned while it is being used.
  4. Once PostgreSQL finishes using it, the pin is released.
  
  This mechanism helps PostgreSQL safely coordinate concurrent access to shared memory.
  
  Buffer pins are different from SQL row locks and table locks.
  
  A row lock controls transactional access to data.
  
  A buffer pin protects an in-memory page while PostgreSQL internals are using it.`,

        keyPoints: [
          "A buffer pin protects a buffer while it is actively being used.",
          "Pinned buffers cannot simply be evicted.",
          "Buffer pins are an internal memory-management concept.",
          "Buffer pins are different from row and table locks.",
        ],

        importantTerms: [
          "Buffer Pin",
          "Backend",
          "Shared Buffer",
          "Concurrency",
        ],

        diagram: `
  Backend A
     │
     ▼
  Page 25
     │
     ▼
  ┌────────────────────┐
  │ Buffer containing  │
  │ Page 25            │
  │                    │
  │ PINNED             │
  └────────────────────┘
  
  Eviction attempt
        │
        └── Cannot reuse while pinned
        `,

        commands: [],

        warning:
          "Do not confuse PostgreSQL buffer pins with transactional locks such as FOR UPDATE.",
      },

      {
        id: "4-8",
        title: "4.8. Sequential Scans and the Cache",

        content: `A large sequential scan behaves differently from repeatedly accessing a few pages.
  
  Imagine a table containing millions of pages.
  
  If PostgreSQL treated every page from a huge sequential scan as highly valuable cache content, that scan could remove frequently used pages from shared buffers.
  
  PostgreSQL uses special buffer access strategies for certain operations, including large sequential scans.
  
  Instead of allowing the scan to freely consume the entire buffer cache, PostgreSQL can use a relatively small ring of reusable buffers.
  
  This helps protect frequently accessed cached pages from being displaced by one large scan.
  
  This is one example of why PostgreSQL's caching behavior is more sophisticated than simply "put every page into RAM forever."`,

        keyPoints: [
          "Large sequential scans can touch enormous numbers of pages.",
          "PostgreSQL uses special buffer access strategies for some operations.",
          "Large scans can use a limited buffer ring.",
          "This helps reduce cache pollution.",
          "Sequential scans are not inherently bad.",
        ],

        importantTerms: [
          "Sequential Scan",
          "Buffer Access Strategy",
          "Ring Buffer",
          "Cache Pollution",
        ],

        diagram: `
  Frequently Used Cache
  
  [A][B][C][D][E][F][G][H]
  
  
  Huge Sequential Scan
  
  Page 1
  Page 2
  Page 3
  ...
  Page 1,000,000
  
        │
        ▼
  
  Small reusable scan ring
  
  [R1][R2][R3][R4]
  
  instead of replacing
  the entire shared cache
        `,

        commands: ["EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders;"],

        warning:
          "A Sequential Scan in an execution plan does not automatically indicate a performance problem. For queries reading a large portion of a table, it may be the cheapest plan.",
      },

      {
        id: "4-9",
        title: "4.9. Inspect Buffers with EXPLAIN",

        content: `EXPLAIN with the BUFFERS option helps show how a query interacted with PostgreSQL buffers.
  
  A commonly useful command is:
  
  EXPLAIN (ANALYZE, BUFFERS)
  
  You may see output containing values such as:
  
  shared hit=120
  shared read=20
  shared dirtied=4
  shared written=2
  
  Conceptually:
  
  shared hit
  The page was already available in PostgreSQL shared buffers.
  
  shared read
  PostgreSQL had to obtain the page from outside shared buffers.
  
  shared dirtied
  The query caused pages to become dirty.
  
  shared written
  Dirty pages were written while executing the query.
  
  These metrics are far more useful than looking only at query execution time when investigating database I/O behavior.`,

        keyPoints: [
          "EXPLAIN BUFFERS shows page-level buffer activity.",
          "shared hit means a page was already in shared buffers.",
          "shared read means PostgreSQL obtained a page from outside shared buffers.",
          "shared dirtied means pages became dirty.",
          "shared written means pages were written during execution.",
        ],

        importantTerms: [
          "EXPLAIN",
          "BUFFERS",
          "shared hit",
          "shared read",
          "shared dirtied",
          "shared written",
        ],

        diagram: `
  EXPLAIN (ANALYZE, BUFFERS)
  
  Query
   │
   ▼
  Execution Plan
   │
   ├── shared hit=120
   ├── shared read=20
   ├── shared dirtied=4
   └── shared written=2
        `,

        commands: [
          "EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM users WHERE id = 1;",
          "EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders WHERE user_id = 1;",
        ],

        warning:
          "EXPLAIN ANALYZE actually executes the statement. Be especially careful when using it with INSERT, UPDATE, DELETE, or other statements that modify data.",
      },

      {
        id: "4-10",
        title: "4.10. Cache Hit Ratio",

        content: `PostgreSQL statistics can show how often blocks were found in shared buffers compared with how often PostgreSQL had to read them into shared buffers.
  
  At the database level, two important counters are:
  
  blks_hit
  Number of times requested blocks were already found in shared buffers.
  
  blks_read
  Number of blocks PostgreSQL had to obtain from outside shared buffers.
  
  A commonly calculated cache hit ratio is:
  
  blks_hit / (blks_hit + blks_read)
  
  For example:
  
  blks_hit  = 990,000
  blks_read = 10,000
  
  Cache hit ratio:
  
  990000 / 1000000
  
  = 99%
  
  A high cache hit ratio is often desirable for transactional workloads.
  
  However, the number should not be interpreted blindly.
  
  Analytical workloads performing large sequential scans may legitimately have lower hit ratios.
  
  A high cache hit ratio also does not guarantee efficient queries.
  
  A badly written query can repeatedly read millions of cached pages and still report an excellent cache hit ratio.`,

        keyPoints: [
          "blks_hit counts shared-buffer hits.",
          "blks_read counts blocks obtained from outside shared buffers.",
          "Cache hit ratio can help understand workload behavior.",
          "A high hit ratio does not automatically mean queries are efficient.",
          "The expected ratio depends on the workload.",
        ],

        importantTerms: [
          "blks_hit",
          "blks_read",
          "Cache Hit Ratio",
          "pg_stat_database",
        ],

        diagram: `
  blks_hit  = 990,000
  blks_read =  10,000
  
                990,000
  Hit Ratio = ─────────────
              1,000,000
  
            = 99%
        `,

        commands: [
          "SELECT datname, blks_read, blks_hit FROM pg_stat_database;",
          "SELECT datname, ROUND(100.0 * blks_hit / NULLIF(blks_hit + blks_read, 0), 2) AS cache_hit_ratio FROM pg_stat_database;",
        ],

        warning:
          "Do not use cache hit ratio as a standalone health score. Query volume, workload type, execution plans, storage latency, and pages touched all matter.",
      },

      {
        id: "4-11",
        title: "4.11. Inspect Shared Buffers with pg_buffercache",

        content: `PostgreSQL provides the pg_buffercache extension for inspecting the contents of shared buffers.
  
  It allows you to see information about cached buffers, including which relations have pages currently present in shared memory.
  
  This can help answer questions such as:
  
  Which tables are occupying shared buffers?
  
  Which indexes have many cached pages?
  
  How much of a relation appears to be cached?
  
  What usage counts do buffers have?
  
  The extension exposes PostgreSQL's current cache state rather than historical query statistics.
  
  Because the cache changes continuously, pg_buffercache gives you a snapshot of what is currently present.`,

        keyPoints: [
          "pg_buffercache can inspect current shared-buffer contents.",
          "It can help identify which relations occupy cache.",
          "It exposes buffer metadata such as usage count.",
          "Its contents represent a changing snapshot.",
          "It is primarily an observability and learning tool.",
        ],

        importantTerms: [
          "pg_buffercache",
          "bufferid",
          "relfilenode",
          "usagecount",
        ],

        diagram: `
  Shared Buffers
  
  Buffer 1  → users page
  Buffer 2  → users page
  Buffer 3  → orders index page
  Buffer 4  → orders page
  Buffer 5  → pg_class page
  ...
  
          │
          ▼
  
  pg_buffercache
  
  inspect current
  buffer contents
        `,

        commands: [
          "CREATE EXTENSION IF NOT EXISTS pg_buffercache;",
          "SELECT * FROM pg_buffercache LIMIT 10;",
          "SELECT usagecount, COUNT(*) FROM pg_buffercache GROUP BY usagecount ORDER BY usagecount;",
        ],

        warning:
          "pg_buffercache is mainly useful for inspection and diagnostics. Avoid building application logic around the current contents of the PostgreSQL cache.",
      },

      {
        id: "4-12",
        title: "4.12. How Much of a Table is Cached?",

        content: `Using pg_buffercache, we can estimate how many pages belonging to a relation are currently present in shared buffers.
  
  For example, suppose the users table occupies 10,000 heap pages.
  
  If 8,000 of those pages are currently present in shared buffers, then roughly 80% of its heap pages are cached in PostgreSQL's own buffer cache.
  
  However, remember that PostgreSQL shared buffers are only one caching layer.
  
  Pages missing from shared buffers may still exist inside the operating system page cache.
  
  Therefore:
  
  Not in shared_buffers
  
  does not necessarily mean:
  
  Must be read from physical disk.
  
  This distinction becomes central in the next module.`,

        keyPoints: [
          "pg_buffercache can help estimate relation cache residency.",
          "Relations can be partially cached.",
          "Cache residency changes continuously.",
          "Missing from shared buffers does not necessarily mean missing from RAM.",
          "The OS page cache forms another important cache layer.",
        ],

        importantTerms: [
          "Cache Residency",
          "Shared Buffer Residency",
          "OS Page Cache",
        ],

        diagram: `
  users table
  
  Total Heap Pages
  10,000
  
  Shared Buffers
  8,000 pages
  
  Approx PostgreSQL Cache Residency
  80%
  
  
  Remaining 2,000 pages
  
          │
          ▼
  May still exist in
  Operating System Cache
        `,

        commands: [
          "SELECT COUNT(*) FROM pg_buffercache;",
          "SELECT pg_relation_size('users') / current_setting('block_size')::int AS approximate_pages;",
        ],

        warning:
          "Cache residency is temporary state. It changes constantly as queries access other relations.",
      },

      {
        id: "4-13",
        title: "4.13. shared_buffers Configuration",

        content: `The shared_buffers setting determines the amount of memory PostgreSQL reserves for its shared buffer cache.
  
  You can inspect it using:
  
  SHOW shared_buffers;
  
  The ideal value depends on the environment and workload.
  
  Setting shared_buffers extremely high does not automatically make PostgreSQL faster.
  
  PostgreSQL also relies heavily on the operating system page cache.
  
  Memory is also required for:
  
  - work_mem
  - maintenance_work_mem
  - WAL buffers
  - backend processes
  - operating system
  - connection overhead
  - filesystem cache
  
  Therefore database memory must be treated as a complete memory budget rather than tuning one setting independently.
  
  Changes to shared_buffers generally require a PostgreSQL restart.`,

        keyPoints: [
          "shared_buffers controls PostgreSQL's shared buffer cache size.",
          "More shared_buffers is not automatically better.",
          "PostgreSQL also depends on OS caching.",
          "Other PostgreSQL operations need memory too.",
          "Memory tuning must consider the entire system.",
        ],

        importantTerms: [
          "shared_buffers",
          "Memory Budget",
          "Configuration",
          "Restart",
        ],

        diagram: `
  Server RAM
  ┌──────────────────────────────┐
  │ PostgreSQL shared_buffers    │
  ├──────────────────────────────┤
  │ OS Page Cache                │
  ├──────────────────────────────┤
  │ PostgreSQL work memory       │
  ├──────────────────────────────┤
  │ Connections / Processes      │
  ├──────────────────────────────┤
  │ Operating System             │
  └──────────────────────────────┘
  
  All compete for RAM.
        `,

        commands: [
          "SHOW shared_buffers;",
          "SELECT current_setting('shared_buffers');",
        ],

        warning:
          "Do not blindly copy a shared_buffers value from another server. Available RAM, workload, operating system, connection count, and database behavior all matter.",
      },

      {
        id: "4-14",
        title: "4.14. First Cache Experiment",

        content: `The easiest way to understand caching is to observe it.
  
  Consider running the same query more than once:
  
  EXPLAIN (ANALYZE, BUFFERS)
  SELECT *
  FROM orders
  WHERE user_id = 1;
  
  On an environment where the required pages are not initially in PostgreSQL shared buffers, an earlier execution may show more shared reads.
  
  A later execution may show more shared hits because the required pages have already been brought into shared buffers.
  
  However, results depend on the current cache state.
  
  If another query already loaded the pages, even the first execution may show hits.
  
  The important lesson is not that "the second query is always cached."
  
  The important lesson is understanding what hit and read mean and observing how cache state affects execution.`,

        keyPoints: [
          "Run the same query multiple times.",
          "Compare shared hit and shared read values.",
          "Cache state depends on previous activity.",
          "The first execution is not guaranteed to be a cold-cache execution.",
          "Experiments should focus on understanding behavior rather than expecting identical numbers.",
        ],

        importantTerms: [
          "Warm Cache",
          "Cold Cache",
          "Shared Hit",
          "Shared Read",
        ],

        diagram: `
  Execution 1
  
  Query
    │
    ├── shared read = 20
    └── shared hit  = 5
  
  
  Execution 2
  
  Same Query
    │
    ├── shared read = 0
    └── shared hit  = 25
  
  
  Possible result,
  not guaranteed exact behavior.
        `,

        commands: [
          "EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders WHERE user_id = 1;",
          "EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders WHERE user_id = 1;",
        ],

        warning:
          "Do not restart PostgreSQL or clear operating-system caches on a production server merely to create a cold-cache benchmark.",
      },

      {
        id: "4-15",
        title: "4.15. Shared Buffers Mental Model",

        content: `At this point, keep the following mental model.
  
  Persistent table and index data is organized into pages.
  
  When PostgreSQL needs a page, it first works through its shared buffer cache.
  
  If the page is already there:
  
  shared hit
  
  If PostgreSQL must obtain the page from outside shared buffers:
  
  shared read
  
  Pages modified in memory become:
  
  dirty buffers
  
  When shared buffers need space:
  
  PostgreSQL selects reusable buffers using its buffer replacement strategy.
  
  Frequently accessed pages tend to remain useful in the cache, while less useful pages can eventually be replaced.
  
  But shared buffers are not the entire caching story.
  
  PostgreSQL runs on top of an operating system.
  
  The operating system itself uses unused RAM to cache filesystem data.
  
  Therefore the real read path looks more like:
  
  PostgreSQL shared buffers
  ↓
  Operating system page cache
  ↓
  SSD / disk
  
  That is the topic of the next module.`,

        keyPoints: [
          "shared_buffers is PostgreSQL's primary page cache.",
          "Hits come from shared buffers.",
          "Reads obtain pages from outside shared buffers.",
          "Modified pages become dirty.",
          "Buffers can eventually be replaced.",
          "PostgreSQL caching works together with the operating system cache.",
        ],

        importantTerms: [
          "shared_buffers",
          "Cache Hit",
          "Shared Read",
          "Dirty Buffer",
          "Eviction",
          "OS Page Cache",
        ],

        diagram: `
                 Query
                   │
                   ▼
          PostgreSQL Executor
                   │
                   ▼
          ┌─────────────────┐
          │ Shared Buffers  │
          └─────────────────┘
            │             │
         HIT│             │MISS
            │             ▼
            │     ┌────────────────┐
            │     │ OS Page Cache  │
            │     └────────────────┘
            │          │       │
            │       HIT│       │MISS
            │          │       ▼
            │          │    SSD/Disk
            │          │       │
            └──────────┴───────┘
                       │
                       ▼
                     Query
  
  
  Next Module:
  
  OS Page Cache
  +
  effective_cache_size
  +
  shared_buffers vs OS cache
        `,

        commands: [
          "SHOW shared_buffers;",
          "EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders WHERE user_id = 1;",
          "SELECT datname, blks_read, blks_hit FROM pg_stat_database;",
          "SELECT * FROM pg_buffercache LIMIT 10;",
        ],

        warning: null,
      },
    ],
  },

  // =========================================================
  // MODULE 5 — OS PAGE CACHE
  // =========================================================
  {
    id: "doc-5",
    title: "5. OS Page Cache & effective_cache_size",
    description:
      "Understand the second major caching layer underneath PostgreSQL, how Linux filesystem caching interacts with shared_buffers, and what effective_cache_size actually means.",

    chapters: [
      {
        id: "5-1",
        title: "5.1. PostgreSQL Has More Than One Cache",

        content: `PostgreSQL shared_buffers is not the only place where database pages can remain in memory.
  
  PostgreSQL normally reads relation files through the operating system.
  
  Modern operating systems use unused RAM to cache recently accessed filesystem data.
  
  This is commonly called the OS Page Cache.
  
  Therefore a PostgreSQL page may exist:
  
  1. In shared_buffers
  2. In the operating system page cache
  3. Only on persistent storage
  
  When PostgreSQL reports that it had to read a page into shared_buffers, that does not automatically mean the SSD was accessed.
  
  The operating system may already have the required filesystem block cached in RAM.`,

        keyPoints: [
          "PostgreSQL has its own shared buffer cache.",
          "The operating system also caches filesystem data.",
          "A PostgreSQL shared read is not necessarily physical disk I/O.",
          "The OS may satisfy PostgreSQL reads directly from RAM.",
          "PostgreSQL and the OS cache work together.",
        ],

        importantTerms: [
          "OS Page Cache",
          "Filesystem Cache",
          "Shared Buffers",
          "Physical I/O",
          "RAM",
        ],

        diagram: `
  Query
    │
    ▼
  PostgreSQL
    │
    ▼
  Shared Buffers
    │
    ├── HIT
    │
    └── MISS
         │
         ▼
  OS Page Cache
    │
    ├── HIT
    │
    └── MISS
         │
         ▼
      SSD / Disk
        `,

        commands: ["SHOW shared_buffers;"],

        warning:
          "Do not assume `shared read` in EXPLAIN means the database physically read from SSD.",
      },

      {
        id: "5-2",
        title: "5.2. Why PostgreSQL Uses Both Cache Layers",

        content: `PostgreSQL intentionally works with both its own buffer cache and the operating system cache.
  
  shared_buffers gives PostgreSQL direct control over important database pages.
  
  The operating system page cache can use the remaining system memory to cache filesystem data.
  
  This means a server might conceptually use memory like:
  
  PostgreSQL shared_buffers
  +
  OS filesystem cache
  +
  query memory
  +
  connection memory
  +
  operating system memory
  
  Because both PostgreSQL and the operating system need RAM, assigning almost all system memory to shared_buffers is usually not desirable.`,

        keyPoints: [
          "shared_buffers is only one consumer of server RAM.",
          "The operating system needs memory for filesystem caching.",
          "Query execution also consumes memory.",
          "Connections consume additional memory.",
          "Memory tuning requires considering the whole server.",
        ],

        importantTerms: [
          "Shared Memory",
          "Filesystem Cache",
          "Memory Budget",
          "RAM",
        ],

        diagram: `
  32 GB RAM
  
  ┌───────────────────────────────┐
  │ PostgreSQL shared_buffers     │
  ├───────────────────────────────┤
  │ Operating System Page Cache   │
  ├───────────────────────────────┤
  │ Query / work memory           │
  ├───────────────────────────────┤
  │ Backend Processes             │
  ├───────────────────────────────┤
  │ Operating System              │
  └───────────────────────────────┘
        `,

        commands: ["SHOW shared_buffers;"],

        warning:
          "More shared_buffers does not automatically mean better performance.",
      },

      {
        id: "5-3",
        title: "5.3. effective_cache_size",

        content: `effective_cache_size is one of the most misunderstood PostgreSQL settings.
  
  It does not allocate memory.
  
  It does not create another cache.
  
  It does not limit cache size.
  
  Instead, effective_cache_size is an estimate given to PostgreSQL's query planner.
  
  It tells the planner approximately how much filesystem and PostgreSQL cache memory may be available for database data.
  
  The planner can use this estimate when deciding whether index-based access is likely to be efficient.
  
  A larger realistic cache estimate can make repeated page accesses through indexes appear cheaper to the planner.
  
  A smaller estimate can make PostgreSQL assume more pages will require expensive reads.`,

        keyPoints: [
          "effective_cache_size does not allocate RAM.",
          "It is a planner estimate.",
          "It represents an estimate of available caching.",
          "It can influence index-vs-sequential-scan cost decisions.",
          "shared_buffers and effective_cache_size have completely different purposes.",
        ],

        importantTerms: [
          "effective_cache_size",
          "Query Planner",
          "Cost Estimate",
          "Planner Configuration",
        ],

        diagram: `
  shared_buffers
        │
        └── Actual allocated PostgreSQL cache
  
  
  effective_cache_size
        │
        └── Planner assumption only
             │
             ▼
        Cost Calculations
             │
        ┌────┴─────┐
        ▼          ▼
  Index Scan    Seq Scan
        `,

        commands: [
          "SHOW effective_cache_size;",
          "SELECT current_setting('effective_cache_size');",
        ],

        warning:
          "Do not add `effective_cache_size` to your memory-allocation calculation. PostgreSQL does not reserve that amount.",
      },

      {
        id: "5-4",
        title: "5.4. Warm Cache vs Cold Cache",

        content: `Database benchmarks often behave differently depending on whether data is already cached.
  
  A warm cache means much of the required data is already available in memory.
  
  A cold cache means required data is not already cached and more storage I/O may be necessary.
  
  Production systems usually operate somewhere between these extremes.
  
  Frequently used data may remain warm while rarely accessed data may require reads.
  
  This is why running the same query twice can produce very different timings.
  
  The second execution may benefit from:
  
  - PostgreSQL shared buffers
  - operating system page cache
  - CPU-level effects
  - previously prepared metadata
  
  A single query execution is therefore not enough for serious benchmarking.`,

        keyPoints: [
          "Warm-cache and cold-cache performance can differ greatly.",
          "Repeated queries often benefit from caching.",
          "Production workloads contain both hot and cold data.",
          "Benchmark results must include cache context.",
          "One execution is rarely enough for performance analysis.",
        ],

        importantTerms: [
          "Warm Cache",
          "Cold Cache",
          "Hot Data",
          "Cold Data",
          "Benchmark",
        ],

        diagram: `
  Cold-ish Read
  
  Query
   ↓
  Shared Buffers MISS
   ↓
  OS Cache MISS
   ↓
  SSD
   ↓
  Memory
  
  
  Later Query
  
  Query
   ↓
  Shared Buffers HIT
   ↓
  Result
        `,

        commands: [
          "EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders WHERE user_id = 1;",
          "EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders WHERE user_id = 1;",
        ],

        warning:
          "Never clear production operating-system caches simply to perform a benchmark.",
      },

      {
        id: "5-5",
        title: "5.5. Cache Mental Model",

        content: `Keep this read-path mental model:
  
  PostgreSQL first works with pages in shared_buffers.
  
  If the required page is not there, PostgreSQL obtains it through the operating system.
  
  The operating system may already have the filesystem data cached.
  
  Only when the necessary data is unavailable from memory must physical storage become involved.
  
  Therefore database performance depends on more than database configuration.
  
  RAM capacity, operating-system behavior, storage latency, workload locality, and query access patterns all matter.`,

        keyPoints: [
          "Shared buffers are the PostgreSQL cache layer.",
          "OS Page Cache is another RAM-based layer.",
          "Persistent storage is below both layers.",
          "Workload locality determines how useful caching becomes.",
          "Cache behavior must be understood before interpreting I/O metrics.",
        ],

        importantTerms: [
          "Shared Buffers",
          "OS Page Cache",
          "Storage",
          "Locality",
          "I/O",
        ],

        diagram: `
  Application
      │
      ▼
  PostgreSQL
      │
      ▼
  Shared Buffers
      │
      ▼
  OS Page Cache
      │
      ▼
  SSD / Disk
  
  
  Next:
  PostgreSQL Memory
        `,

        commands: ["SHOW shared_buffers;", "SHOW effective_cache_size;"],

        warning: null,
      },
    ],
  },

  // =========================================================
  // MODULE 6 — POSTGRESQL MEMORY
  // =========================================================
  {
    id: "doc-6",
    title: "6. PostgreSQL Memory",
    description:
      "Understand PostgreSQL's major memory areas and why work_mem, maintenance memory, connections, and concurrent query operations can consume far more memory than expected.",

    chapters: [
      {
        id: "6-1",
        title: "6.1. PostgreSQL Memory Is Not One Pool",

        content: `PostgreSQL does not have one single memory setting.
  
  Different activities use different memory areas.
  
  Important examples include:
  
  - shared_buffers
  - work_mem
  - maintenance_work_mem
  - autovacuum_work_mem
  - temp_buffers
  - wal_buffers
  
  There is also memory associated with PostgreSQL backend processes and internal execution structures.
  
  Some memory is shared globally.
  
  Other memory is allocated separately by individual sessions or query operations.
  
  Understanding this distinction is critical when estimating total PostgreSQL memory consumption.`,

        keyPoints: [
          "PostgreSQL uses multiple memory areas.",
          "Some memory is shared between backends.",
          "Some memory is allocated per operation or session.",
          "Total memory usage cannot be determined from shared_buffers alone.",
        ],

        importantTerms: [
          "Shared Memory",
          "Local Memory",
          "Memory Context",
          "Backend Process",
        ],

        diagram: `
  PostgreSQL Memory
  
  ├── Shared
  │   ├── shared_buffers
  │   └── wal_buffers
  │
  └── Backend / Operation Memory
      ├── work_mem
      ├── temp_buffers
      ├── query structures
      └── connection overhead
        `,

        commands: [
          "SHOW shared_buffers;",
          "SHOW work_mem;",
          "SHOW maintenance_work_mem;",
          "SHOW temp_buffers;",
          "SHOW wal_buffers;",
        ],

        warning: null,
      },

      {
        id: "6-2",
        title: "6.2. work_mem",

        content: `work_mem controls memory PostgreSQL may use for certain query execution operations before spilling additional work to temporary files.
  
  Examples include:
  
  - sorts
  - hash joins
  - hash aggregation
  - some other executor operations
  
  A very important detail is:
  
  work_mem is not simply allocated once per connection.
  
  One query can contain multiple operations that each need memory.
  
  Multiple queries can run concurrently inside many connections.
  
  Therefore total possible memory use can become much larger than:
  
  work_mem × connections.`,

        keyPoints: [
          "work_mem is used by query operations.",
          "Sort and hash operations are major consumers.",
          "One query can use work_mem multiple times.",
          "Many concurrent queries multiply memory pressure.",
          "Setting work_mem globally too high can cause memory exhaustion.",
        ],

        importantTerms: [
          "work_mem",
          "Sort",
          "Hash Join",
          "Hash Aggregate",
          "Temporary File",
        ],

        diagram: `
  One Query
  
  Hash Join       → work memory
  Sort            → work memory
  Hash Aggregate  → work memory
  
                   ×
  
  Many Concurrent Queries
  
                   =
  
  Potentially Large RAM Usage
        `,

        commands: ["SHOW work_mem;"],

        warning:
          "Do not calculate PostgreSQL memory as `max_connections × work_mem` only. A query may have multiple memory-consuming plan nodes.",
      },

      {
        id: "6-3",
        title: "6.3. Memory Spill to Disk",

        content: `When an operation cannot complete within its available working memory, PostgreSQL may use temporary disk files.
  
  For example, a large sort might execute entirely in memory when enough memory is available.
  
  If it becomes too large, PostgreSQL may switch to an external disk-based sort.
  
  EXPLAIN ANALYZE can expose this.
  
  You might see:
  
  Sort Method: quicksort
  Memory: ...
  
  or:
  
  Sort Method: external merge
  Disk: ...
  
  Disk spilling is not automatically a problem, but heavy or frequent temporary-file usage can significantly increase query latency.`,

        keyPoints: [
          "Large operations can spill to temporary disk files.",
          "Sorts are a common example.",
          "Disk spills are slower than in-memory work.",
          "EXPLAIN ANALYZE can reveal sort behavior.",
          "Temporary-file metrics are useful for diagnosing memory pressure.",
        ],

        importantTerms: [
          "Memory Spill",
          "Temporary File",
          "External Merge",
          "Quicksort",
        ],

        diagram: `
  Sort
  
  Small enough
     │
     ▼
  RAM
     │
     ▼
  Quicksort
  
  
  Too large
     │
     ▼
  RAM + Temp Files
     │
     ▼
  External Merge
        `,

        commands: [
          "EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders ORDER BY total;",
          "SELECT temp_files, temp_bytes FROM pg_stat_database WHERE datname = current_database();",
        ],

        warning:
          "Increasing work_mem blindly may solve one query while creating server-wide memory pressure under concurrency.",
      },

      {
        id: "6-4",
        title: "6.4. maintenance_work_mem",

        content: `maintenance_work_mem is used for maintenance operations rather than normal query execution.
  
  Examples include operations such as:
  
  - VACUUM
  - CREATE INDEX
  - some ALTER TABLE operations
  
  These operations may benefit from more memory than ordinary query operators.
  
  Because maintenance_work_mem has different usage characteristics from work_mem, PostgreSQL provides a separate setting.`,

        keyPoints: [
          "maintenance_work_mem is for maintenance operations.",
          "It is different from work_mem.",
          "Index creation and VACUUM can use maintenance memory.",
          "Maintenance operations may need significantly more memory than normal queries.",
        ],

        importantTerms: [
          "maintenance_work_mem",
          "VACUUM",
          "CREATE INDEX",
          "Maintenance",
        ],

        diagram: `
  Normal Query
     │
     └── work_mem
  
  
  Maintenance Operation
     │
     └── maintenance_work_mem
        `,

        commands: ["SHOW maintenance_work_mem;"],

        warning: null,
      },

      {
        id: "6-5",
        title: "6.5. temp_buffers and wal_buffers",

        content: `temp_buffers controls session-local buffers used for temporary tables.
  
  These buffers are not shared across all PostgreSQL sessions.
  
  wal_buffers is memory used for WAL records before they are written to WAL storage.
  
  These settings serve very different purposes.
  
  temp_buffers:
  temporary table data for a session
  
  wal_buffers:
  temporary in-memory staging for Write-Ahead Log records
  
  Later modules will explore WAL in depth.`,

        keyPoints: [
          "temp_buffers is associated with temporary relations.",
          "temp buffers are session-local.",
          "wal_buffers stores WAL data before WAL writes.",
          "These settings should not be confused with shared_buffers.",
        ],

        importantTerms: [
          "temp_buffers",
          "wal_buffers",
          "Temporary Table",
          "WAL",
        ],

        diagram: `
  shared_buffers
      → normal relation pages
  
  temp_buffers
      → temporary relation pages
  
  wal_buffers
      → WAL records
        `,

        commands: ["SHOW temp_buffers;", "SHOW wal_buffers;"],

        warning: null,
      },

      {
        id: "6-6",
        title: "6.6. Connection Memory",

        content: `PostgreSQL traditionally uses a process-per-connection architecture.
  
  Each client connection is normally served by a PostgreSQL backend process.
  
  Those backends require memory.
  
  If hundreds or thousands of application connections are opened, connection overhead and concurrent query memory can become significant.
  
  This is one reason production applications commonly use connection pools.
  
  Connection pooling becomes especially important when many application instances connect to the same PostgreSQL server.`,

        keyPoints: [
          "PostgreSQL normally has a backend process per connection.",
          "Connections consume resources.",
          "Large connection counts can create memory and scheduling pressure.",
          "Connection pools reduce the number of PostgreSQL backend connections.",
        ],

        importantTerms: [
          "Backend Process",
          "Connection",
          "Connection Pool",
          "max_connections",
        ],

        diagram: `
  Without Pooling
  
  500 Clients
      │
      ▼
  500 PostgreSQL Backends
  
  
  With Pooling
  
  500 Clients
      │
      ▼
  Connection Pool
      │
      ▼
  50 PostgreSQL Backends
        `,

        commands: [
          "SHOW max_connections;",
          "SELECT COUNT(*) FROM pg_stat_activity;",
        ],

        warning:
          "Increasing max_connections is not a substitute for designing proper connection pooling.",
      },

      {
        id: "6-7",
        title: "6.7. Memory Mental Model",

        content: `When sizing PostgreSQL memory, think in categories rather than one number.
  
  Shared memory:
  
  shared_buffers
  wal_buffers
  
  Potentially repeated execution memory:
  
  work_mem
  
  Maintenance memory:
  
  maintenance_work_mem
  autovacuum_work_mem
  
  Session-specific memory:
  
  temp_buffers
  backend overhead
  
  Then remember that the operating system also needs memory for:
  
  filesystem cache
  kernel
  services
  monitoring agents
  other processes
  
  PostgreSQL memory configuration must therefore be treated as a concurrency problem, not just a collection of individual settings.`,

        keyPoints: [
          "Memory settings have different scopes.",
          "Concurrency determines real memory pressure.",
          "OS memory requirements must remain available.",
          "Per-operation memory settings can multiply.",
          "Connection pooling is part of memory management.",
        ],

        importantTerms: [
          "Memory Budget",
          "Concurrency",
          "work_mem",
          "shared_buffers",
          "Connection Pool",
        ],

        diagram: `
  Total RAM
     │
     ├── shared_buffers
     ├── OS cache
     ├── work_mem × operations
     ├── maintenance
     ├── connections
     └── operating system
  
  
  Next:
  MVCC
        `,

        commands: [
          "SHOW shared_buffers;",
          "SHOW work_mem;",
          "SHOW maintenance_work_mem;",
          "SHOW max_connections;",
        ],

        warning:
          "A memory configuration that works with 10 active queries may fail badly with 500 concurrent queries.",
      },
    ],
  },

  // =========================================================
  // MODULE 7 — MVCC
  // =========================================================
  {
    id: "doc-7",
    title: "7. MVCC",
    description:
      "Understand PostgreSQL's most important concurrency mechanism: how multiple row versions allow readers and writers to work concurrently without constantly blocking each other.",

    chapters: [
      {
        id: "7-1",
        title: "7.1. What is MVCC?",

        content: `MVCC stands for Multi-Version Concurrency Control.
  
  It is one of the core mechanisms behind PostgreSQL transaction behavior.
  
  Instead of having only one physical version of a row at all times, PostgreSQL can keep multiple row versions.
  
  Different transactions can then see different versions depending on their transaction snapshot.
  
  This allows PostgreSQL to provide strong transactional behavior while reducing unnecessary blocking between readers and writers.
  
  For example:
  
  Transaction A may still see the old version of a row.
  
  Transaction B may create a newer version.
  
  Both physical versions can temporarily exist at the same time.`,

        keyPoints: [
          "MVCC means Multi-Version Concurrency Control.",
          "PostgreSQL can keep multiple physical versions of a logical row.",
          "Different transactions can see different row versions.",
          "MVCC reduces reader/writer blocking.",
          "Snapshots determine which versions are visible.",
        ],

        importantTerms: [
          "MVCC",
          "Row Version",
          "Snapshot",
          "Transaction",
          "Visibility",
        ],

        diagram: `
  Logical User
  
  id = 1
  
  
  Physical Versions
  
  Version A
  age = 30
  
  Version B
  age = 31
  
  
  Transaction A → may see Version A
  Transaction B → may see Version B
        `,

        commands: ["SELECT ctid, xmin, xmax, * FROM users WHERE id = 1;"],

        warning: null,
      },

      {
        id: "7-2",
        title: "7.2. UPDATE Usually Creates a New Version",

        content: `A PostgreSQL UPDATE normally does not simply overwrite the existing heap tuple in place.
  
  Instead, PostgreSQL generally creates a new tuple version.
  
  The old version remains temporarily because another transaction may still need to see it.
  
  Conceptually:
  
  Before:
  
  Alice age = 30
  
  After UPDATE:
  
  Old version:
  Alice age = 30
  
  New version:
  Alice age = 31
  
  Eventually, when PostgreSQL knows the old version is no longer needed by any relevant transaction, VACUUM can make that space reusable.`,

        keyPoints: [
          "UPDATE normally creates a new tuple version.",
          "The old tuple may remain temporarily.",
          "Older transactions may still need the old version.",
          "Old versions eventually become removable.",
          "VACUUM is responsible for cleanup.",
        ],

        importantTerms: [
          "UPDATE",
          "Old Version",
          "New Version",
          "Dead Tuple",
          "VACUUM",
        ],

        diagram: `
  Before UPDATE
  
  Page
  └── Alice age=30
  
  
  UPDATE age=31
  
  Page
  ├── Alice age=30  ← old version
  └── Alice age=31  ← new version
  
  
  Later
  
  VACUUM
     │
     ▼
  Old version space reusable
        `,

        commands: [
          "SELECT ctid, xmin, xmax, id, age FROM users WHERE id = 1;",
          "UPDATE users SET age = age + 1 WHERE id = 1;",
          "SELECT ctid, xmin, xmax, id, age FROM users WHERE id = 1;",
        ],

        warning:
          "Repeated UPDATE operations can generate many old tuple versions if VACUUM cannot clean them.",
      },

      {
        id: "7-3",
        title: "7.3. DELETE and MVCC",

        content: `DELETE also participates in MVCC.
  
  When a row is deleted, PostgreSQL cannot always immediately erase its tuple from the heap.
  
  Another transaction may still have a snapshot in which that row should exist.
  
  The tuple is therefore marked so that newer transactions treat it as deleted while older snapshots may still see it.
  
  Later, VACUUM can determine when the tuple is no longer visible to any relevant transaction and make its space reusable.`,

        keyPoints: [
          "DELETE does not necessarily immediately remove physical tuple storage.",
          "Older snapshots may still need deleted rows.",
          "The tuple can become dead after it is no longer visible.",
          "VACUUM eventually cleans reusable tuple space.",
        ],

        importantTerms: ["DELETE", "Snapshot", "Dead Tuple", "Visibility"],

        diagram: `
  Transaction A starts
          │
          ▼
  Sees Alice
  
  
  Transaction B
  DELETE Alice
  COMMIT
  
  
  Transaction A
  may still see Alice
  depending on snapshot
  
  
  Later
  VACUUM
          │
          ▼
  space reusable
        `,

        commands: [],

        warning: null,
      },

      {
        id: "7-4",
        title: "7.4. Readers and Writers",

        content: `MVCC allows many ordinary reads and writes to proceed concurrently.
  
  A SELECT usually does not need to block simply because another transaction is updating the same logical row.
  
  Instead, PostgreSQL determines which row version is visible to the SELECT.
  
  Likewise, an UPDATE can create a new row version while existing snapshots continue using an older version.
  
  This does not mean PostgreSQL has no locks.
  
  Writers can still conflict with other writers.
  
  Explicit row locks also exist.
  
  MVCC primarily reduces unnecessary contention between readers and writers.`,

        keyPoints: [
          "Readers usually do not block ordinary writers.",
          "Writers usually do not block ordinary readers.",
          "Writers can still block conflicting writers.",
          "Locks still exist alongside MVCC.",
          "MVCC and locking solve different concurrency problems.",
        ],

        importantTerms: [
          "Reader",
          "Writer",
          "Row Lock",
          "Concurrency",
          "Snapshot",
        ],

        diagram: `
  Reader
     │
     └── sees visible row version
  
  
  Writer
     │
     └── creates/modifies row version
  
  
  MVCC
     │
     └── coordinates visibility
  
  
  Locks
     │
     └── coordinate conflicting writes
        `,

        commands: [],

        warning:
          "MVCC does not mean queries can never block. Locks, schema operations, conflicting writes, and other conditions can still cause waits.",
      },

      {
        id: "7-5",
        title: "7.5. Snapshots",

        content: `A snapshot describes which transaction effects are visible to a query.
  
  PostgreSQL uses snapshots to determine which tuple versions a query should see.
  
  This produces consistent transactional behavior.
  
  For example, depending on isolation level, PostgreSQL may take snapshots at different times.
  
  Under the common READ COMMITTED isolation level, each statement sees data committed before that statement began, subject to PostgreSQL's visibility rules.
  
  Under REPEATABLE READ, the transaction works from a stable transaction-level view of committed data.
  
  Snapshots are one of the reasons old tuple versions sometimes must remain in the database even after newer versions exist.`,

        keyPoints: [
          "Snapshots determine row-version visibility.",
          "Snapshots are central to MVCC.",
          "Isolation level affects snapshot behavior.",
          "Old snapshots can require old tuple versions to remain.",
        ],

        importantTerms: [
          "Snapshot",
          "READ COMMITTED",
          "REPEATABLE READ",
          "Isolation Level",
        ],

        diagram: `
  Timeline
  
  T1: Transaction A snapshot
         │
         ▼
      Version 1 visible
  
  T2: Transaction B UPDATE
         │
         ▼
      Version 2 created
  
  Transaction A
  may continue seeing
  Version 1
        `,

        commands: ["SHOW transaction_isolation;"],

        warning: null,
      },

      {
        id: "7-6",
        title: "7.6. Why Long Transactions Are Dangerous",

        content: `MVCC depends on retaining row versions that might still be visible to active transactions.
  
  A very old transaction can therefore prevent PostgreSQL from cleaning row versions that would otherwise be removable.
  
  Imagine:
  
  1. Transaction A begins.
  2. Thousands of rows are updated by other transactions.
  3. Transaction A remains open for hours.
  4. Old tuple versions may still need to be preserved for Transaction A's snapshot.
  5. VACUUM cannot remove everything it normally could.
  
  This can contribute to:
  
  - table bloat
  - index bloat
  - increased storage
  - slower scans
  - transaction ID management problems
  
  Long-running and idle-in-transaction sessions should therefore be monitored in production.`,

        keyPoints: [
          "Old transactions can hold back cleanup.",
          "Old tuple versions may remain necessary.",
          "Long transactions can contribute to bloat.",
          "Idle-in-transaction sessions are especially dangerous.",
          "Transaction age should be monitored.",
        ],

        importantTerms: [
          "Long Transaction",
          "Idle in Transaction",
          "Old Snapshot",
          "Bloat",
        ],

        diagram: `
  Old Transaction
        │
        ▼
  Old Snapshot
        │
        ▼
  Old Versions Must Remain
        │
        ▼
  VACUUM Cleanup Limited
        │
        ▼
  More Dead Data / Bloat
        `,

        commands: [
          "SELECT pid, state, xact_start, query FROM pg_stat_activity WHERE xact_start IS NOT NULL ORDER BY xact_start;",
        ],

        warning:
          "Leaving transactions open while an application waits for user input or external network calls can cause serious operational problems.",
      },
    ],
  },

  // =========================================================
  // MODULE 8 — TRANSACTION VISIBILITY
  // =========================================================
  {
    id: "doc-8",
    title: "8. xmin, xmax & Transaction Visibility",
    description:
      "Understand the system metadata PostgreSQL uses to track row versions and build a practical mental model for how tuple visibility works.",

    chapters: [
      {
        id: "8-1",
        title: "8.1. xmin",

        content: `Heap tuples contain transaction visibility metadata.
  
  One important system column is xmin.
  
  xmin identifies the transaction that created the current tuple version.
  
  This could happen because of:
  
  - INSERT
  - UPDATE creating a new row version
  
  When PostgreSQL evaluates visibility, it considers information such as the creating transaction and the current snapshot.
  
  You can inspect xmin directly while learning PostgreSQL internals.`,

        keyPoints: [
          "xmin identifies the transaction that created a tuple version.",
          "INSERT creates tuples with xmin.",
          "UPDATE creates a new tuple version with its own xmin.",
          "xmin participates in visibility decisions.",
        ],

        importantTerms: ["xmin", "Transaction ID", "Tuple Version"],

        diagram: `
  Tuple
  
  ┌───────────────────────┐
  │ xmin = Transaction 500│
  ├───────────────────────┤
  │ id = 1                │
  │ name = Alice          │
  └───────────────────────┘
  
  Created by transaction 500
        `,

        commands: ["SELECT xmin, id, full_name FROM users;"],

        warning:
          "xmin is an internal system column. Do not use it as your application's permanent identifier.",
      },

      {
        id: "8-2",
        title: "8.2. xmax",

        content: `Another important tuple metadata field is xmax.
  
  In simplified terms, xmax can identify a transaction associated with deleting a tuple version or replacing it as part of an update.
  
  An xmax value by itself does not mean that the tuple is automatically invisible.
  
  PostgreSQL must also consider transaction status, snapshots, tuple flags, and other MVCC information.
  
  Therefore xmin and xmax are best understood as inputs into PostgreSQL's visibility machinery rather than simple created_at and deleted_at fields.`,

        keyPoints: [
          "xmax participates in recording tuple deletion or replacement state.",
          "UPDATE affects the old tuple version as well as creating a new one.",
          "xmax alone is not enough to fully determine visibility.",
          "Visibility rules include transaction state and snapshot information.",
        ],

        importantTerms: ["xmax", "Tuple Visibility", "Transaction Status"],

        diagram: `
  Old Tuple
  
  xmin = 500
  xmax = 600
  
          │
          │ Transaction 600
          │ replaced/deleted version
          ▼
  
  New Tuple
  
  xmin = 600
  xmax = ...
        `,

        commands: ["SELECT ctid, xmin, xmax, id, full_name FROM users;"],

        warning:
          "Do not interpret every nonzero-looking xmax using a simplistic rule. PostgreSQL tuple visibility contains additional state and locking information.",
      },

      {
        id: "8-3",
        title: "8.3. Observe an UPDATE",

        content: `You can observe MVCC by inspecting a row before and after an UPDATE.
  
  Start with:
  
  SELECT ctid, xmin, xmax, id, age
  FROM users
  WHERE id = 1;
  
  Then update the row.
  
  After the update, inspect it again.
  
  You may observe:
  
  - a new xmin
  - a different ctid
  - a new tuple version
  
  The exact physical location depends on available page space and PostgreSQL's update strategy.
  
  Later we will see that HOT updates can keep related row versions on the same heap page under suitable conditions.`,

        keyPoints: [
          "UPDATE creates a new visible row version.",
          "xmin can change.",
          "ctid can change.",
          "Physical behavior depends on available page space and indexes.",
        ],

        importantTerms: ["ctid", "xmin", "UPDATE", "Row Version"],

        diagram: `
  Before
  
  ctid = (0,1)
  xmin = 500
  age  = 30
  
  
  UPDATE
  
  
  After
  
  ctid = (0,5)
  xmin = 600
  age  = 31
        `,

        commands: [
          "SELECT ctid, xmin, xmax, id, age FROM users WHERE id = 1;",
          "UPDATE users SET age = age + 1 WHERE id = 1;",
          "SELECT ctid, xmin, xmax, id, age FROM users WHERE id = 1;",
        ],

        warning:
          "Exact CTID values and transaction IDs will vary between environments.",
      },

      {
        id: "8-4",
        title: "8.4. Transaction IDs",

        content: `PostgreSQL transactions receive transaction identifiers when needed.
  
  These identifiers allow PostgreSQL to reason about which transactions created or invalidated tuple versions.
  
  Transaction IDs are deeply connected to:
  
  - MVCC
  - snapshots
  - VACUUM
  - freezing
  - transaction ID wraparound
  
  PostgreSQL's internal transaction-ID system is finite, so old tuple metadata eventually needs to be frozen.
  
  This will become important in the VACUUM module.`,

        keyPoints: [
          "Transaction IDs support MVCC visibility.",
          "Tuple metadata references transaction IDs.",
          "Transaction IDs are finite.",
          "VACUUM freezing prevents wraparound problems.",
        ],

        importantTerms: ["Transaction ID", "XID", "Freeze", "Wraparound"],

        diagram: `
  Transaction 100
  Transaction 101
  Transaction 102
  Transaction 103
        │
        ▼
  Tuple Visibility History
  
  
  Finite transaction ID space
        │
        ▼
  Old tuples eventually frozen
        `,

        commands: ["SELECT pg_current_xact_id();"],

        warning:
          "Transaction IDs are database-internal concurrency metadata, not business transaction identifiers.",
      },

      {
        id: "8-5",
        title: "8.5. Visibility Mental Model",

        content: `A simplified visibility decision looks like this:
  
  PostgreSQL finds a tuple.
  
  It checks information about:
  
  - which transaction created it
  - whether that transaction committed
  - whether another transaction invalidated the version
  - whether that transaction committed
  - the current query's snapshot
  - additional tuple state
  
  The result is:
  
  visible
  or
  not visible
  
  The real implementation is more sophisticated, but this mental model is enough to understand why two transactions can query the same logical row and receive different versions.`,

        keyPoints: [
          "Visibility is determined per tuple version.",
          "Creating transaction status matters.",
          "Deleting/replacing transaction state matters.",
          "The current snapshot matters.",
          "Different snapshots can see different versions.",
        ],

        importantTerms: [
          "Visibility",
          "Snapshot",
          "Committed",
          "Tuple Version",
        ],

        diagram: `
  Tuple
   │
   ├── xmin
   ├── xmax
   ├── transaction status
   └── tuple flags
         │
         ▼
  Current Snapshot
         │
         ▼
  Visibility Check
     │          │
     ▼          ▼
  VISIBLE    HIDDEN
        `,

        commands: ["SELECT ctid, xmin, xmax, * FROM users LIMIT 10;"],

        warning:
          "This is intentionally a simplified model. PostgreSQL's actual visibility logic includes additional transaction and tuple state.",
      },
    ],
  },

  // =========================================================
  // MODULE 9 — HOT UPDATES
  // =========================================================
  {
    id: "doc-9",
    title: "9. HOT Updates",
    description:
      "Understand Heap-Only Tuple updates, why PostgreSQL sometimes avoids creating unnecessary index entries, and how page space and indexed columns influence update efficiency.",

    chapters: [
      {
        id: "9-1",
        title: "9.1. The Cost of a Normal UPDATE",

        content: `Updating a PostgreSQL row can affect more than the heap.
  
  Suppose a table has several indexes.
  
  When a new row version is created, PostgreSQL may also need to create corresponding entries in indexes.
  
  This creates additional:
  
  - CPU work
  - WAL
  - index writes
  - storage growth
  
  For frequently updated tables, avoiding unnecessary index maintenance can significantly improve performance.
  
  PostgreSQL has an optimization for suitable updates called HOT.`,

        keyPoints: [
          "UPDATE can affect both heap and indexes.",
          "Index maintenance adds write cost.",
          "More indexes make writes more expensive.",
          "PostgreSQL can optimize some updates using HOT.",
        ],

        importantTerms: ["Heap", "Index", "UPDATE", "Index Maintenance", "HOT"],

        diagram: `
  Normal UPDATE
  
  Old Heap Tuple
        │
        ▼
  New Heap Tuple
        │
        ├── Index A update
        ├── Index B update
        └── Index C update
        `,

        commands: [],

        warning:
          "Indexes improve many reads but every additional index may increase write cost.",
      },

      {
        id: "9-2",
        title: "9.2. What is HOT?",

        content: `HOT stands for Heap-Only Tuple.
  
  A HOT update is an optimization where PostgreSQL can create a new row version without requiring new entries in applicable indexes.
  
  Conceptually, existing index entries can lead PostgreSQL to the root heap tuple, from which PostgreSQL follows a HOT chain to the currently visible version.
  
  This reduces index maintenance and can reduce index bloat.`,

        keyPoints: [
          "HOT means Heap-Only Tuple.",
          "HOT can avoid creating new index entries.",
          "Row versions can form a HOT chain.",
          "HOT reduces update overhead.",
          "HOT can reduce index bloat.",
        ],

        importantTerms: ["HOT", "Heap-Only Tuple", "HOT Chain", "Index Bloat"],

        diagram: `
  Index
    │
    ▼
  Heap Tuple V1
    │
    ▼
  Heap Tuple V2
    │
    ▼
  Heap Tuple V3
  
  HOT Chain
        `,

        commands: [],

        warning: null,
      },

      {
        id: "9-3",
        title: "9.3. When HOT Can Happen",

        content: `A HOT update requires conditions that allow PostgreSQL to avoid maintaining affected indexes.
  
  A useful mental model is:
  
  1. The changed values must not require new entries in relevant indexes.
  2. PostgreSQL must be able to place the new tuple version on the same heap page.
  
  If the page has insufficient free space, PostgreSQL may need to place the new version elsewhere.
  
  In that case, a HOT chain cannot be used in the same way.
  
  This is why page free space and table fillfactor can influence HOT update frequency.`,

        keyPoints: [
          "HOT depends on index requirements.",
          "The new tuple needs suitable space on the same heap page.",
          "Page free space matters.",
          "Changing indexed data often prevents the normal HOT optimization.",
        ],

        importantTerms: [
          "Indexed Column",
          "Same Page",
          "Free Space",
          "Fillfactor",
        ],

        diagram: `
  Page 10
  
  Tuple V1
     │
     └── UPDATE non-indexed value
             │
             ▼
         Tuple V2
  
  Same Page
     │
     ▼
  HOT possible
        `,

        commands: [],

        warning:
          "Whether a specific update becomes HOT is ultimately determined by PostgreSQL's internal conditions; do not assume every non-indexed-column update will be HOT.",
      },

      {
        id: "9-4",
        title: "9.4. Fillfactor",

        content: `fillfactor controls how full PostgreSQL tries to pack heap pages during certain operations.
  
  For tables, the default is typically designed to use most available page space.
  
  For update-heavy workloads, leaving additional free space can make it easier for new row versions to remain on the same page.
  
  For example, a lower fillfactor can intentionally leave room for future updates.
  
  The tradeoff is:
  
  More free page space
  =
  larger table footprint
  
  but potentially:
  
  More same-page updates
  =
  more HOT opportunities.`,

        keyPoints: [
          "fillfactor influences how much page space is initially left free.",
          "Lower fillfactor can help update-heavy workloads.",
          "More free space can improve same-page update opportunities.",
          "Lower fillfactor increases storage consumption.",
        ],

        importantTerms: [
          "fillfactor",
          "Page Free Space",
          "HOT Update",
          "Storage Tradeoff",
        ],

        diagram: `
  fillfactor 100-ish concept
  
  ████████████████
  Very little free space
  
  
  Lower fillfactor concept
  
  ████████████░░░░
              ↑
        space for updates
        `,

        commands: ["ALTER TABLE users SET (fillfactor = 80);"],

        warning:
          "Do not lower fillfactor blindly. Read-heavy or rarely updated tables may gain little while consuming more storage.",
      },

      {
        id: "9-5",
        title: "9.5. Observe HOT Update Statistics",

        content: `PostgreSQL statistics can help you observe update behavior.
  
  pg_stat_user_tables exposes counters including:
  
  n_tup_upd
  number of rows updated
  
  n_tup_hot_upd
  number of HOT-updated rows
  
  These statistics can help you understand whether an update-heavy table is benefiting from HOT updates.
  
  The ratio should be interpreted together with workload characteristics and index design.`,

        keyPoints: [
          "pg_stat_user_tables exposes update statistics.",
          "n_tup_upd counts updates.",
          "n_tup_hot_upd counts HOT updates.",
          "HOT statistics can help evaluate update-heavy tables.",
        ],

        importantTerms: ["n_tup_upd", "n_tup_hot_upd", "pg_stat_user_tables"],

        diagram: `
  Updates:      100,000
  HOT Updates:  80,000
  
          │
          ▼
  
  Most updates avoided
  normal index maintenance
        `,

        commands: [
          "SELECT relname, n_tup_upd, n_tup_hot_upd FROM pg_stat_user_tables ORDER BY n_tup_upd DESC;",
        ],

        warning:
          "Statistics are cumulative counters and may have been collected over a long period. Always consider when statistics were reset.",
      },
    ],
  },

  // =========================================================
  // MODULE 10 — DEAD TUPLES
  // =========================================================
  {
    id: "doc-10",
    title: "10. Dead Tuples",
    description:
      "Understand how PostgreSQL MVCC creates obsolete row versions, why they remain temporarily, how they affect storage and scans, and why VACUUM exists.",

    chapters: [
      {
        id: "10-1",
        title: "10.1. What is a Dead Tuple?",

        content: `Because PostgreSQL uses MVCC, UPDATE and DELETE can leave old tuple versions behind.
  
  Eventually, PostgreSQL may determine that a tuple version is no longer visible to any transaction that could legally need it.
  
  Such obsolete row versions are commonly referred to as dead tuples.
  
  They are no longer useful as visible application data, but their physical space may still exist inside heap pages until PostgreSQL performs appropriate cleanup.`,

        keyPoints: [
          "MVCC creates multiple row versions.",
          "Old versions can eventually become dead tuples.",
          "Dead tuples are no longer needed by active visibility rules.",
          "Their physical storage does not instantly disappear.",
        ],

        importantTerms: ["Dead Tuple", "MVCC", "Old Row Version", "Heap"],

        diagram: `
  Heap Page
  
  Tuple V1   DEAD
  Tuple V2   DEAD
  Tuple V3   LIVE
  Tuple B    LIVE
  Tuple C    LIVE
        `,

        commands: [],

        warning: null,
      },

      {
        id: "10-2",
        title: "10.2. UPDATE Creates Old Versions",

        content: `Consider repeatedly updating the same user.
  
  Initial:
  
  age = 30
  
  Update:
  
  age = 31
  
  Update:
  
  age = 32
  
  Update:
  
  age = 33
  
  PostgreSQL may create several physical tuple versions during this process.
  
  Only the version visible under the current MVCC rules represents the current logical row.
  
  Older versions eventually become dead and eligible for cleanup.
  
  A frequently updated table can therefore generate dead tuples very quickly.`,

        keyPoints: [
          "Repeated updates generate multiple tuple versions.",
          "Older versions eventually become dead.",
          "High-update workloads can generate dead tuples rapidly.",
          "Dead tuple generation is normal PostgreSQL behavior.",
        ],

        importantTerms: ["UPDATE", "Row Version", "Dead Tuple"],

        diagram: `
  Logical User
  
  age = 33
  
  
  Heap History
  
  age=30 → dead
  age=31 → dead
  age=32 → dead
  age=33 → live
        `,

        commands: ["UPDATE users SET age = age + 1 WHERE id = 1;"],

        warning:
          "Dead tuples are not automatically evidence of a problem. PostgreSQL is designed to create and clean them.",
      },

      {
        id: "10-3",
        title: "10.3. DELETE Creates Dead Data",

        content: `DELETE can also produce tuple versions that later become dead.
  
  When DELETE commits, newer transactions should no longer see the row.
  
  However, PostgreSQL may need to retain the physical tuple temporarily because older transactions may still have snapshots where that row is visible.
  
  When no relevant snapshot needs it anymore, the tuple becomes removable by VACUUM.`,

        keyPoints: [
          "DELETE does not instantly erase tuple bytes.",
          "Old snapshots may temporarily require deleted rows.",
          "Deleted tuples eventually become removable.",
          "VACUUM performs cleanup.",
        ],

        importantTerms: ["DELETE", "Snapshot", "Dead Tuple", "VACUUM"],

        diagram: `
  DELETE
    │
    ▼
  Tuple marked by MVCC metadata
    │
    ▼
  Old snapshot still needs it?
    │
   ┌┴───────────┐
   │YES         │NO
   ▼            ▼
  Keep       Eligible
             for cleanup
        `,

        commands: [],

        warning: null,
      },

      {
        id: "10-4",
        title: "10.4. Dead Tuples and Table Size",

        content: `Dead tuples consume space inside heap pages until cleanup makes that space reusable.
  
  This does not necessarily mean the table file immediately grows for every update.
  
  PostgreSQL can reuse free space inside existing pages.
  
  However, if dead tuples accumulate faster than cleanup and reuse can occur, table storage can grow significantly.
  
  This contributes to what is commonly called table bloat.
  
  Bloat will be covered in a dedicated module later.`,

        keyPoints: [
          "Dead tuples occupy physical page space.",
          "VACUUM can make dead space reusable.",
          "Reusable space usually remains inside the relation file.",
          "Excessive dead data can contribute to bloat.",
        ],

        importantTerms: [
          "Dead Space",
          "Reusable Space",
          "Table Bloat",
          "Heap Page",
        ],

        diagram: `
  Page
  
  ████ Live
  ████ Dead
  ████ Dead
  ████ Live
  
  VACUUM
  
  ████ Live
  ░░░░ Reusable
  ░░░░ Reusable
  ████ Live
        `,

        commands: ["SELECT pg_size_pretty(pg_relation_size('users'));"],

        warning:
          "Regular VACUUM usually makes internal space reusable; it normally does not shrink the relation file back to the operating system.",
      },

      {
        id: "10-5",
        title: "10.5. Inspect Dead Tuple Estimates",

        content: `pg_stat_user_tables provides useful table-level statistics.
  
  Two important columns are:
  
  n_live_tup
  estimated number of live tuples
  
  n_dead_tup
  estimated number of dead tuples
  
  These values are estimates rather than an exact physical inventory.
  
  They are useful for identifying tables where dead-row accumulation may deserve investigation.`,

        keyPoints: [
          "n_live_tup estimates live rows.",
          "n_dead_tup estimates dead rows.",
          "These values are statistics, not exact counts.",
          "Large dead-tuple counts can indicate cleanup pressure.",
        ],

        importantTerms: ["n_live_tup", "n_dead_tup", "pg_stat_user_tables"],

        diagram: `
  pg_stat_user_tables
  
  users
  ├── n_live_tup = 1,000,000
  └── n_dead_tup =   250,000
  
  Potential cleanup/bloat signal
        `,

        commands: [
          "SELECT relname, n_live_tup, n_dead_tup FROM pg_stat_user_tables ORDER BY n_dead_tup DESC;",
        ],

        warning:
          "n_dead_tup is an estimate. Do not treat it as an exact count of physically dead heap tuples.",
      },

      {
        id: "10-6",
        title: "10.6. Why Dead Tuples Matter",

        content: `A moderate amount of dead tuples is normal.
  
  Problems arise when dead tuples accumulate excessively.
  
  Potential effects include:
  
  - larger heap storage
  - more pages to scan
  - more cache consumption
  - additional I/O
  - index bloat
  - slower queries
  - longer maintenance operations
  
  The solution is not to avoid MVCC.
  
  MVCC is fundamental to PostgreSQL.
  
  The solution is to ensure PostgreSQL can clean obsolete versions effectively.
  
  That leads directly to VACUUM.`,

        keyPoints: [
          "Dead tuples are normal in PostgreSQL.",
          "Excessive accumulation can hurt performance.",
          "Dead tuples can increase table and index pressure.",
          "VACUUM exists to manage obsolete tuple versions.",
        ],

        importantTerms: ["Dead Tuple", "Bloat", "VACUUM", "Autovacuum"],

        diagram: `
  UPDATE / DELETE
        │
        ▼
  Old Tuple Versions
        │
        ▼
  Dead Tuples
        │
        ├── storage
        ├── cache pressure
        ├── scan overhead
        └── bloat
        │
        ▼
  VACUUM
  
  
  Next Module:
  VACUUM
        `,

        commands: [
          "SELECT relname, n_live_tup, n_dead_tup FROM pg_stat_user_tables;",
        ],

        warning:
          "Do not disable autovacuum to avoid its resource usage. Doing so can create much more serious PostgreSQL problems.",
      },
    ],
  },

  // =========================================================
  // MODULE 11 — VACUUM
  // =========================================================
  {
    id: "doc-11",
    title: "11. VACUUM",
    description:
      "Understand why PostgreSQL needs VACUUM, how it reclaims reusable tuple space, how visibility maps are updated, and why regular VACUUM is fundamentally different from VACUUM FULL.",

    chapters: [
      {
        id: "11-1",
        title: "11.1. Why VACUUM Exists",

        content: `PostgreSQL uses MVCC.
  
  Because UPDATE and DELETE create obsolete tuple versions, PostgreSQL eventually needs to clean up row versions that are no longer visible to any relevant transaction.
  
  VACUUM performs this cleanup.
  
  A normal VACUUM does not usually shrink the physical table file.
  
  Instead, it marks space occupied by dead tuples as reusable inside the relation.
  
  Future INSERT or UPDATE operations may then reuse that space.
  
  VACUUM is therefore a normal and essential part of PostgreSQL operation.`,

        keyPoints: [
          "VACUUM cleans obsolete tuple versions.",
          "It is required because PostgreSQL uses MVCC.",
          "Normal VACUUM makes space reusable.",
          "Normal VACUUM usually does not return table space to the operating system.",
          "VACUUM is routine maintenance, not an emergency repair operation.",
        ],

        importantTerms: ["VACUUM", "Dead Tuple", "Reusable Space", "MVCC"],

        diagram: `
  Before VACUUM
  
  Page
  ├── LIVE
  ├── DEAD
  ├── DEAD
  └── LIVE
  
  
  After VACUUM
  
  Page
  ├── LIVE
  ├── FREE
  ├── FREE
  └── LIVE
  
  Free space can be reused
        `,

        commands: ["VACUUM users;"],

        warning:
          "Do not expect normal VACUUM to reduce the operating-system file size of a table.",
      },

      {
        id: "11-2",
        title: "11.2. VACUUM and Reusable Space",

        content: `When VACUUM determines that dead tuples are no longer needed, their storage can become available for reuse.
  
  The Free Space Map can then help PostgreSQL find pages containing usable space.
  
  Suppose a table file occupies 10 GB.
  
  After VACUUM, it may still occupy approximately 10 GB at the filesystem level.
  
  However, some of that 10 GB may now be free space available for future rows.
  
  This is different from returning the space to the operating system.`,

        keyPoints: [
          "VACUUM reclaims internal relation space.",
          "Free Space Map can track reusable page space.",
          "Physical table file size may remain unchanged.",
          "Future writes can reuse vacuumed space.",
        ],

        importantTerms: [
          "Free Space Map",
          "Internal Free Space",
          "Relation Size",
        ],

        diagram: `
  Before
  
  10 GB table
  │
  ├── 7 GB live data
  └── 3 GB dead data
  
  
  VACUUM
  
  
  After
  
  10 GB table
  │
  ├── 7 GB live data
  └── 3 GB reusable space
        `,

        commands: [
          "VACUUM users;",
          "SELECT pg_size_pretty(pg_relation_size('users'));",
        ],

        warning: null,
      },

      {
        id: "11-3",
        title: "11.3. VACUUM ANALYZE",

        content: `VACUUM and ANALYZE solve different problems.
  
  VACUUM cleans dead tuple storage and performs other maintenance.
  
  ANALYZE collects statistics used by the query planner.
  
  PostgreSQL allows both operations to be requested together with:
  
  VACUUM ANALYZE
  
  This is useful when a table has experienced significant modifications and you want both tuple cleanup and refreshed planner statistics.`,

        keyPoints: [
          "VACUUM cleans storage.",
          "ANALYZE refreshes planner statistics.",
          "VACUUM ANALYZE performs both operations.",
          "Planner statistics influence execution plans.",
        ],

        importantTerms: ["VACUUM ANALYZE", "ANALYZE", "Planner Statistics"],

        diagram: `
  VACUUM
     │
     └── Dead tuple cleanup
  
  
  ANALYZE
     │
     └── Planner statistics
  
  
  VACUUM ANALYZE
     │
     └── Both
        `,

        commands: ["VACUUM ANALYZE users;"],

        warning: null,
      },

      {
        id: "11-4",
        title: "11.4. VACUUM FULL",

        content: `VACUUM FULL behaves very differently from normal VACUUM.
  
  VACUUM FULL rewrites the table into a new physical representation.
  
  Because it rewrites the table, it can return unused space to the operating system.
  
  However, this operation requires a strong table lock and can be expensive for large tables.
  
  This makes VACUUM FULL unsuitable as routine maintenance for busy production tables.
  
  It is usually considered when severe bloat must be removed and a maintenance window is available.`,

        keyPoints: [
          "VACUUM FULL rewrites the table.",
          "It can reduce the physical relation size.",
          "It requires a strong lock.",
          "It can be expensive on large tables.",
          "It is not a replacement for healthy autovacuum.",
        ],

        importantTerms: [
          "VACUUM FULL",
          "Table Rewrite",
          "ACCESS EXCLUSIVE",
          "Disk Space",
        ],

        diagram: `
  Bloated Table
  
  ████ LIVE
  ░░░░ FREE
  ████ LIVE
  ░░░░ FREE
  ████ LIVE
  
  VACUUM FULL
  
        │
        ▼
  
  Compact Rewrite
  
  ████ LIVE
  ████ LIVE
  ████ LIVE
        `,

        commands: ["VACUUM FULL users;"],

        warning:
          "VACUUM FULL takes an ACCESS EXCLUSIVE lock on the table. Use it carefully on production systems.",
      },

      {
        id: "11-5",
        title: "11.5. VACUUM and the Visibility Map",

        content: `VACUUM also contributes to maintaining visibility metadata.
  
  When PostgreSQL determines that all tuples on a page are visible to all relevant transactions, that page can be marked all-visible in the Visibility Map.
  
  This can help future Index Only Scans avoid visiting heap pages.
  
  VACUUM can also participate in marking pages all-frozen when transaction metadata no longer requires future freezing work.
  
  Therefore VACUUM affects both storage maintenance and query performance.`,

        keyPoints: [
          "VACUUM updates visibility information.",
          "Pages can become all-visible.",
          "All-visible pages help Index Only Scans.",
          "Pages can also become all-frozen.",
        ],

        importantTerms: [
          "Visibility Map",
          "All-visible",
          "All-frozen",
          "Index Only Scan",
        ],

        diagram: `
  VACUUM
    │
    ├── clean dead tuples
    ├── update FSM
    └── update VM
           │
           ├── all-visible
           └── all-frozen
        `,

        commands: [
          "VACUUM users;",
          "EXPLAIN (ANALYZE, BUFFERS) SELECT id FROM users WHERE id = 1;",
        ],

        warning: null,
      },

      {
        id: "11-6",
        title: "11.6. Transaction ID Freezing",

        content: `PostgreSQL transaction IDs are finite.
  
  Very old transaction IDs cannot remain meaningful forever.
  
  VACUUM performs transaction ID freezing so that old tuples no longer depend on ancient transaction IDs for visibility.
  
  This protects PostgreSQL from transaction ID wraparound.
  
  Wraparound prevention is not optional maintenance.
  
  If PostgreSQL determines that transaction ID age is becoming dangerous, it will prioritize anti-wraparound vacuum work.`,

        keyPoints: [
          "Transaction IDs are finite.",
          "Old tuple transaction metadata must eventually be frozen.",
          "VACUUM performs freezing.",
          "Freezing protects against transaction ID wraparound.",
          "PostgreSQL treats wraparound prevention as critical.",
        ],

        importantTerms: ["Freeze", "Transaction ID", "XID", "Wraparound"],

        diagram: `
  Old Tuple
  xmin = very old XID
        │
        ▼
  VACUUM FREEZE
        │
        ▼
  Tuple treated as frozen
        │
        ▼
  No dependency on old XID
        `,

        commands: ["VACUUM FREEZE users;"],

        warning:
          "Disabling or consistently preventing VACUUM can eventually create transaction ID wraparound risk.",
      },

      {
        id: "11-7",
        title: "11.7. Monitor VACUUM",

        content: `PostgreSQL exposes statistics that help monitor VACUUM activity.
  
  pg_stat_user_tables includes information such as:
  
  last_vacuum
  last_autovacuum
  vacuum_count
  autovacuum_count
  n_dead_tup
  
  These values help answer questions such as:
  
  When was this table last vacuumed?
  
  Is autovacuum running?
  
  Which tables accumulate the most dead tuples?
  
  Is maintenance keeping up with write activity?`,

        keyPoints: [
          "VACUUM activity can be monitored.",
          "pg_stat_user_tables contains useful vacuum statistics.",
          "n_dead_tup helps identify cleanup pressure.",
          "last_autovacuum helps detect stale maintenance.",
        ],

        importantTerms: [
          "last_vacuum",
          "last_autovacuum",
          "vacuum_count",
          "autovacuum_count",
        ],

        diagram: `
  pg_stat_user_tables
  
  users
  ├── n_dead_tup
  ├── last_vacuum
  ├── last_autovacuum
  ├── vacuum_count
  └── autovacuum_count
        `,

        commands: [
          "SELECT relname, n_dead_tup, last_vacuum, last_autovacuum, vacuum_count, autovacuum_count FROM pg_stat_user_tables ORDER BY n_dead_tup DESC;",
        ],

        warning: null,
      },
    ],
  },

  // =========================================================
  // MODULE 12 — AUTOVACUUM
  // =========================================================
  {
    id: "doc-12",
    title: "12. Autovacuum",
    description:
      "Understand how PostgreSQL automatically runs VACUUM and ANALYZE, how thresholds are calculated, why large tables often need custom settings, and how to identify when autovacuum cannot keep up.",

    chapters: [
      {
        id: "12-1",
        title: "12.1. Why Autovacuum Exists",

        content: `Running VACUUM manually for every table would be impractical.
  
  PostgreSQL therefore includes an automatic maintenance system called autovacuum.
  
  Autovacuum monitors tables and launches worker processes when tables need maintenance.
  
  Its main responsibilities include:
  
  - vacuuming dead tuples
  - updating planner statistics through ANALYZE
  - preventing transaction ID wraparound
  
  For most PostgreSQL installations, autovacuum should remain enabled.`,

        keyPoints: [
          "Autovacuum automates VACUUM and ANALYZE.",
          "It reacts to table activity.",
          "It also protects against transaction ID wraparound.",
          "Autovacuum is essential production infrastructure.",
        ],

        importantTerms: [
          "Autovacuum",
          "Autovacuum Launcher",
          "Autovacuum Worker",
        ],

        diagram: `
  PostgreSQL
      │
      ▼
  Autovacuum Launcher
      │
      ├── Worker 1 → users
      ├── Worker 2 → orders
      └── Worker 3 → products
        `,

        commands: ["SHOW autovacuum;"],

        warning: "Disabling autovacuum globally is usually a serious mistake.",
      },

      {
        id: "12-2",
        title: "12.2. Vacuum Threshold",

        content: `Autovacuum uses thresholds to determine when a table should be vacuumed.
  
  A simplified conceptual formula is:
  
  vacuum threshold
  =
  autovacuum_vacuum_threshold
  +
  autovacuum_vacuum_scale_factor × table size
  
  This means the trigger depends partly on table size.
  
  For example, with:
  
  threshold = 50
  scale factor = 0.20
  table rows = 1,000,000
  
  the approximate trigger could be around:
  
  50 + 200,000 changes
  
  This default-style behavior may be reasonable for smaller tables but too relaxed for very large, heavily updated tables.`,

        keyPoints: [
          "Autovacuum thresholds combine a fixed threshold and scale factor.",
          "Larger tables produce larger scale-factor thresholds.",
          "Very large tables may require custom tuning.",
        ],

        importantTerms: [
          "autovacuum_vacuum_threshold",
          "autovacuum_vacuum_scale_factor",
        ],

        diagram: `
  Threshold
     =
  Fixed Threshold
     +
  Scale Factor × Table Size
  
  
  Example
  
  50 + 0.20 × 1,000,000
  
  ≈ 200,050
        `,

        commands: [
          "SHOW autovacuum_vacuum_threshold;",
          "SHOW autovacuum_vacuum_scale_factor;",
        ],

        warning:
          "A scale factor that works for a small table may allow millions of dead tuples to accumulate on a very large table.",
      },

      {
        id: "12-3",
        title: "12.3. ANALYZE Threshold",

        content: `Autovacuum also decides when planner statistics should be refreshed.
  
  A simplified ANALYZE threshold is based on:
  
  autovacuum_analyze_threshold
  +
  autovacuum_analyze_scale_factor × table size
  
  When enough rows have changed, PostgreSQL automatically runs ANALYZE.
  
  This helps the query planner keep cardinality and data-distribution estimates reasonably current.`,

        keyPoints: [
          "Autovacuum also triggers ANALYZE.",
          "ANALYZE thresholds are separate from VACUUM thresholds.",
          "Fresh statistics help the planner choose good plans.",
        ],

        importantTerms: [
          "autovacuum_analyze_threshold",
          "autovacuum_analyze_scale_factor",
          "ANALYZE",
        ],

        diagram: `
  Table Changes
       │
       ▼
  Analyze Threshold Reached?
       │
       ├── NO
       │
       └── YES
             │
             ▼
          ANALYZE
             │
             ▼
     Updated Planner Stats
        `,

        commands: [
          "SHOW autovacuum_analyze_threshold;",
          "SHOW autovacuum_analyze_scale_factor;",
        ],

        warning: null,
      },

      {
        id: "12-4",
        title: "12.4. Per-Table Autovacuum Settings",

        content: `Autovacuum settings can be configured per table.
  
  This is useful because different tables have very different workloads.
  
  For example:
  
  users
  may have moderate updates.
  
  notifications
  may receive heavy inserts and updates.
  
  jobs
  may constantly transition between pending and completed states.
  
  A single global configuration may not be ideal for all three.
  
  Large or write-heavy tables often benefit from more aggressive per-table settings.`,

        keyPoints: [
          "Autovacuum can be tuned per table.",
          "Different tables can have different churn rates.",
          "Write-heavy tables may need more aggressive vacuum settings.",
        ],

        importantTerms: [
          "Storage Parameters",
          "Per-table Configuration",
          "Scale Factor",
        ],

        diagram: `
  Global Settings
        │
        ├── users → defaults
        ├── products → defaults
        │
        └── notifications
                │
                └── custom aggressive settings
        `,

        commands: [
          "ALTER TABLE notifications SET (autovacuum_vacuum_scale_factor = 0.02);",
          "ALTER TABLE notifications SET (autovacuum_analyze_scale_factor = 0.01);",
        ],

        warning:
          "Use real table size and update rates when tuning autovacuum instead of blindly copying values.",
      },

      {
        id: "12-5",
        title: "12.5. Autovacuum Workers",

        content: `Autovacuum uses worker processes to perform maintenance.
  
  The number of concurrent autovacuum workers is limited.
  
  Important settings include:
  
  autovacuum_max_workers
  autovacuum_naptime
  
  The launcher periodically checks for work and assigns tables to available workers.
  
  If many large tables all require vacuum simultaneously, the available worker capacity may become important.`,

        keyPoints: [
          "Autovacuum work is performed by worker processes.",
          "Worker concurrency is limited.",
          "Many busy tables can compete for workers.",
          "Worker configuration affects maintenance throughput.",
        ],

        importantTerms: [
          "autovacuum_max_workers",
          "autovacuum_naptime",
          "Autovacuum Worker",
        ],

        diagram: `
  Tables needing vacuum
  
  users
  orders
  notifications
  events
  messages
  logs
  
        │
        ▼
  
  Available Workers
  
  Worker 1
  Worker 2
  Worker 3
  
  Others wait
        `,

        commands: ["SHOW autovacuum_max_workers;", "SHOW autovacuum_naptime;"],

        warning: null,
      },

      {
        id: "12-6",
        title: "12.6. Autovacuum Cost Throttling",

        content: `VACUUM consumes CPU and I/O.
  
  PostgreSQL can throttle vacuum work using a cost-based mechanism.
  
  The goal is to prevent maintenance from monopolizing system resources.
  
  However, if vacuum is throttled too aggressively on a very write-heavy database, cleanup may fall behind.
  
  The correct balance depends on the workload and storage capacity.`,

        keyPoints: [
          "Autovacuum consumes real system resources.",
          "Cost-based throttling limits maintenance intensity.",
          "Too little vacuum capacity can allow dead tuples to accumulate.",
          "Too aggressive vacuuming can compete with application traffic.",
        ],

        importantTerms: [
          "autovacuum_vacuum_cost_limit",
          "vacuum_cost_delay",
          "Throttling",
        ],

        diagram: `
  Autovacuum
      │
      ▼
  Consumes CPU + I/O
      │
      ▼
  Cost Throttling
      │
      ├── Too aggressive → app contention
      └── Too slow       → cleanup falls behind
        `,

        commands: [
          "SHOW autovacuum_vacuum_cost_limit;",
          "SHOW vacuum_cost_delay;",
        ],

        warning: null,
      },

      {
        id: "12-7",
        title: "12.7. Detect Autovacuum Problems",

        content: `Signs that autovacuum may not be keeping up include:
  
  - rapidly growing n_dead_tup
  - tables growing faster than expected
  - old last_autovacuum timestamps
  - long-running transactions preventing cleanup
  - increasing transaction age
  - heavy index and table bloat
  
  The correct diagnosis requires looking at workload, table size, active transactions, vacuum history, and storage growth together.`,

        keyPoints: [
          "Dead tuple growth can indicate cleanup pressure.",
          "Long transactions can block effective cleanup.",
          "Autovacuum history should be monitored.",
          "Table growth alone does not prove autovacuum failure.",
        ],

        importantTerms: [
          "Autovacuum Lag",
          "Dead Tuples",
          "Transaction Age",
          "Maintenance Backlog",
        ],

        diagram: `
  High Write Rate
        │
        ▼
  Dead Tuples
        │
        ▼
  Autovacuum Capacity Enough?
        │
     ┌──┴──┐
     │YES  │NO
     ▼     ▼
  Stable  Backlog
            │
            ▼
          Bloat
        `,

        commands: [
          "SELECT relname, n_live_tup, n_dead_tup, last_autovacuum, autovacuum_count FROM pg_stat_user_tables ORDER BY n_dead_tup DESC;",
        ],

        warning: null,
      },
    ],
  },

  // =========================================================
  // MODULE 13 — TABLE & INDEX BLOAT
  // =========================================================
  {
    id: "doc-13",
    title: "13. Table & Index Bloat",
    description:
      "Understand what bloat means, how MVCC and updates contribute to it, why VACUUM does not always shrink files, and how table and index bloat differ.",

    chapters: [
      {
        id: "13-1",
        title: "13.1. What is Bloat?",

        content: `Bloat refers to physical storage that is significantly larger or less efficient than necessary for the current useful data.
  
  In PostgreSQL, bloat can affect:
  
  - tables
  - indexes
  
  MVCC, frequent UPDATE and DELETE activity, page fragmentation, and insufficient cleanup can all contribute.
  
  Some free space is normal and useful.
  
  Bloat becomes a concern when excessive unused or inefficiently organized storage increases:
  
  - I/O
  - cache usage
  - scan cost
  - storage consumption
  - maintenance time`,

        keyPoints: [
          "Bloat means inefficiently used relation storage.",
          "Tables and indexes can both become bloated.",
          "Some free space is healthy and expected.",
          "Excessive bloat increases I/O and cache pressure.",
        ],

        importantTerms: [
          "Table Bloat",
          "Index Bloat",
          "Fragmentation",
          "Dead Space",
        ],

        diagram: `
  Healthy Page
  
  ██████████████░░
  
  
  Bloated Relation
  
  ████░░░░████░░░░██░░░░
        `,

        commands: ["SELECT pg_size_pretty(pg_total_relation_size('users'));"],

        warning:
          "Not all unused space is harmful bloat. PostgreSQL intentionally keeps reusable page space.",
      },

      {
        id: "13-2",
        title: "13.2. Table Bloat",

        content: `Table bloat often develops when many old tuple versions accumulate and physical pages become sparsely populated.
  
  Even after normal VACUUM removes dead tuples logically, the relation file may retain those pages for future reuse.
  
  This can result in a table whose physical footprint is larger than the currently live row data would require.
  
  The effect can be especially noticeable after large DELETE operations.`,

        keyPoints: [
          "Normal VACUUM reuses space but usually does not shrink the table file.",
          "Large DELETE operations may leave significant free internal space.",
          "Sparse pages can increase scan and cache cost.",
        ],

        importantTerms: ["Table Bloat", "Sparse Page", "Reusable Space"],

        diagram: `
  Before Large DELETE
  
  ████████████████████
  
  
  After DELETE + VACUUM
  
  ████░░░░██░░░░████░
  
  Same approximate file size
  but less live data
        `,

        commands: ["SELECT pg_size_pretty(pg_table_size('users'));"],

        warning: null,
      },

      {
        id: "13-3",
        title: "13.3. Index Bloat",

        content: `Indexes can also accumulate inefficiently used space.
  
  Updates can create new index entries and leave obsolete entries that later require cleanup.
  
  Frequent page splits, deletes, and changing data distribution can also contribute.
  
  A bloated index can:
  
  - occupy more disk
  - consume more cache
  - require more page reads
  - increase maintenance costs
  
  In severe cases, rebuilding the index may be appropriate.`,

        keyPoints: [
          "Indexes can bloat separately from heap tables.",
          "Updates and deletes affect index structures.",
          "Large indexes consume valuable cache.",
          "REINDEX can rebuild an index.",
        ],

        importantTerms: ["Index Bloat", "Page Split", "REINDEX"],

        diagram: `
  Index
  
  Before
  
  [full][full][full][full]
  
  After heavy churn
  
  [half][mostly empty][full][half]
        `,

        commands: [
          "SELECT pg_size_pretty(pg_indexes_size('users'));",
          "REINDEX TABLE users;",
        ],

        warning:
          "Reindexing production objects can have locking and resource implications. Choose the appropriate method and maintenance strategy.",
      },

      {
        id: "13-4",
        title: "13.4. VACUUM vs VACUUM FULL vs REINDEX",

        content: `These maintenance operations solve different problems.
  
  VACUUM:
  cleans dead tuple versions and makes heap space reusable.
  
  VACUUM FULL:
  rewrites and compacts the table.
  
  REINDEX:
  rebuilds indexes.
  
  They should not be treated as interchangeable commands.
  
  A healthy PostgreSQL system should normally rely on regular VACUUM and autovacuum rather than repeatedly requiring VACUUM FULL.`,

        keyPoints: [
          "VACUUM reclaims reusable internal space.",
          "VACUUM FULL rewrites the table.",
          "REINDEX rebuilds indexes.",
          "Each operation addresses different storage problems.",
        ],

        importantTerms: ["VACUUM", "VACUUM FULL", "REINDEX"],

        diagram: `
  Dead Heap Tuples
        │
        └── VACUUM
  
  
  Severe Table Bloat
        │
        └── VACUUM FULL / rewrite strategy
  
  
  Index Bloat
        │
        └── REINDEX
        `,

        commands: [
          "VACUUM users;",
          "VACUUM FULL users;",
          "REINDEX TABLE users;",
        ],

        warning:
          "VACUUM FULL and REINDEX can be disruptive. Production use requires understanding their locking behavior.",
      },

      {
        id: "13-5",
        title: "13.5. pg_repack",

        content: `The PostgreSQL ecosystem includes tools such as pg_repack for rebuilding tables and indexes with reduced blocking compared with VACUUM FULL.
  
  pg_repack is not part of PostgreSQL core.
  
  It is an extension/tool that can help reduce table and index bloat while allowing more concurrent access than a traditional blocking rewrite.
  
  It still requires planning, resources, extra disk capacity, and operational care.`,

        keyPoints: [
          "pg_repack is an external PostgreSQL extension/tool.",
          "It can rebuild bloated tables and indexes.",
          "It aims to reduce blocking compared with VACUUM FULL.",
          "It requires operational planning and extra disk capacity.",
        ],

        importantTerms: ["pg_repack", "Online Rebuild", "Bloat Cleanup"],

        diagram: `
  Bloated Table
       │
       ▼
   pg_repack
       │
       ▼
  Compact Replacement
       │
       ▼
  Swap
        `,

        commands: [],

        warning:
          "pg_repack is not built into PostgreSQL and must be installed and managed separately.",
      },
    ],
  },

  // =========================================================
  // MODULE 14 — WAL
  // =========================================================
  {
    id: "doc-14",
    title: "14. Write-Ahead Log (WAL)",
    description:
      "Understand PostgreSQL's Write-Ahead Log, why WAL is written before dirty data pages, how LSNs work, and why WAL is fundamental to crash recovery, replication, and PITR.",

    chapters: [
      {
        id: "14-1",
        title: "14.1. What is WAL?",

        content: `WAL stands for Write-Ahead Log.
  
  The central rule is:
  
  Changes must be recorded in WAL before corresponding modified data pages are considered safely written.
  
  Instead of immediately forcing every modified table page to disk, PostgreSQL first writes compact records describing changes into WAL.
  
  This allows PostgreSQL to recover committed changes after a crash even if some dirty table pages had not yet reached persistent storage.`,

        keyPoints: [
          "WAL means Write-Ahead Log.",
          "WAL records changes before corresponding data pages are flushed.",
          "WAL is central to durability.",
          "WAL enables crash recovery.",
        ],

        importantTerms: [
          "WAL",
          "Write-Ahead Log",
          "Durability",
          "Crash Recovery",
        ],

        diagram: `
  UPDATE
    │
    ▼
  Change in Memory
    │
    ▼
  WAL Record
    │
    ▼
  WAL Persisted
    │
    ▼
  COMMIT can become durable
    │
    ▼
  Data Page written later
        `,

        commands: ["SHOW wal_level;"],

        warning: null,
      },

      {
        id: "14-2",
        title: "14.2. Why WAL Makes COMMIT Efficient",

        content: `Writing many random table pages synchronously for every transaction would be expensive.
  
  WAL allows PostgreSQL to write transaction change records to a sequential log.
  
  Sequential logging is generally more efficient than forcing many scattered relation pages to storage immediately.
  
  After WAL is durable, dirty heap and index pages can be written later.
  
  This decouples transaction durability from immediate data-file flushing.`,

        keyPoints: [
          "WAL separates commit durability from immediate heap-page writes.",
          "WAL writing is sequential in nature.",
          "Dirty pages can be persisted later.",
          "This improves write efficiency.",
        ],

        importantTerms: [
          "Sequential Write",
          "Dirty Page",
          "Commit",
          "WAL Flush",
        ],

        diagram: `
  Without WAL concept
  
  Transaction
   ├── write table page A
   ├── write index page B
   ├── write table page C
   └── commit
  
  
  With WAL
  
  Transaction
   └── WAL sequential write
         │
         ▼
       COMMIT
  
  Dirty pages written later
        `,

        commands: [],

        warning: null,
      },

      {
        id: "14-3",
        title: "14.3. Log Sequence Number (LSN)",

        content: `WAL positions are identified using Log Sequence Numbers, commonly called LSNs.
  
  An LSN represents a position in the WAL stream.
  
  PostgreSQL uses LSNs to track:
  
  - how far WAL has been generated
  - how far WAL has been flushed
  - how far replicas have received WAL
  - how far replicas have replayed WAL
  
  This makes LSNs fundamental to replication and recovery monitoring.`,

        keyPoints: [
          "LSN means Log Sequence Number.",
          "It represents a WAL position.",
          "LSNs help measure replication and recovery progress.",
          "Differences between LSNs can represent WAL lag.",
        ],

        importantTerms: ["LSN", "WAL Position", "Replication Lag"],

        diagram: `
  WAL Stream
  
  LSN A
    │
    ▼
  [records][records][records][records]
                            ▲
                            │
                          LSN B
        `,

        commands: [
          "SELECT pg_current_wal_lsn();",
          "SELECT pg_wal_lsn_diff(pg_current_wal_lsn(), '0/0');",
        ],

        warning: null,
      },

      {
        id: "14-4",
        title: "14.4. WAL Segments",

        content: `WAL is stored in segment files.
  
  PostgreSQL continuously writes WAL records into these segments.
  
  Old segments may later be:
  
  - recycled
  - removed
  - archived
  - retained for replicas
  
  depending on configuration and system state.
  
  Unexpected WAL growth can therefore be caused by multiple conditions such as:
  
  - high write volume
  - replication slots retaining WAL
  - archiving failures
  - checkpoint behavior
  - long-running backup or replication requirements`,

        keyPoints: [
          "WAL is stored in segment files.",
          "Segments can be recycled or archived.",
          "Replication can cause WAL retention.",
          "Unexpected WAL growth requires investigation.",
        ],

        importantTerms: ["WAL Segment", "pg_wal", "WAL Retention"],

        diagram: `
  pg_wal
  
  ├── WAL Segment 1
  ├── WAL Segment 2
  ├── WAL Segment 3
  ├── WAL Segment 4
  └── ...
        `,

        commands: ["SHOW min_wal_size;", "SHOW max_wal_size;"],

        warning:
          "A full pg_wal filesystem can cause severe database problems. WAL growth should be monitored.",
      },

      {
        id: "14-5",
        title: "14.5. WAL Enables More Than Crash Recovery",

        content: `WAL is reused by multiple PostgreSQL subsystems.
  
  It supports:
  
  - crash recovery
  - physical streaming replication
  - continuous archiving
  - Point-In-Time Recovery
  - physical backups
  - logical decoding infrastructure
  
  Understanding WAL therefore provides the foundation for understanding PostgreSQL high availability and disaster recovery.`,

        keyPoints: [
          "WAL powers crash recovery.",
          "Physical replication streams WAL.",
          "Archived WAL enables PITR.",
          "WAL is central to PostgreSQL durability and recovery architecture.",
        ],

        importantTerms: [
          "Streaming Replication",
          "PITR",
          "Archive",
          "Logical Decoding",
        ],

        diagram: `
                  WAL
                   │
        ┌──────────┼───────────┐
        ▼          ▼           ▼
  Crash Recovery Replica     Archive
                              │
                              ▼
                             PITR
        `,

        commands: ["SHOW archive_mode;", "SHOW wal_level;"],

        warning: null,
      },
    ],
  },

  // =========================================================
  // MODULE 15 — WAL & DURABILITY
  // =========================================================
  {
    id: "doc-15",
    title: "15. WAL & Durability",
    description:
      "Understand the durability settings surrounding WAL, including fsync, synchronous_commit, full_page_writes, wal_buffers, and the tradeoff between latency and durability.",

    chapters: [
      {
        id: "15-1",
        title: "15.1. What Makes a Commit Durable?",

        content: `A transaction is durable when PostgreSQL can recover its committed changes even after a crash.
  
  For normal durable behavior, PostgreSQL ensures the required WAL reaches durable storage before reporting commit success according to its configured synchronization behavior.
  
  The table's modified pages do not necessarily need to be written at that moment.
  
  The WAL record is enough for PostgreSQL to reconstruct the committed changes during recovery.`,

        keyPoints: [
          "Commit durability primarily depends on WAL persistence.",
          "Dirty table pages may be written later.",
          "Crash recovery can replay WAL.",
        ],

        importantTerms: ["Durability", "WAL Flush", "Commit"],

        diagram: `
  Transaction
     │
     ▼
  WAL generated
     │
     ▼
  WAL durable
     │
     ▼
  COMMIT SUCCESS
  
  Data pages
  written later
        `,

        commands: [],

        warning: null,
      },

      {
        id: "15-2",
        title: "15.2. fsync",

        content: `The fsync setting controls whether PostgreSQL tries to ensure updates are physically written to durable storage.
  
  For production systems requiring durability, fsync should normally remain enabled.
  
  Turning it off may improve benchmark write performance, but a crash can leave the database corrupted or inconsistent in ways WAL cannot safely recover.
  
  This is therefore not a normal performance-tuning technique.`,

        keyPoints: [
          "fsync protects durability.",
          "Disabling fsync can risk unrecoverable corruption.",
          "It should normally remain enabled in production.",
        ],

        importantTerms: ["fsync", "Durable Storage", "Crash Safety"],

        diagram: `
  fsync = on
  
  PostgreSQL
      │
      ▼
  OS
      │
      ▼
  Storage acknowledges durable write
        `,

        commands: ["SHOW fsync;"],

        warning:
          "Do not disable fsync on a production database merely to improve write benchmarks.",
      },

      {
        id: "15-3",
        title: "15.3. synchronous_commit",

        content: `synchronous_commit controls when PostgreSQL reports transaction commit success relative to WAL durability.
  
  With normal synchronous commit behavior, PostgreSQL waits for the required WAL flush before confirming the commit.
  
  With asynchronous commit behavior, PostgreSQL may report success before the WAL record is fully flushed to durable storage.
  
  This can reduce commit latency.
  
  The tradeoff is that a database crash may lose a small window of recently acknowledged transactions.
  
  It does not mean the database becomes structurally inconsistent; it changes the durability guarantee for those recent transactions.`,

        keyPoints: [
          "synchronous_commit affects commit latency and durability timing.",
          "Asynchronous commit can acknowledge before WAL flush.",
          "Recent acknowledged transactions may be lost after a crash.",
          "The tradeoff is latency versus durability window.",
        ],

        importantTerms: [
          "synchronous_commit",
          "Asynchronous Commit",
          "Commit Latency",
        ],

        diagram: `
  Synchronous
  
  WAL
   ↓
  Flush
   ↓
  ACK client
  
  
  Asynchronous
  
  WAL
   ↓
  ACK client
   ↓
  Flush shortly later
        `,

        commands: ["SHOW synchronous_commit;"],

        warning:
          "Only relax synchronous_commit when losing a small window of recent transactions is acceptable for that workload.",
      },

      {
        id: "15-4",
        title: "15.4. wal_buffers",

        content: `wal_buffers is memory used to hold WAL records before they are written to WAL storage.
  
  When transactions generate changes, WAL records first accumulate in WAL buffers.
  
  They are then written and flushed according to PostgreSQL's WAL mechanisms.
  
  wal_buffers is therefore different from shared_buffers.
  
  shared_buffers:
  contains relation pages
  
  wal_buffers:
  contains WAL records`,

        keyPoints: [
          "wal_buffers stores WAL records temporarily in memory.",
          "It is separate from shared_buffers.",
          "Heavy write workloads generate substantial WAL.",
        ],

        importantTerms: ["wal_buffers", "WAL Record", "Shared Buffers"],

        diagram: `
  Changed Table Page
        │
        ▼
  WAL Record
        │
        ▼
  wal_buffers
        │
        ▼
  pg_wal
        `,

        commands: ["SHOW wal_buffers;"],

        warning: null,
      },

      {
        id: "15-5",
        title: "15.5. full_page_writes",

        content: `PostgreSQL may need to protect against partially written data pages after a crash.
  
  With full_page_writes enabled, PostgreSQL can write a full image of a page to WAL the first time that page is modified after a checkpoint.
  
  This allows PostgreSQL recovery to restore a valid page even if a torn or partial data-page write occurred.
  
  Full-page images can increase WAL volume, especially after checkpoints.`,

        keyPoints: [
          "full_page_writes protects against partial page writes.",
          "Full-page images can be logged after checkpoints.",
          "This increases WAL volume but improves crash safety.",
        ],

        importantTerms: ["full_page_writes", "Full Page Image", "Torn Page"],

        diagram: `
  Checkpoint
      │
      ▼
  First modification of Page 20
      │
      ▼
  Full Page Image in WAL
      │
      ▼
  Future modifications
  may log smaller change records
        `,

        commands: ["SHOW full_page_writes;"],

        warning:
          "Disabling full_page_writes can compromise crash recovery unless the storage environment has very specific guarantees.",
      },
    ],
  },

  // =========================================================
  // MODULE 16 — CHECKPOINTS
  // =========================================================
  {
    id: "doc-16",
    title: "16. Checkpoints",
    description:
      "Understand checkpoints, dirty-page flushing, how checkpoints bound crash recovery work, and why overly frequent checkpoints can create write spikes and additional WAL.",

    chapters: [
      {
        id: "16-1",
        title: "16.1. What is a Checkpoint?",

        content: `A checkpoint is a point in PostgreSQL's WAL history where PostgreSQL ensures that dirty pages from changes before the checkpoint are written to data files according to checkpoint processing.
  
  Checkpoints help limit how much WAL PostgreSQL must replay during crash recovery.
  
  Without checkpoints, recovery could need to replay an enormous amount of historical WAL.`,

        keyPoints: [
          "Checkpoints flush dirty data pages.",
          "They establish recovery boundaries.",
          "They reduce the amount of WAL needed during crash recovery.",
        ],

        importantTerms: ["Checkpoint", "Dirty Page", "Crash Recovery"],

        diagram: `
  WAL Timeline
  
  ──────────────●───────────────>
              Checkpoint
  
  Crash later
      │
      ▼
  Recovery can begin
  from checkpoint-related state
  instead of replaying everything
        `,

        commands: ["CHECKPOINT;"],

        warning:
          "Manual CHECKPOINT is rarely needed in normal application operation.",
      },

      {
        id: "16-2",
        title: "16.2. Dirty Pages and Checkpoints",

        content: `As transactions modify data, pages in shared buffers become dirty.
  
  These dirty pages must eventually be written to relation files.
  
  The checkpointer is responsible for writing pages as part of checkpoint processing.
  
  PostgreSQL tries to spread checkpoint writes over time rather than writing everything at once.
  
  This helps reduce sudden I/O spikes.`,

        keyPoints: [
          "Dirty buffers eventually need to reach data files.",
          "The checkpointer performs checkpoint-related writes.",
          "Write spreading reduces checkpoint spikes.",
        ],

        importantTerms: ["Dirty Buffer", "Checkpointer", "Checkpoint Write"],

        diagram: `
  Shared Buffers
  
  Dirty Page A
  Dirty Page B
  Dirty Page C
  Dirty Page D
  
        │
        ▼
  Checkpointer
        │
        ▼
  Data Files
        `,

        commands: [],

        warning: null,
      },

      {
        id: "16-3",
        title: "16.3. checkpoint_timeout",

        content: `checkpoint_timeout controls a time-based maximum interval between automatic checkpoints.
  
  A checkpoint may also be triggered for other reasons, including WAL volume.
  
  If checkpoints occur too frequently:
  
  - more full-page images may be generated
  - additional write pressure can occur
  - latency may become less stable
  
  If checkpoints are too infrequent, crash recovery may require more WAL replay and dirty data can accumulate longer.`,

        keyPoints: [
          "checkpoint_timeout influences checkpoint frequency.",
          "Too-frequent checkpoints can increase write pressure.",
          "Checkpoint frequency affects recovery and WAL behavior.",
        ],

        importantTerms: ["checkpoint_timeout", "Checkpoint Frequency"],

        diagram: `
  Too Frequent
  
  Checkpoint
    ↓
  Checkpoint
    ↓
  Checkpoint
    ↓
  
  More write pressure
  
  
  Less Frequent
  
  ────────────Checkpoint────────────
        `,

        commands: ["SHOW checkpoint_timeout;"],

        warning: null,
      },

      {
        id: "16-4",
        title: "16.4. max_wal_size",

        content: `max_wal_size influences when WAL volume can cause PostgreSQL to trigger checkpoints.
  
  It is not a strict absolute upper bound on all possible WAL disk usage.
  
  Actual pg_wal usage can exceed it because of conditions such as:
  
  - replication slots
  - archiving requirements
  - recovery needs
  - unusually high WAL generation
  
  The setting is best understood as part of checkpoint scheduling behavior rather than a hard disk quota.`,

        keyPoints: [
          "max_wal_size influences checkpoint scheduling.",
          "It is not a strict WAL-directory disk limit.",
          "Replication slots and archiving can retain additional WAL.",
        ],

        importantTerms: ["max_wal_size", "WAL Retention", "Checkpoint Trigger"],

        diagram: `
  WAL Generation
       │
       ▼
  Approaches checkpoint threshold
       │
       ▼
  Checkpoint can be triggered
  
  
  But retained WAL may still exceed
  max_wal_size for other reasons
        `,

        commands: ["SHOW max_wal_size;", "SHOW min_wal_size;"],

        warning:
          "Do not assume max_wal_size prevents pg_wal from filling the disk.",
      },

      {
        id: "16-5",
        title: "16.5. checkpoint_completion_target",

        content: `checkpoint_completion_target influences how PostgreSQL spreads checkpoint I/O across the available checkpoint interval.
  
  The goal is to avoid writing a huge amount of dirty data in a short burst.
  
  Smoother checkpoint writes can reduce latency spikes and I/O contention.
  
  Checkpoint tuning therefore involves both frequency and how aggressively checkpoint work is spread.`,

        keyPoints: [
          "Checkpoint writes can be spread over time.",
          "Smoother writes can reduce I/O spikes.",
          "checkpoint_completion_target participates in this behavior.",
        ],

        importantTerms: ["checkpoint_completion_target", "I/O Smoothing"],

        diagram: `
  Burst
  
  ████████████████
                  time
  
  
  Spread
  
  ██  ██  ██  ██  ██  ██
                  time
        `,

        commands: ["SHOW checkpoint_completion_target;"],

        warning: null,
      },

      {
        id: "16-6",
        title: "16.6. Monitor Checkpoints",

        content: `PostgreSQL statistics can show checkpoint activity.
  
  Useful information includes:
  
  - number of checkpoints
  - checkpoint write time
  - checkpoint sync time
  - buffers written during checkpoint work
  
  These metrics can help identify checkpoint-related I/O pressure.
  
  Modern PostgreSQL versions expose checkpoint statistics through dedicated statistics views.`,

        keyPoints: [
          "Checkpoint activity is observable.",
          "Write and sync time are important metrics.",
          "Frequent or expensive checkpoints can indicate tuning or workload issues.",
        ],

        importantTerms: [
          "pg_stat_checkpointer",
          "Checkpoint Write Time",
          "Checkpoint Sync Time",
        ],

        diagram: `
  Checkpoint Metrics
  
  ├── count
  ├── write time
  ├── sync time
  └── buffers written
        `,

        commands: ["SELECT * FROM pg_stat_checkpointer;"],

        warning: null,
      },
    ],
  },

  // =========================================================
  // MODULE 17 — BACKGROUND WRITER
  // =========================================================
  {
    id: "doc-17",
    title: "17. Background Writer",
    description:
      "Understand the difference between the background writer, checkpointer, and backend processes, and how PostgreSQL tries to keep clean reusable buffers available.",

    chapters: [
      {
        id: "17-1",
        title: "17.1. Why a Background Writer Exists",

        content: `Shared buffers contain both clean and dirty pages.
  
  When PostgreSQL needs a reusable buffer, choosing a dirty buffer may require that page to be written before the buffer can be reused.
  
  If application backend processes frequently have to perform those writes themselves, query latency can increase.
  
  The background writer tries to proactively write some dirty shared buffers so that more reusable clean buffers are available.`,

        keyPoints: [
          "Dirty buffers cannot always be immediately reused.",
          "Backend-triggered writes can add query latency.",
          "The background writer proactively writes some dirty buffers.",
          "Its goal is to help maintain reusable clean buffers.",
        ],

        importantTerms: [
          "Background Writer",
          "Dirty Buffer",
          "Clean Buffer",
          "Backend Write",
        ],

        diagram: `
  Shared Buffers
  
  Dirty
  Dirty
  Clean
  Dirty
  Clean
  
      │
      ▼
  Background Writer
      │
      ▼
  Writes some dirty pages
      │
      ▼
  
  More clean reusable buffers
        `,

        commands: [],

        warning: null,
      },

      {
        id: "17-2",
        title: "17.2. Background Writer vs Checkpointer",

        content: `The background writer and checkpointer both write dirty pages, but their purposes differ.
  
  Background writer:
  
  tries to proactively clean buffers so backend processes are less likely to perform writes themselves.
  
  Checkpointer:
  
  performs writes required for checkpoint processing so PostgreSQL establishes a consistent recovery boundary.
  
  These components cooperate but should not be treated as the same process.`,

        keyPoints: [
          "Background writer helps buffer reuse.",
          "Checkpointer handles checkpoint-related flushing.",
          "They serve different purposes.",
        ],

        importantTerms: ["Background Writer", "Checkpointer"],

        diagram: `
  Dirty Buffers
      │
      ├──────────────┐
      ▼              ▼
  Background      Checkpointer
  Writer
      │              │
  buffer reuse    checkpoint
      │              │
      └──────┬───────┘
             ▼
          Storage
        `,

        commands: [],

        warning: null,
      },

      {
        id: "17-3",
        title: "17.3. Backend Writes",

        content: `Application backend processes may sometimes need to write dirty buffers themselves.
  
  This can happen when a backend needs a buffer for another page and the chosen replacement buffer is dirty.
  
  The backend may have to write that page before proceeding.
  
  Frequent backend writes can indicate that background cleaning or checkpoint behavior is not keeping enough reusable buffers available for the workload.`,

        keyPoints: [
          "Backend processes can write dirty pages.",
          "Backend writes can increase query latency.",
          "Frequent backend writes may indicate buffer-pressure conditions.",
        ],

        importantTerms: ["Backend Write", "Buffer Replacement", "Latency"],

        diagram: `
  Query Needs New Buffer
         │
         ▼
  Candidate Buffer Dirty?
         │
      ┌──┴──┐
      │NO   │YES
      ▼     ▼
  Reuse   Backend writes page
            │
            ▼
          Reuse
        `,

        commands: [],

        warning: null,
      },

      {
        id: "17-4",
        title: "17.4. bgwriter Settings",

        content: `PostgreSQL exposes settings controlling background writer behavior.
  
  Examples include:
  
  bgwriter_delay
  bgwriter_lru_maxpages
  bgwriter_lru_multiplier
  
  These influence how frequently the writer wakes up and how aggressively it cleans buffers.
  
  Most systems should not tune these settings blindly.
  
  Monitoring should show a concrete buffer-cleaning problem before changing them.`,

        keyPoints: [
          "Background writer behavior is configurable.",
          "Settings control frequency and cleaning aggressiveness.",
          "Tuning should be driven by observed behavior.",
        ],

        importantTerms: [
          "bgwriter_delay",
          "bgwriter_lru_maxpages",
          "bgwriter_lru_multiplier",
        ],

        diagram: `
  Background Writer
  
  Wake
   │
   ▼
  Estimate reusable buffers needed
   │
   ▼
  Clean limited number of pages
   │
   ▼
  Sleep
        `,

        commands: [
          "SHOW bgwriter_delay;",
          "SHOW bgwriter_lru_maxpages;",
          "SHOW bgwriter_lru_multiplier;",
        ],

        warning:
          "Changing background-writer settings without evidence can create unnecessary write I/O.",
      },

      {
        id: "17-5",
        title: "17.5. Complete Write Path Mental Model",

        content: `At this point, you can connect several PostgreSQL internals.
  
  An application modifies a row.
  
  PostgreSQL:
  
  1. Creates a new tuple version using MVCC.
  2. Modifies a page in shared buffers.
  3. Marks that page dirty.
  4. Generates WAL records.
  5. Flushes WAL as required for durability.
  6. Eventually writes the dirty data page.
  
  The data-page write may be performed by:
  
  - the background writer
  - the checkpointer
  - a backend process
  
  This is the basic PostgreSQL write path.`,

        keyPoints: [
          "MVCC creates row versions.",
          "Modified pages become dirty.",
          "WAL protects durability.",
          "Data pages can be written later.",
          "Several PostgreSQL processes can perform data-page writes.",
        ],

        importantTerms: [
          "MVCC",
          "Shared Buffers",
          "Dirty Page",
          "WAL",
          "Background Writer",
          "Checkpointer",
        ],

        diagram: `
  Application UPDATE
         │
         ▼
  New Tuple Version
         │
         ▼
  Shared Buffer Modified
         │
         ├── Dirty Page
         │
         ▼
  WAL Generated
         │
         ▼
  WAL Flushed
         │
         ▼
  COMMIT Durable
         │
         ▼
  Dirty Page eventually written
         │
         ├── Background Writer
         ├── Checkpointer
         └── Backend Process
  
  
  Next:
  Connection Architecture
        `,

        commands: [
          "SHOW shared_buffers;",
          "SHOW wal_buffers;",
          "SHOW checkpoint_timeout;",
          "SHOW bgwriter_delay;",
        ],

        warning: null,
      },
    ],
  },

  // =========================================================
  // MODULE 18 — CONNECTION ARCHITECTURE
  // =========================================================
  {
    id: "doc-18",
    title: "18. PostgreSQL Connection Architecture",
    description:
      "Understand PostgreSQL's process-per-connection architecture, backend processes, connection limits, idle sessions, and why large application fleets need careful connection management.",

    chapters: [
      {
        id: "18-1",
        title: "18.1. One Connection, One Backend",

        content: `PostgreSQL traditionally uses a process-per-connection architecture.
  
  When a client establishes a database connection, PostgreSQL creates or assigns a backend process to handle that session.
  
  That backend:
  
  - receives SQL
  - parses queries
  - plans queries
  - executes queries
  - participates in transactions
  - accesses shared memory
  - returns results
  
  Therefore thousands of database connections are not equivalent to thousands of lightweight HTTP connections in an event-loop application.`,

        keyPoints: [
          "A PostgreSQL connection is normally handled by a backend process.",
          "Backend processes execute queries for their sessions.",
          "Large connection counts consume memory and CPU scheduling resources.",
          "Database connections should be treated as expensive resources.",
        ],

        importantTerms: [
          "Backend Process",
          "Client Connection",
          "Session",
          "Postmaster",
        ],

        diagram: `
  Application Clients
  
  Client 1 ─────→ Backend 1
  Client 2 ─────→ Backend 2
  Client 3 ─────→ Backend 3
  Client 4 ─────→ Backend 4
  
                    │
                    ▼
             PostgreSQL Shared
                 Resources
        `,

        commands: [
          "SELECT COUNT(*) FROM pg_stat_activity;",
          "SHOW max_connections;",
        ],

        warning:
          "Do not size application connection pools independently for every service without considering the total number of PostgreSQL connections.",
      },

      {
        id: "18-2",
        title: "18.2. max_connections",

        content: `max_connections limits the number of concurrent PostgreSQL connections.
  
  It protects the server from accepting an unlimited number of backend sessions.
  
  Increasing max_connections is not free.
  
  More possible connections can mean:
  
  - more backend processes
  - more memory overhead
  - more concurrent work
  - more lock contention
  - more CPU scheduling pressure
  
  A database with connection exhaustion often needs better pooling or connection budgeting rather than simply a larger max_connections value.`,

        keyPoints: [
          "max_connections limits concurrent sessions.",
          "Higher connection limits increase potential resource usage.",
          "Connection exhaustion is often an architecture problem.",
          "Pooling is usually preferable to unlimited direct connections.",
        ],

        importantTerms: [
          "max_connections",
          "Connection Limit",
          "Connection Exhaustion",
        ],

        diagram: `
  max_connections = 200
  
  Applications
       │
       ▼
  ┌──────────────────────┐
  │ 200 connection slots │
  └──────────────────────┘
  
  201st connection
        │
        ▼
  Rejected unless a slot becomes available
        `,

        commands: [
          "SHOW max_connections;",
          "SELECT COUNT(*) AS current_connections FROM pg_stat_activity;",
        ],

        warning:
          "Do not increase max_connections without checking RAM, workload concurrency, pool sizes, and reserved administrative capacity.",
      },

      {
        id: "18-3",
        title: "18.3. Connection States",

        content: `A PostgreSQL session can exist in different states.
  
  Important examples include:
  
  active
  The backend is currently executing a query.
  
  idle
  The connection exists but is waiting for another client command.
  
  idle in transaction
  A transaction has been opened, but the client is not currently executing a statement.
  
  idle in transaction is especially important.
  
  An open transaction can retain snapshots, locks, and old row-version visibility requirements.
  
  This can interfere with VACUUM and contribute to bloat.`,

        keyPoints: [
          "Active sessions are executing work.",
          "Idle sessions are connected but not executing SQL.",
          "Idle-in-transaction sessions still have an open transaction.",
          "Idle transactions can hold locks and old snapshots.",
        ],

        importantTerms: [
          "active",
          "idle",
          "idle in transaction",
          "Session State",
        ],

        diagram: `
  Connection
  
  ├── active
  │     └── executing SQL
  │
  ├── idle
  │     └── waiting for client
  │
  └── idle in transaction
        └── transaction still open
        `,

        commands: [
          "SELECT pid, usename, state, query FROM pg_stat_activity ORDER BY state;",
        ],

        warning:
          "Idle in transaction is far more dangerous than a normal idle connection.",
      },

      {
        id: "18-4",
        title: "18.4. Connection Budgeting",

        content: `In a microservice architecture, total database connections are the sum of every pool across every running instance.
  
  For example:
  
  20 services
  × 5 pods each
  × 20 database connections
  
  = 2,000 possible PostgreSQL connections
  
  This can overwhelm a database even though each individual service appears to use a reasonable pool size.
  
  Connection budgeting should therefore be performed globally.`,

        keyPoints: [
          "Pool sizes multiply across replicas and services.",
          "Connection limits must be budgeted globally.",
          "Autoscaling can unexpectedly multiply database connections.",
          "Leave capacity for administrators, migrations, monitoring, and failover.",
        ],

        importantTerms: [
          "Connection Budget",
          "Pool Size",
          "Autoscaling",
          "Microservices",
        ],

        diagram: `
  10 services
     ×
  10 pods
     ×
  20 connections
  
        =
  
  2,000 potential DB sessions
        `,

        commands: [
          "SELECT usename, application_name, COUNT(*) FROM pg_stat_activity GROUP BY usename, application_name ORDER BY COUNT(*) DESC;",
        ],

        warning:
          "Application autoscaling without database connection budgeting can exhaust PostgreSQL unexpectedly.",
      },

      {
        id: "18-5",
        title: "18.5. Connection Timeouts",

        content: `PostgreSQL provides settings that can protect against problematic session behavior.
  
  Examples include:
  
  statement_timeout
  Limits how long a statement may execute.
  
  lock_timeout
  Limits how long a statement waits to acquire a lock.
  
  idle_in_transaction_session_timeout
  Terminates sessions that remain idle while holding an open transaction for too long.
  
  These settings are useful safety controls in production systems.`,

        keyPoints: [
          "statement_timeout limits query execution time.",
          "lock_timeout limits lock waiting.",
          "idle_in_transaction_session_timeout protects against abandoned transactions.",
          "Timeouts should reflect application requirements.",
        ],

        importantTerms: [
          "statement_timeout",
          "lock_timeout",
          "idle_in_transaction_session_timeout",
        ],

        diagram: `
  Query Running Too Long
        │
        └── statement_timeout
  
  
  Waiting on Lock Too Long
        │
        └── lock_timeout
  
  
  Transaction Open but Idle
        │
        └── idle_in_transaction_session_timeout
        `,

        commands: [
          "SHOW statement_timeout;",
          "SHOW lock_timeout;",
          "SHOW idle_in_transaction_session_timeout;",
        ],

        warning:
          "Very aggressive timeout values can terminate legitimate long-running operations.",
      },
    ],
  },

  // =========================================================
  // MODULE 19 — PGBOUNCER
  // =========================================================
  {
    id: "doc-19",
    title: "19. PgBouncer & Connection Pooling",
    description:
      "Understand why connection pooling matters, how PgBouncer reduces PostgreSQL backend connections, and the differences between session, transaction, and statement pooling.",

    chapters: [
      {
        id: "19-1",
        title: "19.1. Why Connection Pooling Exists",

        content: `Applications may need many logical client connections while PostgreSQL should maintain far fewer physical backend connections.
  
  A connection pool sits between applications and PostgreSQL.
  
  Applications connect to the pool.
  
  The pool reuses a smaller number of PostgreSQL connections.
  
  This reduces:
  
  - connection creation overhead
  - backend process count
  - memory consumption
  - connection spikes
  
  PgBouncer is one of the most common lightweight PostgreSQL connection poolers.`,

        keyPoints: [
          "Connection pools reuse database connections.",
          "Applications can have more logical sessions than PostgreSQL backends.",
          "Pooling protects PostgreSQL from connection spikes.",
          "PgBouncer is a popular PostgreSQL pooler.",
        ],

        importantTerms: [
          "Connection Pool",
          "PgBouncer",
          "Client Connection",
          "Server Connection",
        ],

        diagram: `
  500 Application Connections
            │
            ▼
        PgBouncer
            │
            ▼
  50 PostgreSQL Connections
        `,

        commands: [],

        warning: null,
      },

      {
        id: "19-2",
        title: "19.2. Session Pooling",

        content: `In session pooling mode, one PostgreSQL server connection is assigned to a client for the entire client session.
  
  The connection is returned to the pool only when the client disconnects.
  
  This preserves session-level behavior well.
  
  However, it provides less multiplexing than transaction pooling because long-lived application connections continue occupying PostgreSQL connections.`,

        keyPoints: [
          "One server connection remains assigned for the client session.",
          "Session state is naturally preserved.",
          "Pooling efficiency is lower than transaction pooling.",
        ],

        importantTerms: ["Session Pooling", "Session State"],

        diagram: `
  Client A
     │
     └──────── PostgreSQL Connection A
                 entire session
  
  
  Client B
     │
     └──────── PostgreSQL Connection B
        `,

        commands: [],

        warning: null,
      },

      {
        id: "19-3",
        title: "19.3. Transaction Pooling",

        content: `Transaction pooling assigns a PostgreSQL connection to a client only for the duration of a transaction.
  
  After COMMIT or ROLLBACK, the server connection can be reused by another client.
  
  This provides much stronger connection multiplexing.
  
  However, application code must not assume that the same physical PostgreSQL connection will handle the next transaction.
  
  Session-specific behavior must therefore be reviewed carefully.`,

        keyPoints: [
          "Server connections are assigned per transaction.",
          "Connections return to the pool after transaction completion.",
          "Transaction pooling provides strong multiplexing.",
          "Session-level assumptions can break.",
        ],

        importantTerms: [
          "Transaction Pooling",
          "Multiplexing",
          "Session State",
        ],

        diagram: `
  Client A
     │
   Transaction 1
     │
     ▼
  DB Connection 1
     │
   COMMIT
     │
     ▼
  Pool
  
  
  Client B
     │
   Transaction
     │
     ▼
  Same DB Connection 1
        `,

        commands: [],

        warning:
          "Review temporary tables, session settings, LISTEN/NOTIFY behavior, advisory locks, and other session-dependent features when using transaction pooling.",
      },

      {
        id: "19-4",
        title: "19.4. Statement Pooling",

        content: `Statement pooling returns a PostgreSQL server connection after each statement.
  
  This provides extremely aggressive multiplexing.
  
  However, multi-statement transactions cannot work normally because consecutive statements are not guaranteed to use the same backend connection.
  
  For most transactional applications, statement pooling is therefore much more restrictive than transaction pooling.`,

        keyPoints: [
          "Connections are returned after each statement.",
          "Multi-statement transactions become problematic.",
          "Statement pooling is highly restrictive.",
        ],

        importantTerms: ["Statement Pooling", "Transaction Boundary"],

        diagram: `
  Statement 1
     │
     ▼
  Connection A
     │
   return
  
  
  Statement 2
     │
     ▼
  Connection B
        `,

        commands: [],

        warning:
          "Statement pooling is not appropriate for applications that require normal multi-statement transactions.",
      },

      {
        id: "19-5",
        title: "19.5. Pool Size",

        content: `A database pool should be sized around useful database concurrency rather than application request count.
  
  Suppose:
  
  200 application requests are waiting.
  
  That does not necessarily mean PostgreSQL should execute 200 database queries simultaneously.
  
  Too much concurrency can increase:
  
  - CPU contention
  - lock contention
  - I/O contention
  - cache churn
  - latency
  
  A smaller pool can sometimes increase overall throughput by controlling concurrency.`,

        keyPoints: [
          "More connections do not always increase throughput.",
          "Pool size controls database concurrency.",
          "Too much concurrency can make every query slower.",
          "Pool sizing should be measured.",
        ],

        importantTerms: ["Pool Size", "Concurrency", "Throughput", "Queueing"],

        diagram: `
  Application Requests
          500
           │
           ▼
        PgBouncer
           │
      Pool Size 40
           │
           ▼
  PostgreSQL executes
  controlled concurrency
        `,

        commands: [],

        warning: "Do not set pool size equal to peak HTTP concurrency.",
      },
    ],
  },

  // =========================================================
  // MODULE 20 — PG_STAT_ACTIVITY
  // =========================================================
  {
    id: "doc-20",
    title: "20. pg_stat_activity",
    description:
      "Learn how to inspect live PostgreSQL sessions, active queries, transaction age, idle transactions, waiting sessions, and problematic backends.",

    chapters: [
      {
        id: "20-1",
        title: "20.1. What is pg_stat_activity?",

        content: `pg_stat_activity is one of PostgreSQL's most important monitoring views.
  
  It shows information about current database sessions.
  
  Useful columns include:
  
  pid
  datname
  usename
  application_name
  client_addr
  state
  query
  query_start
  xact_start
  wait_event_type
  wait_event
  
  It provides a live view of what connected sessions are doing.`,

        keyPoints: [
          "pg_stat_activity shows current sessions.",
          "It exposes query and transaction timing.",
          "It exposes connection state.",
          "It exposes wait information.",
        ],

        importantTerms: [
          "pg_stat_activity",
          "PID",
          "query_start",
          "xact_start",
        ],

        diagram: `
  PostgreSQL
  
  Connection 1 ─ active
  Connection 2 ─ idle
  Connection 3 ─ idle in transaction
  Connection 4 ─ waiting
  
          │
          ▼
  
  pg_stat_activity
        `,

        commands: ["SELECT * FROM pg_stat_activity;"],

        warning:
          "Visibility into other sessions may depend on role privileges.",
      },

      {
        id: "20-2",
        title: "20.2. Find Active Queries",

        content: `To investigate current workload, filter sessions whose state is active.
  
  You can calculate query duration using:
  
  now() - query_start
  
  Sorting by query duration helps identify queries that have been executing for a long time.`,

        keyPoints: [
          "Active sessions are currently executing work.",
          "query_start allows runtime calculation.",
          "Long-running queries deserve investigation but are not automatically bad.",
        ],

        importantTerms: ["Active Query", "query_start", "Query Duration"],

        diagram: `
  Active Queries
  
  Query A → 20 ms
  Query B → 2 sec
  Query C → 8 min  ← investigate
        `,

        commands: [
          "SELECT pid, usename, now() - query_start AS duration, query FROM pg_stat_activity WHERE state = 'active' AND pid <> pg_backend_pid() ORDER BY duration DESC;",
        ],

        warning:
          "A long-running query can be legitimate, such as reporting, maintenance, or migration work.",
      },

      {
        id: "20-3",
        title: "20.3. Find Idle Transactions",

        content: `Idle-in-transaction sessions are especially important.
  
  They represent clients that opened a transaction but are currently not executing a statement.
  
  Such sessions can:
  
  - retain old snapshots
  - prevent VACUUM cleanup
  - hold locks
  - increase bloat
  - block other sessions
  
  Transaction age can be calculated from xact_start.`,

        keyPoints: [
          "Idle transactions remain open.",
          "They can hold snapshots and locks.",
          "Long idle transactions can interfere with VACUUM.",
        ],

        importantTerms: ["idle in transaction", "xact_start", "Old Snapshot"],

        diagram: `
  BEGIN
    │
    ▼
  SELECT / UPDATE
    │
    ▼
  Application stops sending SQL
    │
    ▼
  idle in transaction
    │
    ├── locks may remain
    └── snapshot may remain
        `,

        commands: [
          "SELECT pid, usename, now() - xact_start AS transaction_age, query FROM pg_stat_activity WHERE state = 'idle in transaction' ORDER BY xact_start;",
        ],

        warning:
          "Long idle-in-transaction sessions should be treated as an application or operational issue.",
      },

      {
        id: "20-4",
        title: "20.4. Wait Events",

        content: `A backend can be active but waiting for something.
  
  PostgreSQL exposes:
  
  wait_event_type
  wait_event
  
  Examples of waits can involve:
  
  - locks
  - client activity
  - I/O
  - WAL
  - lightweight locks
  - IPC
  
  Wait information helps answer an important question:
  
  Is the query actively consuming CPU, or is it waiting for another resource?`,

        keyPoints: [
          "Active does not necessarily mean running on CPU.",
          "Backends can wait on locks, I/O, clients, or internal resources.",
          "wait_event_type and wait_event help diagnose waits.",
        ],

        importantTerms: [
          "wait_event",
          "wait_event_type",
          "Lock Wait",
          "I/O Wait",
        ],

        diagram: `
  Active Backend
       │
       ▼
  Running or Waiting?
       │
    ┌──┴─────────┐
    ▼            ▼
  CPU         Wait Event
                │
                ├── Lock
                ├── IO
                ├── Client
                └── WAL
        `,

        commands: [
          "SELECT pid, state, wait_event_type, wait_event, query FROM pg_stat_activity WHERE wait_event IS NOT NULL;",
        ],

        warning: null,
      },

      {
        id: "20-5",
        title: "20.5. Cancel vs Terminate",

        content: `PostgreSQL provides two useful administrative functions.
  
  pg_cancel_backend(pid)
  
  Requests cancellation of the currently executing query while leaving the session connected.
  
  pg_terminate_backend(pid)
  
  Terminates the entire backend session.
  
  Cancellation is generally less disruptive and should be preferred when stopping only one problematic query is sufficient.`,

        keyPoints: [
          "pg_cancel_backend cancels the current query.",
          "pg_terminate_backend ends the session.",
          "Termination is more disruptive.",
        ],

        importantTerms: [
          "pg_cancel_backend",
          "pg_terminate_backend",
          "Backend PID",
        ],

        diagram: `
  Problem Query
       │
       ├── cancel
       │      └── connection survives
       │
       └── terminate
              └── connection closed
        `,

        commands: [
          "SELECT pg_cancel_backend(12345);",
          "SELECT pg_terminate_backend(12345);",
        ],

        warning:
          "Do not terminate unknown production sessions without understanding what they are doing and what transaction will be rolled back.",
      },
    ],
  },

  // =========================================================
  // MODULE 21 — PG_STAT_STATEMENTS
  // =========================================================
  {
    id: "doc-21",
    title: "21. pg_stat_statements",
    description:
      "Understand PostgreSQL's query-level workload statistics, how normalized queries are aggregated, and how to identify expensive or frequently executed SQL.",

    chapters: [
      {
        id: "21-1",
        title: "21.1. Why pg_stat_statements Matters",

        content: `pg_stat_activity tells you what is happening right now.
  
  pg_stat_statements helps answer what has been happening over time.
  
  It groups normalized SQL statements and records execution statistics.
  
  This makes it one of the most valuable PostgreSQL performance tools.
  
  It can help identify:
  
  - queries consuming the most total execution time
  - frequently called queries
  - queries with high average execution time
  - queries reading many blocks
  - queries generating temporary-file activity`,

        keyPoints: [
          "pg_stat_statements aggregates historical query statistics.",
          "It complements pg_stat_activity.",
          "It helps identify workload-wide performance problems.",
        ],

        importantTerms: [
          "pg_stat_statements",
          "Normalized Query",
          "Execution Statistics",
        ],

        diagram: `
  Thousands of Queries
  
  SELECT ... id=1
  SELECT ... id=2
  SELECT ... id=3
  
          │
          ▼
  
  Normalized Statement
  
  SELECT ... id=$1
  
          │
          ▼
  
  Aggregated Statistics
        `,

        commands: ["CREATE EXTENSION IF NOT EXISTS pg_stat_statements;"],

        warning:
          "pg_stat_statements normally requires the module to be loaded through PostgreSQL configuration before the extension can collect statistics.",
      },

      {
        id: "21-2",
        title: "21.2. Calls, Total Time and Mean Time",

        content: `Important pg_stat_statements metrics include:
  
  calls
  How many times the statement executed.
  
  total_exec_time
  Total execution time accumulated across all calls.
  
  mean_exec_time
  Average execution time per execution.
  
  A query taking only 5 milliseconds may still be the biggest database cost if it runs millions of times.
  
  This is why total execution time is often more useful than looking only at individually slow queries.`,

        keyPoints: [
          "calls measures frequency.",
          "total_exec_time measures cumulative workload cost.",
          "mean_exec_time measures average runtime.",
          "Fast but extremely frequent queries can dominate database load.",
        ],

        importantTerms: ["calls", "total_exec_time", "mean_exec_time"],

        diagram: `
  Query A
  1000 ms
  × 10 calls
  = 10 sec total
  
  
  Query B
  5 ms
  × 1,000,000 calls
  = 5,000 sec total
  
  Query B costs far more overall.
        `,

        commands: [
          "SELECT query, calls, total_exec_time, mean_exec_time FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 20;",
        ],

        warning: null,
      },

      {
        id: "21-3",
        title: "21.3. Buffer Statistics",

        content: `pg_stat_statements can also expose block statistics.
  
  Useful examples include:
  
  shared_blks_hit
  shared_blks_read
  temp_blks_read
  temp_blks_written
  
  These help distinguish CPU-heavy queries from I/O-heavy queries and queries that spill work into temporary files.`,

        keyPoints: [
          "Query statistics can include shared-buffer activity.",
          "Temporary block activity can expose disk spills.",
          "I/O statistics improve query diagnosis.",
        ],

        importantTerms: [
          "shared_blks_hit",
          "shared_blks_read",
          "temp_blks_written",
        ],

        diagram: `
  Query
  
  ├── shared hits
  ├── shared reads
  ├── temp reads
  └── temp writes
  
         │
         ▼
  Understand I/O behavior
        `,

        commands: [
          "SELECT query, calls, shared_blks_hit, shared_blks_read, temp_blks_written FROM pg_stat_statements ORDER BY shared_blks_read DESC LIMIT 20;",
        ],

        warning: null,
      },

      {
        id: "21-4",
        title: "21.4. Find the Most Expensive Queries",

        content: `There is no single definition of an expensive query.
  
  Different useful rankings include:
  
  highest total execution time
  highest mean execution time
  highest number of calls
  most shared blocks read
  most temporary data written
  
  Each reveals a different type of optimization opportunity.
  
  Performance tuning should therefore use several dimensions rather than only sorting by average query duration.`,

        keyPoints: [
          "Expensive can mean slow, frequent, I/O-heavy, or temp-heavy.",
          "Different rankings identify different problems.",
          "Workload optimization requires context.",
        ],

        importantTerms: ["Top SQL", "Total Cost", "Mean Cost", "Frequency"],

        diagram: `
  Query Analysis
  
  ├── Total Time
  ├── Mean Time
  ├── Calls
  ├── Disk Reads
  └── Temp Writes
        `,

        commands: [
          "SELECT query, calls, total_exec_time, mean_exec_time FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 20;",
        ],

        warning: null,
      },

      {
        id: "21-5",
        title: "21.5. Reset Statistics",

        content: `pg_stat_statements statistics accumulate.
  
  During controlled performance testing, you may want to reset them so a new test starts from a clean measurement window.
  
  PostgreSQL provides a reset function.
  
  This should be used carefully because accumulated production statistics are valuable diagnostic information.`,

        keyPoints: [
          "Statistics accumulate over time.",
          "Resetting creates a new measurement window.",
          "Production history can be valuable.",
        ],

        importantTerms: ["pg_stat_statements_reset", "Statistics Window"],

        diagram: `
  Existing Statistics
         │
         ▼
  Reset
         │
         ▼
  New Measurement Window
        `,

        commands: ["SELECT pg_stat_statements_reset();"],

        warning:
          "Do not reset production query statistics casually when they may be needed for incident investigation.",
      },
    ],
  },

  // =========================================================
  // MODULE 22 — MONITORING
  // =========================================================
  {
    id: "doc-22",
    title: "22. PostgreSQL Monitoring",
    description:
      "Build a practical PostgreSQL monitoring model covering connections, transactions, cache behavior, table activity, WAL, checkpoints, locks, temporary files, and replication.",

    chapters: [
      {
        id: "22-1",
        title: "22.1. What Should You Monitor?",

        content: `Production PostgreSQL monitoring should cover multiple layers.
  
  Important categories include:
  
  Connections
  Transactions
  Queries
  Locks
  Cache
  Disk I/O
  WAL
  Checkpoints
  VACUUM
  Dead tuples
  Table size
  Index size
  Temporary files
  Replication lag
  Disk capacity
  
  Monitoring only CPU and memory is not enough to understand PostgreSQL health.`,

        keyPoints: [
          "Database monitoring requires multiple categories.",
          "Query and transaction behavior matter as much as infrastructure metrics.",
          "Storage and maintenance metrics are essential.",
        ],

        importantTerms: [
          "Database Observability",
          "Metrics",
          "Workload Monitoring",
        ],

        diagram: `
  PostgreSQL Monitoring
  
  ├── Connections
  ├── Queries
  ├── Transactions
  ├── Locks
  ├── Cache
  ├── Storage
  ├── WAL
  ├── Vacuum
  ├── Checkpoints
  └── Replication
        `,

        commands: [],

        warning: null,
      },

      {
        id: "22-2",
        title: "22.2. Database-Level Statistics",

        content: `pg_stat_database provides database-wide statistics.
  
  Useful fields include:
  
  xact_commit
  xact_rollback
  blks_read
  blks_hit
  tup_returned
  tup_fetched
  tup_inserted
  tup_updated
  tup_deleted
  temp_files
  temp_bytes
  deadlocks
  
  These metrics provide a high-level picture of database activity.`,

        keyPoints: [
          "pg_stat_database provides database-level counters.",
          "It includes transaction, cache, row, temp-file, and deadlock statistics.",
          "It is useful for workload trends.",
        ],

        importantTerms: [
          "pg_stat_database",
          "xact_commit",
          "xact_rollback",
          "deadlocks",
        ],

        diagram: `
  pg_stat_database
  
  ├── transactions
  ├── cache
  ├── tuples
  ├── temp files
  └── deadlocks
        `,

        commands: [
          "SELECT * FROM pg_stat_database WHERE datname = current_database();",
        ],

        warning: null,
      },

      {
        id: "22-3",
        title: "22.3. Table Statistics",

        content: `pg_stat_user_tables provides statistics for application tables.
  
  Useful information includes:
  
  seq_scan
  idx_scan
  n_tup_ins
  n_tup_upd
  n_tup_del
  n_tup_hot_upd
  n_live_tup
  n_dead_tup
  last_vacuum
  last_autovacuum
  last_analyze
  last_autoanalyze
  
  These statistics are valuable for diagnosing table access patterns and maintenance behavior.`,

        keyPoints: [
          "Table statistics show scans and modifications.",
          "They expose live and dead tuple estimates.",
          "They expose VACUUM and ANALYZE history.",
        ],

        importantTerms: [
          "pg_stat_user_tables",
          "seq_scan",
          "idx_scan",
          "n_dead_tup",
        ],

        diagram: `
  orders
  
  ├── seq_scan
  ├── idx_scan
  ├── inserts
  ├── updates
  ├── deletes
  ├── dead tuples
  └── autovacuum history
        `,

        commands: [
          "SELECT relname, seq_scan, idx_scan, n_live_tup, n_dead_tup, last_autovacuum FROM pg_stat_user_tables ORDER BY n_dead_tup DESC;",
        ],

        warning:
          "A high sequential-scan count is not automatically a problem. Small tables and large-result queries often correctly use sequential scans.",
      },

      {
        id: "22-4",
        title: "22.4. Index Statistics",

        content: `pg_stat_user_indexes helps show whether indexes are being used.
  
  Useful information includes:
  
  idx_scan
  idx_tup_read
  idx_tup_fetch
  
  An index with almost no scans may deserve investigation.
  
  However, an apparently unused index may still exist for:
  
  - uniqueness
  - rare but important queries
  - foreign-key-related workloads
  - maintenance or operational queries
  
  Never remove an index based on one counter alone.`,

        keyPoints: [
          "Index statistics help identify usage patterns.",
          "Low idx_scan can indicate an unused index.",
          "Indexes may serve constraints or rare critical paths.",
          "Removal requires workload analysis.",
        ],

        importantTerms: ["pg_stat_user_indexes", "idx_scan", "Unused Index"],

        diagram: `
  Indexes
  
  idx_users_email
    idx_scan = 2,000,000
  
  idx_users_old_field
    idx_scan = 0
  
         │
         ▼
  Investigate
  not automatically drop
        `,

        commands: [
          "SELECT relname, indexrelname, idx_scan, idx_tup_read, idx_tup_fetch FROM pg_stat_user_indexes ORDER BY idx_scan;",
        ],

        warning:
          "Do not drop an index solely because idx_scan is zero during one statistics window.",
      },

      {
        id: "22-5",
        title: "22.5. Temporary Files",

        content: `Large sorts and hash operations can spill to disk.
  
  PostgreSQL tracks temporary-file activity.
  
  Important database-level metrics include:
  
  temp_files
  temp_bytes
  
  Rapid temp-file growth can indicate:
  
  - large sorts
  - hash spills
  - expensive analytics
  - insufficient operation memory
  - poor execution plans
  
  The correct solution is not always increasing work_mem.`,

        keyPoints: [
          "Temporary files indicate disk-based query work.",
          "Sorts and hashes commonly create temp files.",
          "High temp usage can indicate expensive execution plans.",
        ],

        importantTerms: ["temp_files", "temp_bytes", "Disk Spill"],

        diagram: `
  Query
    │
    ▼
  Sort / Hash
    │
    ├── fits memory → RAM
    │
    └── too large   → temp file
        `,

        commands: [
          "SELECT datname, temp_files, pg_size_pretty(temp_bytes) AS temp_written FROM pg_stat_database ORDER BY temp_bytes DESC;",
        ],

        warning: null,
      },

      {
        id: "22-6",
        title: "22.6. Locks and Deadlocks",

        content: `PostgreSQL exposes lock information through pg_locks.
  
  Lock monitoring is useful when:
  
  - queries are waiting unexpectedly
  - transactions block each other
  - DDL appears stuck
  - migrations block application traffic
  
  PostgreSQL also tracks detected deadlocks at the database level.
  
  A deadlock is different from ordinary lock waiting.
  
  PostgreSQL detects deadlock cycles and aborts one transaction to resolve them.`,

        keyPoints: [
          "pg_locks exposes lock state.",
          "Waiting does not necessarily mean deadlock.",
          "Deadlocks are cycles of conflicting waits.",
          "PostgreSQL automatically resolves detected deadlocks by aborting a transaction.",
        ],

        importantTerms: ["pg_locks", "Blocking", "Waiting", "Deadlock"],

        diagram: `
  Transaction A
  locks Row 1
  wants Row 2
  
  Transaction B
  locks Row 2
  wants Row 1
  
        │
        ▼
  Deadlock Cycle
        │
        ▼
  PostgreSQL aborts one
        `,

        commands: [
          "SELECT * FROM pg_locks;",
          "SELECT datname, deadlocks FROM pg_stat_database;",
        ],

        warning: null,
      },
    ],
  },

  // =========================================================
  // MODULE 23 — SLOW QUERY INVESTIGATION
  // =========================================================
  {
    id: "doc-23",
    title: "23. Slow Query Investigation",
    description:
      "Learn a repeatable production workflow for identifying expensive SQL, reading execution plans, comparing estimates with reality, detecting I/O and memory problems, and fixing the actual bottleneck.",

    chapters: [
      {
        id: "23-1",
        title: "23.1. Start with the Query",

        content: `When an API endpoint is slow, do not immediately add an index.
  
  First identify the SQL actually executed.
  
  With ORMs, the generated SQL may differ significantly from what application code appears to express.
  
  Useful sources include:
  
  - application query logs
  - pg_stat_activity
  - pg_stat_statements
  - slow-query logging
  - tracing systems
  
  Optimization should start from the real SQL and real parameters or realistic parameter patterns.`,

        keyPoints: [
          "Find the actual SQL first.",
          "Do not optimize application abstractions instead of database queries.",
          "ORM-generated SQL should be inspected.",
        ],

        importantTerms: ["Slow Query", "Generated SQL", "ORM", "Query Logging"],

        diagram: `
  Slow API
     │
     ▼
  Find Actual SQL
     │
     ▼
  Measure Query
     │
     ▼
  Analyze Plan
        `,

        commands: [],

        warning:
          "Do not add indexes based only on assumptions about what SQL the application generates.",
      },

      {
        id: "23-2",
        title: "23.2. Find Expensive SQL",

        content: `pg_stat_statements is often the best starting point for workload-wide query investigation.
  
  Start by examining:
  
  - total execution time
  - mean execution time
  - call count
  - block reads
  - temporary writes
  
  This identifies queries that matter most to the system rather than queries that merely look complex.`,

        keyPoints: [
          "Prioritize based on measured workload impact.",
          "Total time often matters more than one slow execution.",
          "I/O and temp activity provide additional context.",
        ],

        importantTerms: [
          "Top SQL",
          "Total Execution Time",
          "Mean Execution Time",
        ],

        diagram: `
  pg_stat_statements
         │
         ▼
  Top Queries
         │
         ├── total time
         ├── mean time
         ├── calls
         └── I/O
        `,

        commands: [
          "SELECT query, calls, total_exec_time, mean_exec_time FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 20;",
        ],

        warning: null,
      },

      {
        id: "23-3",
        title: "23.3. EXPLAIN ANALYZE",

        content: `After identifying the query, inspect its execution plan.
  
  EXPLAIN shows PostgreSQL's intended plan.
  
  EXPLAIN ANALYZE executes the query and reports actual behavior.
  
  Useful information includes:
  
  - plan node types
  - estimated rows
  - actual rows
  - loops
  - execution time
  - sort methods
  - memory
  - join strategies
  
  Adding BUFFERS exposes page-access behavior.`,

        keyPoints: [
          "EXPLAIN ANALYZE executes the query.",
          "Compare estimated and actual rows.",
          "Inspect scans, joins, sorts, and loops.",
          "BUFFERS exposes page activity.",
        ],

        importantTerms: [
          "EXPLAIN ANALYZE",
          "Plan Node",
          "Actual Rows",
          "Estimated Rows",
        ],

        diagram: `
  SQL
   │
   ▼
  EXPLAIN ANALYZE
   │
   ├── Scan
   ├── Join
   ├── Sort
   ├── Aggregate
   └── Actual vs Estimated
        `,

        commands: [
          "EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM orders WHERE user_id = 1;",
        ],

        warning:
          "EXPLAIN ANALYZE executes modifying statements too. Use care with INSERT, UPDATE, and DELETE.",
      },

      {
        id: "23-4",
        title: "23.4. Estimated Rows vs Actual Rows",

        content: `One of the most important plan-debugging techniques is comparing estimated rows with actual rows.
  
  Example:
  
  estimated rows = 100
  actual rows = 1,000,000
  
  This is a severe cardinality-estimation error.
  
  Bad estimates can cause PostgreSQL to choose an inappropriate:
  
  - join algorithm
  - scan strategy
  - join order
  - aggregation strategy
  
  Possible causes include:
  
  - stale statistics
  - unusual data distribution
  - correlated columns
  - expressions the planner cannot estimate well`,

        keyPoints: [
          "Large estimate errors can produce poor plans.",
          "Planner statistics are central to cost decisions.",
          "Statistics and data distribution should be checked before blindly adding indexes.",
        ],

        importantTerms: [
          "Cardinality",
          "Estimated Rows",
          "Actual Rows",
          "Statistics",
        ],

        diagram: `
  Planner expects
  100 rows
  
  Actual
  1,000,000 rows
  
        │
        ▼
  Wrong cost assumptions
        │
        ▼
  Possible bad plan
        `,

        commands: [
          "ANALYZE orders;",
          "SELECT * FROM pg_stats WHERE tablename = 'orders';",
        ],

        warning: null,
      },

      {
        id: "23-5",
        title: "23.5. Check Scan Type",

        content: `Common PostgreSQL scan strategies include:
  
  Sequential Scan
  Index Scan
  Index Only Scan
  Bitmap Index Scan
  Bitmap Heap Scan
  
  Do not assume Index Scan is always better.
  
  A Sequential Scan can be ideal when:
  
  - the table is small
  - a large percentage of rows is needed
  - random index lookups would cost more
  
  The important question is whether the selected scan matches the amount and distribution of data being requested.`,

        keyPoints: [
          "Different scan types suit different workloads.",
          "Sequential scans are not inherently bad.",
          "Index scans are useful for selective access.",
          "Bitmap scans often sit between highly selective and full-table access.",
        ],

        importantTerms: [
          "Seq Scan",
          "Index Scan",
          "Index Only Scan",
          "Bitmap Heap Scan",
        ],

        diagram: `
  Few Rows
     │
     └── Index Scan often useful
  
  
  Medium Set
     │
     └── Bitmap Scan may help
  
  
  Large Part of Table
     │
     └── Sequential Scan may win
        `,

        commands: [],

        warning: null,
      },

      {
        id: "23-6",
        title: "23.6. Check Join Strategy",

        content: `PostgreSQL commonly uses three major join algorithms.
  
  Nested Loop
  Useful when the outer side is small and indexed lookups into the inner side are cheap.
  
  Hash Join
  Useful for many equality joins where building a hash table is efficient.
  
  Merge Join
  Useful when sorted inputs can be efficiently combined.
  
  A poor join choice is often the result of incorrect row estimates rather than the join algorithm itself being bad.`,

        keyPoints: [
          "Nested Loop is good for small indexed lookups.",
          "Hash Join is common for larger equality joins.",
          "Merge Join uses ordered inputs.",
          "Cardinality estimates strongly influence join selection.",
        ],

        importantTerms: ["Nested Loop", "Hash Join", "Merge Join"],

        diagram: `
  JOIN
  
  ├── Nested Loop
  ├── Hash Join
  └── Merge Join
        `,

        commands: [],

        warning:
          "Avoid globally disabling planner join strategies as a permanent fix for one bad query.",
      },

      {
        id: "23-7",
        title: "23.7. Check Sort and Hash Spills",

        content: `Execution plans may reveal sorts or hashes that exceed memory and spill to temporary files.
  
  Look for evidence such as:
  
  external merge
  Disk usage
  hash batches greater than one
  temporary block reads or writes
  
  These can indicate:
  
  - a large intermediate result
  - insufficient operation memory
  - a poor plan
  - missing filtering
  - unnecessary sorting
  
  Increasing work_mem is only one possible solution.`,

        keyPoints: [
          "Sort and hash spills increase disk I/O.",
          "Spills can indicate query-design or planner problems.",
          "work_mem should not be increased blindly.",
        ],

        importantTerms: [
          "External Merge",
          "Hash Batch",
          "Temp File",
          "work_mem",
        ],

        diagram: `
  Large Operation
        │
        ▼
  Fits in work memory?
     ┌──┴──┐
     │YES  │NO
     ▼     ▼
   RAM    Temp Disk
        `,

        commands: [
          "SELECT datname, temp_files, temp_bytes FROM pg_stat_database WHERE datname = current_database();",
        ],

        warning: null,
      },

      {
        id: "23-8",
        title: "23.8. Optimization Workflow",

        content: `A practical slow-query workflow is:
  
  1. Identify the real SQL.
  2. Measure workload impact.
  3. Run EXPLAIN ANALYZE.
  4. Add BUFFERS.
  5. Compare estimated and actual rows.
  6. Inspect scan types.
  7. Inspect joins.
  8. Inspect sorts and hashes.
  9. Check indexes.
  10. Check statistics.
  11. Check returned row count.
  12. Check schema and data model.
  13. Measure again after the change.
  
  The objective is to fix the bottleneck demonstrated by evidence.`,

        keyPoints: [
          "Optimization should be evidence-driven.",
          "Measure before and after.",
          "Indexes are only one optimization tool.",
          "Statistics and data modeling matter.",
        ],

        importantTerms: ["Query Optimization", "Baseline", "Execution Plan"],

        diagram: `
  Slow Query
     │
     ▼
  Measure
     │
     ▼
  EXPLAIN ANALYZE
     │
     ▼
  Find Bottleneck
     │
     ▼
  Change
     │
     ▼
  Measure Again
        `,

        commands: ["EXPLAIN (ANALYZE, BUFFERS) SELECT ...;"],

        warning:
          "Never declare a query fixed without measuring the new execution behavior.",
      },
    ],
  },

  // =========================================================
  // MODULE 24 — REPLICATION
  // =========================================================
  {
    id: "doc-24",
    title: "24. PostgreSQL Replication",
    description:
      "Understand primary and replica architecture, physical streaming replication, logical replication, WAL sender and receiver processes, replication lag, and read consistency.",

    chapters: [
      {
        id: "24-1",
        title: "24.1. Primary and Replica",

        content: `Replication maintains copies of PostgreSQL data on additional database servers.
  
  A common architecture contains:
  
  Primary
  Accepts application writes.
  
  Replica
  Receives changes from the primary and replays them.
  
  Replicas can provide:
  
  - high availability
  - disaster recovery options
  - read scaling
  - backup offloading
  
  Replication does not replace backups.`,

        keyPoints: [
          "The primary normally accepts writes.",
          "Replicas receive changes from the primary.",
          "Replication supports availability and read scaling.",
          "Replication is not a backup.",
        ],

        importantTerms: ["Primary", "Replica", "Standby", "Replication"],

        diagram: `
  Application Writes
         │
         ▼
       Primary
         │
         │ replication
         ▼
       Replica
         │
         ▼
  Optional Reads
        `,

        commands: ["SELECT pg_is_in_recovery();"],

        warning:
          "Replication can reproduce accidental DELETE or DROP operations. It does not replace backups.",
      },

      {
        id: "24-2",
        title: "24.2. Physical Streaming Replication",

        content: `Physical streaming replication transfers WAL changes from the primary to a standby server.
  
  The standby replays those WAL records to reproduce the physical database state.
  
  This operates below the logical row level.
  
  Physical replicas are therefore closely tied to PostgreSQL's physical storage and WAL format.`,

        keyPoints: [
          "Physical replication streams WAL.",
          "The replica replays WAL records.",
          "It reproduces the physical database state.",
        ],

        importantTerms: [
          "Physical Replication",
          "Streaming Replication",
          "WAL Replay",
        ],

        diagram: `
  Primary
     │
     │ WAL Stream
     ▼
  Replica
     │
     ▼
  Replay WAL
     │
     ▼
  Replicated Database
        `,

        commands: ["SELECT * FROM pg_stat_replication;"],

        warning: null,
      },

      {
        id: "24-3",
        title: "24.3. WAL Sender and WAL Receiver",

        content: `Physical streaming replication uses specialized PostgreSQL processes.
  
  On the primary:
  
  WAL sender processes transmit WAL data.
  
  On the replica:
  
  A WAL receiver receives streaming WAL.
  
  The replica then replays WAL changes.
  
  Monitoring these processes helps determine whether replication is connected and progressing.`,

        keyPoints: [
          "WAL sender runs on the primary.",
          "WAL receiver runs on the replica.",
          "WAL replay applies changes.",
        ],

        importantTerms: ["WAL Sender", "WAL Receiver", "Replay"],

        diagram: `
  Primary
  
  WAL
   │
   ▼
  WAL Sender
   │
   │ network
   ▼
  WAL Receiver
   │
   ▼
  Replica WAL
   │
   ▼
  Replay
        `,

        commands: [
          "SELECT * FROM pg_stat_replication;",
          "SELECT * FROM pg_stat_wal_receiver;",
        ],

        warning: null,
      },

      {
        id: "24-4",
        title: "24.4. Asynchronous Replication",

        content: `In asynchronous replication, the primary can acknowledge a transaction before the replica confirms that it has safely received the corresponding WAL.
  
  This reduces application commit latency.
  
  However, if the primary fails before the replica receives recent WAL, some acknowledged transactions may be missing after failover.
  
  This creates a durability-versus-latency tradeoff.`,

        keyPoints: [
          "Asynchronous replication minimizes replica-related commit latency.",
          "Replica lag is possible.",
          "Recent acknowledged transactions may be missing after sudden primary failure.",
        ],

        importantTerms: ["Asynchronous Replication", "Replication Lag", "RPO"],

        diagram: `
  Client
    │
    ▼
  Primary COMMIT
    │
    ├── ACK Client
    │
    └──── WAL later ───→ Replica
        `,

        commands: [],

        warning:
          "Understand your acceptable data-loss window before designing failover around asynchronous replication.",
      },

      {
        id: "24-5",
        title: "24.5. Synchronous Replication",

        content: `Synchronous replication can require transaction commit processing to wait for confirmation from configured synchronous standbys.
  
  This can reduce the risk of losing acknowledged transactions during primary failure.
  
  The tradeoff is increased commit latency and stronger dependency on replica availability.
  
  The exact durability guarantee depends on synchronous replication configuration.`,

        keyPoints: [
          "Synchronous replication can wait for standby confirmation.",
          "It improves durability across primary failure.",
          "It increases latency.",
          "Replica availability can affect writes.",
        ],

        importantTerms: [
          "Synchronous Replication",
          "synchronous_standby_names",
          "Commit Latency",
        ],

        diagram: `
  Client
    │
    ▼
  Primary
    │
    ▼
  Replica confirmation
    │
    ▼
  Primary ACK
    │
    ▼
  Client
        `,

        commands: [
          "SHOW synchronous_standby_names;",
          "SHOW synchronous_commit;",
        ],

        warning:
          "Synchronous replication improves durability but can reduce availability or increase latency depending on configuration.",
      },

      {
        id: "24-6",
        title: "24.6. Read Replica Consistency",

        content: `Applications often send read traffic to replicas.
  
  However, asynchronous replicas may lag behind the primary.
  
  Consider:
  
  1. User updates profile on primary.
  2. API immediately reads profile from replica.
  3. Replica has not replayed the update yet.
  4. User receives stale data.
  
  This is known as a read-after-write consistency issue.
  
  Applications must decide which reads can tolerate replica lag.`,

        keyPoints: [
          "Replica reads can be stale.",
          "Read-after-write behavior must be designed.",
          "Critical immediate reads may need to use the primary.",
        ],

        importantTerms: [
          "Read Replica",
          "Stale Read",
          "Read-after-write",
          "Eventual Consistency",
        ],

        diagram: `
  WRITE
    │
    ▼
  Primary
    │
    │ WAL delayed
    ▼
  Replica
  
  
  Immediate READ
       │
       ▼
  Replica
  
  old value returned
        `,

        commands: [],

        warning:
          "Do not route all reads to replicas without considering read-after-write consistency.",
      },

      {
        id: "24-7",
        title: "24.7. Logical Replication",

        content: `Logical replication operates at a more logical change level than physical replication.
  
  PostgreSQL uses publications and subscriptions.
  
  Publisher:
  defines tables and changes to publish.
  
  Subscriber:
  receives and applies those changes.
  
  Logical replication can be useful for:
  
  - selective table replication
  - data distribution
  - some migrations
  - integrating databases with different replication requirements
  
  It differs significantly from physical standby replication.`,

        keyPoints: [
          "Logical replication uses publications and subscriptions.",
          "Specific tables can be replicated.",
          "It operates differently from physical WAL replay.",
        ],

        importantTerms: [
          "Logical Replication",
          "Publication",
          "Subscription",
          "Publisher",
          "Subscriber",
        ],

        diagram: `
  Publisher
  
  users
  orders
  products
  
    │
    │ logical changes
    ▼
  
  Subscriber
  
  users
  orders
        `,

        commands: [
          "SELECT * FROM pg_publication;",
          "SELECT * FROM pg_subscription;",
        ],

        warning:
          "Logical replication has different DDL, sequence, and object-management considerations than physical replication.",
      },
    ],
  },

  // =========================================================
  // MODULE 25 — REPLICATION SLOTS & LAG
  // =========================================================
  {
    id: "doc-25",
    title: "25. Replication Slots & Replication Lag",
    description:
      "Understand how replication slots prevent required WAL from being removed, how abandoned slots can fill disks, and how to measure receive, flush, replay, and logical replication lag.",

    chapters: [
      {
        id: "25-1",
        title: "25.1. What is a Replication Slot?",

        content: `A replication slot tells PostgreSQL that a replication consumer still requires certain WAL or logical changes.
  
  PostgreSQL therefore retains the required information until the consumer advances.
  
  Slots can be useful because they protect replicas or logical consumers from losing required WAL.
  
  But that guarantee has an operational cost:
  
  If the consumer stops progressing, PostgreSQL may continue retaining WAL.`,

        keyPoints: [
          "Replication slots retain required WAL or logical change information.",
          "They protect consumers from losing needed changes.",
          "A stalled consumer can cause retention to grow.",
        ],

        importantTerms: ["Replication Slot", "WAL Retention", "Consumer"],

        diagram: `
  Primary WAL
  
  [1][2][3][4][5][6][7][8]
            ▲             ▲
            │             │
       Slot needs       Current
       from here         WAL
  
  Old WAL cannot yet
  be removed
        `,

        commands: ["SELECT * FROM pg_replication_slots;"],

        warning:
          "Unused replication slots can retain large amounts of WAL and eventually fill disk.",
      },

      {
        id: "25-2",
        title: "25.2. Physical vs Logical Slots",

        content: `PostgreSQL supports different replication-slot types.
  
  Physical slots:
  Typically protect WAL required by physical replication consumers.
  
  Logical slots:
  Support logical decoding and logical replication consumers.
  
  Both can cause retention when consumers stop advancing, but their internal purposes differ.`,

        keyPoints: [
          "Physical slots support physical replication.",
          "Logical slots support logical decoding and replication.",
          "Both must be monitored for progress.",
        ],

        importantTerms: ["Physical Slot", "Logical Slot", "Logical Decoding"],

        diagram: `
  Replication Slots
  
  ├── Physical
  │     └── Physical Replica
  │
  └── Logical
        └── Logical Consumer
        `,

        commands: [
          "SELECT slot_name, slot_type, active, restart_lsn, confirmed_flush_lsn FROM pg_replication_slots;",
        ],

        warning: null,
      },

      {
        id: "25-3",
        title: "25.3. The Stuck Slot Failure Scenario",

        content: `One of the classic PostgreSQL production incidents involves an abandoned replication slot.
  
  Example:
  
  1. A consumer creates a slot.
  2. Consumer stops permanently.
  3. Slot remains.
  4. PostgreSQL assumes the consumer still needs old WAL.
  5. WAL continues accumulating.
  6. pg_wal consumes more disk.
  7. Disk eventually fills.
  
  A slot can therefore be healthy PostgreSQL behavior while simultaneously creating an operational incident because the consumer is no longer progressing.`,

        keyPoints: [
          "Inactive slots can retain WAL.",
          "Retained WAL can consume the filesystem.",
          "Slot monitoring is essential.",
        ],

        importantTerms: [
          "Inactive Slot",
          "restart_lsn",
          "Disk Full",
          "WAL Retention",
        ],

        diagram: `
  Consumer OFFLINE
        │
        ▼
  Slot Stops Advancing
        │
        ▼
  Old WAL Retained
        │
        ▼
  pg_wal grows
        │
        ▼
  Disk Full
        `,

        commands: [
          "SELECT slot_name, slot_type, active, restart_lsn FROM pg_replication_slots;",
        ],

        warning:
          "Never drop an unknown replication slot solely because it is inactive. First identify the consumer and recovery implications.",
      },

      {
        id: "25-4",
        title: "25.4. Measure Slot WAL Retention",

        content: `You can compare a slot's required WAL position with the current WAL position.
  
  pg_wal_lsn_diff can calculate the byte difference between two LSNs.
  
  This helps estimate how much WAL a slot is retaining.
  
  For example:
  
  current WAL position
  minus
  slot restart_lsn
  
  gives an indication of retained WAL distance for a physical requirement.
  
  Large and continuously increasing differences deserve investigation.`,

        keyPoints: [
          "LSN differences can measure retained WAL distance.",
          "restart_lsn identifies an important retention boundary.",
          "Increasing retention can indicate a stalled consumer.",
        ],

        importantTerms: ["restart_lsn", "pg_wal_lsn_diff", "Retained WAL"],

        diagram: `
  restart_lsn
       │
       ▼
  ─────●────────────────────────●
                                ▲
                                │
                       current WAL LSN
  
  Difference
  =
  retained WAL distance
        `,

        commands: [
          "SELECT slot_name, active, pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) AS retained_wal FROM pg_replication_slots WHERE restart_lsn IS NOT NULL;",
        ],

        warning: null,
      },

      {
        id: "25-5",
        title: "25.5. Replication Lag Stages",

        content: `Physical streaming replication has several progress stages.
  
  Conceptually:
  
  Primary generates WAL.
  
  Replica receives WAL.
  
  Replica writes WAL.
  
  Replica flushes WAL.
  
  Replica replays WAL.
  
  Lag can therefore exist at different stages.
  
  A replica might receive WAL quickly but replay it slowly because of heavy workload or storage limitations.`,

        keyPoints: [
          "Replication lag has multiple stages.",
          "Receive lag and replay lag are different.",
          "Slow replay does not necessarily mean slow network transfer.",
        ],

        importantTerms: ["sent_lsn", "write_lsn", "flush_lsn", "replay_lsn"],

        diagram: `
  Primary
  
  sent_lsn
     │
     ▼
  Network
     │
     ▼
  Replica
  
  write_lsn
     │
     ▼
  flush_lsn
     │
     ▼
  replay_lsn
        `,

        commands: [
          "SELECT pid, application_name, state, sent_lsn, write_lsn, flush_lsn, replay_lsn FROM pg_stat_replication;",
        ],

        warning: null,
      },

      {
        id: "25-6",
        title: "25.6. Byte-Based Replication Lag",

        content: `LSN differences can be used to estimate replication lag in bytes.
  
  For example:
  
  current WAL LSN
  minus
  replay_lsn
  
  provides an estimate of how much WAL the replica has not yet replayed.
  
  Byte-based lag can be more meaningful than time-based lag for some workloads because transaction volume can change drastically over time.`,

        keyPoints: [
          "LSN differences can measure lag in bytes.",
          "Replay lag represents unapplied WAL.",
          "Time lag and byte lag provide different perspectives.",
        ],

        importantTerms: ["Replay Lag", "Byte Lag", "pg_wal_lsn_diff"],

        diagram: `
  Primary Current LSN
          │
          ▼
  ───────────────●
  
  Replica Replay LSN
          │
          ▼
  ────●
  
  Distance = WAL lag
        `,

        commands: [
          "SELECT application_name, pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), replay_lsn)) AS replay_lag FROM pg_stat_replication WHERE replay_lsn IS NOT NULL;",
        ],

        warning: null,
      },

      {
        id: "25-7",
        title: "25.7. Replica Lag Causes",

        content: `Replication lag can have many causes.
  
  Examples include:
  
  - slow network
  - insufficient replica I/O
  - heavy primary WAL generation
  - replica CPU saturation
  - long-running replica queries
  - replay conflicts
  - resource contention
  - paused or failed replication
  - storage latency
  
  The correct response depends on which stage is falling behind.`,

        keyPoints: [
          "Replication lag is a symptom, not one specific problem.",
          "Network, storage, CPU, workload, and replay can all contribute.",
          "Measure each replication stage before diagnosing the cause.",
        ],

        importantTerms: [
          "Network Lag",
          "Replay Lag",
          "WAL Generation",
          "Replica I/O",
        ],

        diagram: `
  Replication Lag
        │
        ├── Network?
        ├── WAL generation?
        ├── Replica disk?
        ├── Replica CPU?
        ├── Replay?
        └── Consumer stopped?
        `,

        commands: ["SELECT * FROM pg_stat_replication;"],

        warning: null,
      },

      {
        id: "25-8",
        title: "25.8. Replication Monitoring Mental Model",

        content: `When monitoring replication, ask four questions:
  
  1. Is the replica or consumer connected?
  2. Is WAL being transmitted?
  3. Is the consumer advancing?
  4. Is retained WAL growing?
  
  For physical replicas, monitor:
  
  pg_stat_replication
  sent_lsn
  write_lsn
  flush_lsn
  replay_lsn
  
  For replication slots, monitor:
  
  active
  restart_lsn
  confirmed_flush_lsn
  retained WAL
  
  This separates normal replication delay from a dangerous WAL-retention problem.`,

        keyPoints: [
          "Connection state and progress are separate questions.",
          "Lag should be measured at several WAL stages.",
          "Replication slots require retention monitoring.",
          "Disk growth is a critical failure signal.",
        ],

        importantTerms: ["Replication Monitoring", "WAL Lag", "Slot Retention"],

        diagram: `
  Primary
    │
    ├── Is consumer connected?
    │
    ├── Is WAL moving?
    │
    ├── Is replay advancing?
    │
    └── Is retained WAL growing?
  
  
  Next:
  Backup & Restore
        `,

        commands: [
          "SELECT * FROM pg_stat_replication;",
          "SELECT * FROM pg_replication_slots;",
        ],

        warning:
          "Replication health and backup health are separate concerns. A perfectly healthy replica does not eliminate the need for backups.",
      },
    ],
  },

  // =========================================================
  // MODULE 26 — BACKUP & RESTORE
  // =========================================================
  {
    id: "doc-26",
    title: "26. Backup & Restore",
    description:
      "Understand PostgreSQL backup strategies, the difference between logical and physical backups, and when to use pg_dump, pg_restore, pg_dumpall, and pg_basebackup.",

    chapters: [
      {
        id: "26-1",
        title: "26.1. Why Backups Matter",

        content: `Replication is not the same as backup.
  
  If someone accidentally runs:
  
  DELETE FROM users;
  
  that DELETE can also be replicated to your standby.
  
  Backups provide an independent recovery point.
  
  A proper PostgreSQL backup strategy should protect against:
  
  - accidental DELETE
  - accidental DROP TABLE
  - bad migrations
  - application bugs
  - corruption
  - infrastructure failure
  - ransomware or operator mistakes
  
  PostgreSQL provides both logical and physical backup approaches.`,

        keyPoints: [
          "Replication does not replace backups.",
          "Backups provide independent recovery points.",
          "PostgreSQL supports logical and physical backups.",
          "A recovery plan matters as much as creating the backup.",
        ],

        importantTerms: [
          "Backup",
          "Restore",
          "Logical Backup",
          "Physical Backup",
          "Recovery Point",
        ],

        diagram: `
  Production Database
          │
          ├── Replica
          │     └── copies current changes
          │
          └── Backup
                └── independent recovery point
        `,

        commands: [],

        warning:
          "A backup that has never been restored and tested should not be assumed to be recoverable.",
      },

      {
        id: "26-2",
        title: "26.2. Logical vs Physical Backup",

        content: `PostgreSQL backups can broadly be divided into two categories.
  
  Logical Backup
  
  Stores logical database objects and data.
  
  Typical tools:
  
  pg_dump
  pg_dumpall
  
  Logical backups are useful when you want:
  
  - portability
  - selected database objects
  - selected schemas or tables
  - object-level restore
  - migrations between compatible PostgreSQL environments
  
  
  Physical Backup
  
  Copies the actual PostgreSQL cluster files.
  
  Typical tool:
  
  pg_basebackup
  
  Physical backups are useful for:
  
  - full cluster recovery
  - replication setup
  - PITR
  - disaster recovery
  
  Logical and physical backups solve different problems.`,

        keyPoints: [
          "Logical backups represent database objects and data logically.",
          "Physical backups copy the database cluster files.",
          "Logical backups offer more selective restore options.",
          "Physical backups are important for PITR and full-cluster recovery.",
        ],

        importantTerms: ["Logical Backup", "Physical Backup", "Cluster Backup"],

        diagram: `
  Backup Types
  
  ├── Logical
  │   ├── pg_dump
  │   └── pg_dumpall
  │
  └── Physical
      └── pg_basebackup
        `,

        commands: [],

        warning: null,
      },

      {
        id: "26-3",
        title: "26.3. pg_dump",

        content: `pg_dump creates a logical backup of one PostgreSQL database.
  
  It can back up:
  
  - the entire database
  - selected schemas
  - selected tables
  - schema only
  - data only
  
  pg_dump does not normally block regular database reads and writes while creating the backup.
  
  It uses PostgreSQL's transactional consistency mechanisms to obtain a consistent logical view of the database.`,

        keyPoints: [
          "pg_dump backs up one database.",
          "It creates a logical backup.",
          "It can select specific schemas or tables.",
          "It supports schema-only and data-only backups.",
          "It can run while the database remains online.",
        ],

        importantTerms: ["pg_dump", "Logical Dump", "Schema Dump", "Data Dump"],

        diagram: `
  Database
  
  ├── users
  ├── orders
  ├── products
  └── payments
  
       │
       ▼
  
     pg_dump
  
       │
       ▼
  
  Logical Backup File
        `,

        commands: [
          "pg_dump -d postgres_learning > backup.sql",
          "pg_dump -Fc -d postgres_learning -f backup.dump",
          "pg_dump -t users -d postgres_learning -f users.sql",
          "pg_dump --schema-only -d postgres_learning -f schema.sql",
        ],

        warning:
          "pg_dump backs up a single database, not every database and cluster-wide object.",
      },

      {
        id: "26-4",
        title: "26.4. pg_dump Output Formats",

        content: `pg_dump supports multiple output formats.
  
  Plain SQL
  
  Produces SQL statements.
  
  Example:
  
  backup.sql
  
  This can generally be restored using psql.
  
  
  Custom Format
  
  Created using:
  
  -Fc
  
  This format is designed for pg_restore.
  
  It supports:
  
  - selective restore
  - object ordering
  - parallel restore
  - compressed archive behavior
  
  
  Directory Format
  
  Created using:
  
  -Fd
  
  This can also support parallel backup and restore workflows.
  
  For many production backup workflows, custom or directory format is more flexible than plain SQL.`,

        keyPoints: [
          "Plain format produces SQL.",
          "Custom format is restored with pg_restore.",
          "Directory format supports flexible restore behavior.",
          "Archive formats support selective restore.",
        ],

        importantTerms: [
          "Plain Format",
          "Custom Format",
          "Directory Format",
          "-Fc",
          "-Fd",
        ],

        diagram: `
  pg_dump
  
  ├── Plain
  │    └── backup.sql
  │
  ├── Custom
  │    └── backup.dump
  │
  └── Directory
       └── backup_directory/
        `,

        commands: [
          "pg_dump -Fp -d postgres_learning -f backup.sql",
          "pg_dump -Fc -d postgres_learning -f backup.dump",
          "pg_dump -Fd -d postgres_learning -f backup_dir",
        ],

        warning: null,
      },

      {
        id: "26-5",
        title: "26.5. Restore Plain SQL Dumps",

        content: `A plain SQL dump contains SQL commands that recreate database objects and insert data.
  
  It is normally restored using psql.
  
  The destination database must usually already exist.
  
  The SQL file is then executed against that database.
  
  This approach is simple but provides less flexibility than pg_restore archive formats.`,

        keyPoints: [
          "Plain dumps are restored using psql.",
          "The destination database generally needs to exist first.",
          "The SQL file is executed like normal SQL.",
        ],

        importantTerms: ["psql", "Plain SQL Restore"],

        diagram: `
  backup.sql
      │
      ▼
     psql
      │
      ▼
  Target Database
        `,

        commands: [
          "createdb postgres_learning_restore",
          "psql -d postgres_learning_restore -f backup.sql",
        ],

        warning:
          "Review whether the dump contains object ownership or privileges that may conflict with the target environment.",
      },

      {
        id: "26-6",
        title: "26.6. pg_restore",

        content: `pg_restore restores backups created in archive formats such as custom and directory format.
  
  Unlike a plain SQL restore, pg_restore understands the archive structure.
  
  This allows features such as:
  
  - restoring selected tables
  - restoring selected schemas
  - restoring schema only
  - restoring data only
  - listing archive contents
  - parallel restore
  
  This makes pg_restore especially useful for large databases and selective recovery.`,

        keyPoints: [
          "pg_restore restores PostgreSQL archive backups.",
          "It supports selective restore.",
          "It supports parallel restore.",
          "It does not normally restore plain SQL files.",
        ],

        importantTerms: ["pg_restore", "Archive", "Parallel Restore"],

        diagram: `
  backup.dump
       │
       ▼
   pg_restore
       │
       ├── all objects
       ├── one table
       ├── one schema
       └── parallel restore
        `,

        commands: [
          "pg_restore -d postgres_learning_restore backup.dump",
          "pg_restore -l backup.dump",
          "pg_restore -t users -d postgres_learning_restore backup.dump",
          "pg_restore -j 4 -d postgres_learning_restore backup.dump",
        ],

        warning:
          "Parallel restore can increase CPU and I/O pressure significantly.",
      },

      {
        id: "26-7",
        title: "26.7. pg_dumpall",

        content: `pg_dumpall creates a logical dump across the PostgreSQL cluster.
  
  Unlike pg_dump, it can include cluster-wide objects such as:
  
  - roles
  - tablespaces
  - multiple databases
  
  Its output is plain SQL.
  
  One common use is backing up global objects such as roles separately from individual database dumps.`,

        keyPoints: [
          "pg_dumpall works across the PostgreSQL cluster.",
          "It can back up roles and other global objects.",
          "Its output is plain SQL.",
        ],

        importantTerms: ["pg_dumpall", "Global Objects", "Roles", "Cluster"],

        diagram: `
  PostgreSQL Cluster
  
  ├── Database A
  ├── Database B
  ├── Roles
  └── Tablespaces
  
          │
          ▼
      pg_dumpall
          │
          ▼
     cluster.sql
        `,

        commands: [
          "pg_dumpall > cluster.sql",
          "pg_dumpall --globals-only > globals.sql",
        ],

        warning:
          "pg_dumpall can become impractical for very large clusters because it produces a logical SQL dump.",
      },

      {
        id: "26-8",
        title: "26.8. pg_basebackup",

        content: `pg_basebackup creates a physical backup of an entire PostgreSQL cluster.
  
  Instead of producing logical INSERT and CREATE statements, it copies PostgreSQL's physical cluster files.
  
  This makes it useful for:
  
  - creating replica base copies
  - disaster recovery
  - PITR base backups
  - complete physical cluster recovery
  
  Because it is physical, restore behavior is very different from pg_dump.`,

        keyPoints: [
          "pg_basebackup creates a physical cluster backup.",
          "It copies PostgreSQL physical files.",
          "It is important for replication and PITR.",
          "It backs up the entire cluster.",
        ],

        importantTerms: [
          "pg_basebackup",
          "Base Backup",
          "Physical Backup",
          "Cluster",
        ],

        diagram: `
  PostgreSQL Cluster
         │
         ▼
    pg_basebackup
         │
         ▼
  Physical Copy
  
  ├── base/
  ├── global/
  ├── pg_wal/
  └── ...
        `,

        commands: [
          "pg_basebackup -h localhost -U replication_user -D /backup/base -Fp -Xs -P",
        ],

        warning:
          "A physical backup is tied much more closely to PostgreSQL server compatibility than a logical dump.",
      },

      {
        id: "26-9",
        title: "26.9. Backup Strategy Mental Model",

        content: `Use backup tools according to the recovery problem.
  
  Need one table or database?
  Use a logical backup.
  
  Need flexible object-level restore?
  Use pg_dump with archive format.
  
  Need roles and cluster globals?
  Use pg_dumpall --globals-only.
  
  Need full physical cluster recovery or PITR?
  Use physical base backups plus WAL archiving.
  
  A mature production strategy may use more than one backup type.`,

        keyPoints: [
          "No single backup type solves every recovery problem.",
          "Logical backups are flexible.",
          "Physical backups support complete recovery and PITR.",
          "Backups should be regularly restore-tested.",
        ],

        importantTerms: ["Backup Strategy", "Restore Test", "RPO", "RTO"],

        diagram: `
  Recovery Need
  
  Single Object
      │
      └── pg_dump
  
  
  Cluster Globals
      │
      └── pg_dumpall
  
  
  Full Cluster / PITR
      │
      └── pg_basebackup + WAL
        `,

        commands: [],

        warning:
          "Backup success logs are not enough. Periodically perform actual restore tests.",
      },
    ],
  },

  // =========================================================
  // MODULE 27 — PITR
  // =========================================================
  {
    id: "doc-27",
    title: "27. Point-In-Time Recovery (PITR)",
    description:
      "Understand how PostgreSQL combines a physical base backup with archived WAL to restore a database cluster to a specific point in time before an incident occurred.",

    chapters: [
      {
        id: "27-1",
        title: "27.1. What is PITR?",

        content: `PITR stands for Point-In-Time Recovery.
  
  It allows PostgreSQL to restore a cluster to a specific point in time rather than only to the moment when a backup was created.
  
  For example:
  
  10:00
  Base backup exists.
  
  13:42
  Someone accidentally deletes important data.
  
  With WAL archiving, PostgreSQL can restore the base backup and replay WAL only until a point immediately before the accidental DELETE.
  
  This is one of PostgreSQL's most important disaster-recovery capabilities.`,

        keyPoints: [
          "PITR means Point-In-Time Recovery.",
          "It combines a base backup with WAL history.",
          "Recovery can stop before an unwanted change.",
          "PITR provides finer recovery granularity than restoring only a static backup.",
        ],

        importantTerms: [
          "PITR",
          "Recovery Target",
          "Base Backup",
          "WAL Archive",
        ],

        diagram: `
  10:00
  Base Backup
     │
     ▼
  10:01 ─ WAL
  11:00 ─ WAL
  12:00 ─ WAL
  13:00 ─ WAL
  13:41 ─ WAL  ← recover here
  13:42 ─ DELETE disaster
  13:43 ─ WAL
        `,

        commands: [],

        warning:
          "PITR requires the required WAL history to still be available.",
      },

      {
        id: "27-2",
        title: "27.2. PITR Building Blocks",

        content: `A typical PITR setup requires two major components.
  
  Base Backup
  
  A physical copy of the PostgreSQL cluster at a known point.
  
  WAL Archive
  
  A continuous archive of WAL segments generated after the base backup.
  
  Recovery works conceptually as:
  
  Base Backup
  +
  Archived WAL
  =
  Database state at a later recovery target`,

        keyPoints: [
          "A base backup provides the starting physical database state.",
          "Archived WAL contains changes after that backup.",
          "Both are required for reliable PITR.",
        ],

        importantTerms: ["Base Backup", "Archived WAL", "Recovery Chain"],

        diagram: `
  Base Backup
       +
  WAL Segment 1
       +
  WAL Segment 2
       +
  WAL Segment 3
       +
  WAL Segment 4
  
       =
  Recovered Database
        `,

        commands: [],

        warning: "A missing required WAL segment can break the recovery chain.",
      },

      {
        id: "27-3",
        title: "27.3. WAL Archiving",

        content: `PITR requires WAL to be preserved outside the normal pg_wal lifecycle.
  
  PostgreSQL supports WAL archiving.
  
  Important configuration includes:
  
  archive_mode
  archive_command
  
  When a WAL segment is completed, PostgreSQL can invoke archive_command to copy it to durable archive storage.
  
  The archive destination should be independent and reliable.
  
  Examples may include:
  
  - dedicated filesystem
  - object storage through external tooling
  - backup platforms`,

        keyPoints: [
          "Normal WAL recycling is not enough for PITR.",
          "WAL must be archived.",
          "archive_mode enables archiving.",
          "archive_command handles copying completed WAL segments.",
        ],

        importantTerms: ["archive_mode", "archive_command", "WAL Archive"],

        diagram: `
  PostgreSQL
     │
     ▼
  pg_wal
     │
     │ completed segment
     ▼
  archive_command
     │
     ▼
  WAL Archive Storage
        `,

        commands: ["SHOW archive_mode;", "SHOW archive_command;"],

        warning:
          "If WAL archiving silently fails for too long, your expected PITR recovery window may not actually exist.",
      },

      {
        id: "27-4",
        title: "27.4. Recovery Target",

        content: `PostgreSQL recovery can be configured to stop at a target.
  
  Common recovery-target concepts include:
  
  time
  transaction ID
  named restore point
  LSN
  
  A time-based target is easy to understand.
  
  For example:
  
  Accidental DELETE occurred at:
  
  2026-10-02 15:43:10
  
  You may choose to recover to:
  
  2026-10-02 15:43:09
  
  PostgreSQL restores the base backup and replays WAL until the configured recovery target is reached.`,

        keyPoints: [
          "Recovery can stop at a specific target.",
          "Time is one common recovery target.",
          "Named restore points and LSNs can also be used.",
          "The target must exist within available WAL history.",
        ],

        importantTerms: [
          "recovery_target_time",
          "Recovery Target",
          "Restore Point",
          "LSN",
        ],

        diagram: `
  WAL Replay
  
  10:00
    │
    ▼
  11:00
    │
    ▼
  12:00
    │
    ▼
  13:42:59
    │
    ▼
  STOP
  
  13:43:00 bad event
  not replayed
        `,

        commands: [],

        warning:
          "Choosing the wrong target can replay the destructive transaction you intended to avoid.",
      },

      {
        id: "27-5",
        title: "27.5. Named Restore Points",

        content: `PostgreSQL can create named restore points inside the WAL stream.
  
  This can be useful before major production operations such as:
  
  - large migrations
  - risky deployments
  - bulk data modifications
  
  The restore point provides a recognizable WAL position that can later be used as a recovery target.
  
  A restore point does not create a backup by itself.
  
  It only creates a marker inside WAL.`,

        keyPoints: [
          "Restore points create named WAL locations.",
          "They are useful before risky operations.",
          "They do not replace base backups.",
          "Required WAL must still be archived.",
        ],

        importantTerms: ["pg_create_restore_point", "Named Restore Point"],

        diagram: `
  WAL
  
  ──────────●────────────────────>
            │
            │
     before_migration
        `,

        commands: ["SELECT pg_create_restore_point('before_migration');"],

        warning:
          "A restore point is useless for PITR if the required base backup or WAL archive is unavailable.",
      },

      {
        id: "27-6",
        title: "27.6. PITR Recovery Flow",

        content: `A simplified PITR recovery process looks like:
  
  1. Stop or isolate the failed database environment.
  2. Select an appropriate base backup.
  3. Restore the physical base backup.
  4. Configure PostgreSQL to retrieve archived WAL.
  5. Configure the recovery target.
  6. Start PostgreSQL.
  7. PostgreSQL replays WAL.
  8. Recovery stops at the target.
  9. Validate application data.
  10. Resume service only after verification.
  
  Actual operational procedures depend on PostgreSQL version, backup tooling, and infrastructure.`,

        keyPoints: [
          "Restore begins from a physical base backup.",
          "Archived WAL is replayed afterward.",
          "Recovery stops at the configured target.",
          "Data must be validated before production traffic resumes.",
        ],

        importantTerms: [
          "restore_command",
          "Recovery Replay",
          "Recovery Target",
        ],

        diagram: `
  Base Backup
      │
      ▼
  Restore Files
      │
      ▼
  Configure WAL Retrieval
      │
      ▼
  Start PostgreSQL
      │
      ▼
  Replay WAL
      │
      ▼
  Reach Target
      │
      ▼
  Validate
        `,

        commands: [],

        warning:
          "Test the recovery procedure before an incident. PITR should not be learned for the first time during a production outage.",
      },

      {
        id: "27-7",
        title: "27.7. RPO and RTO",

        content: `Backup architecture is usually designed around two operational targets.
  
  RPO
  
  Recovery Point Objective
  
  How much data loss is acceptable?
  
  Example:
  
  RPO = 5 minutes
  
  means losing up to approximately five minutes of recent data may be acceptable.
  
  
  RTO
  
  Recovery Time Objective
  
  How long can the service remain unavailable while recovery happens?
  
  Example:
  
  RTO = 30 minutes
  
  These targets influence:
  
  - backup frequency
  - WAL archiving
  - storage strategy
  - automation
  - replica architecture
  - restore testing`,

        keyPoints: [
          "RPO defines acceptable data-loss window.",
          "RTO defines acceptable recovery duration.",
          "Backup design should reflect business recovery requirements.",
        ],

        importantTerms: ["RPO", "RTO", "Disaster Recovery"],

        diagram: `
  Incident
     │
     ├── How much data may we lose?
     │        └── RPO
     │
     └── How long may recovery take?
              └── RTO
        `,

        commands: [],

        warning: null,
      },

      {
        id: "27-8",
        title: "27.8. PITR Mental Model",

        content: `The simplest PITR mental model is:
  
  Base Backup
  +
  Continuous WAL Archive
  +
  Recovery Target
  =
  Database at a chosen historical point
  
  If any required part is missing, recovery may fail.
  
  Therefore PITR reliability depends on continuously verifying:
  
  - base backups exist
  - WAL is successfully archived
  - retention is sufficient
  - restore procedures work
  - recovery targets can be reached`,

        keyPoints: [
          "PITR requires a complete recovery chain.",
          "Backup and WAL retention must overlap correctly.",
          "Recovery testing is essential.",
        ],

        importantTerms: ["PITR Chain", "WAL Retention", "Recovery Validation"],

        diagram: `
  Base Backup
       +
  WAL Archive
       +
  Recovery Target
       │
       ▼
  Point-In-Time Recovery
  
  
  Next:
  Production Troubleshooting
        `,

        commands: ["SHOW archive_mode;", "SHOW archive_command;"],

        warning:
          "Do not assume PITR works simply because archive_mode is enabled. Verify actual archived WAL and perform restore tests.",
      },
    ],
  },

  // =========================================================
  // MODULE 28 — PRODUCTION TROUBLESHOOTING
  // =========================================================
  {
    id: "doc-28",
    title: "28. Production Troubleshooting",
    description:
      "Learn a systematic PostgreSQL incident-response approach for CPU saturation, connection exhaustion, disk pressure, WAL growth, replica lag, blocking, deadlocks, long transactions, autovacuum problems, bloat, temporary files, and bad query plans.",

    chapters: [
      {
        id: "28-1",
        title: "28.1. Troubleshooting Method",

        content: `Production troubleshooting should be evidence-driven.
  
  Avoid changing PostgreSQL settings randomly during an incident.
  
  A useful general workflow is:
  
  1. Identify the symptom.
  2. Determine when it started.
  3. Inspect active sessions.
  4. Inspect workload statistics.
  5. Inspect waits and locks.
  6. Inspect system resources.
  7. Identify the actual bottleneck.
  8. Apply the smallest safe corrective action.
  9. Measure again.
  10. Find and fix the root cause.
  
  The same symptom can have many different causes.
  
  For example, high CPU could be caused by:
  
  - one expensive query
  - thousands of small queries
  - bad execution plans
  - excessive connections
  - autovacuum
  - analytics workloads
  
  Diagnosis must come before tuning.`,

        keyPoints: [
          "Start from evidence, not assumptions.",
          "Symptoms can have multiple causes.",
          "Apply the smallest safe fix first.",
          "Measure after every change.",
          "Incident mitigation and root-cause correction are different tasks.",
        ],

        importantTerms: [
          "Incident",
          "Mitigation",
          "Root Cause",
          "Observability",
        ],

        diagram: `
  Symptom
     │
     ▼
  Measure
     │
     ▼
  Identify Bottleneck
     │
     ▼
  Mitigate
     │
     ▼
  Measure Again
     │
     ▼
  Root Cause Fix
        `,

        commands: [
          "SELECT * FROM pg_stat_activity;",
          "SELECT * FROM pg_stat_database WHERE datname = current_database();",
        ],

        warning:
          "Avoid restarting PostgreSQL as the first troubleshooting step. A restart can remove evidence and may only temporarily hide the actual problem.",
      },

      {
        id: "28-2",
        title: "28.2. CPU at 100%",

        content: `High database CPU means PostgreSQL backend processes or related database work are consuming available processor capacity.
  
  Possible causes include:
  
  - expensive queries
  - too much query concurrency
  - inefficient joins
  - repeated sequential scans
  - bad plans
  - huge aggregations
  - excessive connection count
  - heavy maintenance work
  
  Start with active queries and pg_stat_statements.
  
  Ask:
  
  Which queries consume the most total time?
  
  Which queries are running now?
  
  Did call volume suddenly increase?
  
  Did a query plan change?`,

        keyPoints: [
          "High CPU is a symptom.",
          "Find CPU-heavy SQL before changing server settings.",
          "Query frequency matters as much as query duration.",
          "Excess concurrency can cause CPU saturation.",
        ],

        importantTerms: ["CPU Saturation", "Expensive Query", "Concurrency"],

        diagram: `
  CPU 100%
     │
     ├── One expensive query?
     ├── Too many queries?
     ├── Bad plan?
     ├── Autovacuum?
     └── Connection storm?
        `,

        commands: [
          "SELECT pid, now() - query_start AS duration, state, query FROM pg_stat_activity WHERE state = 'active' AND pid <> pg_backend_pid() ORDER BY duration DESC;",
          "SELECT query, calls, total_exec_time, mean_exec_time FROM pg_stat_statements ORDER BY total_exec_time DESC LIMIT 20;",
        ],

        warning:
          "Do not terminate every active query simply because CPU is high.",
      },

      {
        id: "28-3",
        title: "28.3. Connections Exhausted",

        content: `Connection exhaustion occurs when PostgreSQL has no available connection slots for new clients.
  
  Common causes include:
  
  - oversized application pools
  - autoscaling multiplying connection count
  - leaked connections
  - long-running queries
  - many idle connections
  - idle-in-transaction sessions
  - no external pooler
  
  Start by grouping pg_stat_activity by:
  
  - user
  - database
  - application_name
  - state
  
  This helps identify which application owns the connections.`,

        keyPoints: [
          "Connection exhaustion is often an application or pooling problem.",
          "Identify connection ownership first.",
          "Idle and idle-in-transaction sessions should be distinguished.",
          "PgBouncer can reduce backend connection count.",
        ],

        importantTerms: [
          "Connection Exhaustion",
          "max_connections",
          "Pool Leak",
        ],

        diagram: `
  Applications
       │
       ▼
  Connection Count
       │
       ▼
  max_connections reached
       │
       ▼
  New connections rejected
        `,

        commands: [
          "SHOW max_connections;",
          "SELECT application_name, usename, state, COUNT(*) FROM pg_stat_activity GROUP BY application_name, usename, state ORDER BY COUNT(*) DESC;",
        ],

        warning:
          "Increasing max_connections may make the server less stable if the underlying issue is uncontrolled application pooling.",
      },

      {
        id: "28-4",
        title: "28.4. Disk Full",

        content: `A PostgreSQL disk can fill for several different reasons.
  
  Possible causes include:
  
  - normal table growth
  - index growth
  - table bloat
  - index bloat
  - pg_wal growth
  - temporary files
  - failed archiving
  - retained replication slots
  - logs
  - backup files
  
  First identify which area is growing.
  
  Do not immediately delete files from the PostgreSQL data directory.
  
  Deleting unknown files from pg_wal or relation directories can destroy the cluster.`,

        keyPoints: [
          "Disk-full incidents require identifying the growing component.",
          "WAL, temp files, relations, logs, and backups are separate possibilities.",
          "Never manually delete PostgreSQL relation or WAL files.",
        ],

        importantTerms: ["Disk Full", "pg_wal", "Relation Size", "Temp Files"],

        diagram: `
  Disk Full
     │
     ├── Tables?
     ├── Indexes?
     ├── WAL?
     ├── Temp files?
     ├── Logs?
     └── Backups?
        `,

        commands: [
          "SELECT pg_size_pretty(pg_database_size(current_database()));",
          "SELECT relname, pg_size_pretty(pg_total_relation_size(relid)) FROM pg_catalog.pg_statio_user_tables ORDER BY pg_total_relation_size(relid) DESC LIMIT 20;",
        ],

        warning: "Never manually remove files from pg_wal to free disk space.",
      },

      {
        id: "28-5",
        title: "28.5. WAL Growing",

        content: `Unexpected pg_wal growth usually means PostgreSQL must retain WAL or is generating WAL faster than expected.
  
  Possible causes include:
  
  - inactive replication slot
  - lagging replica
  - failed WAL archiving
  - heavy write workload
  - large bulk update
  - index build
  - backup activity
  
  Start with replication slots and replication status.
  
  If slots are retaining WAL, identify the consumer before taking action.`,

        keyPoints: [
          "WAL growth can come from generation or retention.",
          "Replication slots are a common retention cause.",
          "Replica lag can retain WAL.",
          "Archiving failures also matter.",
        ],

        importantTerms: [
          "WAL Growth",
          "Replication Slot",
          "restart_lsn",
          "Archive Failure",
        ],

        diagram: `
  pg_wal Growing
        │
        ├── high write rate?
        ├── slot stuck?
        ├── replica lag?
        └── archive failing?
        `,

        commands: [
          "SELECT slot_name, active, restart_lsn, pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn)) AS retained_wal FROM pg_replication_slots WHERE restart_lsn IS NOT NULL;",
          "SELECT * FROM pg_stat_replication;",
        ],

        warning:
          "Do not drop a replication slot until you understand which consumer depends on it.",
      },

      {
        id: "28-6",
        title: "28.6. Replica Lag",

        content: `Replica lag means the standby is behind the primary.
  
  Determine where lag occurs:
  
  sent
  write
  flush
  replay
  
  Possible causes include:
  
  - network latency
  - insufficient replica disk throughput
  - slow WAL replay
  - CPU pressure
  - large write bursts
  - long-running replica queries
  - paused replication
  - infrastructure issues
  
  Compare LSN positions rather than looking only at a single lag number.`,

        keyPoints: [
          "Replication has multiple progress stages.",
          "Lag can be network, write, flush, or replay related.",
          "LSN comparison helps identify the stage.",
        ],

        importantTerms: [
          "Replica Lag",
          "sent_lsn",
          "write_lsn",
          "flush_lsn",
          "replay_lsn",
        ],

        diagram: `
  Primary
  sent_lsn
     │
     ▼
  Replica write_lsn
     │
     ▼
  flush_lsn
     │
     ▼
  replay_lsn
        `,

        commands: [
          "SELECT application_name, state, sent_lsn, write_lsn, flush_lsn, replay_lsn FROM pg_stat_replication;",
        ],

        warning:
          "Replica lag may cause stale reads even when replication is technically healthy.",
      },

      {
        id: "28-7",
        title: "28.7. Blocking Query",

        content: `A blocking query occurs when one session holds a lock another session needs.
  
  The blocked query may appear slow even though it is doing almost no CPU work.
  
  Typical causes include:
  
  - long transactions
  - uncommitted UPDATE or DELETE
  - ALTER TABLE
  - migrations
  - explicit row locks
  - application transactions waiting on external services
  
  Blocking should be diagnosed using pg_stat_activity and pg_locks.`,

        keyPoints: [
          "Blocked queries may consume little CPU.",
          "The blocker is often more important than the blocked query.",
          "Long transactions commonly create blocking.",
        ],

        importantTerms: ["Blocking", "Blocked Query", "Lock Wait", "Blocker"],

        diagram: `
  Transaction A
  holds lock
       │
       ▼
  Resource
       ▲
       │ waits
  Transaction B
        `,

        commands: [
          "SELECT pid, state, wait_event_type, wait_event, query FROM pg_stat_activity WHERE wait_event_type = 'Lock';",
          "SELECT pg_blocking_pids(pid), pid, query FROM pg_stat_activity WHERE cardinality(pg_blocking_pids(pid)) > 0;",
        ],

        warning:
          "Terminate the blocker only after understanding what transaction will be rolled back.",
      },

      {
        id: "28-8",
        title: "28.8. Deadlock",

        content: `A deadlock is a cycle of lock dependencies.
  
  Example:
  
  Transaction A locks row 1 and waits for row 2.
  
  Transaction B locks row 2 and waits for row 1.
  
  Neither transaction can continue.
  
  PostgreSQL detects the cycle and aborts one transaction.
  
  Applications should be prepared to retry transactions that fail because of deadlocks.
  
  The best prevention strategy is often consistent lock ordering.`,

        keyPoints: [
          "A deadlock is a cycle of waits.",
          "PostgreSQL automatically detects deadlocks.",
          "One transaction is aborted.",
          "Applications should handle retryable deadlock failures.",
          "Consistent lock order helps prevent deadlocks.",
        ],

        importantTerms: ["Deadlock", "deadlock_timeout", "Retry"],

        diagram: `
  Transaction A
  Row 1 LOCK
     │
     └──── wants Row 2
  
  Transaction B
  Row 2 LOCK
     │
     └──── wants Row 1
  
            │
            ▼
         DEADLOCK
        `,

        commands: [
          "SHOW deadlock_timeout;",
          "SELECT datname, deadlocks FROM pg_stat_database;",
        ],

        warning:
          "Increasing deadlock_timeout does not solve deadlocks. It only changes how long PostgreSQL waits before checking.",
      },

      {
        id: "28-9",
        title: "28.9. Long Transaction",

        content: `Long transactions are dangerous because PostgreSQL MVCC may need to preserve old tuple versions for them.
  
  They can cause:
  
  - vacuum cleanup delays
  - dead tuple accumulation
  - table bloat
  - index bloat
  - long-held locks
  - transaction ID age problems
  
  Inspect xact_start to find the oldest transactions.
  
  Pay special attention to:
  
  idle in transaction
  
  because the client may not even be doing useful work while still holding transactional state.`,

        keyPoints: [
          "Long transactions hold old snapshots.",
          "They can prevent VACUUM cleanup.",
          "Idle transactions are particularly problematic.",
          "Transaction age should be monitored.",
        ],

        importantTerms: [
          "Long Transaction",
          "xact_start",
          "Old Snapshot",
          "idle in transaction",
        ],

        diagram: `
  Old Transaction
        │
        ▼
  Old Snapshot
        │
        ▼
  Old Tuples Must Remain
        │
        ▼
  VACUUM Restricted
        │
        ▼
  Bloat
        `,

        commands: [
          "SELECT pid, state, now() - xact_start AS transaction_age, query FROM pg_stat_activity WHERE xact_start IS NOT NULL ORDER BY xact_start;",
        ],

        warning:
          "Do not allow application transactions to remain open while waiting for user interaction or slow external APIs.",
      },

      {
        id: "28-10",
        title: "28.10. Autovacuum Lag",

        content: `Autovacuum lag occurs when maintenance cannot keep up with table modifications.
  
  Symptoms may include:
  
  - rapidly increasing n_dead_tup
  - large tables with old last_autovacuum timestamps
  - increasing bloat
  - slow scans
  - transaction age growth
  
  Possible causes include:
  
  - autovacuum thresholds too relaxed
  - insufficient workers
  - cost throttling
  - extremely high write rates
  - long transactions preventing cleanup
  
  Inspect table statistics before changing configuration.`,

        keyPoints: [
          "Autovacuum lag is often visible through dead tuple growth.",
          "Long transactions can make VACUUM ineffective.",
          "Large tables may need per-table tuning.",
          "Worker capacity can matter.",
        ],

        importantTerms: ["Autovacuum Lag", "n_dead_tup", "last_autovacuum"],

        diagram: `
  Write Rate
      │
      ▼
  Dead Tuple Generation
      │
      ▼
  Autovacuum Throughput
      │
    enough?
   ┌──┴──┐
   │YES  │NO
   ▼     ▼
  OK   Backlog
         │
         ▼
       Bloat
        `,

        commands: [
          "SELECT relname, n_live_tup, n_dead_tup, last_autovacuum, autovacuum_count FROM pg_stat_user_tables ORDER BY n_dead_tup DESC;",
        ],

        warning:
          "Do not disable autovacuum because it consumes CPU or I/O. Fix the reason maintenance is falling behind.",
      },

      {
        id: "28-11",
        title: "28.11. Bloat",

        content: `When a table or index is unexpectedly large, first determine whether the growth is legitimate data growth or inefficient storage.
  
  Check:
  
  - live row count
  - dead tuple estimate
  - table size
  - index size
  - update/delete rates
  - vacuum history
  
  Possible responses include:
  
  - improving autovacuum
  - fixing long transactions
  - REINDEX
  - table rewrite
  - pg_repack
  
  The correct solution depends on whether the problem is heap bloat, index bloat, or simply real data growth.`,

        keyPoints: [
          "Large relations are not automatically bloated.",
          "Separate heap size from index size.",
          "Fix the cause before rebuilding objects.",
          "Rebuilding without fixing the cause leads to repeated bloat.",
        ],

        importantTerms: ["Table Bloat", "Index Bloat", "REINDEX", "pg_repack"],

        diagram: `
  Large Relation
        │
        ▼
  Real Data Growth?
     ┌──┴──┐
     │YES  │NO
     ▼     ▼
  Normal  Investigate
            │
            ├── heap bloat
            └── index bloat
        `,

        commands: [
          "SELECT relname, n_live_tup, n_dead_tup FROM pg_stat_user_tables ORDER BY n_dead_tup DESC;",
          "SELECT pg_size_pretty(pg_table_size('users'));",
          "SELECT pg_size_pretty(pg_indexes_size('users'));",
        ],

        warning:
          "Do not run VACUUM FULL blindly on large production tables because it requires a strong lock.",
      },

      {
        id: "28-12",
        title: "28.12. Temporary File Explosion",

        content: `A sudden increase in temporary files can consume storage and dramatically slow queries.
  
  Common causes include:
  
  - large ORDER BY
  - large GROUP BY
  - hash joins
  - hash aggregates
  - insufficient memory for query operations
  - unexpectedly huge intermediate result sets
  - poor execution plans
  
  Start with:
  
  pg_stat_database
  pg_stat_statements
  EXPLAIN ANALYZE
  
  Look for:
  
  external merge
  temporary blocks
  multiple hash batches
  
  Do not solve every spill by globally increasing work_mem.`,

        keyPoints: [
          "Sorts and hashes can spill to disk.",
          "Temp-file growth can fill disk.",
          "Large intermediate results often cause spills.",
          "Global work_mem increases can create memory exhaustion.",
        ],

        importantTerms: [
          "Temp File",
          "External Merge",
          "Hash Spill",
          "work_mem",
        ],

        diagram: `
  Query
    │
    ▼
  Large Sort / Hash
    │
    ▼
  Memory insufficient
    │
    ▼
  Temporary Files
    │
    ▼
  Disk I/O + Latency
        `,

        commands: [
          "SELECT datname, temp_files, pg_size_pretty(temp_bytes) FROM pg_stat_database ORDER BY temp_bytes DESC;",
          "SELECT query, temp_blks_read, temp_blks_written FROM pg_stat_statements ORDER BY temp_blks_written DESC LIMIT 20;",
        ],

        warning:
          "A globally large work_mem multiplied across many concurrent operations can exhaust server RAM.",
      },

      {
        id: "28-13",
        title: "28.13. Bad Query Plan",

        content: `Sometimes a query suddenly becomes slow because PostgreSQL chooses an inefficient execution plan.
  
  Possible causes include:
  
  - stale statistics
  - changed data distribution
  - parameter-sensitive queries
  - inaccurate cardinality estimates
  - missing indexes
  - newly changed schema
  - different data volume
  
  Compare:
  
  estimated rows
  vs
  actual rows
  
  Large differences often reveal the problem.
  
  Then inspect:
  
  - scan strategy
  - join strategy
  - sort behavior
  - loops
  - buffer reads
  - statistics`,

        keyPoints: [
          "Bad plans often come from incorrect estimates.",
          "Always compare estimated and actual rows.",
          "ANALYZE may help when statistics are stale.",
          "Indexes are only one possible solution.",
        ],

        importantTerms: [
          "Bad Plan",
          "Cardinality Estimate",
          "Execution Plan",
          "Statistics",
        ],

        diagram: `
  Planner Estimate
  100 rows
       │
       ▼
  Chooses Nested Loop
  
  Actual
  1,000,000 rows
       │
       ▼
  Huge amount of work
        `,

        commands: [
          "EXPLAIN (ANALYZE, BUFFERS) SELECT ...;",
          "ANALYZE orders;",
          "SELECT * FROM pg_stats WHERE tablename = 'orders';",
        ],

        warning:
          "Avoid permanently forcing planner behavior before understanding why PostgreSQL estimated the query incorrectly.",
      },

      {
        id: "28-14",
        title: "28.14. Production Incident Checklist",

        content: `When PostgreSQL appears unhealthy, use a repeatable sequence.
  
  1. Check connections.
  2. Check active and long-running queries.
  3. Check idle transactions.
  4. Check lock waits.
  5. Check pg_stat_statements.
  6. Check CPU, memory, and storage.
  7. Check database and relation sizes.
  8. Check temporary files.
  9. Check dead tuples and autovacuum.
  10. Check WAL and replication slots.
  11. Check replica lag.
  12. Inspect execution plans for expensive SQL.
  13. Mitigate the immediate problem.
  14. Fix the root cause.
  15. Document the incident and add monitoring.
  
  This prevents random tuning during stressful incidents.`,

        keyPoints: [
          "Use the same diagnostic sequence during incidents.",
          "Database and infrastructure metrics must be correlated.",
          "Mitigation and root-cause fixes are different.",
          "Every production incident should improve future monitoring.",
        ],

        importantTerms: [
          "Incident Checklist",
          "Diagnosis",
          "Mitigation",
          "Postmortem",
        ],

        diagram: `
  PostgreSQL Incident
         │
         ▼
  Connections
         │
         ▼
  Queries
         │
         ▼
  Locks / Waits
         │
         ▼
  CPU / Memory / Disk
         │
         ▼
  VACUUM / WAL / Replica
         │
         ▼
  Execution Plans
         │
         ▼
  Mitigate
         │
         ▼
  Root Cause
         │
         ▼
  Monitoring + Prevention
        `,

        commands: [
          "SELECT * FROM pg_stat_activity;",
          "SELECT * FROM pg_stat_database WHERE datname = current_database();",
          "SELECT * FROM pg_stat_replication;",
          "SELECT * FROM pg_replication_slots;",
          "SELECT relname, n_live_tup, n_dead_tup, last_autovacuum FROM pg_stat_user_tables ORDER BY n_dead_tup DESC;",
        ],

        warning:
          "During incidents, preserve evidence whenever possible before restarting PostgreSQL or resetting statistics.",
      },
    ],
  },
];
