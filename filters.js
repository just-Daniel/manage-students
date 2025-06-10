// filters.js - Логіка фільтрації та пошуку
class FiltersManager {
  constructor(database) {
    this.database = database
    this.currentFilters = {}
    this.currentSort = { by: 'lastName', order: 'asc' }
  }

  applyFilters() {
    const filters = {
      firstName: document.getElementById('searchFirstName').value,
      lastName: document.getElementById('searchLastName').value,
      group: document.getElementById('searchGroup').value,
      course: document.getElementById('filterCourse').value,
      specialty: document.getElementById('filterSpecialty').value,
      ageFrom: document.getElementById('filterAgeFrom').value,
      ageTo: document.getElementById('filterAgeTo').value
    }

    const sortBy = document.getElementById('sortBy').value
    const sortOrder = document.getElementById('sortOrder').value

    this.currentFilters = filters
    this.currentSort = { by: sortBy, order: sortOrder }

    let results = this.database.searchStudents(filters)
    results = this.database.sortStudents(results, sortBy, sortOrder)

    this.displayResults(results)
  }

  displayResults(students) {
    const container = document.getElementById('searchResults')

    if (students.length === 0) {
      container.innerHTML = '<div class="no-results">Студентів не знайдено</div>'
      return
    }

    const studentsHtml = students.map((student) => UIHelpers.createStudentCard(student)).join('')

    container.innerHTML = `
        <div class="search-results-header">
            <h3>Результати пошуку (${students.length})</h3>
        </div>
        <div class="students-grid">
            ${studentsHtml}
        </div>
    `
  }

  clearFilters() {
    document.getElementById('searchFirstName').value = ''
    document.getElementById('searchLastName').value = ''
    document.getElementById('searchGroup').value = ''
    document.getElementById('filterCourse').value = ''
    document.getElementById('filterSpecialty').value = ''
    document.getElementById('filterAgeFrom').value = ''
    document.getElementById('filterAgeTo').value = ''
    document.getElementById('sortBy').value = 'lastName'
    document.getElementById('sortOrder').value = 'asc'

    document.getElementById('searchResults').innerHTML = ''
    this.currentFilters = {}
    this.currentSort = { by: 'lastName', order: 'asc' }
  }
}
