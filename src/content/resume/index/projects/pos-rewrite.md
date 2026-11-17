---
title: 'POS Rewrite in Rust'
time: 'Oct 2026'
description: 'Personal project'
url: null
order: 6
visibility:
  web: true
  resume_print: false
  cv_print: false
---

- Rewrote a family business's point-of-sale (POS) app from Rails to a native Windows app in Rust, gpui-kit, and SQLite.
- Fixed stock tracking, which the old app had lost for most products, by restoring stock when an order is deleted and blocking deletion of records with orders.
- Built an import that cleans duplicates, mixed orders, mistyped dates, and float noise in prices from the old database, and reports each fix.
- Replaced force-pushes of the database to git with snapshot backups and a restore command.
