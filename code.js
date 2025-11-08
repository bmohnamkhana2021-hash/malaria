//auto populate fortnight
const x = document.getElementById('from');
const y = document.getElementById('to');
const fort = document.getElementById('fort');

// Format date to DD/MM/YYYY
function formatDateString(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

function fortnight() {
    const d1 = x.value;
    const d2 = y.value;
    const date1 = new Date(d1);
    const date2 = new Date(d2);

    // Validate both dates
    if (!isNaN(date1.getTime()) && !isNaN(date2.getTime())) {
        const formatDate1 = formatDateString(date1);
        const formatDate2 = formatDateString(date2);
        fort.value = formatDate1 + ' To ' + formatDate2;
    } else {
        fort.value = "";
    }
}

x.addEventListener('input', fortnight);
y.addEventListener('input', fortnight);

//auto calculate total RDT
const a = document.getElementById('activeRDT');
const b = document.getElementById('passiveRDT');
const c = document.getElementById('totalRDT');
function rdt(){
    const active = parseFloat(a.value)||0;
    const passive= parseFloat(b.value)||0;
    c.value = active + passive;
    percentage();
}
a.addEventListener('input',rdt);
b.addEventListener('input',rdt);

//auto calculate total Blood Slide
const BSa = document.getElementById('activeBS');
const BSp = document.getElementById('passiveBS');
const BSt = document.getElementById('totalBS');

function bloodSlide(){
    const activeBS = parseFloat(BSa.value)||0;
    const passiveBS = parseFloat(BSp.value)||0;
    BSt.value = activeBS + passiveBS;
}
BSa.addEventListener('input',bloodSlide);
BSp.addEventListener('input',bloodSlide);

//auto populate Type & Name of Facility - Cascade dropdown
const data = {
      CHC: ['Dwariknagar RH'],
      PHC: ['Narayanpur PHC', 'Maharajganj PHC', 'Freserganj PHC', 'Bagdanga Moushuni PHC'],
      SC:["Amarabati","Bagdanga","Baliara New","Baliara Old","Bijoybati","Bishalaxmipur","Budhakhali","Dakshin Chandanpiri","Dakshin Chandranagar","Dakshin Durgapur","Dakshin Shibrampur","Debnagar","Debnibas","Dwariknagar","Fatikpur","Ganeshnagar East","Ganeshnagar West","Haripur","Iswaripur","Kusumtala","Maharajganj","Moushuni 1st Gheri","Namkhana I","Namkhana II","Nandabhanga","Narayanpur PHC SC","Narayanpur Part","Patibunia","Radhanagar","Rajnagar","Rajnagar Srinathgram I","Rajnagar Srinathgram II","Shibnagar Abad I","Shibnagar Abad II","Shibpur","Uttar Chandanpiri","Uttar Shibrampur"]
    };

   const type =document.getElementById('type');
   const facility=document.getElementById('facility');

   //auto populate facility drop down
Object.keys(data).forEach(function(populateType){
    const g=document.createElement('option');
    g.value=populateType;
    g.textContent=populateType;
    type.appendChild(g);
});
type.addEventListener('change',function(){
    const selectedType=this.value;
    facility.innerHTML='<option value="">--Select Facility--</option>';

if(selectedType && data[selectedType]){
    data[selectedType].forEach(function(populateFacility){
        const h = document.createElement('option');
        h.value = populateFacility;
        h.textContent = populateFacility;
        facility.appendChild(h);
    });
}
});
//calculate percentage of RDT
const totalR=document.getElementById('totalRDT');
const fever = document.getElementById('fever');
const percent = document.getElementById('rdtpercent');

function percentage() {
    const total = parseFloat(totalR.value) || 0;
    const feverCase = parseFloat(fever.value) || 0;
    if(feverCase===0){
        percent.value=0;
    } else{  
    percent.value = ((total / feverCase) * 100).toFixed(1);  
    };
    colorCode();
};

fever.addEventListener('input', percentage);
totalR.addEventListener('input', percentage);

//Color code for RDT Test
function colorCode() {
    let value = Number(percent.value); // convert input to number
    if (value >= 70) {
        percent.style.backgroundColor = "green";
        percent.style.fontWeight="bold";
    } else{
        percent.style.backgroundColor = "lightcoral"; // valid color
        percent.style.fontWeight="bold";
    }
};

// Submit form
   document.getElementById("malaria").addEventListener("submit", async function(event) {
    event.preventDefault();

    
   
    showMessage("⏳ Submitting your report...", "info");

    const formData = new FormData(event.target);
    const url = "https://script.google.com/macros/s/AKfycbx_LrziISyFSwk7S4hnn4ShhaugadUNfHovSxWk0ENd-ugm3VA5IYA2jWNaDRKy3mJT/exec";

    try {
        const response = await fetch(url, {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            showMessage("✅ Submitted successfully!", "success");
            event.target.reset();
        } else {
            throw new Error("Server responded with an error");
        }
    } catch (error) {
        showMessage("❌ Submission failed! Please try again.", "error");
        console.error("Submission error:", error);
    }
});

// ✅ Modern centered message popup with overlay
function showMessage(message, type = "info") {
    // Create overlay
    let overlay = document.createElement("div");
    overlay.className = "popup-overlay";

    // Create message box
    let msgBox = document.createElement("div");
    msgBox.textContent = message;
    msgBox.className = `popup-message ${type}`;

    // Add overlay and message box to body
    overlay.appendChild(msgBox);
    document.body.appendChild(overlay);

    // Fade-in
    setTimeout(() => {
        overlay.classList.add("show");
        msgBox.classList.add("show");
    }, 10);

    // Auto remove after 3s
    setTimeout(() => {
        msgBox.classList.remove("show");
        overlay.classList.remove("show");
        setTimeout(() => overlay.remove(), 500);
    }, 3000);
}
