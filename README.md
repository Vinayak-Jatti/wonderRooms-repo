# 🏠 WonderRooms – Student Rental Service Platform

> **A web-based platform helping students find affordable, safe, and verified rental rooms with ease.**

---

## 📖 Overview

**WonderRooms** is a full-stack web application built for students seeking accommodation in new cities.  
It allows users to **browse room listings**, **view details**, and **post reviews** — creating a trusted community-driven rental system.

The platform emphasizes **simplicity, accessibility, and scalability**, making it ideal for students relocating for studies or internships.

---

## 🚀 Features

✅ Browse available room listings  
✅ View complete room details (price, location, description)  
✅ Add and manage reviews  
✅ Form validation using **Joi**  
✅ Custom error handling with **ExpressError**  
✅ Organized MVC structure  
✅ Future-ready for authentication, maps, and filters  

---

## 🏗️ Tech Stack

### **Frontend**
- **EJS** – Server-side templating
- **CSS** – Custom styling
- **Vanilla JavaScript** – Client-side interactions

### **Backend**
- **Node.js** – JavaScript runtime
- **Express.js** – Backend framework

### **Database**
- **MongoDB** – NoSQL database
- **Mongoose** – Object Data Modeling (ODM)

### **Other Tools**
- `method-override` → Enables PUT/DELETE via forms  
- `Joi` → Data validation  
- `Git/GitHub` → Version control  
- `ejs-mate` → For layouts and reusable templates  

---

## 📂 Project Structure

```

WonderRooms/
│── init/                  # Initialization & sample data
│   ├── data.js
│   └── index.js
│
│── models/                # Mongoose models
│   ├── listing.js
│   └── review.js
│
│── routes/                # Route handlers
│   ├── listings.js
│   └── reviews.js
│
│── utils/                 # Utility helpers
│   ├── ExpressError.js
│   └── wrspAsync.js
│
│── public/                # Static assets
│   ├── css/styles.css
│   └── js/script.js
│
│── views/                 # EJS templates
│   ├── include/
│   │   ├── footer.ejs
│   │   ├── navbar.ejs
│   │   └── layouts/boilerplate.ejs
│   ├── listings/
│   │   ├── index.ejs
│   │   ├── new.ejs
│   │   ├── edit.ejs
│   │   └── show.ejs
│   └── error.ejs
│
│── app.js                 # Entry point
│── schema.js              # Joi validation schema
│── package.json
│── .gitignore

````

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/yourusername/WonderRooms.git
cd WonderRooms
````

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Setup MongoDB

* Make sure MongoDB is running locally or connect to **MongoDB Atlas**.
* Update your connection string inside `app.js`.

### 4️⃣ Run the project

```bash
node app.js
```

Visit 👉 **[ Live on Render ](https://wonderrooms-home.onrender.com/listings)** in your browser.

---

## 🧩 Core Functionalities

| Feature               | Description                               |
| --------------------- | ----------------------------------------- |
| 🏘️ **Listings**      | Add, edit, delete, and view room listings |
| 💬 **Reviews**        | Post and manage reviews for listings      |
| 🧾 **Validation**     | All forms validated via Joi               |
| ⚙️ **Error Handling** | Custom ExpressError and async wrapper     |
| 🧱 **EJS Layouts**    | Clean, modular design using ejs-mate      |

---

## 🔒 Future Enhancements

* 🔐 **User Authentication** (Login / Signup)
* ⭐ **Favorites & Saved Listings**
* 🗺️ **Google Maps API Integration**
* 🔍 **Advanced Filters & Search**
* 📸 **Image Upload for Rooms**
* 🎯 **React / Next.js Frontend Upgrade**

---

## 🧪 Testing

* Manual form submission testing
* Debugging through server logs
* API testing using **Postman**

---

## ☁️ Deployment

* **Backend**: Render / Railway / Heroku
* **Database**: MongoDB Atlas
* **Frontend**: Included in Express (EJS templates rendered on server)

---

## 📈 Expected Outcomes

* Students can easily find verified and affordable rental rooms.
* Listings and reviews enhance community trust.
* Platform provides a scalable, secure, and student-centric housing solution.

---

## 💡 Project Inspiration

> Finding student housing is often stressful, unverified, and unsafe.
> **WonderRooms** was built to make that process transparent, simple, and reliable — powered by modern full-stack technologies.

---

## 👨‍💻 Author

**👋 Vinayak Jatti**
📧 [Email](mailto:vinayakjatti044@gmail.com)
💼 [LinkedIn](https://linkedin.com/in/vinayak-jatti) *(add once ready)*
💻 Passionate Full-Stack Developer | Building useful real-world projects

---
 
