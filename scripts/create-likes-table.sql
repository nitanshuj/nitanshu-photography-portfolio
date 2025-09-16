-- Create likes table
CREATE TABLE IF NOT EXISTS image_likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_id TEXT UNIQUE NOT NULL,
  like_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial data for existing images (optional)
-- You can run this after setting up your database
INSERT OR IGNORE INTO image_likes (image_id, like_count) VALUES
  ('gallery-1', 0),
  ('gallery-2', 0),
  ('gallery-3', 0),
  ('ai-1', 0),
  ('ai-2', 0),
  ('ai-3', 0);