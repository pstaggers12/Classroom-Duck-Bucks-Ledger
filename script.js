document.getElementById("entryForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const entry = {
        date: document.getElementById("date").value,
        familyName: document.getElementById("familyName").value,
        childName: document.getElementById("childName").value,
        category: document.getElementById("category").value,
        activity: document.getElementById("activity").value,
        bucks: parseInt(document.getElementById("bucks").value)
    };

    await fetch("/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry)
    });

    loadEntries();
    e.target.reset();
} );
async function loadEntries() {
    const res = await fetch("/entries");
    const data = await res.json();

    const table = document.getElementById("ledgerTable");
    table.innerHTML = "";
    data.forEach(row => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${row.date}</td>
        <td>${row.familyName}</td>
        <td>${row.childName}</td>
        <td>${row.category}</td>
        <td>${row.activity}</td>
        <td>${row.bucks}</td>
        `;
		table.appendChild(tr);
    });
}

loadEntries();