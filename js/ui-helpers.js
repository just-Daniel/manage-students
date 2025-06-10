// ui-helpers.js - Допоміжні функції для інтерфейсу
class UIHelpers {
  static showAlert(message, type = 'info') {
    const alertContainer = document.getElementById('alerts')
    const alertDiv = document.createElement('div')
    alertDiv.className = `alert alert-${type}`
    alertDiv.innerHTML = `
        <span>${message}</span>
        <button class="alert-close" onclick="this.parentElement.remove()">×</button>
    `

    alertContainer.appendChild(alertDiv)

    // Авто-видалення через 5 секунд
    setTimeout(() => {
      if (alertDiv.parentElement) {
        alertDiv.remove()
      }
    }, 5000)
  }

  static formatAge(birthYear) {
    return new Date().getFullYear() - birthYear
  }

  static formatDate(dateString) {
    const date = new Date(dateString)
    return date.toLocaleDateString('uk-UA')
  }

  static createStudentCard(student) {
    const age = this.formatAge(student.birthYear)
    return `
        <div class="student-card" data-id="${student.id}">
            <div class="student-info">
                <div class="student-name">
                    <h3>${student.firstName} ${student.lastName}</h3>
                    <span class="student-age">${age} років</span>
                </div>
                <div class="student-details">
                    <div class="detail-item">
                        <span class="detail-label">Група:</span>
                        <span class="detail-value">${student.group}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Курс:</span>
                        <span class="detail-value">${student.course}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">Спеціальність:</span>
                        <span class="detail-value">${student.specialty}</span>
                    </div>
                </div>
            </div>
            <div class="student-actions">
                <button class="btn btn-edit" onclick="editStudent(${student.id})" title="Редагувати">
                    ✏️
                </button>
                <button class="btn btn-delete" onclick="deleteStudent(${student.id})" title="Видалити">
                    🗑️
                </button>
            </div>
        </div>
    `
  }

  static updateStatistics(stats) {
    document.getElementById('totalStudents').textContent = stats.totalStudents
    document.getElementById('totalGroups').textContent = stats.totalGroups
    document.getElementById('averageAge').textContent = stats.averageAge
  }

  static populateSpecialtyFilter(specialties) {
    const filterSpecialty = document.getElementById('filterSpecialty')
    const currentValue = filterSpecialty.value

    filterSpecialty.innerHTML = '<option value="">Всі спеціальності</option>'

    specialties.forEach((specialty) => {
      const option = document.createElement('option')
      option.value = specialty
      option.textContent = specialty
      if (specialty === currentValue) {
        option.selected = true
      }
      filterSpecialty.appendChild(option)
    })
  }
}
