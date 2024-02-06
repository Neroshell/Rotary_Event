



async function handleRegistration() {
    try {
        const response = await fetch('/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // Include user registration data here
            }),
        });

        if (response.ok) {
            const data = await response.json();

            // Check for success message and count data
            if (data.success) {
                // Update the UI with the new count
                updateCount(data.count);

                // Show a modal to thank the user for registering
                
            } else {
                console.error('Registration failed');
            }
        } else {
            console.error('Registration failed:', response.statusText);
        }
    } catch (error) {
        console.error('Error during registration:', error);
    }
}

function updateCount(newCount) {
    // Update the UI with the new count
    let guestNumber = document.querySelector('.guest-number');
    guestNumber.innerHTML = newCount;
}

handleRegistration()
