/* ==========================================================================
   JUGNU'S SALON - INTERACTIVE APPLICATION & SLOT ENGINE
   New City Phase 2, Wah Cantt
   ========================================================================== */

// 1. Services Database (Prices in PKR)
const SALON_SERVICES = [
  {
    id: 'hair-1',
    category: 'hair',
    name: 'Precision Layered Haircut',
    desc: 'Customized hair cutting with volume framing, wash, and signature blowdry.',
    price: 2500,
    duration: 45,
    tag: 'Popular'
  },
  {
    id: 'hair-2',
    category: 'hair',
    name: 'Bob / Feather Haircut & Styling',
    desc: 'Modern short cut or soft feathering tailored to your face shape.',
    price: 2000,
    duration: 40,
    tag: 'Trending'
  },
  {
    id: 'hair-3',
    category: 'hair',
    name: 'Full Hair Coloring / Highlights',
    desc: 'Premium low-ammonia hair dye with vibrant shade selection and gloss treatment.',
    price: 8500,
    duration: 90,
    tag: 'Coloring'
  },
  {
    id: 'hair-4',
    category: 'hair',
    name: 'Keratin & Protein Smoothing Treatment',
    desc: 'Frizz-elimination hair treatment providing 4-6 months of glossy straight hair.',
    price: 14500,
    duration: 120,
    tag: 'Treatment'
  },
  {
    id: 'makeup-1',
    category: 'makeup',
    name: 'Signature Party Glam Makeup',
    desc: 'Dewy HD base, customized eye shadow, lashes, contouring, and lip color.',
    price: 6500,
    duration: 60,
    tag: 'Best Seller'
  },
  {
    id: 'makeup-2',
    category: 'makeup',
    name: 'Model / Engagement Makeup',
    desc: 'High-definition long-wear glam for engagement, nikah, or photoshoot.',
    price: 12000,
    duration: 75,
    tag: 'HD Finish'
  },
  {
    id: 'bridal-1',
    category: 'bridal',
    name: 'Royal Barat Bridal Makeup Package',
    desc: 'Airbrush long-lasting base, jewelry setting, dupatta pinning, lashes & hair styling.',
    price: 35000,
    duration: 150,
    tag: 'Luxury Bridal'
  },
  {
    id: 'bridal-2',
    category: 'bridal',
    name: 'Walima Soft Elegance Bridal Package',
    desc: 'Soft pastel glow bridal look with sophisticated hairstyle and setting.',
    price: 30000,
    duration: 120,
    tag: 'Bridal'
  },
  {
    id: 'skin-1',
    category: 'skin',
    name: 'HydraFacial Deep Glow Treatment',
    desc: 'Exfoliation, pore extraction, serum infusion & LED light skin rejuvenation.',
    price: 7500,
    duration: 60,
    tag: 'Skincare'
  },
  {
    id: 'skin-2',
    category: 'skin',
    name: 'Organic Polish & Herbal Facial',
    desc: 'Relaxing herbal facial treatment for radiant, clear, and hydrated skin.',
    price: 3500,
    duration: 45,
    tag: 'Facial'
  }
];

// 2. Application State
let selectedServices = [];
let selectedDate = getTodayDateString();
let selectedSlot = null;

// Initialize App on DOM Loaded
document.addEventListener('DOMContentLoaded', () => {
  initDateInput();
  renderServicesGrid('all');
  initTabs();
  generateTimeSlots(selectedDate);
  loadAdminBookings();
  setupStaffModal();
});

// Helper: Get Today's Date String (YYYY-MM-DD)
function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Format Date for Display (e.g. Wed, 16 Sep 2026)
function formatDateForDisplay(dateStr) {
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', options);
}

// Initialize Date Picker Input
function initDateInput() {
  const dateInput = document.getElementById('bookingDate');
  if (!dateInput) return;
  
  dateInput.value = selectedDate;
  dateInput.min = getTodayDateString();
  
  dateInput.addEventListener('change', (e) => {
    selectedDate = e.target.value;
    selectedSlot = null;
    updateSlotSummary();
    generateTimeSlots(selectedDate);
  });
}

// Render Services Grid with Category Filter
function renderServicesGrid(categoryFilter) {
  const grid = document.getElementById('servicesGrid');
  if (!grid) return;

  const filtered = categoryFilter === 'all' 
    ? SALON_SERVICES 
    : SALON_SERVICES.filter(s => s.category === categoryFilter);

  grid.innerHTML = filtered.map(service => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    return `
      <div class="service-card">
        <span class="service-badge">${service.tag}</span>
        <div>
          <h3 class="service-title">${service.name}</h3>
          <p class="service-desc">${service.desc}</p>
        </div>
        <div>
          <div class="service-meta">
            <span class="service-price">PKR ${service.price.toLocaleString()}</span>
            <span class="service-duration"><i class="fa-regular fa-clock"></i> ${service.duration} mins</span>
          </div>
          <button class="btn ${isSelected ? 'btn-gold' : 'btn-outline'} btn-block mt-2" onclick="toggleServiceSelection('${service.id}')">
            <i class="fa-solid ${isSelected ? 'fa-check' : 'fa-plus'}"></i> ${isSelected ? 'Added to Booking' : 'Add to Booking'}
          </button>
        </div>
      </div>
    `;
  }).join('');
}

// Initialize Category Tabs
function initTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderServicesGrid(btn.dataset.tab);
    });
  });
}

// Toggle Service Selection for Booking
function toggleServiceSelection(serviceId) {
  const service = SALON_SERVICES.find(s => s.id === serviceId);
  if (!service) return;

  const index = selectedServices.findIndex(s => s.id === serviceId);
  if (index >= 0) {
    selectedServices.splice(index, 1);
  } else {
    selectedServices.push(service);
  }

  updateSelectedServicesUI();
  renderServicesGrid(document.querySelector('.tab-btn.active').dataset.tab);
}

// Update Selected Services UI List & Totals
function updateSelectedServicesUI() {
  const container = document.getElementById('selectedServicesList');
  const durationText = document.getElementById('totalDurationText');
  const priceText = document.getElementById('totalPriceText');

  if (selectedServices.length === 0) {
    container.innerHTML = `<p class="placeholder-text">No service selected yet. Click "Add to Booking" from services menu or pick below.</p>`;
    durationText.innerText = '0 min';
    priceText.innerText = 'PKR 0';
    updateSlotSummary();
    return;
  }

  container.innerHTML = selectedServices.map(s => `
    <div class="selected-item">
      <span>${s.name}</span>
      <strong>PKR ${s.price.toLocaleString()} <i class="fa-solid fa-xmark text-muted" style="cursor:pointer; margin-left:8px;" onclick="toggleServiceSelection('${s.id}')"></i></strong>
    </div>
  `).join('');

  const totalDuration = selectedServices.reduce((sum, s) => sum + s.duration, 0);
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);

  durationText.innerText = `${totalDuration} mins`;
  priceText.innerText = `PKR ${totalPrice.toLocaleString()}`;

  updateSlotSummary();
}

// Open Quick Service Picker Modal
function openQuickServicePicker() {
  const modal = document.getElementById('servicePickerModal');
  const pickerList = document.getElementById('pickerModalList');
  
  pickerList.innerHTML = SALON_SERVICES.map(s => {
    const isSelected = selectedServices.some(item => item.id === s.id);
    return `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid rgba(255,255,255,0.08);">
        <div>
          <strong>${s.name}</strong>
          <div class="text-muted" style="font-size:0.8rem;">PKR ${s.price.toLocaleString()} • ${s.duration} mins</div>
        </div>
        <button class="btn btn-sm ${isSelected ? 'btn-gold' : 'btn-outline'}" onclick="toggleServiceSelection('${s.id}'); openQuickServicePicker();">
          ${isSelected ? 'Selected' : 'Select'}
        </button>
      </div>
    `;
  }).join('');

  modal.classList.add('active');
}

function closeServicePickerModal() {
  document.getElementById('servicePickerModal').classList.remove('active');
}

// Dynamic Time Slot Availability Generator
function generateTimeSlots(dateStr) {
  const badge = document.getElementById('selectedDateBadge');
  if (badge) {
    badge.innerHTML = `Showing availability for: <strong>${formatDateForDisplay(dateStr)}</strong>`;
  }

  const morningGrid = document.getElementById('morningSlots');
  const afternoonGrid = document.getElementById('afternoonSlots');
  const eveningGrid = document.getElementById('eveningSlots');

  const morningTimes = ['10:00 AM', '10:45 AM', '11:30 AM', '12:15 PM'];
  const afternoonTimes = ['01:00 PM', '01:45 PM', '02:30 PM', '03:15 PM', '04:00 PM'];
  const eveningTimes = ['05:00 PM', '05:45 PM', '06:30 PM', '07:15 PM'];

  // Seeded status generator based on date string so slots look realistic & dynamic
  function getSlotStatus(timeStr) {
    const seed = dateStr.replace(/-/g, '') + timeStr.replace(/[^0-9]/g, '');
    const num = parseInt(seed) % 10;
    if (num === 1 || num === 5) return { type: 'booked', label: 'Booked' };
    if (num === 3 || num === 7) return { type: 'limited', label: '1 Left' };
    return { type: 'avail', label: 'Available' };
  }

  function renderGroup(timesArray, container) {
    container.innerHTML = timesArray.map(time => {
      const status = getSlotStatus(time);
      const isSelected = selectedSlot === time;
      const isBooked = status.type === 'booked';
      
      return `
        <div class="slot-pill ${status.type} ${isSelected ? 'selected' : ''}" 
             onclick="${isBooked ? '' : `selectTimeSlot('${time}')`}">
          <span class="slot-time">${time}</span>
          <span class="slot-status">${isSelected ? 'SELECTED' : status.label}</span>
        </div>
      `;
    }).join('');
  }

  renderGroup(morningTimes, morningGrid);
  renderGroup(afternoonTimes, afternoonGrid);
  renderGroup(eveningTimes, eveningGrid);
}

// Select Time Slot
function selectTimeSlot(timeStr) {
  selectedSlot = timeStr;
  generateTimeSlots(selectedDate);
  updateSlotSummary();
}

// Update Slot Confirmation Summary Box & Enable Submit Button
function updateSlotSummary() {
  const box = document.getElementById('slotConfirmationSummary');
  const btn = document.getElementById('submitBookingBtn');

  if (selectedServices.length === 0) {
    box.innerHTML = `<i class="fa-solid fa-circle-exclamation text-gold"></i> Please select at least 1 service above.`;
    btn.disabled = true;
    return;
  }

  if (!selectedSlot) {
    box.innerHTML = `<i class="fa-solid fa-clock text-gold"></i> Selected: <strong>${selectedServices.length} Service(s)</strong>. Now choose a time slot in column 2.`;
    btn.disabled = true;
    return;
  }

  box.innerHTML = `
    <div class="text-gold" style="font-weight:600; font-size:0.95rem;">
      <i class="fa-solid fa-circle-check"></i> Ready to Book!
    </div>
    <div style="font-size:0.85rem; margin-top:4px;">
      Date: <strong>${formatDateForDisplay(selectedDate)}</strong><br>
      Time Slot: <strong>${selectedSlot}</strong><br>
      Total Services: <strong>${selectedServices.length} item(s)</strong>
    </div>
  `;
  btn.disabled = false;
}

// Handle Form Submission
function handleBookingSubmit(e) {
  e.preventDefault();

  if (selectedServices.length === 0 || !selectedSlot) {
    alert('Please select service(s) and an available time slot first.');
    return;
  }

  const name = document.getElementById('clientName').value.trim();
  const phone = document.getElementById('clientPhone').value.trim();
  const stylist = document.getElementById('preferredStylist').value;
  const notes = document.getElementById('specialNotes').value.trim();

  const bookingId = 'JUG-' + Math.floor(1000 + Math.random() * 9000);
  const totalPrice = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const serviceNames = selectedServices.map(s => s.name).join(', ');

  const bookingData = {
    id: bookingId,
    clientName: name,
    clientPhone: phone,
    date: selectedDate,
    timeSlot: selectedSlot,
    services: serviceNames,
    totalPrice: totalPrice,
    stylist: stylist,
    notes: notes,
    createdAt: new Date().toISOString()
  };

  // Save to LocalStorage for persistence & admin view
  saveBookingToStorage(bookingData);

  // Show Receipt Modal
  showReceiptModal(bookingData);
}

// Save Booking to Local Storage
function saveBookingToStorage(booking) {
  const existing = JSON.parse(localStorage.getItem('jugnu_salon_bookings') || '[]');
  existing.unshift(booking);
  localStorage.setItem('jugnu_salon_bookings', JSON.stringify(existing));
  loadAdminBookings();
}

// Display Receipt Modal with WhatsApp Pre-filled Link
function showReceiptModal(data) {
  const modal = document.getElementById('receiptModal');
  const content = document.getElementById('receiptContent');
  const waBtn = document.getElementById('whatsappConfirmBtn');

  content.innerHTML = `
    <div class="receipt-ticket">
      <div class="ticket-row">
        <span>Booking Reference:</span>
        <strong class="text-gold">${data.id}</strong>
      </div>
      <div class="ticket-row">
        <span>Client Name:</span>
        <strong>${data.clientName}</strong>
      </div>
      <div class="ticket-row">
        <span>Salon Branch:</span>
        <strong>New City Phase 2 Arcade, Wah Cantt</strong>
      </div>
      <div class="ticket-row">
        <span>Appointment Date:</span>
        <strong>${formatDateForDisplay(data.date)}</strong>
      </div>
      <div class="ticket-row">
        <span>Reserved Time Slot:</span>
        <strong class="text-gold">${data.timeSlot}</strong>
      </div>
      <div class="ticket-row">
        <span>Selected Services:</span>
        <strong>${data.services}</strong>
      </div>
      <div class="ticket-row" style="border-bottom:none; margin-bottom:0; font-size:1.05rem;">
        <span>Total Estimated Bill:</span>
        <strong class="text-gold">PKR ${data.totalPrice.toLocaleString()}</strong>
      </div>
    </div>
  `;

  // Construct WhatsApp Message
  const waMessage = encodeURIComponent(
    `Hello Jugnu's Salon (New City Phase 2)!\n` +
    `I would like to confirm my appointment slot:\n\n` +
    `📌 Booking Ref: ${data.id}\n` +
    `👤 Name: ${data.clientName}\n` +
    `📞 Phone: ${data.clientPhone}\n` +
    `📅 Date: ${formatDateForDisplay(data.date)}\n` +
    `⏰ Time Slot: ${data.timeSlot}\n` +
    `✂️ Services: ${data.services}\n` +
    `💰 Total: PKR ${data.totalPrice.toLocaleString()}\n\n` +
    `Looking forward to my visit!`
  );

  waBtn.href = `https://wa.me/923329555522?text=${waMessage}`;
  modal.classList.add('active');
}

function closeReceiptModal() {
  document.getElementById('receiptModal').classList.remove('active');
  // Reset selection
  selectedServices = [];
  selectedSlot = null;
  updateSelectedServicesUI();
  renderServicesGrid('all');
  document.getElementById('bookingForm').reset();
}

// Staff / Admin Booking Portal Setup
function setupStaffModal() {
  const btn = document.getElementById('staffPortalBtn');
  const modal = document.getElementById('staffModal');
  btn.addEventListener('click', () => {
    loadAdminBookings();
    modal.classList.add('active');
  });
}

function closeStaffModal() {
  document.getElementById('staffModal').classList.remove('active');
}

function loadAdminBookings() {
  const tableBody = document.getElementById('adminBookingsTable');
  if (!tableBody) return;

  const bookings = JSON.parse(localStorage.getItem('jugnu_salon_bookings') || '[]');

  if (bookings.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" class="text-center text-muted" style="padding:20px;">No appointments booked yet.</td></tr>`;
    return;
  }

  tableBody.innerHTML = bookings.map(b => `
    <tr>
      <td><strong class="text-gold">${b.id}</strong></td>
      <td>${b.clientName}</td>
      <td>${b.clientPhone}</td>
      <td>${b.date} @ ${b.timeSlot}</td>
      <td>${b.services}</td>
      <td><span style="color:#2ecc71; font-weight:600;">Confirmed</span></td>
      <td>
        <button class="btn btn-sm btn-outline" onclick="deleteBooking('${b.id}')"><i class="fa-solid fa-trash"></i> Delete</button>
      </td>
    </tr>
  `).join('');
}

function deleteBooking(id) {
  let bookings = JSON.parse(localStorage.getItem('jugnu_salon_bookings') || '[]');
  bookings = bookings.filter(b => b.id !== id);
  localStorage.setItem('jugnu_salon_bookings', JSON.stringify(bookings));
  loadAdminBookings();
}

function clearAllBookings() {
  if (confirm('Are you sure you want to clear all salon bookings stored locally?')) {
    localStorage.removeItem('jugnu_salon_bookings');
    loadAdminBookings();
  }
}

// Smooth scroll helper
function scrollToBooking() {
  document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
}
