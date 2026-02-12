const formArea = document.getElementById("formArea");
const formTitle = document.getElementById("formTitle");
const backToServices = document.getElementById("backToServices");

const forms = {
  funding: document.getElementById("funding"),
  credit: document.getElementById("credit"),
  formation: document.getElementById("formation"),
};

function hideAllForms(){
  Object.values(forms).forEach(f => {
    f.hidden = true;
    // reset thank you
    const ty = f.querySelector(".thankyou");
    if (ty) ty.hidden = true;
    // show fields back
    f.querySelectorAll(".field, .actions").forEach(el => el.hidden = false);
  });
}

function openForm(key){
  hideAllForms();
  formArea.hidden = false;
  forms[key].hidden = false;

  const titles = {
    funding: "BUSINESS FUNDING INTAKE",
    credit: "BUSINESS CREDIT INTAKE",
    formation: "BUSINESS FORMATION INTAKE",
  };
  formTitle.textContent = titles[key] || "Service Intake";
  window.scrollTo({ top: formArea.offsetTop - 10, behavior: "smooth" });
}

document.querySelectorAll("[data-open]").forEach(btn=>{
  btn.addEventListener("click", ()=> openForm(btn.dataset.open));
});

function backToLanding(){
  hideAllForms();
  formArea.hidden = true;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

backToServices.addEventListener("click", backToLanding);
document.querySelectorAll("[data-cancel]").forEach(btn=>{
  btn.addEventListener("click", backToLanding);
});
document.querySelectorAll("[data-return]").forEach(btn=>{
  btn.addEventListener("click", backToLanding);
});

// Submit handler: show THANK YOU INSIDE the same form
Object.values(forms).forEach(form=>{
  form.addEventListener("submit", async (e)=>{
    e.preventDefault();

    // Netlify-friendly submit (still stays on page)
    try{
      const data = new FormData(form);
      await fetch("/", { method:"POST", body: data });
    }catch(err){
      // even if fetch fails, still show thank you
    }

    // hide fields + actions, show thankyou (inside the form)
    form.querySelectorAll(".field, .actions").forEach(el => el.hidden = true);
    const ty = form.querySelector(".thankyou");
    if (ty) ty.hidden = false;

    window.scrollTo({ top: formArea.offsetTop - 10, behavior: "smooth" });
  });
});
