const TOTAL_MARK = 150;
const PASS_PERCENT = 40;
const TOTAL_MARK_PERCENT = 100;

const appendChildren = function (parentElement, children) {
  for (let i = 0; i < children.length; i++) {
    parentElement.append(children[i])
  }
}

const addZero = function(number) {
  return number < 10 ? "0" + number : number
}

const showDate = function(dateString) {
  const date = new Date(dateString);

  return `${addZero(date.getDate())}.${addZero(date.getMonth() + 1)}.${date.getFullYear()} ${addZero(date.getHours())}:${addZero(date.getMinutes())}`;
}

const studentTemplate = document.querySelector("#student-template");

const renderStudent = student => {
    const {
      id,
      name: stName,
      lastName,
      mark,
      markedDate
    } = student;

    const studentRow = studentTemplate.content.cloneNode(true);

    const studentId = studentRow.querySelector(".student-id");
    studentId.textContent = id;

    const studentName = studentRow.querySelector(".student-name");
    studentName.textContent = `${stName} ${lastName}`;

    const studentMarkedDate = studentRow.querySelector(".student-marked-date");
    studentMarkedDate.textContent = showDate(markedDate);

    const studentMark = studentRow.querySelector(".student-mark");
    studentMark.textContent = mark;

    const markPercent = Math.round(mark * TOTAL_MARK_PERCENT / TOTAL_MARK);
    studentMark.textContent = markPercent + "%";

    const studentPass = studentRow.querySelector(".student-pass-status");

    if (markPercent >= PASS_PERCENT) {
        studentPass.textContent = "Pass";
        studentPass.classList.add("bg-success")
    } else {
        studentPass.textContent = "Fail";
        studentPass.classList.add("bg-danger");
    }

    const studentDelBtn = studentRow.querySelector(".student-delete");
    studentDelBtn.setAttribute("data-student", id);

    const studentEditBtn = studentRow.querySelector(".student-edit");
    studentEditBtn.setAttribute("data-student", id);

    return studentRow;
}

const studentsTable = document.querySelector("#students-table");
const studentsTableBody = document.querySelector("#students-table-body");
const elCount = document.querySelector(".count");
const avgDisplay = document.querySelector(".text-end");

let showingStudents = students.slice();

const renderStudents = () => {
studentsTableBody.innerHTML = "";

let sum = 0;

showingStudents.forEach(student => {
  sum += student.mark
});
let studentsLength = showingStudents.length;
const avgTotal = Math.floor(Math.round(sum * TOTAL_MARK_PERCENT / TOTAL_MARK / students.length))

if (studentsLength <= 0) {
  avgDisplay.innerHTML = "Average: 0%";
} else {
  avgDisplay.innerHTML = `Average: ${avgTotal}%`;
}

elCount.textContent = `Count: ${showingStudents.length}`;
const studentsFragment = document.createDocumentFragment();
showingStudents.forEach(student => {
    const studentRow = renderStudent(student);
    studentsFragment.append(studentRow);
})
studentsTableBody.appendChild(studentsFragment);
}
renderStudents();

const addForm = document.querySelector("#add-form");
const addStudentModalEl = document.querySelector("#add-student-modal");
const addStudentModal = new bootstrap.Modal(addStudentModalEl);

addForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const elements = evt.target.elements;
  const nameValue = elements.name.value;
  const lastNameValue = elements.lastname.value;
  const markValue = elements.mark.value;

  if (nameValue.trim() && lastNameValue.trim() && markValue >= 0 && markValue <= TOTAL_MARK) {
    const student = {
      id: Math.floor(Math.random() * 1000),
      name: nameValue,
      lastName: lastNameValue,
      mark: markValue,
      markedDate: new Date().toISOString() 
    }
    students.push(student);
    showingStudents.push(student);
    localStorage.setItem("students", JSON.stringify(students));
  }
  addStudentModal.hide();
  window.location.reload();

renderStudents();
})

const nameEdit = document.querySelector("#edit-name");
const lastNameEdit = document.querySelector("#edit-lastname");
const markEdit = document.querySelector("#edit-mark");
studentsTable.addEventListener("click", (evt) => {
  if (evt.target.matches(".btn-outline-danger")) {
    const clickedBtn = +evt.target.dataset.student;

    const clickedBtnId = showingStudents.findIndex(student => {
      return student.id === clickedBtn;
    });
    students.splice(clickedBtnId, 1);
    showingStudents.splice(clickedBtnId, 1);

    localStorage.setItem("students", JSON.stringify(students));
    localStorage.removeItem(localStorage.getItem("students"));

    renderStudents();
  } else if (evt.target.matches(".btn-outline-secondary")) {
    const clickedId = +evt.target.dataset.student;

    const clickedItem = students.find((student) => {
      return student.id === clickedId;
    })
    nameEdit.value = clickedItem.name;
    lastNameEdit.value = clickedItem.lastName;
    markEdit.value = clickedItem.mark;

    editForm.setAttribute("data-editing-id", clickedItem.id);
  }
});
renderStudents();
const editStudentModalEl = document.querySelector("#edit-student-modal");
const editStudentModal = new bootstrap.Modal(editStudentModalEl);

const editForm = document.getElementById("edit-form");

editForm.addEventListener("submit", function (evt) {
  evt.preventDefault();

  const editingId = +evt.target.dataset.editingId;

  const nameValue = nameEdit.value;
  const lastNameValue = lastNameEdit.value;
  const markValue = +markEdit.value;

  if (nameValue.trim() && lastNameValue.trim() && markValue >= 0 && markValue <= TOTAL_MARK) {
    const student = {
      id: editingId,
      name: nameValue,
      lastName: lastNameValue,
      mark: markValue,
      markedDate: new Date().toISOString()
    } 

    const editingItemIndex = students.findIndex(function (student) {
      return student.id === editingId
    })

    const editingShowItemIndex = showingStudents.findIndex(function (student) {
      return student.id === editingId
    })

    students.splice(editingItemIndex, 1, student);
    showingStudents.splice(editingShowItemIndex, 1, student);

    localStorage.setItem("students", JSON.stringify(students));

    editForm.reset();
    editStudentModal.hide();

    renderStudents();
  }
})

const filteredForm = document.querySelector(".filter");

filteredForm.addEventListener("submit", (evt) => {
  evt.preventDefault();

  const elements = evt.target.elements;

  const sortValue = elements.sortby.value;

  const searchValue = elements.search.value;

  const toValue = elements.to.value;

  const fromValue = elements.from.value;
  
  showingStudents = students.sort((a, b) => {
    switch(sortValue) {
      case "1": {
        if (a.name > b.name) {
          return 1;
        } else if (b.name > a.name) {
          return -1;
        } else {
          return 0;
        }
      }
      case "2":
        return b.mark - a.mark;
      case "3":
        return a.mark - b.mark;
      case "4": {
        return new Date(a.markedDate).getTime() - new Date(b.markedDate).getTime();
      }
      default:
        break;
    }
  }).filter((student) => {

      const regularExpression = new RegExp(searchValue, "gi");

      const studentMarkPercent = Math.round(student.mark * TOTAL_MARK_PERCENT / TOTAL_MARK);

      const searchNameLastName = `${student.name} ${student.lastName}`;

      const studentMarkToAndFrom = !toValue ? true : studentMarkPercent <= toValue; 
      
      return studentMarkPercent >= fromValue && studentMarkToAndFrom && searchNameLastName.match(regularExpression);
  })
  renderStudents();
  // Filter ended
})