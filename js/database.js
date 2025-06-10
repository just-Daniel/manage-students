// database.js - Клас для управління базою даних студентів

class StudentDatabase {
  constructor() {
    this.storageKey = 'students_db'
    this.students = this.loadStudents()
    this.nextId = this.getNextId()
    this.observers = []
  }

  // Завантаження студентів з локального сховища
  loadStudents() {
    try {
      const data = localStorage.getItem(this.storageKey)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Помилка завантаження даних:', error)
      return []
    }
  }

  // Збереження студентів в локальне сховище
  saveStudents() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.students))
      this.notifyObservers()
    } catch (error) {
      console.error('Помилка збереження даних:', error)
      throw new Error('Не вдалося зберегти дані')
    }
  }

  // Отримання наступного ID
  getNextId() {
    return this.students.length > 0 ? Math.max(...this.students.map((s) => s.id)) + 1 : 1
  }

  // Паттерн Observer для оповіщення про зміни
  addObserver(callback) {
    this.observers.push(callback)
  }

  removeObserver(callback) {
    this.observers = this.observers.filter((observer) => observer !== callback)
  }

  notifyObservers() {
    this.observers.forEach((callback) => callback(this.students))
  }

  // Валідація даних студента
  validateStudent(studentData) {
    const errors = []

    // Перевірка обов'язкових полів
    if (!studentData.firstName || !studentData.firstName.trim()) {
      errors.push("Ім'я є обов'язковим полем")
    }

    if (!studentData.lastName || !studentData.lastName.trim()) {
      errors.push("Прізвище є обов'язковим полем")
    }

    if (!studentData.group || !studentData.group.trim()) {
      errors.push("Група є обов'язковим полем")
    }

    if (!studentData.course || !studentData.course.toString().trim()) {
      errors.push("Курс є обов'язковим полем")
    }

    if (!studentData.specialty || !studentData.specialty.trim()) {
      errors.push("Спеціальність є обов'язковим полем")
    }

    // Перевірка року народження
    const currentYear = new Date().getFullYear()
    const birthYear = parseInt(studentData.birthYear)
    if (!birthYear || birthYear < 1900 || birthYear > currentYear) {
      errors.push('Некоректний рік народження')
    }

    // Перевірка курсу
    const course = parseInt(studentData.course)
    if (!course || course < 1 || course > 6) {
      errors.push('Курс має бути від 1 до 6')
    }

    // Перевірка довжини полів
    if (studentData.firstName && studentData.firstName.trim().length > 50) {
      errors.push("Ім'я не може бути довшим за 50 символів")
    }

    if (studentData.lastName && studentData.lastName.trim().length > 50) {
      errors.push('Прізвище не може бути довшим за 50 символів')
    }

    if (studentData.group && studentData.group.trim().length > 20) {
      errors.push('Назва групи не може бути довшою за 20 символів')
    }

    if (studentData.specialty && studentData.specialty.trim().length > 100) {
      errors.push('Назва спеціальності не може бути довшою за 100 символів')
    }

    return errors
  }

  // Додавання студента
  addStudent(studentData) {
    const errors = this.validateStudent(studentData)
    if (errors.length > 0) {
      throw new Error(errors.join(', '))
    }

    const student = {
      id: this.nextId++,
      firstName: studentData.firstName.trim(),
      lastName: studentData.lastName.trim(),
      group: studentData.group.trim(),
      birthYear: parseInt(studentData.birthYear),
      course: parseInt(studentData.course),
      specialty: studentData.specialty.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Перевірка на дублікати
    const duplicate = this.students.find(
      (s) => s.firstName.toLowerCase() === student.firstName.toLowerCase() && s.lastName.toLowerCase() === student.lastName.toLowerCase() && s.group.toLowerCase() === student.group.toLowerCase()
    )

    if (duplicate) {
      throw new Error('Студент з такими даними вже існує')
    }

    this.students.push(student)
    this.saveStudents()
    return student
  }

  // Оновлення студента
  updateStudent(id, studentData) {
    const errors = this.validateStudent(studentData)
    if (errors.length > 0) {
      throw new Error(errors.join(', '))
    }

    const index = this.students.findIndex((s) => s.id === id)
    if (index === -1) {
      throw new Error('Студента не знайдено')
    }

    const updatedStudent = {
      ...this.students[index],
      firstName: studentData.firstName.trim(),
      lastName: studentData.lastName.trim(),
      group: studentData.group.trim(),
      birthYear: parseInt(studentData.birthYear),
      course: parseInt(studentData.course),
      specialty: studentData.specialty.trim(),
      updatedAt: new Date().toISOString()
    }

    // Перевірка на дублікати (виключаючи поточного студента)
    const duplicate = this.students.find(
      (s) =>
        s.id !== id &&
        s.firstName.toLowerCase() === updatedStudent.firstName.toLowerCase() &&
        s.lastName.toLowerCase() === updatedStudent.lastName.toLowerCase() &&
        s.group.toLowerCase() === updatedStudent.group.toLowerCase()
    )

    if (duplicate) {
      throw new Error('Студент з такими даними вже існує')
    }

    this.students[index] = updatedStudent
    this.saveStudents()
    return updatedStudent
  }

  // Видалення студента
  deleteStudent(id) {
    const index = this.students.findIndex((s) => s.id === id)
    if (index === -1) {
      throw new Error('Студента не знайдено')
    }

    const deletedStudent = this.students.splice(index, 1)[0]
    this.saveStudents()
    return deletedStudent
  }

  // Отримання студента за ID
  getStudentById(id) {
    return this.students.find((s) => s.id === id)
  }

  // Пошук та фільтрація студентів
  searchStudents(filters = {}) {
    let results = [...this.students]

    // Фільтрація за ім'ям
    if (filters.firstName) {
      const searchFirst = filters.firstName.toLowerCase().trim()
      results = results.filter((student) => student.firstName.toLowerCase().includes(searchFirst))
    }

    // Фільтрація за прізвищем
    if (filters.lastName) {
      const searchLast = filters.lastName.toLowerCase().trim()
      results = results.filter((student) => student.lastName.toLowerCase().includes(searchLast))
    }

    // Фільтрація за групою
    if (filters.group) {
      const searchGroup = filters.group.toLowerCase().trim()
      results = results.filter((student) => student.group.toLowerCase().includes(searchGroup))
    }

    // Фільтрація за курсом
    if (filters.course) {
      const searchCourse = parseInt(filters.course)
      results = results.filter((student) => student.course === searchCourse)
    }

    // Фільтрація за спеціальністю
    if (filters.specialty) {
      const searchSpecialty = filters.specialty.toLowerCase().trim()
      results = results.filter((student) => student.specialty.toLowerCase().includes(searchSpecialty))
    }

    // Фільтрація за віком
    if (filters.ageFrom || filters.ageTo) {
      const currentYear = new Date().getFullYear()
      results = results.filter((student) => {
        const age = currentYear - student.birthYear
        const fromAge = filters.ageFrom ? parseInt(filters.ageFrom) : 0
        const toAge = filters.ageTo ? parseInt(filters.ageTo) : 150
        return age >= fromAge && age <= toAge
      })
    }

    return results
  }

  // Сортування студентів
  sortStudents(students, sortBy = 'lastName', sortOrder = 'asc') {
    const sortedStudents = [...students]

    sortedStudents.sort((a, b) => {
      let valueA, valueB

      switch (sortBy) {
        case 'firstName':
          valueA = a.firstName.toLowerCase()
          valueB = b.firstName.toLowerCase()
          break
        case 'lastName':
          valueA = a.lastName.toLowerCase()
          valueB = b.lastName.toLowerCase()
          break
        case 'group':
          valueA = a.group.toLowerCase()
          valueB = b.group.toLowerCase()
          break
        case 'course':
          valueA = a.course
          valueB = b.course
          break
        case 'specialty':
          valueA = a.specialty.toLowerCase()
          valueB = b.specialty.toLowerCase()
          break
        case 'age':
          const currentYear = new Date().getFullYear()
          valueA = currentYear - a.birthYear
          valueB = currentYear - b.birthYear
          break
        default:
          valueA = a.lastName.toLowerCase()
          valueB = b.lastName.toLowerCase()
      }

      if (valueA < valueB) return sortOrder === 'asc' ? -1 : 1
      if (valueA > valueB) return sortOrder === 'asc' ? 1 : -1
      return 0
    })

    return sortedStudents
  }

  // Отримання всіх студентів
  getAllStudents() {
    return [...this.students]
  }

  // Отримання статистики
  getStatistics() {
    const currentYear = new Date().getFullYear()
    const totalStudents = this.students.length
    const groups = [...new Set(this.students.map((s) => s.group))]
    const averageAge = totalStudents > 0 ? Math.round(this.students.reduce((sum, s) => sum + (currentYear - s.birthYear), 0) / totalStudents) : 0

    return {
      totalStudents,
      totalGroups: groups.length,
      averageAge,
      specialties: [...new Set(this.students.map((s) => s.specialty))],
      courses: [...new Set(this.students.map((s) => s.course))].sort()
    }
  }

  // Експорт даних
  exportData() {
    return {
      students: this.students,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }
  }

  // Імпорт даних
  importData(data) {
    if (!data.students || !Array.isArray(data.students)) {
      throw new Error('Некоректний формат даних')
    }

    // Валідація всіх студентів перед імпортом
    for (const student of data.students) {
      const errors = this.validateStudent(student)
      if (errors.length > 0) {
        throw new Error(`Помилка в даних студента: ${errors.join(', ')}`)
      }
    }

    this.students = data.students.map((s, index) => ({
      ...s,
      id: index + 1
    }))

    this.nextId = this.getNextId()
    this.saveStudents()
  }
}
