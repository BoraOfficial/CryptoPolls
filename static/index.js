function addOption() {
    var options = document.getElementById("options_div");

    // Create new elements
    var wrapper = document.createElement('div');
    wrapper.className = 'option_wrapper';
    wrapper.dataset.index = document.getElementsByClassName('option_wrapper').length + 1;

    var innerDiv = document.createElement('div');
    innerDiv.style.display = 'flex';

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.marginRight = '.5rem';
    svg.style.cursor = 'pointer';
    svg.setAttribute('width', '24');
    svg.setAttribute('height', '32');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', '#191b1d');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    svg.classList.add('feather', 'feather-trash-2');
    svg.dataset.index = wrapper.dataset.index;
    svg.setAttribute('onclick', 'removeOption(this)');  // Custom attribute for event handling, could be handled differently

    var polyline = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
    polyline.setAttribute('points', '3 6 5 6 21 6');
    svg.appendChild(polyline);

    var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2');
    svg.appendChild(path);

    var line1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line1.setAttribute('x1', '10');
    line1.setAttribute('y1', '11');
    line1.setAttribute('x2', '10');
    line1.setAttribute('y2', '17');
    svg.appendChild(line1);

    var line2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line2.setAttribute('x1', '14');
    line2.setAttribute('y1', '11');
    line2.setAttribute('x2', '14');
    line2.setAttribute('y2', '17');
    svg.appendChild(line2);

    var input = document.createElement('input');
    input.type = 'text';
    input.className = 'form-control';
    input.id = 'poll_option';
    input.name = 'option[]';
    input.placeholder = 'Poll Option';
    input.required = true;

    // Assemble the elements
    innerDiv.appendChild(svg);
    innerDiv.appendChild(input);
    wrapper.appendChild(innerDiv);

    var br = document.createElement('br');
    wrapper.appendChild(br);

    // Append the new wrapper to the options div
    options.appendChild(wrapper);
}


function removeOption(el){
    var index = el.dataset.index
    var wrappers = document.getElementsByClassName('option_wrapper')

    for (let i = 0; i < wrappers.length; i++) {
        if(wrappers[i].dataset.index == index) {
            wrappers[i].remove()
        }
        
    }
}