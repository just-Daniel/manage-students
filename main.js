// main.js - Головний файл додатку
class StudentManagementApp {
  constructor() {
    this.database = new StudentDatabase()
    this.filtersManager = new FiltersManager(this.database)
    this.paginationManager = new PaginationManager()
    this.exportManager = new ExportManager(this.database)

    this.initializeApp()
  }

  initializeApp() {
    // Підписка на зміни в базі даних
    this.database.addObserver(() => {
      this.updateUI()
    })

    // Ініціалізація форми додавання студента
    this.initializeAddForm()

    // Ініціалізація форми редагування
    this.initializeEditForm()

    // Початкове оновлення інтерфейсу
    this.updateUI()

    // Показати перший таб
    this.switchTab('add')
  }

  initializeAddForm() {
    const form = document.getElementById('addStudentForm')
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      this.handleAddStudent()
    })
  }

  initializeEditForm() {
    const form = document.getElementById('editStudentForm')
    form.addEventListener('submit', (e) => {
      e.preventDefault()
      this.handleEditStudent()
    })
  }

  handleAddStudent() {
    try {
      const formData = new FormData(document.getElementById('addStudentForm'))
      const studentData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        group: formData.get('group'),
        birthYear: formData.get('birthYear'),
        course: formData.get('course'),
        specialty: formData.get('specialty')
      }

      this.database.addStudent(studentData)
      document.getElementById('addStudentForm').reset()
      UIHelpers.showAlert('Студента успішно додано!', 'success')
    } catch (error) {
      UIHelpers.showAlert('Помилка: ' + error.message, 'error')
    }
  }

  handleEditStudent() {
    try {
      const id = parseInt(document.getElementById('editId').value)
      const studentData = {
        firstName: document.getElementById('editFirstName').value,
        lastName: document.getElementById('editLastName').value,
        group: document.getElementById('editGroup').value,
        birthYear: document.getElementById('editBirthYear').value,
        course: document.getElementById('editCourse').value,
        specialty: document.getElementById('editSpecialty').value
      }

      this.database.updateStudent(id, studentData)
      this.closeEditModal()
      UIHelpers.showAlert('Дані студента успішно оновлено!', 'success')
    } catch (error) {
      UIHelpers.showAlert('Помилка: ' + error.message, 'error')
    }
  }

  updateUI() {
    const stats = this.database.getStatistics()
    UIHelpers.updateStatistics(stats)
    UIHelpers.populateSpecialtyFilter(stats.specialties)
    this.updateStudentsList()
  }

  updateStudentsList() {
    const students = this.database.getAllStudents()
    const sortedStudents = this.database.sortStudents(students, 'lastName', 'asc')

    this.paginationManager.setTotalItems(students.length)
    const pageStudents = this.paginationManager.getCurrentPageItems(sortedStudents)

    const container = document.getElementById('studentsList')

    if (students.length === 0) {
      container.innerHTML = '<div class="no-results">Немає доданих студентів</div>'
      document.getElementById('pagination').innerHTML = ''
      return
    }

    const studentsHtml = pageStudents.map((student) => UIHelpers.createStudentCard(student)).join('')

    container.innerHTML = `<div class="students-grid">${studentsHtml}</div>`
    this.paginationManager.renderPagination()
  }

  switchTab(tabName, event = null) {
    // Приховати всі таби
    document.querySelectorAll('.tab-content').forEach((tab) => {
      tab.classList.remove('active')
    })

    // Видалити активний клас з кнопок
    document.querySelectorAll('.tab-button').forEach((btn) => {
      btn.classList.remove('active')
    })

    // Показати обраний таб
    document.getElementById(`${tabName}-tab`).classList.add('active')

    // Додати активний клас до кнопки
    // event.target.classList.add('active')
    // if (event && event.target) {
    event?.target.classList.add('active')
    // }

    // Оновити список при переході на таб зі списком
    if (tabName === 'list') {
      this.updateStudentsList()
    }
  }

  editStudent(id) {
    const student = this.database.getStudentById(id)
    if (!student) {
      UIHelpers.showAlert('Студента не знайдено', 'error')
      return
    }

    // Заповнити форму редагування
    document.getElementById('editId').value = student.id
    document.getElementById('editFirstName').value = student.firstName
    document.getElementById('editLastName').value = student.lastName
    document.getElementById('editGroup').value = student.group
    document.getElementById('editBirthYear').value = student.birthYear
    document.getElementById('editCourse').value = student.course
    document.getElementById('editSpecialty').value = student.specialty

    // Показати модальне вікно
    document.getElementById('editModal').style.display = 'flex'
  }

  deleteStudent(id) {
    if (confirm('Ви впевнені, що хочете видалити цього студента?')) {
      try {
        this.database.deleteStudent(id)
        UIHelpers.showAlert('Студента видалено', 'success')
      } catch (error) {
        UIHelpers.showAlert('Помилка: ' + error.message, 'error')
      }
    }
  }

  closeEditModal() {
    document.getElementById('editModal').style.display = 'none'
  }

  updatePagination() {
    const itemsPerPage = document.getElementById('itemsPerPage').value
    this.paginationManager.setItemsPerPage(itemsPerPage)
    this.updateStudentsList()
  }

  goToPage(page) {
    if (this.paginationManager.goToPage(page)) {
      this.updateStudentsList()
    }
  }

  applyFilters() {
    this.filtersManager.applyFilters()
  }

  clearFilters() {
    this.filtersManager.clearFilters()
  }

  exportToJSON() {
    this.exportManager.exportToJSON()
  }

  exportToCSV() {
    this.exportManager.exportToCSV()
  }
}

// Ініціалізація додатку після завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM завантажено, ініціалізація додатку...')
  window.app = new StudentManagementApp()
  console.log('Додаток ініціалізовано')
})

// Глобальні функції для доступу з HTML
function switchTab(tabName) {
  window.app.switchTab(tabName)
}

function editStudent(id) {
  window.app.editStudent(id)
}

function deleteStudent(id) {
  window.app.deleteStudent(id)
}

function closeEditModal() {
  console.log('Закриття модального вікна')
  window.app.closeEditModal()
}

function updatePagination() {
  window.app.updatePagination()
}

function goToPage(page) {
  window.app.goToPage(page)
}

function applyFilters() {
  window.app.applyFilters()
}

function clearFilters() {
  window.app.clearFilters()
}

function exportToJSON() {
  window.app.exportToJSON()
}

function exportToCSV() {
  window.app.exportToCSV()
}

// Закриття модального вікна при кліку поза ним
document.addEventListener('click', (e) => {
  const modal = document.getElementById('editModal')
  if (e.target === modal) {
    window.app.closeEditModal()
  }
})
