# KBC Fashion - Modern E-Commerce Platform

A premium, multi-language, multi-currency fashion e-commerce platform built with Next.js 14, featuring a sophisticated storefront and comprehensive admin dashboard.

![KBC Fashion](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Design System](#design-system)
- [Internationalization](#internationalization)
- [State Management](#state-management)
- [SEO & Performance](#seo--performance)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

KBC Fashion is a globally accessible e-commerce platform designed specifically for clothing brands. It provides customers with a seamless shopping experience while offering store administrators powerful tools for managing products, inventory, orders, and customer relationships.

### Demo

- **Live Site**: [kbcuniverse.org](https://kbcuniverse.org)
- **Admin Panel**: [admin.kbcuniverse.org](https://admin.kbcuniverse.org)

---

## ✨ Features

### Customer-Facing Features

#### 🌍 Multi-Language & Currency

- **Languages**: English, French, Spanish, Zulu
- **Currencies**: USD, NGN, ZAR, GBP, EUR
- Real-time currency conversion with backend exchange rates
- Persistent language and currency preferences

#### 🛒 Shopping Experience

- Guest checkout with cart token persistence
- Authenticated user carts with automatic merging on login
- Product variants (color + size) with stock management
- Color-specific product images
- Wishlist functionality
- Quick add to cart
- Order tracking

#### 🎨 Modern UI/UX

- Clean, minimalist design inspired by high-end fashion brands
- Dark/light theme toggle
- Fully responsive (mobile, tablet, desktop)
- Smooth animations and transitions
- Mobile bottom navigation bar
- Mega menus with category navigation
- Sticky scroll-to-top button

#### 🔍 Navigation & Discovery

- Dynamic category pages
- Product filtering and sorting
- Breadcrumb navigation
- Search functionality
- Featured collections
- New arrivals and best sellers

### Admin Features

#### 📦 Product Management

- Create, edit, and archive products
- Manage product variants (color/size combinations)
- Upload and organize product images
- Bulk import/export (CSV)
- Stock level management
- Multi-language product descriptions

#### 📊 Order Management

- View and filter orders
- Update order status
- Real-time customer notifications (email/SMS)
- Delivery tracking integration
- Order timeline visualization

#### 👥 Customer Management

- View customer profiles
- Order history and analytics
- Account management

#### 📈 Analytics Dashboard

- Revenue tracking (daily, monthly, yearly)
- Best-selling products
- Top customers
- Order statistics

---

## 🛠️ Tech Stack

### Frontend

| Technology          | Purpose                           |
| ------------------- | --------------------------------- |
| **Next.js 14**      | React framework with App Router   |
| **TypeScript**      | Type-safe development             |
| **Tailwind CSS**    | Utility-first styling             |
| **Zustand**         | Lightweight state management      |
| **TanStack Query**  | Server state management & caching |
| **Lucide React**    | Icon library                      |
| **Inter & Poppins** | Typography (Google Fonts)         |

### Backend

| Technology           | Purpose                           |
| -------------------- | --------------------------------- |
| **NestJS**           | Node.js framework                 |
| **Prisma**           | ORM for database                  |
| **PostgreSQL**       | Primary database                  |
| **Supabase Storage** | Image storage                     |
| **JWT**              | Authentication (httpOnly cookies) |

### DevOps & Tools

- **Git** - Version control
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vercel** - Frontend deployment
- **Railway/Render** - Backend deployment

---

## 📁 Project Structure
