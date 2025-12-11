import axios from 'axios';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Cargar variables de entorno desde .env.development o .env
// Vite usa .env.development en modo desarrollo
const envDevelopmentPath = path.join(process.cwd(), '.env.development');
const envPath = path.join(process.cwd(), '.env');

if (fs.existsSync(envDevelopmentPath)) {
  dotenv.config({ path: envDevelopmentPath });
} else if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

// Colores para la terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

const log = {
  step: (msg: string) => console.log(`${colors.cyan}→${colors.reset} ${msg}`),
  success: (msg: string) =>
    console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg: string) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  info: (msg: string) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  title: (msg: string) =>
    console.log(`\n${colors.bright}${colors.cyan}${msg}${colors.reset}\n`),
};

interface PetData {
  name: string;
  species: string;
  breed?: string | null;
  birth_date?: string | null;
  weight_kg?: string | null;
  sex?: string | null;
  notes?: string | null;
}

// Datos de mascotas predefinidas para demo
const DEMO_PETS = [
  {
    name: 'Max',
    species: 'perro',
    breed: 'Golden Retriever',
    birth_date: '2020-03-15',
    weight_kg: '28.5',
    sex: 'macho',
    notes: 'Muy juguetón y amigable. Le encanta jugar en el parque.',
  },
  {
    name: 'Luna',
    species: 'gato',
    breed: 'Persa',
    birth_date: '2021-07-22',
    weight_kg: '4.2',
    sex: 'hembra',
    notes: 'Tranquila y cariñosa. Prefiere ambientes calmados.',
  },
  {
    name: 'Rocky',
    species: 'perro',
    breed: 'Bulldog Francés',
    birth_date: '2019-11-08',
    weight_kg: '12.8',
    sex: 'macho',
    notes: 'Energético y leal. Requiere ejercicio diario.',
  },
  {
    name: 'Mia',
    species: 'gato',
    breed: 'Siames',
    birth_date: '2022-01-30',
    weight_kg: '3.5',
    sex: 'hembra',
    notes: 'Muy vocal y activa. Le gusta la atención constante.',
  },
  {
    name: 'Bella',
    species: 'perro',
    breed: 'Labrador',
    birth_date: '2020-09-12',
    weight_kg: '32.0',
    sex: 'hembra',
    notes: 'Excelente con niños. Muy obediente y entrenada.',
  },
];

// Función para hacer login
async function login(
  apiUrl: string,
  email: string,
  password: string,
): Promise<string> {
  try {
    log.step('Iniciando sesión...');
    const response = await axios.post(
      `${apiUrl}/auth/login`,
      {
        email,
        password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const accessToken = response.data.access_token || response.data.accessToken;
    if (!accessToken) {
      throw new Error('No se recibió token de acceso en la respuesta');
    }

    log.success('Login exitoso ✓');
    return accessToken;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        `Error ${error.response.status}: ${JSON.stringify(error.response.data)}`,
      );
    }
    throw error;
  }
}

// Función para crear una mascota
async function createPet(
  apiUrl: string,
  token: string,
  petData: PetData,
): Promise<any> {
  try {
    const response = await axios.post(`${apiUrl}/pets`, petData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        `Error ${error.response.status}: ${JSON.stringify(error.response.data)}`,
      );
    }
    throw error;
  }
}

// Función principal
async function main() {
  log.title('🐾 Crear Nueva Mascota - Demo Day');

  // Obtener configuración desde .env
  const apiUrl = process.env.VITE_API_URL;
  if (!apiUrl) {
    log.error('VITE_API_URL no encontrado en .env');
    log.info('Por favor, agrega VITE_API_URL a tu archivo .env');
    process.exit(1);
  }

  log.step(`Usando API: ${apiUrl}`);

  // Obtener credenciales y hacer login
  const email = process.env.DEMO_EMAIL;
  const password = process.env.DEMO_PASSWORD;

  if (!email || !password) {
    log.error('DEMO_EMAIL y DEMO_PASSWORD no encontrados en .env.development');
    log.info(
      'Por favor, agrega DEMO_EMAIL y DEMO_PASSWORD a tu archivo .env.development',
    );
    process.exit(1);
  }

  log.step(`Email: ${email}`);

  // Hacer login automáticamente
  let token: string;
  try {
    token = await login(apiUrl, email, password);
  } catch (error: any) {
    log.error(`Error al hacer login: ${error.message}`);
    process.exit(1);
  }

  // Crear todas las mascotas de demo automáticamente
  log.title(`🚀 Creando ${DEMO_PETS.length} Mascotas de Demo...`);

  const results = [];
  for (let i = 0; i < DEMO_PETS.length; i++) {
    const petData = DEMO_PETS[i];

    log.title(`📝 Mascota ${i + 1}/${DEMO_PETS.length}: ${petData.name}`);
    log.step(`Nombre: ${petData.name}`);
    log.step(`Especie: ${petData.species}`);
    if (petData.breed) log.step(`Raza: ${petData.breed}`);
    if (petData.birth_date)
      log.step(`Fecha de nacimiento: ${petData.birth_date}`);
    if (petData.weight_kg) log.step(`Peso: ${petData.weight_kg} kg`);
    if (petData.sex) log.step(`Sexo: ${petData.sex}`);

    try {
      const result = await createPet(apiUrl, token, petData);
      log.success(`✓ ${petData.name} creado exitosamente`);
      log.info(`   ID: ${result.id || result.pet_id}`);
      results.push({ ...petData, id: result.id || result.pet_id });

      // Pequeña pausa entre creaciones para evitar rate limiting
      if (i < DEMO_PETS.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } catch (error: any) {
      log.error(`✗ Error al crear ${petData.name}: ${error.message}`);
    }
  }

  // Resumen final
  log.title('✅ Resumen de Mascotas Creadas');
  results.forEach((pet, index) => {
    log.success(`${index + 1}. ${pet.name} (${pet.species}) - ID: ${pet.id}`);
  });

  if (results.length === DEMO_PETS.length) {
    log.success(
      `\n🎉 ¡Todas las ${results.length} mascotas fueron creadas exitosamente!`,
    );
  } else {
    log.info(
      `\n⚠️  Se crearon ${results.length} de ${DEMO_PETS.length} mascotas`,
    );
  }

  process.exit(0);
}

// Ejecutar
main().catch((error) => {
  log.error(`Error inesperado: ${error.message}`);
  process.exit(1);
});
