console.log("script is running")
     

                    const mealForm = document.querySelector('.meal_form');
                    mealForm.addEventListener('submit', handleFormSubmit);
                    const formData = new FormData(mealForm);
       
                async function handleFormSubmit(event) {
                    // This should be the first line executed when the form is submitted
                    console.log("Script inside handleFormSubmit is running");
                
                    // Prevent the default form submission
                   // event.preventDefault();
                
                    try { 
                        // Assuming you have an API endpoint that returns a JSON response
                        const response = await fetch('/admin-dashboard/register_meal', {
                            method: 'POST',
                            body: formData,
                        });
                
                        // Parse the JSON data from the server response
                        const data = await response.json();
                    
                
                        console.log('After fetch call');
                
                        if (data.success) {
                            console.log(data);
                            showSuccessModal();
                        }
                    } catch (error) {
                        console.error('Error:', error);
                    }
                }
                
                function showSuccessModal() {
                    var myModal = new bootstrap.Modal(document.getElementById('successModal'));
                    myModal.show();
                              }