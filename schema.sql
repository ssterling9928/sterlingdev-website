-- 1. Main Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    project_type TEXT CHECK(project_type IN ('Website', 'App', 'Game', 'Tool', 'Other')) DEFAULT 'Website',
    status TEXT CHECK(status IN ('Planning', 'In Progress', 'Completed', 'Archived')) DEFAULT 'Planning',
    priority INTEGER DEFAULT 0, -- Higher number = higher display priority
    description TEXT,
    repo_link TEXT,
    live_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tags Table (Dev Stack)
CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
);

-- 3. Junction Table (Links Projects to Tags)
CREATE TABLE IF NOT EXISTS project_tags (
    project_id INTEGER,
    tag_id INTEGER,
    PRIMARY KEY (project_id, tag_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- 4. Automatic "Last Updated" Trigger
-- This updates the updated_at column whenever you edit a project row
CREATE TRIGGER IF NOT EXISTS update_project_timestamp 
AFTER UPDATE ON projects
BEGIN
    UPDATE projects SET updated_at = CURRENT_TIMESTAMP WHERE id = old.id;
END;