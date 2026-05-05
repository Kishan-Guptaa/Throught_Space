import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  integer,
  boolean,
  jsonb,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users Table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  bio: text("bio"),
  profileImage: text("profile_image"),
  socialLinks: jsonb("social_links").default({
    twitter: "",
    linkedin: "",
    github: "",
    portfolio: "",
  }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Folders Table
export const folders = pgTable("folders", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Blogs Table
export const blogs = pgTable("blogs", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(), // Rich text content
  coverImage: text("cover_image"),
  tags: text("tags").array(),
  folderId: integer("folder_id").references(() => folders.id, {
    onDelete: "set null",
  }),
  userId: integer("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  views: integer("views").default(0),
  isPublished: boolean("is_published").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Likes Table
export const likes = pgTable(
  "likes",
  {
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    blogId: integer("blog_id")
      .references(() => blogs.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.blogId] }),
  })
);

// Bookmarks Table
export const bookmarks = pgTable(
  "bookmarks",
  {
    userId: integer("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    blogId: integer("blog_id")
      .references(() => blogs.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.blogId] }),
  })
);

// Followers Table
export const followers = pgTable(
  "followers",
  {
    followerId: integer("follower_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    followingId: integer("following_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.followerId, t.followingId] }),
  })
);

// Notifications Table
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  receiverId: integer("receiver_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  senderId: integer("sender_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  type: varchar("type", { length: 50 }).notNull(), // 'LIKE', 'FOLLOW', 'NEW_POST'
  blogId: integer("blog_id").references(() => blogs.id, {
    onDelete: "cascade",
  }),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  blogs: many(blogs),
  folders: many(folders),
  likes: many(likes),
  bookmarks: many(bookmarks),
  notifications: many(notifications, { relationName: "receiver" }),
}));

export const blogsRelations = relations(blogs, ({ one, many }) => ({
  author: one(users, { fields: [blogs.userId], references: [users.id] }),
  folder: one(folders, { fields: [blogs.folderId], references: [folders.id] }),
  likes: many(likes),
  bookmarks: many(bookmarks),
}));

export const foldersRelations = relations(folders, ({ one, many }) => ({
  user: one(users, { fields: [folders.userId], references: [users.id] }),
  blogs: many(blogs),
}));
