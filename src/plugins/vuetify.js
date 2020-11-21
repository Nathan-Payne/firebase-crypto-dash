import Vue from 'vue'
import Vuetify from 'vuetify/lib'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#14ffec',
        secondary: '#0d7377',
        accent: '#FF9800',
        dark: '#323232',
        darker: '#212121',
      },
    },
  },
})

// chart green: rgba(34, 221, 34, 1)
// chart red: rgba(255, 34, 34, 1)
// chart dark: #181818
