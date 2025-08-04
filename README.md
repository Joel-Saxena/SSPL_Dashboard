# SSPL_Dashboard
# DRDO Scientist Records Dashboard

This project is a secure web-based dashboard designed to manage and retrieve the complete internal records of scientists working at DRDO. The system allows administrators to access an individual’s full profile — from basic identification details to the most granular data relevant to their role — simply by entering the scientist's name or employee number.

---

## 🔍 Objective

To develop a centralized, digital solution that streamlines the management of sensitive personnel data, ensuring quick retrieval, efficient updates, and secure access to authorized users only.

---

## 🧾 Core Features (Planned)

- 🔎 **Scientist Search**: Fetch full profile using employee number or name.
- 📄 **Personal Info Management**: Name, DOB, contact, address, education, ID proofs.
- 💼 **Professional Details**: Current designation, department, years of service.
- 💰 **Salary Records**: Pay grade, allowances, deductions, and salary history.
- 📆 **Leave Management**: Leave balances, history, request tracking.
- 📁 **Document Repository**: Upload/view official documents (joining letter, NOCs, etc.)
- 🔐 **Role-Based Access**: Admin-only access with strict security.
- 📊 **Analytics Dashboard** (future): Summary stats, charts, trends.

---

## 🛠️ Tech Stack (Tentative)

| Layer        | Technology              |
|--------------|--------------------------|
| Frontend     | React.js / HTML / CSS    |
| Backend      | Node.js / Express OR Django (TBD) |
| Database     | MongoDB / MySQL / PostgreSQL |
| Auth         | JWT / Role-based system  |
| Deployment   | GitHub + Vercel / Render / Railway |

---

## 📁 Folder Structure (To be planned)

/client → Frontend files
/server → Backend APIs
/config → DB config, environment vars
README.md → Project documentation

---

## 🗒️ Sample .env File

```env
DB_HOST = 'localhost'
DB_USER = 'root'
DB_PASSWORD = 'root'
DB_NAME = 'sspl_drdo_2'
JWT_SECRET = 'your_jwt_secret'
MINIO_ENDPOINT = '192.168.1.4'
MINIO_API_PORT = 9000
MINIO_ACCESS_KEY = 'minioadmin'
MINIO_SECRET_KEY = 'minioadmin'
MINIO_BUCKET = 'ssplerp'
```

---

## 🗄️ Start MinIO Object Storage Server

Run the following command (replace `<MinIO-storage-directory>` with your MinIO installation directory):

```
minio.exe server C:\<MinIO-storage-directory> --console-address :9001
```

---

## 🚧 Project Status

**Planning Stage** – Requirements being gathered and architecture being designed. Development to begin soon.

---
