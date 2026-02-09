let events = [];
let editingEventId = null;

function updateLocationOptions() {
   let modality= document.getElementById('event_modality').value;
   if (modality === 'in-person') { 
       document.getElementById('locationSection').hidden = false;
       document.getElementById('event_location').required = true;
       document.getElementById('remoteSection').hidden = true;
       document.getElementById('event_remote_url').required = false;
       document.getElementById('attendeesSection').hidden = false;
       document.getElementById('event_attendees').required = true;
   } else if (modality === 'remote') { 
       document.getElementById('locationSection').hidden = true;
       document.getElementById('event_location').required = false;
       document.getElementById('remoteSection').hidden = false;
       document.getElementById('event_remote_url').required = true;
       document.getElementById('attendeesSection').hidden = false;
        document.getElementById('event_attendees').required = true;
   } 
}
function showModal(){
    document.getElementById('event_form').reset();
  document.getElementById('event_form').classList.remove('was-validated');
    document.getElementById('locationSection').hidden = true;
    document.getElementById('event_location').required = false;
    document.getElementById('remoteSection').hidden = true;
    document.getElementById('event_remote_url').required = false;
    document.getElementById('attendeesSection').hidden = true;
    document.getElementById('event_attendees').required = false;
    let modal = new bootstrap.Modal(document.getElementById('eventModal'));
    modal.show();
    console.log("Modal shown");
}
function saveEvent() {
  if (!document.getElementById('event_form').checkValidity()) {
    document.getElementById('event_form').classList.add('was-validated');
    return; 
  }
   const eventDetails = {
        id: editingEventId === null ? Date.now() : editingEventId,
        name: document.getElementById('event_title').value,
        category: document.getElementById('event_category').value,
        weekday: document.getElementById('event_weekday').value,
        time: document.getElementById('event_time').value,
        modality: document.getElementById('event_modality').value,
        location: document.getElementById('event_location').value,
        remote_url: document.getElementById('event_remote_url').value,
        attendees: document.getElementById('event_attendees').value
        .split(',')
      .map(a => a.trim())
      .filter(a => a.length > 0), 
    };
    if (editingEventId === null) {
      events.push(eventDetails);
      addEventToCalendarUI(eventDetails);
    } else {
      let index = events.findIndex(e => e.id === eventDetails.id);
      events[index] = eventDetails;
      updateEventCardUI(eventDetails);
    }
  console.log('Event Created:', eventDetails);
  document.getElementById('event_form').reset();
  editingEventId = null;
  document.getElementById('event_form').classList.remove('was-validated');
  let modalElement = document.getElementById('eventModal');
  let thisModal = bootstrap.Modal.getOrCreateInstance(modalElement);
  thisModal.hide();
}

function addEventToCalendarUI(eventInfo) {
  let event_card = createEventCard(eventInfo);
  let dayColumn = document.getElementById(eventInfo.weekday);
  dayColumn.appendChild(event_card);
}
function createEventCard(eventDetails) {
  let event_element = document.createElement('div');
  let info = document.createElement('div');
  event_element.className = 'event row border rounded m-1 py-1 bg-light';
   event_element.addEventListener('click', () => {
    openEditModal(eventDetails.id);
  });
  event_element.dataset.eventId = eventDetails.id;
  let name = eventDetails.name;
  let time = eventDetails.time;
  let modality = eventDetails.modality;
  let category = eventDetails.category;
  let location = eventDetails.location;
  let remoteUrl = eventDetails.remote_url;
  let attendees = eventDetails.attendees.join(', ');
  switch (category) {
    case 'work':
      event_element.classList.remove("bg-light")
      event_element.classList.add("bg-warning")
      break;
    case 'personal':
      event_element.classList.remove("bg-light")
      event_element.classList.add("bg-success")
      break;
    case 'sports':
      event_element.classList.remove("bg-light")
      event_element.classList.add("bg-info")
      break;
    case 'academic':
      event_element.classList.remove("bg-light")
      event_element.classList.add("bg-primary")
      break;
    case 'health':
      event_element.classList.remove("bg-light")
      event_element.classList.add("bg-danger")
      break;
    case 'other':
      break;
  }
  info.innerHTML = `
    <strong>Event Name:</strong>${name}<br>
    <small><strong>Time:</strong></small> ${time}<br>
    <small><strong>Modality:</strong></small> ${modality}<br>
    ${modality === 'in-person'
        ? `<small><strong>Location:</strong></small> ${location}<br>`
        : `<small><strong>Remote:</strong></small> <a href="${remoteUrl}>${remoteUrl}</a><br>`
    }<small><strong>Attendees:</strong></small> ${attendees}
  `;
  event_element.appendChild(info);
  return event_element;
}
function openEditModal(eventId){
  editingEventId = eventId;
  const event = events.find(e => e.id === eventId);
  document.getElementById('event_title').value = event.name;
  document.getElementById('event_weekday').value = event.weekday;
  document.getElementById('event_time').value = event.time;
  document.getElementById('event_modality').value = event.modality;
  document.getElementById('event_location').value = event.location;
  document.getElementById('event_category').value = event.category;
  document.getElementById('event_remote_url').value = event.remote_url;
  document.getElementById('event_attendees').value = event.attendees.join(', ');
  updateLocationOptions();
  let modal = new bootstrap.Modal(document.getElementById('eventModal'));
  modal.show();
}
function updateEventCardUI(event) {
  const oldCard = document.querySelector(`[data-event-id="${event.id}"]`);
  oldCard.remove();
  addEventToCalendarUI(event);
}
