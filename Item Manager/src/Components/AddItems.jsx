import React, { useState } from "react";
import axios from "axios";

function AddItems() {
  const [itemName, setItemName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [quantity, setQuantity] = useState("");
  const [Listitems, setListitems] = useState([]);
  const [showForm, setShowForm] = useState(false); // State to toggle form popup
  const [buttonText, setButtonText] = useState("Add");
  const [editingItemId, setEditingItemId] = useState(null);

  function Editlist(id) {
    const itemToEdit = Listitems.find((item) => item._id === id); // Use `_id`
  if (itemToEdit) {
    setItemName(itemToEdit.name);
    setStartDate(itemToEdit.startDate);
    setEndDate(itemToEdit.endDate);
    setQuantity(itemToEdit.quantity);
    setShowForm(true);
    setButtonText("Edit");
    setEditingItemId(id); // Use `_id`
  } else {
      // Clear form if no item is found
      setItemName("");
      setStartDate("");
      setEndDate("");
      setQuantity("");
    }
  }

  async function AddItem(e) {
    e.preventDefault(); // Prevent the default form submission behavior

    const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    // Validation for past dates
    if (startDate < today) {
      alert("Start date cannot be in the past.");
      return;
    }

    // Validation for end date being less than start date
    if (endDate < startDate) {
      alert("End date cannot be earlier than the start date.");
      return;
    }

    // Validation for negative or zero quantity
    if (quantity <= 0) {
      alert("Quantity must be a positive number.");
      return;
    }

    const newitem = {
      name: itemName,
      startDate: startDate,
      endDate: endDate,
      quantity: quantity,
    };

    try {
      if (editingItemId) {
        // Update existing item in the database
        await axios.put(`http://localhost:5000/items/${editingItemId}`, newitem);
        setListitems((prevItems) =>
          prevItems.map((item) =>
            item._id === editingItemId ? { ...item, ...newitem } : item
          )
        );
        setEditingItemId(null); // Reset editing item ID after saving
      } else {
        // Add new item to the database
        const response = await axios.post("http://localhost:5000/items", newitem);
        setListitems([...Listitems, response.data]); // Add the new item to the list
      }
    } catch (error) {
      console.error("Error saving item:", error);
    }

    // Clear the form
    setItemName("");
    setStartDate("");
    setEndDate("");
    setQuantity("");
    setButtonText("Add");
    setShowForm(false); // Close the form popup
  }

  async function handleDelete(id) {
    try {
      // Delete the item from the database
      await axios.delete(`http://localhost:5000/items/${id}`);
      const updatedItems = Listitems.filter((item) => item._id !== id); // Use `_id`
      setListitems(updatedItems); // Update the list of items
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  }

  function handleAddItem() {
    setItemName("");
    setStartDate("");
    setEndDate("");
    setQuantity("");
    setButtonText("Add");
    setEditingItemId(null);
    setShowForm(true);
  }

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <h1>Item Manager</h1>
        <button onClick={handleAddItem}>Add Item</button>
      </nav>
      <div className="App">
        {/* Ordered Items Table */}
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Quantity</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {Listitems.map((item,index) => (
              <tr key={item._id}>
                <td>{index+1}</td>
                <td>{item.name}</td>
                <td>{item.startDate}</td>
                <td>{item.endDate}</td>
                <td>{item.quantity}</td>
                <td>
                  <button onClick={() => handleDelete(item._id)} id="Delete">
                    Delete
                  </button>
                  <button onClick={() => Editlist(item._id)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Form Popup */}
        {showForm && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setShowForm(false)}>
                &times;
              </span>
              <form onSubmit={AddItem}>
                <input
                  type="text"
                  name="ItemName"
                  id="ItemName"
                  placeholder="Enter the item"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
                <input
                  type="date"
                  name="Start date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
                <input
                  type="date"
                  name="End date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
                <input
                  type="number"
                  name="Quantity"
                  placeholder="Enter the quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <button id="submit" type="submit">
                  {buttonText}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddItems;