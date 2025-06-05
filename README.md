# zaimu

A way to help you save money and manage your expenses based on the Kakeibo method
---

### Main goals:

- **Income & Expense Logging** – Users manually input transactions or connect to financial accounts via **secure integrations**.
- **Categorization & Reflection** – Divide expenses into **needs, wants, savings, and unexpected costs**, mirroring Kakeibo’s approach.
- **Budget Insights & Predictions** – Visualizations to help users **track spending trends**
- **Reminders & Accountability** – Notifications prompting users to **reflect on their spending habits** before over-extending themself.
- **Goalsetting & Reflection** - How much money do you have?, How much do you want to save?, How much are you spending?, How can you improve?
	
- **Data Encryption & Privacy Controls** – Secure storage using **end-to-end encryption**, ensuring financial data remains private.

### **🔹 Tech Stack Overview**
- **Frontend:** HTML, JavaScript (Vanilla or Svelte for a more dynamic UI)
- **Backend:** PocketBase (self-hosted lightweight backend)
- **Security:** End-to-end encryption for sensitive data
- **Storage:** SQLite (PocketBase’s default), ensuring local-first operations
- **Notifications:** Webhooks for reminders, cron-like scheduling

---

## **🚀 Step 1: Setting Up PocketBase**
### **1️⃣ Install & Initialize PocketBase**
PocketBase serves as both your database and backend. Get started with:

```sh
wget https://github.com/pocketbase/pocketbase/releases/latest/download/pocketbase-linux-arm64.zip
unzip pocketbase-linux-arm64.zip
./pocketbase serve
```

Once running, visit `localhost:8090` for the admin panel.

---

### **2️⃣ Define PocketBase Collections**
You’ll need collections for:
1. **Users** → Authentication, roles
2. **Transactions** → Expense & income tracking
3. **Categories** → Needs, wants, savings, unexpected costs
4. **Reflections** → Monthly summaries, goal setting

Example **Transactions Schema**:
| Field Name  | Type      | Description |
|-------------|----------|-------------|
| `amount`   | Number    | Expense/income value |
| `type`      | Enum      | `income` or `expense` |
| `category`  | Relation | Link to `Categories` |
| `date`      | Date      | Transaction timestamp |

---

## **🖼 Step 2: Building the Frontend**
### **3️⃣ Setting Up HTML & JavaScript**
Simple input form:

```html
<form id="expenseForm">
  <input type="number" id="amount" placeholder="Enter amount" required>
  <select id="type">
    <option value="income">Income</option>
    <option value="expense">Expense</option>
  </select>
  <select id="category">
    <option value="needs">Needs</option>
    <option value="wants">Wants</option>
    <option value="savings">Savings</option>
    <option value="unexpected">Unexpected</option>
  </select>
  <button type="submit">Add Transaction</button>
</form>
```

Basic JavaScript to **send data to PocketBase**:
```javascript
document.getElementById("expenseForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const data = {
        amount: document.getElementById("amount").value,
        type: document.getElementById("type").value,
        category: document.getElementById("category").value,
        date: new Date().toISOString()
    };

    const response = await fetch("http://localhost:8090/api/collections/transactions/records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        alert("Transaction saved!");
    } else {
        alert("Error saving transaction");
    }
});
```
---

## **📊 Step 3: Budget Insights & Predictions**
### **4️⃣ Fetching & Visualizing Data**
Using Chart.js or D3.js to create spending trend graphs.

```javascript
async function fetchTransactions() {
    const response = await fetch("http://localhost:8090/api/collections/transactions/records");
    const data = await response.json();
    console.log(data);
}

fetchTransactions();
```
You can use this data to **plot trends** based on spending habits.

---

## **🔒 Step 4: Security & Encryption**
### **5️⃣ Encrypting User Data Before Storage**
For privacy, encrypt sensitive financial data before saving it in PocketBase.

```javascript
import CryptoJS from "crypto-js";

function encryptData(text) {
    return CryptoJS.AES.encrypt(text, "your-secret-key").toString();
}

function decryptData(cipherText) {
    return CryptoJS.AES.decrypt(cipherText, "your-secret-key").toString(CryptoJS.enc.Utf8);
}
```
Use this in transaction storage to ensure security.

---

## **⏰ Step 5: Reminders & Accountability**
### **6️⃣ Scheduled Notifications**
You can trigger alerts via **PocketBase webhooks** or a scheduled cron job.

Example cron job for monthly **budget review reminders**:

```sh
echo "0 9 1 * * curl -X POST http://localhost:8090/api/sendReminder" | crontab -
```

---

## **🎯 Step 6: Goal-Setting & Reflection**
### **7️⃣ Adding Monthly Reflection Prompts**
Prompt users:
- “How much money do you have?”
- “How much do you want to save?”
- “How much are you spending?”
- “How can you improve?”

Save these as journal entries inside PocketBase.

---

### **📌 Next Steps**
1. **Enhance UI** with Svelte or React for better interactivity.
2. **Connect Authentication** with PocketBase user roles.
3. **Optimize Reports** using aggregated analytics.
