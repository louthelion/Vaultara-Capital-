const landing = document.getElementById("landing");
const formsWrap = document.getElementById("forms");
const thankyou = document.getElementById("thankyou");

const formFunding = document.getElementById("formFunding");
const formCredit = document.getElementById("formCredit");
const formFormation = document.getElementById("formFormation");

function showLanding(){
  landing.classList.remove("hidden");
  formsWrap.classList.add("hidden");
  thankyou.classList.add("hidden");

  formFunding.classList.add("hidden");
  formCredit.classList.add("hidden");
  formFormation.classList.add("hidden");
}

function showForm(which){
  landing.classList.add("hidden");
  thankyou.classList.add("hidden");
  formsWrap.classList.remove("hidden");

  formFunding.classList.toggle("hidden", which !== "funding");
  formCredit.classList.toggle("hidden", which !== "credit");
  formFormation.classList.toggle("hidden", which !== "formation");
}

function showThankYou(){
  landing.classList.add("hidden");
  formsWrap.classList.add("hidden");
  thankyou.classList.remove("hidden");

  // reset forms so next person starts fresh
  formFunding.reset();
  formCredit.reset();
  formFormation.reset();
}

document.querySelectorAll("[data-open]").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    showForm(btn.dataset.open);
  });
});

document.getElementById("backToLanding").addEventListener("click", showLanding);
document.getElementById("backHome").addEventListener("click", showLanding);

document.querySelectorAll("[data-cancel]").forEach(btn=>{
  btn.addEventListener("click", showLanding);
});

// For now: show thank you immediately after submit.
// Later we can connect to Netlify Forms / email routing.
[formFunding, formCredit, formFormation].forEach(form=>{
  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    showThankYou();
  });
});

// start on landing
showLanding();
