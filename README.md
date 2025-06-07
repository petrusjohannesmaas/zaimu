# **Zaimu**  
A way to help you save money and manage your expenses based on the **Kakeibo** method.

### **Main Goals:**
- **Income & Expense Logging** – Users manually input transactions.
- **Categorization & Reflection** – Divide expenses into **needs, wants, savings, and unexpected costs**, mirroring Kakeibo.
- **Budget Insights & Predictions** – Visualizing spending trends.
- **Reminders & Accountability** – Notifications prompting users to reflect on spending before over-extending.
- **Goal Setting & Reflection** – Encouraging mindful budgeting.
- **Data Encryption & Privacy** – Secure financial data storage using **end-to-end encryption**.

---

## 🚀 **Step 1: Setting Up the Dockerized Application**
### **1️⃣ Define the Project Structure**
```plaintext
zaimu/
 ├── docker-compose.yml
 ├── app/
 │   ├── server.js
 │   ├── database.sqlite
 │   ├── public/
 │   │   ├── index.html
 │   │   ├── styles.css
 │   │   ├── script.js
```

### **2️⃣ Create the `docker-compose.yml`**
```yaml
version: '3'
services:
  zaimu:
    build: .
    container_name: zaimu_container
    ports:
      - "8080:8080"
    volumes:
      - ./database:/app/database
    restart: unless-stopped
```

---

## 🛠 **Step 2: Implementing SQLite for Storage**
### **3️⃣ Define the Database Schema**
```sql
CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL NOT NULL,
    type TEXT NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL
);
```

### **4️⃣ Insert Transaction Data**
```javascript
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.run(`INSERT INTO transactions (amount, type, category, date) VALUES (?, ?, ?, ?)`,
      [amount, type, category, new Date().toISOString()]);
```

---

## 📊 **Step 3: Budget Insights & Visualization**
### **5️⃣ Fetch & Analyze Transactions**
```javascript
db.all("SELECT * FROM transactions", [], (err, rows) => {
    console.log(rows);  // Use this data for charts
});
```

### **6️⃣ Generate Spending Trends**
- Use **Chart.js** or **D3.js** to create interactive graphs.
- Aggregate transactions to **visualize spending habits**.
- Predict potential **overspending risks** based on historical data.

Example **monthly spending breakdown**:
```javascript
const monthlyData = transactions.reduce((acc, txn) => {
    const month = txn.date.slice(0, 7);  // Extract YYYY-MM format
    acc[month] = (acc[month] || 0) + txn.amount;
    return acc;
}, {});
console.log(monthlyData);
```

---

## 🔒 **Step 4: Security & Encryption**
### **7️⃣ Encrypt Sensitive Data**
```javascript
const crypto = require('crypto');
const key = "your-secret-key";

function encrypt(text) {
    return crypto.createCipher('aes-256-cbc', key).update(text, 'utf8', 'hex');
}

function decrypt(text) {
    return crypto.createDecipher('aes-256-cbc', key).update(text, 'hex', 'utf8');
}
```
Apply encryption when storing sensitive user information.

---

## 🎯 **Step 5: Goal-Setting & Reflection**
### **8️⃣ Monthly Review Prompts**
Save structured journal entries in SQLite for **budget awareness**:
- "How much money do you have?"
- "How much do you want to save?"
- "How much are you spending?"
- "How can you improve?"

---

### 📌 **Next Steps**
1. **Enhance UI** for seamless financial input.
2. **Improve visualization for spending trends.**
3. **Implement reminders for spending habits.**

---
