<template>
    
        <!-- Mostrar contenido solo si está autenticado -->
        <template v-if="isAuthenticated">
            <div class="header-perfil">
                <h1><i class="fas fa-leaf"></i> Hola, {{ nombreUsuario }}</h1> 
            </div>
            <div class="contenido-perfil">
                <div class="seccion-derecha">
                      <div class="seccion-habitos">
                        <h2>Mis Hábitos</h2>
                        <div class="lista-habitos">
                            <!--segui emerson-->
                        </div>
                    </div> <EstadisticaComponente></EstadisticaComponente>
                      </div>
               
                <div class="seccion-izquierda">
                    <formsPerfilComponente></formsPerfilComponente>
                </div> 
      

              </div>


        </template>

</template>

<script>

import EstadisticaComponente from './estadisticaComponente.vue';
import formsPerfilComponente from './formsPerfilComponente.vue';

export default {
    components: {
    
        formsPerfilComponente, 
        EstadisticaComponente
    },
    data() {
        return {
            isAuthenticated: true, 
            nombreUsuario: 'Usuario Ejemplo',
            user: {

                habitos: [
                  
                ]
            },
           
        };
    },
    mounted() {
        this.checkAuthStatus();
        window.addEventListener('storage', this.checkAuthStatus);
        window.addEventListener('userLoggedIn', this.checkAuthStatus);
    },
    beforeUnmount() {
        window.removeEventListener('storage', this.checkAuthStatus);
        window.removeEventListener('userLoggedIn', this.checkAuthStatus);
    },
    methods: {
        checkAuthStatus() {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');
            
            if (token && user) {
                try {
                    const userData = JSON.parse(user);
                    this.isAuthenticated = true;
                    this.nombreUsuario = userData.usuario || userData.correo || 'Usuario';
                } catch (error) {
                    console.error('Error parsing user data:', error);
                    this.isAuthenticated = false;
                }
            } else {
                this.isAuthenticated = false;
                this.nombreUsuario = '';
            }
        },
        removeHabito(index) {
            this.user.habitos.splice(index, 1);
        },
        redirectToLogin() {
            this.$router.push('/login');
        }
    }
}
</script>

<style scoped>
.caja-perfil {

  background-color: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  font-family: 'Poppins', sans-serif;
  max-width: 600px; /* Ancho máximo controlado */
  width: 95%; /* Se adapta al contenedor pero con límite */
  margin: 0 auto; /* Centrado */
  padding: 25px;
  box-sizing: border-box;



}

.header-perfil {

  color: rgb(113, 185, 85);
  padding: 25px;
  text-align: center;
  font-family: 'Poppins', sans-serif;  
  border-radius: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.header-perfil h1 {
  font-size: 2.2rem;
  margin: 0;
    font-family: 'Poppins', sans-serif;  
}

.contenido-perfil {
  display: grid;
  grid-template-columns: 2fr 1fr;



}

.seccion-izquierda, .seccion-derecha {
  display: flex;
  flex-direction: column;
  gap: 55px;
}


.seccion-habitos {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Poppins', sans-serif;
  display: grid;  
  
}

.seccion-habitos h2 {
  color: #333;
  margin-top: 0;
  margin-bottom: 20px;

  padding-bottom: 10px;
  border-bottom: 2px solid #e0e0e0;
}

.lista-habitos {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-habito {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 15px;
    background-color: #f9f9f9;
}

.item-habito h3 {
    margin: 0 0 10px 0;
    color: #2c3e50;
}

.item-habito p {
    margin: 0 0 10px 0;
    color: #7f8c8d;
}

.item-habito small {
    color: #95a5a6;
    font-size: 0.8rem;
}

.borrar-habito {
    background-color: #e74c3c;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
    margin-left: 10px;
}

.borrar-habito:hover {
    background-color: #c0392b;
}

.sin-habitos {
    text-align: center;
    padding: 20px;
    color: #7f8c8d;
}


.contenido-historial {

  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
}

.no-autenticado {
  text-align: center;
  padding: 50px;
  color: #666;
}

.btn-login {
  background: linear-gradient(to right, #2ecc71, #27ae60);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  margin-top: 20px;
}

.btn-login:hover {
  background: linear-gradient(to right, #27ae60, #219653);
}

@media (max-width: 768px) {
  .contenido-perfil {
    grid-template-columns: 1fr;
  }
  
  .header-perfil h1 {
    font-size: 1.8rem;
  }
}
</style>