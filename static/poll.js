
function getHash() {
    const pathname = window.location.pathname;

    const segments = pathname.split('/');
    const dynamicPart = segments[segments.length - 1];

    return dynamicPart

}

function postRequest() {
    document.getElementById("submit").disabled = true
    var choice = choiceFinder()

    if (choice != null){
        document.getElementById("choice").value = choice
    }

    const dataForm = document.getElementById('dataForm');

    const formData = new FormData(dataForm);

    // Create a new XMLHttpRequest object
    const xhr = new XMLHttpRequest();

    // Configure it: POST-request for the URL /submit-data
    xhr.open('POST', `/vote/${getHash()}`, true);

    // Set up a callback to handle the response
    xhr.onload = () => {
        if (xhr.status === 200) {
            console.log('Success:', xhr.responseText); // background-color: #e5e5e5;
            const formcheck = document.querySelectorAll('.form-check');

            formcheck.forEach(element => {

                //element.style.backgroundColor = '#e5e5e5';
                const child = element.querySelector('.form-check-label');
                
                if (child) {
                    
                    getLiveResults(child).then(count => {
                        element.setAttribute('data-bs-title', "Votes: "+count)
                        var tooltip = new bootstrap.Tooltip(element, {
                            title: element.getAttribute('data-bs-title'),
                            placement: 'right', // Adjust the placement as needed
                            trigger: 'manual', // We want to control when to show/hide it
                        });
                        tooltip.show();
                    }).catch(error => {
                        console.error('Error fetching live results:', error);
                    });
                    
                    //child.textContent += " (click to view results)"

                    //child.style.backgroundColor = '#e5e5e5';
                }

                const radio_btn = element.querySelector('.form-check-input');

                if (radio_btn) {
                    radio_btn.disabled = true
                }
            });
        } else {
            alert('Error: '+ xhr.statusText +"\nThat's all we know. This should not be tried again.");
        }
    };

    // Handle network errors
    xhr.onerror = () => {
        console.error('Network error');
    };

    // Send the FormData object
    xhr.send(formData);



}

function slugify(text) {
    return text
      .toString()                // Convert to string (in case it's not)
      .normalize('NFD')          // Normalize Unicode characters
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritical marks
      .replace(/[^a-z0-9 -]/g, '') // Remove non-alphanumeric characters except space and hyphen
      .trim()                    // Trim whitespace from the beginning and end
      .replace(/^-+|-+$/g, '');  // Remove leading and trailing hyphens
  }

  function getLiveResults(label) {
    var base64_option = btoa(slugify(label.textContent));

    return fetch(`/get_votes/${getHash()}?option=${base64_option}`)
        .then(response => {
            // Check if the request was successful
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            // Parse the JSON from the response
            return response.json();
        })
        .then(data => {
            // Return the count from the data
            return data.count;
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch
            console.error('There has been a problem with your fetch operation:', error);
            // You might want to return a default value here, like 0
            return 0; // or any other default value you find appropriate
        });
}



function choiceFinder() {
    const radios = document.querySelectorAll('input[name="flexRadioDefault"]');
    
    let selectedValue = null;
    
    radios.forEach(radio => {
        if (radio.checked) {
            selectedValue = radio.value;
        }
    });

    // Check if a value is selected and display it
    if (selectedValue) {
        return selectedValue
    } else {
        return null
    }
}