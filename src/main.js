import { createApp } from 'vue';
import App from './App.vue';

/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'

/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

/* import specific icons */
import { faFileArrowDown, faPenToSquare ,faCircle} from '@fortawesome/free-solid-svg-icons'

/* add icons to the library */
library.add(faPenToSquare,faFileArrowDown,faCircle)



const app=createApp(App);
app.component('font-awesome-icon', FontAwesomeIcon).mount('#app');


