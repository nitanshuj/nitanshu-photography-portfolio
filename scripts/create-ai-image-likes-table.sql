-- Create AI image likes table
CREATE TABLE IF NOT EXISTS ai_image_likes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image_id TEXT UNIQUE NOT NULL,
  like_count INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial data for existing AI images
INSERT OR IGNORE INTO ai_image_likes (image_id, like_count) VALUES
  ('1', 0),
  ('2', 0);