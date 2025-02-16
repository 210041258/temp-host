


import { auth, database, storage } from './firebaseConfig.js';
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-auth.js";
import { ref as dbRef,ref,push, set, get, update, remove } from "https://www.gstatic.com/firebasejs/9.21.0/firebase-database.js";




const contentArea = document.getElementById('content-area');
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = 'https://210041258.github.io/temp-host/index.html';
    }
});

window.onload = function() {
    const url = new URL(window.location.href);
    
    // Check if there is a 'pin' parameter
    if (url.searchParams.has('pin')) {
      // Remove 'pin' parameter from URL
      url.searchParams.delete('pin');
      
      // Replace the current state with a new URL without 'pin'
      window.history.replaceState({}, document.title, url.pathname);
    }
  };


// Add this to your existing code
document.getElementById('logoutBtn').addEventListener('click', handleLogout);

async function handleLogout() {

    try {
        const reference = ref(database, "access"); // Specify the path where you want to store the access map
        await set(reference, true);
        console.log("Data pushed successfully ins");

        await signOut(auth);
        const card = document.querySelector('.card');
        card.style.animation = 'fadeOut 0.3s ease forwards';
        
        // Redirect to login page after animation
        setTimeout(() => {
            window.location.href = 'https://210041258.github.io/temp-host/';
        }, 300);
    } catch (error) {
        console.error("Error signing out:", error);
        alert("Error signing out. Please try again.");
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('content-area');

    document.querySelectorAll('.list-group-item').forEach(item => {
        item.addEventListener('click', () => {
            switch (item.id) {
                case 'bookViewBtn':
                    contentArea.style.display = 'block'; // Hide content area initially
                    
                    renderBookManagement();
                    break;
                case 'couponViewBtn':
                    contentArea.style.display = 'block'; // Hide content area initially

                    renderCouponManagement();
                    break;
                case 'notificationBtn':
                    contentArea.style.display = 'block'; // Hide content area initially
                
                    renderNotification();
                    break;
                case 'addBalanceBtn':
                    contentArea.style.display = 'block'; // Hide content area initially

                    renderAddBalance();
                    break;
                case 'contactbtn':
                    contentArea.style.display = 'block'; // Hide content area initially

                    contactbtn1();
                    break;

                case 'tracker':
                    contentArea.style.display = 'block'; // Hide content area initially

                    tracker();
                    break;
                default:
                    console.warn('No handler for this button:', item.id);
            }
        });
    });
});

function tracker() {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = ''; // Clear previous content
    
    // Create a styled input box for email
    const inputBox = document.createElement("input");
    inputBox.type = "text";
    inputBox.placeholder = "Enter your email address...";
    inputBox.className = "styled-input";
    
    const submitButton = document.createElement("button");
    submitButton.textContent = "Track User";
    submitButton.onclick = () => {
      const email = inputBox.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
      if (!email || !emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return;
      }
  
      const firebaseKey = email.replace(/[@.]/g, "_");
      const username = email.split("@")[0];
      
      // Reference to 'information'
      const dbRef = ref(database, 'information/' + username);
  
      // Clear content area
      contentArea.innerHTML = '';
  
      // Fetch user data
      get(dbRef).then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
  
          const table = document.createElement("table");
          table.innerHTML = `
            <tr>
              <th>Email</th>
              <th>Balance</th>
            </tr>
            <tr>
              <td>${userData.email}</td>
              <td>${userData.balance || 'N/A'}</td>
            </tr>
            <tr>
              <td colspan="2">
                <button onclick="showHistory('${firebaseKey}')">History</button>
                <button onclick="showNotifications('${firebaseKey}')">Notifications</button>
                <button onclick="showMyOrder('${firebaseKey}')">Order</button>
                <button onclick="showWishlist('${firebaseKey}')">Wishlist</button>
                <button onclick="createPDF_information('${firebaseKey}')">Download Profile</button>

              </td>
            </tr>
          `;
  
          contentArea.appendChild(table);
        } else {
          alert("User not found.");
          contentArea.innerHTML = '<p>No user data available.</p>';
        }
      }).catch((error) => {
        console.error("Error fetching user data:", error);
        contentArea.innerHTML = '<p>Error loading user data.</p>';
      });
    };
  
    // Append input and button to the content area
    contentArea.appendChild(inputBox);
    contentArea.appendChild(submitButton);
  }

  window.createPDF_information = createPDF_information;
  window.showHistory = showHistory;
  window.showNotifications = showNotifications;
  window.showWishlist = showWishlist;
  window.showMyOrder = showMyOrder;
  // Placeholder functions for actions (replace with your actual logic)



  async function showHistory(firebaseKey) {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = `<h3>User History</h3>`;
  
    // Reference to the history data in Firebase
    const historyRef = ref(database, `inter_user/${firebaseKey}/data/history`);
  
    try {
      // Fetch history data from Firebase
      const snapshot = await get(historyRef);
  
      if (snapshot.exists()) {
        const historyData = snapshot.val();
        const list = document.createElement("ul");
        list.style.listStyleType = 'none';
  
        // Iterate over history data and await book details
        for (const key in historyData) {
          if (historyData.hasOwnProperty(key)) {
            const record = historyData[key];
            const color = record.color || '#FFFFFF';
  
            const listItem = document.createElement("li");
            listItem.style.backgroundColor = color;
            listItem.style.color = 'white';
            listItem.style.padding = '10px';
            listItem.style.margin = '5px 0';
            listItem.style.borderRadius = '5px';
  
            // Extract and await the book details
            const details = await extractBookDetails(record.text);
  
            // Set the inner HTML of the list item
            listItem.innerHTML = `
              <strong>Order No:</strong> ${record.orderno || 'N/A'} <br>
              <strong>Text:</strong> ${record.text || 'N/A'} <br>
              <strong>Timestamp:</strong> ${record.timestamp || 'N/A'} <br>
              <strong>Book Details:</strong> ${details || 'N/A'} <br>
            `;
            list.appendChild(listItem);
          }
        }
  
        contentArea.appendChild(list);
      } else {
        alert("No history found for this user.");
        contentArea.innerHTML = '<p>No history data available.</p>';
      }
    } catch (error) {
      console.error("Error fetching history:", error);
      contentArea.innerHTML = `<p>Error loading history data.</p>`;
    }
  }

// Helper function to extract book details from record text (returns a Promise)
async function extractBookDetails(text) {
    const bookIdMatch = text.match(/Book id\s*:\s*(\d+)/);
    if (bookIdMatch) {
      const bookId = bookIdMatch[1];
      try {
        const bookDetails = await showBook(bookId);
        return bookDetails;
      } catch (error) {
        console.error(`Failed to fetch book details for ID ${bookId}:`, error);
        return 'Book details not found';
      }
    }
    return 'N/A';
  }
  function showBook(bookId) {
    return new Promise((resolve, reject) => {
      const booksRef = ref(database, 'book');
  
      get(booksRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            const booksData = snapshot.val();
            const bookData = booksData[bookId];
  
            if (bookData) {
              const bookDetails = `
               <br> <strong>Title:</strong> ${bookData.name || 'N/A'}<br>
                <strong>Author:</strong> ${bookData.author || 'N/A'}<br>
                <strong>Edition:</strong> ${bookData.edition || 'N/A'}<br>
                <strong>Department:</strong> ${bookData.department || 'N/A'}<br>
                <strong>Semester:</strong> ${bookData.semester || 'N/A'}<br>
                <strong>Price:</strong> ${bookData.price || 'N/A'}<br>
              `;
              resolve(bookDetails);
            } else {
              reject('Book not found');
            }
          } else {
            reject('No books data found');
          }
        })
        .catch((error) => {
          reject('Error loading book data: ' + error);
        });
    });
  }

  function showNotifications(firebaseKey) {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = `<h3>User Notifications</h3>`;
  
    // Reference to the notifications data in Firebase
    const notificationsRef = ref(database, `inter_user/${firebaseKey}/data/notification`);
  
    // Fetch notifications data from Firebase
    get(notificationsRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const notificationsData = snapshot.val();
          const list = document.createElement("ul");
          list.style.listStyleType = 'none';
  
          // Iterate over notification data
          for (const key in notificationsData) {
            if (notificationsData.hasOwnProperty(key)) {
              const notification = notificationsData[key];
  
              const listItem = document.createElement("li");
              listItem.style.backgroundColor = '#333';
              listItem.style.color = 'white';
              listItem.style.padding = '10px';
              listItem.style.margin = '5px 0';
              listItem.style.borderRadius = '5px';
  
              // Set the content of the list item
              listItem.innerHTML = `
                <strong>Title:</strong> ${notification.title || 'No Title'} <br>
                <strong>Message:</strong> ${notification.message || 'No Message'} <br>
                <strong>Sender Email:</strong> ${notification.senderEmail || 'Unknown'} <br>
                <strong>Timestamp:</strong> ${notification.timestamp || 'N/A'} <br>
              `;
  
              list.appendChild(listItem);
            }
          }
  
          // Append the generated list to the content area
          contentArea.appendChild(list);
        } else {
          alert("No notifications found for this user.");
          contentArea.innerHTML = '<p>No notifications available.</p>';
        }
      })
      .catch((error) => {
        console.error("Error fetching notifications:", error);
        contentArea.innerHTML = `<p>Error loading notifications data.</p>`;
      });
  }
  
function showMyOrder(firebaseKey) {
  const contentArea = document.getElementById('content-area');
  contentArea.innerHTML = `<h3>User Orders</h3>`;

  // Reference to the myorder data in Firebase
  const ordersRef = ref(database, `inter_user/${firebaseKey}/data/myorder`);

  // Fetch order data from Firebase
  get(ordersRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        const ordersData = snapshot.val();
        const list = document.createElement("ul");
        list.style.listStyleType = 'none';

        // Iterate over orders data
        Object.keys(ordersData).forEach((orderId) => {
          const order = ordersData[orderId];

          const listItem = document.createElement("li");
          listItem.style.backgroundColor = '#444';
          listItem.style.color = 'white';
          listItem.style.padding = '10px';
          listItem.style.margin = '5px 0';
          listItem.style.borderRadius = '5px';

          // Display order information
          listItem.innerHTML = `
            <strong>Order ID:</strong> ${order.orderid || 'N/A'} <br>
            <strong>Order Price:</strong> ${order.orderprice || 'N/A'} <br>
          `;

          list.appendChild(listItem);
        });

        // Append the generated list to the content area
        contentArea.appendChild(list);
      } else {
        alert("No orders found for this user.");
        contentArea.innerHTML = '<p>No order data available.</p>';
      }
    })
    .catch((error) => {
      console.error("Error fetching orders:", error);
      contentArea.innerHTML = `<p>Error loading order data.</p>`;
    });
}

  
function showWishlist(firebaseKey) {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = `<h3>User Wishlist</h3>`;
  
    // Reference to the wishlist data in Firebase
    const wishlistRef = ref(database, `inter_user/${firebaseKey}/data/wishlist`);
  
    // Fetch wishlist data from Firebase
    get(wishlistRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const wishlistData = snapshot.val();
          const list = document.createElement("ul");
          list.style.listStyleType = 'none';
  
          // Iterate over wishlist items
          wishlistData.forEach((book) => {
            const listItem = document.createElement("li");
            listItem.style.backgroundColor = '#444';
            listItem.style.color = 'white';
            listItem.style.padding = '10px';
            listItem.style.margin = '5px 0';
            listItem.style.borderRadius = '5px';
  
            // Display book information
            listItem.innerHTML = `
              <strong>Title:</strong> ${book.name || 'N/A'} <br>
              <strong>Author:</strong> ${book.author || 'N/A'} <br>
              <strong>Edition:</strong> ${book.edition || 'N/A'} <br>
              <strong>Department:</strong> ${book.department || 'N/A'} <br>
              <strong>Semester:</strong> ${book.semester || 'N/A'} <br>
              <strong>Price:</strong> ${book.price || 'N/A'} <br>
              <a href="${book.copy_preview || '#'}" target="_blank">Preview</a>
            `;
  
            list.appendChild(listItem);
          });
  
          // Append the generated list to the content area
          contentArea.appendChild(list);
        } else {
          alert("No wishlist found for this user.");
          contentArea.innerHTML = '<p>No wishlist data available.</p>';
        }
      })
      .catch((error) => {
        console.error("Error fetching wishlist:", error);
        contentArea.innerHTML = `<p>Error loading wishlist data.</p>`;
      });
  }
  
function contactbtn1() {
    // Clear the content area
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = "";

    // Add a title for the page
    const title = document.createElement("h2");
    title.textContent = "Email List Management - Confirmation Page";
    contentArea.appendChild(title);

    loadContacts();
}

function renderContactsTable(listMaps, contentArea) {
    let html = `
        <br>
        <div id="search-container" class="mt-3" style="text-align: center;">
            <input type="text" id="searchBox" class="form-control" placeholder="Search by Username..." 
                   style="max-width: 400px; margin: 0 auto; border-radius: 25px; padding: 10px;" aria-label="Search by Username"/>
           <br> <button id="searchBtn" onclick="filterTable()" class="btn btn-primary" style="border-radius: 25px; padding: 10px; margin-left: 10px;" aria-label="Search">
                Search
            </button>
        </div>
        <br><br>
        <table border="1" cellpadding="10" cellspacing="0" style="width: 100%;">
            <thead>
                <tr>
                    <th>Username</th>
                    <th>List Map ID</th>
                    <th>Order ID</th>
                    <th>Order Price</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody id="tableBody"></br>
    `;

    for (const email in listMaps) {
        const maps = listMaps[email];

        for (const mapId in maps) {
            const map = maps[mapId];

            html += `
                <tr>
                    <td>${email}</td>
                    <td>${mapId}</td>
                    <td>${map.orderid}</td>
                    <td>${map.orderprice}</td>
                    <td>
                        <button onclick="confirmDelete('${email}', '${mapId}')" aria-label="Confirm & Delete">Confirm & Delete</button>
                    </td>
                </tr>
            `;
        }
    }

    html += `
            </tbody>
        </table>
    `;

    contentArea.innerHTML = html;
}
window.filterTable= filterTable;
window.confirmDelete= confirmDelete;

function filterTable() {
    const searchValue = document.getElementById('searchBox').value.toLowerCase();
    const tableRows = document.querySelectorAll('#tableBody tr');

    tableRows.forEach(row => {
        const username = row.cells[0].textContent.toLowerCase();
        row.style.display = username.includes(searchValue) ? '' : 'none';
    });

    // Keep search term active (optional improvement)
    setTimeout(() => {
        loadContacts(searchValue);
    }, 10000);
}


async function loadContacts() {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = '<h3>Loading Email List Maps...</h3>';

    try {
        // Reference to 'contact' node in the database
        const contactsRef = dbRef(database, 'contact');
        const snapshot = await get(contactsRef);

        if (snapshot.exists()) {
            const contacts = snapshot.val();
            renderContactsTable(contacts, contentArea);
        } else {
            contentArea.innerHTML = '<p>No contacts found in the database.</p>';
        }
    } catch (error) {
        console.error("Error loading contacts:", error);
        contentArea.innerHTML = '<p>Error loading contacts. Please try again later.</p>';
        
        // Optional: Provide a button to retry loading contacts
        const retryButton = document.createElement('button');
        retryButton.innerText = 'Retry';
        retryButton.onclick = loadContacts; // Bind the retry function
        contentArea.appendChild(retryButton);
    }
}

async function confirmDelete(email, mapId) {
    const confirmation = confirm(`Are you sure you want to delete the list map ${mapId} for ${email}?`);
    if (confirmation) {
        try {
            const mapRef = dbRef(database, `contact/${email}/${mapId}`);
            await remove(mapRef);
            alert(`List map ${mapId} for ${email} deleted successfully.`);
            loadContacts(); // Refresh the list after deletion
        } catch (error) {
            console.error("Error deleting list map:", error);
            alert("Failed to delete the list map. Please try again.");
        }
    }
}


function renderBookManagement() {
    contentArea.innerHTML = `
        <h2>Book Management</h2>
        <button id="showBookListBtn" class="btn btn-primary mb-3">Show Book List</button>
        <button id="addBookBtn" class="btn btn-primary mb-3">Add Book</button>
        <button id="searchBookBtn" class="btn btn-primary mb-3">Search Book</button>
        <button id="historyBookBtn" class="btn btn-primary mb-3">View History</button>
        <div id="searchContainer" class="mb-3" style="display: none;">
            <input type="text" id="searchInput" class="form-control" placeholder="Search by ID, Name, or Author , or Department">
        </div>
        <div id="bookList" style="display: none;">
            <div class="table-responsive">
                    <div>
            <button id="downloadPdf">Download PDF</button>
        </div>
                <table id="bookTable" class="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Copies</th>
                            <th>Price</th>
                            <th>Department</th>
                            <th>Semester</th>
                            <th>Cover Image</th>
                            <th>Keywords</th>
                            <th>Author</th>
                            <th>Edition</th>
                            <th>PDF Preview</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="bookTableBody"></tbody>
                </table>
            </div>
        </div>
        <div id="historyContainer" style="display: none;">
            </br><h3>Action History</h3>
            <ul id="historyList" class="list-group"></ul>
        </div>
    `;
    document.getElementById('downloadPdf').addEventListener('click', createPDF);
    document.getElementById('showBookListBtn').addEventListener('click', showBookList);
    document.getElementById('addBookBtn').addEventListener('click', renderAddBookForm);
    document.getElementById('searchBookBtn').addEventListener('click', handleSearchBook);
    document.getElementById('historyBookBtn').addEventListener('click', toggleHistoryView);

    loadHistory();
}


function renderBooks(books, tableBody) {
    tableBody.innerHTML = '';
    books.forEach(book => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.id}</td>
            <td>${book.name}</td>
            <td>${book.description}</td>
            <td>${book.copies}</td>
            <td>${book.price}</td>
            <td>${book.department}</td>
            <td>${book.semester}</td>
            <td><img src="${book.url}" alt="${book.name}" style="width: 50px; height: auto;"></td>
            <td>${book.keywords.join(', ')}</td>
            <td>${book.author}</td>
            <td>${book.edition}</td>
            <td><a href="${book.copy_preview}" target="_blank">Preview</a></td>
            <td>
                <button style="width: 100px;" class="btn btn-sm btn-danger" onclick="deleteBook('${book.id}')">Delete</button>
                <button style="width: 100px;" class="btn btn-sm btn-warning" onclick="handleEditBook('${book.id}')">Edit</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

window.handleEditBook= handleEditBook;
window.deleteBook =deleteBook;


function showBookList() {
    const bookList = document.getElementById('bookList');
    if(bookList.style.display == 'block'){
        bookList.style.display = 'none';
        searchContainer.style.display= 'none';
    }
    bookList.style.display = 'block';
    searchContainer.style.display = 'block';
    loadBooks();
    
}

async function loadBooks() {
    const bookTableBody = document.getElementById('bookTableBody');
    bookTableBody.innerHTML = '<tr><td colspan="9">Loading books...</td></tr>';

    try {
        const booksRef = dbRef(database, 'book');
        const snapshot = await get(booksRef);

        if (snapshot.exists()) {
            const books = Object.values(snapshot.val());
            renderBooks(books, bookTableBody);
        } else {
            bookTableBody.innerHTML = '<tr><td colspan="9">No books found in the database.</td></tr>';
        }
    } catch (error) {
        console.error("Error loading books:", error);
        bookTableBody.innerHTML = '<tr><td colspan="9">Error loading books. Please try again later.</td></tr>';
    }
}




function renderAddBookForm() {
    contentArea.innerHTML = `
        <h2>Add New Book</h2>
        <form id="addBookForm">
            <!-- Other existing input fields -->
            <div class="mb-3">
                <label for="bookName" class="form-label">Name</label>
                <input type="text" class="form-control" id="bookName" required>
            </div>
            <div class="mb-3">
                <label for="bookDescription" class="form-label">Description</label>
                <textarea class="form-control" id="bookDescription" required></textarea>
            </div>
            <div class="mb-3">
                <label for="bookCopies" class="form-label">Copies</label>
                <input type="number" class="form-control" id="bookCopies" required>
            </div>
            <div class="mb-3">
                <label for="bookPrice" class="form-label">Price</label>
                <input type="number" class="form-control" id="bookPrice" step="0.01" required>
            </div>
            <div class="mb-3">
                <label for="bookDepartment" class="form-label">Department</label>
                <select class="form-control" id="bookDepartment" required>
                    <option value="">Select Department</option>
                    <option value="TVE">TVE</option>
                    <option value="CEE">CEE</option>
                    <option value="CSE">CSE</option>
                    <option value="EEE">EEE</option>
                    <option value="MPE">MPE</option>
                    <option value="BTM">BTM</option>
                </select>
            </div>
            <div class="mb-3">
                <label for="bookSemester" class="form-label">Semester</label>
                <input type="number" class="form-control" id="bookSemester" min="1" max="8" required>
            </div>
            <div class="mb-3">
                <label for="bookUrl" class="form-label">Cover Image URL</label>
                <input type="text" class="form-control" id="bookUrl" required>
            </div>
            <!-- New fields for keywords, author, edition, and PDF preview link -->
            <div class="mb-3">
                <label for="bookKeywords" class="form-label">Keywords (comma-separated)</label>
                <input type="text" class="form-control" id="bookKeywords" required>
            </div>
            <div class="mb-3">
                <label for="bookAuthor" class="form-label">Author</label>
                <input type="text" class="form-control" id="bookAuthor" required>
            </div>
            <div class="mb-3">
                <label for="bookEdition" class="form-label">Edition</label>
                <input type="text" class="form-control" id="bookEdition" required>
            </div>
            <div class="mb-3">
                <label for="copy_preview" class="form-label">PDF Preview Link</label>
                <input type="text" class="form-control" id="copy_preview" required>
            </div>
            <button type="submit" class="btn btn-primary">Add Book</button>
            <button type="button" class="btn btn-secondary" id="cancelAddBookBtn">Cancel</button>
        </form>
    `;
    
    document.getElementById('addBookForm').addEventListener('submit', handleAddBook);
    document.getElementById('cancelAddBookBtn').addEventListener('click', renderBookManagement);
}

    



async function handleAddBook(event) {
    event.preventDefault();
    
    const bookName = document.getElementById('bookName').value;
    const bookDescription = document.getElementById('bookDescription').value;
    const bookCopies = document.getElementById('bookCopies').value;
    const bookPrice = document.getElementById('bookPrice').value;
    const bookDepartment = document.getElementById('bookDepartment').value;
    const bookSemester = document.getElementById('bookSemester').value;
    const bookUrl = document.getElementById('bookUrl').value;
    const bookKeywords = document.getElementById('bookKeywords').value.split(',').map(keyword => keyword.trim());
    const bookAuthor = document.getElementById('bookAuthor').value;
    const bookEdition = document.getElementById('bookEdition').value;
    const copy_preview = document.getElementById('copy_preview').value;


    try {
        // Get the current book counter to determine the new book ID
        const bookCounterRef = dbRef(database, 'bookCounter');
        const counterSnapshot = await get(bookCounterRef);
        
        let newBookId = 1;
        if (counterSnapshot.exists()) {
            newBookId = counterSnapshot.val() + 1;  // Increment the counter
        }

        // Update the counter in the database for the next book
        await set(bookCounterRef, newBookId);

           const newBook = {
            id: String(newBookId),
            name: bookName,
            description: bookDescription,
            copies: bookCopies,
            price: bookPrice,
            department: bookDepartment,
            semester: bookSemester,
            url: bookUrl,
            keywords: bookKeywords,
            author: bookAuthor,
            edition: bookEdition,
            copy_preview: copy_preview
        };

        // Add the new book to Firebase
        const booksRef = dbRef(database, `book/${newBookId}`);
        await set(booksRef, newBook);

        // Log the history
        await logHistory('Added Book', String(newBookId), null, newBook);
        
        alert('Book added successfully.');
        renderBookManagement();

    } catch (error) {
        console.error("Error adding book:", error.message);
        alert(`Error adding book: ${error.message}. Please try again later.`);
    }
}

async function loadHistory() {
    const historyList = document.getElementById('historyList');
    if (!historyList) return;

    try {
        const historyRef = dbRef(database, 'history');
        const snapshot = await get(historyRef);

        historyList.innerHTML = '';

        if (snapshot.exists()) {
            const historyItems = Object.entries(snapshot.val())
                .map(([key, value]) => ({...value, key}))
                .sort((a, b) => b.timestamp - a.timestamp);

            historyItems.forEach(item => {
                const historyItem = document.createElement('div');
                historyItem.className = 'list-group-item d-flex justify-content-between align-items-center';
                historyItem.innerHTML = `
                    <div>
                        <strong>${new Date(item.timestamp).toLocaleString()}</strong>: 
                        ${item.action} - Book ID: ${item.bookId}
                    </div>
                    <button class="btn btn-sm btn-warning undo-button" data-history-id="${item.key}">
                        Undo
                    </button>
                `;
                historyList.appendChild(historyItem);
            });

            document.querySelectorAll('.undo-button').forEach(button => {
                button.addEventListener('click', handleUndo);
            });
        }
    } catch (error) {
        console.error("Error loading history:", error);
    }
}

async function handleUndo(event) {
    const historyId = event.target.dataset.historyId;
    try {
        const historyRef = dbRef(database, `history/${historyId}`);
        const snapshot = await get(historyRef);

        if (snapshot.exists()) {
            const historyItem = snapshot.val();
            const bookId = historyItem.bookId;
            const bookRef = dbRef(database, `book/${bookId}`);

            switch (historyItem.action) {
                case 'Added Book':
                    await remove(bookRef);
                    break;
                case 'Deleted Book':
                    if (historyItem.oldData) {
                        await set(bookRef, JSON.parse(historyItem.oldData));
                    }
                    break;
                case 'Updated Book':
                    if (historyItem.oldData) {
                        await set(bookRef, JSON.parse(historyItem.oldData));
                    }
                    break;
            }

            // Remove this history item
            await remove(historyRef);

            // Refresh book list and history
            loadBooks();
            loadHistory();

            alert('Action undone successfully.');
        }
    } catch (error) {
        console.error("Error undoing action:", error);
        alert('Error undoing action. Please try again.');
    }
}

async function logHistory(action, bookId, oldData = null, newData = null) {
    try {
        const historyRef = push(dbRef(database, 'history'));
        await set(historyRef, {
            timestamp: Date.now(),
            action: action,
            bookId: bookId,
            oldData: oldData ? JSON.stringify(oldData) : null,
            newData: newData ? JSON.stringify(newData) : null
        });
        loadHistory();
    } catch (error) {
        console.error("Error logging history:", error);
    }
}


function toggleHistoryView() {
    const historyContainer = document.getElementById('historyContainer');
    if (historyContainer.style.display === 'none') {
        historyContainer.style.display = 'block';
    } else {
        historyContainer.style.display = 'none';
    }
}

function handleSearchBook() {
    const searchValue = document.getElementById('searchInput').value.toLowerCase().trim();
    const bookTableBody = document.getElementById('bookTableBody');
    searchContainer.style.display = 'block';
    bookList.style.display = 'block';
    if (!searchValue) { // Checks for null, undefined, or empty string
        alert("Please enter a search term.");
        return; // Exit the function early if searchValue is invalid
      }
    bookTableBody.innerHTML = ''; // Clear existing content
    const loadingMessage = document.createElement('tr');
    loadingMessage.innerHTML = '<td colspan="9" class="text-center">Searching...</td>';
    bookTableBody.appendChild(loadingMessage); 

    const booksRef = dbRef(database, 'book');
    get(booksRef).then(snapshot => {
        if (snapshot.exists()) {
            const booksArray = snapshot.val();
            setTimeout(() => {
                document.getElementById('searchInput').value = "";
            
                bookTableBody.appendChild(noBooksMessage);
            }, 10000);
            const filteredBooks = Object.values(booksArray).filter(book => 
                book.name.toLowerCase().includes(searchValue) || 
                book.id.toLowerCase().includes(searchValue)||book.department.toLowerCase().includes(searchValue)
            );

            bookTableBody.innerHTML = ''; // Clear the previous search results
            if (filteredBooks.length > 0) {
                renderBooks(filteredBooks, bookTableBody);
            } else {
                const noResultsMessage = document.createElement('tr');
                noResultsMessage.innerHTML = '<td colspan="9" class="text-center">No matching books found.</td>';
                bookTableBody.appendChild(noResultsMessage);
            }
        } else {
            const noBooksMessage = document.createElement('tr');
            noBooksMessage.innerHTML = '<td colspan="9" class="text-center">No books found in the database.</td>';
            bookTableBody.appendChild(noBooksMessage);
        }
    }).catch(error => {
        console.error("Error fetching books for search:", error);
        bookTableBody.innerHTML = '<tr><td colspan="9" class="text-center text-danger"> Error searching for books. Please try again later.</td></tr>';
    });
}

async function handleEditBook(bookId) {
    const booksRef = dbRef(database, `book/${bookId}`);
    const snapshot = await get(booksRef);

    if (snapshot.exists()) {
        const book = snapshot.val();
        
        // Render the form with existing data for editing
        contentArea.innerHTML = `
        <h2>Edit Book</h2>
        <form id="editBookForm">
            <div class="mb-3">
                <label for="bookId" class="form-label">Book ID</label>
                <input type="text" class="form-control" id="bookId" value="${book.id}" readonly>
            </div>
            <div class="mb-3">
                <label for="bookName" class="form-label">Name</label>
                <input type="text" class="form-control" id="bookName" value="${book.name}">
            </div>
            <div class="mb-3">
                <label for="bookDescription" class="form-label">Description</label>
                <textarea class="form-control" id="bookDescription">${book.description}</textarea>
            </div>
            <div class="mb-3">
                <label for="bookCopies" class="form-label">Copies</label>
                <input type="number" class="form-control" id="bookCopies" value="${book.copies}">
            </div>
            <div class="mb-3">
                <label for="bookPrice" class="form-label">Price</label>
                <input type="number" class="form-control" id="bookPrice" value="${book.price}">
            </div>
            <div class="mb-3">
                <label for="bookDepartment" class="form-label">Department</label>
                <input type="text" class="form-control" id="bookDepartment" value="${book.department}">
            </div>
            <div class="mb-3">
                <label for="bookSemester" class="form-label">Semester</label>
                <input type="text" class="form-control" id="bookSemester" value="${book.semester}">
            </div>
            <div class="mb-3">
                <label for="bookUrl" class="form-label">Cover Image URL</label>
                <input type="text" class="form-control" id="bookUrl" value="${book.url}">
            </div>
            <div class="mb-3">
                <label for="bookKeywords" class="form-label">Keywords (comma-separated)</label>
                <input type="text" class="form-control" id="bookKeywords" value="${book.keywords.join(', ')}">
            </div>
            <div class="mb-3">
                <label for="bookAuthor" class="form-label">Author</label>
                <input type="text" class="form-control" id="bookAuthor" value="${book.author}">
            </div>
            <div class="mb-3">
                <label for="bookEdition" class="form-label">Edition</label>
                <input type="text" class="form-control" id="bookEdition" value="${book.edition}">
            </div>
            <div class="mb-3">
                <label for="copy_preview" class="form-label">PDF Preview Link</label>
                <input type="text" class="form-control" id="copy_preview" value="${book.copy_preview}">
            </div>
            <button type="submit" class="btn btn-primary">Save Changes</button>
            <button type="button" class="btn btn-secondary" onclick="renderBookManagement()">Cancel</button>
        </form>
    `;


        document.getElementById('editBookForm').addEventListener('submit', (event) => handleUpdateBook(event, bookId));
    }
}

window.renderBookManagement = renderAddBookForm;

// Delete book functionality
async function deleteBook(bookId) {
    const bookRef = dbRef(database, `book/${bookId}`);
    
    try {
        const snapshot = await get(bookRef);
        if (snapshot.exists()) {
            const oldData = snapshot.val();
            await remove(bookRef);
            logHistory('Deleted Book', bookId, oldData, null);
            alert(`Book ID ${bookId} deleted successfully.`);
            loadBooks();
        }
    } catch (error) {
        console.error("Error deleting book:", error);
        alert(`Error deleting Book ID ${bookId}. Please try again later.`);
    }
}

async function handleUpdateBook(event, bookId) {
    event.preventDefault();

    const bookName = document.getElementById('bookName').value;
    const bookDescription = document.getElementById('bookDescription').value;
    const bookCopies = document.getElementById('bookCopies').value;
    const bookPrice = document.getElementById('bookPrice').value;
    const bookDepartment = document.getElementById('bookDepartment').value;
    const bookSemester = document.getElementById('bookSemester').value;
    const bookUrl = document.getElementById('bookUrl').value;
    const bookKeywords = document.getElementById('bookKeywords').value.split(',').map(keyword => keyword.trim());
    const bookAuthor = document.getElementById('bookAuthor').value;
    const bookEdition = document.getElementById('bookEdition').value;
    const copy_preview = document.getElementById('copy_preview').value;
    
    try {
        const bookRef = dbRef(database, `book/${bookId}`);
        const snapshot = await get(bookRef);
        const oldData = snapshot.exists() ? snapshot.val() : null;

        const updatedBook = {
            id: bookId,
            name: bookName,
            description: bookDescription,
            copies: bookCopies,
            price: bookPrice,
            department: bookDepartment,
            semester: bookSemester,
            url: bookUrl,
            keywords: bookKeywords,
            author: bookAuthor,
            edition: bookEdition,
            copy_preview: copy_preview
        };

        await set(bookRef, updatedBook);

        logHistory('Updated Book', bookId, oldData, updatedBook);
        alert('Book updated successfully.');
        renderBookManagement();
    } catch (error) {
        console.error("Error updating book:", error);
        alert(`Error updating book: ${error.message}. Please try again later.`);
    }
}



// Define renderCouponManagement, renderNotification, and renderAddBalance
    function renderCouponManagement() {
        contentArea.innerHTML = `
            <h2>Coupon Management</h2>
            <button id="addCouponBtn" class="btn btn-primary mb-3">Add Coupon</button>
            <div id="couponList">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Coupon Code</th>
                            <th>Discount (%)</th>
                            <th>Expiry Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody id="couponTableBody"></tbody>
                </table>
            </div>
        `;
        document.getElementById('addCouponBtn').addEventListener('click', renderAddCouponForm);
        loadCoupons();
      
}

async function loadCoupons() {
    const couponTableBody = document.getElementById('couponTableBody');
    couponTableBody.innerHTML = '<tr><td colspan="4">Loading coupons...</td></tr>';

    try {
        const couponsRef = dbRef(database, 'coupons');
        const snapshot = await get(couponsRef);

        if (snapshot.exists()) {
            couponTableBody.innerHTML = '';
            snapshot.forEach((childSnapshot) => {
                const coupon = childSnapshot.val();
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${coupon.code}</td>
                    <td>${coupon.discount}%</td>
                    <td>${coupon.expiryDate}</td>
                    <td>
                        <button class="btn btn-sm btn-warning" onclick="editCoupon('${childSnapshot.key}')">Edit</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteCoupon('${childSnapshot.key}')">Delete</button>
                    </td>
                `;
                couponTableBody.appendChild(row);
            });
        } else {
            couponTableBody.innerHTML = '<tr><td colspan="4">No coupons found.</td></tr>';
        }
    } catch (error) {
        console.error("Error loading coupons:", error);
        couponTableBody.innerHTML = '<tr><td colspan="4">Error loading coupons. Please try again.</td></tr>';
    }
}
// Add this at the beginning of your JavaScript file
window.editCoupon = async function(couponId) {
    try {
        const couponRef = dbRef(database, `coupons/${couponId}`);
        const snapshot = await get(couponRef);
        
        if (snapshot.exists()) {
            const coupon = snapshot.val();
            
            // Render the edit form with the existing coupon data
            contentArea.innerHTML = `
                <h2>Edit Coupon</h2>
                <form id="editCouponForm">
                    <div class="mb-3">
                        <label for="couponCode" class="form-label">Coupon Code</label>
                        <input type="text" class="form-control" id="couponCode" value="${coupon.code}" required>
                    </div>
                    <div class="mb-3">
                        <label for="discount" class="form-label">Discount (%)</label>
                        <input type="number" class="form-control" id="discount" value="${coupon.discount}" required>
                    </div>
                    <div class="mb-3">
                        <label for="expiryDate" class="form-label">Expiry Date</label>
                        <input type="date" class="form-control" id="expiryDate" value="${coupon.expiryDate}" required>
                    </div>
                    <button type="submit" class="btn btn-primary">Save Changes</button>
                    <button type="button" class="btn btn-secondary">Cancel</button>
                </form>
            `;

            // Add event listener for the edit form submission
            document.getElementById('editCouponForm').addEventListener('submit', (event) => 
                handleEditCoupon(event, couponId)
            );

            // Add event listener for cancel button
            document.querySelector('.btn-secondary').addEventListener('click', renderCouponManagement);
            
        } else {
            alert('Coupon not found');
        }
    } catch (error) {
        console.error("Error loading coupon for edit:", error);
        alert('Error loading coupon details. Please try again.');
    }
};


// Also make deleteCoupon globally accessible
window.deleteCoupon = async function(couponId) {
    if (confirm("Are you sure you want to delete this coupon?")) {
        try {
            const couponRef = dbRef(database, `coupons/${couponId}`);
            await remove(couponRef);
            alert("Coupon deleted successfully.");
            loadCoupons();
        } catch (error) {
            console.error("Error deleting coupon:", error);
            alert("Error deleting coupon. Please try again.");
        }
    }
};

// Add the function to handle the edit form submission
async function handleEditCoupon(event, couponId) {
    event.preventDefault();
    
    const couponCode = document.getElementById('couponCode').value;
    const discount = document.getElementById('discount').value;
    const expiryDate = document.getElementById('expiryDate').value;

    // Validation
    if (!couponCode || !discount || !expiryDate) {
        alert('Please fill in all fields.');
        return;
    }

    if (isNaN(discount) || discount <= 0 || discount >= 100) {
        alert('Please enter a valid discount percentage between 1 and 99.');
        return;
    }

    try {
        const couponRef = dbRef(database, `coupons/${couponId}`);
        await set(couponRef, {
            code: couponCode,
            discount: parseInt(discount),
            expiryDate: expiryDate
        });

        alert('Coupon updated successfully.');
        renderCouponManagement();
    } catch (error) {
        console.error("Error updating coupon:", error);
        alert('Error updating coupon. Please try again.');
    }
}

function renderNotification() {
    contentArea.innerHTML = `
        <h2>Notification Center</h2>
        <button id="addNotificationBtn" class="btn btn-primary mb-3">Add Notification</button>
        <div id="notificationList">
            <ul class="list-group" id="notificationListItems"></ul>
        </div>
    `;
    document.getElementById('addNotificationBtn').addEventListener('click', renderAddNotificationForm);
}


function renderAddBalance() {
    contentArea.innerHTML = `
        <h2>Add Balance</h2>
        <form id="addBalanceForm">
            <div class="mb-3">
                <label for="user_email" class="form-label">User Email</label>
                <input type="email" class="form-control" id="user_email" required>
            </div>
            <div class="mb-3">
                <label for="amount" class="form-label">Amount to Add</label>
                <input type="number" class="form-control" id="amount" required min="1" max="100000" step="1">
            </div>
            <button type="submit" class="btn btn-primary">Add Balance</button>
        </form>
        <div id="userSearchResult" class="mb-3"></div> 
    `;
    document.getElementById('addBalanceForm').addEventListener('submit', handleAddBalance);
}




// Functions to handle Coupons
function renderAddCouponForm() {
    contentArea.innerHTML = `
       <h2>Add Coupon</h2>
<form id="addCouponForm">
  <div class="mb-3">
    <label for="couponCode" class="form-label">Coupon Code</label>
    <input type="text" class="form-control" id="couponCode" required>
  </div>
  <div class="mb-3">
    <label for="discount" class="form-label">Discount (%)</label>
    <input type="number" class="form-control" id="discount" required>
  </div>
  <div class="mb-3">
    <label for="expiryDate" class="form-label">Expiry Date</label>
    <input type="date" class="form-control" id="expiryDate" required>
  </div>
  <button type="submit" class="btn btn-primary">Add Coupon</button>
  <button type="button" class="btn btn-secondary">Cancel</button>
</form>
    `;
    document.getElementById('addCouponForm').addEventListener('submit', handleAddCoupon);
    document.querySelector('.btn-secondary').addEventListener('click', renderCouponManagement);
}
async function handleAddCoupon(event) {
    event.preventDefault();
    const couponCode = document.getElementById('couponCode').value;
    const discount = document.getElementById('discount').value;
    const expiryDate = document.getElementById('expiryDate').value;
  
    // Input validation
    if (!couponCode || !discount || !expiryDate) {
      alert('Please fill in all fields.');
      return; 
    }

    if (isNaN(discount) || discount <= 0 || discount >= 100) {
      alert('Please enter a valid discount percentage between 1 and 99.');
      return;
    }

    // Check if expiry date is in the future (optional but recommended)
    const today = new Date();
    const expiryDateObj = new Date(expiryDate);
    if (expiryDateObj <= today) {
      alert('Expiry date must be in the future.');
      return;
    }

    try {
        // Check for duplicate coupon code before adding
        const couponsRef = dbRef(database, 'coupons');
        const couponSnapshot = await get(couponsRef);
    
        if (couponSnapshot.exists()) {
          const coupons = couponSnapshot.val();
    
          // Check if a coupon with the entered code already exists
          for (const key in coupons) {
            if (coupons[key].code === couponCode) {
              alert('A coupon with this code already exists.');
              return; // Exit the function if a duplicate is found
            }
          }
        }
    
        // If no duplicate is found, proceed with adding the coupon
        const newCouponRef = push(couponsRef);
        await set(newCouponRef, {
          code: couponCode,
          discount: discount,
          expiryDate: expiryDate
        });
    
        alert('Coupon added successfully.');
        renderCouponManagement();
    } catch (error) {
      console.error("Error adding coupon:", error);
    }
  }

// Function to render Add Notification form
function renderAddNotificationForm() {
    contentArea.innerHTML = `
        <h2>Add Notification</h2>
        <form id="addNotificationForm">
            <div class="mb-3">
                <label for="notificationTitle" class="form-label">Title</label>
                <input type="text" class="form-control" id="notificationTitle" required>
            </div>
            
            <div class="mb-3">
                <label for="notificationMessage" class="form-label">Message</label>
                <textarea class="form-control" id="notificationMessage" required></textarea>
            </div>
            
            <div class="mb-3">
                <label for="notificationChannel" class="form-label">Select Notification Channel</label>
                <select class="form-control" id="notificationChannel" required>
                    <option value="" disabled selected>Select Channel</option>
                    <option value="oneUser">One User</option>
                    <option value="allUsers">All Users</option>
                    <option value="wishlistUsers">Wishlist Users</option>
                </select>
            </div>
            
            <!-- User Email Field (Visible for One User Option) -->
            <div class="mb-3" id="userEmailField" style="display: none;">
                <label for="notificationEmail" class="form-label">User Email</label>
                <input type="email" class="form-control" id="notificationEmail">
            </div>

            <!-- Book ID Field (Visible for Wishlist Users Option) -->
            <div class="mb-3" id="bookIdField" style="display: none;">
                <label for="bookId" class="form-label">Book ID</label>
                <input type="text" class="form-control" id="bookId" placeholder="Enter Book ID">
            </div>

            <button type="submit" class="btn btn-primary">Send Notification</button>
            <button type="button" class="btn btn-secondary">Cancel</button>
        </form>
    `;
    document.querySelector('.btn-secondary').addEventListener('click', renderNotification);
    document.getElementById("addNotificationForm").addEventListener("submit", handleAddNotification);

    // Re-attach change event listener
    const notificationChannel = document.getElementById("notificationChannel");
    const userEmailField = document.getElementById("userEmailField");
    const notificationEmail = document.getElementById("notificationEmail");
    const bookIdField = document.getElementById("bookIdField");
    const bookIdInput = document.getElementById("bookId");

    // Event listener to show/hide fields based on selected channel
    notificationChannel.addEventListener("change", function () {
        if (notificationChannel.value === "oneUser") {
            userEmailField.style.display = "block";
            notificationEmail.required = true;
            bookIdField.style.display = "none";
            bookIdInput.required = false;
        } else if (notificationChannel.value === "wishlistUsers") {
            userEmailField.style.display = "none";
            notificationEmail.required = false;
            bookIdField.style.display = "block";
            bookIdInput.required = true;
        } else {
            userEmailField.style.display = "none";
            notificationEmail.required = false;
            bookIdField.style.display = "none";
            bookIdInput.required = false;
        }
    });
}

async function handleAddNotification(event) {
    event.preventDefault(); // Prevent default form submission

    // Gather values from form fields
    const notificationTitle = document.getElementById('notificationTitle').value.trim();
    const notificationMessage = document.getElementById('notificationMessage').value.trim();
    const notificationChannel = document.getElementById('notificationChannel').value;
    const notificationEmail = document.getElementById('notificationEmail').value.trim();
    const bookId = document.getElementById('bookId')?.value.trim(); // Only for wishlist users
    const senderEmail = "admin@bookshop.iut"; // Replace with your logic to get the sender email

    // Prepare notification object
    const notificationData = {
        title: notificationTitle,
        message: notificationMessage,
        senderEmail: senderEmail, // Add the sender's email
        timestamp: new Date().toISOString(),
    };

    try {
        switch (notificationChannel) {
            case "oneUser":
                // Validate email input
                if (!notificationEmail) {
                    alert("Please provide a user email.");
                    return;
                }
                await sendNotificationToUser(notificationEmail, notificationData);
                alert('Notification sent to the specific user.');
                break;

            case "allUsers":
                await sendNotificationToAllUsers(notificationData);
                alert('Notification sent to all users.');
                break;

            case "wishlistUsers":
                // Validate book ID input
                if (!bookId) {
                    alert("Please provide a Book ID.");
                    return;
                }
                await sendNotificationToWishlistUsers(bookId, notificationData);
                alert('Notification sent to users with the specified wishlist item.');
                break;

            default:
                alert("Please select a valid notification channel.");
                return;
        }

        // Optionally, clear the form after successful submission
        document.getElementById('addNotificationForm').reset();

    } catch (error) {
        console.error("Error sending notification:", error.message);
        alert(`Error sending notification: ${error.message}. Please try again later.`);
    }
}

function sanitizeEmail(email) {
    // Replaces "." and "@" to prevent Firebase path issues
    return email.replace(/\./g, "_").replace(/@/g, "_");
}

async function sendNotificationToAllUsers(notificationData) {
    const usersRef = dbRef(database, 'information');
    const snapshot = await get(usersRef);
    const users = snapshot.val(); // Load users from the given format

    if (users) {
        for (const username in users) {
            const userEmail = users[username].email;
            
            if (userEmail) {
                const sanitizedEmail = sanitizeEmail(userEmail);
                const notificationsRef = dbRef(database, `inter_user/${sanitizedEmail}/data/notification`);
                const newNotificationRef = push(notificationsRef);
                await set(newNotificationRef, notificationData);
            }
        }
    } else {
        console.log("No users found in the database.");
    }
}

async function sendNotificationToUser(email, notificationData) {
    const sanitizedEmail = sanitizeEmail(email);
    const notificationsRef = dbRef(database, `inter_user/${sanitizedEmail}/data/notification`);
    const newNotificationRef = push(notificationsRef);
    await set(newNotificationRef, notificationData);
    console.log(`Notification sent to user: ${email}`);
}

async function sendNotificationToWishlistUsers(bookId, notificationData) {
    const usersRef = dbRef(database, 'inter_user');
    const snapshot = await get(usersRef);
    const users = snapshot.val(); // Load users from the given structure
    const count =0;
    if (users) {
        for (const emailKey in users) {
            const wishlistRef = dbRef(database, `inter_user/${emailKey}/data/wishlist`);
            const wishlistSnapshot = await get(wishlistRef);
            const wishlist = wishlistSnapshot.val();

            // Check if the user's wishlist contains the specified Book ID
            if (wishlist) {
                const hasBookInWishlist = Object.values(wishlist).some(item => item.id === bookId);
                if (hasBookInWishlist) {
                    count++;
                    const notificationsRef = dbRef(database, `inter_user/${emailKey}/data/notification`);
                    const newNotificationRef = push(notificationsRef);
                    await set(newNotificationRef, notificationData);
                }
            }
        }
        if(count !== 0 ){
            alert(`Notification sent to users with Book ID: ${bookId} in their wishlist.`);        
        }
    } else {
        console.log("No users found with wishlist items.");
    }

}


async function handleAddBalance(event) {
    event.preventDefault();
    const userEmail = document.getElementById('user_email').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const resultDiv = document.getElementById('userSearchResult'); 

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid positive amount.");
        return;
    }

    try {
        const username = userEmail.split('@')[0]; 
        const userRef = dbRef(database, `information/${username}`);
        const snapshot = await get(userRef);

        let currentBalance = 0;
        if (snapshot.exists()) {
            currentBalance = parseFloat(snapshot.val().balance || '0'); 
        }

        const newBalance = (currentBalance + amount).toFixed(1);

        await set(userRef, {
            email: userEmail,
            balance: newBalance
        });

        alert('Balance added successfully.');
        
        // Update the result display 
        resultDiv.innerHTML = `
            <br><div class="alert alert-success">
                Balance updated successfully!
                <br>
                User: ${userEmail}
                <br>
                New Balance: ${newBalance}
            </div>
        `;

    } catch (error) {
        console.error("Error adding balance:", error);
        alert('Error adding balance. Please try again.');
    }
}

// Attach the renderAddBalance function to the window object
window.renderAddBalance = renderAddBalance;



async function createPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Ensure autoTable is available
    if (!doc.autoTable) {
        console.error("autoTable is not available. Please check the script inclusion.");
        return;
    }

    const margin = 10;
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const table = document.getElementById('bookTable');

    if (!table) {
        alert("Table not found!");
        return;
    }

    // Define all possible headers
    const allHeaders = [
        "ID", "Name", "Copies", "Price", "Department", 
        "Semester", "Author", "Edition"
    ];

    // Extract available headers from the table
    const availableHeaders = Array.from(table.querySelectorAll('thead th')).map(th => th.innerText.trim());
    const headers = allHeaders.filter(header => availableHeaders.includes(header));

    // Extract rows data
    const rows = Array.from(table.querySelectorAll('tbody tr')).map(row => {
        const cells = Array.from(row.querySelectorAll('td'));
        return headers.map(header => {
            const headerIndex = availableHeaders.indexOf(header);
            return headerIndex !== -1 ? cells[headerIndex]?.innerText.trim() || "" : "";
        });
    });

    // Add the image (replace with your actual base64 string)
    const imgData = "data:image/png;base64,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"; // Example base64 string
    doc.addImage(imgData, 'PNG', margin, margin, 50, 50); // Adjust x, y, width, height as needed

    // Add title and date
    doc.setFontSize(18);
    doc.text("Book Management", margin, margin + 60); // Adjust y position to account for the image
    const formattedDate = new Date().toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
    });
    doc.setFontSize(12);
    doc.text(`Release Date: ${formattedDate}`, margin, margin + 70); // Adjust y position accordingly
    doc.line(margin, margin + 80, pageWidth - margin, margin + 80); // Adjust line position

    // Use autoTable to create the table with green and blue colors
    doc.autoTable({
        head: [headers],
        body: rows,
        startY: margin + 80, // Adjust Y position for the table
        margin: { horizontal: margin },
        styles: {
            fillColor: [245, 245, 245],  // Light grey for table rows
            textColor: [50, 50, 50], // Dark grey text color for the body
            fontSize: 10,
            lineColor: [0, 0, 0], // Black line color
        },
        headStyles: {
            fillColor: [70, 130, 180], // Steel blue color for the header
            textColor: [255, 255, 255], // White text color for the header
            fontSize: 12,
            fontStyle: 'bold',
            halign: 'center', // Center-align header text
        },
        alternateRowStyles: {
            fillColor: [230, 230, 230], // Light grey for alternate rows
        },
        theme: 'grid', // Grid theme for borders
    });
    // Add page numbers
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - 30 - 30, pageHeight - 20 + 10);
    }

    // Adding signature, address, and email at the end of the PDF
    const startY = doc.autoTable.previous.finalY + 10; // Position after the table
    doc.setFontSize(12);
    doc.text("Signature: Ahmed Albreem", margin, startY + 7);
    doc.text("Address: Gazipur - Board Bazar - IUT (PS:1701)", margin, startY + 14);
    doc.text("Email: albreem@iut-dhaka.edu", margin, startY + 21);
    doc.line(margin, startY + 25, pageWidth - margin, startY + 25);
    // Save the PDF
    doc.save("Book Management Report.pdf");
}


async function createPDF_information(firebaseKey) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Set up the document
    doc.setFontSize(18);
    doc.text("User  Profile Information", 10, 10);
    doc.setFontSize(12);
    const email = firebaseKey.replace(/_/, "@").replace(/_/g, ".");
    doc.text(`User Email: ${email}`, 10, 20);
    doc.line(10, 25, 200, 25); // Horizontal line

    // Fetch and add sections
    let startY = 40; // Initialize startY for the first section
    startY = await fetchAndAddSection(doc, "History", `inter_user/${firebaseKey}/data/history`, formatHistoryData, startY);
    startY = await fetchAndAddSection(doc, "Notifications", `inter_user/${firebaseKey}/data/notification`, formatNotificationData, startY);
    startY = await fetchAndAddSection(doc, "Orders", `inter_user/${firebaseKey}/data/myorder`, formatOrderData, startY);
    startY = await fetchAndAddSection(doc, "Wishlist", `inter_user/${firebaseKey}/data/wishlist`, formatWishlistData, startY);

    // Save the PDF
    doc.save("User _Profile_Information.pdf");
}

// Update the fetchAndAddSection function
async function fetchAndAddSection(doc, sectionTitle, dbPath, formatFunction, startY) {
    try {
        const sectionRef = ref(database, dbPath);
        const snapshot = await get(sectionRef);
        const data = snapshot.val();
        console.log("Fetched data for", sectionTitle, ":", data); // Log the fetched data

        if (data) {
            const formattedData = formatFunction(data);
            // Add section title
            doc.setFontSize(14);
            doc.text(sectionTitle, 10, startY);
            doc.line(10, startY + 5, 200, startY + 5); // Horizontal line

            // Add formatted data as a table
            doc.autoTable({
                startY: startY + 10,
                head: formattedData.head,
                body: formattedData.body,
                margin: { left: 10, right: 10 },
                theme: 'grid'
            });

            // Return the updated startY for the next section
            return doc.autoTable.previous.finalY + 10;
        } else {
            console.log("No data found for", sectionTitle); // Log if no data is found
            return startY; // Return the same startY if no data
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        return startY; // Return the same startY in case of error
    }
}
function select(str){
    if(str=="red"){return "Buying Book"}else{return "Deposite"}
}
function formatHistoryData(historyData) {
    const head = [[ "Event","Date", "Details"]];
    const body = Object.keys(historyData).map(key => {
        const event = historyData[key];
        return [ select(event.color)|| 'N/A', event.timestamp || 'N/A', event.text || 'N/A'];
    });
    return { head, body };
}

function formatNotificationData(notificationData) {
    const head = [["Email", "Title", "Message"]];
    const body = Object.keys(notificationData).map(key => {
        const notification = notificationData[key];
        return [notification.senderEmail|| 'N/A', notification.title|| 'N/A', notification.message|| 'N/A'];
    });
    return { head, body };
}

function formatOrderData(orderData) {
    const head = [["Order ID", "Amount"]];
    const body = Object.keys(orderData).map(key => {
        const order = orderData[key];
        return [order.orderid || 'N/A', order.orderprice|| 'N/A'];
    });
    return { head, body };
}

function formatWishlistData(wishlistData) {
    const head = [["Item", "Price", "Added Date"]];
    const body = Object.keys(wishlistData).map(key => {
        const item = wishlistData[key];
        return [item.name|| 'N/A', item.price|| 'N/A', item.addedDate|| 'N/A'];
    });
    return { head, body };
}



document.getElementById("downloadPdf").addEventListener("click", createPDF);

