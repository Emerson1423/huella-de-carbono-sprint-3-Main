<template>
    <!-- Mostrar contenido solo si está autenticado -->
    <template v-if="isAuthenticated">
        <div class="header-perfil">
            <h1><i class="fas fa-leaf"></i> Hola, {{ nombreUsuario }}</h1> 
        </div>
        
        <div class="contenido-perfil">
            <div class="seccion-derecha">
                <!-- SECCIÓN DE HÁBITOS ACTUALIZADA -->
                <div class="seccion-habitos">
                    <h2>
                        <i class="fas fa-leaf"></i> 
                        Mis Hábitos ({{ habitosUsuario.length }}/{{ maxHabitos }})
                    </h2>
                    
                    <!-- Lista de hábitos cuando hay hábitos -->
                    <div v-if="habitosUsuario.length > 0" class="lista-habitos">
                        <div 
                            v-for="(habito, index) in habitosUsuario" 
                            :key="habito.id"
                            class="item-habito"
                            :style="{ borderLeft: `4px solid ${obtenerColorBadge(index)}` }"
                        >
                            <div class="habito-header">
                                <h3>{{ habito.title }}</h3>
                                <button 
                                    @click="eliminarHabito(index)"
                                    class="btn-eliminar"
                                    title="Eliminar hábito"
                                >
                                    🗑️
                                </button>
                            </div>
                            
                            <p class="habito-descripcion">{{ habito.desc }}</p>
                            
                            <div class="habito-info">
                                <small class="fecha-agregado">
                                    <i class="fas fa-calendar-plus"></i>
                                    Agregado el {{ formatearFecha(habito.fechaAgregado) }}
                                </small>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Mensaje cuando no hay hábitos -->
                    <div v-else class="sin-habitos">
                        <i class="fas fa-seedling fa-2x"></i>
                        <p>Aún no has agregado ningún hábito ecológico.</p>
                        <p>¡Ve a la sección de hábitos para comenzar!</p>
                    </div>
                    
                    <!-- Información del límite -->
                    <div v-if="habitosUsuario.length < maxHabitos" class="info-limite">
                        <small>
                            <i class="fas fa-info-circle"></i>
                            Puedes agregar {{ maxHabitos - habitosUsuario.length }} hábito(s) más
                        </small>
                    </div>
                    
                    <!-- Advertencia cuando se alcanza el límite -->
                    <div v-else class="limite-alcanzado">
                        <small>
                            <i class="fas fa-check-circle"></i>
                            Has alcanzado el límite máximo de hábitos
                        </small>
                    </div>
                </div>
                
                <EstadisticaComponente></EstadisticaComponente>
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
            habitosUsuario: [], // Array para los hábitos del usuario
            maxHabitos: 3 // Límite máximo de hábitos
        };
    },
    
    mounted() {
        this.checkAuthStatus();
        this.cargarHabitos();
        
        // Escuchar eventos
        window.addEventListener('storage', this.checkAuthStatus);
        window.addEventListener('userLoggedIn', this.checkAuthStatus);
        window.addEventListener('habitoAgregado', this.onHabitoAgregado);
    },
    
    beforeUnmount() {
        window.removeEventListener('storage', this.checkAuthStatus);
        window.removeEventListener('userLoggedIn', this.checkAuthStatus);
        window.removeEventListener('habitoAgregado', this.onHabitoAgregado);
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
        
        /**
         * Cargar hábitos del localStorage
         */
        cargarHabitos() {
            const habitos = JSON.parse(localStorage.getItem('userHabitos') || '[]');
            this.habitosUsuario = habitos;
        },

        /**
         * Manejar cuando se agrega un nuevo hábito
         */
        onHabitoAgregado() {
            this.cargarHabitos(); // Recargar la lista
        },

        /**
         * Eliminar un hábito específico
         */
        eliminarHabito(index) {
            if (confirm('¿Estás seguro de que quieres eliminar este hábito?')) {
                this.habitosUsuario.splice(index, 1);
                localStorage.setItem('userHabitos', JSON.stringify(this.habitosUsuario));
                
                // Emitir evento de hábito eliminado
                window.dispatchEvent(new CustomEvent('habitoEliminado'));
            }
        },

        /**
         * Obtener el color del badge según el índice
         */
        obtenerColorBadge(index) {
            const colores = ['#4caf50', '#2196f3', '#ff9800'];
            return colores[index % colores.length];
        },
        
        /**
         * Formatear fecha para mostrar
         */
        formatearFecha(fechaISO) {
            const fecha = new Date(fechaISO);
            return fecha.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short', 
                day: 'numeric'
            });
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
    max-width: 600px;
    width: 95%;
    margin: 0 auto;
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

/* ESTILOS ACTUALIZADOS PARA LA SECCIÓN DE HÁBITOS */
.seccion-habitos {
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    font-family: 'Poppins', sans-serif;
    position: relative;
}

.seccion-habitos h2 {
    color: #333;
    margin-top: 0;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #e0e0e0;
    display: flex;
    align-items: center;
    gap: 8px;
}

.lista-habitos {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.item-habito {
    background: white;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 15px;
    margin-bottom: 12px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: transform 0.2s ease;
}

.item-habito:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.habito-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 10px;
}

.habito-header h3 {
    margin: 0;
    color: #2e7d32;
    font-size: 1.1rem;
    flex: 1;
}

.btn-eliminar {
    background: #f44336;
    color: white;
    border: none;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    font-size: 0.8rem;
}

.btn-eliminar:hover {
    background: #d32f2f;
    transform: scale(1.1);
}

.habito-descripcion {
    color: #666;
    font-size: 0.9rem;
    line-height: 1.4;
    margin: 8px 0;
}

.habito-info {
    margin-top: 12px;
    padding-top: 8px;
    border-top: 1px solid #eee;
}

.fecha-agregado {
    color: #888;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 5px;
}

.sin-habitos {
    text-align: center;
    padding: 30px;
    color: #888;
    background: #f8f9fa;
    border-radius: 8px;
    margin: 15px 0;
}

.sin-habitos i {
    color: #4caf50;
    margin-bottom: 10px;
}

.info-limite {
    background: #e8f5e9;
    padding: 8px 12px;
    border-radius: 6px;
    margin-top: 10px;
    color: #2e7d32;
    text-align: center;
}

.limite-alcanzado {
    background: #fff3cd;
    padding: 8px 12px;
    border-radius: 6px;
    margin-top: 10px;
    color: #856404;
    text-align: center;
}

.info-limite i,
.limite-alcanzado i {
    margin-right: 5px;
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
    
    .item-habito {
        padding: 12px;
    }
    
    .habito-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
    
    .btn-eliminar {
        align-self: flex-end;
    }
}
</style>