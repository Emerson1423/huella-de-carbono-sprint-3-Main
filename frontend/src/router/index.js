import { createRouter, createWebHistory } from 'vue-router';
import Huella from '../views/Huella.vue';      // Ruta del formulario
import InicioView from '@/views/InicioView.vue';


const routes = [
  { 
    path:'/',
    name:'Inicio',
    component:InicioView,


  },
  {
    path: '/huella',
    name: 'Huella',
    component: Huella,
    meta: { requiresAuth: false } // Explícitamente público
  },
  
  {
    path: '/resultados',
    name: 'resultados',
    component: () => import('../views/historial.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/historial',
    name: 'historial',
    component: () => import('../views/historialview.vue'),
    meta: { requiresAuth: true } // Añadido para proteger historial
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/loginviews.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/registro',
    name: 'registro',
    component: () => import('../views/registro-view.vue'),
    meta: { requiresAuth: false }
  },

{
  path: '/login-google',
  name: 'LoginGoogle',
  component: () => import('../views/login-google.vue'),
},
{
    path: '/recuperar-contra',
    name: 'RecuperarContra',
    component: () => import('../views/recuperar-contra.vue')
  },
  {
    path: '/restablecer-contra',
    name: 'RestablecerContra',
    component: () => import('../views/restablecer-contra.vue')
  },
    {
    path:'/codigo-verificacion', 
    name: 'CodigoVerificacion',
    component: () => import('../views/codigo-verificacion.vue')
  },
  {
    path: '/articulos',
    name: 'articulos',
    component: () => import('../views/articulosView')
  },
  {
    path: '/videos',
    name: 'videos',
    component: () => import('../views/videosView')
  },
  {
    path: '/curiosidades',
    name: 'curiosidades',
    component: () => import('../views/curiosidadesView')
  },
  {
    path: '/noticias',
    name: 'noticias',
    component: () => import('../views/noticiasView')
  },
   {
    path: '/habitos',
    name: 'Habitos',
    component: () => import('../views/HabitoView.vue'),
    meta: { requiresAuth: true }
  },

];

const router = createRouter({
  history: createWebHistory(),
  routes
});


router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const token = localStorage.getItem('token');
    if (!token) {
      next('/login');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;