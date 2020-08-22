import Vue from "vue";
import Vuetify from "vuetify/lib";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        "c-1": "#14ffec",
        "c-2": "#0d7377",
        "c-3": "#323232",
        "c-4": "#212121"
      }
    }
  }
});
