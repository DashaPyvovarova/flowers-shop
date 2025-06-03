import { relations } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  text,
  uuid,
  decimal,
  integer,
  boolean,
  pgEnum,
} from 'drizzle-orm/pg-core';

// === Enums ===
export const orderStatusEnum = pgEnum('OrderStatus', ['pending', 'shipped', 'delivered', 'cancelled']);
export const userRolesEnum = pgEnum('UserRoles', ['User', 'Administrator']);

// === Users ===
export const users = pgTable('User', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  login: varchar('login', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: varchar('password', { length: 255 }).notNull(),
  role: userRolesEnum('role').notNull().default('User'),
});

// === FlowerCategory ===
export const flowerCategories = pgTable('FlowerCategory', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
});

// === Flowers ===
export const flowers = pgTable('Flower', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').notNull(),
  image: varchar('image', { length: 500 }),
  categoryId: uuid('categoryId').notNull().references(() => flowerCategories.id),
});

// === Orders ===
export const orders = pgTable('Order', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  userId: uuid('userId').notNull().references(() => users.id),
  totalPrice: decimal('totalPrice', { precision: 10, scale: 2 }).notNull(),
  status: orderStatusEnum('status').notNull(),
});

// === OrderItems ===
export const orderItems = pgTable('OrderItem', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  orderId: uuid('orderId').notNull().references(() => orders.id),
  flowerId: uuid('flowerId').notNull().references(() => flowers.id),
  quantity: integer('quantity').notNull(),
  priceAtPurchase: decimal('priceAtPurchase', { precision: 10, scale: 2 }).notNull(),
});

// === Addresses ===
export const addresses = pgTable('Address', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  userId: uuid('userId').notNull().references(() => users.id),
  city: varchar('city', { length: 255 }).notNull(),
  street: varchar('street', { length: 255 }).notNull(),
  postalCode: varchar('postalCode', { length: 20 }).notNull(),
  country: varchar('country', { length: 100 }).notNull(),
  isDefault: boolean('isDefault').notNull().default(false),
});

// === Reviews ===
export const reviews = pgTable('Review', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  userId: uuid('userId').notNull().references(() => users.id),
  flowerId: uuid('flowerId').notNull().references(() => flowers.id),
  rating: integer('rating').notNull(),
  comment: text('comment'),
});

// === Relations ===
export const userRelations = relations(users, ({ many }) => ({
  orders: many(orders),
  addresses: many(addresses),
  reviews: many(reviews),
}));

export const flowerCategoryRelations = relations(flowerCategories, ({ many }) => ({
  flowers: many(flowers),
}));

export const flowerRelations = relations(flowers, ({ one, many }) => ({
  category: one(flowerCategories, {
    fields: [flowers.categoryId],
    references: [flowerCategories.id],
  }),
  reviews: many(reviews),
  orderItems: many(orderItems),
}));

export const orderRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  items: many(orderItems),
}));

export const orderItemRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  flower: one(flowers, {
    fields: [orderItems.flowerId],
    references: [flowers.id],
  }),
}));

export const addressRelations = relations(addresses, ({ one }) => ({
  user: one(users, {
    fields: [addresses.userId],
    references: [users.id],
  }),
}));

export const reviewRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.userId],
    references: [users.id],
  }),
  flower: one(flowers, {
    fields: [reviews.flowerId],
    references: [flowers.id],
  }),
}));
