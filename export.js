// export.js - Функції експорту даних
class ExportManager {
  constructor(database) {
    this.database = database
  }

  exportToJSON() {
    try {
      const data = this.database.exportData()
      const jsonString = JSON.stringify(data, null, 2)
      this.downloadFile(jsonString, 'students_export.json', 'application/json')
      UIHelpers.showAlert('Дані успішно експортовано в JSON', 'success')
    } catch (error) {
      UIHelpers.showAlert('Помилка експорту: ' + error.message, 'error')
    }
  }

  exportToCSV() {
    try {
      const students = this.database.getAllStudents()
      const csvContent = this.convertToCSV(students)
      this.downloadFile(csvContent, 'students_export.csv', 'text/csv')
      UIHelpers.showAlert('Дані успішно експортовано в CSV', 'success')
    } catch (error) {
      UIHelpers.showAlert('Помилка експорту: ' + error.message, 'error')
    }
  }

  convertToCSV(students) {
    const headers = ['ID', "Ім'я", 'Прізвище', 'Група', 'Рік народження', 'Вік', 'Курс', 'Спеціальність', 'Створено', 'Оновлено']
    const currentYear = new Date().getFullYear()

    const csvRows = [headers.join(',')]

    students.forEach((student) => {
      const age = currentYear - student.birthYear
      const row = [
        student.id,
        `"${student.firstName}"`,
        `"${student.lastName}"`,
        `"${student.group}"`,
        student.birthYear,
        age,
        student.course,
        `"${student.specialty}"`,
        `"${UIHelpers.formatDate(student.createdAt)}"`,
        `"${UIHelpers.formatDate(student.updatedAt)}"`
      ]
      csvRows.push(row.join(','))
    })

    return csvRows.join('\n')
  }

  downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}
