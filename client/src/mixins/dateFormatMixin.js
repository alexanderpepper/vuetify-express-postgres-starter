export default {
  methods: {
    formatDate (date) {
      if (!date || date.length < 10) {
        return null
      }
      const [year, month, day] = date.substring(0, 10).split('-')
      return `${month}/${day}/${year}`
    },
    parseDate (date) {
      if (!date) return null
      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
  }
}
