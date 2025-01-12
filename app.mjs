
class Note {
  constructor(id, title, text) {
    this.id = id;
    this.title = title;
    this.text = text;
  }
}

class App {
  constructor() {
    this.notes = JSON.parse(localStorage.getItem("notes")) || [];
    //console.log(this.notes);
    this.selectedNoteId = "";
    this.miniSidebar = true;

    this.$activeForm = document.querySelector(".active-form");
    this.$inactiveForm = document.querySelector(".inactive-form");
    this.$noteTitle = document.querySelector("#note-title");
    this.$noteText = document.querySelector("#note-text");
    this.$notes = document.querySelector(".notes");
    this.$form = document.querySelector("#form");
    this.$modal = document.querySelector(".modal");
    this.$modalForm = document.querySelector("#modal-form");
    this.$modalText = document.querySelector("#modal-text");
    this.$modalTitle = document.querySelector("#modal-title");
    this.$sidebar = document.querySelector(".sidebar");

    this.addEventListeners(); 
    this.render();

    
    //this.handleToggleSidebar = this.handleToggleSidebar.bind(this);

  }

  addEventListeners() {
    document.body.addEventListener("click", (event) => {
      this.handleFormClick(event); 
      this.closeModal(event);
      this.openModal(event);
      this.handleArchiving(event);
      event.stopPropagation(); 
    });
    // document.querySelectorAll(".archive").forEach((archiveButton) => {
    //   archiveButton.addEventListener("mouseover", this.handleArchiving.bind(this));
    // });

    this.$form.addEventListener("submit", (event) => {
      event.preventDefault();
      const title = this.$noteTitle.value;
      const text = this.$noteText.value;
      this.addNote({ title, text });
      this.closeActiveForm();
    });

    this.$sidebar.addEventListener("mouseover", this.handleToggleSidebar.bind(this));
    this.$sidebar.addEventListener("mouseout", this.handleToggleSidebar.bind(this));

    this.$notes.addEventListener("mouseover", (event) => {
      this.handleArchiving.bind(this);
      if(event.target.classList.contains("note")){
        this.handleMouseOverNote(event.target);
        
      }
      
    });

    this.$notes.addEventListener("mouseout", (event) => {      
      if(event.target.classList.contains("note")){
        this.handleMouseOutNote(event.target);
      }
    } );
  }

  handleFormClick(event) {
    const isActiveFormClickedOn = this.$activeForm.contains(event.target);
    const isInactiveFormClickedOn = this.$inactiveForm.contains(event.target);
    const title = this.$noteTitle.value;
    const text = this.$noteText.value;

    if (isInactiveFormClickedOn) {
      this.openActiveForm();
    } else if (!isInactiveFormClickedOn && !isActiveFormClickedOn) {
      this.addNote({ title, text });
      this.closeActiveForm();
    }
  }

  openActiveForm() {
    this.$inactiveForm.style.display = "none";
    this.$activeForm.style.display = "block";
    this.$noteText.focus();
  }

  closeActiveForm() {
    this.$inactiveForm.style.display = "block";
    this.$activeForm.style.display = "none";
    this.$noteText.value = "";
    this.$noteTitle.value = "";
  }

  openModal(event) {
    const $selectedNote = event.target.closest(".note") 
    if($selectedNote && !event.target.closest(".archive")){
      this.selectedNoteId = $selectedNote.id;
      this.$modalTitle.value = $selectedNote.children[1].innerHTML;
      this.$modalText.value = $selectedNote.children[2].innerHTML;
      this.$modal.classList.add("open-modal");
    }
  

  }
  closeModal(event) {
    const isModalClicked = this.$modalForm.contains(event.target);
    if(!isModalClicked && this.$modal.classList.contains("open-modal")){
      this.editNote(this.selectedNoteId, {title: this.$modalTitle.value, text: this.$modalText.value,});
      this.$modal.classList.remove("open-modal");
      this.$modal.style.display = "none";
    }

  }

  addNote({ title, text }) {
    if (text != "") {
      const newNote = new Note(cuid(), title, text);
      this.notes = [...this.notes, newNote];
      this.render();
    }
  }

  editNote(id, { title, text }) {
    this.notes = this.notes.map((note) => {
      if (note.id == id) {
        note.title = title;
        note.text = text;
      }
      return note;
    });
    this.render();
  }

  handleArchiving(event){
    const $selectedNote = event.target.closest(".note")
    if($selectedNote && event.target.closest(".archive")){
      const selectedNoteId = $selectedNote.id;
      this.deleteNote(selectedNoteId);
      
    }
    // else{ return;}
    // const $selectedNote = event.target.closest(".note"); // Find the clicked note
    // const isArchiveClicked = event.target.closest(".archive"); // Check if archive icon was clicked
  
    // if ($selectedNote && isArchiveClicked) {
    //   const selectedNoteId = $selectedNote.id; // Set the selected note ID
    //   console.log("Archiving Note ID:", selectedNoteId); // Debug log
    //   this.deleteNote(selectedNoteId); // Remove the note
    //   this.render(); // Update the UI
    // }
  
  }

  handleToggleSidebar(){
    const isMouseOver = event.type === "mouseover";
    if(isMouseOver && this.miniSidebar){
      this.$sidebar.style.width = "250px";
      this.$sidebar.querySelector(".active-item").classList.add("sidebar-active-item")
      this.miniSidebar = false;
    }
    else if(!isMouseOver && !this.miniSidebar) {
      this.$sidebar.style.width = "60px";
      this.$sidebar.querySelector(".active-item").classList.remove("sidebar-active-item")
      this.miniSidebar = true;
    }

}

  handleMouseOverNote(element) {
    const $note = document.querySelector("#"+element.id);
    const $checkNote = $note.querySelector(".check-circle");
    const $noteFooter = $note.querySelector(".note-footer");
    $checkNote.style.visibility = "visible";
    $noteFooter.style.visibility = "visible";
  }

  handleMouseOutNote(element) {
    const $note = document.querySelector("#"+element.id);
    const $checkNote = $note.querySelector(".check-circle");
    const $noteFooter = $note.querySelector(".note-footer");
    if ($checkNote && $noteFooter) {
      $checkNote.style.visibility = "hidden";
      $noteFooter.style.visibility = "hidden";
    }
    
  }

// onmouseover="app.handleMouseOverNote(this)" onmouseout="app.handleMouseOutNote(this)

saveNotes() {
  localStorage.setItem("notes", JSON.stringify(this.notes));
}

render() {
  this.saveNotes();
  this.displayNotes();
}

  displayNotes() {
    this.$notes.innerHTML = this.notes
      .map(
        (note) =>
          `
        <div class="note" id="${note.id}">
          <span class="material-symbols-outlined check-circle"
            >check_circle</span
          >
          <div class="title">${note.title}</div>
          <div class="text">${note.text}</div>
          <div class="note-footer">
            <div class="tooltip">
              <span class="material-symbols-outlined hover small-icon"
                >add_alert</span
              >
              <span class="tooltip-text">Remind me</span>
            </div>
            <div class="tooltip">
              <span class="material-symbols-outlined hover small-icon"
                >person_add</span
              >
              <span class="tooltip-text">Collaborator</span>
            </div>
            <div class="tooltip">
              <span class="material-symbols-outlined hover small-icon"
                >palette</span
              >
              <span class="tooltip-text">Change Color</span>
            </div>
            <div class="tooltip">
              <span class="material-symbols-outlined hover small-icon"
                >image</span
              >
              <span class="tooltip-text">Add Image</span>
            </div>
            <div class="tooltip archive">
              <span class="material-symbols-outlined hover small-icon archive"
                >archive</span
              >
              <span class="tooltip-text">Archive</span>
            </div>
            <div class="tooltip">
              <span class="material-symbols-outlined hover small-icon"
                >more_vert</span
              >
              <span class="tooltip-text">More</span>
            </div>
          </div>
        </div>
        `
      )
      .join("");
  }

  deleteNote(id) {
    this.notes = this.notes.filter((note) => note.id !== id);
    this.render();
  }
}

const app = new App();
