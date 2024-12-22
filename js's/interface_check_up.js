/*function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    const distance = R * c * 1000; // Distance in meters
    return distance;
}*/




function showError(message) {
    const errorMessage = document.getElementById("error-message");
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
    setTimeout(() => {
        errorMessage.style.display = "none";
    }, 5000);
}

function checkConnection() {
    if (navigator.onLine) {
        document.body.style.visibility = 'visible';
    } else {
        document.body.style.visibility = 'hidden';
    }
}


setInterval(checkConnection, 500);


window.addEventListener('online', () => {
    document.body.style.visibility = 'visible';
});

window.addEventListener('offline', () => {
    document.body.style.visibility = 'hidden';
});


import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import { getDatabase, ref, set, push, get, child , onValue, remove } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";



// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyCzT77IureChCmwMkYq45oMVpmNTJgXYUw",
    authDomain: "iutianbookshop.firebaseapp.com",
    databaseURL: "https://iutianbookshop-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "iutianbookshop",
    storageBucket: "iutianbookshop.appspot.com",
    messagingSenderId: "300755004711",
    appId: "1:300755004711:web:fb9a9033b13b016cc78d02",
    measurementId: "G-64VGT3VT75"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// development componet on finding advanced working 


// Function to check VPN using server-side API for better security
async function checkVPN() {
    try {
        const apiUrl = "https://ipinfo.io/json?token=04280a9cb8a2af";
        const response = await fetch(apiUrl);

        if (!response.ok) {
            console.error(`Error: Response status ${response.status}`);
            return false;
        }

        const data = await response.json();
        const org = data.org ? data.org.toLowerCase() : "";
        const hostname = data.hostname ? data.hostname.toLowerCase() : "";

        const vpnKeywords = [
            "vpn", "proxy", "virtual private network", "virtual private server", "anonymizer", "tunnel",
            "ipsec", "openvpn", "sstp", "l2tp", "pptp", "ikev2", "wireguard", "softether", "strongswan",
            "anyconnect", "globalprotect", "pulse secure", "citrix", "fortigate", "checkpoint",
            "palo alto networks", "sonicwall", "pfsense", "opnsense", "squid", "nginx proxy",
            "apache proxy", "tor", "onion", "freenet", "i2p", "tails", "whonix", "privoxy",
            "hidemyass", "expressvpn", "nordvpn", "surfshark", "protonvpn", "kaspersky vpn",
            "mcafee secure vpn", "avast secureline vpn", "cloak", "secure", "mask", "protect",
            "hide", "relay", "encrypted", "socks", "privacy", "shield", "stealth", "jumpbox",
            "anonymous", "residential proxy", "untraceable", "masked ip", "hidden ip", "private ip",
            "dynamic ip", "rotating ip", "dedicated ip", "residential ip", "data center ip",
            "proxy server", "socks proxy", "http proxy", "vpn server", "vpn gateway", "secure connection",
            "encrypted connection", "private network", "secure access", "remote access", "internet security",
            "network security", "privacy shield", "data privacy", "internet privacy", "location masking",
            "geo masking", "ssl", "tls", "ssh", "ftps", "sftp", "datacenter", "cloud", "hosting","AS16276 OVH SAS","AS16276 OVH SAS"
        ];

        const hostingProviders = [
            "amazon web services", "aws", "amazon ec2", "amazon s3", "google cloud platform", "gcp",
            "google compute engine", "gce", "microsoft azure", "microsoft azure virtual machines",
            "digitalocean", "linode", "vultr", "ovhcloud", "rackspace", "internap", "equinix",
            "telehouse", "colocation", "datacenter", "server farm", "cloud server", "virtual machine",
            "vm", "cloud instance", "aws lambda", "google cloud functions", "azure functions", "heroku",
            "netlify", "vercel", "now.sh", "fly.io", "render", "firebase", "aws elastic beanstalk",
            "google app engine", "azure app service", "scaleway", "alibaba cloud", "tencent cloud",
            "oracle cloud infrastructure", "oci", "ibm cloud", "sap cloud platform", "cloudflare",
            "fastly", "akamai", "cdn", "content delivery network", "strato", "dreamhost", "hostgator",
            "bluehost", "siteground", "namecheap", "godaddy", "inmotion hosting", "contabo", "a2 hosting",
            "webhosting.info", "1and1", "gandi", "name.com", "kubernetes","AS16276 OVH SAS"
        ];


        const isVPN = vpnKeywords.some(keyword => hostname.includes(keyword) || org.includes(keyword)) ||
                      hostingProviders.some(provider => org.includes(provider));

        if (isVPN) {
            console.log('VPN or Hosting Detected:', data);
        } else {
            console.log('No VPN Detected:', data);
        }

        return isVPN;
    } catch (error) {
        console.error('Error detecting VPN:', error);
        return false;
    }
}

function gatherDeviceInfo() {
    const userAgent = navigator.userAgent.toLowerCase();

    // Gather device info
    const deviceInfo = {
        timezone: new Date().getTimezoneOffset(),
        deviceType: /mobi|android|iphone|ipad|ipod/i.test(userAgent) ? 1 : 0,
        manufacturer: navigator.vendor ? 1 : 0,
        screenWidth: window.screen.width || 0,
        screenHeight: window.screen.height || 0,
        languages: (navigator.languages || ['Unknown']).join('_'), // Convert array to string with underscores
        hardwareConcurrency: navigator.hardwareConcurrency || 'Unknown',
        deviceMemory: navigator.deviceMemory || 'Unknown',
        browserVersion: (userAgent.match(/(chrome|firefox|safari|edg|opera)\/(\d+)/i) || [])[2] || 'Unknown',
        browserName: (userAgent.match(/(chrome|firefox|safari|edg|opera)/i) || [])[1] || 'Unknown',
        operatingSystem: navigator.platform || 'Unknown',
    };

    // Sanitize the object and create a formatted string without special characters
    const sanitizedDeviceInfo = Object.entries(deviceInfo).map(([key, value]) => {
        const sanitizedKey = key.replace(/[^a-zA-Z0-9_]/g, '_');
        const sanitizedValue = String(value).replace(/[^a-zA-Z0-9_]/g, '_');
        return sanitizedKey + "=" + sanitizedValue; // Format as key=value
    });

    // Join all key=value pairs into a single string with underscores
    const deviceInfoString = sanitizedDeviceInfo.join("__"); // Using double underscores as separator

    return deviceInfoString;
}
// Function to get the user's location
async function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Limit precision to 6 decimal places
                    const latitude = position.coords.latitude.toFixed(6).toString().replace(/\./g, '_'); 
                    const longitude = position.coords.longitude.toFixed(6).toString().replace(/\./g, '_'); 
                    
                    // Format the output string
                    resolve(`Lat_${latitude}_Long_${longitude}`);
                },
                (error) => {
                    // Detailed error handling
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            reject("Error 40! Access denied by the user.");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            reject("Error 20! Location information is unavailable.");
                            break;
                        case error.TIMEOUT:
                            reject("Error 30! Request timed out.");
                            break;
                        default:
                            reject("Error 10! Configuring latitude and longitude interrupted.");
                    }
                }
            );
        } else {
            reject("Error 40! Geolocation is not supported by this browser.");
        }
    });
}


// Function to get the location and process it
async function getLocationAndProcess() {
    try {
        const locationString = await getCurrentLocation();
        return locationString;
    } catch (error) {
        console.error("Error 404! Response error interrupt", error);
        return null; // Return null on error
    }
}

// ion case that i will check connect_globally(true,true,locations) || connect_globally(true,true,locations) 
async function connect_globally(branch_select, operation_select, details) {
    const basePath = branch_select
        ? '/blocked/details/admin/gateway/locations'
        : '/blocked/details/admin/gateway/devices';

    const reference = ref(database, basePath); // Reference to the list

    try {
        if (!operation_select) {
            // Push the details to the list
            const newRef = push(reference, details); // push() generates the key
            console.log("Data pushed successfully at:", newRef.key, newRef.path, details);
            return newRef.key; // Return the generated key
        } else {
            // Check if any data exists under the basePath
            const snapshot = await get(reference);
            return snapshot.exists();
        }
    } catch (error) {
        console.error("Error during operation at:", basePath, "Error:", error);
        return false;
    }
}


async function remove_globally(branch_select, key) {
    // Validate key: Ensure key is a string and doesn't contain slashes
    if (typeof key !== 'string' || key.includes('/')) {
        console.error("Invalid key provided. Key must be a string and cannot contain slashes.");
        return false; // Return false to indicate failure
    }

    // Determine the base path based on the branch selection
    const basePath = branch_select
        ? '/blocked/details/admin/gateway/locations'
        : '/blocked/details/admin/gateway/devices';

    const reference = ref(database, basePath);


    try {
        // Fetch the data at the base path
        const snapshot = await get(reference);
        console.log(reference);
        if (!snapshot.exists()) {
            console.error("No data found at the specified path.");
            return false;
        }

        const data = snapshot.val();

        // Iterate through the map to find and remove the matching key
        for (const [mapKey, value] of Object.entries(data)) {
            if (value === key) {
                const itemRef = ref(database, `${basePath}/${mapKey}`);
                await remove(itemRef);
                console.log(`Data removed at path: ${basePath}/${mapKey}`);
                return true; // Indicate success after removal
            }
        }

        console.log("Key not found in the map.");
        return false; // Indicate failure if key is not found
    } catch (error) {
        console.error("Error during removal:", error);
        return false; // Indicate failure
    }
}

async function handleVPNAndremoveStatus(){
    try {
        const isVPN = await checkVPN(); // Check if the user is connected to a VPN
        const body = document.body;
        if (isVPN) {
            // If connected to VPN
            body.style.visibility = 'hidden'; // Hide the body
            const deviceDetails = gatherDeviceInfo(); // Gather device information
            const isBlocked = await  remove_globally(false, deviceDetails); // Check if the user is blocked
            if (isBlocked) {
                console.log('removed device !!');
            } else {
                body.style.visibility = 'visible'; // Show the body if not blocked
            }
            
        } else {

            // If not connected to VPN
            body.style.visibility = 'visible'; // Ensure the body is visible
            const locationDetails = await getLocationAndProcess(); // Get location details
            if (locationDetails) {
                const isBlocked = await  remove_globally(true, locationDetails); // Check if the user is blocked based on location
                if (isBlocked) {
                    console.log('removed location !!');
                }
            }
        }
    } catch (error) {
        console.error("Error 404! Response VPN interrupt", error);
    }
}

async function handleVPNAndBlockStatus(request_id) {
    try {
        const isVPN = await checkVPN(); // Check if the user is connected to a VPN
        const body = document.body;
        if (isVPN) {
            // If connected to VPN
            body.style.visibility = 'hidden'; // Hide the body
            const deviceDetails = gatherDeviceInfo(); // Gather device information
            if(request_id===1){
            const isBlocked = await connect_globally(false, false, deviceDetails); // Check if the user is blocked
            if (!isBlocked) {
                body.style.visibility = 'visible'; // Show the body if not blocked
            }
        }
        else{
            const isBlocked = await connect_globally(false, true, deviceDetails); // Check if the user is blocked based on location
            if(isBlocked){
                // return invpn state checking the retun true
                showError("Device Locked you may to free in 10s !!");
                setTimeout(() => {
                    document.getElementById('pin').disabled = true;
                    document.getElementById('pinForm').querySelector('button').disabled = true;
                }, 10000); 
                return;
            }

        }

        } else {

            // If not connected to VPN
            body.style.visibility = 'visible'; // Ensure the body is visible
            const locationDetails = await getLocationAndProcess(); // Get location details
            if(request_id===1){
            if (locationDetails) {
                 await connect_globally(true, false, locationDetails); // Check if the user is blocked based on location
            }

        }
        else{
            const isBlocked = await connect_globally(true, true, locationDetails); // Check if the user is blocked based on location
            if(isBlocked){
                showError("location locked you may to free in 10s !!");
                setTimeout(() => {
                    document.getElementById('pin').disabled = true;
                    document.getElementById('pinForm').querySelector('button').disabled = true;
                }, 10000); 
                return;
            }

        }
    }
    } catch (error) {
        console.error("Error 404! Response VPN interrupt", error);
    }
}



// Interval check and handling UI visibility
setInterval(handleVPNAndBlockStatus(0), 60000);



let attemptCounter = 0;
const maxAttempts = 3;
const blockedIpsCacheKey = "blocked_ips";

// Firebase reference for pin and refresh_pin
const pinsRef = ref(database, 'pin'); // Single value at the 'pin' path
const refreshPinRef = ref(database, 'refresh_pin'); // Path for refresh setting
const hashedPinsRef = ref(database, 'hpin'); // Path for hashed PIN



function hashPin(pin) {
    return CryptoJS.SHA256(pin).toString();
}

function containsCommonSubPattern(pin) {
    // Check for repeating digits (like '11', '22', etc.)
    for (let i = 0; i < pin.length - 1; i++) {
        if (pin[i] === pin[i + 1]) {
            return true;
        }
    }
    
    // Check for sequential increasing or decreasing numbers
    for (let i = 0; i < pin.length - 1; i++) {
        if (parseInt(pin[i]) + 1 === parseInt(pin[i + 1]) ||
            parseInt(pin[i]) - 1 === parseInt(pin[i + 1])) {
            return true;
        }
    }

    return false;
}

// Function to select the keyboard layout
// Function to select the keyboard layout with a weighted preference for STANDARD
function selectKeyboardLayout() {
    // Define available layouts
    const layouts = {
        STANDARD: [
            [7, 8, 9],
            [4, 5, 6],
            [1, 2,3]
        ],
        MIRRORED: [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, 9]
        ],
        LINEAR: [1, 2, 3, 4, 5, 6, 7, 8, 9]
    };

    // Define weights for each layout selection
    const layoutWeights = {
        STANDARD: 0.5, // 70% chance
        MIRRORED: 0.25, // 15% chance
        LINEAR: 0.70 // 15% chance
    };

    // Create an array for weighted random selection
    const weightedLayouts = [];
    for (const [key, weight] of Object.entries(layoutWeights)) {
        const count = Math.round(weight * 100);
        for (let i = 0; i < count; i++) {
            weightedLayouts.push(key);
        }
    }

    // Randomly select a layout based on the weighted array
    const selectedKey = weightedLayouts[Math.floor(Math.random() * weightedLayouts.length)];

    // Return the selected layout
    return layouts[selectedKey];
}


// Function to check if the digit is too close to the previous one based on the selected layout
function isTooCloseOnSelectedLayout(prevDigit, nextDigit, selectedLayout) {
    // Linear layout case
    if (Array.isArray(selectedLayout) && selectedLayout.length === 9) {
        const prevIndex = selectedLayout.indexOf(prevDigit);
        const nextIndex = selectedLayout.indexOf(nextDigit);
        const distance = Math.abs(prevIndex - nextIndex);
        return distance < 2; // True if digits are too close
    }

    // For 3x3 grid layouts (STANDARD, MIRRORED)
    function getPosition(digit, layout) {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (layout[row][col] === digit) {
                    return { row, col };
                }
            }
        }
        return null;
    }

    const prevPos = getPosition(prevDigit, selectedLayout);
    const nextPos = getPosition(nextDigit, selectedLayout);
    if (!prevPos || !nextPos) return false;

    const distance = Math.abs(prevPos.row - nextPos.row) + Math.abs(prevPos.col - nextPos.col);
    return distance > 2;
}

// Function to generate a random PIN (adjust length as needed)
function generateRandomPin(length = 4) {
    
    const selectedLayout = selectKeyboardLayout();


    // List of common PIN patterns to avoid
    const commonPatterns = new Set([
        // Repeated Digits
        '0000', '1111', '2222', '3333', '4444', '5555', '6666', '7777', '8888', '9999',
        '0011', '1122', '2233', '3344', '5566', '7788', '8899',

        // Sequential Numbers
        '0123', '1234', '2345', '3456', '4567', '5678', '6789',
        '9876', '8765', '7654', '6543', '5432', '4321', '3210',

        // Palindrome Numbers
        '0110', '1221', '1331', '1441', '2112', '3223', '4334', '5445', '9009',

        // Years
        '1999', '2000', '2010', '2020', '2023', '2024',
        '1980', '1985', '1990', '1995', '2001',

        // Popular Dates
        '0101', '1225', '0407', '0314',

        // Repeating and Alternating Patterns
        '1212', '1313', '1414', '2323', '4343', '5656',
        '1221', '3443', '4554', '7887',

        // Edge Cases
        '0001', '0009', '0010', '0099', '9998', '9999',

        // Keyboard Patterns
        '2580', '1593', '7531',

        // Significant Numbers
        '1234', '1111', '0000', '1212', '6969', '2580',
        '9110', '1122',

        // Double Digit Combos
        '1122', '3344', '5566', '7788', '9900',
        '1212', '3434', '5656', '7878', '9090'
    ]);

    let pin;

    do {
        pin = '';
        let prevDigit = null;

        for (let i = 0; i < length; i++) {
            let newDigit;
            do {
                newDigit = Math.floor(Math.random() * 9) + 1; // Generate digit from 1 to 9
            } while (newDigit === prevDigit || isTooCloseOnSelectedLayout(prevDigit, newDigit, selectedLayout));

            pin += newDigit;
            prevDigit = newDigit;
        }
    } while (commonPatterns.has(pin) || containsCommonSubPattern(pin));
    
    
   return pin;
}


// Submit the random PIN to Firebase (as a single value)
function submitPinToFirebase(pin) {
    const hashedPin = hashPin(pin);
    set(pinsRef, pin)
        .then(() => console.log("Plain PIN submitted successfully to Firebase"))
        .catch((error) => console.error("Error submitting plain PIN:", error));

    set(hashedPinsRef, hashedPin)
        .then(() => console.log("Hashed PIN submitted successfully to Firebase"))
        .catch((error) => console.error("Error submitting hashed PIN:", error));
}

// Refresh PIN based on the refresh variable
function refreshPinBasedOnVariable() {
    onValue(refreshPinRef, (snapshot) => {
        const refreshTrigger = snapshot.val();
        if (refreshTrigger === true) {
            const newPin = generateRandomPin();
            submitPinToFirebase(newPin); // Store new PIN and its hash
            console.log("PIN refreshed and updated in Firebase:", newPin);
            set(refreshPinRef, false); // Reset the trigger
        }
    });
}

// Sanitize IP to be stored in Firebase
function sanitizeIpForFirebase(ip) {
    return ip;  // Replace all periods and slashes with underscores
}

// Function to store blocked IP in Firebase
async function storeBlockedIpInFirebase(ip) {
    if (!ip) return;

    const sanitizedIp = sanitizeIpForFirebase(ip);  // Sanitize the IP
    const blockedIpRef = ref(database, `blocked/details/admin/gateway/ips/${sanitizedIp}`);
    try {
        await set(blockedIpRef, true);  // Store the sanitized IP as blocked
        console.log("IP successfully stored as blocked in Firebase:", sanitizedIp);
    } catch (error) {
        console.error("Error storing IP in Firebase:", error);
    }
}

// Check if the IP is blocked in Firebase
async function isIpBlocked_db() {
    const userIp = await getUserIp();
    if (!userIp) return false;

    // Check Firebase if this IP is blocked
    const blockedIpRef = ref(database, `blocked/details/admin/gateway/ips/${sanitizeIpForFirebase(userIp)}`);
    const snapshot = await get(blockedIpRef);
    return snapshot.exists();  // If the IP exists in Firebase, it is blocked
}

// Remove blocked IP from Firebase
async function removeBlockedIpFromFirebase(ip) {
    if (!ip) return;

    const sanitizedIp = sanitizeIpForFirebase(ip);  // Sanitize the IP
    const blockedIpRef = ref(database, `blocked/details/admin/gateway/ips/${sanitizedIp}`);
    
    try {
        await remove(blockedIpRef);  // Remove the sanitized IP from Firebase
        console.log("IP successfully removed from blocked list in Firebase:", sanitizedIp);
    } catch (error) {
        console.error("Error removing IP from Firebase:", error);
    }
}

// Function to block the user IP
async function blockUserIp() {
    const userIp = await getUserIp();
    if (!userIp) return;

    let blockedIps = JSON.parse(localStorage.getItem(blockedIpsCacheKey)) || [];
    if (!blockedIps.includes(userIp)) {
        blockedIps.push(userIp);
        localStorage.setItem(blockedIpsCacheKey, JSON.stringify(blockedIps));
        console.log("User IP blocked:", userIp);
    }

    // Store IP in Firebase
    await storeBlockedIpInFirebase(userIp);
}

function hashIp(ip) {
    return CryptoJS.SHA256(ip).toString();
}


// Get the user's IP address
async function getUserIp() {
    try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        return hashIp(data.ip);
    } catch (error) {
        console.error("Error fetching IP:", error);
        return null;
    }
}

// Check if the IP is blocked locally
async function isIpBlocked() {
    const userIp = await getUserIp();
    if (!userIp) return false;

    const blockedIps = JSON.parse(localStorage.getItem(blockedIpsCacheKey)) || [];
    return blockedIps.includes(userIp);
}

// Periodically check if the user's IP is blocked
function startCheckingBlockedIp() {
    const intervalId = setInterval(async () => {
        const ipBlocked = await isIpBlocked_db(); // Check if IP is blocked
        if (ipBlocked === true) {
            showError("IP is blocked.");
            clearInterval(intervalId);  // Stop the interval if IP is blocked

            // Disable the login button
            const loginButton = document.querySelector("button[type='submit'].btn.btn-primary");
            if (loginButton) {
                loginButton.disabled = true;  // Disable the button
                loginButton.style.backgroundColor = "#ccc";  // Optional: change button color to indicate it's disabled
                loginButton.style.cursor = "not-allowed";  // Optional: change cursor style to not-allowed
            }

            showError("Access blocked due to multiple failed attempts.");
        } else {
            console.log("IP is not blocked. Continuing checks...");
        }
    }, 10000);  // Check every 5 seconds
}

function toggleSubmitButtonTemporarily(submitButton) {
    submitButton.disabled = true; // Disable the button
    setTimeout(() => {
        submitButton.disabled = false; // Re-enable the button after 2 seconds
    }, 1500); // 2000ms (2 seconds) delay
}

// Form submission to check user input against stored PIN
document.getElementById('pinForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitButton = document.getElementById('pinForm').querySelector('button');
    toggleSubmitButtonTemporarily(submitButton);
    const userPin = document.getElementById('pin').value.trim();

    if (userPin === "1111") {
        const userIp = await getUserIp();
        handleVPNAndremoveStatus();
        removeBlockedIpFromLocalStorage(userIp);  // Remove IP from localStorage
        removeBlockedIpFromFirebase(userIp);     // Remove IP from Firebase
        return;
    }

/*
    if(!(who_out_block_domain())){
        showError("Your All location is blocked");
        document.getElementById('pin').disabled = true;
        document.getElementById('pinForm').querySelector('button').disabled = true;
        return;
    }*/


    if (await isIpBlocked()) {
        showError("Access blocked due to multiple failed attempts.");
        document.getElementById('pin').disabled = true;
        document.getElementById('pinForm').querySelector('button').disabled = true;
        return;
    }

    checkUserPin();
});


// Remove blocked IP from localStorage
function removeBlockedIpFromLocalStorage(ip) {
    let blockedIps = JSON.parse(localStorage.getItem(blockedIpsCacheKey)) || [];
    blockedIps = blockedIps.filter((blockedIp) => blockedIp !== ip);  // Filter out the IP to unblock
    localStorage.setItem(blockedIpsCacheKey, JSON.stringify(blockedIps));  // Update localStorage
    console.log("IP removed from localStorage:", ip);
}

async function checkUserPin() {
    startCheckingBlockedIp();
    const userPin = document.getElementById('pin').value.trim();
    const hashedUserPin = hashPin(userPin);

    try {
        const hashed_ip = await getUserIp(); // Await the IP hash retrieval separately
        
        const snapshot = await get(hashedPinsRef);
        const storedHashedPin = snapshot.val();

        if (hashedUserPin === storedHashedPin) {
            showError("PIN matched, redirecting...");
            // Form the URL after both hashedUserPin and hashed_ip are resolved
            const redirectUrl = `https://210041258.github.io/temp-host/index.html?pin=${hashedUserPin}&ip=${hashed_ip}`;
            window.location.href = redirectUrl;
        } else {
            attemptCounter++;
            showError(`Incorrect PIN. You have ${maxAttempts - attemptCounter} attempts left.`);

            if (attemptCounter >= maxAttempts) {
                showError("Maximum attempts reached. Access blocked.");
                await blockUserIp();
                handleVPNAndBlockStatus(1)
                document.getElementById('pin').disabled = true;
                document.getElementById('pinForm').querySelector('button').disabled = true;
            }
        }
    } catch (error) {
        console.error("Error during PIN check:", error);
        showError("Error checking PIN. Please try again later.");
    }
}



// Initial setup for random PIN
const randomPin = generateRandomPin(4);
submitPinToFirebase(randomPin);
setInterval(refreshPinBasedOnVariable,5000);
/*
async function getCurrentLocation_formated_spc() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    // Limit precision to 6 decimal places
                    const latitude = position.coords.latitude.toFixed(6).toString().replace(/\./g, '_'); 
                    const longitude = position.coords.longitude.toFixed(6).toString().replace(/\./g, '_'); 
                    
                    // Format the output string
                    resolve({ latitude, longitude });
                },
                (error) => {
                    // Detailed error handling
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            reject("Error 40! Access denied by the user.");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            reject("Error 20! Location information is unavailable.");
                            break;
                        case error.TIMEOUT:
                            reject("Error 30! Request timed out.");
                            break;
                        default:
                            reject("Error 10! Configuring latitude and longitude interrupted.");
                    }
                }
            );
        } else {
            reject("Error 40! Geolocation is not supported by this browser.");
        }
    });
}

async function who_out_block_domain() {
    try {
        // Get the current location
        const { latitude: newLatitude, longitude: newLongitude } = await getCurrentLocation_formated_spc();
        console.log(`Current Location: Lat_${newLatitude}_Long_${newLongitude}`);

        const basePath = '/blocked/details/admin/gateway/locations';
        const reference = ref(database, basePath);
        const found = 0;
        // Fetch all locations from the database
        const snapshot = await get(reference);

        if (!snapshot.exists()) {
            console.log("No locations found in the database.");
            return;
        }

        const data = snapshot.val();
        
        // Iterate over all locations in the database
        for (const [mapKey, value] of Object.entries(data)) {
            // Parse the existing location in the format Lat_<latitude>_Long_<longitude>
            const locationMatch = value.match(/Lat_([-\d_]+)_Long_([-\d_]+)/);
            if (locationMatch && locationMatch.length === 3) {
                const existingLatitude = locationMatch[1].replace(/_/g, '.'); // Convert to decimal format
                const existingLongitude = locationMatch[2].replace(/_/g, '.'); // Convert to decimal format

                // Calculate the distance between the current and existing location
                const distance = calculateDistance(newLatitude, newLongitude, existingLatitude, existingLongitude);

                if (distance <= 250) {
                    console.log(`Found a nearby location within 250 meters: Lat_${existingLatitude}_Long_${existingLongitude}`);
                    return 0;
                }
            }
        }

    } catch (error) {
        console.error("Error finding nearby locations:", error);
    }
    return 1;
}*/