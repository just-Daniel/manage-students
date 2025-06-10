// pagination.js - Система пагінації
class PaginationManager {
  constructor() {
    this.currentPage = 1
    this.itemsPerPage = 20
    this.totalItems = 0
    this.totalPages = 0
  }

  setItemsPerPage(items) {
    this.itemsPerPage = items === 'all' ? 'all' : parseInt(items)
    this.currentPage = 1
  }

  setTotalItems(total) {
    this.totalItems = total
    this.totalPages = this.itemsPerPage === 'all' ? 1 : Math.ceil(total / this.itemsPerPage)

    if (this.currentPage > this.totalPages) {
      this.currentPage = Math.max(1, this.totalPages)
    }
  }

  getCurrentPageItems(items) {
    if (this.itemsPerPage === 'all') {
      return items
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage
    const endIndex = startIndex + this.itemsPerPage
    return items.slice(startIndex, endIndex)
  }

  renderPagination() {
    const container = document.getElementById('pagination')

    if (this.totalPages <= 1) {
      container.innerHTML = ''
      return
    }

    let paginationHtml = '<div class="pagination-controls">'

    // Попередня сторінка
    if (this.currentPage > 1) {
      paginationHtml += `<button class="page-btn" onclick="goToPage(${this.currentPage - 1})">‹ Попередня</button>`
    }

    // Номери сторінок
    const startPage = Math.max(1, this.currentPage - 2)
    const endPage = Math.min(this.totalPages, this.currentPage + 2)

    if (startPage > 1) {
      paginationHtml += `<button class="page-btn" onclick="goToPage(1)">1</button>`
      if (startPage > 2) {
        paginationHtml += '<span class="page-dots">...</span>'
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      const isActive = i === this.currentPage ? 'active' : ''
      paginationHtml += `<button class="page-btn ${isActive}" onclick="goToPage(${i})">${i}</button>`
    }

    if (endPage < this.totalPages) {
      if (endPage < this.totalPages - 1) {
        paginationHtml += '<span class="page-dots">...</span>'
      }
      paginationHtml += `<button class="page-btn" onclick="goToPage(${this.totalPages})">${this.totalPages}</button>`
    }

    // Наступна сторінка
    if (this.currentPage < this.totalPages) {
      paginationHtml += `<button class="page-btn" onclick="goToPage(${this.currentPage + 1})">Наступна ›</button>`
    }

    paginationHtml += '</div>'

    paginationHtml += `
        <div class="pagination-info">
            Сторінка ${this.currentPage} з ${this.totalPages} (всього записів: ${this.totalItems})
        </div>
    `

    container.innerHTML = paginationHtml
  }

  goToPage(page) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page
      return true
    }
    return false
  }
}
